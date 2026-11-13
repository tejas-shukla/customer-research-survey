 "use client";

import { FormEvent, useState } from "react";

type Answers = Record<string, string | string[]>;
type Question = { id: string; title: string; type: "radio" | "multi"; options: string[]; hint?: string; max?: number };
const questions: Question[] = [
  {
    id: "holiday_timing", title: "When did you last plan or book a holiday involving at least one overnight stay?",
    type: "radio", options: ["Within the last 3 months", "3–6 months ago", "6–12 months ago", "More than 12 months ago"]
  },
  {
    id: "holiday_challenges", title: "Thinking about your most recent holiday, what did you find most challenging?",
    hint: "Select up to 3.", type: "multi", max: 3,
    options: ["Finding affordable flights or transport", "Finding affordable accommodation", "Managing the overall cost", "Saving enough money", "Finding good deals or discounts", "Working out what I could realistically afford", "Comparing different options", "Finding the time to research and plan", "Nothing in particular", "Other (please specify)"]
  },
  {
    id: "saving_behaviour", title: "What do you currently do to save money or make your spending go further?",
    hint: "Select all that apply.", type: "multi",
    options: ["Compare prices across different websites", "Use discount codes or promotional offers", "Use loyalty points or rewards", "Use cashback services", "Use a credit or debit card with rewards", "Save money regularly towards specific goals", "Use budgeting or savings apps", "Reduce spending in other areas", "I don't currently do anything specific", "Other (please specify)"]
  },
  {
    id: "services_used", title: "Which of the following services or tools have you used in the past 12 months?",
    hint: "Select all that apply.", type: "multi",
    options: ["Nectar or Tesco Clubcard", "TopCashback or Quidco", "Airline or hotel loyalty programmes", "Bank or credit card rewards", "Skyscanner or Google Flights", "Booking.com, Expedia or similar services", "Savings or budgeting apps", "Discount or voucher websites", "Spreadsheets, notes or manual tracking", "None of these", "Other (please specify)"]
  },
  {
    id: "rewards_for_goals", title: "Have you ever used loyalty points, cashback or other rewards to help pay for something significant, such as a holiday, purchase or personal expense?",
    type: "radio", options: ["Yes, regularly", "Yes, once or twice", "No, but I have considered it", "No, I usually use rewards for everyday purchases", "I don't currently collect rewards"]
  },
  {
    id: "rewards_fate", title: "What usually happens to the points, cashback or rewards you accumulate?",
    hint: "Select all that apply.", type: "multi",
    options: ["I use them towards everyday purchases", "I exchange them for vouchers or discounts", "I save them for a larger purchase", "I use them towards travel or holidays", "I withdraw them or transfer them elsewhere", "I often forget about them or leave them unused", "They expire before I use them", "I don't usually accumulate rewards", "Other (please specify)"]
  },
  {
    id: "savings_goals", title: "What are you currently saving towards, if anything?",
    hint: "Select all that apply.", type: "multi",
    options: ["Holidays or travel", "Buying a home or mortgage deposit", "Paying off student loans or other debt", "Emergency savings", "A car or major purchase", "Education or personal development", "General savings", "Other personal goals", "I'm not currently saving towards anything"]
  },
  {
    id: "adoption_motivators", title: "What would make you consider trying a new service or app?",
    hint: "Select up to 3.", type: "multi", max: 3,
    options: ["It helps me save money", "It offers clear and worthwhile benefits", "It is easy and convenient to use", "It helps me achieve a personal goal", "It works alongside services I already use", "It is free to use", "It comes from a company or brand I trust", "It offers something I cannot easily get elsewhere", "Other (please specify)", "Nothing would make me consider trying one"]
  },
  {
    id: "paid_services", title: "In the past 12 months, have you paid for any app, membership or service specifically to save money, earn rewards or help you achieve a financial goal?",
    type: "radio", options: ["Yes", "No", "I have considered paying for one, but haven't", "I'm not sure"]
  },
  {
    id: "early_member", title: "We are exploring a new service designed to help people plan more affordable holidays. Would you be interested in joining as one of our early members, with free membership?",
    type: "radio", options: ["Yes, definitely", "Possibly, I'd like to know more", "Maybe, depending on how it works", "No, not at the moment"]
  }
];

