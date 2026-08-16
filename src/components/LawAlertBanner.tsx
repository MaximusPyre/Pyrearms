import { Link } from "react-router-dom";
import { LAW_ALERTS } from "../data/lawAlerts";

export function LawAlertBanner() {
	const active = LAW_ALERTS.filter((a) => a.active);
	if (!active.length) return null;
	return (
		<div className="law-alerts">
			{active.map((alert) => (
				<article key={alert.id} className="law-alert">
					<p className="eyebrow">
						{alert.kicker} · {alert.date}
					</p>
					<h2>{alert.title}</h2>
					<p>{alert.summary}</p>
					<Link className="text-link" to={alert.href}>
						Read the watch note →
					</Link>
				</article>
			))}
		</div>
	);
}
