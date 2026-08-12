import { useEffect, useState, type FormEvent } from "react";

export function AdminConnect() {
	const [authed, setAuthed] = useState(false);
	const [password, setPassword] = useState("");
	const [oraclesText, setOraclesText] = useState("");
	const [label, setLabel] = useState("community");
	const [error, setError] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);
	const [envOverride, setEnvOverride] = useState(false);

	async function loadConfig() {
		const res = await fetch("/api/admin/connect", { credentials: "include" });
		if (!res.ok) throw new Error("Unauthorized");
		const data = (await res.json()) as {
			oracle: string;
			oracles?: string[];
			label: string;
			env_override: boolean;
		};
		const list =
			data.oracles?.length ? data.oracles : data.oracle ? [data.oracle] : [];
		setOraclesText(list.join("\n"));
		setLabel(data.label || "community");
		setEnvOverride(data.env_override);
	}

	useEffect(() => {
		fetch("/api/admin/session", { credentials: "include" })
			.then(async (res) => {
				if (!res.ok) throw new Error("no session");
				setAuthed(true);
				await loadConfig();
			})
			.catch(() => setAuthed(false));
	}, []);

	async function onLogin(e: FormEvent) {
		e.preventDefault();
		setError(null);
		const res = await fetch("/api/admin/login", {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password }),
		});
		if (!res.ok) {
			setError("Invalid credentials");
			return;
		}
		setAuthed(true);
		setPassword("");
		await loadConfig();
	}

	async function onSave(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setNotice(null);
		const oracles = oraclesText
			.split(/[\n,]+/)
			.map((s) => s.trim())
			.filter(Boolean);
		const res = await fetch("/api/admin/connect", {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ oracles, label }),
		});
		if (!res.ok) {
			const data = (await res.json().catch(() => ({}))) as { error?: string };
			setError(data.error || "Save failed");
			return;
		}
		setNotice(`Saved ${oracles.length} community oracle(s).`);
	}

	async function onLogout() {
		await fetch("/api/admin/logout", {
			method: "POST",
			credentials: "include",
		});
		setAuthed(false);
	}

	if (!authed) {
		return (
			<section className="page narrow">
				<div className="page-head">
					<p className="eyebrow">Operator</p>
					<h1>Connect config</h1>
				</div>
				<form className="checkout-form" onSubmit={onLogin}>
					<label>
						Password
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</label>
					{error && <p className="status error">{error}</p>}
					<button type="submit" className="btn btn-primary">
						Enter
					</button>
				</form>
			</section>
		);
	}

	return (
		<section className="page narrow">
			<div className="page-head admin-head">
				<div>
					<p className="eyebrow">Operator</p>
					<h1>Connect config</h1>
				</div>
				<button type="button" className="btn btn-ghost" onClick={onLogout}>
					Log out
				</button>
			</div>

			{envOverride && (
				<p className="banner">
					CONNECT_ORACLE_ID env is merged into the published oracle list.
				</p>
			)}
			{notice && <p className="banner">{notice}</p>}
			{error && <p className="status error">{error}</p>}

			<form className="checkout-form" onSubmit={onSave}>
				<label>
					Community oracle endpoint IDs (one per line)
					<textarea
						value={oraclesText}
						onChange={(e) => setOraclesText(e.target.value)}
						rows={6}
						placeholder={"abc123...\ndef456..."}
						spellCheck={false}
					/>
				</label>
				<label>
					Label
					<input
						value={label}
						onChange={(e) => setLabel(e.target.value)}
						placeholder="community"
					/>
				</label>
				<p className="fine-print">
					Phonebook only: publish endpoint IDs so PyreLink can bootstrap peers.
					This site never stores or relays messages, files, or room content —
					all of that stays on P2P.
				</p>
				<button type="submit" className="btn btn-primary">
					Save
				</button>
			</form>
		</section>
	);
}
