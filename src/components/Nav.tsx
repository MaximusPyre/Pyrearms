import { NavLink } from "react-router-dom";
import { X_HANDLE, X_URL } from "../lib/social";

const links = [
	{ to: "/", label: "Home", end: true },
	{ to: "/law", label: "Law" },
	{ to: "/blog", label: "Watch" },
	{ to: "/story", label: "The Pyre" },
	{ to: "/download", label: "Download" },
];

export function Nav() {
	return (
		<header className="site-nav">
			<NavLink to="/" className="nav-brand" end>
				<span className="nav-mark" aria-hidden="true" />
				PyreArms
			</NavLink>
			<nav className="nav-links" aria-label="Primary">
				{links.map((l) => (
					<NavLink
						key={l.to}
						to={l.to}
						end={l.end}
						className={({ isActive }) => (isActive ? "active" : undefined)}
					>
						{l.label}
					</NavLink>
				))}
				<a
					className="nav-x"
					href={X_URL}
					target="_blank"
					rel="noreferrer"
				>
					{X_HANDLE}
				</a>
			</nav>
		</header>
	);
}
