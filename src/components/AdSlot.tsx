/**
 * Reserved inline slots for a future ad network.
 * Avoid "ad" in structural class names — blockers hide them and can collapse
 * surrounding CSS grid tracks.
 */
export function AdSlot({
	slot,
	className = "",
}: {
	slot: "inline" | "index-mid";
	className?: string;
}) {
	return (
		<aside
			className={`promo-slot promo-slot-${slot} ${className}`.trim()}
			data-promo-slot={slot}
			aria-hidden="true"
		>
			<span className="promo-slot-label">Sponsor</span>
		</aside>
	);
}
