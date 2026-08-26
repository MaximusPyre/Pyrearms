import type { HostAccess, PyreHost } from "../../src/data/pyreHosts.ts";
import { HOST_ACCESS_LABEL } from "../../src/data/pyreHosts.ts";

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />`;

const CSS = `
:root {
  --bg: #000;
  --ink: #f3e6d8;
  --ink-dim: #a89586;
  --ember: #ff6a1a;
  --molten: #ff9a2e;
  --line: rgba(196, 55, 28, 0.45);
  --font-display: "Cinzel", "Times New Roman", serif;
  --font-body: "IBM Plex Sans", "Segoe UI", sans-serif;
}
* { box-sizing: border-box; }
html, body {
  margin: 0;
  min-height: 100%;
  background: #000;
  color: var(--ink);
  font-family: var(--font-body);
}
body {
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(180, 40, 10, 0.22), transparent 55%),
    linear-gradient(180deg, #050202 0%, #000 50%);
}
a { color: var(--molten); text-decoration: none; }
a:hover { color: #ffc06a; }
.wrap {
  max-width: 44rem;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 3.5rem;
}
.mark {
  display: inline-block;
  width: 0.7rem;
  height: 1.1rem;
  margin-bottom: 0.75rem;
  background: linear-gradient(180deg, var(--molten), #c42318);
  clip-path: polygon(50% 0%, 100% 35%, 70% 35%, 70% 100%, 30% 100%, 30% 35%, 0% 35%);
}
.eyebrow {
  margin: 0;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.72rem;
  color: var(--ember);
}
h1 {
  margin: 0.35rem 0 0.8rem;
  font-family: var(--font-display);
  letter-spacing: 0.08em;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
}
.lede { color: var(--ink-dim); line-height: 1.55; margin: 0 0 1.5rem; }
h2 {
  margin: 1.8rem 0 0.7rem;
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ember);
}
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.75rem; }
.card {
  display: block;
  padding: 1rem 1.1rem 1.05rem;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(196, 55, 28, 0.16), rgba(8, 3, 2, 0.92));
  color: var(--ink);
}
.card:hover { border-color: var(--ember); color: var(--ink); }
.host {
  display: block;
  font-family: ui-monospace, "Cascadia Code", monospace;
  font-size: 0.92rem;
  color: var(--molten);
}
.title { display: block; margin-top: 0.2rem; font-weight: 700; }
.summary { margin: 0.35rem 0 0; color: var(--ink-dim); font-size: 0.92rem; line-height: 1.45; }
.badge {
  display: inline-block;
  margin-left: 0.45rem;
  padding: 0.08rem 0.4rem;
  border-radius: 999px;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid var(--line);
  color: var(--ink-dim);
}
.badge.gated { color: #ffc06a; border-color: rgba(255, 192, 106, 0.45); }
.paths { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-top: 0.55rem; }
.paths a { font-size: 0.82rem; }
.fine { margin-top: 2rem; color: var(--ink-dim); font-size: 0.85rem; }
`;

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function card(host: PyreHost): string {
	const paths = (host.paths || [])
		.map(
			(path) =>
				`<a href="${escapeHtml(path.href)}">${escapeHtml(path.label)}</a>`,
		)
		.join("");
	return `<li class="card">
  <a class="host" href="${escapeHtml(host.href)}">${escapeHtml(host.host)}<span class="badge ${escapeHtml(host.access)}">${escapeHtml(HOST_ACCESS_LABEL[host.access])}</span></a>
  <span class="title">${escapeHtml(host.title)}</span>
  <p class="summary">${escapeHtml(host.summary)}</p>
  ${paths ? `<p class="paths">${paths}</p>` : ""}
</li>`;
}

export function directoryPage(
	hosts: PyreHost[],
	groups: { id: HostAccess; title: string }[],
): string {
	const sections = groups
		.map((group) => {
			const rows = hosts.filter((host) => host.access === group.id);
			if (!rows.length) return "";
			return `<h2>${escapeHtml(group.title)}</h2>
<ul class="list">
  ${rows.map(card).join("\n")}
</ul>`;
		})
		.join("\n");

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PyreArms host directory</title>
  <meta name="description" content="All PyreArms subdomains and related hosts in one list.">
  ${FONT}
  <style>${CSS}</style>
</head>
<body>
  <main class="wrap">
    <span class="mark" aria-hidden="true"></span>
    <p class="eyebrow">PyreArms</p>
    <h1>Host directory</h1>
    <p class="lede">Every pyrearms.dev hostname currently in the repo, plus the related Manticore hosts we actually link. Add a row in <code>src/data/pyreHosts.ts</code> when another subdomain ships.</p>
    ${sections}
    <p class="fine"><a href="https://pyrearms.dev">pyrearms.dev</a> · <a href="/hosts.json">hosts.json</a></p>
  </main>
</body>
</html>`;
}
