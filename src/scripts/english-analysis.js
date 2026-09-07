// Generated from the canonical Turkish controller. Edit the source/copy dictionary, then rebuild.
import { localizedFetch as fetch } from "./performance-english-transport.js";
import { releaseTracks, recordingMime } from './speaking-core.js';
import {
  EXPERIENCE_VERSION,
  QUESTION_BANK_VERSION,
  normalizeReportedLevel,
  recommendedDuration,
  resolveQuestion,
  resolveQuestionById,
  validateFirstName,
} from "./performance-english-config.js";
import { persistSetupAttempt } from "./performance-setup-recovery.js";
import { normalizePublicContact } from "./performance-english-contact.js";
import {
  createRecordingInteractionGuard,
  RECORDING_INTERACTION_STATES,
} from "./performance-recording-interaction.js";

const labels = {
  clarity: "Clarity",
  structure: "Structure",
  pressure: "Maintaining composure under pressure",
  interaction: "Professional impact",
};

const bottleneckTitles = {
  clarity: "Clarity",
  structure: "Answer structure",
  pressure: "Maintaining composure under pressure",
  interaction: "Professional impact",
};

const waitingInsights = [
  "A strong professional answer begins with a clear main idea before using complex words.",
  "In a short answer, supporting a single main message is more effective than providing numerous details.",
  "An example makes your main idea clearer and more memorable for the listener.",
];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUuid(value) {
  return UUID_PATTERN.test(String(value || ""));
}

function persistentSessionId() {
  try {
    const existing = sessionStorage.getItem("performanceEnglishSessionId");
    if (isValidUuid(existing)) return existing;
    const created = crypto.randomUUID();
    sessionStorage.setItem("performanceEnglishSessionId", created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

const QUESTION_HISTORY_KEY = "starSpeakerEnglishQuestionHistoryV2";
const ANONYMOUS_ID_KEY = "starSpeakerEnglishAnonymousParticipantId";

function persistentAnonymousId() {
  try {
    const existing = localStorage.getItem(ANONYMOUS_ID_KEY);
    if (isValidUuid(existing)) return existing;
    const created = crypto.randomUUID();
    localStorage.setItem(ANONYMOUS_ID_KEY, created);
    return created;
  } catch {
    return persistentSessionId();
  }
}

function readQuestionHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(QUESTION_HISTORY_KEY) || "[]");
    return Array.isArray(history) ? history.filter((item) => item?.id).slice(-96) : [];
  } catch {
    return [];
  }
}

function rememberQuestion(questionId) {
  try {
    const history = readQuestionHistory().filter((item) => item.id !== questionId);
    history.push({ id: questionId, servedAt: new Date().toISOString() });
    localStorage.setItem(QUESTION_HISTORY_KEY, JSON.stringify(history.slice(-96)));
  } catch {
    // Rotation still works through server history when local storage is unavailable.
  }
}

function getSourceData() {
  const params = new URLSearchParams(location.search);
  return {
    source: params.get("utm_source") || "",
    medium: params.get("utm_medium") || "",
    campaign: params.get("utm_campaign") || "",
    content: params.get("utm_content") || "",
    referrer: document.referrer || "",
    device: matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop",
  };
}

function readStoredFlow() {
  try {
    const stored = JSON.parse(sessionStorage.getItem("performanceEnglishFlow") || "null");
    if (!stored || stored.experienceVersion !== EXPERIENCE_VERSION) return {};
    const question = resolveQuestionById(stored.questionId);
    if (!question) return {};
    return { ...stored, question };
  } catch {
    return {};
  }
}

const storedFlow = readStoredFlow();

const state = {
  firstName: storedFlow.firstName || "",
  situation: storedFlow.situation || "",
  reportedLevel: storedFlow.reportedLevel || "",
  normalizedLevel: storedFlow.normalizedLevel || "",
  recordingDuration: storedFlow.recordingDuration || 60,
  emotionalState: storedFlow.emotionalState || "",
  emotionalSelectedAt: storedFlow.emotionalSelectedAt || "",
  question: storedFlow.question || null,
  questionPreviouslySeen: Boolean(storedFlow.questionPreviouslySeen),
  questionPriorServeCount: Number(storedFlow.questionPriorServeCount || 0),
  questionSelectionFallback: Boolean(storedFlow.questionSelectionFallback),
  questionHistoryStatus: storedFlow.questionHistoryStatus || "unknown",
  questionSelectionWarning: storedFlow.questionSelectionWarning || "",
  participantId: storedFlow.participantId || null,
  participantSaved: Boolean(storedFlow.participantSaved),
  setupSubmitting: false,
  setupHadFailure: false,
  stream: null,
  recorder: null,
  demoRecording: false,
  chunks: [],
  blob: null,
  timerId: null,
  remaining: 45,
  phase: "first",
  recordings: {},
  analyses: storedFlow.analyses || {},
  pending: {},
  submitting: false,
  retryFocus: storedFlow.retryFocus || "",
  contact: {},
  leadId: storedFlow.leadId || null,
  sessionId: persistentSessionId(),
  anonymousId: persistentAnonymousId(),
  sourceData: getSourceData(),
  trackedEvents: new Set(),
  currentScreen: "intro",
  isDemo: new URLSearchParams(location.search).get("demo") === "1",
  bookingSlots: [],
  selectedBookingStart: "",
  booking: null,
  bookingSubmitting: false,
  bookingMode: "create",
  budgetRange: storedFlow.budgetRange || "",
  urgency: storedFlow.urgency || "",
  bookingStep: storedFlow.bookingStep || "contact",
  recordingIntent: false,
  countdownId: null,
  countdownStartedAt: 0,
};

const recordingInteraction = createRecordingInteractionGuard();

function storeFlow() {
  try {
    sessionStorage.setItem("performanceEnglishFlow", JSON.stringify({
      experienceVersion: EXPERIENCE_VERSION,
      firstName: state.firstName,
      situation: state.situation,
      reportedLevel: state.reportedLevel,
      normalizedLevel: state.normalizedLevel,
      recordingDuration: state.recordingDuration,
      emotionalState: state.emotionalState,
      emotionalSelectedAt: state.emotionalSelectedAt,
      questionId: state.question?.id || "",
      questionPreviouslySeen: state.questionPreviouslySeen,
      questionPriorServeCount: state.questionPriorServeCount,
      questionSelectionFallback: state.questionSelectionFallback,
      questionHistoryStatus: state.questionHistoryStatus,
      questionSelectionWarning: state.questionSelectionWarning,
      participantId: state.participantId,
      participantSaved: state.participantSaved,
      analyses: state.analyses,
      retryFocus: state.retryFocus,
      leadId: state.leadId,
      budgetRange: state.budgetRange,
      urgency: state.urgency,
      bookingStep: state.bookingStep,
    }));
  } catch {
    // Session persistence is a recovery aid; the database remains authoritative.
  }
}

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const screens = Object.fromEntries($$("[data-screen]").map((screen) => [screen.dataset.screen, screen]));
const progressShell = $("[data-progress-shell]");
const progressMap = {
  setup: [1, "Quick start"],
  record: [state.phase === "retry" ? 4 : 2, state.phase === "retry" ? "Try again" : "Spoken answer"],
  analysis: [state.phase === "retry" ? 5 : 3, "Analysis"],
  correction: [3, "Personal feedback"],
  result: [5, "Result"],
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === name);
  });
  state.currentScreen = name;
  const heading = screens[name]?.querySelector('h1, h2');
  if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus(); }
  progressShell.hidden = name === "intro";
  if (name === "record" || name === "analysis") {
    progressMap[name] = [
      state.phase === "retry" ? (name === "record" ? 4 : 5) : (name === "record" ? 2 : 3),
      state.phase === "retry" ? (name === "record" ? "Try again" : "Result") : (name === "record" ? "Spoken answer" : "Analysis"),
    ];
  }
  if (progressMap[name]) {
    const [step, label] = progressMap[name];
    $("[data-progress-label]").textContent = label;
    $("[data-progress-count]").textContent = `${step} / 5`;
    $("[data-progress]").setAttribute("aria-valuenow", String(step));
    $("[data-progress-fill]").style.width = `${(step / 5) * 100}%`;
  }
  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

