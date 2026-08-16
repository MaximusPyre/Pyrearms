import { Link } from "react-router-dom";
import { LawAlertBanner } from "../components/LawAlertBanner";
import { Embers } from "../components/Embers";
import { X_HANDLE, X_URL } from "../lib/social";

export function Home() {
	return (
		<>
			<section className="hero">
				<Embers />
				<div className="hero-glow" aria-hidden="true" />
				<picture>
					<source
						media="(min-width: 768px)"
						srcSet="/brand/pyre-hero-desktop.jpg"
					/>
					<img
						className="hero-visual"
						src="/brand/pyre-hero.jpg"
						alt=""
					/>
				</picture>
				<div className="hero-copy">
					<p className="hero-kicker">United States · Second Amendment</p>
					<h1 className="visually-hidden">PyreArms</h1>
					<p className="hero-lead">
						Federal law on personally manufactured firearms — and PyreLink, an
						open peer-share tool for advocates.
					</p>
					<div className="hero-actions">
						<Link className="btn btn-primary" to="/law">
							Read federal law
						</Link>
						<Link className="btn btn-ghost" to="/download">
							Get PyreLink
						</Link>
						<a
							className="btn btn-primary"
							href={X_URL}
							target="_blank"
							rel="noreferrer"
						>
							{X_HANDLE} on X
						</a>
					</div>
				</div>
			</section>

			<LawAlertBanner />

			<section className="section band">
				<div className="section-inner">
					<h2>Know the statute</h2>
					<p>
						Media says “ghost guns.” ATF publishes rules for privately made
						firearms (PMFs). We point at primary sources.
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
