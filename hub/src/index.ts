/**
 * Host directory for PyreArms subdomains (hub.pyrearms.dev).
 * Separate from the pyrearms.dev education Worker.
 */
import { Hono } from "hono";
import { HOST_GROUPS, PYRE_HOSTS } from "../../src/data/pyreHosts.ts";
import { directoryPage } from "./html.ts";

const app = new Hono();

app.get("/robots.txt", () => {
	return new Response("User-agent: *\nAllow: /\n", {
		headers: { "content-type": "text/plain; charset=utf-8" },
	});
});

app.get("/hosts.json", () => {
	return new Response(JSON.stringify({ hosts: PYRE_HOSTS }, null, 2) + "\n", {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store",
		},
	});
});

app.get("*", () => {
	return new Response(directoryPage(PYRE_HOSTS, HOST_GROUPS), {
		headers: { "content-type": "text/html; charset=utf-8" },
	});
});

export default app;