export default function Home() {
  const [answers, setAnswers] = useState<Answers>({});
  const [other, setOther] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [researchConsent, setResearchConsent] = useState(false);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const progress = Math.round(((step + 1) / questions.length) * 100);
  const q = questions[step];
  const selected = answers[q.id];
  const isMulti = q.type === "multi";
  const isEmailRequired = answers.early_member === "Yes, definitely";

  function setSingle(value: string) { setAnswers(a => ({ ...a, [q.id]: value })); }
  function toggle(value: string) {
    const current = Array.isArray(selected) ? selected : [];
    if (current.includes(value)) {
      setAnswers(a => ({ ...a, [q.id]: current.filter(v => v !== value) }));
    } else if (!q.max || current.length < q.max) {
      setAnswers(a => ({ ...a, [q.id]: [...current, value] }));
    }
  }
  function valid() {
    if (!selected || (Array.isArray(selected) && selected.length === 0)) return false;
    if (q.id === "early_member" && isEmailRequired && (!email.trim() || !emailConsent)) return false;
    return true;
  }
  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    if (!researchConsent) { setError("Please confirm that you are happy for your survey responses to be used for this research."); return; }
    if (isEmailRequired && (!email.trim() || !emailConsent)) { setError("Please enter your email and agree to be contacted about early membership."); return; }
    setBusy(true);
    const payload = {
      answers: Object.fromEntries(Object.entries(answers).map(([k,v]) => [k, Array.isArray(v) ? v : v])),
      other,
      email: isEmailRequired ? email.trim() : null,
      email_contact_consent: isEmailRequired ? emailConsent : false,
      research_consent: researchConsent,
      cohort: (Array.isArray(answers.services_used) && answers.services_used.some(v => ["Nectar or Tesco Clubcard","TopCashback or Quidco","Airline or hotel loyalty programmes","Bank or credit card rewards"].includes(v))) ? "existing_rewards_user" : "no_reported_rewards_use"
    };
    try {
      const res = await fetch("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setSubmitted(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to submit your response."); }
    finally { setBusy(false); }
  }

  if (submitted) return <main className="shell"><section className="thankyou"><div className="cherry">🍒</div><p className="eyebrow">CUSTOMER RESEARCH CUSTOMER RESEARCH</p><h1>Thank you for taking part!</h1><p>Your answers have been submitted and will help us understand how people save, use rewards and plan more affordable holidays.</p><a className="button" href="/">Back to survey</a></section></main>;

  return <main className="shell">
    <header className="brand"><div className="brand-mark">🍒</div><div><div className="brand-name">Customer Research</div><div className="brand-sub">CUSTOMER RESEARCH</div></div></header>
    <section className="intro"><p className="eyebrow">YOUR EXPERIENCE MATTERS</p><h1>Help us make saving for life's experiences easier.</h1><p>We're researching how people plan holidays, manage savings and use rewards or cashback services. Your feedback will help us understand what people need.</p><div className="meta"><span>◷ 3–4 minutes</span><span>•</span><span>10 questions</span></div></section>
    <section className="survey-card">
      <div className="progress-top"><span>QUESTION {step+1} OF {questions.length}</span><strong>{progress}%</strong></div>
      <div className="progress"><div style={{width:`${progress}%`}} /></div>
      <form onSubmit={e => { e.preventDefault(); if (step < questions.length-1) { if(valid()) setStep(s=>s+1); else setError("Please select an answer to continue."); } else submit(e); }}>
        <div className="question-number">QUESTION {step+1}</div>
        <h2>{q.title}</h2>
        {q.hint && <p className="hint">{q.hint}</p>}
        <div className="options">
          {q.options.map(option => {
            const checked = isMulti ? (Array.isArray(selected) && selected.includes(option)) : selected === option;
            return <label key={option} className={`option ${checked ? "selected" : ""}`}>
              <input type={isMulti ? "checkbox" : "radio"} name={q.id} checked={!!checked} onChange={() => isMulti ? toggle(option) : setSingle(option)} />
              <span className="control" /> <span>{option}</span>
            </label>;
          })}
        </div>
        {((Array.isArray(selected) && selected.includes("Other (please specify)"))) && <input className="text-input" placeholder="Please tell us more (optional)" value={other[q.id] || ""} onChange={e=>setOther(o=>({...o,[q.id]:e.target.value}))}/>}
        {q.id === "early_member" && isEmailRequired && <div className="conditional">
          <h3>Great! What's the best email address to reach you?</h3>
          <input className="text-input" type="email" required placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <label className="consent"><input type="checkbox" checked={emailConsent} onChange={e=>setEmailConsent(e.target.checked)}/><span>I agree to be contacted by the research team about early membership. I understand I can withdraw my consent at any time.</span></label>
        </div>}
        {step === questions.length-1 && <label className="consent research-consent"><input type="checkbox" checked={researchConsent} onChange={e=>setResearchConsent(e.target.checked)}/><span>I agree that my survey answers may be used for this customer research. Please do not include information that identifies me in published findings.</span></label>}
        {error && <p className="error">{error}</p>}
        <div className="actions">
          <button type="button" className="back" disabled={step===0 || busy} onClick={()=>{setError("");setStep(s=>s-1)}}>Back</button>
          {step < questions.length-1 ? <button type="submit" className="next">Continue <span>→</span></button> : <button type="submit" className="next" disabled={busy}>{busy ? "Submitting…" : "Submit survey"} <span>→</span></button>}
        </div>
      </form>
    </section>
    <footer>Customer Research · Thank you for helping us shape what's next.</footer>
  </main>;
}
