import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getPost, type BlogBlock } from "../data/lawBlog";

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
	return (
		<blockquote className="blog-quote">
			<p>{block.text}</p>
			{block.cite ? <cite>{block.cite}</cite> : null}
		</blockquote>
	);
}

export function BlogPost() {
	const { slug } = useParams();
	const post = slug ? getPost(slug) : undefined;

	useEffect(() => {
		if (!post) return;
		const prev = document.title;
		document.title = `${post.title} · PyreArms`;
		const meta = document.querySelector('meta[name="description"]');
		const prevDesc = meta?.getAttribute("content") ?? null;
		meta?.setAttribute("content", post.dek);
		return () => {
			document.title = prev;
			if (meta && prevDesc != null) meta.setAttribute("content", prevDesc);
		};
	}, [post]);

	if (!post) return <Navigate to="/blog" replace />;

	return (
		<article className="page blog-article">
			<div className="page-head">
				<p className="eyebrow">
					<Link to="/blog">Blog</Link> · {post.date}
				</p>
				<h1>{post.title}</h1>
				<p className="lede">{post.dek}</p>
				<p className="blog-tags">
					{post.tags.map((t) => (
						<span key={t}>{t}</span>
					))}
				</p>
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

			<p className="blog-back">
				<Link to="/blog">← All articles</Link>
				{" · "}
				<Link to="/law">State map</Link>
			</p>
		</article>
	);
}
