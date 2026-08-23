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
		slug: "illinois-unfinished-frame-ban-survives-texas-injunctions",
		date: "August 23, 2026",
		publishedAt: "2026-08-23",
		title:
			"Does a Texas ATF injunction let you possess an unfinished receiver in Illinois?",
		hook: "Illinois wrote its own unfinished-frame crime in 2022. A Fort Worth caption does not repeal it.",
		dek: "720 ILCS 5/24-5.1 already makes knowing possession, transport, and transfer of unserialized unfinished frames and unserialized firearms a state offense. The Northern District of Texas orders do not rewrite Springfield.",
		tags: ["Illinois", "PMF", "unfinished frames", "state law", "map"],
		sources: [
			{
				label: "720 ILCS 5/24-5.1 (ILGA official)",
				url: "https://www.ilga.gov/legislation/ilcs/fulltext?DocName=072000050K24-5.1",
			},
			{
				label: "Frame/receiver opinion (Dkt. 330, RECAP)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.366145/gov.uscourts.txnd.366145.330.0.pdf",
			},
			{
				label: "NFA judgment (Dkt. 137, RECAP)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.406278/gov.uscourts.txnd.406278.137.0_1.pdf",
			},
			{
				label: "Opinion (9th Cir. Aug. 21, 2026)",
				url: "https://cdn.ca9.uscourts.gov/datastore/opinions/2026/08/21/24-2701.pdf",
			},
		],
		blocks: [
			{
				type: "p",
				text: "The last ten days produced two Northern District of Texas injunctions and a Ninth Circuit standing dismissal. Group chats flattened all three into one sentence: unfinished receivers are fine now. That sentence fails in Illinois before you finish the on-ramp.",
			},
			{
				type: "p",
				text: "Illinois did not wait for ATF’s 2022 frame-and-receiver rule, and it does not need that rule to charge you. Public Act 102-889 added 720 ILCS 5/24-5.1, effective May 18, 2022. Subsections (c) and (d) — possession, transport, and receipt — began 180 days later. A later technical rewrite, Public Act 103-605, took effect July 1, 2024. None of those session laws mention Defense Distributed, SAF membership, or Silencer Shop customers.",
			},
			{
				type: "h2",
				text: "What the statute actually forbids",
			},
			{
				type: "ul",
				items: [
					"Subsection (b): no knowing sale, offer, or transfer of an unserialized unfinished frame or receiver or unserialized firearm — including 3D-printed items — unless the buyer is a federal importer, manufacturer, or dealer.",
					"Subsection (c): no knowing possession, transport, or receipt of an unfinished frame or receiver unless you are a federal importer or manufacturer, you are moving it to one, or it is serialized under subsection (f).",
					"Subsection (d): no knowing possession, purchase, transport, or receipt of a firearm lacking a serial number from a federal importer or manufacturer, or from a licensee authorized to mark under subsection (f), except transfers to a federal importer or manufacturer.",
				],
			},
			{
				type: "p",
				text: "Read (c) again. The verbs are possess, transport, or receive. A kit on I-55 is not a federal-only problem. The compiled text reaches movement through the state, not just a workshop in Cook County.",
			},
			{
				type: "h2",
				text: "“Unfinished” is not yours to define",
			},
			{
				type: "quote",
				text: "“Unfinished frame or receiver” means any forging, casting, printing, extrusion, machined body, or similar article that: (1) has reached a stage in manufacture where it may readily be completed, assembled, or converted to be a functional firearm; or (2) is marketed or sold to the public to become or be used as the frame or receiver of a functional firearm once completed, assembled, or converted.",
				cite: "720 ILCS 5/24-5.1(a)",
			},
			{
				type: "p",
				text: "The second prong is the one people skip. Marketing language is in the statute. “I have not milled the fire-control pocket yet” is not, by itself, an off-ramp if the product was sold to become a frame or receiver.",
			},
			{ type: "ad" },
			{
				type: "h2",
				text: "3D printing is named. The 2022 clock is closed.",
			},
			{
				type: "p",
				text: "Subsection (e) required 3D-printed firearms and unfinished frames to be serialized under subsection (f) within 30 days after May 18, 2022, or before they became readily completable. That window closed in 2022. It is not a hobby exception. “Unserialized” here means no serial number from a federal manufacturer, importer, dealer, or other licensee authorized to mark under federal law or subsection (f).",
			},
			{
				type: "h2",
				text: "Exceptions are short. Membership is not one of them.",
			},
			{
				type: "p",
				text: "Subsection (h) carves out items rendered permanently inoperable; antiques under 18 U.S.C. § 921(a)(16); firearms made before October 22, 1968; unfinished frames held by a bona fide supplier exclusively for transfer to a federal manufacturer or importer; and a 30-day inheritance window if the heir is not otherwise prohibited. There is no SAF-member paragraph, no “Texas plaintiff customer” paragraph, and no Example 4 paragraph.",
			},
			{
				type: "h2",
				text: "Quote the penalty subsection",
			},
			{
				type: "p",
				text: "A first violation of subsection (c) or (d) is a Class A misdemeanor; a second or subsequent violation is a Class 3 felony. A first violation of the sale-or-transfer ban in subsection (b) is a Class 4 felony; a second or subsequent is a Class 2 felony. First-time possession is not automatically a felony under this section. Sale and transfer are.",
			},
			{
				type: "h2",
				text: "What the Texas PDFs cover — and what they do not",
			},
			{
				type: "p",
				text: "Chief Judge Reed O’Connor’s August 17 opinion in VanDerStok / Defense Distributed v. Blanche enjoins ATF from enforcing 27 C.F.R. §§ 478.11 and 478.12(c) against Defense Distributed, SAF, and SAF members — on named Defense Distributed products. Judge James Wesley Hendrix’s August 5 judgment in Silencer Shop Foundation v. ATF (consolidated with Jensen) enjoins specified NFA registration provisions as to untaxed firearms for the plaintiffs and, where the judgment says so, their agencies, members, and customers. Both orders are party-specific. Neither recites 720 ILCS 5/24-5.1.",
			},
			{
				type: "p",
				text: "Friday’s Ninth Circuit opinion in California v. ATF, No. 24-2701, held only that California and Giffords lacked standing to vacate Example 4 of the federal receiver rule. Standing to sue ATF in San Francisco is not a license to possess an unfinished receiver in Illinois.",
			},
			{
				type: "cta",
				title: "Illinois is a red tile for a reason",
				body: "Open the map, click Illinois, then read /law/il against 720 ILCS 5/24-5.1 before you treat a Texas injunction as a travel document.",
				href: "/map",
				label: "Open the PMF map",
			},
			{
				type: "h2",
				text: "Bottom line",
			},
			{
				type: "p",
				text: "If you live in Illinois, drive through it, or keep an unfinished frame in a bag that might cross a state line, the question is not whether ATF can enforce two C.F.R. sections against someone else in Texas. On the compiled text, knowing possession, transport, and transfer of unserialized unfinished frames and unserialized firearms are state offenses with listed exceptions — and a Fort Worth caption is not one of them. Read the statute. Then click the map.",
			},
			{
				type: "p",
				text: "PyreArms is a collective for statute education. This article is not legal advice and does not create an attorney-client relationship.",
			},
		],
	},
	{
		slug: "ninth-circuit-california-lacks-standing-to-expand-atf-receiver-rule",
		date: "August 22, 2026",
		publishedAt: "2026-08-22",
		title:
			"Ninth Circuit: California lacked standing to make ATF regulate more unfinished AR receivers",
		hook: "The panel did not bless 80% receivers. It said the plaintiffs never proved Example 4 hurt them.",
		dek: "A three-judge panel vacated the Northern District of California order that had struck Example 4 of the 2022 frame-and-receiver rule. Standing only — not a Second Amendment holding, and not a repeal of California serialization law.",
		tags: ["ATF", "PMF", "Ninth Circuit", "unfinished frames", "standing"],
		sources: [
			{
				label: "Opinion (9th Cir. Aug. 21, 2026)",
				url: "https://cdn.ca9.uscourts.gov/datastore/opinions/2026/08/21/24-2701.pdf",
			},
			{
				label: "Ninth Circuit opinions list (filed Aug. 21, 2026)",
				url: "https://www.ca9.uscourts.gov/decisions/opinions/",
			},
			{
				label: "2022 Final Rule (87 Fed. Reg. 24652) / Example 4",
				url: "https://www.govinfo.gov/content/pkg/FR-2022-04-26/pdf/2022-08026.pdf",
			},
			{
				label: "Cal. Penal Code § 29180 (official)",
				url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=29180",
			},
		],
		blocks: [
			{
				type: "p",
				text: "A Ninth Circuit panel has thrown out California and the Giffords Law Center’s attempt to force the Bureau of Alcohol, Tobacco, Firearms and Explosives to treat more unfinished AR-15 receiver billets as Gun Control Act “firearms.” The court did not decide whether Example 4 of the 2022 frame-and-receiver rule is wise, lawful, or too narrow. It held that the plaintiffs never proved Article III standing.",
			},
			{
				type: "p",
				text: "The opinion in State of California v. U.S. Bureau of Alcohol, Tobacco, Firearms & Explosives, No. 24-2701, was filed August 21, 2026. Judge Consuelo M. Callahan wrote for a panel that also included Judges Holly A. Thomas and Anthony D. Johnstone, on appeal from Judge Edward M. Chen in the Northern District of California (No. 3:20-cv-06761-EMC).",
			},
			{
				type: "quote",
				text: "We must decide whether Plaintiffs have standing to raise their challenge. They do not.",
				cite: "Callahan, 9th Cir., Aug. 21, 2026",
			},
			{
				type: "h2",
				text: "What Example 4 actually says",
			},
			{
				type: "p",
				text: "ATF’s 2022 Final Rule treats some partially complete frames and receivers — including certain kits that “may readily be completed” — as firearms under 27 C.F.R. § 478.12(c). The same section then gives nonexclusive examples of what is, and is not, a receiver. Example 4 is the carve-out California wanted erased.",
			},
			{
				type: "p",
				text: "As quoted by the panel from the regulation: a “billet or blank of an AR-15 variant receiver without critical interior areas having been indexed, machined, or formed that is not sold, distributed, or possessed with instructions, jigs, templates, equipment, or tools such that it may readily be completed is not a receiver.” Plaintiffs argued that Example 4 left “obvious and easily navigable loopholes.” They did not ask the court to vacate the entire Final Rule. They wanted it to reach even more early-stage receivers, including items sold without tools.",
			},
			{
				type: "h2",
				text: "What the district court had done — and what the panel undid",
			},
			{
				type: "p",
				text: "Judge Chen had found standing, granted the plaintiffs summary judgment on their arbitrary-and-capricious count, declared Example 4 unlawful, vacated it, and remanded the matter to ATF. Callahan’s opinion is explicit that the appeal begins and ends with standing. Because the plaintiffs did not show that Example 4 caused their asserted injuries, the panel never reached the merits. The case goes back with instructions to dismiss without prejudice.",
			},
			{ type: "ad" },
			{
				type: "h2",
				text: "Why the standing theory failed",
			},
			{
				type: "p",
				text: "California said Example 4 forced extra spending to accelerate state ghost-gun legislation and train law enforcement. Giffords said the same gap frustrated its mission and diverted staff time. Both injuries were indirect. When claimed harm depends on how third parties react to the government’s regulation of someone else, standing is “substantially more difficult” to establish.",
			},
			{
				type: "ul",
				items: [
					"The evidence spoke to “ghost guns” generally, not to the specific unfinished products Example 4 leaves unregulated.",
					"Almost all of California’s documented expenditures ran from 2016 through 2022 — before the Final Rule existed — so they cannot be charged to Example 4.",
					"The one post-rule data point, from Los Angeles County recoveries, showed the share of recovered ghost guns falling after the rule, which the panel called “the opposite trend that California’s theory requires.”",
					"Giffords’ records had the same two problems: they did not isolate Example 4 products, and nearly all of the documented work predated the rule.",
				],
			},
			{
				type: "quote",
				text: "Because California and GLC assert theories that rest on such speculation, neither has standing here. We thus vacate the district court’s order and remand with instructions to dismiss the case for lack of standing.",
				cite: "Callahan, 9th Cir., Aug. 21, 2026",
			},
			{
				type: "h2",
				text: "What this is not",
			},
			{
				type: "ul",
				items: [
					"Not a Second Amendment decision. The panel never reached the constitutional status of unfinished receivers.",
					"Not a holding that Example 4 is lawful — or unlawful. The merits were not decided.",
					"Not a nationwide right to buy every product marketed as an “80% receiver.” Example 4 is fact-specific: no critical interior machining, and not sold, distributed, or possessed with the jigs and tools that make it readily completable.",
					"Not a repeal of California serialization law. Penal Code §§ 29180–29182 still condition personal manufacture on a DOJ unique serial number.",
					"Not the Northern District of Texas injunction. Defense Distributed v. Blanche is a different caption, a different theory, and a party- and product-limited order. Do not mash the PDFs together.",
				],
			},
			{
				type: "p",
				text: "Dismissal without prejudice means another plaintiff — or these plaintiffs with a different record — could try again. It does not bless Example 4 for all time, and it does not erase the 2022 Final Rule. For people who are not covered by the Texas injunction, §§ 478.11 and 478.12(c) remain in the Code of Federal Regulations as ATF wrote them, including Example 4.",
			},
			{
				type: "cta",
				title: "California’s map tile did not move",
				body: "This opinion is about who may sue ATF in federal court, not about whether you need a DOJ serial number before you mill a frame in California. Open the map, then /law/ca, before you treat a standing dismissal as a workshop green light.",
				href: "/map",
				label: "Open the PMF map",
			},
			{
				type: "h2",
				text: "Bottom line",
			},
			{
				type: "p",
				text: "California wanted ATF to regulate a broader slice of unfinished AR receivers. The Ninth Circuit said the state and Giffords never proved Example 4 caused the injuries they claimed, vacated the order that had struck the example, and sent the case back to be dismissed without prejudice. If you live in California, the map still shows serialization and precursor rules. If you live anywhere else, click your state anyway. Federal standing law is not a travel permit.",
			},
			{
				type: "p",
				text: "PyreArms is a collective for statute education. This article is not legal advice and does not create an attorney-client relationship.",
			},
		],
	},
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