async function trackEvent(eventType, stage, metadata = {}, onceKey = "") {
  if (state.isDemo) return;
  const dedupeKey = onceKey || `${eventType}:${stage}`;
  if (state.trackedEvents.has(dedupeKey)) return;
  state.trackedEvents.add(dedupeKey);
  const config = window.STAR_SPEAKER_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey) return;
  try {
    const response = await fetch(`${config.url}/functions/v1/ai-speaking-coach`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
      body: JSON.stringify({
        action: "track_event",
        session_id: state.sessionId,
        participant_id: state.participantId,
        lead_id: state.leadId,
        event_type: eventType,
        event_key: dedupeKey,
        experience_version: EXPERIENCE_VERSION,
        is_demo: false,
        stage,
        metadata,
        source_data: state.sourceData,
      }),
      keepalive: true,
    });
    if (!response.ok) state.trackedEvents.delete(dedupeKey);
  } catch {
    state.trackedEvents.delete(dedupeKey);
  }
}

async function participantApi(payload) {
  if (state.isDemo) return { ok: true, demo: true, participant_id: null };
  const config = window.STAR_SPEAKER_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey) throw new Error("Participant registration is not configured.");
  const response = await fetch(`${config.url}/functions/v1/ai-speaking-coach`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
    },
    body: JSON.stringify({
      ...payload,
      session_id: state.sessionId,
      participant_id: state.participantId,
      experience_version: EXPERIENCE_VERSION,
      is_demo: state.isDemo,
    }),
    keepalive: Boolean(payload.keepalive),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const failure = new Error(body.error || "Participant registration could not be completed.");
    failure.code = body.code || `http_${response.status}`;
    failure.correlationId = response.headers.get("x-correlation-id") || body.correlation_id || "";
    throw failure;
  }
  if (body.participant_id) state.participantId = body.participant_id;
  return body;
}

async function selectQuestion() {
  if (state.isDemo) return resolveQuestion(state.situation, state.reportedLevel);
  const config = window.STAR_SPEAKER_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey) throw Object.assign(new Error("Question service is not configured."), { code: "question_service_unconfigured" });
  const browserHistory = readQuestionHistory();
  const response = await fetch(`${config.url}/functions/v1/ai-speaking-coach`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: config.anonKey, Authorization: `Bearer ${config.anonKey}` },
    body: JSON.stringify({
      action: "select_question",
      session_id: state.sessionId,
      anonymous_id: state.anonymousId,
      situation: state.situation,
      reported_level: state.reportedLevel,
      question_bank_version: QUESTION_BANK_VERSION,
      recent_question_ids: browserHistory.slice(-32).map((item) => item.id),
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.question) {
    const failure = new Error(body.error || "A question could not be selected.");
    failure.code = body.code || `http_${response.status}`;
    throw failure;
  }
  state.questionPreviouslySeen = Boolean(body.previously_seen);
  state.questionPriorServeCount = Number(body.prior_serve_count || 0);
  state.questionSelectionFallback = Boolean(body.fallback);
  state.questionHistoryStatus = body.history_status || "unknown";
  state.questionSelectionWarning = body.warning_code || "";
  rememberQuestion(body.question.id);
  return body.question;
}

function rotateAttemptSession() {
  const created = crypto.randomUUID();
  try { sessionStorage.setItem("performanceEnglishSessionId", created); } catch { /* in-memory fallback */ }
  state.sessionId = created;
  state.participantId = null;
  state.participantSaved = false;
  state.question = null;
  state.questionPreviouslySeen = false;
  state.questionPriorServeCount = 0;
  state.questionSelectionFallback = false;
  state.questionHistoryStatus = "unknown";
  state.questionSelectionWarning = "";
}

async function saveParticipant() {
  const body = await participantApi({
    action: "save_participant",
    first_name: state.firstName,
    situation: state.situation,
    reported_level: state.reportedLevel,
    normalized_level: state.normalizedLevel,
    question_id: state.question.id,
    question: state.question,
    question_bank_version: QUESTION_BANK_VERSION,
    question_previously_seen: state.questionPreviouslySeen,
    question_prior_serve_count: state.questionPriorServeCount,
    anonymous_id: state.anonymousId,
    recording_duration_seconds: state.recordingDuration,
    emotional_state: state.emotionalState,
    emotional_selected_at: state.emotionalSelectedAt,
    source_data: state.sourceData,
  });
  state.participantSaved = true;
  if (body.participant_id) state.participantId = body.participant_id;
  storeFlow();
}

async function selectAndSaveParticipant() {
  const result = await persistSetupAttempt({
    ensureQuestion: async () => {
      state.question = state.question || await selectQuestion();
      return state.question;
    },
    saveParticipant,
    resetLockedAttempt: rotateAttemptSession,
  });
  if (result.recovered) {
    await trackEvent("setup_recovered", "setup", {
      recovery_reason: "participant_attempt_locked",
      question_id: state.question.id,
      question_bank_version: QUESTION_BANK_VERSION,
    }, `setup_recovered:locked_attempt:${state.sessionId}`);
  }
}

async function advanceParticipant(changes) {
  if (!state.participantSaved) throw new Error("Participant registration not found.");
  const body = await participantApi({ action: "advance_participant", ...changes });
  if (body.participant_id) state.participantId = body.participant_id;
  storeFlow();
  return body;
}

function promptForSituation() {
  return state.question || resolveQuestion(state.situation, state.reportedLevel);
}

function renderSetupSelection() {
  $$('[data-situation]').forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.situation === state.situation));
  });
  $$('[data-level]').forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.level === state.reportedLevel));
  });
  $$('[data-duration]').forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.duration) === state.recordingDuration)));
  $$('[data-feeling]').forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.feeling === state.emotionalState)));
  const setupSteps = {
    situation: Boolean(state.situation),
    level: Boolean(state.reportedLevel),
    duration: Boolean(state.recordingDuration),
    feeling: Boolean(state.emotionalState),
  };
  const stepKeys = Object.keys(setupSteps);
  const completedSteps = Object.values(setupSteps).filter(Boolean).length;
  $$('[data-setup-step]').forEach((step) => {
    const stepIndex = stepKeys.indexOf(step.dataset.setupStep);
    const complete = setupSteps[step.dataset.setupStep];
    step.classList.toggle("is-complete", complete);
    if (!complete && !stepKeys.slice(0, stepIndex).some((key) => !setupSteps[key])) step.setAttribute("aria-current", "step");
    else step.removeAttribute("aria-current");
  });
  $("[data-setup-progress]")?.setAttribute("aria-label", `Preparation ${completedSteps}/4`);
  const form = $("[data-setup-form]");
  const submit = $(".sprint-setup-submit", form);
  const ready = validateFirstName(form.elements.firstName.value).valid && completedSteps === 4;
  submit.dataset.ready = String(ready);
  submit.disabled = !ready || state.setupSubmitting;
}

