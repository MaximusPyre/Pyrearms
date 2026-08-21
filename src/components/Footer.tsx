import { Link } from "react-router-dom";

export function Footer() {
	return (
		<footer className="site-footer">
			<div className="footer-rule" aria-hidden="true">
				<span className="footer-mark" />
			</div>
			<p className="footer-brand">PyreArms · PyreLink</p>
			<p className="footer-copy">
				A collective for federal PMF law education and open-source peer share.
				PyreLink is MIT licensed.
			</p>
			<div className="footer-links">
				<Link to="/map">State map</Link>
				<Link to="/law">Federal law</Link>
				<Link to="/blog">Blog</Link>
				<Link to="/download">Download PyreLink</Link>
				<a href="/desk/">Manticore Desk</a>
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
