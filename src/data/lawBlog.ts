export type BlogBlock =
	| { type: "p"; text: string }
	| { type: "h2"; text: string }
	| { type: "ul"; items: string[] }
	| { type: "quote"; text: string; cite?: string }
	| { type: "ad" }
	| {
			type: "cta";
			title: string;
			body: string;
			href: string;
			label: string;
	  };

export type BlogPost = {
	slug: string;
	date: string;
	publishedAt: string;
	title: string;
	dek: string;
	tags: string[];
	/** Optional hook line shown above the dek on the index card */
	hook?: string;
	sources: { label: string; url: string }[];
	blocks: BlogBlock[];
};

export function readingMinutes(post: BlogPost) {
	const words = post.blocks.reduce((n, b) => {
		if (b.type === "p" || b.type === "h2" || b.type === "quote") {
			return n + b.text.split(/\s+/).length;
		}
		if (b.type === "ul") {
			return n + b.items.join(" ").split(/\s+/).length;
		}
		if (b.type === "cta") {
			return n + `${b.title} ${b.body}`.split(/\s+/).length;
		}
		return n;
	}, 0);
	return Math.max(1, Math.round(words / 220));
}

export function relatedPosts(slug: string, limit = 2) {
	return BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, limit);
}

/** Public blog — full articles only. Newest first. No daily “verified” spam. */
export const BLOG_POSTS: BlogPost[] = [
	{
		slug: "texas-won-headlines-your-state-still-owns-you",
		date: "August 21, 2026",
		publishedAt: "2026-08-21",
		title:
			"Texas won the headlines. Your state still owns the stop.",
		hook: "If you only read the victory posts, you are one bad traffic stop from finding out why that is not enough.",
		dek: "Two August 2026 Northern District of Texas injunctions are real — and party-specific. Here is how people misread them, what actually travels across a state line, and the five-minute map check that keeps you out of the trap.",
		tags: ["PMF", "state law", "NFA", "retention", "map"],
		sources: [
			{
				label: "Frame/receiver opinion (Dkt. 330)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.366145/gov.uscourts.txnd.366145.330.0.pdf",
			},
			{
				label: "NFA judgment (Dkt. 137)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.406278/gov.uscourts.txnd.406278.137.0_1.pdf",
			},
			{
				label: "PyreArms state map",
				url: "https://pyrearms.dev/map",
			},
		],
		blocks: [
			{
				type: "p",
				text: "You have seen the screenshots. “Judge nukes ATF ghost-gun rule.” “NFA registration dead.” Group chats light up. Someone posts a membership link. Someone else posts a shopping cart.",
			},
			{
				type: "p",
				text: "None of that is fake. Chief Judge Reed O’Connor really did enjoin key pieces of the 2022 frame-and-receiver rule for Defense Distributed, the Second Amendment Foundation, and SAF members — on named Defense Distributed products. Judge James Wesley Hendrix really did permanently enjoin NFA registration machinery for certain untaxed items for covered plaintiffs, members, and customers. The PDFs are on RECAP. We wrote them up.",
			},
			{
				type: "p",
				text: "Here is the part the victory posts bury in paragraph fourteen: those orders are not a hall pass you carry into California, New York, Illinois, New Jersey, Washington, or half a dozen other states that already wrote unfinished-frame and unserialized-possession felonies into their own codes. A Texas injunction against ATF does not repeal a state statute. A membership in an organizational plaintiff does not rewrite your state’s criminal code. And “customers — current and future” means what the judgment says it means, not what a comment section hopes it means.",
			},
			{
				type: "h2",
				text: "The trap in one sentence",
			},
			{
				type: "p",
				text: "People treat a party-specific federal injunction like a nationwide repeal, then discover — usually with lights in the mirror — that their state never needed ATF’s rule to charge them.",
			},
			{
				type: "h2",
				text: "Three ways smart people get this wrong",
			},
			{
				type: "ul",
				items: [
					"They skip the coverage list. If you are not SAF (for the frame rule) or not a named plaintiff / member / covered customer (for the NFA ruling), the order is not your shield.",
					"They ignore product limits. O’Connor’s permanent injunction names Defense Distributed’s M1911 80% Frames and G80 kit lines — not every unfinished frame on the internet.",
					"They forget the map. State serialization, possession, unfinished-frame, and 3D-print bans keep running whether or not ATF can enforce §§ 478.11 and 478.12(c) against someone else.",
				],
			},
			{ type: "ad" },
			{
				type: "h2",
				text: "What you should do in the next five minutes",
			},
			{
				type: "ul",
				items: [
					"Open the PyreArms state map. Click your state. Read manufacture, serialize, possess, 3D-print — not just the color.",
					"If you travel, click the states you drive through. Color changes at the border; so do felonies.",
					"Print the pocket statute card for your home state if you want the cites in your wallet. It is not a permit. It is so you are not arguing from memory.",
					"Read the actual articles on the two Texas rulings before you forward another screenshot.",
					"If a case matters to you personally, talk to a lawyer in that jurisdiction. We publish education. We do not represent you.",
				],
			},
			{
				type: "cta",
				title: "Check your state before you trust a headline",
				body: "The map is the retention product. Click once, come back when the next injunction drops, print a card when you travel.",
				href: "/map",
				label: "Open the PMF map",
			},
			{
				type: "h2",
				text: "Why we built the map as its own page",
			},
			{
				type: "p",
				text: "Federal law is the shared baseline. State overlays are where most people actually get hurt. Burying the map under a wall of federal statute text made people bounce. So the map is now a first-class page: click a state, read the axes, print a card, open the full state writeup. The blog explains the drama. The map answers “what about me?”",
			},
			{
				type: "h2",
				text: "Bottom line",
			},
			{
				type: "p",
				text: "Celebrate the wins. Read the coverage language. Then open the map. If that feels less exciting than a victory post, good — excitement is how people skip the part that keeps them free.",
			},
			{
				type: "p",
				text: "PyreArms is a collective for statute education. This article is not legal advice and does not create an attorney-client relationship.",
			},
		],
	},
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
			{ type: "ad" },
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
				type: "cta",
				title: "Does your state still ban unfinished frames?",
				body: "This injunction is federal and party-specific. Open the map before you assume the rule is gone where you live.",
				href: "/map",
				label: "Check the state map",
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
			{ type: "ad" },
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
				type: "cta",
				title: "State suppressor bans still apply",
				body: "This injunction does not rewrite state law. Check your state on the map, then read the judgment coverage language again.",
				href: "/map",
				label: "Open the state map",
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
