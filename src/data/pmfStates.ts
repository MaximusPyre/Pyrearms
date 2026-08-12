/** PMF state status — as of August 11, 2026.
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

export const PMF_AS_OF = "August 11, 2026";

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
		effectiveNote: `Compiled ${PMF_AS_OF}`,
		sources: [
			{
				label: "ATF · Privately Made Firearms",
				url: "https://www.atf.gov/firearms/privately-made-firearms",
			},
		],
		confidence: "medium",
		summary:
			"No state PMF serialization/registration scheme flagged in secondary surveys as of the as-of date. Confirm locally — statutes change.",
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
		statute: "Cal. Penal Code §§ 29180 et seq. (self-manufacture / unique serial number)",
		effectiveNote: "Unique serial number / recording regime; verify current DOJ guidance.",
		sources: [
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
		statute: "Colorado PMF / precursor and 3D-print restrictions (recent session acts — verify)",
		effectiveNote: "2023–2026 legislative wave on precursors and 3D printing; confirm session law text.",
		sources: [
			{
				label: "Stateline · 2026 3D-print / unserialized restrictions",
				url: "https://stateline.org/2026/06/11/more-states-restrict-3d-printed-firearms/",
			},
		],
		confidence: "medium",
		summary:
			"Serialization / precursor and 3D-related restrictions apply. Treat as substantial state overlay on federal baseline.",
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
		statute: "Conn. Gen. Stat. ghost-gun / unfinished frame provisions (verify current §)",
		effectiveNote: "Serialization / reporting regimen; undetectable plastics limited.",
		sources: [
			{
				label: "Everytown tracker (secondary)",
				url: "https://everytownresearch.org/rankings/law/ghost-guns-regulated/",
			},
		],
		confidence: "medium",
		summary:
			"Requires serialization/reporting pathways for PMFs and regulates unfinished frames and undetectable firearms.",
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
		statute: "Delaware unserialized / 3D-print prohibitions (verify current Title 11)",
		effectiveNote: "Secondary sources treat DE as banning unserialized PMFs / 3D production paths.",
		sources: [
			{
				label: "Everytown tracker (secondary)",
				url: "https://everytownresearch.org/rankings/law/ghost-guns-regulated/",
			},
		],
		confidence: "medium",
		summary:
			"Heavily restricts or prohibits unserialized PMFs, unfinished frames, and 3D-print instruction distribution.",
	},
	{
		code: "DC",
		name: "District of Columbia",
		tier: "red",
		personalManufacture: "no",
		serializationRequired: "yes",
		registrationRequired: "yes",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "unclear",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "D.C. Code firearm registration / manufacturing restrictions",
		effectiveNote: "DC registration regime is among the strictest; confirm before any build.",
		sources: [
			{
				label: "D.C. Code via Council (verify)",
				url: "https://code.dccouncil.gov/",
			},
		],
		confidence: "medium",
		summary: "Unserialized PMFs are effectively barred under DC’s registration and manufacturing rules.",
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
		statute: "HRS Ch. 134 (registration) + PMF / 3D restrictions",
		effectiveNote: "Registration culture + ghost-gun style overlay.",
		sources: [
			{
				label: "Everytown tracker (secondary)",
				url: "https://everytownresearch.org/rankings/law/ghost-guns-regulated/",
			},
		],
		confidence: "medium",
		summary: "Serialization, registration, and 3D limits create a heavy state overlay.",
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
		statute: "Illinois ghost-gun / FOID-era PMF restrictions (e.g. HB 4383 lineage — verify)",
		effectiveNote: "Secondary sources treat Illinois as prohibiting unserialized PMFs.",
		sources: [
			{
				label: "Illinois General Assembly (verify bill / Act)",
				url: "https://www.ilga.gov/",
			},
		],
		confidence: "medium",
		summary: "State law heavily restricts manufacture/possession of unserialized PMFs and precursor parts.",
	},
	{
		code: "ME",
		name: "Maine",
		tier: "yellow",
		personalManufacture: "restricted",
		serializationRequired: "yes",
		registrationRequired: "unclear",
		fflOrBackgroundCheck: "yes",
		unfinishedFramesRegulated: "yes",
		threeDPrintRestricted: "unclear",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "Maine serialization / component-parts rules (verify 2024–2026 enactments)",
		effectiveNote: "Trackers diverge; classified yellow pending primary-code confirm.",
		sources: [
			{
				label: "Everytown tracker (secondary)",
				url: "https://everytownresearch.org/rankings/law/ghost-guns-regulated/",
			},
		],
		confidence: "low",
		summary: "Reportedly requires serialization / background-check treatment for components — confirm statute text.",
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
		effectiveNote: "Marking + registration portal regime effective mid-2022 with later deadlines.",
		sources: [
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
		threeDPrintRestricted: "unclear",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "Massachusetts ghost-gun / firearms ID overlay (verify current G.L. c. 140)",
		effectiveNote: "Serialization + reporting requirements reported by secondary trackers.",
		sources: [
			{
				label: "Everytown tracker (secondary)",
				url: "https://everytownresearch.org/rankings/law/ghost-guns-regulated/",
			},
		],
		confidence: "medium",
		summary: "State overlay requires serialization/reporting for PMFs and regulates precursor parts.",
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
		statute: "Nevada unserialized firearm prohibitions (2023+ — verify NRS chapter)",
		effectiveNote: "Secondary sources list NV among states treating unserialized PMFs as illegal.",
		sources: [
			{
				label: "World Population Review summary (secondary)",
				url: "https://worldpopulationreview.com/state-rankings/ghost-gun-legality-by-state",
			},
		],
		confidence: "medium",
		summary: "Unserialized PMF possession/manufacture tightly restricted under state law.",
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
		statute: "N.J.S.A. ghost-gun / digital-file provisions (verify 2C & 2025–2026 amendments)",
		effectiveNote: "Includes 3D digital-instruction limits in recent legislation.",
		sources: [
			{
				label: "Stateline · 2026 3D / unserialized wave",
				url: "https://stateline.org/2026/06/11/more-states-restrict-3d-printed-firearms/",
			},
		],
		confidence: "medium",
		summary: "Manufacture, possession, sale, and digital 3D instructions for unserialized firearms are heavily restricted.",
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
		statute: "Jose Webster Untraceable Firearms Act + 2026 budget 3D-printer measures",
		effectiveNote: "Serialization mandatory; 2026 budget adds printer-blocking workgroup mandates.",
		sources: [
			{
				label: "Stateline · NY 2026 budget 3D provisions",
				url: "https://stateline.org/2026/06/11/more-states-restrict-3d-printed-firearms/",
			},
		],
		confidence: "high",
		summary: "Unserialized PMFs and unfinished frames are banned/heavily regulated; 3D paths further restricted.",
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
		statute: "Oregon unserialized / undetectable / 3D restrictions (verify ORS)",
		effectiveNote: "Secondary trackers list OR among unserialized bans.",
		sources: [
			{
				label: "World Population Review summary (secondary)",
				url: "https://worldpopulationreview.com/state-rankings/ghost-gun-legality-by-state",
			},
		],
		confidence: "medium",
		summary: "State law heavily restricts unserialized PMFs and related 3D manufacture pathways.",
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
		statute: "Rhode Island unserialized / 3D restrictions (verify R.I. Gen. Laws)",
		effectiveNote: "Listed among strongest unserialized bans in secondary trackers.",
		sources: [
			{
				label: "Stateline · RI among strongest restrictions",
				url: "https://stateline.org/2026/06/11/more-states-restrict-3d-printed-firearms/",
			},
		],
		confidence: "medium",
		summary: "Unserialized PMFs and 3D-print pathways are heavily restricted.",
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
		threeDPrintRestricted: "unclear",
		saleTransferRestricted: "yes",
		possessionRestricted: "yes",
		specialAgeRules: "unclear",
		statute: "Vermont ghost-gun / unfinished frame acts (verify)",
		effectiveNote: "Secondary sources treat VT as illegal for unserialized PMFs.",
		sources: [
			{
				label: "World Population Review summary (secondary)",
				url: "https://worldpopulationreview.com/state-rankings/ghost-gun-legality-by-state",
			},
		],
		confidence: "medium",
		summary: "Unserialized PMF manufacture/possession tightly restricted.",
	},
	{
		code: "VA",
		name: "Virginia",
		tier: "orange",
		personalManufacture: "restricted",
		serializationRequired: "unclear",
		registrationRequired: "no",
		fflOrBackgroundCheck: "unclear",
		unfinishedFramesRegulated: "unclear",
		threeDPrintRestricted: "yes",
		saleTransferRestricted: "yes",
		possessionRestricted: "unclear",
		specialAgeRules: "unclear",
		statute: "2026 Virginia enactments on 3D-printed / unserialized manufacturing (verify chapter)",
		effectiveNote: "New 2026 legislation — map marked orange; confirm effective dates.",
		sources: [
			{
				label: "Stateline · VA 2026 enactments",
				url: "https://stateline.org/2026/06/11/more-states-restrict-3d-printed-firearms/",
			},
		],
		confidence: "low",
		summary: "Recent 2026 restrictions on 3D / unserialized manufacture — verify before relying.",
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
		statute: "SB 5078 lineage + 2026 3D/CNC restrictions (verify RCW)",
		effectiveNote: "Unserialized bans expanded; 2026 adds 3D/CNC and digital-file limits.",
		sources: [
			{
				label: "Stateline · WA 2026 3D/CNC law",
				url: "https://stateline.org/2026/06/11/more-states-restrict-3d-printed-firearms/",
			},
		],
		confidence: "high",
		summary: "Unserialized PMFs banned/heavily restricted; 2026 law further limits 3D/CNC manufacture.",
	},
];

export const PMF_STATES: StatePmfRecord[] = STATES.sort((a, b) =>
	a.name.localeCompare(b.name),
);

export function getState(code: string): StatePmfRecord | undefined {
	return PMF_STATES.find((s) => s.code === code.toUpperCase());
}
