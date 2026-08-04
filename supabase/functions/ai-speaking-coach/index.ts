const allowedOrigins = new Set([
  "https://starspeakerstudio.com",
  "https://www.starspeakerstudio.com",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);

const metricSchema = {
  type: "object",
  additionalProperties: false,
  required: ["clarity", "structure", "pressure", "interaction"],
  properties: {
    clarity: { type: "integer", minimum: 0, maximum: 100 },
    structure: { type: "integer", minimum: 0, maximum: 100 },
    pressure: { type: "integer", minimum: 0, maximum: 100 },
    interaction: { type: "integer", minimum: 0, maximum: 100 },
  },
};

const resultSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "metrics",
    "strength_tr",
    "correction_tr",
    "evidence_tr",
    "improved_opening_tr",
    "next_action_tr",
  ],
  properties: {
    metrics: metricSchema,
    strength_tr: { type: "string", minLength: 12, maxLength: 220 },
    correction_tr: { type: "string", minLength: 12, maxLength: 220 },
    evidence_tr: { type: "string", minLength: 12, maxLength: 260 },
    improved_opening_tr: { type: "string", minLength: 8, maxLength: 260 },
    next_action_tr: { type: "string", minLength: 8, maxLength: 180 },
  },
};

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") || "";
  const allowedOrigin = allowedOrigins.has(origin) ? origin : "https://starspeakerstudio.com";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json; charset=utf-8" },
  });
}

function safeJson(value: FormDataEntryValue | null, fallback: unknown) {
  try {
    return JSON.parse(String(value || ""));
  } catch {
    return fallback;
  }
}

function compactText(value: unknown, max = 1200) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

const experienceVersion = "career_english_v3";
const validSituations = new Set(["meeting", "interview", "presentation"]);
const validReportedLevels = new Set(["a2_1", "a2_2", "b1_1", "b1_2", "b2_1", "b2_2", "c1_1", "unsure"]);
const normalizedLevels: Record<string, string> = {
  a2_1: "a2_1", a2_2: "a2_2", b1_1: "b1_1", b1_2: "b1_2",
  b2_1: "b2_1", b2_2: "b2_2", c1_1: "c1_1", unsure: "b1_1",
};
const questionIds: Record<string, string> = {
  "meeting:a2_1":"meeting-a2-1-helpful-routine", "meeting:a2_2":"meeting-a2-2-useful-app",
  "meeting:b1_1":"meeting-b1-1-time-organization", "meeting:b1_2":"meeting-b1-2-home-or-office",
  "meeting:b2_1":"meeting-b2-1-useful-meetings", "meeting:b2_2":"meeting-b2-2-digital-communication",
  "meeting:c1_1":"meeting-c1-1-productive-disagreement", "meeting:unsure":"meeting-unsure-practical-change",
  "interview:a2_1":"interview-a2-1-enjoyable-activity", "interview:a2_2":"interview-a2-2-learned-skill",
  "interview:b1_1":"interview-b1-1-recent-problem", "interview:b1_2":"interview-b1-2-difficult-choice",
  "interview:b2_1":"interview-b2-1-learning-goal", "interview:b2_2":"interview-b2-2-changed-opinion",
  "interview:c1_1":"interview-c1-1-success-definition", "interview:unsure":"interview-unsure-proud-moment",
  "presentation:a2_1":"presentation-a2-1-favorite-place", "presentation:a2_2":"presentation-a2-2-recommend-experience",
  "presentation:b1_1":"presentation-b1-1-helpful-habit", "presentation:b1_2":"presentation-b1-2-recent-change",
  "presentation:b2_1":"presentation-b2-1-technology-boundaries", "presentation:b2_2":"presentation-b2-2-place-to-live",
  "presentation:c1_1":"presentation-c1-1-convenience-cost", "presentation:unsure":"presentation-unsure-useful-recommendation",
};
const validDurations = new Set([45, 60, 90, 120]);
const validFeelings = new Set(["fantastic", "confident", "calm", "nervous", "tired"]);
const firstNamePattern = /^[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû]+(?:[ '-][A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû]+)*$/u;

function serviceConfig() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Persistence is not configured.");
  return { url, key };
}

async function callRpc(name: string, args: Record<string, unknown>) {
  const { url, key } = serviceConfig();
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || `${name} failed.`);
  return Array.isArray(body) ? body[0] : body;
}

