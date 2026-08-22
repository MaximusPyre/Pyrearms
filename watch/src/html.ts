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
  max-width: 42rem;
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
  margin: 0.35rem 0 1rem;
  font-family: var(--font-display);
  letter-spacing: 0.08em;
  font-size: clamp(1.5rem, 4vw, 2.1rem);
}
.lede { color: var(--ink-dim); line-height: 1.5; }
.player {
  width: 100%;
  background: #000;
  border: 1px solid var(--line);
}
.player video { display: block; width: 100%; max-height: 78vh; background: #000; }
.btn, button, input[type="submit"] {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.7rem 1.1rem;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(196, 55, 28, 0.28), rgba(8, 3, 2, 0.95));
  color: var(--ink);
  font: inherit;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
}
.btn:hover, button:hover { color: #ffc06a; }
input[type="password"], input[type="text"], input[type="file"] {
  display: block;
  width: 100%;
  margin: 0.5rem 0 1rem;
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--line);
  background: #0a0706;
  color: var(--ink);
  font: inherit;
}
label { color: var(--ink-dim); font-size: 0.88rem; }
.err { color: #ff8a70; }
.list { list-style: none; padding: 0; margin: 1.5rem 0 0; }
.list li {
  border-top: 1px solid var(--line);
  padding: 1rem 0;
}
.share { word-break: break-all; color: var(--molten); }
.row-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.55rem; }
.row-actions a, .row-actions button {
  margin-top: 0;
  min-height: 2.6rem;
  padding: 0.65rem 0.9rem;
}
input[type="password"] { font-size: 16px; }
nav.desk-nav { display: flex; gap: 1rem; margin: 0 0 1.25rem; font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; }
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 1.5rem;
}
@media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } }
.stat-block h2 {
  margin: 1.75rem 0 0.35rem;
  font-family: var(--font-display);
  letter-spacing: 0.08em;
  font-size: 1rem;
}
.stat-block .list { margin-top: 0.4rem; }
.stat-block .list li { padding: 0.7rem 0; }
.lede-tight { color: var(--ink-dim); line-height: 1.45; font-size: 0.92rem; }
`;

function page(title: string, body: string): string {
	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  ${FONT}
  <style>${CSS}</style>
</head>
<body>
  <div class="wrap">
    <span class="mark" aria-hidden="true"></span>
    ${body}
  </div>
  <script>
    async function copyText(t) {
      try { await navigator.clipboard.writeText(t); }
      catch { prompt("Copy this link", t); }
    }
    async function shareLink(t, title) {
      if (navigator.share) {
        try { await navigator.share({ title: title || "Clip", url: t }); return; }
        catch (e) { if (e && e.name === "AbortError") return; }
      }
      await copyText(t);
    }
  </script>
</body>
</html>`;
}

