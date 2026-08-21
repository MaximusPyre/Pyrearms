import { GENERATED_STATE_BILLS } from "./stateBills.generated";

/** Enacted / in-force PMF session law already cited on the map, plus
 * generated LegiScan hits from `npm run watch:states`.
 * Education only. Confirm the enrolled text.
 */

export type StateBill = {
	state: string;
	session: string;
	billId: string;
	title: string;
	status: string;
	lastAction?: string;
	url: string;
	keywords: string[];
	source: "manual" | "legiscan";
};

export const MANUAL_STATE_BILLS: StateBill[] = [
	{
		state: "CO",
		session: "2026",
		billId: "HB26-1144",
		title: "3D printing / CNC manufacture of functional firearms and listed components",
		status: "Enacted — effective July 1, 2026",
		url: "https://leg.colorado.gov/bills/hb26-1144",
		keywords: ["3D", "CNC", "PMF"],
		source: "manual",
	},
	{
		state: "CO",
		session: "2023",
		billId: "SB23-279",
		title: "Unserialized firearms and unfinished frames",
		status: "Enacted — in force since 2024",
		url: "https://leg.colorado.gov/bills/sb23-279",
		keywords: ["unserialized", "unfinished frame"],
		source: "manual",
	},
	{
		state: "ME",
		session: "132",
		billId: "LD 1126 / P.L. 2025, c. 537",
		title: "Serialization of firearms and unfinished frames (FFL imprint pathway)",
		status: "Enacted Jan 11, 2026; some penalties begin Jan 1, 2027",
		url: "https://legislature.maine.gov/legis/bills/display_ps.asp?LD=1126&snum=132",
		keywords: ["serialization", "unfinished frame"],
		source: "manual",
	},
	{
		state: "NJ",
		session: "2024-2025",
		billId: "P.L. 2025, c. 255 / A4975",
		title: "Unlicensed possession of firearm digital instructions with intent to manufacture",
		status: "Approved Jan 12, 2026",
		url: "https://pub.njleg.state.nj.us/Bills/2024/AL25/255_.PDF",
		keywords: ["digital instructions", "3D"],
		source: "manual",
	},
	{
		state: "NY",
		session: "FY 2026-27",
		billId: "A10005C Part C",
		title: "Budget provisions on 3D-printed firearms, digital files, printer-blocking workgroup",
		status: "Signed May 27, 2026",
		url: "https://assembly.ny.gov/2026budget/2026_bills/enacted/A10005c.pdf",
		keywords: ["3D", "digital file"],
		source: "manual",
	},
	{
		state: "VA",
		session: "2026",
		billId: "HB 40 / 2026 Acts ch. 531",
		title: "Unserialized firearms and unfinished frames (manufacture/sale/transfer, later possession)",
		status: "Approved Apr 10, 2026; most rules Jan 1, 2027; possession July 1, 2027",
		url: "https://lis.virginia.gov/bill-details/20261/HB40",
		keywords: ["unserialized", "unfinished frame"],
		source: "manual",
	},
	{
		state: "WA",
		session: "2026",
		billId: "ESHB 2320 / 2026 c 203",
		title: "3D/CNC manufacture and digital firearm manufacturing code",
		status: "Effective Mar 24, 2026; one section delayed to June 30, 2027",
		url: "https://app.leg.wa.gov/billsummary/?BillNumber=2320&Year=2026",
		keywords: ["3D", "CNC", "digital code"],
		source: "manual",
	},
	{
		state: "MA",
		session: "regs",
		billId: "501 CMR 20",
		title: "Serialization deadline for previously made firearms",
		status: "Stated deadline Oct 2, 2026",
		url: "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXX/Chapter140/Section121C",
		keywords: ["serialization"],
		source: "manual",
	},
];

export function billsForState(code: string): StateBill[] {
	const c = code.toUpperCase();
	const seen = new Set<string>();
	const out: StateBill[] = [];
	for (const b of [...MANUAL_STATE_BILLS, ...GENERATED_STATE_BILLS]) {
		if (b.state !== c) continue;
		const key = `${b.billId}|${b.url}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(b);
	}
	return out;
}
