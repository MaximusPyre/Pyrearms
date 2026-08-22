const HUB_BEACON = "https://watch.pyrearms.dev/hub-event";

type UADataBrand = { brand: string; version?: string };
type UAData = {
	brands?: UADataBrand[];
	mobile?: boolean;
	platform?: string;
};

function uaData(): UAData | undefined {
	return (navigator as Navigator & { userAgentData?: UAData }).userAgentData;
}

function brands(): string[] {
	return (uaData()?.brands || [])
		.map((b) => b.brand)
		.filter((b) => b && !/^not[\s._-]/i.test(b) && !/^chrom(e|ium)$/i.test(b));
}

export function hubContext() {
	const ua = uaData();
	const screenW = window.screen?.width || 0;
	const screenH = window.screen?.height || 0;
	return {
		ua: navigator.userAgent || "",
		language: navigator.language || "",
		languages: Array.isArray(navigator.languages) ? navigator.languages.slice(0, 6) : [],
		platform: ua?.platform || navigator.platform || "",
		mobile: typeof ua?.mobile === "boolean" ? ua.mobile : undefined,
		brands: brands(),
		screen: screenW && screenH ? `${screenW}x${screenH}` : "",
		viewport: `${window.innerWidth}x${window.innerHeight}`,
		referrer: document.referrer || "",
		touch: navigator.maxTouchPoints > 0,
	};
}

export function hubPing(kind: "view" | "click", link = "_page") {
	const body = JSON.stringify({ kind, link, ...hubContext() });
	try {
		navigator.sendBeacon(HUB_BEACON, new Blob([body], { type: "text/plain" }));
	} catch {
		void fetch(HUB_BEACON, {
			method: "POST",
			body,
			mode: "no-cors",
			keepalive: true,
		});
	}
}
