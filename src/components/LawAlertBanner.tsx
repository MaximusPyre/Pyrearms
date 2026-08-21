import { Link } from "react-router-dom";
import { LAW_ALERTS } from "../data/lawAlerts";

export function LawAlertBanner({ limit }: { limit?: number }) {
	const active = LAW_ALERTS.filter((a) => a.active);
	const shown = typeof limit === "number" ? active.slice(0, limit) : active;
	if (!shown.length) return null;
	return (
		<div className="law-alerts">
			{shown.map((alert) => (
				<article key={alert.id} className="law-alert">
					<p className="eyebrow">
						{alert.kicker} · {alert.date}
					</p>
					<h2>{alert.title}</h2>
					<p>{alert.summary}</p>
					<Link className="text-link" to={alert.href}>
						Read the article →
					</Link>
				</article>
			))}
		</div>
	);
}
