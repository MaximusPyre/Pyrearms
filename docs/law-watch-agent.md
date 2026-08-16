# Law-watch agent playbook

Daily Cursor automation on `MaximusPyre/Pyrearms` (`main`). Education only — never legal advice. Phonebook Worker stays file-free.

## Always check (not just state PMF statutes)

Primary sources first: CourtListener / RECAP PDFs, PACER captions, Congress.gov, GovInfo, eCFR, ATF.gov, official state codes and session laws.

Scan for **new or moved** U.S. firearms legal actions, including:

- District / circuit / Supreme Court opinions, injunctions, stays, and appeals (NFA, suppressors/silencers, SBR/SBS, AOW, PMF / “ghost guns,” 3D-printed firearms, serialization, registration)
- ATF final rules, open letters, and Form 1 / Form 4 practice
- Enacted bills and signed session laws (50 states + D.C. + federal)

Do **not** treat advocacy blogs, Fox, or membership emails as the last word. Quote the order.

## When something material happens

1. Prepend a dated post in `src/data/lawBlog.ts` (what changed, effective date, case caption / bill number, links to the opinion or statute).
2. If it is time-sensitive for readers, set or update an **active** banner in `src/data/lawAlerts.ts` (homepage + law page). Retire stale alerts (`active: false`) when stayed, reversed, or superseded.
3. Update `src/pages/Legal.tsx` (and map data in `src/data/pmfStates.ts`) only when the holding or statute actually changes the educational summary.
4. Open **one PR** on `main`.

## Scope language (copy this discipline)

If a court limits relief to **named plaintiffs, members, and customers (current and future)**, say so. Do not write “the NFA is repealed for everyone.” Note state bans still apply. Note Form 4473 / GCA background checks may still apply. Flag appeal risk.

## Membership / customer coverage

When an injunction is party-specific, list **named organizational plaintiffs** people can actually join (with official join URLs) and **named commercial plaintiffs** whose *customers* the order mentions — plus the court’s limits (e.g. only transactions with those plaintiffs). Do not invent extra groups.

## No-change days

Still prepend a short “verified, no material new action” watch note. Do not bump `PMF_AS_OF` unless the fifty-state map was re-verified.
