import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const port = Number(process.env.PERFORMANCE_E2E_PORT || 4173);
const mockScript = String.raw`
  window.__performanceContactQa = { analysisCalls: 0, leadCalls: 0, bookingCalls: 0, lastLead: null };
  navigator.mediaDevices = { getUserMedia: async () => ({ getTracks: () => [{ stop() {} }] }) };
  window.MediaRecorder = class {
    static isTypeSupported(type) { return type.startsWith("audio/webm"); }
    constructor() { this.state = "inactive"; this.mimeType = "audio/webm"; this.listeners = new Map(); }
    addEventListener(type, listener) { this.listeners.set(type, listener); }
    start() { this.state = "recording"; }
    stop() {
      this.state = "inactive";
      const data = new Blob([new Uint8Array(2400)], { type: "audio/webm" });
      this.listeners.get("dataavailable")?.({ data });
      this.listeners.get("stop")?.();
    }
  };
  const nativeFetch = window.fetch.bind(window);
  const json = (body, status = 200) => Promise.resolve(new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "X-Correlation-ID": "local-contact-e2e" },
  }));
  window.fetch = async (input, init = {}) => {
    const url = String(input);
    if (url.includes("/functions/v1/ai-speaking-coach")) {
      if (init.body instanceof FormData) {
        window.__performanceContactQa.analysisCalls += 1;
        const phase = String(init.body.get("phase"));
        const retry = phase === "retry";
        return json({
          transcript: retry ? "I give my recommendation directly and support it with one clear example." : "I think this change is useful for our team.",
          metrics: retry
            ? { clarity: 78, structure: 76, pressure: 73, interaction: 75 }
            : { clarity: 62, structure: 55, pressure: 59, interaction: 61 },
          strength_tr: "Ana fikrin anlaşılır.",
          correction_tr: "Ana önerini ilk cümlede doğrudan söyle.",
          evidence_tr: "Ana mesaj cevabın ilerleyen bölümünde görünür oldu.",
          improved_opening_tr: "I recommend starting with one short weekly meeting.",
          next_action_tr: "Aynı doğrudan açılışı somut bir örnekle destekle.",
        });
      }
      const payload = JSON.parse(String(init.body || "{}"));
      if (payload.action === "select_question") return json({
        ok: true,
        question: {
          id: "meeting-b1-1-contact-e2e",
          purpose: "meeting",
          level: "b1_1",
          title: "What change would make your meetings more useful?",
          translationTr: "Toplantılarını daha faydalı yapacak değişiklik nedir?",
          context: "Give one recommendation and explain why it would help.",
          guide: "Recommendation → Reason → Example",
          demand: "Explain a practical recommendation.",
        },
        previously_seen: false,
        prior_serve_count: 0,
        history_status: "saved",
      });
      if (payload.action === "save_participant") return json({ ok: true, participant_id: "11111111-1111-4111-8111-111111111111", stage: "setup_completed" });
      if (payload.action === "save_lead") {
        window.__performanceContactQa.leadCalls += 1;
        window.__performanceContactQa.lastLead = payload;
        if (payload.contact?.whatsapp !== "+905551112233") return json({ error: "Lütfen geçerli bir WhatsApp numarası gir.", code: "contact_invalid", field: "whatsapp" }, 400);
        return json({ ok: true, lead_id: "22222222-2222-4222-8222-222222222222" });
      }
      return json({ ok: true, participant_id: payload.participant_id || "11111111-1111-4111-8111-111111111111" });
    }
    if (url.includes("/functions/v1/performance-sprint-booking")) {
      window.__performanceContactQa.bookingCalls += 1;
      const payload = JSON.parse(String(init.body || "{}"));
      if (payload.action === "slots") return json({ slots: [
        { booking_date: "2026-08-27", appointment_start: "2026-08-27T07:00:00.000Z" },
        { booking_date: "2026-08-27", appointment_start: "2026-08-27T07:15:00.000Z" },
      ] });
      return json({ ok: true });
    }
    return nativeFetch(input, init);
  };
`;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://127.0.0.1:${port}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/" || pathname === "/tr/performans-testi/") pathname = "/tr/performans-testi/index.html";
    const file = resolve(root, `.${pathname}`);
    if (!(file === root || file.startsWith(`${root}${sep}`))) throw new Error("Invalid path");
    let content = await readFile(file);
    if (pathname === "/tr/performans-testi/index.html") {
      content = Buffer.from(String(content).replace("</head>", `<script>${mockScript}</script></head>`));
    }
    response.writeHead(200, { "Content-Type": mimeTypes[extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    response.end(content);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => process.stdout.write(`Performance contact E2E server listening on http://127.0.0.1:${port}\n`));
