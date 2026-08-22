export interface Env {
	ASSETS: {
		fetch: (
			input: Request | URL | string,
			init?: RequestInit,
		) => Response | Promise<Response>;
	};
	FIXTURES_HOSTNAME: string;
	FIXTURES_BASIC_USER: string;
	FIXTURES_AUTH_MODE: string;
	FIXTURES_ALLOW_QUERY_TOKEN: string;
	FIXTURES_BASIC_PASSWORD?: string;
	FIXTURES_ACCESS_TOKEN?: string;
}
