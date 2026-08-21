export type BlogBlock =
	| { type: "p"; text: string }
	| { type: "h2"; text: string }
	| { type: "ul"; items: string[] }
	| { type: "quote"; text: string; cite?: string };

export type BlogPost = {
	slug: string;
	/** Display date */
	date: string;
	/** ISO date for sorting */
	publishedAt: string;
	title: string;
	/** One-line deck under the headline */
	dek: string;
	tags: string[];
	sources: { label: string; url: string }[];
	blocks: BlogBlock[];
};

/** Public blog — full articles only. Newest first. No daily “verified” spam. */
export const BLOG_POSTS: BlogPost[] = [
	{
		slug: "texas-judge-blocks-atf-frame-receiver-rule-for-saf-members",
		date: "August 18, 2026",
		publishedAt: "2026-08-18",
		title:
			"Texas judge blocks ATF frame-and-receiver rule for Defense Distributed and SAF members",
		dek: "Chief Judge Reed O’Connor held parts of the 2022 Final Rule unconstitutional and permanently enjoined enforcement against named parties — on named Defense Distributed products. Not a nationwide repeal.",
		tags: ["ATF", "PMF", "unfinished frames", "N.D. Texas", "SAF"],
		sources: [
			{
				label: "Opinion (Dkt. 330, RECAP)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.366145/gov.uscourts.txnd.366145.330.0.pdf",
			},
			{
				label: "Final judgment (Dkt. 331, RECAP)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.366145/gov.uscourts.txnd.366145.331.0.pdf",
			},
			{
				label: "Bondi v. VanDerStok, 604 U.S. 458 (2025)",
				url: "https://www.oyez.org/cases/2024/23-852",
			},
			{
				label: "SAF case summary",
				url: "https://saf.org/saf-win-judge-rules-biden-era-atf-frame-and-receiver-rule-unconstitutional/",
			},
		],
		blocks: [
			{
				type: "p",
				text: "A federal judge in Fort Worth has permanently blocked the Bureau of Alcohol, Tobacco, Firearms and Explosives from enforcing key pieces of the Biden-era “frame or receiver” rule against Defense Distributed, the Second Amendment Foundation, and SAF’s current and future members — but only as to a short list of Defense Distributed products.",
			},
			{
				type: "p",
				text: "Chief Judge Reed O’Connor of the U.S. District Court for the Northern District of Texas issued his opinion on August 17, 2026, in VanDerStok / Defense Distributed v. Blanche, No. 4:22-cv-00691-O. Final judgment followed on August 18. There is no stay in the judgment.",
			},
			{
				type: "h2",
				text: "What the court held",
			},
			{
				type: "p",
				text: "After the Supreme Court’s 2025 decision in Bondi v. VanDerStok, only Defense Distributed and SAF remained as plaintiffs on the remaining claims. O’Connor granted the government summary judgment on the leftover Administrative Procedure Act counts. That means this order is not a nationwide vacatur of the 2022 Final Rule, and it does not overturn Bondi’s holding that the Gun Control Act can reach at least some unfinished frames and weapon-parts kits.",
			},
			{
				type: "p",
				text: "On the constitutional counts, the court declared 27 C.F.R. §§ 478.11 and 478.12(c) unconstitutional under the Second Amendment and void for vagueness under the Fifth Amendment. Those sections cover ATF’s expanded definition of “firearm” (including certain kits) and the rule treating partially complete frames or receivers as firearms when they “may readily be completed.”",
			},
			{
				type: "quote",
				text: "The decision of when a hunk of metal or plastic “may readily be completed, assembled, restored, or otherwise converted to function as a frame or receiver” is left to the subjective determination of the ATF and does not provide fair notice to the reader about when a component becomes subject to enforcement.",
				cite: "O’Connor, N.D. Tex., Aug. 17, 2026 (opinion)",
			},
			{
				type: "h2",
				text: "Who is actually covered",
			},
			{
				type: "p",
				text: "Coverage is party-specific and product-specific. The permanent injunction bars ATF and DOJ from enforcing §§ 478.11 and 478.12(c) against Defense Distributed, SAF, or any of SAF’s current or future members with respect to Defense Distributed’s M1911 80% Frames and G80 Build Kit, Unfinished Receiver, and Grip Module.",
			},
			{
				type: "ul",
				items: [
					"Defense Distributed and SAF (named plaintiffs).",
					"Current and future SAF members.",
					"Named product lines only — not every unfinished frame sold in the United States.",
					"Unlike an earlier 2023 preliminary injunction in related litigation, the 2026 judgment does not name Defense Distributed customers as a covered class.",
				],
			},
			{
				type: "h2",
				text: "What this is not",
			},
			{
				type: "ul",
				items: [
					"Not a nationwide repeal of the 2022 Final Rule.",
					"Not a holding that unfinished frames are never firearms under the Gun Control Act — Bondi still stands.",
					"Not a green light under state serialization, possession, unfinished-frame, or 3D-print bans.",
					"Not a free pass on Form 4473 / background checks for completed firearms.",
				],
			},
			{
				type: "p",
				text: "The Justice Department can still appeal. People who are not SAF members dealing in other companies’ unfinished frames should not treat this order as their shield.",
			},
			{
				type: "h2",
				text: "Bottom line",
			},
			{
				type: "p",
				text: "For SAF members buying or using the named Defense Distributed products, the Northern District of Texas has drawn a hard line against ATF enforcing those two regulatory sections. For everyone else, the eCFR text of the Final Rule is still on the books, Bondi still supplies the statutory backdrop, and state law still matters. Read the opinion and judgment before relying on a press release.",
			},
			{
				type: "p",
				text: "PyreArms is a collective for statute education. This article is not legal advice and does not create an attorney-client relationship.",
			},
		],
	},
	{
		slug: "texas-judge-enjoins-nfa-registration-for-untaxed-suppressors",
		date: "August 13, 2026",
		publishedAt: "2026-08-13",
		title:
			"Texas judge enjoins NFA registration for untaxed suppressors and short barrels — for covered parties only",
		dek: "Judge James Wesley Hendrix held that after Congress zeroed the making and transfer taxes, the challenged Form 1 / Form 4 registration scheme exceeded Article I as applied to the plaintiffs. The NFA is not repealed for the country.",
		tags: ["NFA", "suppressors", "SBR", "N.D. Texas", "GOA"],
		sources: [
			{
				label: "Memorandum opinion (Dkt. 136, RECAP)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.406278/gov.uscourts.txnd.406278.136.0.pdf",
			},
			{
				label: "Final judgment (Dkt. 137, RECAP)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.406278/gov.uscourts.txnd.406278.137.0_1.pdf",
			},
			{
				label: "GOA case summary",
				url: "https://www.gunowners.org/federal-court-rules-key-national-firearms-act-restrictions-are-unconstitutional-in-goa-lawsuit/",
			},
		],
		blocks: [
			{
				type: "p",
				text: "A permanent injunction out of San Angelo, Texas, is now in effect against ATF and DOJ enforcing key National Firearms Act registration provisions for certain untaxed items — but only for the plaintiffs in two consolidated cases, and where the judgment says so, their agencies, members, and customers.",
			},
			{
				type: "p",
				text: "Judge James Wesley Hendrix of the U.S. District Court for the Northern District of Texas entered final judgment on August 5, 2026, in Silencer Shop Foundation v. ATF, No. 6:25-cv-056-H, consolidated with Jensen v. ATF, No. 6:26-cv-277. The judgment stayed itself for seven days. That stay lapsed; covered transfers were reported beginning about August 13, 2026.",
			},
			{
				type: "h2",
				text: "The tax argument, not a Second Amendment ruling",
			},
			{
				type: "p",
				text: "The court decided the plaintiffs’ enumerated-powers claims. After the One Big Beautiful Bill Act of 2025 zeroed making and transfer taxes on silencers, short-barreled rifles and shotguns, and (for some plaintiffs) certain other NFA items, Hendrix held that the challenged registration / photo / fingerprint / Form 1 / Form 4 apparatus for those untaxed items could not be sustained under the taxing power or the Necessary and Proper Clause as applied to the parties before him. The Second Amendment claims were dismissed without prejudice as abandoned.",
			},
			{
				type: "p",
				text: "The court also refused a universal injunction. Citing Supreme Court limits on relief to non-parties, Hendrix confined the permanent injunction to the plaintiffs and, where applicable, their agencies, political subdivisions, members, and customers — current and future.",
			},
			{
				type: "h2",
				text: "Who the order actually covers",
			},
			{
				type: "ul",
				items: [
					"Named organizational plaintiffs people can join independently (among others): Gun Owners of America / Gun Owners Foundation, Texas State Rifle Association, FPC Action Foundation, Citizens Committee for the Right to Keep and Bear Arms.",
					"Commercial plaintiffs such as Silencer Shop Foundation and named industry parties — customer coverage is described as incidental to dealings with those plaintiffs, not a free pass for every NFA transfer in America.",
					"Fifteen states joined as plaintiffs; that protects those states’ agencies, not every resident of those states.",
					"Jensen plaintiffs did not receive AOW relief under the judgment’s separate paragraph.",
				],
			},
			{
				type: "h2",
				text: "What still applies",
			},
			{
				type: "ul",
				items: [
					"State suppressor, SBR, and SBS bans.",
					"Ordinary GCA dealer rules and Form 4473 background checks where they apply.",
					"NFA regulation of items and parties outside the injunction’s text.",
					"DOJ’s ability to take a conventional appeal.",
				],
			},
			{
				type: "h2",
				text: "Bottom line",
			},
			{
				type: "p",
				text: "This is a party-specific injunction about untaxed NFA registration machinery — not a headline that “the NFA is dead.” If you are not a covered plaintiff, member, or customer under the judgment’s own words, do not invent coverage. Read Dkt. 136 and Dkt. 137.",
			},
			{
				type: "p",
				text: "PyreArms is a collective for statute education. This article is not legal advice and does not create an attorney-client relationship.",
			},
		],
	},
];

export function getPost(slug: string): BlogPost | undefined {
	return BLOG_POSTS.find((p) => p.slug === slug);
}
