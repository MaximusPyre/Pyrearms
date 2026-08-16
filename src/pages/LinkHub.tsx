import { useEffect } from "react";
import { HUB_LINKS } from "../data/hubLinks";
import { X_HANDLE } from "../lib/social";

export function LinkHub() {
	useEffect(() => {
		document.title = `${X_HANDLE} · links`;
	}, []);

	return (
		<div className="hub">
			<header className="hub-head">
				<span className="nav-mark" aria-hidden="true" />
				<p className="eyebrow">Maximus Pyre</p>
				<h1>{X_HANDLE}</h1>
				<p className="lede">Links</p>
			</header>
			<ul className="hub-list">
				{HUB_LINKS.map((link) => (
					<li key={link.id}>
						<a
							className="hub-link"
							href={link.href}
							target="_blank"
							rel="noreferrer"
						>
							{link.label}
							{link.wip ? (
								<span className="hub-wip" title="Work in progress">
									🚧 WIP
								</span>
							) : null}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
