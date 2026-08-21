export type BodycamStateStatus = "ready" | "soon";

export type BodycamStateGuide = {
	slug: string;
	name: string;
	statute: string;
	status: BodycamStateStatus;
	summary: string;
};

export const BODYCAM_STATES: BodycamStateGuide[] = [
	{
		slug: "pennsylvania",
		name: "Pennsylvania",
		statute: "Act 22 · 42 Pa.C.S. Chapter 67A",
		status: "ready",
		summary:
			"Not Right-to-Know. File within 60 days by hand delivery or certified mail. Walk through the OOR Act 22 form here.",
	},
];

export function bodycamStateBySlug(slug: string) {
	return BODYCAM_STATES.find((s) => s.slug === slug);
}
