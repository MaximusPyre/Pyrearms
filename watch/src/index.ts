/**
 * Personal clip host for Maximus Pyre (watch.pyrearms.dev).
 * Separate from the PyreArms phonebook Worker — no PyreLink content here.
 */
import { Hono } from "hono";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { Env } from "./env.js";
import {
	classifyBrowser,
	classifyCountry,
	classifyDevice,
	classifyLanguage,
	classifyOs,
	classifyReferrer,
	clientBrands,
	bump,
} from "./classify.js";
import {
	loginPage,
	notFoundPage,
	playerPage,
	uploadPage,
	clipsPage,
	hubStatsPage,
} from "./html.js";

const COOKIE = "pyre_watch";
const MAX_BYTES = 95 * 1024 * 1024;
const ALLOWED = new Set([
	"video/mp4",
	"video/webm",
	"video/quicktime",
	"video/x-m4v",
]);

const app = new Hono<{ Bindings: Env }>();

function timingSafeEqual(a: string, b: string): boolean {
	const enc = new TextEncoder();
	const aa = enc.encode(a);
	const bb = enc.encode(b);
	if (aa.byteLength !== bb.byteLength) {
		crypto.subtle.timingSafeEqual(aa, aa);
		return false;
	}
	return crypto.subtle.timingSafeEqual(aa, bb);
}

async function hmacHex(secret: string, data: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
	return [...new Uint8Array(sig)]
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

async function makeSession(secret: string): Promise<string> {
	const exp = String(Date.now() + 1000 * 60 * 60 * 24 * 14);
	const sig = await hmacHex(secret, exp);
	return `${exp}.${sig}`;
}

async function validSession(secret: string, token: string | undefined): Promise<boolean> {
	if (!token || !secret) return false;
	const dot = token.indexOf(".");
	if (dot < 1) return false;
	const exp = token.slice(0, dot);
	const sig = token.slice(dot + 1);
	if (Number(exp) < Date.now()) return false;
	const expect = await hmacHex(secret, exp);
	return timingSafeEqual(sig, expect);
}

function originOf(c: { req: { url: string } }): string {
	return new URL(c.req.url).origin;
}

function html(body: string, status = 200): Response {
	return new Response(body, {
		status,
		headers: { "content-type": "text/html; charset=utf-8" },
	});
}

async function requireSession(c: Context<{ Bindings: Env }>): Promise<boolean> {
	const token = getCookie(c, COOKIE);
	return validSession(c.env.SESSION_SECRET, token);
}

const INDEX_KEY = "_index.json";
const HUB_STATS_KEY = "_hub_stats.json";

type ClipRow = { id: string; title: string; created: string };

async function readIndex(env: Env): Promise<ClipRow[]> {
	const obj = await env.VIDEOS.get(INDEX_KEY);
	if (!obj) return [];
	try {
		const parsed = JSON.parse(await obj.text()) as { clips?: ClipRow[] };
		return Array.isArray(parsed.clips) ? parsed.clips : [];
	} catch {
		return [];
	}
}

async function writeIndex(env: Env, clips: ClipRow[]): Promise<void> {
	await env.VIDEOS.put(INDEX_KEY, JSON.stringify({ clips }), {
		httpMetadata: { contentType: "application/json" },
	});
}

async function listClips(env: Env): Promise<{ id: string; title: string }[]> {
	const fromIndex = await readIndex(env);
	if (fromIndex.length) {
		return fromIndex.map(({ id, title }) => ({ id, title }));
	}
	const listed = await env.VIDEOS.list({
		limit: 100,
		include: ["customMetadata"],
	});
	const rows = listed.objects
		.filter((o) => o.key !== INDEX_KEY && o.key !== HUB_STATS_KEY)
		.map((o) => ({
			id: o.key,
			title: o.customMetadata?.title || o.key,
			uploaded: o.uploaded,
		}));
	rows.sort((a, b) => +b.uploaded - +a.uploaded);
	return rows.map(({ id, title }) => ({ id, title }));
}

type HubRecent = {
	t: string;
	kind: "view" | "click";
	link: string;
	browser: string;
	os: string;
	device: string;
	country: string;
	referrer: string;
	language: string;
};

type HubStats = {
	views: number;
	clicks: Record<string, number>;
	browsers: Record<string, number>;
	os: Record<string, number>;
	devices: Record<string, number>;
	countries: Record<string, number>;
	referrers: Record<string, number>;
	languages: Record<string, number>;
	recent: HubRecent[];
};

const emptyCounts = (): Record<string, number> => ({});

function asCountMap(value: unknown): Record<string, number> {
	if (!value || typeof value !== "object") return emptyCounts();
	const out: Record<string, number> = {};
	for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
		const n = Number(v);
		if (k && Number.isFinite(n) && n > 0) out[k] = Math.floor(n);
	}
	return out;
}