async function upsertParticipant(payload: Record<string, unknown>) {
  const firstName = compactText(payload.first_name, 40).normalize("NFC");
  const situation = compactText(payload.situation, 30);
  const reportedLevel = compactText(payload.reported_level, 30);
  const sessionId = compactText(payload.session_id, 80);
  const version = compactText(payload.experience_version, 50);
  const question = (payload.question || {}) as Record<string, unknown>;
  const questionId = compactText(payload.question_id, 100);
  const duration = Number(payload.recording_duration_seconds);
  const feeling = compactText(payload.emotional_state, 30);
  if (!sessionId || !firstNamePattern.test(firstName) || !validSituations.has(situation)
    || !validReportedLevels.has(reportedLevel) || version !== experienceVersion
    || questionIds[`${situation}:${reportedLevel}`] !== questionId
    || !validDurations.has(duration) || !validFeelings.has(feeling)) {
    throw new Error("Participant setup is invalid.");
  }
  const saved = await callRpc("upsert_career_english_participant", {
    p_session_id: sessionId,
    p_first_name: firstName,
    p_situation: situation,
    p_reported_level: reportedLevel,
    p_normalized_level: normalizedLevels[reportedLevel],
    p_question_id: questionId,
    p_question_snapshot: {
      id: questionId,
      title: compactText(question.title, 500),
      context: compactText(question.context, 500),
      guide: compactText(question.guide, 300),
    },
    p_recording_duration_seconds: duration,
    p_emotional_state: feeling,
    p_emotional_selected_at: payload.emotional_selected_at || new Date().toISOString(),
    p_source_data: payload.source_data || {},
  });
  return saved;
}

async function advanceParticipant(payload: Record<string, unknown>) {
  const sessionId = compactText(payload.session_id, 80);
  if (!sessionId) throw new Error("Participant session is missing.");
  return callRpc("advance_career_english_participant", {
    p_session_id: sessionId,
    p_stage: payload.stage || null,
    p_first_recording_status: payload.first_recording_status || null,
    p_retry_status: payload.retry_status || null,
    p_result_status: payload.result_status || null,
    p_contact_status: payload.contact_status || null,
    p_first_transcript: payload.first_transcript || null,
    p_first_analysis: payload.first_analysis || null,
    p_retry_transcript: payload.retry_transcript || null,
    p_retry_analysis: payload.retry_analysis || null,
    p_primary_bottleneck: payload.primary_bottleneck || null,
    p_comparison: payload.comparison || null,
    p_last_failure: payload.last_failure || null,
    p_lead_id: payload.lead_id || null,
  });
}

function outputText(response: Record<string, unknown>) {
  if (typeof response.output_text === "string") return response.output_text;
  const output = Array.isArray(response.output) ? response.output : [];
  for (const item of output as Array<Record<string, unknown>>) {
    const content = Array.isArray(item.content) ? item.content : [];
    for (const part of content as Array<Record<string, unknown>>) {
      if (typeof part.text === "string") return part.text;
    }
  }
  return "";
}

async function transcribeAudio(audio: File, apiKey: string) {
  const form = new FormData();
  form.append("file", audio, audio.name || "answer.webm");
  form.append("model", "gpt-4o-mini-transcribe");
  form.append("language", "en");
  form.append(
    "prompt",
    "This is a Career English practice answer by an adult learner in Türkiye. Preserve exact meaning, natural disfluencies, and professional vocabulary.",
  );
  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body?.error?.message || "Transcription failed.");
  return compactText(body.text, 5000);
}

async function evaluateTranscript(input: {
  transcript: string;
  phase: string;
  prompt: Record<string, unknown>;
  context: Record<string, unknown>;
  retryFocus: string;
}, apiKey: string) {
  const system = `You are Star Speaker's strict but psychologically safe Career English evaluator for adult learners in Türkiye.

Evaluate only evidence visible in the transcript. Do not infer pronunciation, accent, audio confidence, silence length, or speaking speed from text. This is a short training sample, not a CEFR or scientific diagnosis.

Metrics:
- clarity: Is the main message understandable, appropriately specific, and free from avoidable ambiguity?
- structure: Does the answer have a direct point, logical development, evidence/example, and useful ending?
- pressure: From textual evidence only, can the speaker start and sustain a usable answer without destructive restarts, fragments, or abandoning ideas?
- interaction: Does the answer respond to the exact professional prompt, show audience awareness, and handle recommendation/risk/follow-up professionally?

Scoring calibration:
- 35–49: materially blocks professional impact
- 50–64: understandable but inconsistent or underdeveloped
- 65–79: professionally useful with a clear improvement area
- 80–90: strong for this short task
- Above 90 is exceptional; do not inflate scores.

Output rules:
- Turkish feedback, except improved_opening_tr must be one natural English opening the learner can adapt.
- Treat self-reported level only as the intended task difficulty. Do not certify, downgrade, or penalize the speaker against a higher CEFR level.
- Mention one genuine strength only.
- Give exactly one high-leverage correction, not a list.
- evidence_tr must refer to a visible behavior in this answer without quoting more than 12 words.
- Be specific, warm, concise, and adult. No praise filler. No grammar correction unless it blocks meaning.
- Emotional context may adjust warmth and phrasing only. Never score, reward, penalize, or infer ability from it.
- Duration calibrates how much development is reasonable; it must not inflate or reduce a score by itself.
- On retry, compare against the supplied first attempt and requested focus. Claim improvement only when the retry transcript contains direct evidence.
- For retry/challenge phases, check whether the requested focus became more visible, but do not reward it unless the transcript demonstrates it.`;

  const user = {
    phase: compactText(input.phase, 30),
    professional_context: input.context,
    speaking_prompt: input.prompt,
    requested_retry_focus: compactText(input.retryFocus, 400),
    first_attempt: input.context.first_attempt || null,
    speaking_duration_seconds: input.context.recording_duration_seconds,
    emotional_context_for_tone_only: input.context.emotional_state,
    transcript: input.transcript,
  };
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: Deno.env.get("OPENAI_EVALUATION_MODEL") || "gpt-5.6-luna",
      reasoning: { effort: "low" },
      instructions: system,
      input: JSON.stringify(user),
      max_output_tokens: 520,
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "career_english_speaking_evaluation",
          strict: true,
          schema: resultSchema,
        },
      },
    }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body?.error?.message || "Evaluation failed.");
  const text = outputText(body);
  if (!text) throw new Error("Evaluation returned no structured result.");
  return JSON.parse(text);
}

