/**
 * CLEARNET HARD RULE
 * ------------------
 * This Worker is a **peer phonebook only**.
 * It MUST NEVER accept, store, relay, distribute, or echo:
 *   - chat / board / DM messages
 *   - file or project bytes
 *   - thumbnails, manifests, or catalogs
 *   - room invites or E2E keys
 *
 * Allowed durable state: admin session tokens + a list of iroh endpoint IDs
 * (and a short label) so PyreLink can optionally bootstrap connections.
 * All content stays on peer devices / P2P.
 */
import { Hono } from "hono";
import { cors } from "hono/cors";
import {
	clearCookieHeader,
	cookieHeader,
	createSessionToken,
	requireAdmin,
	verifyAdminPassword,
} from "./lib/auth.js";

type Bindings = Env;

const app = new Hono<{ Bindings: Bindings }>();

/** Explicit denial for anyone trying to treat clearnet as a content API. */
const CONTENT_FORBIDDEN = {
	error: "clearnet_phonebook_only",
	detail:
		"This API never stores or relays messages, files, or room content. Use PyreLink P2P.",
} as const;

app.use(
	"/api/*",
	cors({ origin: (origin) => origin || "*", credentials: true }),
);

function parseOraclesJson(raw: string | null | undefined): string[] {
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as unknown;
		if (!Array.isArray(parsed)) return [];
		return [
			...new Set(
				parsed
					.filter((v): v is string => typeof v === "string")
					.map((s) => s.trim())
					.filter(Boolean),
			),
		];
	} catch {
		return [];
	}
}

function normalizeOracleList(input: unknown): string[] {
	if (Array.isArray(input)) {
		return [
			...new Set(
				input
					.filter((v): v is string => typeof v === "string")
					.map((s) => s.trim())
					.filter(Boolean),
			),
		];
	}
	if (typeof input === "string") {
		return [
			...new Set(
				input
					.split(/[\s,]+/)
					.map((s) => s.trim())
					.filter(Boolean),
			),
		];
	}
	return [];
}

/** Endpoint IDs only — reject anything that looks like payload embedding. */
function sanitizeEndpointId(raw: string): string | null {
	const s = raw.trim();
	// iroh EndpointId is hex-ish / z32-ish public key material; keep conservative.
	if (s.length < 32 || s.length > 128) return null;
	if (!/^[a-zA-Z0-9._~-]+$/.test(s)) return null;
	if (s.includes("pyrelink:") || s.includes("{") || s.includes("base64")) {
		return null;
	}
	return s;
}

async function loadOracles(
	env: Env,
): Promise<{ oracles: string[]; label: string }> {
	const envList = normalizeOracleList(env.CONNECT_ORACLE_ID || "")
		.map(sanitizeEndpointId)
		.filter((v): v is string => Boolean(v));
	const row = await env.DB.prepare(
		"SELECT oracle_id, oracles_json, label FROM connect_config WHERE id = 1",
	).first<{ oracle_id: string; oracles_json: string; label: string }>();

	const fromDb = [
		...parseOraclesJson(row?.oracles_json),
		...(row?.oracle_id?.trim() ? [row.oracle_id.trim()] : []),
	]
		.map(sanitizeEndpointId)
		.filter((v): v is string => Boolean(v));

	const oracles = [...new Set([...envList, ...fromDb])];
	return { oracles, label: row?.label || "community" };
}

app.get("/api/health", (c) =>
	c.json({
		ok: true,
		name: c.env.PUBLIC_APP_NAME || "PyreArms",
		role: "phonebook",
	}),
);

/**
 * Bootstrap for PyreLink — endpoint IDs only.
 * NEVER returns catalogs, files, messages, invites, or keys.
 */
app.get("/api/connect", async (c) => {
	const { oracles, label } = await loadOracles(c.env);
	return c.json({
		service: "pyrelink",
		v: 2,
		role: "phonebook",
		policy: "endpoint_ids_only",
		oracle: oracles[0] || "",
		oracles,
		label,
	});
});

/** Refuse content uploads masquerading as connect. */
app.post("/api/connect", (c) => c.json(CONTENT_FORBIDDEN, 405));
app.put("/api/connect", (c) => c.json(CONTENT_FORBIDDEN, 405));

