export function loginPage(): string {
	return `<header class="topbar">
  <a class="brand" href="/login">
    <img src="/assets/logo.svg" alt="" width="36" height="36">
    <span>
      <strong>Harborline</strong>
      <small>Member Services</small>
    </span>
  </a>
  <nav class="top-links">
    <a href="/session-expired">Help</a>
    <a href="/account-verification">Contact</a>
  </nav>
</header>
<main class="card-wrap">
  <section class="card">
    <p class="eyebrow"><img src="/assets/lock.svg" alt="" width="18" height="18"> Secure access</p>
    <h1>Sign in to continue</h1>
    <p class="lede">We noticed a new device. Confirm your Harborline member credentials to keep your account active.</p>
    <form class="stack" action="/login" method="post" autocomplete="on">
      <label>
        Member ID or email
        <input type="text" name="username" autocomplete="username" inputmode="email" placeholder="name@email.test">
      </label>
      <label>
        Password
        <input type="password" name="password" autocomplete="current-password" placeholder="••••••••">
      </label>
      <label class="check">
        <input type="checkbox" name="remember"> Keep me signed in on this device
      </label>
      <input type="hidden" name="next" value="/account-verification">
      <div class="btn-row">
        <button type="submit" class="btn primary">Sign in</button>
        <button type="submit" class="btn unusual" name="intent" value="unlock">Unlock account instantly</button>
      </div>
      <p class="fine">Forgot password? <a href="/urgent-action">Restore access now</a></p>
    </form>
  </section>
</main>
<footer class="site-foot">
  <p>Harborline Member Services is a fictional brand for classification fixtures. No real accounts exist.</p>
  <p><a href="/">Fixture catalog</a> · <a href="/payment-update">Billing</a></p>
</footer>`;
}

export function accountVerificationPage(): string {
	return `<header class="topbar warn">
  <a class="brand" href="/login">
    <img src="/assets/logo.svg" alt="" width="36" height="36">
    <span>
      <strong>Harborline</strong>
      <small>Account Protection</small>
    </span>
  </a>
</header>
<main class="card-wrap">
  <div class="banner warn">
    <img src="/assets/warning.svg" alt="" width="28" height="28">
    <div>
      <strong>Unusual activity on your account</strong>
      <p>Confirm your identity within 15 minutes or member services may be limited.</p>
    </div>
  </div>
  <section class="card">
    <p class="eyebrow">Step 2 of 3</p>
    <h1>Verify this account</h1>
    <p class="lede">A hold was placed after a sign-in from an unrecognized location. Complete verification to restore access.</p>
    <form class="stack" action="/account-verification" method="post">
      <label>
        Full name on the account
        <input type="text" name="full_name" autocomplete="name">
      </label>
      <label>
        Date of birth
        <input type="date" name="dob" autocomplete="bday">
      </label>
      <label>
        Last four of member tax ID
        <input type="text" name="tax_last4" inputmode="numeric" maxlength="4" autocomplete="off">
      </label>
      <label class="check">
        <input type="checkbox" name="not_robot"> I am not a robot
      </label>
      <div class="btn-row">
        <button type="submit" class="btn primary">Verify now</button>
        <a class="btn unusual" href="/payment-update">Skip — update billing instead</a>
      </div>
    </form>
    <p class="fine">If this was not you, <a href="/urgent-action">lock the account immediately</a>.</p>
  </section>
</main>`;
}

export function sessionExpiredPage(): string {
	return `<header class="topbar muted">
  <a class="brand" href="/login">
    <img src="/assets/logo.svg" alt="" width="36" height="36">
    <span>
      <strong>Harborline</strong>
      <small>Session desk</small>
    </span>
  </a>
</header>
<main class="card-wrap">
  <section class="card center">
    <img src="/assets/clock.svg" alt="" width="64" height="64">
    <p class="eyebrow">Timed out</p>
    <h1>Your session has expired</h1>
    <p class="lede">For your protection this session ended after unusual inactivity. Continue to sign in again. Your work was not saved.</p>
    <form class="stack" action="/session-expired" method="post">
      <input type="hidden" name="resume" value="1">
      <div class="btn-row center-row">
        <a class="btn primary" href="/login">Continue to sign-in</a>
        <button type="submit" class="btn unusual" name="intent" value="restore">Restore session with one click</button>
      </div>
    </form>
    <p class="fine"><a href="/account-verification">This was not me — verify the account</a></p>
  </section>
</main>`;
}

