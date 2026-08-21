import { useEffect } from "react";

const SITE = "https://pyrearms.dev";
const DEFAULT_TITLE = "PyreArms";
const DEFAULT_DESC =
	"PyreArms — federal PMF and NFA court coverage, state statute cards, and open-source peer share.";

type MetaInput = {
	title: string;
	description: string;
	path?: string;
	type?: "website" | "article";
	publishedAt?: string;
	tags?: string[];
};

function setMeta(attr: "name" | "property", key: string, content: string) {
	let el = document.head.querySelector(`meta[${attr}="${key}"]`);
	if (!el) {
		el = document.createElement("meta");
		el.setAttribute(attr, key);
		document.head.appendChild(el);
	}
	el.setAttribute("content", content);
}

function setJsonLd(id: string, data: unknown) {
	let el = document.getElementById(id) as HTMLScriptElement | null;
	if (!el) {
		el = document.createElement("script");
		el.type = "application/ld+json";
		el.id = id;
		document.head.appendChild(el);
	}
	el.textContent = JSON.stringify(data);
}

/** Client-side title / description / Open Graph / JSON-LD for SPA routes. */
export function usePageMeta(input: MetaInput) {
	useEffect(() => {
		const prevTitle = document.title;
		const url = `${SITE}${input.path ?? window.location.pathname}`;
		document.title = input.title.includes("PyreArms")
			? input.title
			: `${input.title} · PyreArms`;
		setMeta("name", "description", input.description);
		setMeta("property", "og:title", input.title);
		setMeta("property", "og:description", input.description);
		setMeta("property", "og:url", url);
		setMeta("property", "og:type", input.type ?? "website");
		setMeta("property", "og:site_name", "PyreArms");
		setMeta("name", "twitter:card", "summary_large_image");
		setMeta("name", "twitter:title", input.title);
		setMeta("name", "twitter:description", input.description);

		const canonical =
			(document.querySelector(
				'link[rel="canonical"]',
			) as HTMLLinkElement | null) || document.createElement("link");
		if (!canonical.parentElement) {
			canonical.rel = "canonical";
			document.head.appendChild(canonical);
		}
		canonical.href = url;

		if (input.type === "article") {
			setJsonLd("pyre-jsonld-article", {
				"@context": "https://schema.org",
				"@type": "NewsArticle",
				headline: input.title,
				description: input.description,
				datePublished: input.publishedAt,
				author: { "@type": "Organization", name: "PyreArms" },
				publisher: {
					"@type": "Organization",
					name: "PyreArms",
					url: SITE,
				},
				mainEntityOfPage: url,
				keywords: input.tags?.join(", "),
			});
		} else {
			document.getElementById("pyre-jsonld-article")?.remove();
		}

		return () => {
			document.title = prevTitle;
			setMeta("name", "description", DEFAULT_DESC);
			document.getElementById("pyre-jsonld-article")?.remove();
		};
	}, [
		input.title,
		input.description,
		input.path,
		input.type,
		input.publishedAt,
		input.tags,
	]);
}

export { DEFAULT_TITLE, DEFAULT_DESC, SITE };
