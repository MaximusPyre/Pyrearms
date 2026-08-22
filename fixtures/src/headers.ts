export const ROBOTS_TAG = "noindex, nofollow, noarchive";

export const CONTENT_SECURITY_POLICY = [
	"default-src 'none'",
	"script-src 'self'",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data:",
	"font-src 'none'",
	"connect-src 'none'",
	"form-action 'self'",
	"base-uri 'self'",
	"frame-ancestors 'none'",
	"object-src 'none'",
	"upgrade-insecure-requests",
].join("; ");

export function applyFixtureHeaders(headers: Headers, contentType?: string): Headers {
	headers.set("X-Robots-Tag", ROBOTS_TAG);
	headers.set("Referrer-Policy", "no-referrer");
	headers.set("X-Content-Type-Options", "nosniff");
	headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
	headers.set("Pragma", "no-cache");
	headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
	headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
	headers.set("Cross-Origin-Resource-Policy", "same-origin");
	if (contentType) headers.set("content-type", contentType);
	return headers;
}

export function htmlResponse(body: string, status = 200): Response {
	return new Response(body, {
		status,
		headers: applyFixtureHeaders(
			new Headers(),
			"text/html; charset=utf-8",
		),
	});
}

export function textResponse(
	body: string,
	status = 200,
	contentType = "text/plain; charset=utf-8",
): Response {
	return new Response(body, {
		status,
		headers: applyFixtureHeaders(new Headers(), contentType),
	});
}

export function jsonResponse(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data, null, 2) + "\n", {
		status,
		headers: applyFixtureHeaders(new Headers(), "application/json; charset=utf-8"),
	});
}

export async function discardRequestBody(request: Request): Promise<void> {
	if (!request.body) return;
	try {
		await request.body.cancel();
	} catch {
		// Body already consumed or cancelled. Never inspect contents.
	}
}

export const ROBOTS_TXT = `User-agent: *
Disallow: /
`;