const HUB_LINK_LABELS: Record<string, string> = {
	x: "X",
	pyrearms: "PyreArms",
	sparks: "Sparks",
	onlyfans: "OnlyFans",
	snapchat: "Snapchat",
};

function emptyHubStats(): HubStats {
	return {
		views: 0,
		clicks: emptyCounts(),
		browsers: emptyCounts(),
		os: emptyCounts(),
		devices: emptyCounts(),
		countries: emptyCounts(),
		referrers: emptyCounts(),
		languages: emptyCounts(),
		recent: [],
	};
}

function asRecent(value: unknown): HubRecent[] {
	if (!Array.isArray(value)) return [];
	const out: HubRecent[] = [];
	for (const row of value) {
		if (!row || typeof row !== "object") continue;
		const r = row as Record<string, unknown>;
		const kind = r.kind === "click" ? "click" : r.kind === "view" ? "view" : "";
		if (!kind) continue;
		out.push({
			t: typeof r.t === "string" ? r.t : "",
			kind,
			link: typeof r.link === "string" ? r.link : "",
			browser: typeof r.browser === "string" ? r.browser : "Other",
			os: typeof r.os === "string" ? r.os : "Other",
			device: typeof r.device === "string" ? r.device : "Other",
			country: typeof r.country === "string" ? r.country : "",
			referrer: typeof r.referrer === "string" ? r.referrer : "Direct",
			language: typeof r.language === "string" ? r.language : "",
		});
	}
	return out.slice(0, 40);
}

async function readHubStats(env: Env): Promise<HubStats> {
	const obj = await env.VIDEOS.get(HUB_STATS_KEY);
	if (!obj) return emptyHubStats();
	try {
		const parsed = JSON.parse(await obj.text()) as Partial<HubStats>;
		return {
			views: Number(parsed.views) || 0,
			clicks: asCountMap(parsed.clicks),
			browsers: asCountMap(parsed.browsers),
			os: asCountMap(parsed.os),
			devices: asCountMap(parsed.devices),
			countries: asCountMap(parsed.countries),
			referrers: asCountMap(parsed.referrers),
			languages: asCountMap(parsed.languages),
			recent: asRecent(parsed.recent),
		};
	} catch {
		return emptyHubStats();
	}
}

async function writeHubStats(env: Env, stats: HubStats): Promise<void> {
	await env.VIDEOS.put(HUB_STATS_KEY, JSON.stringify(stats), {
		httpMetadata: { contentType: "application/json" },
	});
}

function hubCors(): HeadersInit {
	return {
		"access-control-allow-origin": "https://max.pyrearms.dev",
		"access-control-allow-methods": "POST, OPTIONS",
		"access-control-allow-headers": "content-type",
	};
}

app.get("/", (c) => c.redirect("/clips"));

app.get("/upload", async (c) => {
	if (!(await requireSession(c))) return html(loginPage());
	const clips = await listClips(c.env);
	return html(uploadPage(originOf(c), clips));
});

