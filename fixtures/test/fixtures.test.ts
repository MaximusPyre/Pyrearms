import assert from "node:assert/strict";
import test from "node:test";
import { authorize, unauthorizedResponse } from "../src/auth.ts";
import { catalogPayload, FIXTURES, renderDiscarded, renderFixture } from "../src/catalog.ts";
import { ROBOTS_TAG, ROBOTS_TXT } from "../src/headers.ts";
import { app } from "../src/index.ts";
import type { Env } from "../src/env.ts";

const REQUIRED_PATHS = [
	"/login",
	"/account-verification",
	"/session-expired",
	"/payment-update",
	"/urgent-action",
];

function testEnv(overrides: Partial<Env> = {}): Env {
	return {
		FIXTURES_HOSTNAME: "test-fixtures.pyrearms.dev",
		FIXTURES_BASIC_USER: "fixtures",
		FIXTURES_AUTH_MODE: "on",
		FIXTURES_ALLOW_QUERY_TOKEN: "false",
		FIXTURES_BASIC_PASSWORD: "secret",
		FIXTURES_ACCESS_TOKEN: "tok_123",
		ASSETS: {
			fetch(input) {
				const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
				if (url.pathname.endsWith(".css")) {
					return new Response("body{color:#000}", {
						headers: { "content-type": "text/css" },
					});
				}
				if (url.pathname.endsWith(".js")) {
					return new Response("void 0;", {
						headers: { "content-type": "text/javascript" },
					});
				}
				return new Response("missing", { status: 404 });
			},
		},
		...overrides,
	};
}

function basic(user: string, password: string): string {
	return "Basic " + Buffer.from(`${user}:${password}`).toString("base64");
}

async function get(
	path: string,
	init: RequestInit = {},
	env: Env = testEnv(),
): Promise<Response> {
	return app.request(path, init, env);
}

test("robots.txt is public, disallows all crawling, and sends X-Robots-Tag", async () => {
	const res = await get("/robots.txt");
	assert.equal(res.status, 200);
	assert.equal(res.headers.get("X-Robots-Tag"), ROBOTS_TAG);
	const body = await res.text();
	assert.match(body, /User-agent: \*/);
	assert.match(body, /Disallow: \//);
	assert.equal(body, ROBOTS_TXT);
});

test("unauthenticated HTML is rejected", async () => {
	const res = await get("/login");
	assert.equal(res.status, 401);
});

test("missing credentials fail closed with 503", async () => {
	const env = testEnv({
		FIXTURES_BASIC_PASSWORD: "",
		FIXTURES_ACCESS_TOKEN: "",
	});
	const res = unauthorizedResponse(env);
	assert.equal(res.status, 503);
});

test("HTTP Basic, Bearer, and X-Fixtures-Token all succeed", async () => {
	const env = testEnv();
	const url = "https://test-fixtures.pyrearms.dev/login";
	assert.equal(
		authorize(new Request(url, { headers: { Authorization: basic("fixtures", "secret") } }), env),
		true,
	);
	assert.equal(
		authorize(new Request(url, { headers: { Authorization: "Bearer tok_123" } }), env),
		true,
	);
	assert.equal(
		authorize(new Request(url, { headers: { "X-Fixtures-Token": "tok_123" } }), env),
		true,
	);
	assert.equal(
		authorize(new Request(url + "?token=tok_123"), env),
		false,
	);
});

test("catalog lists every registered fixture", async () => {
	const res = await get("/", {
		headers: { Authorization: basic("fixtures", "secret") },
	});
	assert.equal(res.status, 200);
	const html = await res.text();
	assert.match(html, /data-test-fixture="true"/);
	assert.match(html, /<meta name="robots" content="noindex,nofollow,noarchive">/);
	for (const path of REQUIRED_PATHS) {
		assert.match(html, new RegExp(path.replace("/", "\\/")));
	}
	const json = await get("/catalog.json", {
		headers: { Authorization: basic("fixtures", "secret") },
	});
	const payload = await json.json();
	assert.deepEqual(
		payload.fixtures.map((row: { path: string }) => row.path),
		FIXTURES.map((fixture) => fixture.path),
	);
	assert.deepEqual(
		REQUIRED_PATHS.every((path) => FIXTURES.some((fixture) => fixture.path === path)),
		true,
	);
});

test("every fixture page carries robots meta, root marker, and only local URLs", async () => {
	const thirdParty = /(?:href|src|action)\s*=\s*["'](?:https?:)?\/\//i;
	const remoteHost = /(?:googleapis|gstatic|google-analytics|googletagmanager|recaptcha|facebook|hotjar|cdn\.jsdelivr)/i;
	for (const fixture of FIXTURES) {
		const html = renderFixture(fixture);
		assert.match(html, /<html lang="en" data-test-fixture="true"/);
		assert.match(html, /<meta name="robots" content="noindex,nofollow,noarchive">/);
		assert.match(html, /<form[\s\S]*method="post"/i);
		assert.doesNotMatch(html, thirdParty);
		assert.doesNotMatch(html, remoteHost);
		const res = await get(fixture.path, {
			headers: { Authorization: "Bearer tok_123" },
		});
		assert.equal(res.status, 200);
		assert.equal(res.headers.get("X-Robots-Tag"), ROBOTS_TAG);
		const served = await res.text();
		assert.equal(served, html);
	}
});

test("urgent-action only redirects to another local fixture", async () => {
	const urgent = FIXTURES.find((fixture) => fixture.id === "urgent-action");
	assert.ok(urgent);
	assert.equal(urgent.redirectTo, "/account-verification");
	const html = renderFixture(urgent);
	assert.match(html, /content="8;url=\/account-verification"/);
});

test("form POST is discarded and never echoed", async () => {
	const secret = "super-secret-password-value";
	const res = await get("/login", {
		method: "POST",
		headers: {
			Authorization: basic("fixtures", "secret"),
			"content-type": "application/x-www-form-urlencoded",
		},
		body: `username=member&password=${secret}`,
	});
	assert.equal(res.status, 200);
	assert.equal(res.headers.get("X-Robots-Tag"), ROBOTS_TAG);
	const html = await res.text();
	assert.match(html, /Submission discarded/);
	assert.doesNotMatch(html, new RegExp(secret));
	assert.equal(html, renderDiscarded());
});

test("static assets inherit robots headers when authorized", async () => {
	const res = await get("/assets/fixtures.css", {
		headers: { Authorization: basic("fixtures", "secret") },
	});
	assert.equal(res.status, 200);
	assert.equal(res.headers.get("X-Robots-Tag"), ROBOTS_TAG);
	assert.match(res.headers.get("content-type") || "", /text\/css/);
});

test("catalog payload documents discard behavior", () => {
	const payload = catalogPayload("test-fixtures.pyrearms.dev");
	assert.match(payload.dataHandling, /never stored/i);
	assert.equal(payload.fixtures.length, FIXTURES.length);
});
