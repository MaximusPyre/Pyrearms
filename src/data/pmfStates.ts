/** PMF state status — as of August 16, 2026.
 * Provisional classifications for education. Verify primary statutes before relying.
 * Prefer official code citations over advocacy trackers when they diverge.
 */

export type YesNoUnclear = "yes" | "no" | "unclear" | "restricted";
export type Tier = "green" | "yellow" | "orange" | "red" | "gray";

export type StatePmfRecord = {
	code: string;
	name: string;
	tier: Tier;
	/** Personal manufacture generally possible under state law? */
	personalManufacture: YesNoUnclear;
	serializationRequired: YesNoUnclear;
	registrationRequired: YesNoUnclear;
	fflOrBackgroundCheck: YesNoUnclear;
	unfinishedFramesRegulated: YesNoUnclear;
	threeDPrintRestricted: YesNoUnclear;
	saleTransferRestricted: YesNoUnclear;
	possessionRestricted: YesNoUnclear;
	specialAgeRules: YesNoUnclear;
	statute: string;
	effectiveNote: string;
	sources: { label: string; url: string }[];
	confidence: "high" | "medium" | "low";
	summary: string;
};

export const PMF_AS_OF = "August 16, 2026";

export const TIER_LABEL: Record<Tier, string> = {
	green: "Generally permitted (no state serialization mandate)",
	yellow: "Permitted with serialization / registration / transfer rules",
	orange: "Substantial restrictions (precursors, kits, or self-manufacture)",
	red: "Effectively prohibits or heavily restricts unserialized PMFs",
	gray: "Unclear / litigation / recent legislation — verify",
};

function fedOnly(name: string, code: string): StatePmfRecord {
	return {
		code,
		name,
		tier: "green",
		personalManufacture: "yes",
		serializationRequired: "no",
		registrationRequired: "no",
		fflOrBackgroundCheck: "no",
		unfinishedFramesRegulated: "no",
		threeDPrintRestricted: "no",
		saleTransferRestricted: "no",
		possessionRestricted: "no",
		specialAgeRules: "no",
		statute: "No dedicated state PMF serialization statute identified; federal baseline applies.",
		effectiveNote: `Re-verified ${PMF_AS_OF}`,
		sources: [
			{
				label: "ATF · Privately Made Firearms",
				url: "https://www.atf.gov/firearms/privately-made-firearms",
			},
		],
		confidence: "medium",
		summary:
			"No dedicated state PMF serialization or unfinished-frame statute identified on official codes or 2026 session-law searches. Federal ATF baseline applies. Confirm locally — statutes change.",
	};
}

const GREEN = [
	["AL", "Alabama"],
	["AK", "Alaska"],
	["AZ", "Arizona"],
	["AR", "Arkansas"],
	["FL", "Florida"],
	["GA", "Georgia"],
	["ID", "Idaho"],
	["IN", "Indiana"],
	["IA", "Iowa"],
	["KS", "Kansas"],
	["KY", "Kentucky"],
	["LA", "Louisiana"],
	["MI", "Michigan"],
	["MN", "Minnesota"],
	["MS", "Mississippi"],
	["MO", "Missouri"],
	["MT", "Montana"],
	["NE", "Nebraska"],
	["NH", "New Hampshire"],
	["NM", "New Mexico"],
	["NC", "North Carolina"],
	["ND", "North Dakota"],
	["OH", "Ohio"],
	["OK", "Oklahoma"],
	["PA", "Pennsylvania"],
	["SC", "South Carolina"],
	["SD", "South Dakota"],
	["TN", "Tennessee"],
	["TX", "Texas"],
	["UT", "Utah"],
	["WV", "West Virginia"],
	["WI", "Wisconsin"],
	["WY", "Wyoming"],
] as const;

