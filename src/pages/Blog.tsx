import { Link } from "react-router-dom";
import { BLOG_POSTS } from "../data/lawBlog";

export function Blog() {
	return (
		<section className="page blog-index">
			<div className="page-head">
				<p className="eyebrow">PyreArms · Court &amp; statute desk</p>
				<h1>Blog</h1>
				<p className="lede">
					Full articles on federal firearms rulings that actually move the
					board — captions, who is covered, what is not, and links to the
					orders. Education, not legal advice.
				</p>
			</div>

			<div className="blog-list">
				{BLOG_POSTS.map((post) => (
					<article key={post.slug} className="blog-card">
						<p className="eyebrow">
							{post.date}
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
							Read the article →
						</Link>
					</article>
				))}
			</div>

			<p className="fine-print blog-index-foot">
				Looking for the fifty-state map?{" "}
				<Link to="/law">Federal PMF law &amp; state status</Link>.
			</p>
		</section>
	);
}
