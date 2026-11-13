 "use client";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

export default function QRPage() {
  const [url, setUrl] = useState(process.env.NEXT_PUBLIC_SITE_URL || "");
  return <main className="qr-shell"><a href="/" className="back-link">← Back to survey</a><section className="qr-card">
    <div className="brand-mark">🍒</div><p className="eyebrow">CUSTOMER RESEARCH</p><h1>Share the survey</h1>
    <p>Enter your published survey URL to create a QR code that people can scan with their phones.</p>
    <input className="text-input" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://your-survey.vercel.app"/>
    <div className="qr-code" id="survey-qr"><QRCodeSVG value={url || "https://example.com"} size={240} level="H" includeMargin /></div>
    <p className="hint">Check that the QR code opens your live survey before printing or sharing it.</p>
    <button className="next" onClick={() => { const svg=document.querySelector("#survey-qr svg"); if(!svg) return; const blob=new Blob([new XMLSerializer().serializeToString(svg)],{type:"image/svg+xml"}); const link=document.createElement("a"); link.href=URL.createObjectURL(blob); link.download="customer-research-survey-qr.svg"; link.click(); URL.revokeObjectURL(link.href); }}>Download QR code</button>
  </section></main>;
}
