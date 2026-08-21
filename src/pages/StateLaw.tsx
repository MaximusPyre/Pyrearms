import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { StateCardPrint } from "../components/StateCardPrint";
import { billsForState } from "../data/stateBills";
import {
	PMF_AS_OF,
	PMF_STATES,
	TIER_LABEL,
	findState,
	statePath,
	type YesNoUnclear,
} from "../data/pmfStates";

function axis(v: YesNoUnclear) {
	if (v === "yes") return "Yes";
	if (v === "no") return "No";
	if (v === "restricted") return "Restricted";
	return "Unclear";
}

export function StateLaw() {
	const { state: param } = useParams();
	const navigate = useNavigate();
	const rec = param ? findState(param) : undefined;
	if (!rec) return <Navigate to="/law" replace />;

	const bills = billsForState(rec.code);

	return (
		<section className="page">
			<div className="page-head state-law-screen">
				<p className="eyebrow">
					<Link to="/law">Law</Link> · {rec.code}
				</p>
				<h1>{rec.name} PMF status</h1>
				<p className="lede">
					Current educational snapshot as of {PMF_AS_OF} ({rec.confidence}{" "}
					confidence). {TIER_LABEL[rec.tier]}. Print a pocket statute card, then
					read the sources — this is not legal advice.
				</p>
				<p>
					<label className="state-jump">
						Jump to state
						<select
							value={rec.code}
							onChange={(e) => {
								const next = PMF_STATES.find((s) => s.code === e.target.value);
								if (next) navigate(statePath(next));
							}}
						>
							{PMF_STATES.map((s) => (
								<option key={s.code} value={s.code}>
									{s.name}
								</option>
							))}
						</select>
					</label>
				</p>
			</div>

			<StateCardPrint rec={rec} />

			<div className="prose state-law-screen">
				<h2>Status</h2>
				<p>{rec.summary}</p>
				<dl className="pmf-axes">
					<div>
						<dt>Personal manufacture</dt>
						<dd>{axis(rec.personalManufacture)}</dd>
					</div>
					<div>
						<dt>Serialization required</dt>
						<dd>{axis(rec.serializationRequired)}</dd>
					</div>
					<div>
						<dt>Registration required</dt>
						<dd>{axis(rec.registrationRequired)}</dd>
					</div>
					<div>
						<dt>BG check / FFL involvement</dt>
						<dd>{axis(rec.fflOrBackgroundCheck)}</dd>
					</div>
					<div>
						<dt>Unfinished frames regulated</dt>
						<dd>{axis(rec.unfinishedFramesRegulated)}</dd>
					</div>
					<div>
						<dt>3D-printed firearms restricted</dt>
						<dd>{axis(rec.threeDPrintRestricted)}</dd>
					</div>
					<div>
						<dt>Sale / transfer restrictions</dt>
						<dd>{axis(rec.saleTransferRestricted)}</dd>
					</div>
					<div>
						<dt>Possession restrictions</dt>
						<dd>{axis(rec.possessionRestricted)}</dd>
					</div>
				</dl>
				<p>
					<strong>Source statute / note:</strong> {rec.statute}
				</p>
				<p className="fine-print">
					Effective note: {rec.effectiveNote} · Confidence: {rec.confidence}
				</p>
				<ul>
					{rec.sources.map((s) => (
						<li key={s.url}>
							<a href={s.url} target="_blank" rel="noreferrer">
								{s.label}
							</a>
						</li>
					))}
				</ul>

				<h2>Federal baseline (every state)</h2>
				<p>
					Personal manufacture for personal use, detectability, unlicensed
					dealing, obliterated serials, and NFA items are federal. The card
					prints those cites so a local overlay is not the only line on the
					paper. Full writeup: <Link to="/law">federal PMF law</Link>.
				</p>

				<h2>Session law &amp; bills</h2>
				{bills.length === 0 ? (
					<p>
						No PMF / ghost-gun / unfinished-frame session items are in the
						watch list for {rec.name} yet. The cheap LegiScan job fills this
						when a matching bill appears. Enacted map statutes are still in
						the status block above.
					</p>
				) : (
					<ul>
						{bills.map((b) => (
							<li key={`${b.billId}-${b.url}`}>
								<a href={b.url} target="_blank" rel="noreferrer">
									{b.billId}
								</a>
								{" — "}
								{b.title} ({b.status}
								{b.session ? `; ${b.session}` : ""})
							</li>
						))}
					</ul>
				)}

				<h2>Disclaimer</h2>
				<p>
					PyreArms is not a law firm. Handing a citation card is not legal
					advice, not a license, and not permission to refuse a lawful order.
					Statutes move. Read the linked enrolled text before you rely on a
					line.
				</p>
			</div>
		</section>
	);
}
