/**
 * Draft page for /bodycams. Not wired into App, Nav, or Footer yet.
 */
export function Bodycams() {
	return (
		<section className="page">
			<div className="page-head">
				<p className="eyebrow">United States · public records</p>
				<h1>How to request body-camera footage</h1>
				<p className="lede">
					A practical walkthrough of how U.S. body-worn camera video is actually
					obtained: which law applies, what to send, what agencies withhold, and
					how states differ. Education — not legal advice. Confirm the current
					statute and the agency’s records page before you file.
				</p>
			</div>

			<div className="prose">
				<h2>The short version</h2>
				<ol>
					<li>
						Figure out <strong>which agency</strong> recorded it (city police,
						sheriff, state police, campus, transit, or a federal agency).
					</li>
					<li>
						Send a <strong>preservation letter</strong> the same day so the file
						is not auto-deleted on a short retention clock.
					</li>
					<li>
						File a <strong>written public-records request</strong> under the
						right statute — almost never federal FOIA for local cops.
					</li>
					<li>
						Be specific: date, time window, location, incident / CAD / case
						number, officer names if you have them, and “all body-worn and
						dash-camera video and audio.”
					</li>
					<li>
						Expect redaction, fees, delays, and a possible denial with a cited
						exemption. Appeal in writing if the statute gives you that path.
					</li>
				</ol>

				<h2>Federal FOIA is the wrong tool for city and county police</h2>
				<p>
					The federal Freedom of Information Act,{" "}
					<a
						href="https://www.foia.gov/"
						target="_blank"
						rel="noreferrer"
					>
						5 U.S.C. § 552
					</a>
					, reaches <strong>federal</strong> agencies — FBI, ATF, DEA, CBP, Park
					Police, military police on federal land, and similar. It does{" "}
					<strong>not</strong> reach a municipal police department or a county
					sheriff.
				</p>
				<p>
					For local and state officers you use that state’s public-records /
					open-records / sunshine law (often nicknamed “FOIA” anyway). Examples:
					California Public Records Act, New York FOIL, Texas Public Information
					Act, Florida Sunshine Law, Pennsylvania Right-to-Know (with a separate
					bodycam statute — see below).
				</p>
				<p>
					If the stop involved federal agents, you may need both a state request
					to the local department <em>and</em> a federal FOIA to the federal
					agency. Do not assume one request covers both.
				</p>

				<h2>Send a preservation request first</h2>
				<p>
					Many departments keep unflagged bodycam video for weeks or a few
					months, then overwrite it. A records request that takes 30 days can
					arrive after the file is gone. A short written hold — email or portal
					plus a copy you keep — should go out immediately:
				</p>
				<ul>
					<li>
						Identify the incident (date, time, place, case number if you have
						it).
					</li>
					<li>
						Ask the agency to preserve all body-worn camera, in-car camera,
						interview-room, and 911 / CAD audio related to that incident,
						including pre-event buffer footage.
					</li>
					<li>Ask them to confirm in writing that the hold is in place.</li>
				</ul>
				<p>
					If you already have a lawyer or expect litigation, they can send a
					formal litigation hold. This page is not a substitute for that.
				</p>

				<h2>What to put in the records request</h2>
				<p>
					Vague requests (“all video of my arrest”) are easy to delay. Specific
					ones get processed. Include:
				</p>
				<ul>
					<li>Your name, mailing address, email, and phone.</li>
					<li>The statute you are requesting under, if you know it.</li>
					<li>Date, approximate start/end time, and exact location.</li>
					<li>
						Incident, case, report, ticket, or CAD number — several states
						effectively require this (Washington and New Mexico are often cited).
					</li>
					<li>Officer names, badge numbers, unit numbers if known.</li>
					<li>
						A clear ask: all body-worn camera and dashboard camera video and
						audio from every officer who responded, including backups who were
						only there briefly, plus pre-event buffers.
					</li>
					<li>
						Format: electronic copy (MP4 or the agency’s native file). Do not
						ask them to invent a new record.
					</li>
					<li>
						A fee cap: you will pay reasonable copying costs up to $X, and you
						want to be notified before they exceed it. Ask for a fee waiver if
						the state’s law has one (often for news / public interest).
					</li>
					<li>
						If any portion is exempt, ask them to redact and release the rest,
						and to cite the specific exemption for each withholding.
					</li>
					<li>
						Your relationship to the incident (subject, parent, attorney,
						bystander, journalist). Some states only release to listed people.
					</li>
				</ul>
				<p>
					Request by <strong>incident</strong>, not by your name. Some agencies
					claim they cannot search by personal name.
				</p>
				<p>
					Submit the way the agency prefers: portal, email to the records /
					FOIA officer, fax, or certified mail. Keep the timestamp. Many
					statutes start a response clock (often a handful of business days,
					sometimes with one extension).
				</p>

				<h2>Sample request (edit the brackets)</h2>
				<pre className="letter-sample">{`[Date]

Records Officer / FOIA Officer
[Police Department or Sheriff’s Office]
[Address or email]

Re: Public records request — body-worn and in-car camera footage

Pursuant to [state public-records statute], I request copies of the following
records in your agency’s possession:

1. All body-worn camera video and audio from officers present at
   [location] on [date] between [start time] and [end time], including
   pre-event buffer recordings and footage from backup units.
2. All in-car / dash-camera video and audio for the same incident.
3. CAD / dispatch logs and 911 audio related to that call.
4. The incident, arrest, or crash report generated from that event
   (case / CAD number [number], if known).

Please provide electronic copies. If any portion is claimed exempt, release
all reasonably segregable material and cite the specific statutory exemption
for each withholding.

I agree to pay reasonable copying fees up to $[amount]. Please notify me
before incurring costs above that amount.

[Name]
[Address]
[Email]
[Phone]`}</pre>

				<h2>What they will often withhold</h2>
				<p>Common exemptions — they vary by state:</p>
				<ul>
					<li>
						<strong>Active investigation.</strong> The most-used delay. Ask
						whether the case is open, which exemption subsection they are using,
						and when they expect it to close. Some states still require a
						public-interest balance.
					</li>
					<li>
						<strong>Privacy.</strong> Interiors of homes, medical scenes,
						minors, sexual-assault or domestic-violence victims, dead bodies,
						intimate images. Faces and plates are often blurred rather than the
						whole file denied.
					</li>
					<li>
						<strong>Personnel / disciplinary files.</strong> Sometimes stretched
						too far; a public arrest is not automatically a confidential
						personnel record.
					</li>
					<li>
						<strong>Eligible-requester lists.</strong> Michigan, Georgia (for
						privacy-place footage), North Carolina, and others limit who may
						even ask.
					</li>
				</ul>
				<p>
					Redaction of bystanders, kids, and home interiors is normal where
					footage is released at all. It is not, by itself, proof of a cover-up.
					Agencies often charge actual redaction time.
				</p>

				<h2>State models worth knowing</h2>
				<p>
					Bodycam law is not one national rule. As of mid-August 2026, access
					tends to fall into three buckets (always re-read the current code):
				</p>
				<ul>
					<li>
						<strong>Standalone bodycam acts</strong> — e.g. Illinois Law
						Enforcement Officer-Worn Body Camera Act (50 ILCS 706/10-20:
						recordings are closed by default unless flagged for complaint,
						firearm discharge, use of force, arrest/detention, or death/serious
						injury); New Jersey N.J.S.A. 40A:14-118.5; Minnesota § 13.825
						(crash-report holders can get unredacted crash bodycam even while an
						investigation is active, as of a July 1, 2025 amendment); Michigan
						MCL 780.313 (private-place recordings largely FOIA-exempt; limited
						requesters).
					</li>
					<li>
						<strong>Embedded in the general records exemption</strong> — e.g.
						Ohio R.C. § 149.43; Washington RCW 42.56.240(14) (highly detailed
						privacy presumptions and a specificity requirement); Oklahoma 51
						O.S. § 24A.8 (including a concrete post-arraignment release clock);
						Georgia O.C.G.A. § 50-18-72(a)(26.2) (privacy-place footage, sworn
						affidavit for listed requesters). Indiana IC § 5-14-3-5.1 treats
						law-enforcement recordings as inspectable and not merely
						“investigatory records.”
					</li>
					<li>
						<strong>No bodycam-specific statute</strong> — a sizable minority of
						states (Arizona is a commonly cited example) run on general
						public-records law plus department policy. Ask for the written BWC
						policy with the footage request.
					</li>
				</ul>
				<p>
					<strong>California</strong> — Penal Code § 832.7 critical-incident
					categories (firearm discharge at a person; force causing death or
					great bodily injury; certain sustained findings). Baseline disclosure
					window often discussed as 45 days, extendable while a criminal
					investigation is active.
				</p>
				<p>
					<strong>North Carolina</strong> — G.S. § 132-1.4A. Recordings are
					neither public records nor personnel records. “Disclosure” (viewing)
					and “release” (a copy) are different. A copy generally requires a{" "}
					<strong>court order</strong>.
				</p>
				<p>
					<strong>Pennsylvania</strong> — bodycam / dashcam requests generally
					run under Act 22 of 2017, not the ordinary Right-to-Know Law. There is
					a 60-day filing window from the recording date. Appeals go to the
					county Court of Common Pleas (with a filing fee), not the Office of
					Open Records.
				</p>
				<p>
					Arkansas § 12-6-701 is often mis-cited as a general bodycam-access
					law; it concerns recordings of an officer’s death. Ordinary stops
					still go through Arkansas FOIA’s law-enforcement exemption.
				</p>

				<h2>If they say no</h2>
				<ol>
					<li>Get the denial in writing with the cited exemption.</li>
					<li>
						Narrow the request (shorter time window, named officers, drop the
						home-interior portion).
					</li>
					<li>
						Use the statutory appeal — records commission, attorney general
						public-information ruling (Texas is the classic example), or court,
						depending on the state.
					</li>
					<li>
						A lawyer can subpoena the footage in a criminal or civil case even
						when a public-records copy is denied. That is a different track.
					</li>
				</ol>

				<h2>Federal agencies</h2>
				<p>
					Use{" "}
					<a href="https://www.foia.gov/" target="_blank" rel="noreferrer">
						FOIA.gov
					</a>{" "}
					to find the right component (ATF, FBI, CBP, etc.). Ask for body-worn
					or vehicle video by date, location, and case number. Federal FOIA has
					its own exemptions (including ongoing investigation and privacy) and
					its own appeal to the agency, then potentially district court.
				</p>

				<h2>Further reading</h2>
				<ul>
					<li>
						<a href="https://www.foia.gov/" target="_blank" rel="noreferrer">
							FOIA.gov
						</a>{" "}
						— federal only
					</li>
					<li>
						<a
							href="https://www.recordinglaw.com/us-laws/police-reports/how-to-request-body-cam-footage/"
							target="_blank"
							rel="noreferrer"
						>
							Recording Law — request process and state models
						</a>{" "}
						(checked as of August 11, 2026)
					</li>
					<li>
						<a
							href="https://www.rcfp.org/bodycam-video-access/"
							target="_blank"
							rel="noreferrer"
						>
							Reporters Committee — bodycam open-records overview
						</a>
					</li>
					<li>
						<a
							href="https://www.brennancenter.org/our-work/research-reports/police-body-camera-policies-retention-and-release"
							target="_blank"
							rel="noreferrer"
						>
							Brennan Center — retention and release policies
						</a>
					</li>
					<li>
						<a
							href="https://observed.org/how-to-request-police-body-camera-footage/"
							target="_blank"
							rel="noreferrer"
						>
							Observed.org — practical request checklist
						</a>
					</li>
				</ul>

				<h2>Disclaimer</h2>
				<p>
					PyreArms is not a law firm and does not represent you. Public-records
					rules change, and departments add local procedures on top of state
					statutes. Deadlines, eligible requesters, and exemptions can decide
					whether you get a copy, a viewing, or nothing. If the footage matters
					to a case, talk to a lawyer in that jurisdiction and do not wait on a
					slow FOIA clock while retention expires.
				</p>
			</div>
		</section>
	);
}