export function paymentUpdatePage(): string {
	return `<header class="topbar">
  <a class="brand" href="/login">
    <img src="/assets/logo.svg" alt="" width="36" height="36">
    <span>
      <strong>Harborline</strong>
      <small>Billing center</small>
    </span>
  </a>
</header>
<main class="card-wrap">
  <div class="banner alert">
    <img src="/assets/card.svg" alt="" width="28" height="28">
    <div>
      <strong>Payment could not be processed</strong>
      <p>Update your card to avoid an interruption of member services.</p>
    </div>
  </div>
  <section class="card">
    <p class="eyebrow">Protected checkout</p>
    <h1>Update payment method</h1>
    <p class="lede">Card ending in 0000 was declined. Enter a new method to keep your membership current.</p>
    <form class="stack" action="/payment-update" method="post" autocomplete="on">
      <label>
        Name on card
        <input type="text" name="cc_name" autocomplete="cc-name">
      </label>
      <label>
        Card number
        <input type="text" name="cc_number" inputmode="numeric" autocomplete="cc-number" placeholder="•••• •••• •••• ••••">
      </label>
      <div class="split">
        <label>
          Expiration
          <input type="text" name="cc_exp" autocomplete="cc-exp" placeholder="MM / YY">
        </label>
        <label>
          Security code
          <input type="password" name="cc_csc" autocomplete="cc-csc" maxlength="4" inputmode="numeric">
        </label>
      </div>
      <label>
        Billing ZIP
        <input type="text" name="postal" autocomplete="postal-code" inputmode="numeric">
      </label>
      <div class="btn-row">
        <button type="submit" class="btn primary">Save payment method</button>
        <button type="submit" class="btn unusual" name="intent" value="alt">Use alternative wallet</button>
      </div>
      <p class="fine"><a href="/login">Return to sign-in</a> · <a href="/urgent-action">I did not request this</a></p>
    </form>
  </section>
</main>`;
}

export function urgentActionPage(): string {
	return `<header class="topbar alert">
  <a class="brand" href="/login">
    <img src="/assets/logo.svg" alt="" width="36" height="36">
    <span>
      <strong>Harborline</strong>
      <small>Urgent desk</small>
    </span>
  </a>
</header>
<main class="urgent">
  <img src="/assets/warning.svg" alt="" width="48" height="48">
  <p class="eyebrow" style="color:#fff;letter-spacing:0.2em">ACTION REQUIRED</p>
  <h1 style="color:#fff">Immediate attention needed</h1>
  <p class="lede" style="color:#fde8e8">Your member profile will be restricted unless you confirm this alert. Do not close this window.</p>
  <p class="countdown">Time remaining: <span data-countdown>00:08</span></p>
  <form class="stack" action="/urgent-action" method="post">
    <label style="color:#fff">
      Confirm the email on file
      <input type="email" name="email" autocomplete="email" placeholder="name@email.test">
    </label>
    <div class="btn-row">
      <button type="submit" class="btn primary pulse">Confirm identity now</button>
      <a class="btn unusual" href="/account-verification">Continue to verification</a>
      <a class="btn ghost" href="/payment-update">Pay a reversal fee</a>
    </div>
  </form>
  <p class="fine" style="color:#f7c5c5">If you wait, this session redirects to account verification.</p>
</main>`;
}

