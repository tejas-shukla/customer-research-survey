import { NextResponse } from "next/server";
import content from "@market";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.answers || typeof body.answers !== "object" || body.research_consent !== true) {
      return NextResponse.json({ error: "Please complete the survey and confirm research consent." }, { status: 400 });
    }
    const wantsLaunchUpdates = body.email_contact_consent === true;
    const email = wantsLaunchUpdates && typeof body.email === "string" ? body.email.trim() : "";
    // Email is only required (and only stored) when the user opts in to launch updates.
    if (wantsLaunchUpdates && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address so we can let you know when the app launches." }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;
    if (!scriptUrl || !secret) {
      return NextResponse.json({ error: "Survey storage is not configured yet. Please contact the survey organiser." }, { status: 503 });
    }

    let appsScriptResponse: Response;
    try {
      appsScriptResponse = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          answers: body.answers,
          other: body.other || {},
          email,
          email_contact_consent: wantsLaunchUpdates,
          research_consent: true,
          cohort: body.cohort || "unclassified",
          // Set by the server from the deployment, not by the browser.
          market: content.market
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000)
      });
    } catch {
      console.error("Survey storage request failed.");
      return NextResponse.json({ error: "We couldn't save your response. Please try again later." }, { status: 500 });
    }

    let appsScriptResult: unknown;
    try {
      appsScriptResult = await appsScriptResponse.json();
    } catch {
      appsScriptResult = null;
    }

    const result = appsScriptResult as { ok?: unknown; success?: unknown; status?: unknown } | null;
    const succeeded = result?.ok === true || result?.success === true || result?.status === "success";
    if (!appsScriptResponse.ok || !succeeded) {
      console.error("Survey storage request failed:", appsScriptResponse.status);
      return NextResponse.json({ error: "We couldn't save your response. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }
}
