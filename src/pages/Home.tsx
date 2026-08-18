import { Link } from "react-router-dom";
import { LawAlertBanner } from "../components/LawAlertBanner";
import { Embers } from "../components/Embers";

export function Home() {
	return (
		<>
			<section className="hero">
				<div className="hero-glow" aria-hidden="true" />
				<Embers />
				<div className="hero-copy">
					<p className="hero-kicker">United States · Second Amendment</p>
					<h1 className="visually-hidden">PyreArms</h1>
					<p className="hero-lead">
						PyreArms is a collective for federal privately made firearm law
						education, and PyreLink — open peer share for advocates.
					</p>
					<div className="hero-actions">
						<Link className="btn btn-primary" to="/law">
							Read federal law
						</Link>
						<Link className="btn btn-ghost" to="/download">
							Get PyreLink
						</Link>
					</div>
				</div>
			</section>

			<LawAlertBanner />

			<section className="section band">
				<div className="section-inner">
					<h2>Know the statute</h2>
					<p>
						Media says “ghost guns.” ATF publishes the rules for privately made
						firearms. PyreArms points at primary sources.
					</p>
					<Link className="text-link" to="/law">
						Open the law page →
					</Link>
				</div>
			</section>

			<section className="section twin">
				<article>
					<h2>ATF sources</h2>
					<p>
						Personal manufacture without a license, PMF overview, and hard
						limits that still apply.
					</p>
					<Link className="btn btn-primary" to="/law">
						Federal law
					</Link>
				</article>
				<article>
					<h2>PyreLink</h2>
					<p>
						Host a folder. Copy a share code. Others paste it and fetch
						peer-to-peer — no central file dump on this site.
					</p>
					<Link className="btn btn-primary" to="/download">
						Download
					</Link>
				</article>
			</section>
		</>
	);
}
