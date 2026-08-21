import { PMF_AS_OF, type StatePmfRecord } from "../data/pmfStates";

export type CardLine = {
	cite: string;
	point: string;
};

export const FEDERAL_CARD_LINES: CardLine[] = [
	{
		cite: "18 U.S.C. § 922(a)(1)(A)",
		point: "The federal crime is unlicensed manufacturing or dealing as a business (livelihood or profit), not hobby making for personal use.",
	},
	{
		cite: "ATF, Privately Made Firearms",
		point: "No federal serial number or registration for a personal-use PMF if you are not engaged in the business. Must remain detectable.",
	},
	{
		cite: "18 U.S.C. § 922(k)",
		point: "Bans removing a manufacturer or importer serial number. A PMF that never had one is a different statute.",
	},
	{
		cite: "NFA / 27 C.F.R. pt. 479",
		point: "NFA items stay NFA. Silencer Shop Foundation v. ATF (N.D. Tex. Aug. 5, 2026) is party-specific — not a nationwide repeal.",
	},
];

export function stateCardLines(rec: StatePmfRecord): CardLine[] {
	if (rec.tier === "green") {
		return [
			{
				cite: `${rec.name} — no dedicated PMF statute identified`,
				point: `As of ${PMF_AS_OF}, no state serialization or unfinished-frame mandate found. Federal baseline still applies. Confirm locally.`,
			},
		];
	}
	return [
		{
			cite: rec.statute,
			point: rec.summary,
		},
	];
}

export function cardHeadline(rec: StatePmfRecord) {
	if (rec.tier === "green") {
		return "No dedicated state PMF serialization statute identified. Federal baseline applies.";
	}
	const first = rec.summary.split(/(?<=\.)\s/)[0];
	return first.length > 140 ? `${first.slice(0, 137)}…` : first;
}

export function cardUrl(rec: StatePmfRecord) {
	return `pyrearms.dev/law/${rec.code.toLowerCase()}`;
}
