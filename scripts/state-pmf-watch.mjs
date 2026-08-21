#!/usr/bin/env node
/**
 * Cheap 50-state PMF bill watch via LegiScan (no LLM).
 * Needs LEGISCAN_API_KEY. One search per jurisdiction per run.
 *
 *   LEGISCAN_API_KEY=... npm run watch:states
 *
 * Overwrites src/data/stateBills.generated.ts when the hit set changes.
 */

import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/data/stateBills.generated.ts");
const KEY = process.env.LEGISCAN_API_KEY || "";
const QUERY = 'unserialized OR "ghost gun" OR "unfinished frame" OR "privately made firearm" OR "3D printed firearm"';
const TITLE_RE =
	/ghost\s*gun|privately\s*made|unserializ|unfinished\s+frame|unfinished\s+receiver|3[- ]?d[- ]print|polymer\s*80|undetectable\s+firearm|ghost\s*firearm|self[- ]made\s+firearm/i;

const STATES = [
	"AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA",
	"KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM",
	"NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA",
	"WV","WI","WY",
];

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

function render(bills) {
	const body = JSON.stringify(bills, null, "\t");
	return `/** Overwritten by \`npm run watch:states\`. Do not edit by hand. */\nexport const GENERATED_STATE_BILLS: {\n\tstate: string;\n\tsession: string;\n\tbillId: string;\n\ttitle: string;\n\tstatus: string;\n\tlastAction?: string;\n\turl: string;\n\tkeywords: string[];\n\tsource: "manual" | "legiscan";\n}[] = ${body};\n`;
}

async function searchState(state) {
	const url = new URL("https://api.legiscan.com/");
	url.searchParams.set("key", KEY);
	url.searchParams.set("op", "getSearch");
	url.searchParams.set("state", state);
	url.searchParams.set("query", QUERY);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${state} HTTP ${res.status}`);
	const data = await res.json();
	if (data.status !== "OK") {
		console.warn(state, data.alert?.message || data.status);
		return [];
	}
	const bag = data.searchresult || {};
	const hits = [];
	for (const [k, v] of Object.entries(bag)) {
		if (k === "summary" || !v || typeof v !== "object") continue;
		const title = String(v.title || "");
		if (!TITLE_RE.test(title)) continue;
		hits.push({
			state,
			session: String(v.session_id ?? v.session ?? ""),
			billId: String(v.bill_number || v.number || ""),
			title,
			status: String(v.last_action || "listed"),
			lastAction: v.last_action_date ? String(v.last_action_date) : undefined,
			url: String(v.url || `https://legiscan.com/${state}`),
			keywords: ["legiscan"],
			source: "legiscan",
		});
	}
	return hits;
}

async function main() {
	if (!KEY) {
		console.log("LEGISCAN_API_KEY unset — skip. Get a free key at https://legiscan.com/legiscan");
		process.exit(0);
	}

	const bills = [];
	for (const state of STATES) {
		try {
			const hits = await searchState(state);
			console.log(`${state} ${hits.length}`);
			bills.push(...hits);
		} catch (err) {
			console.warn(state, err);
		}
		await sleep(350);
	}

	bills.sort((a, b) => a.state.localeCompare(b.state) || a.billId.localeCompare(b.billId));
	const next = render(bills);
	let prev = "";
	try {
		prev = readFileSync(OUT, "utf8");
	} catch {
		prev = "";
	}
	if (prev === next) {
		console.log("No change.");
		return;
	}
	writeFileSync(OUT, next);
	console.log(`Wrote ${bills.length} bills to ${OUT}`);
}

main();
