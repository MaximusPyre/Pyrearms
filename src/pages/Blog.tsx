import { Link } from "react-router-dom";
import { AdSlot } from "../components/AdSlot";
import { BLOG_POSTS, readingMinutes } from "../data/lawBlog";
import { usePageMeta } from "../lib/pageMeta";

export function Blog() {
	usePageMeta({
		title: "Blog — court rulings & state traps · PyreArms",
		description:
			"Full articles on federal firearms rulings that move the board — who is covered, what is not, and why your state still matters. Education, not legal advice.",
		path: "/blog",
	});

	const [featured, ...rest] = BLOG_POSTS;

	return (
		<section className="page blog-index">
			<div className="page-head">
				<p className="eyebrow">Court &amp; statute desk</p>
				<h1>Blog</h1>
				<p className="lede">
					Stories that keep you reading — then send you to the map. Captions,
					coverage limits, and the traps victory posts skip.
				</p>
			</div>

			{featured ? (
				<article className="blog-featured">
					<p className="eyebrow">
						Featured · {featured.date} · {readingMinutes(featured)} min read
					</p>
					<h2>
						<Link to={`/blog/${featured.slug}`}>{featured.title}</Link>
					</h2>
					{featured.hook ? <p className="blog-hook">{featured.hook}</p> : null}
					<p className="blog-dek">{featured.dek}</p>
					<div className="blog-featured-actions">
						<Link className="btn btn-primary" to={`/blog/${featured.slug}`}>
							Read now
						</Link>
						<Link className="btn btn-ghost" to="/map">
							Open the map
						</Link>
					</div>
				</article>
			) : null}

			<AdSlot slot="index-mid" />

			<div className="blog-list">
				{rest.map((post) => (
					<article key={post.slug} className="blog-card">
						<p className="eyebrow">
							{post.date} · {readingMinutes(post)} min
							{post.tags[0] ? ` · ${post.tags[0]}` : ""}
						</p>
						<h2>
							<Link to={`/blog/${post.slug}`}>{post.title}</Link>
						</h2>
						<p className="blog-dek">{post.dek}</p>
						<p className="blog-tags">
							{post.tags.map((t) => (
								<span key={t}>{t}</span>
							))}
						</p>
						<Link className="text-link" to={`/blog/${post.slug}`}>
							Continue reading →
						</Link>
					</article>
				))}
			</div>

			<aside className="blog-map-promo">
				<h2>Still wondering about your state?</h2>
				<p>
					Federal headlines travel. Felonies stay local. Click your state, print
					a card, come back when the next order drops.
				</p>
				<Link className="btn btn-primary" to="/map">
					Open the PMF map
				</Link>
			</aside>
		</section>
	);
}
