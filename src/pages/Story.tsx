import { Link } from "react-router-dom";

export function Story() {
	return (
		<section className="page">
			<div className="page-head">
				<p className="eyebrow">Origin</p>
				<h1>The Pyre</h1>
				<p className="lede">
					Why PyreArms exists — a rights story, not a storefront.
				</p>
			</div>

			<div className="prose">
				<p>
					An ambulance trip for medical care became an unlawful seizure of
					property. The officers later apologized — profusely.
				</p>
				<p>
					That apology did not put out the fire. It named it. PyreArms exists so
					advocates can read federal PMF law from primary sources, and so
					like-minded people can find each other through PyreLink instead of
					depending on platforms that bury civil rights content.
				</p>
				<p>
					Sale and transfer through dealers are governed by statutes such as{" "}
					<a
						href="https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=18&div=0&chpt=61"
						target="_blank"
						rel="noreferrer"
					>
						18 Pa.C.S. § 6111
					</a>{" "}
					in Pennsylvania. Federally, ATF states that personally made firearms
					for personal use need not be serialized when the maker is not engaged
					in the business. See the{" "}
					<a
						href="https://www.atf.gov/firearms/privately-made-firearms"
						target="_blank"
						rel="noreferrer"
					>
						ATF page on privately made firearms
					</a>
					.
				</p>
				<Link className="btn btn-primary" to="/download">
					Get PyreLink
				</Link>
			</div>
		</section>
	);
}