/** Hard deny any legacy/content-shaped routes that must never exist here. */
for (const path of [
	"/api/messages",
	"/api/message",
	"/api/chat",
	"/api/rooms",
	"/api/files",
	"/api/upload",
	"/api/download",
	"/api/catalog",
	"/api/projects",
	"/api/share",
]) {
	app.all(path, (c) => c.json(CONTENT_FORBIDDEN, 404));
	app.all(`${path}/*`, (c) => c.json(CONTENT_FORBIDDEN, 404));
}

app.post("/api/admin/login", async (c) => {
	const { password } = await c.req.json<{ password?: string }>();
	if (!password || !verifyAdminPassword(c.env, password)) {
		return c.json({ error: "Invalid credentials" }, 401);
	}
	const secret = c.env.SESSION_SECRET || c.env.ADMIN_PASSWORD;
	const { token, expiresAt } = await createSessionToken(secret);
	await c.env.DB.prepare(
		"INSERT INTO sessions (token, expires_at) VALUES (?, ?)",
	)
		.bind(token, expiresAt)
		.run();
	c.header("Set-Cookie", cookieHeader(token, 60 * 60 * 12));
	return c.json({ ok: true });
});

app.post("/api/admin/logout", async (c) => {
	const token = c.req.header("Cookie")?.match(/pyre_admin=([^;]+)/)?.[1];
	if (token) {
		await c.env.DB.prepare("DELETE FROM sessions WHERE token = ?")
			.bind(decodeURIComponent(token))
			.run();
	}
	c.header("Set-Cookie", clearCookieHeader());
	return c.json({ ok: true });
});

app.get("/api/admin/session", async (c) => {
	const denied = await requireAdmin(c.req.raw, c.env);
	if (denied) return denied;
	return c.json({ ok: true });
});

app.get("/api/admin/connect", async (c) => {
	const denied = await requireAdmin(c.req.raw, c.env);
	if (denied) return denied;
	const { oracles, label } = await loadOracles(c.env);
	const row = await c.env.DB.prepare(
		"SELECT updated_at FROM connect_config WHERE id = 1",
	).first<{ updated_at: string }>();
	return c.json({
		oracle: oracles[0] || "",
		oracles,
		label,
		updated_at: row?.updated_at ?? null,
		env_override: Boolean((c.env.CONNECT_ORACLE_ID || "").trim()),
		policy: "endpoint_ids_only",
	});
});

app.post("/api/admin/connect", async (c) => {
	const denied = await requireAdmin(c.req.raw, c.env);
	if (denied) return denied;
	const body = await c.req.json<{
		oracle?: string;
		oracles?: string[] | string;
		label?: string;
		/** Rejected if present — clearnet never accepts content. */
		messages?: unknown;
		files?: unknown;
		payload?: unknown;
	}>();

	if (
		body.messages !== undefined ||
		body.files !== undefined ||
		body.payload !== undefined
	) {
		return c.json(CONTENT_FORBIDDEN, 400);
	}

	let oracles = normalizeOracleList(body.oracles)
		.map(sanitizeEndpointId)
		.filter((v): v is string => Boolean(v));
	if (!oracles.length && body.oracle) {
		oracles = normalizeOracleList(body.oracle)
			.map(sanitizeEndpointId)
			.filter((v): v is string => Boolean(v));
	}
	const label = (body.label || "community").trim().slice(0, 64) || "community";
	const primary = oracles[0] || "";

	await c.env.DB.prepare(
		`INSERT INTO connect_config (id, oracle_id, oracles_json, label, updated_at)
     VALUES (1, ?, ?, ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
       oracle_id = excluded.oracle_id,
       oracles_json = excluded.oracles_json,
       label = excluded.label,
       updated_at = datetime('now')`,
	)
		.bind(primary, JSON.stringify(oracles), label)
		.run();

	return c.json({ ok: true, oracle: primary, oracles, label });
});

app.notFound((c) => {
	if (c.req.path.startsWith("/api/")) {
		return c.json(CONTENT_FORBIDDEN, 404);
	}
	return c.body(null, 404);
});

export default app;
