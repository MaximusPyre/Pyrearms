import { Link } from "react-router-dom";
import { X_HANDLE, X_URL } from "../lib/social";

export function Footer() {
	return (
		<footer className="site-footer">
			<div className="footer-rule" aria-hidden="true">
				<span className="footer-mark" />
			</div>
			<p className="footer-brand">PyreArms · PyreLink</p>
			<p className="footer-copy">
				Federal PMF law education. Peer share via open-source PyreLink — MIT.
				{" "}
				<a href={X_URL} target="_blank" rel="noreferrer">
					{X_HANDLE}
				</a>
				.
			</p>
			<div className="footer-links">
				<Link to="/law">Federal law</Link>
				<Link to="/blog">Law watch</Link>
				<Link to="/download">Download PyreLink</Link>
				<a href={X_URL} target="_blank" rel="noreferrer">
					X · {X_HANDLE}
				</a>
				<a
					href="https://www.atf.gov/firearms/privately-made-firearms"
					target="_blank"
					rel="noreferrer"
				>
					ATF on PMFs
				</a>
			</div>
		</footer>
	);
}
