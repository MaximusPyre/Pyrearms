import { StatePmfMap } from "../components/StatePmfMap";

export function Legal() {
	return (
		<section className="page">
			<div className="page-head">
				<p className="eyebrow">United States</p>
				<h1>Federal PMF law &amp; state status</h1>
				<p className="lede">
					Primary federal authorities for privately made firearms, then a dated
					fifty-state status map. This is statute discussion for education — not
					legal advice.
				</p>
			</div>

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
					<li>NFA items — separate Title II / Part 479 regime.</li>
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
