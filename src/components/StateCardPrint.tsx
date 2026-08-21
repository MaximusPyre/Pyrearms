import {
	FEDERAL_CARD_LINES,
	cardHeadline,
	cardUrl,
	stateCardLines,
} from "../lib/stateCard";
import { PMF_AS_OF, type StatePmfRecord } from "../data/pmfStates";

export function StateCardPrint({ rec }: { rec: StatePmfRecord }) {
	const stateLines = stateCardLines(rec);

	function printSheet() {
		document.documentElement.classList.add("printing-state-cards");
		const done = () => {
			document.documentElement.classList.remove("printing-state-cards");
			window.removeEventListener("afterprint", done);
		};
		window.addEventListener("afterprint", done);
		window.print();
	}

	return (
		<div className="state-card-block" id="card">
			<div className="state-card-toolbar state-law-screen">
				<p>
					US business card (3.5″ × 2″). Print the citation face, cut on the
					marks, laminate if you want it to last. This is a statute card — not a
					permit, not a shield, not legal advice. Comply with a lawful stop; the
					card is so you are not arguing from memory.
				</p>
				<button type="button" className="btn btn-primary" onClick={printSheet}>
					Print 8 cards
				</button>
			</div>

			<div className="state-card-stage state-law-screen">
				<StateCardFace rec={rec} stateLines={stateLines} />
			</div>

			<div className="state-card-sheet" aria-hidden="true">
				{Array.from({ length: 8 }, (_, i) => (
					<StateCardFace key={i} rec={rec} stateLines={stateLines} crop />
				))}
			</div>
		</div>
	);
}

function StateCardFace({
	rec,
	stateLines,
	crop,
}: {
	rec: StatePmfRecord;
	stateLines: ReturnType<typeof stateCardLines>;
	crop?: boolean;
}) {
	return (
		<article className={`state-card${crop ? " has-crop" : ""}`}>
			<header className="state-card-brand">
				<span className="state-card-mark" aria-hidden="true" />
				<div>
					<p className="state-card-org">PyreArms collective</p>
					<h2>
						{rec.name}{" "}
						<span className={`tier-pill tier-${rec.tier}`}>{rec.tier}</span>
					</h2>
				</div>
			</header>
			<p className="state-card-head">{cardHeadline(rec)}</p>
			<ol className="state-card-cites">
				{FEDERAL_CARD_LINES.map((line) => (
					<li key={line.cite}>
						<strong>{line.cite}.</strong> {line.point}
					</li>
				))}
				{stateLines.map((line) => (
					<li key={line.cite}>
						<strong>{line.cite}.</strong> {line.point}
					</li>
				))}
			</ol>
			<footer>
				<span>As of {PMF_AS_OF}</span>
				<span>{cardUrl(rec)}</span>
				<span>Not a permit · not legal advice · verify current code</span>
			</footer>
		</article>
	);
}
