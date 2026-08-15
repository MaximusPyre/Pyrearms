import { Link } from "react-router-dom";
import { LAW_BLOG } from "../data/lawBlog";
import { PMF_AS_OF } from "../data/pmfStates";

export function Blog() {
	return (
		<section className="page">
			<div className="page-head">
				<p className="eyebrow">Law watch</p>
				<h1>State PMF legislation</h1>
				<p className="lede">
					Dated notes when the fifty-state map is verified or a bill moves.
					Map as of {PMF_AS_OF}. Education, not legal advice.
				</p>
			</div>

			<div className="prose">
				{LAW_BLOG.length === 0 ? (
					<p>
						No watch posts yet. The daily check will log here when federal or
						state PMF / ghost gun / 3D-printed firearm rules change — or when a
						full fifty-state verify finds no change.
					</p>
				) : (
					LAW_BLOG.map((post) => (
						<article key={post.id} className="law-post">
							<p className="eyebrow">{post.date}</p>
							<h2>{post.title}</h2>
							<p>{post.body}</p>
							{post.changed.length > 0 ? (
								<p>
									<strong>Moved:</strong> {post.changed.join(", ")}
								</p>
							) : null}
						</article>
					))
				)}
				<p>
					<Link to="/law">Open the state map</Link>
					{" · "}
					<a
						href="https://x.com/maximuspyre"
						target="_blank"
						rel="noreferrer"
					>
						Beta testers: @maximuspyre on X
					</a>
				</p>
			</div>
		</section>
	);
}
