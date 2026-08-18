const GITHUB = "https://github.com/MaximusPyre/Pyrearms";
const RELEASE = `${GITHUB}/releases/tag/v0.1.0`;
const ASSET = (name: string) =>
	`${GITHUB}/releases/download/v0.1.0/${encodeURIComponent(name)}`;

export function Download() {
	return (
		<section className="page">
			<div className="page-head">
				<p className="eyebrow">Open source</p>
				<h1>Download PyreLink</h1>
				<p className="lede">
					Peer share without a central file dump. Host files, copy a share code,
					others fetch while you stay online.
				</p>
			</div>

			<div className="prose">
				<p>
					Binaries ship from GitHub Releases — this site does not host app
					installers or community files. Peers exchange content over PyreLink
					P2P. Share codes look like{" "}
					<code>pyrelink:1:&lt;endpoint&gt;:&lt;hash&gt;:name</code>.
				</p>

				<p className="eyebrow" style={{ marginTop: "1.5rem" }}>
					v0.1.0 · Linux x86_64
				</p>
				<div className="download-grid">
					<a
						className="btn btn-primary"
						href={ASSET("PyreLink_0.1.0_amd64.deb")}
						target="_blank"
						rel="noreferrer"
					>
						Debian / Ubuntu · .deb
					</a>
					<a
						className="btn btn-ghost"
						href={ASSET("PyreLink-linux-x86_64")}
						target="_blank"
						rel="noreferrer"
					>
						Portable binary
					</a>
					<a
						className="btn btn-ghost"
						href={ASSET("PyreLink-0.1.0-linux-x86_64.tar.gz")}
						target="_blank"
						rel="noreferrer"
					>
						.tar.gz
					</a>
					<a
						className="btn btn-ghost"
						href={RELEASE}
						target="_blank"
						rel="noreferrer"
					>
						All releases
					</a>
					<a
						className="btn btn-ghost"
						href={GITHUB}
						target="_blank"
						rel="noreferrer"
					>
						Source code
					</a>
				</div>

				<p className="fine-print">
					Portable binary: <code>chmod +x PyreLink-linux-x86_64 && ./PyreLink-linux-x86_64</code>
				</p>

				<h2>Two taps</h2>
				<ul>
					<li>
						<strong>Host</strong> — go online, copy share codes for each file.
					</li>
					<li>
						<strong>Get</strong> — paste a share code, fetch over P2P.
					</li>
				</ul>

				<p className="fine-print">
					MIT licensed. Protocol notes in the repo. Follow U.S. federal and your
					local law — see our <a href="/law">law page</a> and{" "}
					<a
						href="https://www.atf.gov/firearms/privately-made-firearms"
						target="_blank"
						rel="noreferrer"
					>
						ATF PMF materials
					</a>
					. Windows / macOS builds are not in this release yet.
				</p>
			</div>
		</section>
	);
}
