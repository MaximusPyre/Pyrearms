type EmbersProps = {
	density?: number;
};

export function Embers({ density = 28 }: EmbersProps) {
	const sparks = Array.from({ length: density }, (_, i) => {
		const left = ((i * 37) % 100) + (i % 7) * 0.3;
		const delay = (i % 12) * 0.45;
		const duration = 6 + (i % 8);
		const size = 2 + (i % 4);
		return { left, delay, duration, size, key: i };
	});

	return (
		<div className="embers" aria-hidden="true">
			{sparks.map((s) => (
				<span
					key={s.key}
					className="ember"
					style={{
						left: `${s.left}%`,
						width: s.size,
						height: s.size,
						animationDelay: `${s.delay}s`,
						animationDuration: `${s.duration}s`,
					}}
				/>
			))}
			<div className="smoke" />
		</div>
	);
}
