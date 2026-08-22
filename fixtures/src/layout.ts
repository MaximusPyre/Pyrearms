export type PageOptions = {
	title: string;
	fixtureId: string;
	bodyClass: string;
	body: string;
	redirectTo?: string;
	redirectSeconds?: number;
};

export function renderPage(options: PageOptions): string {
	const redirectMeta =
		options.redirectTo &&
		options.redirectTo.startsWith("/") &&
		options.redirectSeconds &&
		options.redirectSeconds > 0
			? `<meta http-equiv="refresh" content="${options.redirectSeconds};url=${options.redirectTo}">`
			: "";
	const redirectAttrs =
		options.redirectTo && options.redirectTo.startsWith("/")
			? ` data-redirect-to="${options.redirectTo}" data-redirect-after="${options.redirectSeconds ?? 0}"`
			: "";

	return `<!DOCTYPE html>
<html lang="en" data-test-fixture="true" data-fixture-id="${options.fixtureId}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="referrer" content="no-referrer">
  ${redirectMeta}
  <title>${options.title}</title>
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/fixtures.css">
</head>
<body class="${options.bodyClass}" data-test-fixture="true"${redirectAttrs}>
<!-- TEST FIXTURE: simulation page only. Form values are discarded locally and never stored, logged, or transmitted. -->
${options.body}
<script src="/assets/fixtures.js"></script>
</body>
</html>`;
}
