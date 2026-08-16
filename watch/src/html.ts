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
  padding: 0.7rem 0;
}
.share { word-break: break-all; color: var(--molten); }
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
      <input type="password" name="password" required autofocus />
      <button type="submit">Enter</button>
    </form>`,
	);
}

export function uploadPage(
	origin: string,
	clips: { id: string; title: string }[],
	notice?: string,
): string {
	const rows = clips
		.map(
			(c) =>
				`<li><a href="/v/${encodeURIComponent(c.id)}">${escapeHtml(c.title)}</a><br /><span class="share">${escapeHtml(`${origin}/v/${c.id}`)}</span></li>`,
		)
		.join("");
	return page(
		"Upload · watch",
		`
    <p class="eyebrow">Private desk</p>
    <h1>New clip</h1>
    <p class="lede">MP4 / WebM / MOV, about 90&nbsp;MB max. You get a link to send people.</p>
    ${notice ? `<p class="share">${escapeHtml(notice)}</p>` : ""}
    <form method="post" action="/upload" enctype="multipart/form-data">
      <label>Title</label>
      <input type="text" name="title" placeholder="optional" />
      <label>Video</label>
      <input type="file" name="file" accept="video/mp4,video/webm,video/quicktime" required />
      <button type="submit">Upload</button>
    </form>
    <form method="post" action="/logout"><button type="submit">Log out</button></form>
    <ul class="list">${rows || "<li class='lede'>Nothing uploaded yet.</li>"}</ul>`,
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
    <button type="button" onclick="navigator.clipboard.writeText(${JSON.stringify(url)})">Copy link</button>
    `,
	);
}

export function notFoundPage(): string {
	return page(
		"Missing · watch",
		`<p class="eyebrow">Watch</p><h1>No clip</h1><p class="lede">That link does not point at a video.</p>`,
	);
}
