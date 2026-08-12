/** Clearnet helpers — phonebook of endpoint IDs only. Never messages/files. */

export async function getConnect() {
	const res = await fetch("/api/connect");
	if (!res.ok) throw new Error("connect failed");
	return res.json() as Promise<{
		service: string;
		v: number;
		role?: string;
		policy?: string;
		oracle: string;
		oracles?: string[];
		label: string;
	}>;
}
