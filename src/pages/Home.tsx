import { Link } from "react-router-dom";
import { LawAlertBanner } from "../components/LawAlertBanner";
import { Embers } from "../components/Embers";
import { BLOG_POSTS, readingMinutes } from "../data/lawBlog";
import { usePageMeta } from "../lib/pageMeta";

export function Home() {
	usePageMeta({
		title: "PyreArms — state PMF map & court desk",
		description:
			"Click your state for unfinished-frame and serialization rules. Read the rulings that actually move coverage. Education, not legal advice.",
		path: "/",
	});

	const latest = BLOG_POSTS[0];

	return (
		<>
			<section className="hero">
				<img className="hero-visual" src="/brand/hero-bg.jpg" alt="" />
				<div className="hero-glow" aria-hidden="true" />
				<Embers />
				<div className="hero-copy">
					<p className="hero-kicker">United States · Second Amendment</p>
					<h1 className="hero-brand">PyreArms</h1>
					<p className="hero-lead">
						Click your state. Read the ruling. Come back when the next order
						drops.
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

			<LawAlertBanner limit={1} />

			<section className="section band home-loop">
				<div className="section-inner">
					<p className="eyebrow">The loop</p>
					<h2>Map first. Headline second.</h2>
					<p>
						Federal injunctions get screenshots. State unfinished-frame and
						serialization rules still decide the stop. The map is why people
						return — the blog is how they know what changed.
					</p>
					<div className="home-loop-actions">
						<Link className="btn btn-primary" to="/map">
							Check my state
						</Link>
						<Link className="text-link" to="/law">
							Federal baseline →
						</Link>
					</div>
				</div>
			</section>

			{latest ? (
				<section className="section home-latest">
					<div className="home-latest-inner">
						<p className="eyebrow">
							Latest · {latest.date} · {readingMinutes(latest)} min
						</p>
						<h2>
							<Link to={`/blog/${latest.slug}`}>{latest.title}</Link>
						</h2>
						{latest.hook ? <p className="blog-hook">{latest.hook}</p> : null}
						<p className="home-latest-dek">{latest.dek}</p>
						<div className="home-loop-actions">
							<Link className="btn btn-primary" to={`/blog/${latest.slug}`}>
								Continue reading
							</Link>
							<Link className="btn btn-ghost" to="/blog">
								All articles
							</Link>
						</div>
					</div>
				</section>
			) : null}

			<section className="section twin home-secondary">
				<article>
					<h2>Print a statute card</h2>
					<p>
						Pick a state on the map, print the pocket cites, keep them with
						you. Not a permit — so you are not arguing from memory.
					</p>
					<Link className="btn btn-ghost" to="/map">
						Go to the map
					</Link>
				</article>
				<article>
					<h2>PyreLink</h2>
					<p>
						Open peer share for advocates. Host a folder, copy a code, fetch
						P2P — this site never holds your files.
					</p>
					<Link className="btn btn-ghost" to="/download">
						Download
					</Link>
				</article>
			</section>
		</>
	);
}
