import type { Env } from "./env.ts";

export function timingSafeEqual(a: string, b: string): boolean {
	const enc = new TextEncoder();
	const aa = enc.encode(a);
	const bb = enc.encode(b);
	const max = Math.max(aa.byteLength, bb.byteLength);
	let mismatch = aa.byteLength === bb.byteLength ? 0 : 1;
	for (let i = 0; i < max; i += 1) {
		mismatch |= (aa[i] ?? 0) ^ (bb[i] ?? 0);
	}
	return mismatch === 0;
}

export function authDisabled(env: Env): boolean {
	return (env.FIXTURES_AUTH_MODE || "on").trim().toLowerCase() === "off";
}

export function authConfigured(env: Env): boolean {
	return Boolean(env.FIXTURES_BASIC_PASSWORD || env.FIXTURES_ACCESS_TOKEN);
}

function bearerToken(header: string | null): string | null {
	if (!header) return null;
	const match = header.match(/^Bearer\s+(\S+)/i);
	return match ? match[1] : null;
}

function basicCredentials(
	header: string | null,
): { user: string; password: string } | null {
	if (!header) return null;
	const match = header.match(/^Basic\s+(\S+)/i);
	if (!match) return null;
	try {
		const decoded = atob(match[1]);
		const colon = decoded.indexOf(":");
		if (colon < 0) return null;
		return {
			user: decoded.slice(0, colon),
			password: decoded.slice(colon + 1),
		};
	} catch {
		return null;
	}
}

export function authorize(request: Request, env: Env): boolean {
	if (authDisabled(env)) return true;
	if (!authConfigured(env)) return false;

	const expectedToken = env.FIXTURES_ACCESS_TOKEN || "";
	if (expectedToken) {
		const headerToken =
			bearerToken(request.headers.get("Authorization")) ||
			request.headers.get("X-Fixtures-Token") ||
			"";
		if (headerToken && timingSafeEqual(headerToken, expectedToken)) {
			return true;
		}
		const allowQuery =
			(env.FIXTURES_ALLOW_QUERY_TOKEN || "").trim().toLowerCase() === "true";
		if (allowQuery) {
			const queryToken = new URL(request.url).searchParams.get("token") || "";
			if (queryToken && timingSafeEqual(queryToken, expectedToken)) {
				return true;
			}
		}
	}

	const expectedPassword = env.FIXTURES_BASIC_PASSWORD || "";
	if (expectedPassword) {
		const basic = basicCredentials(request.headers.get("Authorization"));
		const expectedUser = env.FIXTURES_BASIC_USER || "fixtures";
		if (
			basic &&
			timingSafeEqual(basic.user, expectedUser) &&
			timingSafeEqual(basic.password, expectedPassword)
		) {
			return true;
		}
	}

	return false;
}

export function unauthorizedResponse(env: Env): Response {
	if (!authDisabled(env) && !authConfigured(env)) {
		return new Response("Fixture access control is not configured.\n", {
			status: 503,
			headers: {
				"content-type": "text/plain; charset=utf-8",
				"cache-control": "no-store",
			},
		});
	}
	const headers = new Headers({
		"content-type": "text/plain; charset=utf-8",
		"cache-control": "no-store",
	});
	if (env.FIXTURES_BASIC_PASSWORD) {
		headers.set("WWW-Authenticate", 'Basic realm="classification-fixtures"');
	}
	return new Response("Unauthorized\n", { status: 401, headers });
}