async function handleSetupSubmit(event) {
  event.preventDefault();
  if (state.setupSubmitting) return;
  if (state.setupHadFailure) trackEvent("setup_retry_clicked", "setup", {}, `setup_retry_clicked:${Date.now()}`);
  const error = $("[data-setup-error]");
  const submit = $(".sprint-setup-submit", event.currentTarget);
  error.hidden = true;
  const nameResult = validateFirstName(event.currentTarget.elements.firstName.value);
  if (!nameResult.valid) {
    error.textContent = nameResult.message;
    error.hidden = false;
    event.currentTarget.elements.firstName.focus();
    return;
  }
  if (!state.situation) {
    error.textContent = "Please select the situation you would like to talk about.";
    error.hidden = false;
    return;
  }
  if (!state.reportedLevel) {
    error.textContent = "Please select the speaking level closest to you.";
    error.hidden = false;
    return;
  }
  if (!state.emotionalState) {
    error.textContent = "Please select how you feel today.";
    error.hidden = false;
    return;
  }
  state.firstName = nameResult.value;
  state.normalizedLevel = normalizeReportedLevel(state.reportedLevel);
  state.setupSubmitting = true;
  submit.disabled = true;
  submit.textContent = "Preparing the question…";
  try {
    await selectAndSaveParticipant();
    if (state.situation === "other") await trackEvent("other_purpose_selected", "setup", { reported_level: state.reportedLevel }, "other_purpose_selected");
    await trackEvent("question_selected", "setup", {
      situation: state.situation,
      reported_level: state.reportedLevel,
      normalized_level: state.normalizedLevel,
      question_id: state.question.id,
      question_topic: state.question.topic,
      question_bank_version: QUESTION_BANK_VERSION,
      previously_seen: state.questionPreviouslySeen,
      prior_serve_count: state.questionPriorServeCount,
      fallback: state.questionSelectionFallback,
      question_history_status: state.questionHistoryStatus,
      selection_warning: state.questionSelectionWarning,
    }, "question_selected");
    await trackEvent("setup_completed", "setup", {
      situation: state.situation,
      reported_level: state.reportedLevel,
      normalized_level: state.normalizedLevel,
      question_id: state.question.id,
      question_topic: state.question.topic,
      question_bank_version: QUESTION_BANK_VERSION,
      previously_seen: state.questionPreviouslySeen,
      prior_serve_count: state.questionPriorServeCount,
    }, "setup_completed");
    state.phase = "first";
    preparePrompt();
    showScreen("record");
    await trackEvent("question_screen_viewed", "record", { question_id: state.question.id, question_bank_version: QUESTION_BANK_VERSION }, "question_screen_viewed");
    if (state.setupHadFailure) await trackEvent("setup_recovered", "setup", { question_id: state.question.id }, "setup_recovered");
    state.setupHadFailure = false;
  } catch (cause) {
    const failureCode = cause?.code || "setup_unknown";
    const correlationId = cause?.correlationId || "";
    error.innerHTML = `We couldn't continue right now. Please try again. <button type="submit" class="sprint-inline-retry" data-setup-retry>Try Again</button>`;
    error.dataset.failureCode = failureCode;
    if (correlationId) error.dataset.correlationId = correlationId;
    error.hidden = false;
    state.setupHadFailure = true;
    trackEvent("setup_failed", "setup", { failure_code: failureCode, correlation_id: correlationId }, `setup_failed:${Date.now()}`);
  } finally {
    state.setupSubmitting = false;
    submit.innerHTML = "View the question <span aria-hidden=\"true\">→</span>";
    renderSetupSelection();
  }
}

function setRecordStatus(message) {
  const status = $("[data-record-status]");
  if (status) status.textContent = message;
}

function preparePrompt() {
  const prompt = promptForSituation();
  const isRetry = state.phase === "retry";
  $("[data-record-kicker]").textContent = `${isRetry ? "TRY AGAIN" : "FIRST ANSWER"} · ${state.recordingDuration} SECONDS`;
  $("[data-prompt-title]").textContent = prompt.title;
  $("[data-prompt-context]").textContent = prompt.context;
  $("[data-prompt-translation]").textContent = prompt.translationTr || "";
  $("[data-prompt-guide]").textContent = prompt.guide;
  $("[data-correction-reminder]").hidden = !isRetry;
  $("[data-record-advice-label]").textContent = isRetry ? "YOUR FOCUS THIS TIME" : "TIP";
  $("[data-record-advice]").textContent = isRetry
    ? state.retryFocus
    : "Be clear, natural, and be yourself. Fluency is more valuable than sentence length.";
  if (isRetry) {
    $("[data-retry-focus]").textContent = state.retryFocus;
    $("[data-retry-opening]").textContent = state.analyses.first?.improved_opening_tr || "";
  }
  resetRecorder();
}

async function ensureMicrophone() {
  const error = $("[data-record-error]");
  error.hidden = true;
  try {
    if (state.isDemo) {
      return true;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      throw new Error("This browser does not support audio recording. Try again with the latest version of Chrome, Edge, or Safari.");
    }
    state.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.stream.getTracks().forEach((track) => { track.enabled = true; });
    trackEvent("microphone_granted", "microphone", {}, "microphone_granted");
    return true;
  } catch (cause) {
    trackEvent("microphone_denied", "microphone", { reason: cause?.name || "unknown" }, "microphone_denied");
    error.textContent = cause?.message?.includes("browser")
      ? cause.message
      : "Microphone permission could not be obtained. Enable the microphone using the lock icon in your browser, then try again.";
    error.hidden = false;
    setRecordStatus("Microphone permission needed");
    return false;
  }
}

function cancelCountdown() {
  if (!recordingInteraction.cancelCountdown()) return false;
  releaseTracks(state.stream); state.stream = null;
  clearInterval(state.countdownId);
  state.countdownId = null;
  state.recordingIntent = false;
  state.countdownStartedAt = 0;
  $("[data-countdown]").hidden = true;
  $("[data-record-button]").disabled = false;
  $("[data-record-hint]").textContent = `Start when you're ready. Maximum ${state.recordingDuration} seconds.`;
  setRecordStatus("Ready");
  trackEvent("recording_countdown_cancelled", state.phase, {}, `countdown_cancelled:${state.phase}:${Date.now()}`);
  return true;
}

