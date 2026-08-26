import assert from "node:assert/strict";
import { test } from "node:test";
import {
	classifyBrowser,
	classifyDevice,
	classifyLanguage,
	classifyOs,
	classifyReferrer,
} from "./classify.ts";

test("classifies common browsers and in-app webviews", () => {
	assert.equal(
		classifyBrowser(
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0",
		),
		"Edge",
	);
	assert.equal(
		classifyBrowser(
			"Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1",
		),
		"Safari",
	);
	assert.equal(
		classifyBrowser(
			"Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/128.0.0.0 Mobile Safari/537.36",
		),
		"Chrome",
	);
	assert.equal(
		classifyBrowser("Mozilla/5.0 Instagram 192.168.1.2.111 Android"),
		"Instagram",
	);
	assert.equal(classifyBrowser("Snapchat/12.0 (iPhone; iOS 17.0)"), "Snapchat");
});

test("classifies OS and device", () => {
	assert.equal(classifyOs("Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)"), "iOS");
	assert.equal(classifyOs("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"), "Windows");
	assert.equal(classifyOs("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)"), "macOS");
	assert.equal(classifyDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)"), "Phone");
	assert.equal(classifyDevice("Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X)"), "Tablet");
	assert.equal(classifyDevice("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"), "Desktop");
	assert.equal(classifyDevice("Mozilla/5.0 (Linux; Android 14) Mobile", true), "Phone");
});

test("classifies referrers and languages", () => {
	assert.equal(classifyReferrer(""), "Direct");
	assert.equal(classifyReferrer("https://t.co/abc"), "X");
	assert.equal(classifyReferrer("https://l.instagram.com/"), "Instagram");
	assert.equal(classifyReferrer("https://www.google.com/"), "Google");
	assert.equal(classifyLanguage("en-US,en;q=0.9"), "en-US");
	assert.equal(classifyLanguage("not a tag"), "");
});
