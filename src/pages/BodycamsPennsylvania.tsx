import { Link } from "react-router-dom";
import { Act22Form } from "../components/Act22Form";

export function BodycamsPennsylvania() {
	return (
		<section className="page">
			<div className="page-head">
				<p className="eyebrow">
					<Link to="/bodycams">Bodycams</Link> · Pennsylvania
				</p>
				<h1>Act 22 recording request</h1>
				<p className="lede">
					Pennsylvania police audio and video is not a Right-to-Know record.
					Walk through the Office of Open Records Act 22 form, then read the
					full process so you actually get it served. Education, not legal
					advice.
				</p>
				<p className="act22-jump act22-no-print">
					<a href="#form">Form creator</a>
					{" · "}
					<a href="#process">How Act 22 works</a>
				</p>
			</div>

			<Act22Form />

			<div className="prose" id="process">
				<h2>Pennsylvania Act 22 — the entire process</h2>
				<p>
					Act 22 of 2017 created{" "}
					<a
						href="https://codes.findlaw.com/pa/title-42-pacsa-judiciary-and-judicial-procedure/pa-csa-sect-42-67a03/"
						target="_blank"
						rel="noreferrer"
					>
						42 Pa.C.S. Chapter 67A
					</a>{" "}
					(Recordings by Law Enforcement Officers). It is the exclusive public
					path for “any audio recording or video recording made by a law
					enforcement agency” in Pennsylvania. The Right-to-Know Law does{" "}
					<strong>not</strong> apply to those recordings. If you file a RTKL
					request or appeal to the Office of Open Records, OOR will dismiss for
					lack of jurisdiction.
				</p>
				<p>
					Primary sources:{" "}
					<a
						href="https://www.openrecords.pa.gov/RTKL/PoliceRecordings.cfm"
						target="_blank"
						rel="noreferrer"
					>
						PA Office of Open Records, Requesting Police Recordings
					</a>
					; 42 Pa.C.S. §§ 67A01–67A07. Confirm the current code before you file.
					The form above follows OOR’s{" "}
					<a
						href="https://www.openrecords.pa.gov/Documents/RTKL/Act22_RequestForm.pdf"
						target="_blank"
						rel="noreferrer"
					>
						Law Enforcement Recording Request Form
					</a>{" "}
					(updated March 16, 2020). It does not file anything with the
					Commonwealth. You still have to serve paper.
				</p>

				<h3>1. Confirm Act 22 actually covers the file</h3>
				<p>
					OOR’s summary of the statute: a <strong>law enforcement agency</strong>{" "}
					is the Office of Attorney General, a district attorney’s office, or an
					agency that employs a law enforcement officer. A{" "}
					<strong>law enforcement officer</strong> includes a member of the
					Pennsylvania State Police, a municipal police officer holding a
					current MPOETC certificate, a sheriff, or a deputy sheriff.
				</p>
				<p>
					That covers typical city PD, PSP, and sheriff bodycam / dashcam /
					interview audio-video made by the agency. It does{" "}
					<strong>not</strong> create a public right to recordings made{" "}
					<em>inside a facility owned or operated by a law enforcement agency</em>
					, or to communications between agencies about a recording (42 Pa.C.S. §
					67A02(b)). Station-house / lockup interior video is a different fight.
				</p>
				<p>
					Act 22 is also not criminal discovery. If you are a defendant, your
					lawyer usually uses Pa.R.Crim.P. 573 / a subpoena. That track is
					separate from this public-request process.
				</p>

				<h3>2. Calendar the 60-day filing window</h3>
				<p>
					You must serve the written request on the agency’s open-records
					officer{" "}
					<strong>within 60 days of the date the recording was made</strong> (§
					67A03(1)). Count from the recording date, not from when you found out
					about it. Miss it and there is generally no RTKL fallback. Courts can
					summarily dismiss a later petition as untimely (§ 67A06(d)(1)).
				</p>

				<h3>3. Find the Agency Open Records Officer (AORO)</h3>
				<p>
					Service has to go to the person designated as that agency’s
					open-records officer under RTKL § 502 — even though RTKL does not
					govern the recording itself. Look on the department or municipality
					website for “Right-to-Know Officer” / “Open Records Officer.” For
					Pennsylvania State Police, current published intake is:
				</p>
				<p>
					Pennsylvania State Police, Bureau of Records &amp; Identification,
					ATTN: Agency Open Records Officer, 1800 Elmerton Avenue, Harrisburg,
					PA 17110. PSP’s own page says the office accepts requests 8:15 a.m. –
					4:15 p.m., Monday–Friday except holidays. Confirm the name and address
					on{" "}
					<a
						href="https://www.pa.gov/services/psp/request-pennsylvania-state-police-audio-or-video-recordings"
						target="_blank"
						rel="noreferrer"
					>
						PSP’s Act 22 service page
					</a>{" "}
					before you mail.
				</p>

				<h3>4. Write a request that hits every required element</h3>
				<p>Under § 67A03, the request must:</p>
				<ul>
					<li>
						Specify <strong>with particularity</strong> the incident or event,
						including <strong>date, time, and location</strong>.
					</li>
					<li>
						Include a statement describing <strong>your relationship</strong> to
						the incident (subject, passenger, parent, attorney, journalist,
						neighbor, etc.).
					</li>
					<li>
						If it happened <strong>inside a residence</strong>, identify{" "}
						<strong>each person present</strong> at the time of the recording,
						unless not known and not reasonably ascertainable.
					</li>
				</ul>
				<p>
					Using the OOR form is not required, but it tracks the statute. A
					completed form is usually a public record. Insufficient particularity
					is its own later trap: a Court of Common Pleas can summarily dismiss
					your petition if the original request failed to describe date, time,
					and location with enough particularity (§ 67A06(d)(2)).
				</p>

				<h3>5. Serve it — in person or certified mail only</h3>
				<p>
					§ 67A03(1): service is effective only upon{" "}
					<strong>receipt by the open-records officer</strong> from{" "}
					<strong>personal delivery</strong> or{" "}
					<strong>certified mail with proof of service</strong>. Email, fax, a
					web portal, regular first-class mail, and dropping it with a random
					desk officer do not start the clock. The request is not officially
					received until it is handed to the AORO or USPS marks the certified
					item “delivered.”
				</p>
				<p>
					Keep the green card / tracking printout. That proof is what you will
					need if they later claim they never got it, and it is what you attach
					to a court petition.
				</p>

				<h3>6. Agency’s 30-day response clock</h3>
				<p>
					Once properly received, the agency has <strong>30 days</strong> to
					either give you the recording or identify in writing the basis for
					denying it (§ 67A05(a)). You and the agency can agree to a longer
					period. If the agency has a § 67A04(b)(2) memorandum of understanding
					that requires the Attorney General or the district attorney to issue
					the denial, any extension agreement has to be with that prosecutor, not
					just the police department.
				</p>
				<p>
					During that window the agency may review the request itself. If it has
					an MOU with the DA or the AG, an attorney from that office may review
					the recording and decide whether it will be released (§ 67A04(b)).
				</p>

				<h3>7. Preservation after a valid request</h3>
				<p>
					Once the agency has received the request, it must preserve the{" "}
					<strong>unaltered</strong> audio or video for no less than the time
					periods in Chapter 67A for service and response, plus any period in
					which a petition for judicial review is allowable or pending (§
					67A05(c)). That duty does not exist until they actually receive a
					valid Act 22 request — which is why certified-mail timing and a
					separate preservation letter both matter.
				</p>

				<h3>8. If they grant it</h3>
				<p>
					They may charge <strong>“reasonable fees”</strong> for the costs
					incurred to disclose the recording. The statute does not set a
					statewide price list. Fees are paid at the time of disclosure (§
					67A05(d)). Pennsylvania State Police currently publishes{" "}
					<strong>$150 per granted recording</strong> — that is a PSP schedule,
					not a statewide cap. Put a fee-notification ceiling on your request
					(OOR’s form has $100 as a default checkbox).
				</p>

				<h3>9. Grounds for a written denial</h3>
				<p>
					Under § 67A04(a), the agency <strong>shall deny in writing</strong> if
					it determines the recording contains any of the following{" "}
					<strong>and</strong> that reasonable redaction would not safeguard
					that material:
				</p>
				<ul>
					<li>potential evidence in a criminal matter;</li>
					<li>
						information pertaining to an investigation or a matter in which a
						criminal charge has been filed;
					</li>
					<li>confidential information; or</li>
					<li>victim information.</li>
				</ul>
				<p>
					The written denial must state that reasonable redaction will not
					safeguard that evidence or information. These grounds are broader than
					the RTKL criminal-investigation exemption, and there is no
					administrative second look at OOR.
				</p>

				<h3>10. Silence is a denial</h3>
				<p>
					If they do not produce the recording or explain the denial within 30
					days (or the agreed extension), the request is{" "}
					<strong>deemed denied by operation of law</strong> (§ 67A05(b)). The
					agency’s review time does not start until the AORO actually receives
					the request. Deemed denial starts the same 30-day court-petition clock
					as a written “no.”
				</p>

				<h3>11. Discretionary release (separate from your request)</h3>
				<p>
					Nothing in Act 22 stops a law enforcement agency or a prosecuting
					attorney with jurisdiction from releasing a recording with or without
					a written request. OOR’s caveat: if the prosecuting attorney determines
					the recording contains potential evidence, investigation information,
					confidential information, or victim information — and reasonable
					redaction will not safeguard it — the agency can release only with that
					prosecutor’s <strong>written permission</strong>.
				</p>

				<h3>12. Appeal: Petition for Judicial Review, not OOR</h3>
				<p>
					You have <strong>30 days from the date of denial</strong> (written or
					deemed) to file a petition for judicial review in the{" "}
					<strong>Court of Common Pleas with jurisdiction</strong> — the court
					in the county where the recorded event took place (§ 67A06(a)(1)).
					OOR will not hear it.
				</p>
				<p>The petition must:</p>
				<ul>
					<li>
						Pay a statutory filing fee of <strong>$125</strong> (§ 67A06(b)(1)).
						The prothonotary may add local fees on top; call the county
						courthouse.
					</li>
					<li>
						Attach a copy of the written Act 22 request and any written
						responses (§ 67A06(b)(3)).
					</li>
					<li>
						<strong>
							Serve the petition on the respondent’s open-records officer within
							five days
						</strong>{" "}
						of filing, by personal delivery or certified mail with proof of
						service (§ 67A06(b)(4)).
					</li>
					<li>
						If the event was inside a residence, certify that notice of the
						petition was served (or service was attempted) on{" "}
						<strong>each person present</strong> and on the{" "}
						<strong>owner and occupant</strong> of the residence, unless identity
						or location is unknown and not reasonably ascertainable (§
						67A06(b)(2)). Same service methods: in person or certified mail.
					</li>
				</ul>
				<p>
					The respondent is the entity that issued the denial. If the request
					was deemed denied by silence, the law enforcement agency that created
					the recording is the respondent (§ 67A06(a)(2)). A prosecuting attorney
					with jurisdiction may <strong>intervene as a matter of right</strong>{" "}
					(§ 67A06(c)).
				</p>

				<h3>13. How the court can throw the petition out</h3>
				<p>Summary dismissal is required if any of these is true (§ 67A06(d)):</p>
				<ol>
					<li>
						The original request to the agency, or the petition itself, was
						untimely (missed 60 days or missed 30 days).
					</li>
					<li>
						The original request did not describe the incident with sufficient
						particularity (date, time, location).
					</li>
					<li>
						You skipped a petitioner duty: the $125 fee, residence notices, the
						request/response attachments, or five-day service on the AORO.
					</li>
				</ol>

				<h3>14. What you have to prove to win</h3>
				<p>
					Even a perfect petition is not an automatic copy. The court may grant
					it in whole or in part only if you establish <strong>all</strong> of
					the following by a <strong>preponderance of the evidence</strong> (§
					67A06(e)):
				</p>
				<ol>
					<li>
						Either the request was <em>not</em> denied under the § 67A04
						evidence / investigation / confidential / victim grounds,{" "}
						<strong>or</strong> it was denied on those grounds and the court
						finds that denial was <strong>arbitrary and capricious</strong>.
					</li>
					<li>
						The public interest in disclosure, or your interest as petitioner,
						<strong> outweighs</strong> the Commonwealth’s, the agency’s, or an
						individual’s interest in nondisclosure. The court may consider the
						public’s interest in seeing how officers interact with the public;
						the safety and privacy of crime victims, law enforcement, and
						others; and the resources available to review and disclose the
						recording.
					</li>
				</ol>
				<p>
					That is a high bar. ACLU of Pennsylvania has described the practical
					risk: a recording can stay denied indefinitely if you never get past
					that standard.
				</p>

				<h3>15. Agency bodycam policies</h3>
				<p>
					Act 22 authorizes agencies to record; it does not require every
					department to buy cameras. An agency that does record must establish
					written policies (training, when the device is on, retention,
					violations) and follow the Wiretap Act guidelines in 18 Pa.C.S. §
					5706(b)(4)–(6) (§ 67A07). Ask for that written policy with a separate
					RTKL request — the policy is a public record even though the video is
					not.
				</p>

				<h3>Act 22 checklist</h3>
				<ol>
					<li>
						Recording date + 60 days = last day to get it into the AORO’s hands.
					</li>
					<li>
						Separate preservation letter the same day (email is fine for the
						hold; not for the Act 22 request).
					</li>
					<li>
						Name the AORO. Date, time, location, relationship. Residence
						occupants if indoors.
					</li>
					<li>Hand-deliver or certified mail with proof. Keep tracking.</li>
					<li>30 days to a grant, a written denial, or a deemed denial.</li>
					<li>Pay posted fees only if they actually produce the file.</li>
					<li>
						If denied or silent: 30 days to file a $125 petition in the county
						where it happened; serve the AORO within five days; do residence
						notices if it was inside a home.
					</li>
					<li>Do not appeal to OOR.</li>
				</ol>

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