function completeCountdown(reason) {
  if (!state.recordingIntent || !recordingInteraction.beginStarting(() => {
    if (recordingInteraction.phase() === RECORDING_INTERACTION_STATES.recording) {
      $("[data-record-button]").disabled = false;
    }
  })) return false;
  const configuredDuration = 5;
  const elapsedDuration = reason === "timer"
    ? configuredDuration
    : Math.max(0, Math.min(configuredDuration, Math.floor((Date.now() - state.countdownStartedAt) / 1000)));
  clearInterval(state.countdownId);
  state.countdownId = null;
  state.recordingIntent = false;
  state.countdownStartedAt = 0;
  $("[data-countdown]").hidden = true;
  // The countdown covers this control. Keep Stop inert until the initiating interaction ends.
  $("[data-record-button]").disabled = true;
  if (reason === "skipped") {
    trackEvent("recording_preparation_skipped", state.phase, {
      surface: "performance_sprint",
      configured_duration: configuredDuration,
      elapsed_duration: elapsedDuration,
      attempt_type: state.phase,
      preparation_policy: "optional",
    }, `recording_preparation_skipped:${state.phase}:${Date.now()}`);
  }
  startRecording();
  return true;
}

function beginCountdown() {
  if (!recordingInteraction.beginCountdown()) return false;
  let seconds = 5;
  state.recordingIntent = true;
  state.countdownStartedAt = Date.now();
  $("[data-countdown]").hidden = false;
  $("[data-countdown-number]").textContent = String(seconds);
  $("[data-record-button]").disabled = true;
  setRecordStatus("Will start within 5 seconds");
  trackEvent("recording_countdown_started", state.phase, { seconds }, `countdown_started:${state.phase}`);
  state.countdownId = setInterval(() => {
    seconds -= 1;
    $("[data-countdown-number]").textContent = String(Math.max(0, seconds));
    if (seconds <= 0) {
      completeCountdown("timer");
    }
  }, 1000);
  return true;
}

function resetRecorder() {
  const previousRecorder = state.recorder;
  state.recorder = null;
  if (previousRecorder?.state === 'recording') previousRecorder.stop();
  releaseTracks(state.stream); state.stream = null;
  recordingInteraction.reset();
  clearInterval(state.countdownId);
  state.countdownId = null;
  state.recordingIntent = false;
  state.countdownStartedAt = 0;
  state.blob = null;
  state.chunks = [];
  state.remaining = state.recordingDuration;
  clearInterval(state.timerId);
  $("[data-timer]").textContent = `${String(Math.floor(state.recordingDuration / 60)).padStart(2, "0")}:${String(state.recordingDuration % 60).padStart(2, "0")}`;
  $("[data-recorder]").classList.remove("is-recording");
  $("[data-record-label]").textContent = "Start Recording";
  $("[data-record-hint]").textContent = `Start when you're ready. Maximum ${state.recordingDuration} seconds.`;
  setRecordStatus("Ready");
  $("[data-record-actions]").hidden = true;
  $("[data-record-error]").hidden = true;
  $("[data-record-button]").disabled = false;
  $("[data-use-recording]").disabled = false;
}

function selectMimeType() {
  return recordingMime();
}

function startRecording() {
  if (state.isDemo) {
    if (state.demoRecording) return;
    state.demoRecording = true;
    state.remaining = state.recordingDuration;
    $("[data-recorder]").classList.add("is-recording");
    $("[data-record-label]").textContent = "Stop Recording";
    $("[data-record-hint]").textContent = "Your local demo response is being recorded.";
    setRecordStatus("Recording in progress");
    trackEvent(
      state.phase === "retry" ? "retry_recording_started" : "first_recording_started",
      state.phase,
      {},
      `recording_started:${state.phase}`,
    );
    advanceParticipant(state.phase === "retry"
      ? { retry_status: "recording" }
      : { first_recording_status: "recording" }).catch(() => {});
    state.timerId = setInterval(() => {
      state.remaining -= 1;
      $("[data-timer]").textContent = `${String(Math.floor(Math.max(0, state.remaining) / 60)).padStart(2, "0")}:${String(Math.max(0, state.remaining) % 60).padStart(2, "0")}`;
      if (state.remaining <= 0) stopRecording();
    }, 1000);
    return;
  }
  if (!state.stream || state.recorder?.state === "recording") return;
  state.chunks = [];
  const mimeType = selectMimeType();
  try { state.recorder = new MediaRecorder(state.stream, mimeType ? { mimeType } : undefined); }
  catch { releaseTracks(state.stream); state.stream = null; recordingInteraction.reset(); setRecordStatus("Recording could not be started. Please try again."); $('[data-record-button]').disabled = false; return; }
  const activeRecorder = state.recorder;
  const activeStream = state.stream;
  state.recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size) state.chunks.push(event.data);
  });
  state.recorder.addEventListener("stop", () => {
    releaseTracks(activeStream);
    if (state.recorder !== activeRecorder) return;
    state.blob = new Blob(state.chunks, { type: activeRecorder.mimeType || "audio/webm" });
    releaseTracks(state.stream); state.stream = null; state.recorder = null;
    $("[data-recorder]").classList.remove("is-recording");
    $("[data-record-label]").textContent = "Recording Complete";
    $("[data-record-hint]").textContent = `${state.recordingDuration - state.remaining}-second response ready.`;
    $("[data-record-actions]").hidden = false;
    setRecordStatus("Recording complete");
    recordingInteraction.markRecorded();
  }, { once: true });
  const recordingFailed = () => {
    releaseTracks(activeStream);
    if (state.recorder !== activeRecorder) return;
    releaseTracks(state.stream); state.stream = null; state.recorder = null;
    clearInterval(state.timerId); recordingInteraction.reset();
    setRecordStatus("Recording was interrupted. Please record again.");
    $('[data-record-button]').disabled = false;
  };
  state.recorder.addEventListener('error', recordingFailed, { once: true });
  try { state.recorder.start(250); } catch { recordingFailed(); return; }
  advanceParticipant(state.phase === "retry"
    ? { retry_status: "recording" }
    : { first_recording_status: "recording" }).catch(() => {});
  trackEvent(
    state.phase === "retry" ? "retry_recording_started" : "first_recording_started",
    state.phase,
    {},
    `recording_started:${state.phase}`,
  );
  $("[data-recorder]").classList.add("is-recording");
  $("[data-record-label]").textContent = "Stop Recording";
  $("[data-record-hint]").textContent = "Speak naturally. Don't try to be perfect.";
  setRecordStatus("Recording in progress");
  state.timerId = setInterval(() => {
    state.remaining -= 1;
    $("[data-timer]").textContent = `${String(Math.floor(Math.max(0, state.remaining) / 60)).padStart(2, "0")}:${String(Math.max(0, state.remaining) % 60).padStart(2, "0")}`;
    if (state.remaining <= 0) stopRecording();
  }, 1000);
}

function stopRecording() {
  if (!recordingInteraction.beginStopping()) return false;
  clearInterval(state.timerId);
  if (state.isDemo && state.demoRecording) {
    state.demoRecording = false;
    state.blob = new Blob([new Uint8Array(2000)], { type: "audio/webm" });
    $("[data-recorder]").classList.remove("is-recording");
    $("[data-record-label]").textContent = "Demo Recording Complete";
    $("[data-record-hint]").textContent = `${state.recordingDuration - state.remaining}-second demo response ready.`;
    $("[data-record-actions]").hidden = false;
    setRecordStatus("Recording complete");
    recordingInteraction.markRecorded();
    return true;
  }
  if (state.recorder?.state === "recording") state.recorder.stop();
  return true;
}

