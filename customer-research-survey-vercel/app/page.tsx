 "use client";

import { FormEvent, useState } from "react";

// "@market" resolves to content/uk.ts or content/br.ts at build time, so each
// deployment only ships its own country's questions.
import content from "@market";

type Answers = Record<string, string | string[]>;
const { questions } = content;

export default function Home() {
  const [answers, setAnswers] = useState<Answers>(content.defaultAnswers);
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
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  // Email is only required when the user opts in to hear about the launch.
  const isEmailRequired = emailConsent;

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
    if (q.id === "early_member" && isEmailRequired && !emailValid) return false;
    return true;
  }
  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    if (!researchConsent) { setError("Please confirm that you are happy for your survey responses to be used for this research."); return; }
    if (isEmailRequired && !emailValid) { setError("Please enter a valid email address so we can let you know when the app launches."); return; }
    setBusy(true);
    const payload = {
      answers: Object.fromEntries(Object.entries(answers).map(([k,v]) => [k, Array.isArray(v) ? v : v])),
      other,
      email: emailConsent ? email.trim() : "",
      email_contact_consent: emailConsent,
      research_consent: researchConsent,
      cohort: (Array.isArray(answers.services_used) && answers.services_used.some(v => content.rewardServices.includes(v))) ? "existing_rewards_user" : "no_reported_rewards_use"
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
      <div className="progress-top"><span>{step === 0 ? "BEFORE YOU BEGIN" : `QUESTION ${step} OF ${questions.length - 1}`}</span><strong>{progress}%</strong></div>
      <div className="progress"><div style={{width:`${progress}%`}} /></div>
      <form onSubmit={e => { e.preventDefault(); if (step < questions.length-1) { if(valid()) setStep(s=>s+1); else setError("Please select an answer to continue."); } else submit(e); }}>
        <div className="question-number">{step === 0 ? "BEFORE YOU BEGIN" : `QUESTION ${step} OF ${questions.length - 1}`}</div>
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
        {q.id === "early_member" && <div className="conditional">
          <label className="consent"><input type="checkbox" checked={emailConsent} onChange={e=>{setEmailConsent(e.target.checked); setError("");}}/><span>Yes, let me know when the app launches. I agree to be contacted by the research team about the launch and early membership, and I can withdraw my consent at any time.</span></label>
          {emailConsent && <>
            <h3>What's the best email address to reach you?</h3>
            <input className="text-input" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>{setEmail(e.target.value); setError("");}} />
          </>}
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
