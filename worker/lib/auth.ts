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
	const sig = await crypto.subtle.sign(
		"HMAC",
		key,
		new TextEncoder().encode(data),
	);
	return [...new Uint8Array(sig)]
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

export async function createSessionToken(secret: string): Promise<{
	token: string;
	expiresAt: string;
}> {
	const raw = crypto.randomUUID() + crypto.randomUUID();
	const token = await hmacHex(secret, raw);
	const expires = new Date(Date.now() + 1000 * 60 * 60 * 12);
	return { token, expiresAt: expires.toISOString() };
}

export function cookieHeader(token: string, maxAgeSec: number): string {
	return `pyre_admin=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}`;
}

export function clearCookieHeader(): string {
	return "pyre_admin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}

export function readSessionCookie(request: Request): string | null {
	const cookie = request.headers.get("Cookie") || "";
	const match = cookie.match(/(?:^|;\s*)pyre_admin=([^;]+)/);
	return match ? decodeURIComponent(match[1]) : null;
}

export async function requireAdmin(
	request: Request,
	env: Env,
): Promise<Response | null> {
	const token = readSessionCookie(request);
	if (!token) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
	const row = await env.DB.prepare(
		"SELECT token FROM sessions WHERE token = ? AND expires_at > datetime('now')",
	)
		.bind(token)
		.first();
	if (!row) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
	return null;
}

export function verifyAdminPassword(env: Env, password: string): boolean {
	const expected = env.ADMIN_PASSWORD;
	if (!expected) return false;
	return timingSafeEqual(password, expected);
}
