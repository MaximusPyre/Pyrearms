# PyreArms + PyreLink

Open-source, creator-less peer share for files, projects, and ephemeral rooms.

- **PyreArms** — clearnet site: federal PMF / ATF law education + download PyreLink
- **PyreLink** — desktop P2P app (Tauri + iroh): Host / Get / Rooms with pasteable hash invites

## How sharing works (no middleman)

1. Open PyreLink → **Host** → pick a folder → **Go online**
2. **Copy share code** on a file or project (`pyrelink:1:<endpoint>:<hash>:name`)
3. Post that code on social media (not a website link)
4. Someone else → **Get** → paste code → **Fetch** (optionally mirror)
5. Keep Host online while peers download

Projects are folders with a content-addressed manifest + optional thumbnail. One share code pulls the whole kit over P2P.

## Rooms (boards · chat · DMs)

- Join via `pyrelink:room:1:…` invites (hash + bootstrap endpoint)
- **Boards** — plaintext, ephemeral hub
- **Chat / DMs** — E2E (XChaCha20-Poly1305); invite holds the key
- Optional **local-only** message cache on your device — never uploaded

See [docs/PROTOCOL.md](docs/PROTOCOL.md) and [docs/OPSEC.md](docs/OPSEC.md).

## Clearnet (optional phonebook)

Live site: **https://pyrearms.dev** (also `www.pyrearms.dev`)

Host directory: **https://hub.pyrearms.dev** — add new subdomains in [`src/data/pyreHosts.ts`](src/data/pyreHosts.ts)

Private classification fixtures: **https://test-fixtures.pyrearms.dev** — see [fixtures/README.md](fixtures/README.md)

```bash
nvm use 22
npm install
npm run db:migrate:local
npm run dev
# production
npm run db:migrate:remote
npm run deploy
npm run deploy:watch
npm run deploy:fixtures
npm run deploy:hub
```

`GET /api/connect` may list **iroh endpoint IDs only** so peers can find a live bootstrap host. It is **not required** when using share codes.

**Hard rule:** clearnet must never store, distribute, or relay messages, files, projects, thumbnails, invites, or keys. Content stays on peers via PyreLink P2P.
## PyreLink app

Builds and releases: [github.com/MaximusPyre/Pyrearms](https://github.com/MaximusPyre/Pyrearms) · [Releases](https://github.com/MaximusPyre/Pyrearms/releases)

```bash
cd app
npm install
npm run tauri:dev
npm run tauri:build
```

Clearnet site (this repo’s Worker) never hosts the binaries — download from GitHub Releases only.
## License

MIT — see [LICENSE](LICENSE).

## Donations

If this work helps you, ETH donations are appreciated.

**Address**

```
0xE0402cBc952c106353b4B00d30A694EC9299aA5E
```

Scan with a wallet that supports `ethereum:` URIs:

![Donate ETH QR](docs/donate-eth-qr.png)
