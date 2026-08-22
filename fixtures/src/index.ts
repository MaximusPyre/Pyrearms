import { Hono } from "hono";
import { authorize, unauthorizedResponse } from "./auth.ts";
import {
	catalogPayload,
	FIXTURES,
	renderDiscarded,
	renderFixture,
} from "./catalog.ts";
import { dashboardPage, notFoundPage } from "./pages.ts";
import type { Env } from "./env.ts";
import {
	applyFixtureHeaders,
	discardRequestBody,
	htmlResponse,
	jsonResponse,
	ROBOTS_TXT,
	textResponse,
} from "./headers.ts";
import { renderPage } from "./layout.ts";

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function createApp() {
	const app = new Hono<{ Bindings: Env }>();

	app.use("*", async (c, next) => {
		if (MUTATING.has(c.req.method)) {
			await discardRequestBody(c.req.raw);
		}

		const path = new URL(c.req.url).pathname;
		if (path === "/robots.txt" && (c.req.method === "GET" || c.req.method === "HEAD")) {
			return textResponse(ROBOTS_TXT);
		}

		if (!authorize(c.req.raw, c.env)) {
			const denied = unauthorizedResponse(c.env);
			applyFixtureHeaders(denied.headers);
			return denied;
		}

		if (MUTATING.has(c.req.method)) {
			return htmlResponse(renderDiscarded());
		}

		await next();
	});

	app.get("/", (c) => {
		const hostname = c.env.FIXTURES_HOSTNAME || new URL(c.req.url).host;
		const rows = FIXTURES.map((fixture) => ({
			path: fixture.path,
			title: fixture.title,
			summary: fixture.summary,
			signals: fixture.signals,
		}));
		return htmlResponse(
			renderPage({
				title: "Classification fixture catalog",
				fixtureId: "catalog",
				bodyClass: "page-catalog",
				body: dashboardPage(hostname, rows),
			}),
		);
	});

	app.get("/catalog.json", (c) => {
		const hostname = c.env.FIXTURES_HOSTNAME || new URL(c.req.url).host;
		return jsonResponse(catalogPayload(hostname));
	});

	app.get("/discarded", () => htmlResponse(renderDiscarded()));

	for (const fixture of FIXTURES) {
		app.get(fixture.path, () => htmlResponse(renderFixture(fixture)));
	}

	app.get("/assets/*", async (c) => {
		const asset = await c.env.ASSETS.fetch(c.req.raw);
		const headers = applyFixtureHeaders(new Headers(asset.headers));
		return new Response(asset.body, { status: asset.status, headers });
	});

	app.notFound((c) => {
		if (c.req.path.startsWith("/assets/")) {
			return textResponse("Not found\n", 404);
		}
		return htmlResponse(
			renderPage({
				title: "No fixture — Harborline Fixture Lab",
				fixtureId: "not-found",
				bodyClass: "page-missing",
				body: notFoundPage(),
			}),
			404,
		);
	});

	return app;
}

export const app = createApp();
export default app;
