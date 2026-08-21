# Cheap state legislation watch

The daily Cursor law-watch agent is the expensive path. **State bills do not need it.**

## Split

| Job | Tool | Cadence | Why |
|---|---|---|---|
| 50-state + D.C. bill titles mentioning ghost guns / unserialized / unfinished frames / 3D-printed firearms | GitHub Action + LegiScan API (`scripts/state-pmf-watch.mjs`) | Weekly Monday 14:00 UTC, or `workflow_dispatch` | ~51 HTTP calls, no LLM |
| Federal courts, ATF rules, NFA injunctions, map rewrites | Cursor agent (`docs/law-watch-agent.md`) | Only when something material hits | Needs reading an opinion |

## Setup

1. Free key: [legiscan.com/legiscan](https://legiscan.com/legiscan)
2. GitHub repo secret `LEGISCAN_API_KEY`
3. Action opens a PR if `src/data/stateBills.generated.ts` changed
4. Local: `LEGISCAN_API_KEY=... npm run watch:states`

Without the secret the job exits 0 and does nothing.

## What it writes

Hits land on each state page (`/law/pa`, `/law/ca`, …) under **Session law & bills**. Manual enacted items stay in `src/data/stateBills.ts` so a noisy scrape cannot delete the map’s primary cites.

The Action does **not** auto-edit `pmfStates.ts`. A human still updates the map when a bill actually becomes law.

## Query

`unserialized OR "ghost gun" OR "unfinished frame" OR "privately made firearm" OR "3D printed firearm"`, then a title regex so random “firearm” bills do not flood the list.

## Not on the Worker

This is git data, same as the map. Do not scrape bills into D1/R2. Phonebook Worker stays file-free.
