import { useEffect } from "react";
import { HUB_LINKS } from "../data/hubLinks";
import { hubPing } from "../lib/hubAnalytics";
import { X_HANDLE } from "../lib/social";

export function LinkHub() {
	useEffect(() => {
		document.title = `${X_HANDLE} · links`;
		const html = document.documentElement;
		const { body } = document;
		const prevHtml = html.style.background;
		const prevBody = body.style.background;
		html.style.background = "#000";
		body.style.background = "#000";
		body.style.backgroundImage = "none";
		hubPing("view");
		return () => {
			html.style.background = prevHtml;
			body.style.background = prevBody;
			body.style.backgroundImage = "";
		};
	}, []);

	return (
		<div className="hub">
			<video
				className="hub-video"
				autoPlay
				muted
				loop
				playsInline
				aria-hidden="true"
			>
				<source src="/hub/bg.mp4" type="video/mp4" />
			</video>
			<div className="hub-shade" aria-hidden="true" />
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
							onClick={() => hubPing("click", link.id)}
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
