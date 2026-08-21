import { Link, Navigate, useParams } from "react-router-dom";
import { AdSlot } from "../components/AdSlot";
import {
	getPost,
	readingMinutes,
	relatedPosts,
	type BlogBlock,
	type BlogPost,
} from "../data/lawBlog";
import { usePageMeta, SITE } from "../lib/pageMeta";

function Block({ block }: { block: BlogBlock }) {
	if (block.type === "h2") return <h2>{block.text}</h2>;
	if (block.type === "p") return <p>{block.text}</p>;
	if (block.type === "ul") {
		return (
			<ul>
				{block.items.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		);
	}
	if (block.type === "ad") return <AdSlot slot="inline" />;
	if (block.type === "cta") {
		return (
			<aside className="blog-inline-cta">
				<h3>{block.title}</h3>
				<p>{block.body}</p>
				<Link className="btn btn-primary" to={block.href}>
					{block.label}
				</Link>
			</aside>
		);
	}
	return (
		<blockquote className="blog-quote">
			<p>{block.text}</p>
			{block.cite ? <cite>{block.cite}</cite> : null}
		</blockquote>
	);
}

function ShareRow({ post }: { post: BlogPost }) {
	const url = encodeURIComponent(`${SITE}/blog/${post.slug}`);
	const text = encodeURIComponent(post.title);
	return (
		<div className="blog-share">
			<span>Share</span>
			<a
				href={`https://twitter.com/intent/tweet?url=${url}&text=${text}`}
				target="_blank"
				rel="noreferrer"
			>
				X
			</a>
			<a
				href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
				target="_blank"
				rel="noreferrer"
			>
				Facebook
			</a>
			<a
				href={`https://reddit.com/submit?url=${url}&title=${text}`}
				target="_blank"
				rel="noreferrer"
			>
				Reddit
			</a>
			<button
				type="button"
				className="blog-share-copy"
				onClick={() =>
					navigator.clipboard.writeText(`${SITE}/blog/${post.slug}`)
				}
			>
				Copy link
			</button>
		</div>
	);
}

export function BlogPost() {
	const { slug } = useParams();
	const post = slug ? getPost(slug) : undefined;
	const related = post ? relatedPosts(post.slug) : [];

	usePageMeta(
		post
			? {
					title: post.title,
					description: post.dek,
					path: `/blog/${post.slug}`,
					type: "article",
					publishedAt: post.publishedAt,
					tags: post.tags,
				}
			: {
					title: "Article · PyreArms",
					description: "PyreArms blog",
					path: "/blog",
				},
	);

	if (!post) return <Navigate to="/blog" replace />;

	return (
		<article className="page blog-article">
			<div className="page-head">
				<p className="eyebrow">
					<Link to="/blog">Blog</Link> · {post.date} ·{" "}
					{readingMinutes(post)} min read
				</p>
				<h1>{post.title}</h1>
				{post.hook ? <p className="blog-hook">{post.hook}</p> : null}
				<p className="lede">{post.dek}</p>
				<p className="blog-tags">
					{post.tags.map((t) => (
						<span key={t}>{t}</span>
					))}
				</p>
				<ShareRow post={post} />
			</div>

			<div className="prose blog-body">
				{post.blocks.map((block, i) => (
					<Block key={i} block={block} />
				))}

				<h2>Primary sources</h2>
				<ul>
					{post.sources.map((s) => (
						<li key={s.url}>
							<a href={s.url} target="_blank" rel="noreferrer">
								{s.label}
							</a>
						</li>
					))}
				</ul>
			</div>

			<aside className="blog-map-promo">
				<h2>Done reading? Check your state.</h2>
				<p>
					Injunctions are federal and often party-specific. Your state’s
					serialization and possession rules are still on the map.
				</p>
				<Link className="btn btn-primary" to="/map">
					Open the PMF map
				</Link>
			</aside>

			{related.length > 0 ? (
				<section className="blog-related">
					<h2>Keep reading</h2>
					<ul>
						{related.map((r) => (
							<li key={r.slug}>
								<Link to={`/blog/${r.slug}`}>{r.title}</Link>
								<span>{readingMinutes(r)} min</span>
							</li>
						))}
					</ul>
				</section>
			) : null}

			<p className="blog-back">
				<Link to="/blog">← All articles</Link>
				{" · "}
				<Link to="/map">State map</Link>
				{" · "}
				<Link to="/law">Federal law</Link>
			</p>
		</article>
	);
}
