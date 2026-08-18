import { NavLink } from "react-router-dom";

const links = [
	{ to: "/", label: "Home", end: true },
	{ to: "/law", label: "Law" },
	{ to: "/blog", label: "Watch" },
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
			</nav>
		</header>
	);
}
