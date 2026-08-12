# PyreLink protocol

Inconspicuous peer share connector. No accounts. No mandatory central registry.

## Share ticket (social paste)

```
pyrelink:1:<endpoint_id>:<sha256>[:<filename>]
```

Post this string on Reddit / Discord / etc. Recipients paste into PyreLink **Get**.

- `endpoint_id` — iroh public key of the host (keeps hosting while online)
- `sha256` — content hash of a **file** or a **project manifest**
- `filename` — optional label

No clearnet URL required. Persistence is “host stays online.”

## Projects

A project is a folder under the share root:

```
MyKit/
  .pyrelink.json          # name, description, thumbnail filename
  .pyrelink.manifest.json # content-addressed list (this file's hash is the share code)
  thumb.webp              # optional cover image
  part-a.stl
  part-b.stl
```

Manifest (`v: 1`, `kind: "project"`) lists `thumbnail` and `files` as `{ name, sha256, size }`.

Peers who paste a project ticket:

1. Fetch the manifest by hash
2. Fetch the thumbnail + each file by hash from the same peer
3. Rebuild a local project folder (and optionally mirror it into Host)

Catalog `list` returns projects with `kind: "project"`, optional `thumbnail_data_url` for UI previews, and loose root files as `kind: "file"`.

## Mirroring

Any peer can **Fetch & mirror**: download via a ticket, copy into their own share
folder, then publish a new ticket with *their* endpoint and the *same* hash
(for projects: same manifest hash / same content). Original authors are not a
distribution hub — PyreLink is a generic P2P tool.

## ALPN

```
pyrelink/share/1
```

JSON line requests over a QUIC bi-stream:

| op | body |
|----|------|
| `list` | — |
| `get` | `{ "name": "…" }` |
| `get_by_hash` | `{ "hash": "…" }` |

Success body for gets: one JSON meta line (`GetMeta`) then raw file bytes.
`get_by_hash` resolves loose files, project payloads, manifests, and thumbnails.

## Optional directory

`GET /api/connect` on a clearnet mirror may return `oracles: []` as a soft phonebook.

**Hard rule:** clearnet stores and returns **endpoint IDs only**. It must never
accept, store, or relay messages, files, projects, thumbnails, invites, or keys.
See `.cursor/rules/clearnet-phonebook-only.mdc` and `docs/OPSEC.md`.

## Rooms (boards / chat / DMs)

ALPN:

```
pyrelink/room/1
```

Invite (hash-first connection):

```
pyrelink:room:1:<kind>:<room_id>:<endpoint>[:<tail>]
```

| kind | `tail` | Encryption |
|------|--------|------------|
| `board` | label | plaintext |
| `chat` | 32-byte key (URL-safe base64) | E2E XChaCha20-Poly1305 |
| `dm` | same as chat | E2E (same crypto; social convention of 2 peers) |

For E2E rooms, `room_id = sha256("pyrelink-room-v1:" \|\| key)`. Boards use a random id.

Hub (invite `endpoint`) must stay online. Peers `join`, then `send`; hub fans out `push` frames and keeps an **in-memory** backlog (~80). No durable server store — see `docs/OPSEC.md`.

Ops (JSON lines on bi-streams): `join`, `send`, `leave` → `join_ok` / `push` / `ack` / `err`.
