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
		slug: "does-nj-ban-firearm-cad-files-or-only-the-print",
		date: "August 27, 2026",
		publishedAt: "2026-08-27",
		title: "Does New Jersey ban keeping firearm CAD files, or only printing them?",
		hook: "The 2018 statute already covered the printer and the upload. The 2026 chapter added possession with intent.",
		dek: "P.L. 2025, c. 255 added N.J.S. 2C:39-3(o): unlicensed knowing possession of firearm digital instructions with intent to manufacture a firearm is a fourth-degree crime. It did not repeal the 2018 third-degree print-and-distribute offenses, and a Texas ATF injunction does not rewrite Title 2C.",
		tags: ["New Jersey", "PMF", "3D printing", "digital files", "map"],
		sources: [
			{
				label: "P.L. 2025, c. 255 (official session law)",
				url: "https://pub.njleg.state.nj.us/Bills/2024/AL25/255_.PDF",
			},
			{
				label: "NJ Legislature · A4975 (enacted as P.L. 2025, c. 255)",
				url: "https://www.njleg.state.nj.us/bill-search/2024/A4975",
			},
			{
				label: "P.L. 2018, c. 138 (N.J.S. 2C:39-9(l))",
				url: "https://pub.njleg.state.nj.us/Bills/2018/AL18/138_.PDF",
			},
			{
				label: "Frame/receiver opinion (Dkt. 330, RECAP)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.366145/gov.uscourts.txnd.366145.330.0.pdf",
			},
			{
				label: "NFA judgment (Dkt. 137, RECAP)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.406278/gov.uscourts.txnd.406278.137.0_1.pdf",
			},
		],
		blocks: [
			{
				type: "p",
				text: "Group chats flattened three New Jersey verbs into one sentence: CAD files are illegal now. That sentence mixes a 2018 manufacture-and-distribute crime with a 2026 possession-with-intent chapter. The printer, the upload, and the hard drive are not the same offense.",
			},
			{
				type: "p",
				text: "P.L. 2018, c. 138 added N.J.S. 2C:39-9(l). P.L. 2025, c. 255 — Assembly Bill A4975 (Second Reprint) — was approved January 12, 2026, and took effect immediately. It amended N.J.S. 2C:39-1 and 2C:39-3. Neither session law mentions Defense Distributed, SAF membership, or Silencer Shop customers.",
			},
			{
				type: "h2",
				text: "What 2018 already made a third-degree crime",
			},
			{
				type: "quote",
				text: "It is a third degree crime for: (1) a person who is not registered or licensed to do so as a manufacturer as provided in chapter 58 of Title 2C of the New Jersey Statutes, to use a three-dimensional printer or similar device to manufacture or produce a firearm, firearm receiver, magazine, or firearm component; or (2) a person to distribute by any means, including the Internet, to a person in New Jersey who is not registered or licensed as a manufacturer as provided in chapter 58 of Title 2C of the New Jersey Statutes, digital instructions in the form of computer-aided design files or other code or instructions stored and displayed in electronic format as a digital model that may be used to program a three-dimensional printer to manufacture or produce a firearm, firearm receiver, magazine, or firearm component.",
				cite: "N.J.S. 2C:39-9(l), as added by P.L. 2018, c. 138",
			},
			{
				type: "p",
				text: "Two tracks, already. Using the printer — or a “similar device” — without a chapter 58 manufacturer license. Or distributing the files to an unlicensed person in New Jersey. “Distribute” in that subsection includes selling, giving, mailing, publishing, sharing, advertising, or making the files available via the Internet, whether for pecuniary gain or not, and includes an agreement or attempt. A Texas caption is not on that list.",
			},
			{
				type: "h2",
				text: "What January 12 added — possession plus intent",
			},
			{
				type: "quote",
				text: "“Firearm digital instructions” means digital instructions in the form of computer-aided design files or other code or instructions stored and displayed in electronic format as a digital model that may be used to program a three-dimensional printer to manufacture or produce a firearm, firearm receiver, magazine, or firearm component.",
				cite: "N.J.S. 2C:39-1(oo), as added by P.L. 2025, c. 255",
			},
			{
				type: "quote",
				text: "A person who is not licensed or registered to manufacture firearms and knowingly possesses firearm digital instructions as defined in subsection oo. of N.J.S.2C:39-1 with the intent to manufacture a firearm is guilty of a crime of the fourth degree.",
				cite: "N.J.S. 2C:39-3(o), as added by P.L. 2025, c. 255",
			},
			{
				type: "p",
				text: "Read the intent clause twice. The enacted subsection does not stop at “knowingly possesses.” The Assembly Appropriations Committee added “with the intent to manufacture a firearm” on March 20, 2025; the introduced bill did not require that element. Do not flatten the definition into the mens rea: (oo) describes files that may program a printer to produce a firearm, receiver, magazine, or component; the possession crime’s intent element, as enacted, is “to manufacture a firearm.”",
			},
			{ type: "ad" },
			{
				type: "h2",
				text: "The exception is a New Jersey manufacturer license, not a Texas coverage list",
			},
			{
				type: "p",
				text: "Both crimes carve out a person licensed or registered to manufacture firearms. 2C:39-9(l) points at chapter 58 of Title 2C — a New Jersey scheme, not SAF membership, and not “customers, current and future” of a named commercial plaintiff. N.J.S. 2C:39-1(j) defines “manufacturer” as a person who receives raw materials or parts and processes them into firearms or finished parts, with a listed exception for exclusive processing of grips, stocks, and other nonmetal parts. An FFL serial stamp is not a silent rewrite of chapter 58.",
			},
			{
				type: "h2",
				text: "A Texas caption is not a New Jersey defense",
			},
			{
				type: "p",
				text: "Chief Judge Reed O’Connor’s August 17 VanDerStok / Defense Distributed v. Blanche opinion enjoins ATF from enforcing 27 C.F.R. §§ 478.11 and 478.12(c) against Defense Distributed, SAF, and SAF members — on named Defense Distributed products. Judge James Wesley Hendrix’s August 5 Silencer Shop Foundation v. ATF judgment (consolidated with Jensen) enjoins specified NFA registration provisions as to untaxed firearms for named plaintiffs and, where it says so, their agencies, members, and customers. Both orders are party-specific. Neither recites N.J.S. 2C:39-3(o) or 2C:39-9(l).",
			},
			{
				type: "ul",
				items: [
					"Unlicensed 3D manufacture of a firearm, receiver, magazine, or component was already a third-degree crime under 2C:39-9(l)(1). The 2026 chapter did not delete it.",
					"Distributing those digital instructions to an unlicensed person in New Jersey was already a third-degree crime under 2C:39-9(l)(2), including by Internet.",
					"Knowingly possessing a firearm assembled on a frame or receiver that is not imprinted with a serial number registered with a federally licensed manufacturer remains a third-degree crime under 2C:39-3(n).",
					"Knowingly possessing a firearm silencer remains a fourth-degree crime under 2C:39-3(c). Hendrix’s NFA injunction does not repeal that subsection.",
				],
			},
			{
				type: "cta",
				title: "New Jersey is Title 2C, not a Fort Worth caption",
				body: "Open the map, click New Jersey, then read /law/nj against 2C:39-3(o) and 2C:39-9(l) before you treat a Texas injunction — or a folder of STL files — as a printer license.",
				href: "/map",
				label: "Open the PMF map",
			},
			{
				type: "h2",
				text: "Bottom line",
			},
			{
				type: "p",
				text: "If you live in New Jersey, or keep a printer and a file there, the question is not whether ATF can enforce two C.F.R. sections against someone else in Texas. Unlicensed 3D manufacture and distribution of printable firearm code were already third-degree crimes. As of January 12, 2026, unlicensed knowing possession of those digital instructions with intent to manufacture a firearm is a separate fourth-degree crime. Read both session laws. Then click the map.",
			},
			{
				type: "p",
				text: "PyreArms is a collective for statute education. This article is not legal advice and does not create an attorney-client relationship.",
			},
		],
	},
	{
		slug: "if-silencers-are-arms-can-you-skip-nfa-registration",
		date: "August 26, 2026",
		publishedAt: "2026-08-26",
		title: "If the Fifth Circuit says silencers are Arms, can you skip NFA registration?",
		hook: "Arms is a constitutional label. Section 5861(d) is still a criminal statute.",
		dek: "United States v. Comeaux held silencers are Second Amendment Arms — then affirmed a conviction for possessing unregistered ones. The Texas NFA injunction is a different caption, a different theory, and a coverage list.",
		tags: ["NFA", "suppressors", "Fifth Circuit", "Second Amendment", "map"],
		sources: [
			{
				label: "Opinion (5th Cir. June 18, 2026) — official PDF",
				url: "https://www.ca5.uscourts.gov/opinions/pub/24/24-30307-CR0.pdf",
			},
			{
				label: "Opinion (RECAP / CourtListener)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.ca5.219201/gov.uscourts.ca5.219201.132.1.pdf",
			},
			{
				label: "26 U.S.C. § 5861 (House prelim.)",
				url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section5861&num=0&edition=prelim",
			},
			{
				label: "26 U.S.C. § 5845 (House prelim.)",
				url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section5845&num=0&edition=prelim",
			},
			{
				label: "NFA judgment (Dkt. 137, RECAP)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.406278/gov.uscourts.txnd.406278.137.0_1.pdf",
			},
		],
		blocks: [
			{
				type: "p",
				text: "Group chats mashed two Fifth Circuit-region documents into one sentence: silencers are Arms, so the National Firearms Act is gone. That sentence mixes a published criminal affirmance with a party-specific civil injunction. They answer different questions.",
			},
			{
				type: "p",
				text: "United States v. Comeaux, No. 24-30307, was filed June 18, 2026. Judge Jerry E. Smith wrote for a panel that also included Judges Edith Brown Clement and Stuart Kyle Duncan, on appeal from the Western District of Louisiana (No. 6:23-CR-183-1). Brennan James Comeaux entered a conditional guilty plea to possessing unregistered silencers after ATF concluded the seized devices were consistent with a device for silencing, muffling, or diminishing the report of a portable firearm. He admitted manufacturing and possessing them. He reserved a Second Amendment challenge. The panel affirmed the conviction.",
			},
			{
				type: "h2",
				text: "What the panel actually held",
			},
			{
				type: "quote",
				text: "Though silencers are Second Amendment “Arms,” Comeaux has not alleged that the National Firearms Act’s (“NFA”) shall-issue regime has been put toward abusive ends. Because Peterson controls, he has therefore not shown that his Second Amendment rights have been violated. We affirm.",
				cite: "Smith, 5th Cir., June 18, 2026",
			},
			{
				type: "p",
				text: "That is two holdings, not one. First, silencers are Arms — not assumed for argument. The panel said they “facilitate armed self-defense” and serve “critical functions that make firearms both safer and more effective for their core lawful purpose of self-defense.” Second, 26 U.S.C. § 5861(d) still stood on this record. A constitutional label is not a skip of the registration crime.",
			},
			{
				type: "h2",
				text: "The criminal statute did not move",
			},
			{
				type: "quote",
				text: "It is “unlawful for any person” “to receive or possess a firearm which is not registered to him in the National Firearms Registration and Transfer Record.”",
				cite: "26 U.S.C. § 5861(d), as quoted in Comeaux",
			},
			{
				type: "p",
				text: "The NFA’s definition of “firearm” still includes a silencer. 26 U.S.C. § 5845(a)(7). Comeaux’s footnote 3 notes that the making tax has since been decreased to $0. The panel did not treat a zero rate as a repeal of registration, and it did not decide the Article I taxing-power theory that Silencer Shop Foundation v. ATF later used in a different caption.",
			},
			{
				type: "h2",
				text: "Why Peterson closed Bruen Step 1",
			},
			{
				type: "p",
				text: "While Comeaux’s appeal was pending, United States v. Peterson, 161 F.4th 331 (5th Cir. 2025), cert. denied, 224 L. Ed. 2d 501 (2026), treated the NFA’s shall-issue silencer-registration regime as “presumptively lawful” unless a claimant shows the system “has been ‘put toward abusive ends’ through ‘exorbitant fees’ or ‘lengthy wait times in processing license applications.’” Comeaux, the panel said, failed the same way Peterson did: he claimed he wanted silencers for self-defense, but he did not allege abusive fees or wait times, and the record did not show the NFA had effectively denied him the right. The challenge died at Bruen Step 1. The panel never reached a history-and-tradition analysis of the NFA.",
			},
			{ type: "ad" },
			{
				type: "h2",
				text: "The concurrence is not a stay",
			},
			{
				type: "p",
				text: "Judge Clement, joined by Judge Duncan, concurred in the judgment and wrote separately. She agreed silencers are Arms. She also said Peterson “ought to be revisited” because it overread Bruen’s footnote 9 — a comment about state shall-issue carry licenses in a case that did not decide the NFA — into a “half-step” between Bruen’s two steps. That is a published invitation to the en banc court. It is not a holding that registration is enjoined, and it is not a mandate that ATF stop processing Form 1 and Form 4.",
			},
			{
				type: "h2",
				text: "Do not mash this PDF with Fort Worth",
			},
			{
				type: "p",
				text: "Judge James Wesley Hendrix’s August 5, 2026 judgment in Silencer Shop Foundation v. ATF (consolidated with Jensen) permanently enjoins specified NFA registration provisions as to untaxed firearms against named plaintiffs and, where the judgment says so, their agencies, members, and customers, current and future. That case is civil. The theory is Congress’s taxing power after Public Law 119-21 zeroed most making and transfer taxes. Hendrix refused a universal injunction. The Second Amendment claims in that case were dismissed without prejudice as abandoned.",
			},
			{
				type: "ul",
				items: [
					"Comeaux is a criminal appeal of one man’s § 5861(d) conviction. The government won. It does not put you on Hendrix’s coverage list.",
					"Named organizational plaintiffs people can join independently appear in the Texas judgment — among others, Gun Owners of America (gunowners.org/join) and Gun Owners Foundation — not in Comeaux. Do not invent extra groups from a criminal caption.",
					"Commercial plaintiffs whose customers the Texas order mentions (Silencer Shop Foundation and named industry parties) are also a Silencer Shop list, with the court’s transaction-specific limits.",
					"State suppressor bans, ordinary GCA dealer rules, and Form 4473 background checks where they apply were not rewritten by either PDF.",
				],
			},
			{
				type: "cta",
				title: "The caption is federal. The stop is often state.",
				body: "A Fifth Circuit Arms holding does not repeal a state suppressor ban, and a Texas coverage list does not serialize an unfinished frame. Open the map, click your state, then match the statute you actually live under.",
				href: "/map",
				label: "Open the PMF map",
			},
			{
				type: "h2",
				text: "Bottom line",
			},
			{
				type: "p",
				text: "The Fifth Circuit said silencers are Arms. It also affirmed a conviction for possessing unregistered ones because, under Peterson, a shall-issue NFA challenge fails unless the record shows abusive fees or wait times. A later Texas civil injunction covers named parties on a taxing-power theory. Those PDFs do not cancel each other, and neither one rewrites your state’s criminal code. Match the caption to the theory. Then click the map.",
			},
			{
				type: "p",
				text: "PyreArms is a collective for statute education. This article is not legal advice and does not create an attorney-client relationship.",
			},
		],
	},
	{
		slug: "does-colorado-ffl-serial-let-you-mill-or-3d-print",
		date: "August 25, 2026",
		publishedAt: "2026-08-25",
		title:
			"Does an FFL serial number let you mill or 3D-print a firearm in Colorado?",
		hook: "Colorado’s 2024 serialization path is real. The July 1 mill-and-print statute is a different crime.",
		dek: "C.R.S. § 18-12-111.5 still requires serial numbers. C.R.S. § 18-12-119, effective July 1, 2026, separately bans knowingly manufacturing a firearm or listed component with a 3D printer or CNC mill. A Texas ATF injunction does not rewrite either section.",
		tags: ["Colorado", "PMF", "3D printing", "CNC", "unfinished frames", "map"],
		sources: [
			{
				label: "HB26-1144 session law (Ch. 94; C.R.S. § 18-12-119)",
				url: "https://www.leg.colorado.gov/laws/session-laws/HB26-1144/94/download",
			},
			{
				label: "Colorado GA · HB26-1144 (enacted)",
				url: "https://leg.colorado.gov/bills/hb26-1144",
			},
			{
				label: "SB23-279 session law (Ch. 311; C.R.S. § 18-12-111.5)",
				url: "https://www.leg.colorado.gov/laws/session-laws/SB23-279/311/download",
			},
			{
				label: "Colorado GA · SB23-279 (enacted)",
				url: "https://leg.colorado.gov/bills/sb23-279",
			},
			{
				label: "Frame/receiver opinion (Dkt. 330, RECAP)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.366145/gov.uscourts.txnd.366145.330.0.pdf",
			},
			{
				label: "NFA judgment (Dkt. 137, RECAP)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.406278/gov.uscourts.txnd.406278.137.0_1.pdf",
			},
		],
		blocks: [
			{
				type: "p",
				text: "Group chats flattened two Colorado statutes into one sentence: get an FFL to stamp a serial number, then mill or print the frame. That sentence was already wrong in 2024. As of July 1, 2026, it mixes a serialization statute with a separate mill-and-print crime.",
			},
			{
				type: "p",
				text: "C.R.S. § 18-12-111.5 is the unserialized-firearm and unfinished-frame statute from Senate Bill 23-279, chapter 311. C.R.S. § 18-12-119 is the mill-and-print statute from House Bill 26-1144, chapter 94, approved May 4, 2026. Neither session law mentions Defense Distributed, SAF membership, or Silencer Shop customers.",
			},
			{
				type: "h2",
				text: "What the 2024 statute already banned",
			},
			{
				type: "quote",
				text: "A person shall not manufacture or cause to be manufactured, including through the use of a three-dimensional printer, a frame or receiver of a firearm.",
				cite: "C.R.S. § 18-12-111.5(5)(a)(I)",
			},
			{
				type: "p",
				text: "That manufacture ban is not a “unless you serialize later” clause. The only listed exception in subsection (5)(a) is a federally licensed firearm manufacturer. Subsection (7) is a licensee imprint pathway for a firearm, frame, or receiver that already exists — and returning the marked item is a transfer that requires a Colorado background check under § 18-12-112.5. It is not a workshop license.",
			},
			{
				type: "h2",
				text: "Possession of an unfinished frame is its own verb list",
			},
			{
				type: "quote",
				text: "A person shall not knowingly possess or transport an unfinished frame or receiver; except that it is not an offense if the unfinished frame or receiver is required by federal law to be imprinted with a serial number and has been imprinted with a serial number by a federal firearms licensee pursuant to federal law or subsection (7) of this section.",
				cite: "C.R.S. § 18-12-111.5(1)(a)",
			},
			{
				type: "p",
				text: "The unfinished-frame definition in § 18-12-101(1)(l) uses the same two prongs Illinois readers already saw: an article that may readily be completed, assembled, or converted to be used as a frame or receiver, or that is marketed or sold to become one. First-time 111.5 violations are a class 1 misdemeanor; a second or subsequent offense is a class 5 felony. The January 1, 2024 serialization deadline in subsection (5)(b) is closed.",
			},
			{
				type: "h2",
				text: "What July 1 added — and it names the mill",
			},
			{
				type: "quote",
				text: "A person shall not knowingly manufacture or produce a firearm or firearm component by means of three-dimensional printing using a three-dimensional printer, CNC milling machine, or similar device.",
				cite: "C.R.S. § 18-12-119(1)(a)",
			},
			{
				type: "quote",
				text: "“Three-dimensional printing” or “3-D printing” means additive manufacturing that builds three-dimensional objects by use of a three-dimensional printer or similar device and subtractive manufacturing that creates objects by removing material from a workpiece by use of a CNC milling machine or similar device.",
				cite: "C.R.S. § 18-12-119(3)(f)",
			},
			{
				type: "p",
				text: "Read the definition twice. In this section, “three-dimensional printing” is not just a resin printer. The General Assembly defined it to include CNC milling. “Firearm component” means an unfinished frame or receiver, a large-capacity magazine as defined in § 18-12-301, or a rapid-fire device. Subsection (2) limits the section to potentially functional firearms and those components — not prop parts, and not “any other components.”",
			},
			{ type: "ad" },
			{
				type: "h2",
				text: "The exceptions are not a hobby clause",
			},
			{
				type: "ul",
				items: [
					"A federally licensed firearm manufacturer.",
					"An instructor or student of an accredited gunsmithing program, or an institution that operates one, when the manufacture is solely for educational instruction inside that program.",
				],
			},
			{
				type: "p",
				text: "That is the whole (1)(c) list. SAF membership is not on it. A Texas caption is not on it. An FFL serial number stamped after the fact is not on it. A first 119 offense is a class 1 misdemeanor; a second or subsequent offense is a class 5 felony. Chapter 94 took effect July 1, 2026, and applies to offenses committed on or after that date.",
			},
			{
				type: "h2",
				text: "What the Texas PDFs cover — and what they do not",
			},
			{
				type: "p",
				text: "Chief Judge Reed O’Connor’s August 17 opinion in VanDerStok / Defense Distributed v. Blanche enjoins ATF from enforcing 27 C.F.R. §§ 478.11 and 478.12(c) against Defense Distributed, SAF, and SAF members — on named Defense Distributed products. Judge James Wesley Hendrix’s August 5 judgment in Silencer Shop Foundation v. ATF (consolidated with Jensen) enjoins specified NFA registration provisions as to untaxed firearms for the plaintiffs and, where the judgment says so, their agencies, members, and customers. Both orders are party-specific. Neither recites C.R.S. §§ 18-12-111.5 or 18-12-119.",
			},
			{
				type: "cta",
				title: "Colorado is two statutes, not one headline",
				body: "Open the map, click Colorado, then read /law/co against § 18-12-111.5 and § 18-12-119 before you treat a Texas injunction — or an FFL serial stamp — as a mill or printer license.",
				href: "/map",
				label: "Open the PMF map",
			},
			{
				type: "h2",
				text: "Bottom line",
			},
			{
				type: "p",
				text: "If you live in Colorado, or keep a mill or printer there, the question is not whether ATF can enforce two C.F.R. sections against someone else in Texas. Serialization under 111.5(7) does not repeal 119. Unlicensed manufacture of a frame or receiver, including with a 3D printer, was already banned. As of July 1, 2026, knowingly producing a firearm or listed component with a 3D printer, CNC mill, or similar device is a separate offense. Read both session laws. Then click the map.",
			},
			{
				type: "p",
				text: "PyreArms is a collective for statute education. This article is not legal advice and does not create an attorney-client relationship.",
			},
		],
	},
	{
		slug: "does-zero-nfa-tax-mean-you-skip-form-1-and-form-4",
		date: "August 24, 2026",
		publishedAt: "2026-08-24",
		title: "Does a $0 NFA tax mean you skip Form 1 and Form 4?",
		hook: "Congress zeroed the stamp. It did not delete the application paragraphs.",
		dek: "Form 1 is making. Form 4 is transfer. The $0 rates in 26 U.S.C. §§ 5811 and 5821 sit next to approval statutes that still exist. A Texas injunction covers named parties — not everyone, and not 18 U.S.C. § 922(b)(4).",
		tags: ["NFA", "Form 1", "Form 4", "suppressors", "SBR", "map"],
		sources: [
			{
				label: "26 U.S.C. § 5811 (transfer tax; House prelim.)",
				url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section5811&num=0&edition=prelim",
			},
			{
				label: "26 U.S.C. § 5812 (transfers; House prelim.)",
				url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section5812&num=0&edition=prelim",
			},
			{
				label: "26 U.S.C. § 5821 (making tax)",
				url: "https://www.law.cornell.edu/uscode/text/26/5821",
			},
			{
				label: "26 U.S.C. § 5822 (making)",
				url: "https://www.law.cornell.edu/uscode/text/26/5822",
			},
			{
				label: "18 U.S.C. § 922(b)(4)",
				url: "https://www.law.cornell.edu/uscode/text/18/922",
			},
			{
				label: "ATF $0-tax conforming rule (91 Fed. Reg. 25112)",
				url: "https://www.govinfo.gov/content/pkg/FR-2026-05-08/pdf/2026-09155.pdf",
			},
			{
				label: "NFA judgment (Dkt. 137, RECAP)",
				url: "https://storage.courtlistener.com/recap/gov.uscourts.txnd.406278/gov.uscourts.txnd.406278.137.0_1.pdf",
			},
		],
		blocks: [
			{
				type: "p",
				text: "After Congress set the making and transfer taxes on most National Firearms Act items to $0, group chats flattened three documents into one sentence: the paperwork is gone. That sentence mixes a tax-rate amendment, an ATF conforming rule, and a party-specific injunction. The forms are not the tax.",
			},
			{
				type: "p",
				text: "Form 1 and Form 4 are ATF’s names for two different jobs. Form 1 (ATF Form 5320.1) is the application to make and register an NFA firearm. Form 4 (ATF Form 5320.4) is the application to transfer and register one that already exists. You file Form 1 when you are the maker — shortening a rifle, building a short-barreled shotgun, making a silencer. You file Form 4 when someone else is moving an already-made item to you.",
			},
			{
				type: "h2",
				text: "What the making statute still says",
			},
			{
				type: "quote",
				text: "No person shall make a firearm unless he has (a) filed with the Secretary a written application … to make and register the firearm …; (b) paid any tax payable on the making … and (e) obtained the approval of the Secretary to make and register the firearm and the application form shows such approval.",
				cite: "26 U.S.C. § 5822",
			},
			{
				type: "p",
				text: "Public Law 119-21, § 70436, rewrote the making tax in 26 U.S.C. § 5821(a): $200 for a machinegun or destructive device, and $0 for any other NFA firearm made. Zero is a rate. It does not repeal the application, fingerprint, photograph, or approval clauses. Applications “shall be denied if the making or possession of the firearm would place the person making the firearm in violation of law” — including state law.",
			},
			{
				type: "h2",
				text: "What the transfer statute still says",
			},
			{
				type: "quote",
				text: "A firearm shall not be transferred unless (1) the transferor … has filed … a written application … for the transfer and registration of the firearm to the transferee …; (2) any tax payable on the transfer is paid … and (6) the application form shows that the Secretary has approved the transfer …. The transferee … shall not take possession … unless the Secretary has approved the transfer and registration.",
				cite: "26 U.S.C. § 5812(a), (b)",
			},
			{
				type: "p",
				text: "Section 5811(a) now charges $200 to transfer a machinegun or destructive device and $0 to transfer any other NFA firearm. “Any tax payable” can be zero. It still is not a skip of identification, approval, or the ban on taking possession first. Applications are denied if the transfer, receipt, or possession would place the transferee in violation of law.",
			},
			{
				type: "h2",
				text: "ATF already wrote the $0 rate into Part 479",
			},
			{
				type: "p",
				text: "ATF published a final rule at 91 Fed. Reg. 25112 amending 27 C.F.R. §§ 479.61, 479.62, 479.81, 479.82, and 479.84 to match the statute. The agency named Form 1 and Form 4 in that document, then said the quiet part:",
			},
			{
				type: "quote",
				text: "Although ATF is revising its rule to reflect that OBBBA reduced the tax amount for these NFA firearms to $0, all other regulatory provisions of the NFA application and registration process remain in full force and effect.",
				cite: "91 Fed. Reg. 25112 (May 8, 2026)",
			},
			{
				type: "p",
				text: "That is a tax-table edit, not a Form 1 / Form 4 holiday. Machineguns and destructive devices still carry the $200 taxes. As of that rule, everything else in the NFA definition still had an application-and-approval process with a $0 stamp.",
			},
			{ type: "ad" },
			{
				type: "h2",
				text: "The Texas injunction is a coverage list",
			},
			{
				type: "p",
				text: "Judge James Wesley Hendrix’s August 5 judgment in Silencer Shop Foundation v. ATF (consolidated with Jensen) permanently enjoins ATF and DOJ from enforcing specified NFA registration provisions — including 26 U.S.C. §§ 5812(a)–(b) and 5822, and 27 C.F.R. §§ 479.62(a)–(d) and 479.84(a)–(d) — as to untaxed firearms against the plaintiffs and, where the judgment says so, their agencies, members, and customers, current and future. The court refused a universal injunction. If you are not in that list, the May rule’s “full force and effect” sentence is still the federal baseline. Hendrix did not rewrite the Gun Control Act, decide the abandoned Second Amendment claims, or repeal state suppressor and short-barrel bans.",
			},
			{
				type: "h2",
				text: "Dealers still have a different statute for short barrels",
			},
			{
				type: "quote",
				text: "It shall be unlawful for any licensed importer, licensed manufacturer, licensed dealer, or licensed collector to sell or deliver … to any person any destructive device, machinegun …, short-barreled shotgun, or short-barreled rifle, except as specifically authorized by the Attorney General consistent with public safety and necessity.",
				cite: "18 U.S.C. § 922(b)(4)",
			},
			{
				type: "p",
				text: "That paragraph does not list silencers. It does list short-barreled rifles and shotguns. It lives in Title 18, not Title 26, and Hendrix did not enjoin it. Licensee-to-licensee deals are carved out of § 922(b)(1)–(4). For a dealer handing an SBR or SBS to a non-licensee, the GCA still demands Attorney General authorization. A $0 NFA tax is not that authorization.",
			},
			{
				type: "cta",
				title: "The stamp is federal. The stop is often state.",
				body: "Form 1 and Form 4 do not repeal a state suppressor or short-barrel ban, and they do not serialize an unfinished frame. Open the map, click your state, then read /law for the tile you actually live on.",
				href: "/map",
				label: "Open the PMF map",
			},
			{
				type: "h2",
				text: "Bottom line",
			},
			{
				type: "p",
				text: "Making is § 5822 (Form 1). Transfer is § 5812 (Form 4). The 2025 tax change set most stamps to $0 and left the approval paragraphs in the Code. ATF said so in May. A later Texas injunction covers named parties on named NFA provisions. It does not delete § 922(b)(4) for short barrels, and it does not delete your state’s criminal code. Match the form to the verb, then click the map.",
			},
			{
				type: "p",
				text: "PyreArms is a collective for statute education. This article is not legal advice and does not create an attorney-client relationship.",
			},
		],
	},
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