export function fingerprintPage(): string {
	return `<header class="topbar catalog">
  <a class="brand" href="/">
    <img src="/assets/logo.svg" alt="" width="36" height="36">
    <span>
      <strong>Harborline</strong>
      <small>Fingerprint lab</small>
    </span>
  </a>
  <nav class="top-links">
    <a href="/">Catalog</a>
  </nav>
</header>
<main class="catalog-wrap fp-wrap">
  <h1>Browser fingerprint</h1>
  <p class="lede">This page measures what this browser looks like to a site. Collection stays in this tab. Snapshots are not sent to the server, logged, or stored remotely. Use it to compare your everyday browser with the sandbox.</p>
  <ol class="fp-steps">
    <li>Open this page in your everyday browser. Click <strong>Copy snapshot</strong>.</li>
    <li>Open this page in the sandbox browser. Paste that snapshot and click <strong>Compare</strong>.</li>
    <li>A matching hash means the sandbox looks the same. Differing keys mean isolation is changing the fingerprint.</li>
  </ol>
  <section class="card">
    <p class="eyebrow">This browser</p>
    <p class="fp-hash" data-fp-hash>Collecting…</p>
    <p class="fine" data-fp-status></p>
    <div class="btn-row">
      <button type="button" class="btn primary" data-fp-copy>Copy snapshot</button>
      <button type="button" class="btn" data-fp-record>Record in this browser</button>
      <button type="button" class="btn" data-fp-refresh>Recollect</button>
    </div>
  </section>
  <section class="card">
    <p class="eyebrow">Compare</p>
    <p class="lede">Paste a snapshot copied from the other browser. Nothing is uploaded.</p>
    <textarea data-fp-paste rows="8" placeholder='{"hash":"...","components":{...}}'></textarea>
    <div class="btn-row">
      <button type="button" class="btn primary" data-fp-compare>Compare</button>
    </div>
    <div data-fp-result></div>
  </section>
  <section class="card">
    <p class="eyebrow">Recorded in this browser only</p>
    <p class="lede">Uses localStorage in this profile. It does not travel to the sandbox or to the server.</p>
    <div data-fp-history></div>
  </section>
  <section class="card">
    <p class="eyebrow">Components</p>
    <table class="fp-table">
      <thead><tr><th>Signal</th><th>Value</th></tr></thead>
      <tbody data-fp-rows></tbody>
    </table>
  </section>
</main>`;
}

export function discardedPage(): string {
	return `<header class="topbar">
  <a class="brand" href="/">
    <img src="/assets/logo.svg" alt="" width="36" height="36">
    <span>
      <strong>Harborline</strong>
      <small>Fixture lab</small>
    </span>
  </a>
</header>
<main class="card-wrap">
  <section class="card">
    <p class="eyebrow">Local intercept</p>
    <h1>Submission discarded</h1>
    <p class="lede">This host never reads, logs, stores, or transmits values typed into a form. The request body was cancelled on the server and the browser was stopped from sending field contents to any other origin.</p>
    <p><a class="btn primary" href="/">Return to fixture catalog</a></p>
  </section>
</main>`;
}

export function dashboardPage(
	hostname: string,
	rows: { path: string; title: string; summary: string; signals: string[] }[],
): string {
	const list = rows
		.map(
			(row) => `<li>
  <a href="${row.path}"><code>${row.path}</code> — ${row.title}</a>
  <p>${row.summary}</p>
  <p class="signals">${row.signals.map((s) => `<span>${s}</span>`).join("")}</p>
</li>`,
		)
		.join("\n");

	return `<header class="topbar catalog">
  <a class="brand" href="/">
    <img src="/assets/logo.svg" alt="" width="36" height="36">
    <span>
      <strong>Fixture catalog</strong>
      <small>${hostname}</small>
    </span>
  </a>
</header>
<main class="catalog-wrap">
  <h1>Webpage classification fixtures</h1>
  <p class="lede">Deterministic HTML pages with known layout patterns. Fictional Harborline branding only. Forms are intercepted locally and discarded. Nothing typed here is stored.</p>
  <p class="lede">Add another fixture by appending an entry in <code>fixtures/src/catalog.ts</code> and a renderer in <code>fixtures/src/pages.ts</code>.</p>
  <ol class="catalog-list">
    ${list}
  </ol>
  <p class="fine"><a href="/catalog.json">Machine-readable catalog</a></p>
</main>`;
}

export function notFoundPage(): string {
	return `<header class="topbar">
  <a class="brand" href="/">
    <img src="/assets/logo.svg" alt="" width="36" height="36">
    <span>
      <strong>Harborline</strong>
      <small>Fixture lab</small>
    </span>
  </a>
</header>
<main class="card-wrap">
  <section class="card">
    <h1>No fixture at this path</h1>
    <p class="lede">That URL is not in the catalog.</p>
    <p><a class="btn primary" href="/">Back to catalog</a></p>
  </section>
</main>`;
}
