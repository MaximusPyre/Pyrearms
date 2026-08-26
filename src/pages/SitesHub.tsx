import { usePageMeta } from "../lib/pageMeta";
import {
	HOST_ACCESS_LABEL,
	HOST_GROUPS,
	PYRE_HOSTS,
} from "../data/pyreHosts";

export function SitesHub() {
	usePageMeta({
		title: "PyreArms host directory",
		description:
			"All PyreArms subdomains and related hosts in one list.",
		path: "/sites",
	});

	return (
		<section className="page">
			<div className="page-head">
				<p className="eyebrow">Inventory</p>
				<h1>Host directory</h1>
				<p className="lede">
					Every pyrearms.dev hostname currently in the repo, plus related
					Manticore hosts we actually link. Edit{" "}
					<code>src/data/pyreHosts.ts</code> when another subdomain ships.
				</p>
			</div>
			{HOST_GROUPS.map((group) => {
				const rows = PYRE_HOSTS.filter((host) => host.access === group.id);
				if (!rows.length) return null;
				return (
					<div key={group.id} className="host-group">
						<h2>{group.title}</h2>
						<ul className="host-list">
							{rows.map((host) => (
								<li key={host.id} className="host-card">
									<a className="host-name" href={host.href}>
										{host.host}
										<span className={`host-badge ${host.access}`}>
											{HOST_ACCESS_LABEL[host.access]}
										</span>
									</a>
									<strong>{host.title}</strong>
									<p>{host.summary}</p>
									{host.paths?.length ? (
										<p className="host-paths">
											{host.paths.map((path) => (
												<a key={path.href} href={path.href}>
													{path.label}
												</a>
											))}
										</p>
									) : null}
								</li>
							))}
						</ul>
					</div>
				);
			})}
			<p className="fine-print">
				Dedicated URL:{" "}
				<a href="https://hub.pyrearms.dev">hub.pyrearms.dev</a>
			</p>
		</section>
	);
}
