export type LawBlogPost = {
	id: string;
	date: string;
	title: string;
	body: string;
	/** States or bills that changed, if any. */
	changed: string[];
};

/** Newest first. Daily law-watch automation prepends entries here. */
export const LAW_BLOG: LawBlogPost[] = [
	{
		id: "2026-08-18-verified",
		date: "August 18, 2026",
		title: "Verified — no material new action",
		body: "Primary-source re-check of CourtListener / RECAP, GovInfo, the Federal Register API, and official state codes / session-law pages. No new federal PMF public law. GovInfo still lists only introduced texts for H.R. 8059 (IH, Mar. 24, 2026), H.R. 4143 (IH), S. 2165 (IS), and S. 4339 (IS); no EH/ES/enrolled packages. ATF’s newest Federal Register items remain the July 6, 2026 proposed rules on fingerprints/photos and NFA government-contract registration, plus the eZ Check withdrawal — not a final PMF or NFA-registration rule. CourtListener: Silencer Shop Foundation v. ATF, No. 6:25-cv-056-H, last filing is still Aug. 14 (order granting counsel withdrawal); no notice of appeal on the docket (ordinary FRAP 4 window still runs from the Aug. 5 judgment). Brown v. ATF, No. 4:25-cv-01162 (E.D. Mo.), remains under submission after the Aug. 10 argument; newest docket item is the Aug. 12 hearing transcript. Colon v. ATF, No. 8:23-cv-00223 (M.D. Fla.), Dkt. 78 (Aug. 17) is a case-management endorsed order asking the parties whether that SBR case should proceed in light of the N.D. Texas decision — not a merits injunction. Official codes for restricted jurisdictions still match the map. Minnesota SF 3661 remains at Senate second reading; companion HF 3407 was never reported. Michigan SB 331 is still in House Government Operations. Pennsylvania HB 1443 is still referred to Judiciary (official history generated August 18, 2026). Map fields, citations, summaries, and the active NFA banner are unchanged. Education, not legal advice.",
		changed: [],
	},
	{
		id: "2026-08-16-pm-verified",
		date: "August 16, 2026",
		title: "Verified — no material new action",
		body: "Afternoon primary-source re-check after the N.D. Texas NFA injunction post. ATF’s Privately Made Firearms page is still last updated September 11, 2025. GovInfo still lists H.R. 8059, H.R. 4143, S. 2165, and S. 4339 as introduced-only texts; no new federal PMF public law. Newest ATF Federal Register items remain July 6, 2026 proposed rules and an eZ Check withdrawal — not a final PMF or NFA-registration rule. CourtListener / RECAP: Silencer Shop Foundation v. ATF, No. 6:25-cv-056-H, last filings August 12–14 are counsel appearance and withdrawal; no notice of appeal on the docket (ordinary appeal window still runs from the August 5 judgment). Brown v. ATF, No. 4:25-cv-01162 (E.D. Mo.), remains under submission after the August 10 argument; no injunction or merits order. Official codes and session-law pages for restricted jurisdictions still match the map. Minnesota SF 3661 / HF 3407 still did not pass. Michigan SB 331 is still in House Government Operations. Pennsylvania HB 1443 is still referred to Judiciary (official history generated August 16, 2026). Map fields, citations, and the active NFA banner are unchanged. Education, not legal advice.",
		changed: [],
	},
	{
		id: "2026-08-nfa-injunction",
		date: "August 16, 2026",
		title: "N.D. Texas NFA injunction in effect for covered parties (suppressors / SBR / SBS)",
		body: "On August 5, 2026, Judge James Wesley Hendrix (N.D. Texas, San Angelo division) entered final judgment in Silencer Shop Foundation v. ATF, No. 6:25-cv-056-H, consolidated with Jensen v. ATF, No. 6:26-cv-277. The court held that after the One Big Beautiful Bill Act of 2025 zeroed making and transfer taxes on certain NFA items, the challenged registration / Form 1 / Form 4 scheme for those untaxed items exceeded Congress’s enumerated powers as applied to the plaintiffs. A seven-day stay expired; reporting and the judgment’s stay language put the permanent injunction in effect on or about August 13, 2026. The order is not a nationwide repeal of the NFA. Relief runs to the plaintiffs and, where applicable, their agencies, political subdivisions, members, and customers — current and future. Commercial-plaintiff customers are described in the opinion as covered in transactions with those plaintiffs, not for every NFA dealing in the country. State suppressor / SBR bans still apply. Ordinary GCA Form 4473 / background-check rules can still apply. DOJ can still take a conventional appeal. Primary PDFs: opinion Dkt. 136 and judgment Dkt. 137 on RECAP. Education, not legal advice.",
		changed: ["Federal NFA (party-specific injunction)"],
	},
	{
		id: "2026-08-16-verified",
		date: "August 16, 2026",
		title: "Verified — no new enactments",
		body: "Primary-source re-check of ATF’s Privately Made Firearms page, 119th Congress bill texts (GovInfo / Congress.gov), and official codes or session-law pages for all 50 states plus D.C. No new federal PMF statute was enacted. H.R. 8059 and H.R. 4143 remain introduced only. No state chapter signed after the August 15 compile changed the map’s tiers. Minnesota SF 3661 / HF 3407 still did not pass. Citations and summaries unchanged. Education, not legal advice.",
		changed: [],
	},
	{
		id: "2026-08-15-verified",
		date: "August 15, 2026",
		title: "Verified — no new enactments",
		body: "Re-checked ATF’s Privately Made Firearms page, Congress.gov (119th Congress), and official state codes / session-law pages for all 50 states plus D.C. No new federal PMF statute was enacted. Introduced bills such as H.R. 8059 (additive-manufacturing serialization) and H.R. 4143 remain unenacted. Minnesota’s 2026 ghost-gun bills (SF 3661 / HF 3407) did not pass. No state chapter signed after the August 11 compile changed the map’s tiers. Citations on restricted jurisdictions were swapped from advocacy trackers to official code or session-law links, and a few fields were aligned to that primary text (D.C. personal-use manufacture is restricted, not a total bar; Virginia HB 40 / 2026 Acts ch. 531 is enacted but mostly effective January 1 and July 1, 2027; Maine P.L. 2025, c. 537 serialization penalties begin January 1, 2027; Massachusetts 501 CMR 20 states an October 2, 2026 deadline to serialize previously made firearms). Education, not legal advice.",
		changed: [],
	},
];