async function saveLead(payload: Record<string, unknown>) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) throw new Error("Lead storage is not configured.");
  const contact = (payload.contact || {}) as Record<string, unknown>;
  const budgetRange = compactText(payload.budget_range, 40);
  const urgency = compactText(payload.urgency, 40);
  const consentAccepted = payload.consent_accepted === true;
  if (!["under_5000","5000_10000","10000_15000","15000_25000","25000_plus","unsure"].includes(budgetRange)
    || !["immediately","within_1_month","within_1_3_months","researching"].includes(urgency)
    || !consentAccepted) throw new Error("Lead qualification is incomplete.");
  const row = {
    full_name: compactText(contact.fullName, 80),
    whatsapp: compactText(contact.whatsapp, 30),
    email: compactText(contact.email, 120) || null,
    stage: compactText(payload.stage, 30) || "diagnosed",
    professional_context: payload.context || {},
    qualification: compactText(payload.qualification, 30),
    primary_bottleneck: compactText(payload.bottleneck, 40) || null,
    baseline_metrics: payload.baseline_metrics || null,
    final_metrics: payload.final_metrics || null,
    transcripts: payload.transcripts || {},
    session_id: compactText(payload.session_id, 80) || null,
    budget_range: budgetRange,
    urgency,
    consent_accepted: true,
    consent_accepted_at: payload.consent_accepted_at || new Date().toISOString(),
    consent_version: compactText(payload.consent_version, 50) || "career_english_v3",
    funnel_version: experienceVersion,
    source_data: payload.source_data || {},
    participant_id: compactText(payload.participant_id, 80) || null,
    updated_at: new Date().toISOString(),
  };
  const leadId = compactText(payload.lead_id, 80);
  const endpoint = leadId
    ? `${supabaseUrl}/rest/v1/performance_sprint_leads?id=eq.${encodeURIComponent(leadId)}`
    : `${supabaseUrl}/rest/v1/performance_sprint_leads`;
  const response = await fetch(endpoint, {
    method: leadId ? "PATCH" : "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });
  const body = await response.json().catch(() => []);
  if (!response.ok) throw new Error(body?.message || "Lead could not be saved.");
  const savedLeadId = leadId || body?.[0]?.id;
  const sessionId = compactText(payload.session_id, 80);
  if (savedLeadId && sessionId) {
    await fetch(`${supabaseUrl}/rest/v1/performance_sprint_events?session_id=eq.${encodeURIComponent(sessionId)}&lead_id=is.null`, {
      method: "PATCH",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lead_id: savedLeadId }),
    });
    if (payload.participant_id) {
      await advanceParticipant({
        session_id: sessionId,
        lead_id: savedLeadId,
        contact_status: "contact_submitted",
      });
    }
  }
  return savedLeadId;
}

