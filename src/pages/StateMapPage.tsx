import { StatePmfMap } from "../components/StatePmfMap";
import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/pageMeta";
import { PMF_AS_OF } from "../data/pmfStates";

export function StateMapPage() {
	usePageMeta({
		title: `PMF status by state — interactive map · PyreArms`,
		description: `Click any state for serialization, registration, unfinished-frame, and 3D-print rules. Updated ${PMF_AS_OF}. Education, not legal advice.`,
		path: "/map",
	});

	return (
		<section className="page page-wide map-page">
			<div className="page-head">
				<p className="eyebrow">Fifty states · D.C.</p>
				<h1>PMF status map</h1>
				<p className="lede">
					Click a state. See whether personal manufacture is open, serialized,
					restricted, or effectively banned — then print a pocket statute card
					or open the full state page. This is the tool people return for.
				</p>
				<p className="map-head-actions">
					<Link className="btn btn-ghost" to="/law">
						Federal PMF statutes
					</Link>
					<Link className="btn btn-ghost" to="/blog">
						Latest rulings
					</Link>
				</p>
			</div>

			<StatePmfMap standalone />

			<div className="map-page-foot prose">
				<h2>How to use this</h2>
				<ol>
					<li>Find your state on the map (color = overall tier).</li>
					<li>Read the axes — manufacture, serialize, possess, 3D-print.</li>
					<li>
						Print the state card if you want the cites in your wallet — not a
						permit.
					</li>
					<li>
						Federal injunctions (SAF / Silencer Shop) do{" "}
						<strong>not</strong> erase state bans. Check the map before you
						trust a headline.
					</li>
				</ol>
				<p className="fine-print">
					Provisional classifications from primary statutes and session laws. Not
					legal advice.
				</p>
			</div>
		</section>
	);
}
