import { useEffect, useMemo, useRef, useState } from "react";
import mapSvg from "../assets/us-states.svg?raw";
import {
	getState,
	PMF_AS_OF,
	PMF_STATES,
	TIER_LABEL,
	type StatePmfRecord,
	type Tier,
	type YesNoUnclear,
} from "../data/pmfStates";

const TIER_FILL: Record<Tier, string> = {
	green: "#2f6b3a",
	yellow: "#a67c1a",
	orange: "#b85a18",
	red: "#8b1e18",
	gray: "#4a4542",
};

function labelAxis(v: YesNoUnclear): string {
	if (v === "yes") return "Yes";
	if (v === "no") return "No";
	if (v === "restricted") return "Restricted";
	return "Unclear";
}

export function StatePmfMap() {
	const hostRef = useRef<HTMLDivElement>(null);
	const [selected, setSelected] = useState<StatePmfRecord>(
		() => getState("PA") || PMF_STATES[0],
	);

	const colored = useMemo(() => {
		let html = mapSvg;
		for (const s of PMF_STATES) {
			const fill = TIER_FILL[s.tier];
			html = html.replace(
				new RegExp(`(data-state="${s.code}")`, "g"),
				`$1 style="fill:${fill}"`,
			);
		}
		return html;
	}, []);

	useEffect(() => {
		const root = hostRef.current;
		if (!root) return;
		const onClick = (e: MouseEvent) => {
			const t = e.target as Element | null;
			const el = t?.closest?.("[data-state]") as HTMLElement | null;
			if (!el) return;
			const code = el.getAttribute("data-state");
			if (!code) return;
			const rec = getState(code);
			if (rec) setSelected(rec);
		};
		root.addEventListener("click", onClick);
		return () => root.removeEventListener("click", onClick);
	}, []);

	useEffect(() => {
		const root = hostRef.current;
		if (!root) return;
		root.querySelectorAll("[data-state]").forEach((node) => {
			const el = node as HTMLElement;
			el.classList.toggle(
				"is-selected",
				el.getAttribute("data-state") === selected.code,
			);
		});
	}, [selected, colored]);

	return (
		<div className="pmf-map">
			<header className="pmf-map-head">
				<h2>Status of Privately Made Firearms by State</h2>
				<p className="pmf-asof">As of {PMF_AS_OF}</p>
				<p className="lede">
					Not a red/green binary. Open a state to see serialization, registration,
					precursor, 3D-print, and transfer axes. Classifications are provisional —
					prefer the linked primary sources.
				</p>
			</header>

			<ul className="pmf-legend">
				{(Object.keys(TIER_LABEL) as Tier[]).map((tier) => (
					<li key={tier}>
						<span className="swatch" style={{ background: TIER_FILL[tier] }} />
						{TIER_LABEL[tier]}
					</li>
				))}
			</ul>

			<div className="pmf-map-layout">
				<div
					className="pmf-map-svg"
					ref={hostRef}
					dangerouslySetInnerHTML={{ __html: colored }}
				/>
				<aside className="pmf-detail" aria-live="polite">
					<h3>
						{selected.name}{" "}
						<span className={`tier-pill tier-${selected.tier}`}>
							{selected.tier}
						</span>
					</h3>
					<p>{selected.summary}</p>
					<dl className="pmf-axes">
						<div>
							<dt>Personal manufacture</dt>
							<dd>{labelAxis(selected.personalManufacture)}</dd>
						</div>
						<div>
							<dt>Serialization required</dt>
							<dd>{labelAxis(selected.serializationRequired)}</dd>
						</div>
						<div>
							<dt>Registration required</dt>
							<dd>{labelAxis(selected.registrationRequired)}</dd>
						</div>
						<div>
							<dt>BG check / FFL involvement</dt>
							<dd>{labelAxis(selected.fflOrBackgroundCheck)}</dd>
						</div>
						<div>
							<dt>Unfinished frames regulated</dt>
							<dd>{labelAxis(selected.unfinishedFramesRegulated)}</dd>
						</div>
						<div>
							<dt>3D-printed firearms restricted</dt>
							<dd>{labelAxis(selected.threeDPrintRestricted)}</dd>
						</div>
						<div>
							<dt>Sale / transfer restrictions</dt>
							<dd>{labelAxis(selected.saleTransferRestricted)}</dd>
						</div>
						<div>
							<dt>Possession restrictions</dt>
							<dd>{labelAxis(selected.possessionRestricted)}</dd>
						</div>
						<div>
							<dt>Special age rules</dt>
							<dd>{labelAxis(selected.specialAgeRules)}</dd>
						</div>
					</dl>
					<p className="pmf-statute">
						<strong>Source statute / note:</strong> {selected.statute}
					</p>
					<p className="fine-print">
						Effective note: {selected.effectiveNote} · Confidence:{" "}
						{selected.confidence}
					</p>
					<ul className="pmf-sources">
						{selected.sources.map((s) => (
							<li key={s.url}>
								<a href={s.url} target="_blank" rel="noreferrer">
									{s.label}
								</a>
							</li>
						))}
					</ul>
				</aside>
			</div>
			<p className="fine-print">
				Gray / low-confidence cells mean recent legislation or tracker conflicts.
				This map is educational, not counsel. Always read the statute.
			</p>
		</div>
	);
}
