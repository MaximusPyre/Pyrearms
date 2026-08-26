# Classification fixture host

Private Cloudflare Worker that serves deterministic HTML fixtures so another application can evaluate webpages with known characteristics.

Production hostname: `test-fixtures.pyrearms.dev` (override `routes` and `FIXTURES_HOSTNAME` in `wrangler.jsonc`).

These pages are simulations. They must never collect, transmit, log, or store anything typed into a form.

## Local

```bash
cp fixtures/.dev.vars.example fixtures/.dev.vars
npm run dev:fixtures
```

Open `http://localhost:8788` with HTTP Basic `fixtures` / `local-dev-only`, or send `Authorization: Bearer local-dev-token`.

```bash
npm run test:fixtures
```

## Production

```bash
npx wrangler secret put FIXTURES_BASIC_PASSWORD -c fixtures/wrangler.jsonc
npx wrangler secret put FIXTURES_ACCESS_TOKEN -c fixtures/wrangler.jsonc
npm run deploy:fixtures
```

GitHub Actions deploys this Worker alongside the main site and `watch` Worker.

### Access control (environment)

| Variable | Where | Purpose |
| --- | --- | --- |
| `FIXTURES_HOSTNAME` | wrangler `vars` | Public hostname shown on the catalog |
| `FIXTURES_BASIC_USER` | wrangler `vars` | HTTP Basic username (default `fixtures`) |
| `FIXTURES_BASIC_PASSWORD` | secret | HTTP Basic password |
| `FIXTURES_ACCESS_TOKEN` | secret | `Authorization: Bearer` or `X-Fixtures-Token` |
| `FIXTURES_AUTH_MODE` | wrangler `vars` | `on` (default) or `off` for local-only open access |
| `FIXTURES_ALLOW_QUERY_TOKEN` | wrangler `vars` | `true` to allow `?token=` (off by default; tokens can leak in logs) |

If auth is `on` and neither password nor token is set, the Worker returns `503` (fail closed).

`GET /robots.txt` is unauthenticated so crawlers can read `Disallow: /`. Every other path requires credentials.

## Adding a fixture

1. Add a renderer in `src/pages.ts`.
2. Append one object to `FIXTURES` in `src/catalog.ts` (`path`, `title`, `summary`, `signals`, `bodyClass`, `render`).
3. Put extra CSS in `public/assets/fixtures.css` and extra images in `public/assets/`.
4. Keep every URL local. Do not add third-party CSS, JS, fonts, analytics, or images.
5. Forms must `POST` to a same-origin path. The Worker discards mutating bodies; `fixtures.js` also cancels submit in the browser.

The catalog at `/` and `GET /catalog.json` pick up new entries automatically.

## Fingerprint lab

`/fingerprint` measures this browser locally (UA, screen, canvas, WebGL, audio, fonts, WebRTC host candidates). It never uploads the snapshot.

To compare the sandbox with your everyday browser:

1. Open `/fingerprint` in the everyday browser → **Copy snapshot**.
2. Open `/fingerprint` in the sandbox → paste → **Compare**.
3. Matching hash means the sandbox looks the same. Differing keys are the isolation delta.

**Record in this browser** only writes `localStorage` in that profile. It is not a cross-browser store.

## Fixture guarantees

- `<html data-test-fixture="true">` and `<meta name="robots" content="noindex,nofollow,noarchive">`
- `X-Robots-Tag: noindex, nofollow, noarchive`
- CSP that blocks outbound `connect-src`
- Fictional Harborline branding only
