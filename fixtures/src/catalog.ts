import { renderPage } from "./layout.ts";
import {
	accountVerificationPage,
	discardedPage,
	fingerprintPage,
	loginPage,
	paymentUpdatePage,
	sessionExpiredPage,
	urgentActionPage,
} from "./pages.ts";

export type FixtureDefinition = {
	id: string;
	path: string;
	title: string;
	summary: string;
	signals: string[];
	redirectTo?: string;
	redirectSeconds?: number;
	hasPostForm?: boolean;
	extraScripts?: string[];
	bodyClass: string;
	render: () => string;
};

/**
 * Register new simulation pages here. Each entry is served at `path`
 * and listed on the dashboard and in GET /catalog.json.
 */
export const FIXTURES: FixtureDefinition[] = [
	{
		id: "login",
		path: "/login",
		title: "Member sign-in",
		summary: "Login form with password field and an unusual unlock button.",
		signals: ["login-form", "password-field", "unusual-button", "hidden-next"],
		bodyClass: "page-login",
		render: loginPage,
	},
	{
		id: "account-verification",
		path: "/account-verification",
		title: "Account verification",
		summary: "Warning banner, identity fields, and a skip-to-billing control.",
		signals: ["account-warning", "identity-form", "unusual-button"],
		bodyClass: "page-verify",
		render: accountVerificationPage,
	},
	{
		id: "session-expired",
		path: "/session-expired",
		title: "Session expired",
		summary: "Timeout interstitial with a one-click restore action and local redirect to sign-in.",
		signals: ["session-timeout", "unusual-button", "local-redirect"],
		bodyClass: "page-expired",
		render: sessionExpiredPage,
	},
	{
		id: "payment-update",
		path: "/payment-update",
		title: "Payment update",
		summary: "Card-update form, decline warning, and an alternative-wallet button.",
		signals: ["payment-form", "urgency-message", "unusual-button"],
		bodyClass: "page-pay",
		render: paymentUpdatePage,
	},
	{
		id: "urgent-action",
		path: "/urgent-action",
		title: "Urgent action",
		summary: "High-urgency alert, countdown, and automatic local redirect to verification.",
		signals: ["urgency-message", "countdown", "local-redirect", "unusual-button"],
		bodyClass: "page-urgent",
		redirectTo: "/account-verification",
		redirectSeconds: 8,
		render: urgentActionPage,
	},
	{
		id: "fingerprint",
		path: "/fingerprint",
		title: "Browser fingerprint",
		summary: "Local fingerprint lab: record this browser and compare it with a snapshot from another browser.",
		signals: ["fingerprint", "local-only", "compare"],
		bodyClass: "page-fingerprint",
		hasPostForm: false,
		extraScripts: ["/assets/fingerprint.js"],
		render: fingerprintPage,
	},
];

export function renderFixture(fixture: FixtureDefinition): string {
	return renderPage({
		title: `${fixture.title} — Harborline Member Services`,
		fixtureId: fixture.id,
		bodyClass: fixture.bodyClass,
		body: fixture.render(),
		redirectTo: fixture.redirectTo,
		redirectSeconds: fixture.redirectSeconds,
		extraScripts: fixture.extraScripts,
	});
}

export function renderDiscarded(): string {
	return renderPage({
		title: "Submission discarded — Harborline Fixture Lab",
		fixtureId: "discarded",
		bodyClass: "page-discarded",
		body: discardedPage(),
	});
}

export function catalogPayload(hostname: string) {
	return {
		host: hostname,
		brand: "Harborline Member Services",
		purpose:
			"Deterministic HTML fixtures for URL and webpage classification. Simulation only.",
		dataHandling:
			"Form submissions are intercepted locally and discarded. Values are never stored, logged, or transmitted.",
		fixtures: FIXTURES.map((fixture) => ({
			id: fixture.id,
			path: fixture.path,
			title: fixture.title,
			summary: fixture.summary,
			signals: fixture.signals,
			redirectTo: fixture.redirectTo ?? null,
		})),
	};
}
