/** Reserved slots for ad networks. Empty until a network is wired. */
export function AdSlot({
	slot,
	className = "",
}: {
	slot: "rail-left" | "rail-right" | "inline" | "index-mid";
	className?: string;
}) {
	return (
		<aside
			className={`ad-slot ad-slot-${slot} ${className}`.trim()}
			data-ad-slot={slot}
			aria-label="Advertisement"
		>
			<span className="ad-slot-label">Ad</span>
		</aside>
	);
}