app.get("/clips", async (c) => {
	if (!(await requireSession(c))) return html(loginPage());
	const clips = await listClips(c.env);
	return html(clipsPage(originOf(c), clips));
});

app.get("/hub-stats", async (c) => {
	if (!(await requireSession(c))) return html(loginPage());
	const stats = await readHubStats(c.env);
	return html(hubStatsPage(stats, HUB_LINK_LABELS));
});

app.options("/hub-event", () => new Response(null, { status: 204, headers: hubCors() }));

type HubPayload = {
	kind?: string;
	link?: string;
	ua?: string;
	language?: string;
	languages?: unknown;
	platform?: string;
	mobile?: unknown;
	brands?: unknown;
	referrer?: string;
};

function parseHubPayload(raw: string): HubPayload {
	if (raw.startsWith("{")) {
		try {
			const parsed = JSON.parse(raw) as HubPayload;
			return parsed && typeof parsed === "object" ? parsed : {};
		} catch {
			return {};
		}
	}
	const [kind, link] = raw.split(":");
	return { kind, link };
}

function hubAllowed(c: Context<{ Bindings: Env }>): boolean {
	const origin = c.req.header("origin") || "";
	const referer = c.req.header("referer") || "";
	return origin === "https://max.pyrearms.dev" || referer.startsWith("https://max.pyrearms.dev/");
}

function readCfCountry(c: Context<{ Bindings: Env }>): string {
	const header = c.req.header("cf-ipcountry") || "";
	const cf = (c.req.raw as Request & { cf?: { country?: string } }).cf;
	return classifyCountry(cf?.country || header);
}

app.post("/hub-event", async (c) => {
	if (!hubAllowed(c)) {
		return new Response("ok", { headers: hubCors() });
	}
	const raw = (await c.req.text()).trim();
	if (!raw || raw.length > 4096) {
		return new Response("ok", { headers: hubCors() });
	}
	const payload = parseHubPayload(raw);
	const kind = payload.kind === "click" ? "click" : payload.kind === "view" ? "view" : "";
	if (!kind) return new Response("ok", { headers: hubCors() });

	const link =
		typeof payload.link === "string" &&
		(payload.link in HUB_LINK_LABELS || /^[a-z0-9_-]{1,40}$/i.test(payload.link))
			? payload.link
			: "";

	const headerUa = c.req.header("user-agent") || "";
	const ua = typeof payload.ua === "string" && payload.ua.length < 512 ? payload.ua : headerUa;
	const brands = clientBrands(payload.brands);
	const platform = typeof payload.platform === "string" ? payload.platform : "";
	const mobile = typeof payload.mobile === "boolean" ? payload.mobile : undefined;
	const browser = classifyBrowser(ua, brands);
	const os = classifyOs(ua, platform);
	const device = classifyDevice(ua, mobile);
	const country = readCfCountry(c);
	const referrer = classifyReferrer(typeof payload.referrer === "string" ? payload.referrer : "");
	const language = classifyLanguage(
		typeof payload.language === "string" && payload.language
			? payload.language
			: Array.isArray(payload.languages) && typeof payload.languages[0] === "string"
				? payload.languages[0]
				: c.req.header("accept-language") || "",
	);

	const stats = await readHubStats(c.env);
	if (kind === "view") {
		stats.views += 1;
		bump(stats.browsers, browser);
		bump(stats.os, os);
		bump(stats.devices, device);
		if (country) bump(stats.countries, country);
		bump(stats.referrers, referrer);
		if (language) bump(stats.languages, language);
	} else if (link) {
		stats.clicks[link] = (stats.clicks[link] || 0) + 1;
	}

	stats.recent = [
		{
			t: new Date().toISOString(),
			kind,
			link: kind === "click" ? link : "",
			browser,
			os,
			device,
			country,
			referrer,
			language,
		},
		...stats.recent,
	].slice(0, 40);

	await writeHubStats(c.env, stats);
	return new Response("ok", { headers: hubCors() });
});