async function handleRecordButton() {
  if (state.recordingIntent) return;
  if (recordingInteraction.phase() === RECORDING_INTERACTION_STATES.starting) return;
  if (state.isDemo && state.demoRecording) {
    stopRecording();
    return;
  }
  if (state.recorder?.state === "recording") {
    stopRecording();
    return;
  }
  if (!state.stream && !(await ensureMicrophone())) return;
  beginCountdown();
}

async function useRecording() {
  const error = $("[data-record-error]");
  if (state.submitting) return;
  if (!state.blob || state.blob.size < 1500 || state.recordingDuration - state.remaining < 4) {
    error.textContent = "You need to speak for at least a few seconds for analysis. Please record again.";
    error.hidden = false;
    return;
  }
  state.submitting = true;
  $("[data-use-recording]").disabled = true;
  setRecordStatus("Submitting");
  const phase = state.phase;
  const blob = state.blob;
  state.recordings[phase] = blob;
  const duration = state.recordingDuration - state.remaining;
  try {
    await advanceParticipant(phase === "retry"
      ? { stage: "retry_submitted", retry_status: "submitted" }
      : { stage: "first_answer_submitted", first_recording_status: "submitted" });
  } catch (cause) {
    error.textContent = `${cause.message} Your recording remains on this screen; you don't need to record again.`;
    error.hidden = false;
    state.submitting = false;
    $("[data-use-recording]").disabled = false;
    setRecordStatus("Submission error");
    return;
  }
  await trackEvent("recording_submitted", phase, { duration_seconds: duration }, `recording_submitted:${phase}`);
  await trackEvent(
    phase === "retry" ? "retry_submitted" : "first_answer_submitted",
    phase,
    { duration_seconds: duration },
    `answer_submitted:${phase}`,
  );
  await trackEvent(
    phase === "retry" ? "retry_completed" : "first_recording_completed",
    phase,
    { duration_seconds: duration, question_id: state.question.id, question_bank_version: QUESTION_BANK_VERSION },
    `recording_completed:${phase}`,
  );
  state.pending[phase] = analyzeRecording(blob, phase, promptForSituation());
  setRecordStatus("Analysing");
  await waitForAnalysis(phase);
  state.submitting = false;
}

async function analyzeRecording(blob, phase, prompt) {
  if (state.isDemo) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return demoAnalysis(phase);
  }
  const config = window.STAR_SPEAKER_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey) throw new Error("The analysis service is not configured.");
  const form = new FormData();
  form.append("audio", blob, `answer-${phase}.${blob.type.includes("mp4") ? "m4a" : "webm"}`);
  form.append("phase", phase);
  form.append("session_id", state.sessionId);
  form.append("question_id", state.question.id);
  form.append("question_bank_version", QUESTION_BANK_VERSION);
  form.append("prompt", JSON.stringify(prompt));
  form.append("context", JSON.stringify({
    situation: state.situation,
    reported_level: state.reportedLevel,
    normalized_level: state.normalizedLevel,
    level_is_self_reported: true,
    question_id: state.question.id,
    recording_duration_seconds: state.recordingDuration,
    emotional_state: state.emotionalState,
    first_attempt: phase === "retry" ? {
      transcript: state.analyses.first?.transcript || "",
      metrics: state.analyses.first?.metrics || null,
      requested_focus: state.retryFocus,
    } : null,
  }));
  if (state.retryFocus) form.append("retry_focus", state.retryFocus);
  const response = await fetch(`${config.url}/functions/v1/ai-speaking-coach`, {
    method: "POST",
    headers: { apikey: config.anonKey, Authorization: `Bearer ${config.anonKey}` },
    body: form,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "The AI analysis could not be completed right now.");
  return body;
}

async function waitForAnalysis(phase) {
  showScreen("analysis");
  const status = $("[data-analysis-status]");
  const error = $("[data-analysis-error]");
  const retry = $("[data-analysis-retry]");
  status.textContent = "Your speech sample is being converted to text…";
  error.hidden = true;
  retry.hidden = true;
  rotateInsights();
  animateAnalysisSteps();
  try {
    state.analyses[phase] = await state.pending[phase];
    storeFlow();
    stopAnalysisAnimations();
    if (phase === "first") {
      renderCorrection();
      await advanceParticipant({ stage: "correction_viewed", first_recording_status: "analyzed" });
      showScreen("correction");
      await trackEvent("personal_correction_viewed", "correction", {}, "personal_correction_viewed");
      await trackEvent("diagnosis_received", "correction", {}, "diagnosis_received");
    } else {
      renderResult();
      await advanceParticipant({
        stage: "result_viewed", retry_status: "analyzed", result_status: "viewed",
        comparison: {
          first_metrics: state.analyses.first?.metrics || null,
          retry_metrics: state.analyses.retry?.metrics || null,
          requested_focus: state.retryFocus,
          duration_seconds: state.recordingDuration,
        },
      });
      showScreen("result");
      await trackEvent("result_viewed", "result", {}, "result_viewed");
    }
  } catch (cause) {
    advanceParticipant({
      ...(phase === "retry" ? { retry_status: "analysis_failed" } : { first_recording_status: "analysis_failed" }),
      last_failure: { code: "analysis_failed", phase, message: String(cause?.message || "analysis_failed").slice(0, 180), at: new Date().toISOString() },
    }).catch(() => {});
    trackEvent('analysis_failed', phase, { code: 'analysis_failed' }, `analysis_failed:${phase}:${Date.now()}`);
    stopAnalysisAnimations();
    status.textContent = "The analysis could not be completed.";
    error.textContent = `${cause.message} Your recording is saved on this screen; you do not need to record again.`;
    error.hidden = false;
    retry.hidden = false;
    retry.onclick = () => {
      retry.hidden = true;
      state.pending[phase] = analyzeRecording(state.recordings[phase], phase, promptForSituation());
      waitForAnalysis(phase);
    };
  }
}

let insightTimer;
let stepTimers = [];
function rotateInsights() {
  let index = 0;
  $("[data-waiting-insight]").textContent = waitingInsights[index];
  clearInterval(insightTimer);
  insightTimer = setInterval(() => {
    index = (index + 1) % waitingInsights.length;
    $("[data-waiting-insight]").textContent = waitingInsights[index];
  }, 2300);
}

function animateAnalysisSteps() {
  const steps = $$("[data-analysis-step]");
  steps.forEach((step, index) => { step.className = index === 0 ? "is-active" : ""; });
  stepTimers.forEach(clearTimeout);
  stepTimers = steps.slice(1).map((step, index) => setTimeout(() => {
    steps[index].className = "is-complete";
    step.className = "is-active";
    $("[data-analysis-status]").textContent = [
      "Your answer structure is being mapped…",
      "Clarity and professional impact are being compared…",
      "The most valuable correction is being selected…",
    ][index];
  }, 800 + index * 1100));
}

function stopAnalysisAnimations() {
  clearInterval(insightTimer);
  stepTimers.forEach(clearTimeout);
}

function scoreFrom(metrics) {
  return Math.round(Object.values(metrics || {}).reduce((total, value) => total + Number(value || 0), 0) / 4);
}

function getPrimaryBottleneck() {
  return Object.entries(state.analyses.first?.metrics || {})
    .sort((a, b) => Number(a[1]) - Number(b[1]))[0]?.[0] || "structure";
}

