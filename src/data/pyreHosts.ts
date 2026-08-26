export type HostAccess = "public" | "gated" | "related";

export type PyreHost = {
	id: string;
	host: string;
	href: string;
	title: string;
	summary: string;
	access: HostAccess;
	paths?: { label: string; href: string }[];
};

export const HOST_ACCESS_LABEL: Record<HostAccess, string> = {
	public: "Public",
	gated: "Gated",
	related: "Related",
};

/**
 * Inventory of PyreArms hostnames. Add a row here when a new subdomain ships.
 * Read by hub.pyrearms.dev and by pyrearms.dev/sites.
 */
export const PYRE_HOSTS: PyreHost[] = [
	{
		id: "apex",
		host: "pyrearms.dev",
		href: "https://pyrearms.dev",
		title: "PyreArms",
		summary: "Federal PMF / NFA court desk, state map, blog, and PyreLink download.",
		access: "public",
		paths: [
			{ label: "Map", href: "https://pyrearms.dev/map" },
			{ label: "Blog", href: "https://pyrearms.dev/blog" },
			{ label: "Law", href: "https://pyrearms.dev/law" },
		],
	},
	{
		id: "www",
		host: "www.pyrearms.dev",
		href: "https://www.pyrearms.dev",
		title: "www alias",
		summary: "Same Worker as pyrearms.dev.",
		access: "public",
	},
	{
		id: "hub",
		host: "hub.pyrearms.dev",
		href: "https://hub.pyrearms.dev",
		title: "Host directory",
		summary: "This list. The cheat-sheet when the subdomain count gets away from you.",
		access: "public",
	},
	{
		id: "max",
		host: "max.pyrearms.dev",
		href: "https://max.pyrearms.dev",
		title: "Maximus Pyre links",
		summary: "Personal social hub. Not the law site.",
		access: "public",
	},
	{
		id: "watch",
		host: "watch.pyrearms.dev",
		href: "https://watch.pyrearms.dev",
		title: "Watch",
		summary: "Personal clip host. Password gated.",
		access: "gated",
	},
	{
		id: "fixtures",
		host: "test-fixtures.pyrearms.dev",
		href: "https://test-fixtures.pyrearms.dev",
		title: "Classification fixtures",
		summary: "Harborline simulation pages plus the fingerprint lab. HTTP Basic gated.",
		access: "gated",
		paths: [
			{ label: "Catalog", href: "https://test-fixtures.pyrearms.dev/" },
			{ label: "Fingerprint", href: "https://test-fixtures.pyrearms.dev/fingerprint" },
		],
	},
	{
		id: "desk",
		host: "desk.manticore.technology",
		href: "https://desk.manticore.technology",
		title: "Manticore Desk",
		summary: "Blogger / desk stack. Linked from the PyreArms footer.",
		access: "related",
	},
	{
		id: "sparks",
		host: "sparks.manticore.technology",
		href: "https://sparks.manticore.technology/?affiliate=maximuspyre",
		title: "Sparks",
		summary: "Related Manticore property on the max.pyrearms.dev link hub.",
		access: "related",
	},
];

export const HOST_GROUPS: { id: HostAccess; title: string }[] = [
	{ id: "public", title: "Public" },
	{ id: "gated", title: "Gated" },
	{ id: "related", title: "Related" },
];
