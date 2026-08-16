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
