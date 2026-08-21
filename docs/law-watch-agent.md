# Law-watch agent playbook

Daily Cursor automation on `MaximusPyre/Pyrearms` (`main`). Education only — never legal advice. Phonebook Worker stays file-free.

**Do not use this agent to scrape 50 state legislatures.** That is a cheap LegiScan cron: `docs/state-legislation-watch.md` and `.github/workflows/state-pmf-watch.yml`. Keep this agent narrow so it stays affordable.

## Always check (federal + courts — not a 50-state bill dump)

Primary sources first: CourtListener / RECAP PDFs, PACER captions, Congress.gov, GovInfo, eCFR, ATF.gov.

Scan for **new or moved** U.S. firearms legal actions, including:

- District / circuit / Supreme Court opinions, injunctions, stays, and appeals (NFA, suppressors/silencers, SBR/SBS, AOW, PMF / “ghost guns,” 3D-printed firearms, serialization, registration)
- ATF final rules, open letters, and Form 1 / Form 4 practice
- Enacted federal bills only (Congress.gov). State session law is the LegiScan job unless a **signed** state act actually changes `src/data/pmfStates.ts`

Do **not** treat advocacy blogs, Fox, or membership emails as the last word. Quote the order.

## When something material happens

Write a **full public blog article**, not a dump of verify notes.

1. Prepend a new entry in `src/data/lawBlog.ts` (`BLOG_POSTS`) with:
   - URL-safe `slug` (news headline style)
   - `title`, one-line `dek`, `date` / `publishedAt`
   - `tags` (court, statute family)
   - `blocks`: short news paragraphs, `h2` sections (What the court held / Who is covered / What this is not / Bottom line), optional `quote` from the opinion, closing disclaimer
   - `sources`: RECAP / GovInfo / official org pages only
2. Set or update an **active** banner in `src/data/lawAlerts.ts` with `href` pointing at `/blog/<slug>`. Retire stale alerts (`active: false`) when stayed, reversed, or superseded.
3. Update `src/pages/Legal.tsx` (and map data in `src/data/pmfStates.ts`) only when the holding or statute actually changes the educational summary.
4. Open **one PR** on `main`.

Tone: readable news desk (clear who/what/when/coverage limits), not a docket dump and not a membership pitch. Never claim a nationwide repeal when relief is party-specific.

## Scope language (copy this discipline)

If a court limits relief to **named plaintiffs, members, and customers (current and future)**, say so. Do not write “the NFA is repealed for everyone.” Note state bans still apply. Note Form 4473 / GCA background checks may still apply. Flag appeal risk.

## Membership / customer coverage

When an injunction is party-specific, list **named organizational plaintiffs** people can actually join (with official join URLs) and **named commercial plaintiffs** whose *customers* the order mentions — plus the court’s limits (e.g. only transactions with those plaintiffs). Do not invent extra groups.

## No-change days

**Do not open a PR.** Do not prepend “Verified — no material new action” posts to the public blog. Those notes made the watch page unreadable. Silent no-op is correct. Do not bump `PMF_AS_OF` unless the fifty-state map was re-verified. Do not open a 50-state scrape PR from this agent.
