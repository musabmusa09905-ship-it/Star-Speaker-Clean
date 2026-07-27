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
    "This is an English answer by a Turkish engineer about an interview, meeting, presentation, project, technical decision, risk, or trade-off. Preserve engineering terms and disfluencies.",
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
  const system = `You are Star Speaker's strict but psychologically safe professional English speaking evaluator for engineers in Türkiye.

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
- Mention one genuine strength only.
- Give exactly one high-leverage correction, not a list.
- evidence_tr must refer to a visible behavior in this answer without quoting more than 12 words.
- Be specific, warm, concise, and adult. No praise filler. No grammar correction unless it blocks meaning.
- For retry/challenge phases, check whether the requested focus became more visible, but do not reward it unless the transcript demonstrates it.`;

  const user = {
    phase: compactText(input.phase, 30),
    professional_context: input.context,
    speaking_prompt: input.prompt,
    requested_retry_focus: compactText(input.retryFocus, 400),
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
          name: "engineering_speaking_evaluation",
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
  return leadId || body?.[0]?.id;
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
      if (payload?.action !== "save_lead") return json(request, { error: "Unknown action." }, 400);
      const leadId = await saveLead(payload);
      return json(request, { ok: true, lead_id: leadId });
    }

    const form = await request.formData();
    const audio = form.get("audio");
    if (!(audio instanceof File)) return json(request, { error: "Audio is required." }, 400);
    if (audio.size > 8_000_000) return json(request, { error: "Audio file is too large." }, 413);
    if (audio.size < 1_000) return json(request, { error: "Audio is too short." }, 400);

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) return json(request, { error: "AI service is not configured." }, 503);

    const phase = compactText(form.get("phase"), 30);
    const prompt = safeJson(form.get("prompt"), {}) as Record<string, unknown>;
    const context = safeJson(form.get("context"), {}) as Record<string, unknown>;
    const retryFocus = compactText(form.get("retry_focus"), 400);
    const transcript = await transcribeAudio(audio, apiKey);
    if (transcript.split(/\s+/).length < 3) {
      return json(request, { error: "Konuşma net şekilde algılanamadı. Lütfen mikrofona biraz daha yakın konuş." }, 422);
    }
    const evaluation = await evaluateTranscript({ transcript, phase, prompt, context, retryFocus }, apiKey);
    return json(request, { transcript, ...evaluation });
  } catch (cause) {
    console.error("ai-speaking-coach", cause);
    return json(request, { error: "Analiz şu anda tamamlanamadı. Lütfen birkaç saniye sonra tekrar dene." }, 500);
  }
});