function renderCorrection() {
  const analysis = state.analyses.first;
  const bottleneck = getPrimaryBottleneck();
  const score = scoreFrom(analysis.metrics);
  state.retryFocus = analysis.correction_tr;
  $("[data-overall-score]").textContent = score;
  $("[data-score-ring]").style.background =
    `radial-gradient(circle closest-side, #0d0c0a 82%, transparent 84% 100%), conic-gradient(var(--champagne) ${score}%, rgba(255,255,255,.1) 0)`;
  $("[data-bottleneck-title]").textContent = bottleneckTitles[bottleneck] || labels[bottleneck];
  $("[data-feedback-strength]").textContent = analysis.strength_tr;
  $("[data-feedback-correction]").textContent = analysis.correction_tr;
  $("[data-evidence]").textContent = analysis.evidence_tr;
  $("[data-feedback-opening]").textContent = analysis.improved_opening_tr;
}

function transcriptExcerpt(value) {
  const text = String(value || "").trim();
  if (!text) return "The transcript could not be created.";
  return text.length > 280 ? `${text.slice(0, 277).trim()}…` : text;
}

function renderResult() {
  const first = state.analyses.first;
  const retry = state.analyses.retry;
  const before = scoreFrom(first.metrics);
  const after = scoreFrom(retry.metrics);
  const difference = after - before;
  const bottleneck = getPrimaryBottleneck();
  $("[data-before-score]").textContent = before;
  $("[data-after-score]").textContent = after;
  $("[data-improvement-copy]").textContent = difference > 0
    ? `Your overall indicator increased by ${difference} points on your retry. This difference is based only on the change actually seen in your second answer.`
    : difference === 0
      ? "Your overall indicator stayed the same. Even so, you now know which single behavior to focus on and how to start your answer."
      : `Your overall indicator was ${Math.abs(difference)} points lower on your retry. This is not a failure; variation is normal in short answers, and your next focus is now clear.`;
  $("[data-first-transcript]").textContent = transcriptExcerpt(first.transcript);
  $("[data-retry-transcript]").textContent = transcriptExcerpt(retry.transcript);
  $("[data-result-bottleneck]").textContent = bottleneckTitles[bottleneck] || labels[bottleneck];
  $("[data-result-correction]").textContent = first.correction_tr;
  $("[data-result-next]").textContent = retry.next_action_tr;
  const message = [
    "Hello, I have completed the Star Speaker Career English Analysis.",
    `My main focus: ${bottleneckTitles[bottleneck] || labels[bottleneck]}.`,
    "I would like to evaluate my result with a Star Speaker expert.",
  ].join("\n");
  $("[data-whatsapp-cta]").href = `https://wa.me/905525247746?text=${encodeURIComponent(message)}`;
  $("[data-booking-fallback-whatsapp]").href = `https://wa.me/905525247746?text=${encodeURIComponent(
    "Hello, I couldn't find a suitable time for the free Speaking Performance Consultation. Could you help me?",
  )}`;
}

async function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const error = $("[data-contact-error]");
  error.hidden = true;
  const contact = captureContact(form, error);
  if (!contact) return;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  state.contact = contact;
  $$('button', form).forEach((button) => { button.disabled = true; });
  try {
    await saveLead("completed");
    if (!state.leadId) throw new Error("The contact record could not be created.");
    await advanceParticipant({ contact_status: "contact_submitted", lead_id: state.leadId });
    await trackEvent("contact_submitted", "result", {}, "contact_submitted");
    form.hidden = true;
    await loadBookingSlots();
  } catch (cause) {
    $$('button', form).forEach((button) => { button.disabled = false; });
    error.textContent = `${cause.message} Please try again. Your result will remain on the screen.`;
    error.hidden = false;
  }
}

function showBookingStep(step) {
  state.bookingStep = step;
  $$('[data-booking-step]').forEach((panel) => {
    const active = panel.dataset.bookingStep === step;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });
  storeFlow();
  trackEvent('booking_step_viewed', 'booking', { step }, `booking_step:${step}`);
}

function continueFromContact() {
  const form = $("[data-contact-form]");
  const error = $("[data-contact-error]");
  const contact = captureContact(form, error);
  if (!contact) return;
  const fields = $$('input', $('[data-booking-step="contact"]'));
  if (!fields.every((field) => field.checkValidity())) {
    form.reportValidity();
    return;
  }
  state.contact = contact;
  trackEvent('contact_details_completed', 'booking', { email_provided: Boolean(state.contact.email) }, 'contact_details_completed');
  showBookingStep('budget');
}

function captureContact(form, error) {
  for (const field of ["fullName", "whatsapp", "email"]) form.elements[field].setCustomValidity("");
  const data = new FormData(form);
  const result = normalizePublicContact({
    fullName: data.get("fullName"),
    whatsapp: data.get("whatsapp"),
    email: data.get("email"),
  });
  if (!result.valid) {
    const field = form.elements[result.invalidField];
    field.setCustomValidity(result.message);
    error.textContent = result.message;
    error.hidden = false;
    field.focus();
    form.reportValidity();
    return null;
  }
  error.hidden = true;
  form.elements.fullName.value = result.value.fullName;
  form.elements.whatsapp.value = result.value.whatsapp;
  form.elements.email.value = result.value.email;
  return result.value;
}

async function saveLead(stage) {
  if (state.isDemo) return;
  const config = window.STAR_SPEAKER_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey) throw new Error("The communication service is not configured.");
  const payload = {
    action: "save_lead",
    stage,
    lead_id: state.leadId,
    contact: state.contact,
    context: {
      situation: state.situation,
      reported_level: state.reportedLevel,
      normalized_level: state.normalizedLevel,
      question_id: state.question.id,
    },
    qualification: "nurture",
    bottleneck: getPrimaryBottleneck(),
    baseline_metrics: state.analyses.first?.metrics || null,
    final_metrics: state.analyses.retry?.metrics || null,
    transcripts: {
      first: state.analyses.first?.transcript || "",
      retry: state.analyses.retry?.transcript || "",
    },
    session_id: state.sessionId,
    participant_id: state.participantId,
    budget_range: state.budgetRange,
    urgency: state.urgency,
    consent_accepted: true,
    consent_accepted_at: new Date().toISOString(),
    consent_version: "career_english_v3_consent_1",
    source_data: state.sourceData,
  };
  const response = await fetch(`${config.url}/functions/v1/ai-speaking-coach`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "The contact record could not be created.");
  if (body.lead_id) {
    state.leadId = body.lead_id;
    storeFlow();
  }
}