export function escapeHtml(s: string): string {
	return s
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

export function loginPage(error?: string): string {
	return page(
		"Upload · watch",
		`
    <p class="eyebrow">Maximus Pyre</p>
    <h1>Upload</h1>
    <p class="lede">Passworded. Public share links after you post a clip.</p>
    ${error ? `<p class="err">${escapeHtml(error)}</p>` : ""}
    <form method="post" action="/login">
      <label>Password</label>
      <input type="password" name="password" required autofocus autocomplete="current-password" />
      <button type="submit">Enter</button>
    </form>
    <p class="lede">Same password on your phone at this page lists every clip you uploaded from a computer.</p>`,
	);
}

function deskPage(
	origin: string,
	clips: { id: string; title: string }[],
	heading: string,
	lede: string,
	showForm: boolean,
	notice?: string,
): string {
	const rows = clips
		.map((c) => {
			const url = `${origin}/v/${c.id}`;
			const safeUrl = JSON.stringify(url);
			const safeTitle = JSON.stringify(c.title);
			return `<li>
        <a href="/v/${encodeURIComponent(c.id)}">${escapeHtml(c.title)}</a>
        <p class="share">${escapeHtml(url)}</p>
        <div class="row-actions">
          <a class="btn" href="/v/${encodeURIComponent(c.id)}">Open</a>
          <button type="button" onclick='copyText(${safeUrl})'>Copy</button>
          <button type="button" onclick='shareLink(${safeUrl}, ${safeTitle})'>Share</button>
        </div>
      </li>`;
		})
		.join("");
	return page(
		`${heading} · watch`,
		`
    <nav class="desk-nav">
      <a href="/upload">Upload</a>
      <a href="/clips">All links</a>
      <a href="/hub-stats">Hub stats</a>
    </nav>
    <p class="eyebrow">Private desk</p>
    <h1>${escapeHtml(heading)}</h1>
    <p class="lede">${escapeHtml(lede)}</p>
    ${notice ? `<p class="share">${escapeHtml(notice)}</p>` : ""}
    ${
			showForm
				? `
    <form method="post" action="/upload" enctype="multipart/form-data">
      <label>Title</label>
      <input type="text" name="title" placeholder="optional" />
      <label>Video</label>
      <input type="file" name="file" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" required />
      <button type="submit">Upload</button>
    </form>`
				: ""
		}
    <form method="post" action="/logout"><button type="submit">Log out</button></form>
    <h2 class="eyebrow" style="margin-top:2rem">Your links</h2>
    <ul class="list">${rows || "<li class='lede'>Nothing uploaded yet.</li>"}</ul>`,
	);
}

export function uploadPage(
	origin: string,
	clips: { id: string; title: string }[],
	notice?: string,
): string {
	return deskPage(
		origin,
		clips,
		"New clip",
		"MP4 / WebM / MOV, about 90 MB max. After you upload on a computer, open All links on your phone with the same password.",
		true,
		notice,
	);
}

export function clipsPage(
	origin: string,
	clips: { id: string; title: string }[],
): string {
	return deskPage(
		origin,
		clips,
		"All links",
		"Everything you have uploaded. Copy or share from this phone.",
		false,
	);
}

export function playerPage(id: string, title: string, origin: string): string {
	const url = `${origin}/v/${id}`;
	const src = `/file/${encodeURIComponent(id)}`;
	return page(
		`${title} · watch`,
		`
    <p class="eyebrow">Maximus Pyre</p>
    <h1>${escapeHtml(title)}</h1>
    <div class="player">
      <video controls playsinline preload="metadata" src="${src}"></video>
    </div>
    <p class="lede">Share this page:</p>
    <p class="share">${escapeHtml(url)}</p>
    <div class="row-actions">
      <button type="button" onclick='copyText(${JSON.stringify(url)})'>Copy link</button>
      <button type="button" onclick='shareLink(${JSON.stringify(url)}, ${JSON.stringify(title)})'>Share</button>
    </div>
    `,
	);
}

export type HubStatsView = {
	views: number;
	clicks: Record<string, number>;
	browsers: Record<string, number>;
	os: Record<string, number>;
	devices: Record<string, number>;
	countries: Record<string, number>;
	referrers: Record<string, number>;
	languages: Record<string, number>;
	recent: Array<{
		t: string;
		kind: string;
		link: string;
		browser: string;
		os: string;
		device: string;
		country: string;
		referrer: string;
		language: string;
	}>;
};

function countRows(map: Record<string, number>, total: number): string {
	const rows = Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
	if (!rows.length) return "<li class='lede'>None yet.</li>";
	return rows
		.map(([name, n]) => {
			const pct = total > 0 ? Math.round((n / total) * 100) : 0;
			return `<li><strong>${escapeHtml(name)}</strong> — ${n} <span class="lede">(${pct}%)</span></li>`;
		})
		.join("");
}

function fmtTime(iso: string): string {
	const d = Date.parse(iso);
	if (!Number.isFinite(d)) return iso;
	return new Date(d).toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");
}

export function hubStatsPage(stats: HubStatsView, labels: Record<string, string>): string {
	const { views } = stats;
	const ids = [...new Set([...Object.keys(labels), ...Object.keys(stats.clicks)])].sort();
	const clickRows = ids
		.map((id) => {
			const n = stats.clicks[id] || 0;
			const name = labels[id] || id;
			return `<li><strong>${escapeHtml(name)}</strong> — ${n} click${n === 1 ? "" : "s"}</li>`;
		})
		.join("");
	const recent = stats.recent
		.map((row) => {
			const action =
				row.kind === "click"
					? `clicked ${labels[row.link] || row.link || "link"}`
					: "viewed hub";
			const bits = [row.browser, row.os, row.device, row.country, row.language, row.referrer]
				.filter(Boolean)
				.join(" · ");
			return `<li><strong>${escapeHtml(fmtTime(row.t))}</strong> — ${escapeHtml(action)}<br /><span class="lede-tight">${escapeHtml(bits)}</span></li>`;
		})
		.join("");
	return page(
		"Hub stats · watch",
		`
    <nav class="desk-nav">
      <a href="/upload">Upload</a>
      <a href="/clips">All links</a>
      <a href="/hub-stats">Hub stats</a>
    </nav>
    <p class="eyebrow">max.pyrearms.dev</p>
    <h1>Hub stats</h1>
    <p class="lede">Page views: <strong>${views}</strong>. Breakdowns are from page views. No IP addresses or raw user-agents are stored.</p>
    <div class="stat-block">
      <h2>Clicks</h2>
      <ul class="list">${clickRows || "<li class='lede'>No clicks yet.</li>"}</ul>
    </div>
    <div class="stats-grid">
      <div class="stat-block">
        <h2>Browsers</h2>
        <ul class="list">${countRows(stats.browsers, views)}</ul>
      </div>
      <div class="stat-block">
        <h2>Operating systems</h2>
        <ul class="list">${countRows(stats.os, views)}</ul>
      </div>
      <div class="stat-block">
        <h2>Devices</h2>
        <ul class="list">${countRows(stats.devices, views)}</ul>
      </div>
      <div class="stat-block">
        <h2>Countries</h2>
        <ul class="list">${countRows(stats.countries, views)}</ul>
      </div>
      <div class="stat-block">
        <h2>Referrers</h2>
        <ul class="list">${countRows(stats.referrers, views)}</ul>
      </div>
      <div class="stat-block">
        <h2>Languages</h2>
        <ul class="list">${countRows(stats.languages, views)}</ul>
      </div>
    </div>
    <div class="stat-block">
      <h2>Recent</h2>
      <ul class="list">${recent || "<li class='lede'>No events yet.</li>"}</ul>
    </div>
    <p class="lede">Counts start from when tracking went live. Refresh this page anytime.</p>
    <form method="post" action="/logout"><button type="submit">Log out</button></form>`,
	);
}

export function notFoundPage(): string {
	return page(
		"Missing · watch",
		`<p class="eyebrow">Watch</p><h1>No clip</h1><p class="lede">That link does not point at a video.</p>`,
	);
}
