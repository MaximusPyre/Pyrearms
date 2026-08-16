import { X_HANDLE, X_URL } from "../lib/social";

export function BetaCallout({ compact = false }: { compact?: boolean }) {
	return (
		<aside className={compact ? "beta-callout beta-callout-compact" : "beta-callout"}>
			<p className="eyebrow">PyreLink</p>
			<p>
				Want a Linux build or to talk shop — DM{" "}
				<a href={X_URL} target="_blank" rel="noreferrer">
					{X_HANDLE}
				</a>{" "}
				on X.
			</p>
		</aside>
	);
}