function bookingApi(payload) {
  const config = window.STAR_SPEAKER_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey) throw new Error("The appointment service is not configured.");
  return fetch(`${config.url}/functions/v1/performance-sprint-booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
    },
    body: JSON.stringify(payload),
  }).then(async (response) => {
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || "The appointment could not be completed.");
    return body;
  });
}

function formatBookingDate(value, includeTime = false) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value));
}

function formatBookingTime(value) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function setBookingError(message = "") {
  const root = $("[data-booking-error]");
  root.textContent = message;
  root.hidden = !message;
}

function renderBookingSlots() {
  const datesRoot = $("[data-booking-dates]");
  const slotsRoot = $("[data-booking-slots]");
  datesRoot.replaceChildren();
  slotsRoot.replaceChildren();
  const groups = new Map();
  state.bookingSlots.forEach((slot) => {
    if (!groups.has(slot.booking_date)) groups.set(slot.booking_date, []);
    groups.get(slot.booking_date).push(slot);
  });
  if (!groups.size) {
    slotsRoot.textContent = "No available appointments are showing within the next seven days.";
    return;
  }
  const drawTimes = (date) => {
    state.selectedBookingStart = "";
    $("[data-booking-review]").hidden = true;
    $$("button", datesRoot).forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.date === date);
    });
    slotsRoot.replaceChildren();
    groups.get(date).forEach((slot) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sprint-booking__slot";
      button.textContent = formatBookingTime(slot.appointment_start);
      button.addEventListener("click", () => {
        state.selectedBookingStart = slot.appointment_start;
        $$("button", slotsRoot).forEach((item) => item.classList.toggle("is-selected", item === button));
        $("[data-booking-selection]").textContent = `${formatBookingDate(slot.appointment_start, true)} · Turkey time`;
        $("[data-booking-review]").hidden = false;
        trackEvent("booking_slot_selected", "booking", { booking_date: slot.booking_date }, `booking_slot:${slot.appointment_start}`);
      });
      slotsRoot.append(button);
    });
  };
  groups.forEach((slots, date) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.date = date;
    button.className = "sprint-booking__date";
    button.textContent = formatBookingDate(slots[0].appointment_start);
    button.addEventListener("click", () => {
      drawTimes(date);
      trackEvent("booking_date_selected", "booking", { booking_date: date }, `booking_date:${date}`);
    });
    datesRoot.append(button);
  });
  drawTimes([...groups.keys()][0]);
}

async function loadBookingSlots() {
  const bookingRoot = $("[data-booking]");
  bookingRoot.hidden = false;
  $("[data-booking-loading]").hidden = false;
  $("[data-booking-picker]").hidden = true;
  setBookingError();
  trackEvent("booking_viewed", "booking", {}, "booking_viewed");
  try {
    const body = await bookingApi({ action: "slots" });
    state.bookingSlots = body.slots || [];
    renderBookingSlots();
    $("[data-booking-picker]").hidden = false;
  } catch {
    setBookingError("Suitable times can't be loaded right now. Please try again later.");
  } finally {
    $("[data-booking-loading]").hidden = true;
  }
}

function renderBookingSuccess() {
  if (!state.booking) return;
  $("[data-booking-picker]").hidden = true;
  $("[data-booking-success]").hidden = false;
  $("[data-booking-confirmation]").textContent =
    `${formatBookingDate(state.booking.appointment_start, true)} · Turkey time`;
  const message = `Hello, I scheduled my free Speaking Performance Consultation for ${formatBookingDate(
    state.booking.appointment_start,
  )} at ${formatBookingTime(state.booking.appointment_start)} and would like to confirm my appointment.`;
  $("[data-booking-whatsapp]").href = `https://wa.me/905525247746?text=${encodeURIComponent(message)}`;
}

function storeBooking() {
  try { sessionStorage.setItem("performanceEnglishBooking", JSON.stringify(state.booking)); } catch { /* optional */ }
}

function restoreBooking() {
  try {
    const saved = JSON.parse(sessionStorage.getItem("performanceEnglishBooking") || "null");
    if (!saved?.booking_id || !saved?.management_token || !saved?.appointment_start) return;
    state.booking = saved;
    $("[data-booking]").hidden = false;
    renderBookingSuccess();
    showScreen("result");
  } catch {
    // Browser storage is optional.
  }
}

async function confirmBooking() {
  if (!state.selectedBookingStart || state.bookingSubmitting) return;
  const button = $("[data-booking-confirm]");
  state.bookingSubmitting = true;
  button.disabled = true;
  button.textContent = "Your appointment is being scheduled…";
  setBookingError();
  trackEvent("booking_submitted", "booking", { mode: state.bookingMode }, `booking_submit:${state.bookingMode}`);
  advanceParticipant({ contact_status: "booking_started" }).catch(() => {});
  try {
    if (state.bookingMode === "reschedule" && state.booking) {
      const body = await bookingApi({
        action: "reschedule",
        booking_id: state.booking.booking_id,
        management_token: state.booking.management_token,
        appointment_start: state.selectedBookingStart,
      });
      state.booking = { ...state.booking, ...body.booking };
    } else {
      const body = await bookingApi({
        action: "create",
        lead_id: state.leadId,
        session_id: state.sessionId,
        appointment_start: state.selectedBookingStart,
      });
      state.booking = { ...body.booking, management_token: body.management_token };
    }
    state.bookingMode = "create";
    storeBooking();
    renderBookingSuccess();
    await advanceParticipant({ contact_status: "booked" });
    await trackEvent("booking_confirmed", "booking", {}, `booking_confirmed:${state.booking.booking_id}`);
  } catch (cause) {
    trackEvent("booking_failed", "booking", { mode: state.bookingMode }, `booking_failed:${Date.now()}`);
    await loadBookingSlots();
    setBookingError(cause.message);
  } finally {
    state.bookingSubmitting = false;
    button.disabled = false;
    button.textContent = "Confirm appointment";
  }
}

async function startReschedule() {
  if (!state.booking) return;
  state.bookingMode = "reschedule";
  $("[data-booking-success]").hidden = true;
  trackEvent("booking_reschedule_started", "booking", {}, `booking_reschedule:${Date.now()}`);
  await loadBookingSlots();
}

async function cancelBooking() {
  if (!state.booking || !window.confirm("Are you sure you want to cancel your appointment?")) return;
  const button = $("[data-booking-cancel]");
  button.disabled = true;
  try {
    await bookingApi({
      action: "cancel",
      booking_id: state.booking.booking_id,
      management_token: state.booking.management_token,
    });
    state.booking = null;
    try { sessionStorage.removeItem("performanceEnglishBooking"); } catch { /* optional */ }
    state.bookingMode = "create";
    $("[data-booking-success]").hidden = true;
    toast("Your appointment has been canceled. You can choose a new time if you'd like.");
    await loadBookingSlots();
  } catch (cause) {
    setBookingError(cause.message);
  } finally {
    button.disabled = false;
  }
}

function demoAnalysis(phase) {
  const base = phase === "retry" ? [76, 73, 70, 72] : [62, 48, 54, 57];
  return {
    transcript: phase === "retry"
      ? "The skill I want to develop is confident public speaking. I will practice in short weekly sessions because regular feedback helps me improve. For example, I can volunteer to present our next team update."
      : "I want to improve speaking because it is important for my work. I think practice is helpful and I can try to speak more in meetings.",
    metrics: { clarity: base[0], structure: base[1], pressure: base[2], interaction: base[3] },
    strength_tr: "You made your main idea clear by connecting it to your career goal.",
    correction_tr: phase === "first"
      ? "State your main answer in the first sentence; add the details afterward."
      : "Clearly connect the professional impact of your decision in the final sentence.",
    evidence_tr: "Your main message emerged in the second half of your answer; the listener had to guess the direction from the first sentences.",
    improved_opening_tr: "The skill I want to develop is confident public speaking, because it will help me contribute more clearly at work.",
    next_action_tr: "In your next answer, keep the same direct opening and finish with a concrete example.",
  };
}