async function trackEvent(payload: Record<string, unknown>) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) throw new Error("Event storage is not configured.");
  const sessionId = compactText(payload.session_id, 80);
  const eventType = compactText(payload.event_type, 60);
  const stage = compactText(payload.stage, 60);
  if (!sessionId || !eventType || !stage) throw new Error("Event is incomplete.");
  if (compactText(payload.experience_version, 50) === experienceVersion) {
    await callRpc("track_career_english_event", {
      p_session_id: sessionId,
      p_event_type: eventType,
      p_stage: stage,
      p_event_key: compactText(payload.event_key, 100),
      p_metadata: payload.metadata || {},
      p_source_data: payload.source_data || {},
    });
    return;
  }
  const response = await fetch(`${supabaseUrl}/rest/v1/performance_sprint_events`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      session_id: sessionId,
      lead_id: compactText(payload.lead_id, 80) || null,
      event_type: eventType,
      stage,
      metadata: payload.metadata || {},
      source_data: payload.source_data || {},
    }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message || "Event could not be saved.");
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }
  if (request.method !== "POST") return json(request, { error: "Method not allowed." }, 405);

  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) return json(request, { error: "Origin not allowed." }, 403);

  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const payload = await request.json();
      if (payload?.action === "save_lead") {
        const leadId = await saveLead(payload);
        return json(request, { ok: true, lead_id: leadId });
      }
      if (payload?.action === "track_event") {
        await trackEvent(payload);
        return json(request, { ok: true });
      }
      if (payload?.action === "save_participant") {
        if (payload?.is_demo) return json(request, { ok: true, demo: true });
        const participant = await upsertParticipant(payload);
        return json(request, { ok: true, participant_id: participant?.id, stage: participant?.furthest_stage });
      }
      if (payload?.action === "advance_participant") {
        if (payload?.is_demo) return json(request, { ok: true, demo: true });
        const participant = await advanceParticipant(payload);
        return json(request, { ok: true, participant_id: participant?.id, stage: participant?.furthest_stage });
      }
      return json(request, { error: "Unknown action." }, 400);
    }

    const form = await request.formData();
    const audio = form.get("audio");
    if (!(audio instanceof File)) return json(request, { error: "Audio is required.", code: "audio_required" }, 400);
    if (!new Set(["audio/webm", "audio/mp4", "audio/mpeg", "audio/ogg"]).has(audio.type.split(";")[0])) {
      return json(request, { error: "Audio format is not supported.", code: "audio_type_invalid" }, 415);
    }
    if (audio.size > 16_000_000) return json(request, { error: "Audio file is too large.", code: "audio_too_large" }, 413);
    if (audio.size < 1_000) return json(request, { error: "Audio is too short.", code: "audio_too_short" }, 400);

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) return json(request, { error: "AI service is not configured." }, 503);

    const phase = compactText(form.get("phase"), 30);
    const prompt = safeJson(form.get("prompt"), {}) as Record<string, unknown>;
    const context = safeJson(form.get("context"), {}) as Record<string, unknown>;
    if (!validDurations.has(Number(context.recording_duration_seconds))) {
      return json(request, { error: "Recording duration is invalid.", code: "duration_invalid" }, 400);
    }
    const retryFocus = compactText(form.get("retry_focus"), 400);
    const sessionId = compactText(form.get("session_id"), 80);
    if (sessionId) {
      await advanceParticipant({
        session_id: sessionId,
        stage: phase === "retry" ? "retry_submitted" : "first_answer_submitted",
        first_recording_status: phase === "retry" ? null : "submitted",
        retry_status: phase === "retry" ? "submitted" : null,
      });
    }
    try {
      const transcript = await transcribeAudio(audio, apiKey);
      if (transcript.split(/\s+/).length < 3) {
        if (sessionId) await advanceParticipant({
          session_id: sessionId,
          first_recording_status: phase === "retry" ? null : "analysis_failed",
          retry_status: phase === "retry" ? "analysis_failed" : null,
        });
        return json(request, { error: "Konuşma net şekilde algılanamadı. Lütfen mikrofona biraz daha yakın konuş." }, 422);
      }
      const evaluation = await evaluateTranscript({ transcript, phase, prompt, context, retryFocus }, apiKey);
      const bottleneck = Object.entries(evaluation.metrics || {}).sort((a, b) => Number(a[1]) - Number(b[1]))[0]?.[0];
      if (sessionId) await advanceParticipant({
        session_id: sessionId,
        first_recording_status: phase === "retry" ? null : "analyzed",
        retry_status: phase === "retry" ? "analyzed" : null,
        first_transcript: phase === "retry" ? null : transcript,
        first_analysis: phase === "retry" ? null : evaluation,
        retry_transcript: phase === "retry" ? transcript : null,
        retry_analysis: phase === "retry" ? evaluation : null,
        primary_bottleneck: phase === "retry" ? null : bottleneck,
      });
      return json(request, { transcript, ...evaluation });
    } catch (cause) {
      if (sessionId) await advanceParticipant({
        session_id: sessionId,
        first_recording_status: phase === "retry" ? null : "analysis_failed",
        retry_status: phase === "retry" ? "analysis_failed" : null,
      }).catch(() => {});
      throw cause;
    }
  } catch (cause) {
    console.error("ai-speaking-coach", cause);
    return json(request, { error: "Analiz şu anda tamamlanamadı. Lütfen birkaç saniye sonra tekrar dene." }, 500);
  }
});