const STATES: StatePmfRecord[] = [
	...GREEN.map(([code, name]) => fedOnly(name, code)),

	{
		code: "CA",
		name: "California",
		tier: "yellow",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "yes",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "yes",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "Cal. Penal Code §§ 29180–29182 (unique serial number / precursor parts)",
		effectiveNote: "Apply to DOJ for a unique serial number before manufacture; affix within 10 days. Polymer builds require embedded stainless steel.",
		sources: [
			{
				label: "Cal. Penal Code § 29180 (official)",
				url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=29180",
			},
			{
				label: "CA DOJ · Unique Serial Number regs (adopted text)",
				url: "https://www.oag.ca.gov/sites/all/files/agweb/pdfs/firearms/usna-text-of-adopt-regs.pdf",
			},
		],
		confidence: "high",
		summary:
			"Personal manufacture conditioned on obtaining a unique serial number and recording with DOJ. Unserialized possession is tightly restricted.",
	},
	{
		code: "CO",
		name: "Colorado",
		tier: "orange",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "no",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "yes",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "C.R.S. § 18-12-111.5 (unserialized firearms/frames) + § 18-12-119 (3D/CNC manufacture)",
		effectiveNote: "SB23-279 unserialized rules in force since 2024. HB26-1144 (3D/CNC manufacture ban) effective July 1, 2026.",
		sources: [
			{
				label: "Colorado GA · SB23-279 (unserialized firearms)",
				url: "https://leg.colorado.gov/bills/sb23-279",
			},
			{
				label: "Colorado GA · HB26-1144 (enacted; eff. July 1, 2026)",
				url: "https://leg.colorado.gov/bills/hb26-1144",
			},
		],
		confidence: "high",
		summary:
			"Unlicensed manufacture of unserialized firearms/frames is restricted; FFL serialization pathway exists. Since July 1, 2026, 3D printing or CNC milling of functional firearms or listed components is separately prohibited except for licensed manufacturers and accredited gunsmithing programs.",
	},
	{
		code: "CT",
		name: "Connecticut",
		tier: "yellow",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "yes",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "yes",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "Conn. Gen. Stat. § 29-36a (manufacture serial mark) + § 53-206j (unfinished frames)",
		effectiveNote: "DESPP unique serial number / unfinished-frame transfer regimen; undetectable plastics limited.",
		sources: [
			{
				label: "Conn. Gen. Stat. § 29-36a (CGA current)",
				url: "https://prdext2.cga.ct.gov/current/pub/chap_529.htm#sec_29-36a",
			},
			{
				label: "Conn. Gen. Stat. § 53-206j (CGA current)",
				url: "https://prdext2.cga.ct.gov/current/pub/chap_943.htm#sec_53-206j",
			},
		],
		confidence: "high",
		summary:
			"Completing manufacture requires a DESPP unique serial number and notice. Unfinished frames may be transferred only if serialized; undetectable firearms remain limited.",
	},
	{
		code: "DE",
		name: "Delaware",
		tier: "red",
		personalManufacture: "no",
		serializationRequired: "yes",
		registrationRequired: "unclear",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "yes",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "11 Del. C. § 1459A (unfinished frames) + § 1463 (untraceable / 3D manufacture)",
		effectiveNote: "Unserialized possession and unlicensed 3D manufacture/distribution of digital instructions are felonies.",
		sources: [
			{
				label: "11 Del. C. § 1459A (official code)",
				url: "https://delcode.delaware.gov/title11/c005/sc07/index.html#1459A",
			},
			{
				label: "11 Del. C. § 1463 (official code)",
				url: "https://delcode.delaware.gov/title11/c005/sc07/index.html#1463",
			},
		],
		confidence: "high",
		summary:
			"Prohibits possession of untraceable firearms and unserialized unfinished frames. Unlicensed 3D manufacture and distribution of printable firearm code are separate felonies.",
	},
	{
		code: "DC",
		name: "District of Columbia",
		tier: "red",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "yes",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "unclear",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "D.C. Code §§ 7-2502.02(c), 7-2504.01 (self-manufacture + registration)",
		effectiveNote: "Commercial manufacture is barred. Personal-use builds must be serialized before finishing the frame and registered with MPD.",
		sources: [
			{
				label: "D.C. Code § 7-2504.01 (official)",
				url: "https://code.dccouncil.gov/us/dc/council/code/sections/7-2504.01",
			},
			{
				label: "D.C. Code § 7-2502.02 (official)",
				url: "https://code.dccouncil.gov/us/dc/council/code/sections/7-2502.02",
			},
		],
		confidence: "high",
		summary:
			"Engaging in the business of manufacturing is prohibited. Personal-use self-manufacture is allowed only with a unique serial number and registration; unserialized ghost guns are not registerable.",
	},
	{
		code: "HI",
		name: "Hawaii",
		tier: "orange",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "yes",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "yes",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "HRS §§ 134-3 (registration) + 134-10.2 (unserialized parts / 3D production)",
		effectiveNote: "Unlicensed persons may not possess or 3D-print receivers/kits lacking a registerable serial number (class C felony).",
		sources: [
			{
				label: "HRS § 134-10.2 (official)",
				url: "https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0134/HRS_0134-0010_0002.htm",
			},
			{
				label: "HRS § 134-3 (official)",
				url: "https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0134/HRS_0134-0003.htm",
			},
		],
		confidence: "high",
		summary:
			"Chapter 134 registration plus a felony bar on unlicensed possession or 3D production of unserialized receivers and readily assembled kits.",
	},
	{
		code: "IL",
		name: "Illinois",
		tier: "red",
		personalManufacture: "no",
		serializationRequired: "yes",
		registrationRequired: "unclear",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "yes",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "720 ILCS 5/24-5.1 (unserialized firearms and unfinished frames)",
		effectiveNote: "Possession/transfer of unserialized firearms and unfinished frames prohibited after the 2022 phase-in; 3D-printed items must be serialized.",
		sources: [
			{
				label: "720 ILCS 5/24-5.1 (ILGA official)",
				url: "https://www.ilga.gov/legislation/ilcs/fulltext.asp?DocName=072000050K24-5.1",
			},
		],
		confidence: "high",
		summary:
			"State law prohibits sale, transfer, and possession of unserialized firearms and unfinished frames, including 3D-printed items, except narrow FFL and antique exceptions.",
	},
	{
		code: "ME",
		name: "Maine",
		tier: "yellow",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "no",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "restricted",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "25 M.R.S. §§ 2036–2039 + 17-A M.R.S. § 1060 (P.L. 2025, c. 537 / LD 1126)",
		effectiveNote: "Enacted Jan 11, 2026 (unsigned). Serialization via FFL with a background check; specified possession/transfer penalties begin Jan 1, 2027.",
		sources: [
			{
				label: "Maine Legislature · LD 1126 / P.L. 2025, c. 537",
				url: "https://legislature.maine.gov/legis/bills/display_ps.asp?LD=1126&snum=132",
			},
		],
		confidence: "high",
		summary:
			"Requires FFL-imprinted serial numbers on firearms and unfinished frames, including 3D/CNC-made frames. Personal manufacture is a serialization pathway, not a ban. Penalty provisions for unserialized possession/transfer start January 1, 2027.",
	},
	{
		code: "MD",
		name: "Maryland",
		tier: "red",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "yes",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "unclear",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "Md. Public Safety Art. § 5-703 (unserialized firearms / unfinished frames)",
		effectiveNote: "Marking + Secretary registration pathway; possession rule in force since March 1, 2023.",
		sources: [
			{
				label: "Md. Public Safety § 5-703 (MGALEG official)",
				url: "https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gps&section=5-703",
			},
			{
				label: "MSP · Registration of unserialized PMFs (Jun 1, 2022)",
				url: "https://news.maryland.gov/msp/2022/05/31/registration-of-unserialized-privately-made-firearms-in-effect-as-of-june-1-2022/",
			},
		],
		confidence: "high",
		summary:
			"Requires personal identification / serial marking and registration pathways for unserialized firearms and unfinished frames.",
	},
	{
		code: "MA",
		name: "Massachusetts",
		tier: "yellow",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "yes",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "restricted",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "G.L. c. 140, § 121C (serialization / PMFs) + G.L. c. 269, § 11C (untraceable firearms)",
		effectiveNote: "Request a DCJIS serial number before manufacture and register within 7 days. 501 CMR 20 sets an Oct 2, 2026 deadline to serialize previously made firearms.",
		sources: [
			{
				label: "G.L. c. 140, § 121C (official)",
				url: "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXX/Chapter140/Section121C",
			},
			{
				label: "G.L. c. 269, § 11C (official)",
				url: "https://malegislature.gov/Laws/GeneralLaws/PartIV/TitleI/Chapter269/Section11C",
			},
		],
		confidence: "high",
		summary:
			"PMFs must receive a DCJIS serial number during manufacture and be registered. Untraceable firearms may not be manufactured, transferred, or possessed. Existing unserialized firearms have a stated serialization deadline of October 2, 2026.",
	},
	{
		code: "NV",
		name: "Nevada",
		tier: "red",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "unclear",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "unclear",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "NRS 202.3625, 202.363, 202.3635, 202.364 (unserialized firearms and unfinished frames)",
		effectiveNote: "2021 enactments effective January 1, 2022. Manufacture/assembly of unserialized firearms and possession of unserialized unfinished frames are generally unlawful.",
		sources: [
			{
				label: "NRS 202.3635 (official)",
				url: "https://www.leg.state.nv.us/nrs/nrs-202.html#NRS202Sec3635",
			},
			{
				label: "NRS 202.364 (official)",
				url: "https://www.leg.state.nv.us/nrs/nrs-202.html#NRS202Sec364",
			},
		],
		confidence: "high",
		summary:
			"Unserialized manufacture/assembly and possession/transfer of unserialized firearms and unfinished frames are generally prohibited, with antique and FFL exceptions.",
	},
	{
		code: "NJ",
		name: "New Jersey",
		tier: "red",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "yes",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "yes",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "N.J.S. 2C:39-9(l) (3D manufacture/distribution) + 2C:39-3(o) (digital instructions; P.L. 2025, c. 255)",
		effectiveNote: "P.L. 2025, c. 255 (A4975) approved Jan 12, 2026: unlicensed possession of firearm digital instructions with intent to manufacture is a fourth-degree crime.",
		sources: [
			{
				label: "P.L. 2025, c. 255 (official session law)",
				url: "https://pub.njleg.state.nj.us/Bills/2024/AL25/255_.PDF",
			},
			{
				label: "N.J.S. 2C:39-9 (3D manufacture / digital distribution)",
				url: "https://law.justia.com/codes/new-jersey/title-2c/section-2c-39-9/",
			},
		],
		confidence: "high",
		summary:
			"Unlicensed 3D manufacture and distribution of printable firearm code are already crimes. The 2026 chapter adds a possession-of-digital-instructions offense when the person intends to manufacture a firearm.",
	},
	{
		code: "NY",
		name: "New York",
		tier: "red",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "yes",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "yes",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "N.Y. Penal Law §§ 265.01, 265.07 (Jose Webster / unfinished frames) + FY 2026–27 budget Part C (3D printers / digital files)",
		effectiveNote: "Unserialized possession already barred. FY 2026–27 budget (signed May 27, 2026) adds 3D-print manufacture, digital-file, and printer-blocking workgroup provisions.",
		sources: [
			{
				label: "N.Y. Penal Law § 265.01 (official)",
				url: "https://www.nysenate.gov/legislation/laws/PEN/265.01",
			},
			{
				label: "N.Y. Penal Law § 265.07 (official)",
				url: "https://www.nysenate.gov/legislation/laws/PEN/265.07",
			},
			{
				label: "NYS Assembly · FY 2026–27 enacted budget A10005C",
				url: "https://assembly.ny.gov/2026budget/2026_bills/enacted/A10005c.pdf",
			},
		],
		confidence: "high",
		summary:
			"Unserialized PMFs and unfinished frames are banned/heavily regulated. The 2026 budget adds criminal limits on 3D-printed guns and digital manufacturing files, plus a printer-blocking feasibility workgroup.",
	},
	{
		code: "OR",
		name: "Oregon",
		tier: "red",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "unclear",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "yes",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "ORS 166.265–166.267 (HB 2005, 2023; undetectable / unserialized / unfinished frames)",
		effectiveNote: "Sale/transfer of unserialized firearms and unfinished frames restricted in 2023; possession ban effective September 1, 2024.",
		sources: [
			{
				label: "Oregon Legislature · HB 2005 (2023 enrolled)",
				url: "https://olis.oregonlegislature.gov/liz/2023R1/Downloads/MeasureDocument/HB2005/Enrolled",
			},
			{
				label: "ORS 166.267 (unfinished frames)",
				url: "https://oregon.public.law/statutes/ors_166.267",
			},
		],
		confidence: "high",
		summary:
			"Unserialized firearms and unfinished frames may not be sold or possessed (with FFL/antique exceptions). Undetectable / all-plastic 3D firearms are separately prohibited.",
	},
	{
		code: "RI",
		name: "Rhode Island",
		tier: "red",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "unclear",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "yes",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "R.I. Gen. Laws §§ 11-47-2, 11-47-8(e) (ghost guns / 3D-printed firearms)",
		effectiveNote: "Unlicensed manufacture, sale, transfer, or possession of a ghost gun, undetectable firearm, or any 3D-printed firearm is a felony (Type 07 FFL exception).",
		sources: [
			{
				label: "R.I. Gen. Laws § 11-47-8 (official)",
				url: "https://webserver.rilegislature.gov/statutes/title11/11-47/11-47-8.htm",
			},
			{
				label: "R.I. Gen. Laws § 11-47-2 (definitions)",
				url: "https://webserver.rilegislature.gov/statutes/title11/11-47/11-47-2.htm",
			},
		],
		confidence: "high",
		summary:
			"Ghost guns, undetectable firearms, and any firearm produced by a 3D printing process are barred except for federally licensed manufacturers.",
	},
	{
		code: "VT",
		name: "Vermont",
		tier: "red",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "unclear",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "restricted",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "13 V.S.A. §§ 4083–4084 (Act 120 / S.209; unserialized firearms, frames, unfinished frames)",
		effectiveNote: "Unserialized possession/transfer/manufacture (including by 3D printer) prohibited after the February 2025 compliance date; FFL imprint pathway in § 4084.",
		sources: [
			{
				label: "13 V.S.A. § 4083 (official)",
				url: "https://legislature.vermont.gov/statutes/section/13/085/04083",
			},
			{
				label: "Vermont Act 120 (S.209) as enacted",
				url: "https://legislature.vermont.gov/Documents/2024/Docs/ACTS/ACT120/ACT120%20As%20Enacted.pdf",
			},
		],
		confidence: "high",
		summary:
			"Unserialized firearms, frames, and unfinished frames may not be possessed, transferred, or manufactured unless an FFL imprints a serial number.",
	},
	{
		code: "VA",
		name: "Virginia",
		tier: "orange",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "no",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "yes",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "Va. Code §§ 18.2-308.5, 18.2-308.5:2 (2026 Acts ch. 531 / HB 40)",
		effectiveNote: "Approved April 10, 2026. Most § 18.2-308.5:2 rules (manufacture/sale/transfer of unserialized firearms and unfinished frames) take effect January 1, 2027; possession ban (subsection C) July 1, 2027. Plastic/undetectable limits in § 18.2-308.5 are already in force.",
		sources: [
			{
				label: "Virginia LIS · HB 40 (2026; ch. 531)",
				url: "https://lis.virginia.gov/bill-details/20261/HB40",
			},
			{
				label: "HB 40 enrolled text (official)",
				url: "https://lis.virginia.gov/bill-details/20261/HB40/text/HB40ER",
			},
			{
				label: "Va. Code § 18.2-308.5 (official; 2026 cc. 531, 532)",
				url: "https://law.lis.virginia.gov/vacode/title18.2/chapter7/section18.2-308.5/",
			},
		],
		confidence: "high",
		summary:
			"Enacted 2026 law will prohibit manufacture, sale, transfer, and (later) possession of unserialized firearms and unfinished frames, with an FFL serialization pathway. Those new sections are not yet in force; plastic/undetectable restrictions already apply.",
	},
	{
		code: "WA",
		name: "Washington",
		tier: "red",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "unclear",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "yes",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "RCW 9.41.190, 9.41.326, 9.41.327 (untraceable / unfinished frames; ESHB 2320 / 2026 c 203)",
		effectiveNote: "Untraceable-firearm and unfinished-frame bans already in force. ESHB 2320 (effective March 24, 2026) adds 3D/CNC manufacture and digital-code limits; one section delayed to June 30, 2027.",
		sources: [
			{
				label: "RCW 9.41.326 (official)",
				url: "https://app.leg.wa.gov/RCW/default.aspx?cite=9.41.326",
			},
			{
				label: "Washington Legislature · ESHB 2320 / 2026 c 203",
				url: "https://app.leg.wa.gov/billsummary/?BillNumber=2320&Year=2026",
			},
		],
		confidence: "high",
		summary:
			"Unserialized PMFs and unfinished frames are already banned. The 2026 act further limits 3D/CNC manufacture and digital firearm manufacturing code.",
	},
];

export const PMF_STATES: StatePmfRecord[] = STATES.sort((a, b) =>
	a.name.localeCompare(b.name),
);

export function getState(code: string): StatePmfRecord | undefined {
	return PMF_STATES.find((s) => s.code === code.toUpperCase());
}
