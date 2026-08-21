export type LawAlert = {
	id: string;
	date: string;
	kicker: string;
	title: string;
	summary: string;
	href: string;
	active: boolean;
};

/** Homepage / law-page banners. Point to full blog articles. Newest first. */
export const LAW_ALERTS: LawAlert[] = [
	{
		id: "2026-08-frame-receiver",
		date: "August 18, 2026",
		kicker: "Federal court · N.D. Texas",
		title:
			"ATF frame/receiver rule enjoined — only for Defense Distributed, SAF, and SAF members, on named products",
		summary:
			"VanDerStok / Defense Distributed v. Blanche. Judge O’Connor, opinion Aug. 17 and judgment Aug. 18, 2026. Not a nationwide repeal of the 2022 Final Rule.",
		href: "/blog/texas-judge-blocks-atf-frame-receiver-rule-for-saf-members",
		active: true,
	},
	{
		id: "2026-08-nfa-injunction",
		date: "August 13, 2026",
		kicker: "Federal court · N.D. Texas",
		title:
			"NFA Form 4 / registration injunction is in effect — but only for covered parties",
		summary:
			"Silencer Shop Foundation v. ATF (consolidated with Jensen v. ATF). Judge Hendrix, Aug. 5, 2026; seven-day stay lapsed Aug. 13. Not a nationwide NFA repeal.",
		href: "/blog/texas-judge-enjoins-nfa-registration-for-untaxed-suppressors",
		active: true,
	},
];
