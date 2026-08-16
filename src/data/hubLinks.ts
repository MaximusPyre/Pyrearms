import { X_URL } from "../lib/social";

export type HubLink = {
	id: string;
	label: string;
	href: string;
	wip?: boolean;
};

/** Edit hrefs here when handles change. Shown only on max.pyrearms.dev */
export const HUB_LINKS: HubLink[] = [
	{ id: "x", label: "X", href: X_URL },
	{ id: "pyrearms", label: "PyreArms", href: "https://pyrearms.dev" },
	{
		id: "onlyfans",
		label: "OnlyFans",
		href: "https://onlyfans.com/maximuspyre",
		wip: true,
	},
	{ id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@maximusunbound" },
	{ id: "snapchat", label: "Snapchat", href: "https://www.snapchat.com/add/maximuspyre" },
];
