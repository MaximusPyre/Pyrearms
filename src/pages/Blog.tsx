import { Link } from "react-router-dom";
import { BetaCallout } from "../components/BetaCallout";
import { LAW_BLOG } from "../data/lawBlog";
import { PMF_AS_OF } from "../data/pmfStates";
import { X_HANDLE, X_URL } from "../lib/social";

export function Blog() {
	return (
		<section className="page">
			<div className="page-head">
				<p className="eyebrow">Law watch</p>
				<h1>State PMF legislation</h1>
				<p className="lede">
					Dated notes when the fifty-state map is verified, a bill moves, or a
					federal court / ATF action is material. Map as of {PMF_AS_OF}.
					Education, not legal advice.
				</p>
			</div>

			<BetaCallout />

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
					<a href={X_URL} target="_blank" rel="noreferrer">
						3D2A testers: {X_HANDLE} on X
					</a>
				</p>
			</div>
		</section>
	);
}
