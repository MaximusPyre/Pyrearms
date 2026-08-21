import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "pyrearms.act22.draft.v1";
const TOTAL_STEPS = 7;
const PSP_ADDRESS =
	"Pennsylvania State Police, Bureau of Records & Identification, ATTN: Agency Open Records Officer, 1800 Elmerton Avenue, Harrisburg, PA 17110";

export type Act22Fields = {
	eventDate: string;
	agencyName: string;
	agencyAddress: string;
	requestDate: string;
	submittedVia: "mail" | "person" | "";
	name: string;
	company: string;
	mailingAddress: string;
	city: string;
	state: string;
	zip: string;
	email: string;
	telephone: string;
	fax: string;
	contactPref: "telephone" | "email" | "mail" | "";
	eventTime: string;
	location: string;
	incidentNumber: string;
	eventDescription: string;
	relationship: string;
	insideResidence: "yes" | "no" | "";
	peoplePresent: string;
	peopleUnknown: boolean;
	feeCap: "100" | "custom";
	feeCustom: string;
};

const EMPTY: Act22Fields = {
	eventDate: "",
	agencyName: "",
	agencyAddress: "",
	requestDate: new Date().toISOString().slice(0, 10),
	submittedVia: "",
	name: "",
	company: "",
	mailingAddress: "",
	city: "",
	state: "PA",
	zip: "",
	email: "",
	telephone: "",
	fax: "",
	contactPref: "email",
	eventTime: "",
	location: "",
	incidentNumber: "",
	eventDescription: "",
	relationship: "",
	insideResidence: "",
	peoplePresent: "",
	peopleUnknown: false,
	feeCap: "100",
	feeCustom: "",
};

const RELATION_PRESETS = [
	"I am the subject of the recording.",
	"I was a passenger or occupant during the incident.",
	"I am a parent or legal guardian of a person who was recorded.",
	"I am an attorney representing a person who was recorded.",
	"I am a journalist requesting the recording for news reporting.",
	"I was a bystander present at the incident.",
];

function loadDraft(): Act22Fields {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...EMPTY };
		return { ...EMPTY, ...(JSON.parse(raw) as Partial<Act22Fields>) };
	} catch {
		return { ...EMPTY };
	}
}

function addDays(isoDate: string, days: number) {
	const d = new Date(`${isoDate}T12:00:00`);
	d.setDate(d.getDate() + days);
	return d;
}

