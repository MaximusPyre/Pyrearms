import { Link } from "react-router-dom";
import { LawAlertBanner } from "../components/LawAlertBanner";
import { Embers } from "../components/Embers";

export function Home() {
	return (
		<>
			<section className="hero">
				<img className="hero-visual" src="/brand/hero-bg.jpg" alt="" />
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
						<Link className="btn btn-primary" to="/map">
							Open the state map
						</Link>
						<Link className="btn btn-ghost" to="/blog">
							Read the blog
						</Link>
					</div>
				</div>
			</section>

			<LawAlertBanner />

			<section className="section band">
				<div className="section-inner">
					<h2>Headlines lie by omission</h2>
					<p>
						Texas injunctions made the news. Your state’s unfinished-frame and
						serialization rules still decide the stop. Click the map before you
						trust a screenshot.
					</p>
					<Link className="text-link" to="/map">
						Open the fifty-state map →
					</Link>
				</div>
			</section>

			<section className="section twin">
				<article>
					<h2>Blog</h2>
					<p>
						Full articles on who is covered, what is not, and the traps victory
						posts skip — then a hard link back to the map.
					</p>
					<Link className="btn btn-primary" to="/blog">
						Latest articles
					</Link>
				</article>
				<article>
					<h2>Federal statutes</h2>
					<p>
						ATF PMF baseline, § 922(a)(1)(A), detectability, and NFA —
						separate from the interactive map.
					</p>
					<Link className="btn btn-primary" to="/law">
						Federal law
					</Link>
				</article>
			</section>
		</>
	);
}
