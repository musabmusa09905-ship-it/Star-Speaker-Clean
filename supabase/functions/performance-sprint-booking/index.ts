const allowedOrigins = new Set([
  "https://starspeakerstudio.com",
  "https://www.starspeakerstudio.com",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);

function headers(request: Request) {
  const origin = request.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : "https://starspeakerstudio.com",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  };
}

function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: headers(request) });
}

function isUuid(value: unknown) {
  return typeof value === "string"
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isIsoTimestamp(value: unknown) {
  return typeof value === "string" && value.length <= 40 && Number.isFinite(Date.parse(value));
}

function managementToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function rpc(name: string, payload: Record<string, unknown>) {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) throw new Error("service_unavailable");
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof body?.message === "string" ? body.message : "request_failed";
    throw new Error(message);
  }
  return body;
}

function publicError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("slot_unavailable") || message.includes("slot_outside_window")) {
    return ["Bu saat artık uygun değil. Lütfen başka bir saat seç.", 409];
  }
  if (message.includes("existing_booking")) {
    return ["Bu test için zaten aktif bir randevu var.", 409];
  }
  if (message.includes("qualification_required")) {
    return ["Randevu için önce bütçe seçimini tamamla.", 403];
  }
  if (message.includes("invalid_lead") || message.includes("invalid_booking")) {
    return ["Randevu bilgileri doğrulanamadı. Test sonucunu yenileyip tekrar dene.", 403];
  }
  return ["Randevu servisine şu anda ulaşılamıyor. Lütfen biraz sonra tekrar dene.", 503];
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(request) });
  if (request.method !== "POST") return json(request, { error: "Method not allowed." }, 405);
  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) return json(request, { error: "Origin not allowed." }, 403);

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json(request, { error: "Geçersiz istek." }, 400);
  }

  try {
    if (payload.action === "slots") {
      const slots = await rpc("get_performance_sprint_available_slots", {});
      return json(request, { slots: Array.isArray(slots) ? slots : [] });
    }

    if (payload.action === "create") {
      if (!isUuid(payload.lead_id) || !isUuid(payload.session_id) || !isIsoTimestamp(payload.appointment_start)) {
        return json(request, { error: "Randevu bilgileri eksik." }, 400);
      }
      const token = managementToken();
      const rows = await rpc("create_performance_sprint_booking", {
        p_lead_id: payload.lead_id,
        p_session_id: payload.session_id,
        p_appointment_start: payload.appointment_start,
        p_management_token: token,
      });
      const booking = Array.isArray(rows) ? rows[0] : rows;
      return json(request, { booking, management_token: token }, 201);
    }

    if (payload.action === "reschedule") {
      if (!isUuid(payload.booking_id) || typeof payload.management_token !== "string"
        || payload.management_token.length !== 64 || !isIsoTimestamp(payload.appointment_start)) {
        return json(request, { error: "Randevu bilgileri doğrulanamadı." }, 400);
      }
      const rows = await rpc("reschedule_performance_sprint_booking", {
        p_booking_id: payload.booking_id,
        p_management_token: payload.management_token,
        p_appointment_start: payload.appointment_start,
      });
      return json(request, { booking: Array.isArray(rows) ? rows[0] : rows });
    }

    if (payload.action === "cancel") {
      if (!isUuid(payload.booking_id) || typeof payload.management_token !== "string"
        || payload.management_token.length !== 64) {
        return json(request, { error: "Randevu bilgileri doğrulanamadı." }, 400);
      }
      await rpc("cancel_performance_sprint_booking", {
        p_booking_id: payload.booking_id,
        p_management_token: payload.management_token,
      });
      return json(request, { ok: true });
    }

    return json(request, { error: "Bilinmeyen işlem." }, 400);
  } catch (error) {
    const [message, status] = publicError(error);
    console.error("performance_sprint_booking_failed", {
      action: typeof payload.action === "string" ? payload.action : "unknown",
      category: error instanceof Error ? error.message.split(":")[0].slice(0, 80) : "unknown",
    });
    return json(request, { error: message }, Number(status));
  }
});