function formatLong(isoDate: string) {
	if (!isoDate) return "";
	return addDays(isoDate, 0).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function describeEvent(fields: Act22Fields) {
	const bits = [];
	if (fields.incidentNumber.trim()) {
		bits.push(
			`Incident / CAD / citation number: ${fields.incidentNumber.trim()}`,
		);
	}
	if (fields.eventDescription.trim()) bits.push(fields.eventDescription.trim());
	return bits.join("\n\n");
}

function peopleLine(fields: Act22Fields) {
	if (fields.insideResidence !== "yes") return "";
	if (fields.peopleUnknown) {
		return "Unknown and not reasonably ascertainable.";
	}
	return fields.peoplePresent.trim();
}

function feeLine(fields: Act22Fields) {
	if (fields.feeCap === "custom" && fields.feeCustom.trim()) {
		return `$${fields.feeCustom.replace(/^\$/, "")}`;
	}
	return "$100";
}

export function buildAct22Letter(fields: Act22Fields) {
	const via =
		fields.submittedVia === "person"
			? "personal delivery"
			: "certified mail with proof of service";
	const residence =
		fields.insideResidence === "yes"
			? `If the event occurred in a residence, persons present: ${peopleLine(fields) || "[identify each person present]"}`
			: "The event did not occur inside a residence.";
	const contact =
		fields.contactPref === "telephone"
			? `Telephone: ${fields.telephone}`
			: fields.contactPref === "mail"
				? `U.S. Mail: ${fields.mailingAddress}, ${fields.city}, ${fields.state} ${fields.zip}`
				: `Email: ${fields.email}`;

	return `Law Enforcement Recording Request — Act 22 of 2017
(42 Pa.C.S. Chapter 67A)

This is a request under Act 22 of 2017. The Right-to-Know Law does not apply
to these recordings. Any denial must be appealed to the Court of Common Pleas,
not the Office of Open Records.

SUBMITTED TO (Attn: AORO)
Agency: ${fields.agencyName || "[agency]"}
${fields.agencyAddress ? `Address: ${fields.agencyAddress}\n` : ""}Date of request: ${formatLong(fields.requestDate)}
Submitted via: ${fields.submittedVia === "person" ? "In person" : "U.S. Mail (certified)"}

PERSON MAKING REQUEST
Name: ${fields.name}
${fields.company ? `Company: ${fields.company}\n` : ""}Mailing address: ${fields.mailingAddress}
${fields.city}, ${fields.state} ${fields.zip}
Email: ${fields.email}
Telephone: ${fields.telephone}${fields.fax ? `\nFax: ${fields.fax}` : ""}
Preferred contact: ${contact}

RECORDING REQUESTED
Requests must be submitted within 60 days of the event recorded.

Date and time of the event: ${formatLong(fields.eventDate)}${fields.eventTime ? ` · ${fields.eventTime}` : ""}
Location of the event: ${fields.location}

Describe the event:
${describeEvent(fields) || "[describe the incident with particularity]"}

Describe your relationship to the event:
${fields.relationship || "[relationship]"}

${residence}

If this request is granted, notify me if fees will be more than ${feeLine(fields)}.

This request is served by ${via} as required by 42 Pa.C.S. § 67A03(1).
Please confirm the date of receipt by the open-records officer.

A completed request is generally a public record.
Modeled on the PA Office of Open Records Act 22 form (updated March 16, 2020).
`;
}

export function Act22Form() {
	const [step, setStep] = useState(1);
	const [fields, setFields] = useState<Act22Fields>(loadDraft);
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
	}, [fields]);

	const deadline = useMemo(() => {
		if (!fields.eventDate) return null;
		const last = addDays(fields.eventDate, 60);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const lastCopy = new Date(last);
		lastCopy.setHours(0, 0, 0, 0);
		const ms = lastCopy.getTime() - today.getTime();
		const daysLeft = Math.ceil(ms / 86400000);
		return { last, daysLeft, expired: daysLeft < 0 };
	}, [fields.eventDate]);

	function set<K extends keyof Act22Fields>(key: K, value: Act22Fields[K]) {
		setFields((prev) => ({ ...prev, [key]: value }));
		setError(null);
	}

	function validate(current: number) {
		if (current === 1 && !fields.eventDate) return "Enter the recording date.";
		if (current === 2) {
			if (!fields.agencyName.trim()) return "Name the agency that has the recording.";
			if (!fields.submittedVia) return "Choose how you will serve the request.";
		}
		if (current === 3) {
			if (!fields.name.trim()) return "Your name is required.";
			if (!fields.mailingAddress.trim() || !fields.city.trim() || !fields.zip.trim()) {
				return "A mailing address is required — the OOR form treats the completed request as a public record, and the agency needs a way to send the file.";
			}
		}
		if (current === 4) {
			if (!fields.eventTime.trim()) return "Give a time window. Particularity matters if you later have to petition.";
			if (!fields.location.trim()) return "Give the street, intersection, or place.";
		}
		if (current === 5) {
			if (!fields.eventDescription.trim()) return "Describe the event. Be thorough.";
			if (!fields.relationship.trim()) return "Say how you are connected to the event.";
		}
		if (current === 6) {
			if (!fields.insideResidence) return "Say whether this happened inside a residence.";
			if (
				fields.insideResidence === "yes" &&
				!fields.peopleUnknown &&
				!fields.peoplePresent.trim()
			) {
				return "Name everyone present, or check that they are unknown and not reasonably ascertainable.";
			}
			if (fields.feeCap === "custom" && !fields.feeCustom.trim()) {
				return "Enter a fee notification amount, or use the $100 default.";
			}
		}
		return null;
	}

	function next() {
		const problem = validate(step);
		if (problem) {
			setError(problem);
			return;
		}
		setStep((s) => Math.min(TOTAL_STEPS, s + 1));
	}

	function back() {
		setError(null);
		setStep((s) => Math.max(1, s - 1));
	}

	function reset() {
		sessionStorage.removeItem(STORAGE_KEY);
		setFields({ ...EMPTY, requestDate: new Date().toISOString().slice(0, 10) });
		setStep(1);
		setCopied(false);
		setError(null);
	}

	function usePsp() {
		set("agencyName", "Pennsylvania State Police");
		set("agencyAddress", PSP_ADDRESS);
	}

	const letter = buildAct22Letter(fields);

	function downloadLetter() {
		const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "act-22-recording-request.txt";
		a.click();
		URL.revokeObjectURL(url);
	}

	async function copyLetter() {
		await navigator.clipboard.writeText(letter);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 2000);
	}

	function printForm() {
		window.print();
	}

	return (
		<div className="act22" id="form">
			<div className="act22-no-print">
				<div className="act22-progress" aria-hidden="true">
					<span
						style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
					/>
				</div>
				<p className="act22-step-label">
					Step {step} of {TOTAL_STEPS}
				</p>

				{step === 1 && (
					<div className="act22-panel">
						<h2>When was it recorded?</h2>
						<p>
							Act 22’s 60-day clock runs from the date the recording was made —
							not the day you found out. The Agency Open Records Officer has to
							have the paper in hand before that window closes.
						</p>
						<label>
							Date of the event
							<input
								type="date"
								value={fields.eventDate}
								onChange={(e) => set("eventDate", e.target.value)}
								required
							/>
						</label>
						{deadline && (
							<p
								className={
									deadline.expired
										? "act22-callout danger"
										: deadline.daysLeft <= 14
											? "act22-callout warn"
											: "act22-callout"
								}
							>
								{deadline.expired ? (
									<>
										The 60-day filing window ended{" "}
										<strong>{formatLong(deadline.last.toISOString().slice(0, 10))}</strong>
										. You can still generate a form, but an Act 22 request is
										likely untimely. Talk to a lawyer — discovery or a
										preservation fight is a different track.
									</>
								) : (
									<>
										Last day to get this into the AORO’s hands:{" "}
										<strong>
											{formatLong(deadline.last.toISOString().slice(0, 10))}
										</strong>{" "}
										({deadline.daysLeft} day{deadline.daysLeft === 1 ? "" : "s"}{" "}
										left). Send a preservation email today even if the Act 22
										packet goes out tomorrow.
									</>
								)}
							</p>
						)}
					</div>
				)}

				{step === 2 && (
					<div className="act22-panel">
						<h2>Which agency has the recording?</h2>
						<p>
							Serve the person listed as that agency’s open-records officer
							(often called the Right-to-Know or AORO). Email and web portals
							do not start the Act 22 clock.
						</p>
						<label>
							Agency name
							<input
								value={fields.agencyName}
								onChange={(e) => set("agencyName", e.target.value)}
								placeholder="e.g. Reading Police Department"
							/>
						</label>
						<p className="act22-preset-row">
							<button type="button" className="btn btn-ghost" onClick={usePsp}>
								Pennsylvania State Police
							</button>
						</p>
						<label>
							AORO mailing address (for your envelope — not an OOR field)
							<textarea
								rows={3}
								value={fields.agencyAddress}
								onChange={(e) => set("agencyAddress", e.target.value)}
								placeholder="Street, city, state, ZIP"
							/>
						</label>
						<fieldset className="act22-choices">
							<legend>How will you serve it?</legend>
							<label className="act22-choice">
								<input
									type="radio"
									name="via"
									checked={fields.submittedVia === "mail"}
									onChange={() => set("submittedVia", "mail")}
								/>
								<span>
									<strong>Certified mail</strong>
									<small>
										Return receipt. Clock starts when USPS marks it delivered
										to the AORO — not when you drop it in a mailbox.
									</small>
								</span>
							</label>
							<label className="act22-choice">
								<input
									type="radio"
									name="via"
									checked={fields.submittedVia === "person"}
									onChange={() => set("submittedVia", "person")}
								/>
								<span>
									<strong>Hand-deliver to the AORO</strong>
									<small>
										Not a random desk officer. Keep a dated copy they initial
										or a photo of you handing it over.
									</small>
								</span>
							</label>
						</fieldset>
					</div>
				)}

				{step === 3 && (
					<div className="act22-panel">
						<h2>Who is making the request?</h2>
						<p>
							This is you. A completed Act 22 form is usually a public record.
							Use a mailing address you will actually check.
						</p>
						<label>
							Name
							<input
								value={fields.name}
								onChange={(e) => set("name", e.target.value)}
								autoComplete="name"
							/>
						</label>
						<label>
							Company (if any)
							<input
								value={fields.company}
								onChange={(e) => set("company", e.target.value)}
							/>
						</label>
						<label>
							Mailing address
							<input
								value={fields.mailingAddress}
								onChange={(e) => set("mailingAddress", e.target.value)}
								autoComplete="street-address"
							/>
						</label>
						<div className="act22-row">
							<label>
								City
								<input
									value={fields.city}
									onChange={(e) => set("city", e.target.value)}
									autoComplete="address-level2"
								/>
							</label>
							<label>
								State
								<input
									value={fields.state}
									onChange={(e) => set("state", e.target.value)}
									autoComplete="address-level1"
								/>
							</label>
							<label>
								ZIP
								<input
									value={fields.zip}
									onChange={(e) => set("zip", e.target.value)}
									autoComplete="postal-code"
								/>
							</label>
						</div>
						<label>
							Email
							<input
								type="email"
								value={fields.email}
								onChange={(e) => set("email", e.target.value)}
								autoComplete="email"
							/>
						</label>
						<div className="act22-row">
							<label>
								Telephone
								<input
									type="tel"
									value={fields.telephone}
									onChange={(e) => set("telephone", e.target.value)}
									autoComplete="tel"
								/>
							</label>
							<label>
								Fax (optional)
								<input
									value={fields.fax}
									onChange={(e) => set("fax", e.target.value)}
								/>
							</label>
						</div>
						<fieldset className="act22-choices">
							<legend>If they have questions, contact me by</legend>
							{(
								[
									["email", "Email"],
									["telephone", "Telephone"],
									["mail", "U.S. Mail"],
								] as const
							).map(([id, label]) => (
								<label className="act22-choice compact" key={id}>
									<input
										type="radio"
										name="contact"
										checked={fields.contactPref === id}
										onChange={() => set("contactPref", id)}
									/>
									<span>
										<strong>{label}</strong>
									</span>
								</label>
							))}
						</fieldset>
					</div>
				)}

				{step === 4 && (
					<div className="act22-panel">
						<h2>When and where?</h2>
						<p>
							The statute requires date, time, and location with particularity.
							A later court petition can be thrown out if this part is too
							vague.
						</p>
						<label>
							Time of the event
							<input
								value={fields.eventTime}
								onChange={(e) => set("eventTime", e.target.value)}
								placeholder="e.g. about 9:40 p.m. to 10:15 p.m."
							/>
						</label>
						<label>
							Location
							<input
								value={fields.location}
								onChange={(e) => set("location", e.target.value)}
								placeholder="Street, intersection, municipality, county"
							/>
						</label>
						<label>
							Incident / CAD / citation number (if you have it)
							<input
								value={fields.incidentNumber}
								onChange={(e) => set("incidentNumber", e.target.value)}
							/>
						</label>
					</div>
				)}

				{step === 5 && (
					<div className="act22-panel">
						<h2>What happened, and how are you connected?</h2>
						<p>
							Be thorough. Use another page if you need to. Name officers,
							vehicles, and what you want: body-worn and in-car video and audio
							from every officer who responded.
						</p>
						<label>
							Describe the event
							<textarea
								rows={7}
								value={fields.eventDescription}
								onChange={(e) => set("eventDescription", e.target.value)}
								placeholder="Traffic stop, arrest, crash, welfare check… who was there, what you want copied."
							/>
						</label>
						<p className="act22-preset-row">
							{RELATION_PRESETS.map((preset) => (
								<button
									type="button"
									key={preset}
									className="btn btn-ghost"
									onClick={() => set("relationship", preset)}
								>
									{preset.replace(/\.$/, "")}
								</button>
							))}
						</p>
						<label>
							Your relationship to the event
							<textarea
								rows={3}
								value={fields.relationship}
								onChange={(e) => set("relationship", e.target.value)}
							/>
						</label>
					</div>
				)}

				{step === 6 && (
					<div className="act22-panel">
						<h2>Inside a home? Then fees.</h2>
						<p>
							If the recording was made inside a residence, Act 22 requires you
							to identify everyone present unless that is unknown and not
							reasonably ascertainable. Skip that only if it was not a home.
						</p>
						<fieldset className="act22-choices">
							<legend>Did this happen inside a residence?</legend>
							<label className="act22-choice compact">
								<input
									type="radio"
									name="res"
									checked={fields.insideResidence === "no"}
									onChange={() => set("insideResidence", "no")}
								/>
								<span>
									<strong>No</strong>
								</span>
							</label>
							<label className="act22-choice compact">
								<input
									type="radio"
									name="res"
									checked={fields.insideResidence === "yes"}
									onChange={() => set("insideResidence", "yes")}
								/>
								<span>
									<strong>Yes</strong>
								</span>
							</label>
						</fieldset>
						{fields.insideResidence === "yes" && (
							<>
								<label>
									Everyone present at the time of the recording
									<textarea
										rows={4}
										value={fields.peoplePresent}
										onChange={(e) => {
											set("peoplePresent", e.target.value);
											if (e.target.value.trim()) set("peopleUnknown", false);
										}}
										placeholder="Full names, if known"
										disabled={fields.peopleUnknown}
									/>
								</label>
								<label className="act22-check">
									<input
										type="checkbox"
										checked={fields.peopleUnknown}
										onChange={(e) => {
											set("peopleUnknown", e.target.checked);
											if (e.target.checked) set("peoplePresent", "");
										}}
									/>
									Unknown and not reasonably ascertainable
								</label>
							</>
						)}
						<fieldset className="act22-choices">
							<legend>
								Notify me if fees will be more than… (OOR default is $100)
							</legend>
							<label className="act22-choice compact">
								<input
									type="radio"
									name="fee"
									checked={fields.feeCap === "100"}
									onChange={() => set("feeCap", "100")}
								/>
								<span>
									<strong>$100</strong>
								</span>
							</label>
							<label className="act22-choice compact">
								<input
									type="radio"
									name="fee"
									checked={fields.feeCap === "custom"}
									onChange={() => set("feeCap", "custom")}
								/>
								<span>
									<strong>A different amount</strong>
								</span>
							</label>
						</fieldset>
						{fields.feeCap === "custom" && (
							<label>
								Notify me above
								<input
									inputMode="decimal"
									value={fields.feeCustom}
									onChange={(e) => set("feeCustom", e.target.value)}
									placeholder="50"
								/>
							</label>
						)}
						<p className="fine-print">
							PSP currently lists $150 per granted recording. Other agencies
							set their own “reasonable fees.” You pay at disclosure, not up
							front.
						</p>
					</div>
				)}

				{step === 7 && (
					<div className="act22-panel">
						<h2>Review, print, and serve</h2>
						<p>
							Nothing here is filed for you. Print this packet or download the
							text, then hand it to the AORO or send it certified mail. Keep
							the proof of service. This draft stays in this browser tab only —
							it is not uploaded to PyreArms.
						</p>
						<div className="act22-actions">
							<button type="button" className="btn btn-primary" onClick={printForm}>
								Print the form
							</button>
							<button type="button" className="btn btn-ghost" onClick={copyLetter}>
								{copied ? "Copied" : "Copy letter"}
							</button>
							<button type="button" className="btn btn-ghost" onClick={downloadLetter}>
								Download .txt
							</button>
							<button type="button" className="btn btn-ghost" onClick={reset}>
								Start over
							</button>
						</div>
						<p className="fine-print">
							Official blank:{" "}
							<a
								href="https://www.openrecords.pa.gov/Documents/RTKL/Act22_RequestForm.pdf"
								target="_blank"
								rel="noreferrer"
							>
								OOR Act 22 PDF
							</a>
							. If you print from this page, use the sheet below — it follows
							that form’s fields.
						</p>
					</div>
				)}

				{error && <p className="act22-callout danger">{error}</p>}

				<div className="act22-nav">
					<button
						type="button"
						className="btn btn-ghost"
						onClick={back}
						disabled={step === 1}
					>
						Back
					</button>
					{step < TOTAL_STEPS ? (
						<button type="button" className="btn btn-primary" onClick={next}>
							Continue
						</button>
					) : (
						<button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
							Edit from start
						</button>
					)}
				</div>
			</div>

			<section
				className={`act22-sheet${step === 7 ? " is-preview" : ""}`}
				aria-label="Printable Act 22 request"
			>
				<h1>Law Enforcement Recording Request Form – Act 22 of 2017</h1>
				<p className="act22-sheet-note">
					This form can be used to request law enforcement recordings (“any
					audio recording or video recording made by a law enforcement agency”)
					under Act 22 of 2017. The Right-to-Know Law does not apply to such
					recordings. Any denials must be appealed to the appropriate Court of
					Common Pleas, not the Office of Open Records.
				</p>
				<div className="act22-sheet-grid">
					<p>
						<strong>Submitted to agency name</strong> (Attn: AORO)
						<br />
						{fields.agencyName || " "}
						{fields.agencyAddress ? (
							<>
								<br />
								{fields.agencyAddress}
							</>
						) : null}
					</p>
					<p>
						<strong>Date of request</strong>
						<br />
						{formatLong(fields.requestDate)}
					</p>
					<p>
						<strong>Submitted via</strong>
						<br />
						{fields.submittedVia === "person"
							? "☐ U.S. Mail   ☑ In person"
							: fields.submittedVia === "mail"
								? "☑ U.S. Mail (certified)   ☐ In person"
								: "☐ U.S. Mail   ☐ In person"}
						<br />
						<span className="act22-sheet-hint">
							Act 22 requires personal delivery or certified mail.
						</span>
					</p>
				</div>
				<h2>Person making request</h2>
				<div className="act22-sheet-grid">
					<p>
						<strong>Name</strong>
						<br />
						{fields.name}
					</p>
					<p>
						<strong>Company (if applicable)</strong>
						<br />
						{fields.company}
					</p>
					<p className="span-2">
						<strong>Mailing address</strong>
						<br />
						{fields.mailingAddress}
						<br />
						{fields.city}
						{fields.city ? ", " : ""}
						{fields.state} {fields.zip}
					</p>
					<p>
						<strong>Email</strong>
						<br />
						{fields.email}
					</p>
					<p>
						<strong>Telephone</strong>
						<br />
						{fields.telephone}
					</p>
					<p>
						<strong>Fax</strong>
						<br />
						{fields.fax}
					</p>
					<p>
						<strong>Preferred contact</strong>
						<br />
						{fields.contactPref === "telephone"
							? "Telephone"
							: fields.contactPref === "mail"
								? "U.S. Mail"
								: "Email"}
					</p>
				</div>
				<h2>Recording requested</h2>
				<p className="act22-sheet-hint">
					Requests must be submitted within 60 days of the event recorded. All
					of the following information is required. Be thorough; use additional
					pages if necessary.
				</p>
				<p>
					<strong>Date and time of the event</strong>
					<br />
					{formatLong(fields.eventDate)}
					{fields.eventTime ? ` · ${fields.eventTime}` : ""}
				</p>
				<p>
					<strong>Location of the event</strong>
					<br />
					{fields.location}
				</p>
				<p>
					<strong>Describe the event</strong>
					<br />
					{describeEvent(fields)}
				</p>
				<p>
					<strong>Describe your relationship to the event</strong>
					<br />
					{fields.relationship}
				</p>
				<p>
					<strong>
						If the event occurred in a residence, identify all people present
						(unless unknown &amp; not reasonably ascertainable)
					</strong>
					<br />
					{fields.insideResidence === "yes"
						? peopleLine(fields)
						: fields.insideResidence === "no"
							? "Not applicable — the event did not occur inside a residence."
							: ""}
				</p>
				<p>
					If an Act 22 request is granted, the agency may charge “reasonable
					fees” to provide a copy of the recording. Please notify me if fees
					associated with this request will be more than{" "}
					{fields.feeCap === "100" ? (
						<strong>$100</strong>
					) : (
						<strong>{feeLine(fields)}</strong>
					)}
					.
				</p>
				<p className="act22-sheet-foot">
					NOTE: In most cases, a completed Request Form is a public record.
					Modeled on the Office of Open Records form updated March 16, 2020.
					More information: https://www.openrecords.pa.gov — education, not
					legal advice. Not an official OOR filing system.
				</p>
			</section>
		</div>
	);
}
