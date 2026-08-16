import { LawAlertBanner } from "../components/LawAlertBanner";
import { StatePmfMap } from "../components/StatePmfMap";
import { X_HANDLE, X_URL } from "../lib/social";

export function Legal() {
	return (
		<section className="page">
			<div className="page-head">
				<p className="eyebrow">United States</p>
				<h1>Federal PMF law &amp; state status</h1>
				<p className="lede">
					Primary federal authorities for privately made firearms, then a dated
					fifty-state status map. This is statute discussion for education — not
					legal advice.{" "}
					<a href={X_URL} target="_blank" rel="noreferrer">
						{X_HANDLE}
					</a>
					.
				</p>
			</div>

			<LawAlertBanner />

			<div className="prose">
				<h2>What is a privately made firearm?</h2>
				<p>
					ATF describes privately made firearms (PMFs) as firearms — including a
					frame or receiver — completed, assembled, or otherwise produced by a
					person other than a licensed manufacturer, and without a serial number
					placed by a licensed manufacturer at the time the firearm was produced.
				</p>
				<p>
					<strong>Authority:</strong>{" "}
					<a
						href="https://www.atf.gov/firearms/privately-made-firearms"
						target="_blank"
						rel="noreferrer"
					>
						ATF, Privately Made Firearms
					</a>
					.
				</p>

				<h2>Personal manufacture without an FFL</h2>
				<p>
					ATF’s current PMF guidance states that an individual may make a firearm
					for personal use and does{" "}
					<strong>not</strong> need to serialize or register it federally{" "}
					<em>
						unless they are engaged in the business of manufacturing firearms for
						livelihood or profit
					</em>
					. Detectability under federal law still applies (including for
					3D-printed builds).
				</p>
				<p>
					<strong>Authority:</strong>{" "}
					<a
						href="https://www.atf.gov/firearms/privately-made-firearms"
						target="_blank"
						rel="noreferrer"
					>
						ATF, Privately Made Firearms
					</a>{" "}
					(“You do not have to add a serial number or register the PMF if you are
					not engaged in the business…”; firearms must remain detectable).
				</p>

				<h2>Engaging in the business requires licensing</h2>
				<p>
					The core federal criminal prohibition on unlicensed commercial dealing /
					manufacturing is{" "}
					<a
						href="https://www.law.cornell.edu/uscode/text/18/922#a_1_A"
						target="_blank"
						rel="noreferrer"
					>
						18 U.S.C. § 922(a)(1)(A)
					</a>
					. Personal hobby manufacture for personal use is the ATF-published
					contrast — selling or manufacturing for livelihood or profit is not.
				</p>
				<p>
					<strong>Authority:</strong> 18 U.S.C. § 922(a)(1)(A);{" "}
					<a
						href="https://www.atf.gov/firearms/privately-made-firearms"
						target="_blank"
						rel="noreferrer"
					>
						ATF, Privately Made Firearms
					</a>
					.
				</p>

				<h2>Licensee marking of PMFs</h2>
				<p>
					When a federal firearms licensee acquires a PMF, federal marking rules
					for licensees apply — including PMF-related marking timelines and
					content.
				</p>
				<p>
					<strong>Authority:</strong>{" "}
					<a
						href="https://www.ecfr.gov/current/title-27/chapter-II/subchapter-B/part-478/subpart-F/section-478.92"
						target="_blank"
						rel="noreferrer"
					>
						27 C.F.R. § 478.92
					</a>{" "}
					(marking requirements applicable to licensees). ATF also summarizes that
					FFLs must mark PMFs with a unique serial number within seven days or
					prior to disposition, whichever is sooner (
					<a
						href="https://www.atf.gov/firearms/privately-made-firearms"
						target="_blank"
						rel="noreferrer"
					>
						ATF PMF page
					</a>
					).
				</p>

				<h2>Removed or obliterated manufacturer serial numbers</h2>
				<p>
					<a
						href="https://www.law.cornell.edu/uscode/text/18/922#k"
						target="_blank"
						rel="noreferrer"
					>
						18 U.S.C. § 922(k)
					</a>{" "}
					is the federal prohibition concerning firearms whose{" "}
					<em>importer’s or manufacturer’s</em> serial number has been removed,
					obliterated, or altered. That is{" "}
					<strong>materially different</strong> from a privately made firearm that{" "}
					<em>never had</em> a licensed manufacturer’s serial number in the first
					place.
				</p>
				<p>
					<strong>Authority:</strong> 18 U.S.C. § 922(k). It is{" "}
					<strong>not</strong> worded as a requirement that every privately
					manufactured firearm must initially receive a manufacturer serial
					number.
				</p>

				<h2>Detectability</h2>
				<p>
					ATF’s PMF guidance states personally made firearms must remain
					detectable under federal law (including when produced by 3D printing or
					other processes).
				</p>
				<p>
					<strong>Authority:</strong>{" "}
					<a
						href="https://www.atf.gov/firearms/privately-made-firearms"
						target="_blank"
						rel="noreferrer"
					>
						ATF, Privately Made Firearms
					</a>
					; Undetectable Firearms Act concepts in the Gun Control Act framework
					(read the statute text before relying on paraphrase).
				</p>

				<h2>NFA weapons remain separate</h2>
				<p>
					If a homemade firearm falls into an NFA category (machinegun,
					silencer, short-barreled rifle/shotgun, destructive device, AOW, etc.),
					the National Firearms Act rules apply separately — tax, approval, and
					identification marking among them.
				</p>
				<p>
					<strong>Authority (NFA identification for NFA firearms):</strong>{" "}
					<a
						href="https://www.ecfr.gov/current/title-27/chapter-II/subchapter-B/part-479/subpart-G/section-479.102"
						target="_blank"
						rel="noreferrer"
					>
						27 C.F.R. § 479.102
					</a>
					. ATF’s PMF page also flags silencers, destructive devices, and
					machinegun conversion devices as high-risk categories under federal
					law.
				</p>

				<h2>Hard limits (federal quick list)</h2>
				<ul>
					<li>
						Unlicensed engaging in the business of manufacturing/dealing —
						§ 922(a)(1)(A).
					</li>
					<li>
						NFA items — Title II / Part 479 still exists. A party-specific
						injunction in <em>Silencer Shop Foundation v. ATF</em> (Aug. 2026)
						limits ATF enforcement of some Form 1 / Form 4 / registration rules
						for <strong>covered plaintiffs, members, and customers</strong>{" "}
						only — see below. Not a nationwide repeal.
					</li>
					<li>Detectability — ATF PMF guidance + GCA undetectable rules.</li>
					<li>Prohibited persons may not possess firearms.</li>
					<li>
						Obliterating a manufacturer serial number — § 922(k) (not the same
						as never having had one).
					</li>
					<li>
						State overlays can be stricter than federal baseline — see the map
						and the <a href="/blog">law watch</a> log.
					</li>
				</ul>

				<h2 id="nfa-injunction">August 2026 NFA injunction (suppressors and more)</h2>
				<p>
					<strong>Caption:</strong>{" "}
					<em>Silencer Shop Foundation v. ATF</em>, No. 6:25-cv-056-H (N.D.
					Tex.), consolidated with <em>Jensen v. ATF</em>, No. 6:26-cv-277.
					Judge James Wesley Hendrix.{" "}
					<strong>Opinion</strong> Dkt. 136 and <strong>final judgment</strong>{" "}
					Dkt. 137 filed August 5, 2026. The judgment stayed itself seven days;
					that stay lapsed, and covered transfers were reported beginning August
					13, 2026.
				</p>
				<p>
					<strong>What the court said:</strong> After the One Big Beautiful Bill
					Act of 2025 zeroed making and transfer taxes on certain NFA items
					(silencers, short-barreled rifles/shotguns, and — for some plaintiffs —
					AOWs), the challenged registration / photo / fingerprint / Form 1 /
					Form 4 apparatus for those <em>untaxed</em> items could not be saved
					under a power Congress never invoked. The court entered a{" "}
					<strong>permanent injunction</strong> against ATF/DOJ enforcing those
					challenged provisions against the covered parties. It is{" "}
					<strong>not</strong> a nationwide injunction and{" "}
					<strong>does not repeal the NFA</strong> for the general public.
				</p>
				<p>
					<strong>Who the order names as covered:</strong> the plaintiffs and,
					where applicable, their agencies, political subdivisions,{" "}
					<strong>members</strong>, and <strong>customers — current and
					future</strong>. The opinion is narrower for commercial customers:
					coverage is described as incidental to dealings with named commercial
					plaintiffs, not a free pass for every NFA transfer in America. Fifteen
					states joined as plaintiffs; that protects those states’ agencies, not
					every resident of those states. Jensen plaintiffs did not get AOW
					relief. State bans and dealer GCA / Form 4473 rules can still apply.
					DOJ can still appeal.
				</p>
				<p>
					<strong>Organizations named as associational plaintiffs</strong> (join
					only if you independently want membership; we do not sell it):
				</p>
				<ul>
					<li>
						<a href="https://www.gunowners.org/join/" target="_blank" rel="noreferrer">
							Gun Owners of America
						</a>{" "}
						and{" "}
						<a href="https://foundation.gunowners.org/" target="_blank" rel="noreferrer">
							Gun Owners Foundation
						</a>
					</li>
					<li>
						<a href="https://www.silencershop.com/" target="_blank" rel="noreferrer">
							Silencer Shop Foundation
						</a>{" "}
						/ named industry plaintiffs (SilencerCo, Palmetto State Armory, B&amp;T
						USA) — customer coverage is transaction-specific per the opinion
					</li>
					<li>
						Firearms Regulatory Accountability Coalition; from the Jensen side:
						Texas State Rifle Association, FPC Action Foundation, Citizens
						Committee for the Right to Keep and Bear Arms
					</li>
				</ul>
				<p>
					<strong>Primary sources:</strong>{" "}
					<a
						href="https://storage.courtlistener.com/recap/gov.uscourts.txnd.406278/gov.uscourts.txnd.406278.136.0.pdf"
						target="_blank"
						rel="noreferrer"
					>
						Memorandum opinion (Dkt. 136, RECAP)
					</a>
					;{" "}
					<a
						href="https://storage.courtlistener.com/recap/gov.uscourts.txnd.406278/gov.uscourts.txnd.406278.137.0_1.pdf"
						target="_blank"
						rel="noreferrer"
					>
						Final judgment (Dkt. 137, RECAP)
					</a>
					;{" "}
					<a
						href="https://www.gunowners.org/federal-court-rules-key-national-firearms-act-restrictions-are-unconstitutional-in-goa-lawsuit/"
						target="_blank"
						rel="noreferrer"
					>
						GOA case summary
					</a>
					. See the{" "}
					<a href="/blog">law watch</a> post. Not legal advice — verify coverage
					and your state’s law before you act.
				</p>

				<h2>Disclaimer</h2>
				<p>
					PyreArms cites public statutes, eCFR text, and ATF pages. This site is
					not a law firm and does not give legal advice. You are responsible for
					compliance where you live and travel.
				</p>
			</div>

			<StatePmfMap />
		</section>
	);
}
