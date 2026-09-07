import { timedFetch } from "./speaking-core.js";
let memoryToken;
function sessionToken() {
  if (memoryToken) return memoryToken;
  try {
    memoryToken = sessionStorage.getItem("performanceEnglishSessionToken");
  } catch {}
  if (!/^[0-9a-f]{64}$/.test(memoryToken || "")) {
    memoryToken = Array.from(crypto.getRandomValues(new Uint8Array(32)), (x) =>
      x.toString(16).padStart(2, "0"),
    ).join("");
    try {
      sessionStorage.setItem("performanceEnglishSessionToken", memoryToken);
    } catch {}
  }
  return memoryToken;
}
const messages = {
  analysis_in_progress:
    "Your answer is still being processed. Please recover your result shortly.",
  analysis_attempt_limit:
    "The processing attempts for this answer have been used. Please start a new analysis.",
  public_ai_daily_limit:
    "Today’s free analysis capacity has been reached. Please try again tomorrow.",
  transcript_too_short:
    "We could not hear a clear answer. Please record again closer to your microphone.",
  participant_mismatch:
    "Your session could not be verified. Please reopen your analysis.",
  question_invalid: "The question could not be verified. Please try again.",
};
export async function localizedFetch(url, options = {}) {
  const next = { ...options };
  let event = false;
  if (next.body instanceof FormData) {
    next.body.set("locale", "en");
    next.body.set("session_token", sessionToken());
  } else if (typeof next.body === "string") {
    const data = JSON.parse(next.body);
    data.locale = "en";
    data.session_token = sessionToken();
    event = data.action === "track_event";
    next.body = JSON.stringify(data);
  }
  if (event) {
    void timedFetch(url, next, 2500).catch(() => {});
    return new Response('{"ok":true}', {
      headers: { "Content-Type": "application/json" },
    });
  }
  let response;
  try {
    response = await timedFetch(url, next, 125000);
  } catch (error) {
    throw Object.assign(
      new Error(
        error.name === "AbortError"
          ? "This is taking longer than expected. Try again to recover your result."
          : "The connection was interrupted. Please try again; your saved result is safe.",
      ),
      { code: error.name === "AbortError" ? "timeout" : "network_failure" },
    );
  }
  const body = await response
    .json()
    .catch(() => ({ error: "Invalid response." }));
  if (body.error) {
    body.error =
      messages[body.code] ||
      (body.field === "whatsapp"
        ? "Please enter a Turkish mobile number (+90 5…). For another country, use Ask on WhatsApp."
        : "We could not complete this step. Please try again; your result remains available.");
  }
  return new Response(JSON.stringify(body), {
    status: response.status,
    headers: response.headers,
  });
}
