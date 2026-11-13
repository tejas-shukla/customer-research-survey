import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.answers || typeof body.answers !== "object" || body.research_consent !== true) {
      return NextResponse.json({ error: "Please complete the survey and confirm research consent." }, { status: 400 });
    }
    const isEarlyYes = body.answers.early_member === "Yes, definitely";
    if (isEarlyYes && (!body.email || !body.email_contact_consent)) {
      return NextResponse.json({ error: "An email address and contact consent are required for early membership." }, { status: 400 });
    }
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Survey storage is not configured yet. Please contact the survey organiser." }, { status: 503 });
    }
    const { error } = await supabase.from("survey_responses").insert({
      answers: body.answers,
      other_answers: body.other || {},
      email: body.email || null,
      email_contact_consent: body.email_contact_consent === true,
      research_consent: true,
      cohort: body.cohort || "unclassified"
    });
    if (error) {
      console.error("Survey insert failed:", error.message);
      return NextResponse.json({ error: "We couldn't save your response. Please try again later." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }
}
