import assert from "node:assert/strict";
import test from "node:test";
import { HOST_GROUPS, PYRE_HOSTS } from "../../src/data/pyreHosts.ts";

test("every host has a unique id and hostname", () => {
	const ids = PYRE_HOSTS.map((host) => host.id);
	const hosts = PYRE_HOSTS.map((host) => host.host);
	assert.equal(new Set(ids).size, ids.length);
	assert.equal(new Set(hosts).size, hosts.length);
});

test("hub and apex are listed and hrefs are https", () => {
	assert.ok(PYRE_HOSTS.some((host) => host.host === "hub.pyrearms.dev"));
	assert.ok(PYRE_HOSTS.some((host) => host.host === "pyrearms.dev"));
	assert.ok(PYRE_HOSTS.some((host) => host.host === "test-fixtures.pyrearms.dev"));
	for (const host of PYRE_HOSTS) {
		assert.match(host.href, /^https:\/\//);
		assert.ok(HOST_GROUPS.some((group) => group.id === host.access));
	}
});
