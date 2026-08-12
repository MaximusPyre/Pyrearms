# PyreLink OPSEC / privacy audit

This is a practical threat model for PyreLink users — not a guarantee, not legal
advice. Bring your own discipline; the app does not make you invisible.

## What PyreLink is (and isn’t)

| Claim | Reality |
|-------|---------|
| No accounts / no central chat server | True for design. Optional clearnet `/api/connect` is only a soft phonebook of **endpoint IDs**. |
| Ephemeral rooms | True on the wire: hub backlog is **in-memory**. Optional **local-only** disk cache is user QoL on their device — never uploaded. |
| E2E for chat/DM | Contents encrypted with invite key (XChaCha20-Poly1305). **Boards are plaintext.** |
| Anonymous | **False.** You have a durable endpoint public key on disk (`oracle.key`). |

## Clearnet phonebook (non-negotiable)

The Cloudflare Worker / site API:

- **MAY** publish a short list of iroh endpoint IDs (admin-managed) so peers can find a live bootstrap host.
- **MUST NEVER** store, distribute, relay, or handle messages, files, projects, thumbnails, room invites, E2E keys, or any other user content.

Content lives on peers via PyreLink P2P only. R2 / product / download tables are removed from this role.

## What observers can see

### Network / transport
- **iroh (QUIC)** with NAT holepunching and **n0 relays** when direct paths fail.
  Relay operators may see that your endpoint is talking to another endpoint
  (timing, volume, peer IDs) even when payloads are E2E.
- Your **public endpoint ID** is embedded in every share/room invite you mint.
  Anyone with an invite can correlate later invites from the same machine identity
  unless you wipe `oracle.key` and regenerate.
- Posting invites on Reddit/Discord/X exposes **metadata to those platforms**
  forever (endpoint ID, room hash, for E2E rooms the **room key itself**).

### Files / projects
- Recipients receive plaintext file bytes (by design). Hash only proves integrity,
  not secrecy.
- `list` catalogs may include **thumbnail data URLs** when peers list you —
  treat thumbs as public.

### Rooms
- **Board**: anyone who joins (or MITMs the hub path without E2E) reads messages.
  Hub operator can read everything. Backlog (≤80 msgs) is RAM-only on hub.
- **Chat / DM**: ciphertext on the wire and in hub backlog. Hub does **not** need
  plaintext to relay, but **every invite holder has the key**. Forward the invite
  = forward the conversation secret. There is **no forward secrecy** and **no
  per-member ratchet** in v1.
- Nicknames are **cosmetic and spoofable**. Real session label is endpoint ID.
- No offline delivery: if hub is down, messages vanish (by design).

## Local device risks

- Persistent identity: `~/.local/share/PyreLink/oracle.key` (path varies by OS).
- Share folder / library / downloaded projects are **plaintext on disk**.
- Room history is RAM-only on the hub. If you enable **local message cache**,
  plaintext (for boards) or decrypted plaintext (for E2E) is written under your
  user data dir (`message_cache/`) — **this device only**, never clearnet.
  Disable or clear the cache when you need less disk residue.
- Clipboard: invites (and E2E keys!) are often copied — clipboard managers sync
  to cloud on some OS configs.

## Threats this does **not** defeat

- Compromised endpoint operator on your machine
- Malicious invite pasted into public logs (full E2E key leak for chat/DM)
- Legal process against you, your ISP, or a relay/cloud you touch
- Screenshot / camera / cohabitant attackers
- Supply-chain malice in dependencies or binary you download
- Traffic analysis linking your clearnet posts of invites to your endpoint

## Suggested OPSEC posture (user-owned)

1. **Assume invites are credentials.** Prefer private channels for chat/DM invites.
   Never post E2E invites in public threads if the content is sensitive.
2. **Separate identities** for sensitive work: new OS user / VM / fresh
   `oracle.key`, separate share folder. Rotate by deleting identity when done.
3. **Don’t host forever.** Long-lived hubs + same endpoint = long correlation
   window. Bring room up, finish, go offline.
4. **Boards are public.** Use chat/DM for anything actionable; boards for
   low-sensitivity coordination only.
5. **Don’t put real names, addresses, phone, or payment details** in rooms or
   filenames — thumbnails and filenames travel.
6. **VPN/Tor** can hide ISP→relay IP mapping but can also mark you; know your
   adversary. iroh relays still see endpoint IDs.
7. **Verify peers out of band** when stakes are high — PyreLink does not
   authenticate humans behind nicknames.
8. **Legal hygiene ≠ OPSEC.** Local firearms law, PMF rules, and platform ToS
   are separate from crypto properties. Follow applicable law; this app is a
   tool, not a shield.

## Quick rating (honesty)

| Goal | Fit |
|------|-----|
| Avoid a central PyreArms message database | Strong |
| Casual privacy among trust-circle peers | Reasonable (chat/DM + private invites) |
| Resist nation-state traffic analysis | Weak |
| Deniable “never used this” after device seize | Weak (disk artifacts, invites elsewhere) |
| Public board with no persistent server | Strong (while hub online) |

If you need higher assurance, use purpose-built tools (offline air-gapped file
exchange, Signal/Session/etc. with audited ratchets) for the sensitive part,
and keep PyreLink for what it is: a P2P share + ephemeral coordination layer.
