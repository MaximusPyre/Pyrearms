const GITHUB = "https://github.com/MaximusPyre/Pyrearms";
const RELEASES = `${GITHUB}/releases`;

export function Download() {
	return (
		<section className="page">
			<div className="page-head">
				<p className="eyebrow">Open source</p>
				<h1>Download PyreLink</h1>
				<p className="lede">
					Creator-less peer share. Host files, copy a share code to social
					media, others fetch while you stay online.
				</p>
			</div>

			<div className="prose">
				<p>
					This website does not host app binaries or community files. Get
					releases from GitHub; peers exchange content over PyreLink P2P.
					Share codes look like{" "}
					<code>pyrelink:1:&lt;endpoint&gt;:&lt;hash&gt;:name</code>.
				</p>

				<div className="download-grid">
					<a
						className="btn btn-primary"
						href={RELEASES}
						target="_blank"
						rel="noreferrer"
					>
						GitHub Releases
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
					.
				</p>
			</div>
		</section>
	);
}
