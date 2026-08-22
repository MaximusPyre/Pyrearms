/** First-party hub analytics — classify UA / client hints into coarse buckets. */

const GREASE = /^(not[\s._-]|chrom(e|ium)$)/i;

export function sanitizeKey(raw: string, max = 48): string {
	const trimmed = raw.trim().slice(0, max);
	if (!trimmed) return "";
	if (!/^[\w .+\-/#()]{1,48}$/u.test(trimmed)) return "";
	return trimmed;
}

export function clientBrands(brands: unknown): string[] {
	if (!Array.isArray(brands)) return [];
	return brands
		.map((b) => {
			if (typeof b === "string") return b;
			if (b && typeof b === "object" && "brand" in b && typeof b.brand === "string") {
				return b.brand;
			}
			return "";
		})
		.filter((b) => b && !GREASE.test(b));
}

export function classifyBrowser(ua: string, brands: string[] = []): string {
	const s = ua.toLowerCase();
	const brand = brands.map((b) => b.toLowerCase()).join(" ");

	if (/instagram/.test(s)) return "Instagram";
	if (/fban|fbav|fb_iab|fb4a|fbios/.test(s)) return "Facebook";
	if (/musical_ly|bytedancewebview|tiktok/.test(s)) return "TikTok";
	if (/snapchat/.test(s)) return "Snapchat";
	if (/\btwitter|twitterandroid/.test(s)) return "X";
	if (/linkedinapp/.test(s)) return "LinkedIn";
	if (/pinterest/.test(s)) return "Pinterest";
	if (/discord/.test(s)) return "Discord";
	if (/telegram/.test(s)) return "Telegram";
	if (/whatsapp/.test(s)) return "WhatsApp";

	if (/edg\/|edgios|edga/.test(s) || brand.includes("microsoft edge")) return "Edge";
	if (/opr\/|opera/.test(s) || brand.includes("opera")) return "Opera";
	if (/samsungbrowser/.test(s)) return "Samsung Internet";
	if (/firefox|fxios/.test(s) || brand.includes("firefox")) return "Firefox";
	if (/crios/.test(s)) return "Chrome";
	if (/chrome|crios|chromium/.test(s) || brand.includes("google chrome")) return "Chrome";
	if ((/safari/.test(s) || brand.includes("safari")) && !/android/.test(s)) return "Safari";
	if (/msie|trident/.test(s)) return "Internet Explorer";
	return "Other";
}

export function classifyOs(ua: string, platform = ""): string {
	const s = `${ua} ${platform}`.toLowerCase();
	if (/iphone|ipod/.test(s)) return "iOS";
	if (/ipad/.test(s) || (/macintosh/.test(s) && /mobile/.test(s))) return "iPadOS";
	if (/android/.test(s)) return "Android";
	if (/windows/.test(s)) return "Windows";
	if (/mac os x|macintosh|macintel/.test(s)) return "macOS";
	if (/cros/.test(s) || /chrome os/.test(s)) return "ChromeOS";
	if (/linux/.test(s)) return "Linux";
	return "Other";
}

export function classifyDevice(ua: string, mobileHint?: boolean): string {
	const s = ua.toLowerCase();
	if (/ipad|tablet|playbook|silk/.test(s)) return "Tablet";
	if (/android/.test(s) && !/mobile/.test(s)) return "Tablet";
	if (mobileHint === true) return "Phone";
	if (/mobi|iphone|ipod/.test(s)) return "Phone";
	if (/android/.test(s)) return "Phone";
	return "Desktop";
}

export function classifyReferrer(raw: string): string {
	if (!raw) return "Direct";
	let host = "";
	try {
		host = new URL(raw).hostname;
	} catch {
		host = raw.replace(/^https?:\/\//, "").split("/")[0] || "";
	}
	host = host.replace(/^www\./, "").toLowerCase();
	if (!host) return "Direct";
	if (host === "t.co" || host === "x.com" || host.endsWith(".x.com") || host === "twitter.com" || host.endsWith(".twitter.com")) {
		return "X";
	}
	if (host.includes("instagram")) return "Instagram";
	if (host.includes("snapchat")) return "Snapchat";
	if (host.includes("tiktok")) return "TikTok";
	if (host.includes("facebook") || host === "fb.com" || host === "m.me") return "Facebook";
	if (host.includes("youtube") || host === "youtu.be") return "YouTube";
	if (host.includes("google.")) return "Google";
	if (host.includes("reddit") || host === "redd.it") return "Reddit";
	if (host.includes("linkedin")) return "LinkedIn";
	if (host.endsWith("pyrearms.dev")) return "PyreArms";
	return sanitizeKey(host, 48) || "Other";
}

export function classifyLanguage(raw: string): string {
	const tag = raw.trim().split(",")[0]?.split(";")[0]?.trim() || "";
	if (!/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8}){0,2}$/.test(tag)) return "";
	return tag.slice(0, 12);
}

export function classifyCountry(raw: string): string {
	const code = raw.trim().toUpperCase();
	if (!/^[A-Z]{2}$/.test(code) || code === "XX") return "";
	return code;
}

export function bump(map: Record<string, number>, key: string, maxKeys = 80): void {
	const k = sanitizeKey(key) || "Other";
	if (!(k in map) && Object.keys(map).length >= maxKeys) {
		map.Other = (map.Other || 0) + 1;
		return;
	}
	map[k] = (map[k] || 0) + 1;
}
