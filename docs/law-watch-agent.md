# Law-watch agent playbook

Daily Cursor automation on `MaximusPyre/Pyrearms` (`main`). Education only — never legal advice. Phonebook Worker stays file-free.

**Schedule tip:** Do **not** run at `:00` (especially 9:00 AM). Cursor rate-limits automations when too many concurrent cloud runs start on the hour. Prefer an off-peak minute (e.g. **9:17 AM EDT** or **2:23 PM EDT**).

**Do not scrape 50 state legislatures in this agent.** That is a cheap LegiScan cron: `docs/state-legislation-watch.md` and `.github/workflows/state-pmf-watch.yml`. This agent writes **one blog article per run**.

## Goal

**One blog post per day. Always.**

1. If there is material court / ATF / federal news → write that.
2. If not → **find a related topic** readers still need and write that.
3. Never publish “nothing happened,” “verified no change,” or a status stub.

Quiet-day posts still count as real articles: a useful angle on PMF / NFA / state rules that ends at the map.

## Always check (federal + courts — not a 50-state bill dump)

Primary sources first: CourtListener / RECAP PDFs, PACER captions, Congress.gov, GovInfo, eCFR, ATF.gov.

Scan for **new or moved** U.S. firearms legal actions, including:

- District / circuit / Supreme Court opinions, injunctions, stays, and appeals (NFA, suppressors/silencers, SBR/SBS, AOW, PMF / “ghost guns,” 3D-printed firearms, serialization, registration)
- ATF final rules, open letters, and Form 1 / Form 4 practice
- Enacted federal bills only (Congress.gov). State session law is the LegiScan job unless a **signed** state act actually changes `src/data/pmfStates.ts`

Do **not** treat advocacy blogs, Fox, or membership emails as the last word. Quote the order.

## Every run (required)

Write **exactly one** new entry at the top of `BLOG_POSTS` in `src/data/lawBlog.ts`.

### A) Material news day

Full public article:

1. URL-safe `slug`, news-style `title`, one-line `dek`, `date` / `publishedAt` (today)
2. Optional `hook` (one sharp line for cards / home)
3. `tags`, `blocks` (`p` / `h2` / optional `ul` / `quote` / one `cta` to `/map` / optional mid-article `{ type: "ad" }`)
4. `sources`: RECAP / GovInfo / official pages only
5. Set an **active** banner in `src/data/lawAlerts.ts` with `href` → `/blog/<slug>`. Retire stale alerts (`active: false`) when stayed, reversed, or superseded.
6. Update `src/pages/Legal.tsx` and/or `src/data/pmfStates.ts` only when the holding or statute actually changes the educational summary.

### B) Quiet day — pick a related topic

Still publish. Do **not** silent no-op. Do **not** write that nothing happened.

**How to choose the topic** (pick one; avoid repeating a slug or near-duplicate title already in `BLOG_POSTS`):

1. Deepen a recent news post (coverage traps, who is / isn’t a party, what state law still does)
2. Spotlight one hard state from `src/data/pmfStates.ts` (serialization, unfinished-frame ban, possession) and send readers to `/map` + `/law/<state>`
3. Explain a recurring confusion (frame vs receiver kit, polymer80-era rules vs current eCFR, Form 1 vs Form 4 after a tax change, suppressor + state ban, detectability, interstate travel with a PMF)
4. Walk a “five-minute map check” scenario tied to a real statute cite already on the site

Write 600–900 words that:

- Answers **one** concrete question in the headline
- Includes a `cta` block to `/map` (and state page when relevant)
- Cites stable primary sources (eCFR, ATF, RECAP PDFs already linked on the site) — do **not** invent holdings
- Reads like a desk explainer, not a changelog

Skip `lawAlerts.ts` unless you are retiring a stale alert.

## Scope language (copy this discipline)

If a court limits relief to **named plaintiffs, members, and customers (current and future)**, say so. Do not write “the NFA is repealed for everyone.” Note state bans still apply. Note Form 4473 / GCA background checks may still apply. Flag appeal risk.

## Membership / customer coverage

When an injunction is party-specific, list **named organizational plaintiffs** people can actually join (with official join URLs) and **named commercial plaintiffs** whose *customers* the order mentions — plus the court’s limits. Do not invent extra groups.

## PR rules

- Open **one PR** on `main` with the new blog entry (and alert/map edits if any).
- Never open a 50-state scrape PR from this agent.
- Never bump `PMF_AS_OF` unless the fifty-state map was actually re-verified.
- Tone: readable news desk. Not a docket dump, not a membership pitch.