app.post("/login", async (c) => {
	const form = await c.req.parseBody();
	const password = typeof form.password === "string" ? form.password : "";
	if (!c.env.WATCH_PASSWORD || !timingSafeEqual(password, c.env.WATCH_PASSWORD)) {
		return html(loginPage("Wrong password."), 401);
	}
	const token = await makeSession(c.env.SESSION_SECRET);
	setCookie(c, COOKIE, token, {
		httpOnly: true,
		secure: true,
		sameSite: "Lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 14,
	});
	return c.redirect("/clips");
});

app.post("/logout", (c) => {
	deleteCookie(c, COOKIE, { path: "/" });
	return c.redirect("/clips");
});

app.post("/upload", async (c) => {
	if (!(await requireSession(c))) return html(loginPage("Sign in first."), 401);
	const form = await c.req.parseBody({ all: true });
	const file = form.file;
	if (!(file instanceof File) || file.size < 1) {
		return html(loginPage("Pick a video file."), 400);
	}
	if (file.size > MAX_BYTES) {
		const clips = await listClips(c.env);
		return html(
			uploadPage(originOf(c), clips, "That file is too large (keep it under ~90 MB)."),
			413,
		);
	}
	const type = file.type || "video/mp4";
	if (!ALLOWED.has(type) && !file.name.match(/\.(mp4|webm|mov|m4v)$/i)) {
		const clips = await listClips(c.env);
		return html(uploadPage(originOf(c), clips, "Use MP4, WebM, or MOV."), 415);
	}
	const id = crypto.randomUUID();
	const title =
		(typeof form.title === "string" && form.title.trim()) ||
		file.name.replace(/\.[^.]+$/, "") ||
		"Clip";
	await c.env.VIDEOS.put(id, file.stream(), {
		httpMetadata: { contentType: type },
		customMetadata: { title },
	});
	const seeded = await listClips(c.env);
	const index = await readIndex(c.env);
	const base = index.length ? index : seeded.map((c) => ({
		id: c.id,
		title: c.title,
		created: new Date().toISOString(),
	}));
	const next = [{ id, title, created: new Date().toISOString() }, ...base.filter((c) => c.id !== id)];
	await writeIndex(c.env, next);
	return c.redirect(`/v/${id}`);
});

app.get("/v/:id", async (c) => {
	const id = c.req.param("id");
	const obj = await c.env.VIDEOS.head(id);
	if (!obj) return html(notFoundPage(), 404);
	const title = obj.customMetadata?.title || "Clip";
	return html(playerPage(id, title, originOf(c)));
});

app.get("/file/:id", async (c) => {
	const id = c.req.param("id");
	const head = await c.env.VIDEOS.head(id);
	if (!head) return c.notFound();
	const size = head.size;
	const rangeHeader = c.req.header("Range");
	const type = head.httpMetadata?.contentType || "video/mp4";
	if (rangeHeader?.startsWith("bytes=")) {
		const spec = rangeHeader.slice(6).split("-");
		const start = Number(spec[0] || 0);
		const end = spec[1] ? Number(spec[1]) : size - 1;
		if (Number.isFinite(start) && start < size) {
			const stop = Math.min(Number.isFinite(end) ? end : size - 1, size - 1);
			const length = stop - start + 1;
			const part = await c.env.VIDEOS.get(id, {
				range: { offset: start, length },
			});
			if (!part) return c.notFound();
			return new Response(part.body, {
				status: 206,
				headers: {
					"content-type": type,
					"content-range": `bytes ${start}-${stop}/${size}`,
					"accept-ranges": "bytes",
					"content-length": String(length),
					"cache-control": "public, max-age=3600",
				},
			});
		}
	}
	const full = await c.env.VIDEOS.get(id);
	if (!full) return c.notFound();
	return new Response(full.body, {
		headers: {
			"content-type": type,
			"accept-ranges": "bytes",
			"content-length": String(size),
			"cache-control": "public, max-age=3600",
		},
	});
});

export default app;