function toast(message) {
  const root = $("[data-toast]");
  root.textContent = message;
  root.hidden = false;
  setTimeout(() => { root.hidden = true; }, 3600);
}

$("[data-start]").addEventListener("click", () => {
  trackEvent("start_clicked", "intro", {}, "start_clicked");
  trackEvent("test_started", "intro", {}, "test_started");
  showScreen("setup");
});

$$("[data-situation]").forEach((button) => {
  button.addEventListener("click", () => {
    if (state.situation !== button.dataset.situation) state.question = null;
    state.situation = button.dataset.situation;
    trackEvent("purpose_selected", "setup", { situation: state.situation }, `purpose:${state.situation}`);
    renderSetupSelection();
  });
});

$("[data-setup-form] [name='firstName']").addEventListener("input", renderSetupSelection);

$$('[data-level]').forEach((button) => {
  button.addEventListener("click", () => {
    if (state.reportedLevel !== button.dataset.level) state.question = null;
    state.reportedLevel = button.dataset.level;
    state.recordingDuration = recommendedDuration(state.reportedLevel);
    $("[data-duration-note]").textContent = `${state.recordingDuration} seconds recommended; you can change this if you like.`;
    trackEvent('level_selected', 'setup', { level: state.reportedLevel }, `level:${state.reportedLevel}`);
    renderSetupSelection();
  });
});

$$('[data-duration]').forEach((button) => button.addEventListener('click', () => {
  state.recordingDuration = Number(button.dataset.duration);
  renderSetupSelection();
  trackEvent('duration_selected', 'setup', { duration_seconds: state.recordingDuration }, `duration:${state.recordingDuration}`);
}));

$$('[data-feeling]').forEach((button) => button.addEventListener('click', () => {
  state.emotionalState = button.dataset.feeling;
  state.emotionalSelectedAt = new Date().toISOString();
  renderSetupSelection();
  trackEvent('feeling_selected', 'setup', { feeling: state.emotionalState }, `feeling:${state.emotionalState}`);
}));

$("[data-setup-form]").addEventListener("submit", handleSetupSubmit);

$("[data-record-button]").addEventListener("click", handleRecordButton);
$("[data-countdown-cancel]").addEventListener("click", cancelCountdown);
const countdownStartNow = $("[data-countdown-start-now]");
for (const eventName of ["pointerdown", "pointerup"]) {
  countdownStartNow.addEventListener(eventName, (event) => event.stopPropagation());
}
countdownStartNow.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  completeCountdown("skipped");
});
$("[data-record-again]").addEventListener("click", resetRecorder);
$("[data-use-recording]").addEventListener("click", useRecording);
$("[data-start-retry]").addEventListener("click", async () => {
  await trackEvent("retry_started", "correction", {}, "retry_started");
  state.phase = "retry";
  preparePrompt();
  showScreen("record");
});
$("[data-open-contact]").addEventListener("click", () => {
  $("[data-contact-form]").hidden = false;
  $("[data-contact-form] [name='fullName']").value ||= state.firstName;
  showBookingStep(state.bookingStep || "contact");
  $("[data-open-contact]").hidden = true;
  trackEvent("booking_intent_clicked", "result", {}, "booking_intent_clicked");
  advanceParticipant({ contact_status: "booking_started" }).catch(() => {});
});
$("[data-contact-form]").addEventListener("submit", handleContactSubmit);
$("[data-booking-next='budget']").addEventListener("click", continueFromContact);
$$('[data-booking-back]').forEach((button) => button.addEventListener('click', () => showBookingStep(button.dataset.bookingBack)));
$$('[data-budget]').forEach((button) => button.addEventListener('click', () => {
  state.budgetRange = button.dataset.budget;
  $$('[data-budget]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  storeFlow();
  trackEvent('budget_selected', 'booking', { budget_range: state.budgetRange }, 'budget_selected');
  setTimeout(() => showBookingStep('urgency'), 180);
}));
$$('[data-urgency]').forEach((button) => button.addEventListener('click', async () => {
  state.urgency = button.dataset.urgency;
  $$('[data-urgency]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  storeFlow();
  await trackEvent('urgency_selected', 'booking', { urgency: state.urgency }, 'urgency_selected');
  await handleContactSubmit({ preventDefault() {}, currentTarget: $("[data-contact-form]") });
}));
$("[data-calendar-back]").addEventListener('click', () => {
  $("[data-booking]").hidden = true;
  $("[data-contact-form]").hidden = false;
  showBookingStep('urgency');
});
$("[data-whatsapp-cta]").addEventListener("click", () => {
  trackEvent("whatsapp_clicked", "result", {}, "whatsapp_clicked");
  advanceParticipant({ contact_status: "whatsapp_clicked", keepalive: true }).catch(() => {});
});
$("[data-booking-confirm]").addEventListener("click", confirmBooking);
$("[data-booking-reschedule]").addEventListener("click", startReschedule);
$("[data-booking-cancel]").addEventListener("click", cancelBooking);
$("[data-booking-whatsapp]").addEventListener("click", () => {
  trackEvent("booking_whatsapp_clicked", "booking", {}, `booking_whatsapp:${Date.now()}`);
});
$("[data-booking-fallback-whatsapp]").addEventListener("click", () => {
  trackEvent("booking_no_slot_whatsapp_clicked", "booking", {}, `booking_fallback:${Date.now()}`);
});

window.addEventListener("beforeunload", (event) => {
  if (!state.isDemo && state.currentScreen !== "intro" && state.currentScreen !== "result") {
    trackEvent("session_abandoned", state.currentScreen, {}, `session_abandoned:${state.currentScreen}`);
  }
  if (!state.isDemo && state.currentScreen === "setup" && !state.participantSaved) {
    const completedSteps = [state.situation, state.reportedLevel, state.recordingDuration, state.emotionalState].filter(Boolean).length;
    trackEvent("setup_abandoned", "setup", { completed_steps: completedSteps }, "setup_abandoned");
  }
  releaseTracks(state.stream); state.stream = null;
  if (state.blob && !state.submitting && state.currentScreen === "record") {
    event.preventDefault();
    event.returnValue = "";
  }
});

trackEvent("landing_viewed", "intro", {}, "landing_viewed");
trackEvent("page_opened", "intro", {}, "page_opened");
if (state.isDemo) $("[data-demo-badge]").hidden = false;
if (state.firstName) $("[name='firstName']").value = state.firstName;
renderSetupSelection();
if (state.participantSaved && state.question) {
  if (state.analyses.first && state.analyses.retry) {
    renderResult();
    showScreen("result");
  } else if (state.analyses.first) {
    renderCorrection();
    showScreen("correction");
  } else {
    state.phase = "first";
    preparePrompt();
    showScreen("record");
  }
}
restoreBooking();

// Recover only server-owned evidence, keeping the canonical screens and score rendering.
if (state.participantSaved && !state.isDemo) {
  try {
    const recovered = await participantApi({action: 'get_result'});
    if(recovered.first) state.analyses.first = recovered.first;
    if(recovered.retry) state.analyses.retry = recovered.retry;
    storeFlow();
    if(state.analyses.retry) { renderResult(); showScreen('result'); }
    else if(state.analyses.first) { renderCorrection(); showScreen('correction'); }
  } catch { /* Keep the existing locally recovered screen available. */ }
}
