import { SpeakingRecorder, timedFetch } from "./speaking-core.js";
const VERSION = "speaking_analysis_en_v1";
const $ = (selector) => document.querySelector(selector);
const storageKey = VERSION;
let saved = null,
  blob = null,
  phase = "first",
  busy = false,
  screen = "setup",
  countdown = null;
const messages = {
  permission_denied:
    "Microphone permission was denied. Allow microphone access in your browser, then try again.",
  unsupported:
    "This browser cannot record audio. Please try a current Chrome, Edge, Firefox or Safari browser.",
  device_unavailable:
    "No available microphone was found. Connect one or close another app using it, then try again.",
  start_failure:
    "The recorder could not start. Check your microphone and try again.",
  recorder_error: "The recorder encountered an error. Please record again.",
  interrupted: "Your recording was interrupted. Please record again.",
  no_usable_speech:
    "We could not hear usable speech. Please record again and check your microphone.",
  insufficient_evidence:
    "There is not enough of an answer for useful feedback. Please record again with a reason or example.",
  off_task:
    "This answer did not respond to the question closely enough. Read the question and record a new answer.",
  unusable_transcript:
    "We could not make sense of the transcript. Please record again in a quiet place.",
  analysis_failed: "We could not prepare reliable feedback. Please try again.",
  network:
    "The connection was lost. Recover your result before trying to send again.",
  timeout:
    "Processing took too long. Recover your result before trying to send again.",
};
function persist() {
  try {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({ ...saved, unsent: !!blob || !!recorder.recorder }),
    );
  } catch {
    /* In-memory flow remains usable. */
  }
}
function show(next) {
  screen = next;
  document.querySelectorAll("[data-screen]").forEach((el) => {
    el.hidden = el.dataset.screen !== next;
  });
  $(`[data-screen="${next}"] h1`).focus();
  window.scrollTo({ top: 0, behavior: "instant" });
}
function fail(message, canResend = false) {
  $("#error-message").textContent = messages[message] || message;
  $("#resubmit").hidden = !canResend || !blob;
  $("#recover").hidden = !saved;
  $("#rerecord").hidden = !saved;
  show("error");
}
async function api(action, extra = {}, audio = null, timeout = 175000) {
  const config = window.STAR_SPEAKER_SUPABASE_CONFIG;
  const data = {
    experience_version: VERSION,
    locale: "en",
    session_id: saved?.session.id,
    token: saved?.token,
    action,
    ...extra,
  };
  let body,
    headers = {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
    };
  if (audio) {
    body = new FormData();
    body.set("metadata", JSON.stringify(data));
    body.set(
      "audio",
      audio,
      audio.type.includes("mp4")
        ? "answer.mp4"
        : audio.type.includes("ogg")
          ? "answer.ogg"
          : "answer.webm",
    );
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }
  let response;
  try {
    response = await timedFetch(
      `${config.url}/functions/v1/english-speaking-analysis`,
      { method: "POST", headers, body, keepalive: action === "event" },
      timeout,
    );
  } catch (error) {
    throw Object.assign(
      new Error(messages[error.name === "AbortError" ? "timeout" : "network"]),
      { code: error.name === "AbortError" ? "timeout" : "network" },
    );
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw Object.assign(
      new Error(
        "We could not read the response. Recover your result or try again.",
      ),
      { code: "invalid_response" },
    );
  }
  if (!response.ok)
    throw Object.assign(new Error(result.error || messages.analysis_failed), {
      code: result.code,
    });
  return result;
}
const queuedEvents = [];
function event(name, code) {
  if (!saved) {
    if (queuedEvents.length < 10) queuedEvents.push(name);
    return;
  }
  void api("event", { event: name, code }, null, 2500).catch(() => {});
}
const recorder = new SpeakingRecorder({
  onTick: (remaining) => {
    $("#timer").textContent = `${remaining} seconds`;
  },
  onStop: (audio, duration) => {
    blob = duration >= 3 && audio.size >= 1000 ? audio : null;
    $("#stop").hidden = true;
    $("#again").hidden = false;
    $("#submit").hidden = !blob;
    $("#cancel").hidden = true;
    $("#record-state").textContent = blob
      ? "Recording ready. Submit it or record again."
      : "That recording was too short. Please record again.";
    persist();
  },
  onError: (code) => {
    blob = null;
    persist();
    fail(code);
  },
});
function recordScreen() {
  clearInterval(countdown);
  countdown = null;
  $("#prepare").hidden = false;
  recorder.cancel();
  blob = null;
  phase = saved.session.first_result ? "retry" : "first";
  $("#question").textContent = saved.session.task.prompt;
  $("#attempt-label").textContent =
    phase === "retry" ? "YOUR ONE RETRY" : "YOUR FIRST ANSWER";
  $("#record-state").textContent = "Ready when you are.";
  $("#timer").textContent = "60 seconds";
  $("#record").hidden = false;
  $("#record").disabled = false;
  $("#stop").hidden = true;
  $("#again").hidden = true;
  $("#submit").hidden = true;
  $("#cancel").hidden = false;
  persist();
  show("record");
}
function textBlock(parent, heading, text, quote) {
  const title = document.createElement("h2");
  title.textContent = heading;
  parent.append(title);
  const p = document.createElement("p");
  p.textContent = text;
  parent.append(p);
  if (quote) {
    const q = document.createElement("blockquote");
    q.textContent = quote;
    parent.append(q);
  }
}
function feedback(parent, result) {
  parent.replaceChildren();
  textBlock(
    parent,
    "Strength",
    result.strength.text,
    result.strength.evidence_quote,
  );
  textBlock(
    parent,
    "Focus for this answer",
    result.priority.text,
    result.priority.evidence_quote,
  );
  textBlock(parent, "One correction", result.correction);
  textBlock(
    parent,
    "Better answer direction",
    `${result.better_answer_direction.opening} ${result.better_answer_direction.next_step}`,
  );
  textBlock(parent, "Your retry", result.retry_instruction);
}
function results() {
  const first = saved.session.first_result,
    retry = saved.session.retry_result;
  if (retry) {
    const comparison = retry.comparison;
    $("#outcome").textContent = {
      improved: "A useful change in your retry",
      mixed: "Some changes helped",
      no_clear_change: "No clear change yet",
      less_effective: "Your first answer was more effective",
      insufficient_evidence: "Not enough evidence to compare",
    }[comparison.outcome];
    const parent = $("#comparison");
    parent.replaceChildren();
    textBlock(parent, "What changed", comparison.what_improved);
    textBlock(parent, "What still needs work", comparison.still_to_work_on);
    textBlock(parent, "First answer", "", comparison.evidence.first_quote);
    textBlock(parent, "Retry", "", comparison.evidence.retry_quote);
    textBlock(
      parent,
      "What the evidence shows",
      comparison.evidence.explanation,
    );
    feedback($("#original-feedback"), first);
    show("comparison");
    event("comparison_outcome", comparison.outcome);
  } else if (first) {
    feedback($("#first-feedback"), first);
    show("feedback");
    event("feedback_viewed");
  } else recordScreen();
}
async function recover() {
  if (!saved || busy) return;
  busy = true;
  show("processing");
  try {
    const data = await api("get");
    saved.session = data.session;
    if (
      (phase === "first" && data.session.first_result) ||
      (phase === "retry" && data.session.retry_result)
    )
      blob = null;
    persist();
    if (!data.session.first_result && !data.session.retry_result)
      fail(
        "No completed result is available yet. If processing just started, wait a moment and recover again. Otherwise, record again.",
        !!blob,
      );
    else results();
  } catch (error) {
    fail(error.message, !!blob);
  } finally {
    busy = false;
  }
}
$("#setup").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (busy) return;
  busy = true;
  $("#setup button").disabled = true;
  try {
    const data = await api("create", {
      level: $("#level").value,
      category: $("#category").value,
      duration: 60,
    });
    saved = data;
    persist();
    event("analysis_start");
    queuedEvents.splice(0).forEach(event);
    recordScreen();
  } catch (error) {
    fail(error.message);
  } finally {
    busy = false;
    $("#setup button").disabled = false;
  }
});
$("#level").addEventListener("change", () => event("level_selected"));
$("#category").addEventListener("change", () => event("category_selected"));
async function startRecording() {
  clearInterval(countdown);
  countdown = null;
  $("#prepare").hidden = true;
  $("#record").disabled = true;
  $("#record-state").textContent = "Waiting for microphone access…";
  try {
    await recorder.start();
    if (!recorder.recorder) return;
    event("mic_permission_result", "granted");
    $("#record").hidden = true;
    $("#stop").hidden = false;
    $("#record-state").textContent = "Recording your answer.";
    $("#stop").focus();
    persist();
  } catch (error) {
    event("mic_permission_result", error.message);
    fail(error.message);
  }
}
$("#record").addEventListener("click", startRecording);
$("#prepare").addEventListener("click", () => {
  if (countdown) return;
  let remaining = 5;
  $("#prepare").hidden = true;
  $("#timer").textContent = "Starting in 5 seconds";
  countdown = setInterval(() => {
    remaining--;
    $("#timer").textContent = `Starting in ${remaining} seconds`;
    if (!remaining) void startRecording();
  }, 1000);
});
$("#stop").addEventListener("click", () => recorder.stop());
$("#again").addEventListener("click", recordScreen);
$("#rerecord").addEventListener("click", recordScreen);
$("#cancel").addEventListener("click", () => {
  recorder.cancel();
  recordScreen();
});
async function submit() {
  if (!blob || busy) return;
  busy = true;
  show("processing");
  event("recording_submitted");
  try {
    const task = saved.session.task;
    const { result } = await api(
      "analyze",
      {
        level: task.level,
        category: task.category,
        duration: 60,
        task_id: task.id,
        phase,
      },
      blob,
    );
    blob = null;
    if (result.status !== "valid") {
      event("analysis_invalid", result.status);
      persist();
      fail(result.status);
      return;
    }
    saved.session[phase === "first" ? "first_result" : "retry_result"] = result;
    persist();
    event("analysis_valid");
    if (phase === "retry") event("retry_completed");
    results();
  } catch (error) {
    event("analysis_failed", error.code);
    if (["audio_invalid", "invalid_response"].includes(error.code)) blob = null;
    fail(error.message, !!blob);
  } finally {
    busy = false;
  }
}
$("#submit").addEventListener("click", submit);
$("#resubmit").addEventListener("click", submit);
$("#recover").addEventListener("click", recover);
$("#retry").addEventListener("click", () => {
  event("retry_started");
  recordScreen();
});
$("#restart").addEventListener("click", () => {
  recorder.cancel();
  saved = null;
  blob = null;
  try {
    sessionStorage.removeItem(storageKey);
  } catch {}
  show("setup");
});
$("#whatsapp").addEventListener("click", () => event("whatsapp_clicked"));
window.addEventListener("pagehide", () => {
  clearInterval(countdown);
  if (saved && !saved.session.retry_result) event("abandonment");
  persist();
  recorder.cancel();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && recorder.recorder) {
    recorder.cancel();
    blob = null;
    persist();
    fail("interrupted");
  }
});
try {
  const previous = JSON.parse(sessionStorage.getItem(storageKey) || "null");
  if (previous?.session?.experience_version === VERSION && previous.token)
    saved = previous;
} catch {}
event("analysis_view");
if (saved) {
  if (saved.unsent)
    fail(
      "Your unsent recording was lost when this page reloaded. Please record again, or recover a result if you already submitted.",
    );
  else void recover();
}
