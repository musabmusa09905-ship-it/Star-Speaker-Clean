import {
  EXPERIENCE_VERSION,
  QUESTION_BANK_VERSION,
  normalizeReportedLevel,
  recommendedDuration,
  resolveQuestion,
  resolveQuestionById,
  validateFirstName,
} from "./performance-analysis-config.js";
import { persistSetupAttempt } from "./performance-setup-recovery.js";
import { normalizePublicContact } from "./performance-contact-contract.js";

const labels = {
  clarity: "Netlik",
  structure: "Yapı",
  pressure: "Baskı altında sürdürme",
  interaction: "Profesyonel etki",
};

const bottleneckTitles = {
  clarity: "Netlik",
  structure: "Cevap yapısı",
  pressure: "Baskı altında sürdürme",
  interaction: "Profesyonel etki",
};

const waitingInsights = [
  "Güçlü bir profesyonel cevap, karmaşık kelimelerden önce net bir ana fikirle başlar.",
  "Kısa bir cevapta tek bir ana mesajı desteklemek, çok sayıda ayrıntı vermekten daha etkilidir.",
  "Bir örnek, ana fikrini dinleyici için daha anlaşılır ve akılda kalıcı yapar.",
];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUuid(value) {
  return UUID_PATTERN.test(String(value || ""));
}

function persistentSessionId() {
  try {
    const existing = sessionStorage.getItem("performanceSprintSessionId");
    if (isValidUuid(existing)) return existing;
    const created = crypto.randomUUID();
    sessionStorage.setItem("performanceSprintSessionId", created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

const QUESTION_HISTORY_KEY = "starSpeakerQuestionHistoryV2";
const ANONYMOUS_ID_KEY = "starSpeakerAnonymousParticipantId";

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
    const stored = JSON.parse(sessionStorage.getItem("performanceAnalysisFlow") || "null");
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

function storeFlow() {
  try {
    sessionStorage.setItem("performanceAnalysisFlow", JSON.stringify({
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
  setup: [1, "Hızlı başlangıç"],
  record: [state.phase === "retry" ? 4 : 2, state.phase === "retry" ? "Tekrar dene" : "Sesli cevap"],
  analysis: [state.phase === "retry" ? 5 : 3, "Analiz"],
  correction: [3, "Kişisel düzeltme"],
  result: [5, "Sonuç"],
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === name);
  });
  state.currentScreen = name;
  progressShell.hidden = name === "intro";
  if (name === "record" || name === "analysis") {
    progressMap[name] = [
      state.phase === "retry" ? (name === "record" ? 4 : 5) : (name === "record" ? 2 : 3),
      state.phase === "retry" ? (name === "record" ? "Tekrar dene" : "Sonuç") : (name === "record" ? "Sesli cevap" : "Analiz"),
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
  if (!config.url || !config.anonKey) throw new Error("Katılımcı kaydı yapılandırılmamış.");
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
    const failure = new Error(body.error || "Katılımcı kaydı tamamlanamadı.");
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
  if (!config.url || !config.anonKey) throw Object.assign(new Error("Soru servisi yapılandırılmamış."), { code: "question_service_unconfigured" });
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
    const failure = new Error(body.error || "Soru seçilemedi.");
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
  try { sessionStorage.setItem("performanceSprintSessionId", created); } catch { /* in-memory fallback */ }
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
  if (!state.participantSaved) throw new Error("Katılımcı kaydı bulunamadı.");
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
  $("[data-setup-progress]")?.setAttribute("aria-label", `Hazırlık ${completedSteps}/4`);
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
    error.textContent = "Lütfen konuşmak istediğin durumu seç.";
    error.hidden = false;
    return;
  }
  if (!state.reportedLevel) {
    error.textContent = "Lütfen sana en yakın konuşma seviyesini seç.";
    error.hidden = false;
    return;
  }
  if (!state.emotionalState) {
    error.textContent = "Lütfen bugün nasıl hissettiğini seç.";
    error.hidden = false;
    return;
  }
  state.firstName = nameResult.value;
  state.normalizedLevel = normalizeReportedLevel(state.reportedLevel);
  state.setupSubmitting = true;
  submit.disabled = true;
  submit.textContent = "Sorun hazırlanıyor…";
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
    error.innerHTML = `Şu anda devam edemedik. Lütfen tekrar dene. <button type="submit" class="sprint-inline-retry" data-setup-retry>Tekrar Dene</button>`;
    error.dataset.failureCode = failureCode;
    if (correlationId) error.dataset.correlationId = correlationId;
    error.hidden = false;
    state.setupHadFailure = true;
    trackEvent("setup_failed", "setup", { failure_code: failureCode, correlation_id: correlationId }, `setup_failed:${Date.now()}`);
  } finally {
    state.setupSubmitting = false;
    submit.innerHTML = 'Sorunu Gör <span aria-hidden="true">→</span>';
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
  $("[data-record-kicker]").textContent = `${isRetry ? "TEKRAR DENE" : "İLK CEVAP"} · ${state.recordingDuration} SANİYE`;
  $("[data-prompt-title]").textContent = prompt.title;
  $("[data-prompt-context]").textContent = prompt.context;
  $("[data-prompt-translation]").textContent = prompt.translationTr || "";
  $("[data-prompt-guide]").textContent = prompt.guide;
  $("[data-correction-reminder]").hidden = !isRetry;
  $("[data-record-advice-label]").textContent = isRetry ? "BU KEZ ŞUNA ODAKLAN" : "İPUCU";
  $("[data-record-advice]").textContent = isRetry
    ? state.retryFocus
    : "Net, doğal ve kendin ol. Akıcılık, cümle uzunluğundan daha değerlidir.";
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
      throw new Error("Bu tarayıcı ses kaydını desteklemiyor. Güncel Chrome, Edge veya Safari ile tekrar dene.");
    }
    state.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.stream.getTracks().forEach((track) => { track.enabled = true; });
    trackEvent("microphone_granted", "microphone", {}, "microphone_granted");
    return true;
  } catch (cause) {
    trackEvent("microphone_denied", "microphone", { reason: cause?.name || "unknown" }, "microphone_denied");
    error.textContent = cause?.message?.includes("tarayıcı")
      ? cause.message
      : "Mikrofon izni alınamadı. Tarayıcıdaki kilit simgesinden mikrofonu açıp tekrar dene.";
    error.hidden = false;
    setRecordStatus("Mikrofon izni gerekli");
    return false;
  }
}

function cancelCountdown() {
  clearInterval(state.countdownId);
  state.countdownId = null;
  state.recordingIntent = false;
  state.countdownStartedAt = 0;
  $("[data-countdown]").hidden = true;
  $("[data-record-button]").disabled = false;
  $("[data-record-hint]").textContent = `Hazır olduğunda başla. En fazla ${state.recordingDuration} saniye.`;
  setRecordStatus("Hazır");
  trackEvent("recording_countdown_cancelled", state.phase, {}, `countdown_cancelled:${state.phase}:${Date.now()}`);
}

function completeCountdown(reason) {
  if (!state.recordingIntent) return false;
  const configuredDuration = 5;
  const elapsedDuration = reason === "timer"
    ? configuredDuration
    : Math.max(0, Math.min(configuredDuration, Math.floor((Date.now() - state.countdownStartedAt) / 1000)));
  clearInterval(state.countdownId);
  state.countdownId = null;
  state.recordingIntent = false;
  state.countdownStartedAt = 0;
  $("[data-countdown]").hidden = true;
  $("[data-record-button]").disabled = false;
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
  let seconds = 5;
  state.recordingIntent = true;
  state.countdownStartedAt = Date.now();
  $("[data-countdown]").hidden = false;
  $("[data-countdown-number]").textContent = String(seconds);
  $("[data-record-button]").disabled = true;
  setRecordStatus("5 saniye içinde başlayacak");
  trackEvent("recording_countdown_started", state.phase, { seconds }, `countdown_started:${state.phase}`);
  state.countdownId = setInterval(() => {
    seconds -= 1;
    $("[data-countdown-number]").textContent = String(Math.max(0, seconds));
    if (seconds <= 0) {
      completeCountdown("timer");
    }
  }, 1000);
}

function resetRecorder() {
  state.blob = null;
  state.chunks = [];
  state.remaining = state.recordingDuration;
  clearInterval(state.timerId);
  $("[data-timer]").textContent = `${String(Math.floor(state.recordingDuration / 60)).padStart(2, "0")}:${String(state.recordingDuration % 60).padStart(2, "0")}`;
  $("[data-recorder]").classList.remove("is-recording");
  $("[data-record-label]").textContent = "Kaydı Başlat";
  $("[data-record-hint]").textContent = `Hazır olduğunda başla. En fazla ${state.recordingDuration} saniye.`;
  setRecordStatus("Hazır");
  $("[data-record-actions]").hidden = true;
  $("[data-record-error]").hidden = true;
  $("[data-record-button]").disabled = false;
  $("[data-use-recording]").disabled = false;
}

function selectMimeType() {
  return ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function startRecording() {
  if (state.isDemo) {
    if (state.demoRecording) return;
    state.demoRecording = true;
    state.remaining = state.recordingDuration;
    $("[data-recorder]").classList.add("is-recording");
    $("[data-record-label]").textContent = "Kaydı Bitir";
    $("[data-record-hint]").textContent = "Yerel demo cevabı kaydediliyor.";
    setRecordStatus("Kayıt yapılıyor");
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
  state.recorder = new MediaRecorder(state.stream, mimeType ? { mimeType } : undefined);
  state.recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size) state.chunks.push(event.data);
  });
  state.recorder.addEventListener("stop", () => {
    state.blob = new Blob(state.chunks, { type: state.recorder.mimeType || "audio/webm" });
    $("[data-recorder]").classList.remove("is-recording");
    $("[data-record-label]").textContent = "Kayıt Tamamlandı";
    $("[data-record-hint]").textContent = `${state.recordingDuration - state.remaining} saniyelik cevap hazır.`;
    $("[data-record-actions]").hidden = false;
    setRecordStatus("Kayıt tamamlandı");
  }, { once: true });
  state.recorder.start(250);
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
  $("[data-record-label]").textContent = "Kaydı Bitir";
  $("[data-record-hint]").textContent = "Doğal konuş. Kusursuz olmaya çalışma.";
  setRecordStatus("Kayıt yapılıyor");
  state.timerId = setInterval(() => {
    state.remaining -= 1;
    $("[data-timer]").textContent = `${String(Math.floor(Math.max(0, state.remaining) / 60)).padStart(2, "0")}:${String(Math.max(0, state.remaining) % 60).padStart(2, "0")}`;
    if (state.remaining <= 0) stopRecording();
  }, 1000);
}

function stopRecording() {
  clearInterval(state.timerId);
  if (state.isDemo && state.demoRecording) {
    state.demoRecording = false;
    state.blob = new Blob([new Uint8Array(2000)], { type: "audio/webm" });
    $("[data-recorder]").classList.remove("is-recording");
    $("[data-record-label]").textContent = "Demo Kaydı Tamamlandı";
    $("[data-record-hint]").textContent = `${state.recordingDuration - state.remaining} saniyelik demo cevabı hazır.`;
    $("[data-record-actions]").hidden = false;
    setRecordStatus("Kayıt tamamlandı");
    return;
  }
  if (state.recorder?.state === "recording") state.recorder.stop();
}

async function handleRecordButton() {
  if (state.recordingIntent) return;
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
    error.textContent = "Analiz için en az birkaç saniye konuşman gerekiyor. Lütfen yeniden kaydet.";
    error.hidden = false;
    return;
  }
  state.submitting = true;
  $("[data-use-recording]").disabled = true;
  setRecordStatus("Gönderiliyor");
  const phase = state.phase;
  const blob = state.blob;
  state.recordings[phase] = blob;
  const duration = state.recordingDuration - state.remaining;
  try {
    await advanceParticipant(phase === "retry"
      ? { stage: "retry_submitted", retry_status: "submitted" }
      : { stage: "first_answer_submitted", first_recording_status: "submitted" });
  } catch (cause) {
    error.textContent = `${cause.message} Kaydın bu ekranda duruyor; tekrar kaydetmen gerekmiyor.`;
    error.hidden = false;
    state.submitting = false;
    $("[data-use-recording]").disabled = false;
    setRecordStatus("Gönderim hatası");
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
  setRecordStatus("Analiz ediliyor");
  await waitForAnalysis(phase);
  state.submitting = false;
}

async function analyzeRecording(blob, phase, prompt) {
  if (state.isDemo) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return demoAnalysis(phase);
  }
  const config = window.STAR_SPEAKER_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey) throw new Error("Analiz servisi yapılandırılmamış.");
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
  if (!response.ok) throw new Error(body.error || "AI analizi şu anda tamamlanamadı.");
  return body;
}

async function waitForAnalysis(phase) {
  showScreen("analysis");
  const status = $("[data-analysis-status]");
  const error = $("[data-analysis-error]");
  const retry = $("[data-analysis-retry]");
  status.textContent = "Konuşma örneğin yazıya dönüştürülüyor…";
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
    status.textContent = "Analiz tamamlanamadı.";
    error.textContent = `${cause.message} Kaydın bu ekranda duruyor; yeniden kayıt yapman gerekmiyor.`;
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
      "Cevap yapın haritalanıyor…",
      "Netlik ve profesyonel etki karşılaştırılıyor…",
      "En değerli düzeltme seçiliyor…",
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
  if (!text) return "Transkript oluşturulamadı.";
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
    ? `Tekrar denemende genel gösterge ${difference} puan yükseldi. Bu fark yalnızca ikinci cevabında gerçekten görülen değişime dayanıyor.`
    : difference === 0
      ? "Genel gösterge aynı kaldı. Yine de artık hangi tek davranışa odaklanacağını ve cevabını nasıl başlatacağını biliyorsun."
      : `Tekrar denemendeki genel gösterge ${Math.abs(difference)} puan daha düşük çıktı. Bu bir başarısızlık değil; kısa cevaplarda dalgalanma normaldir ve sonraki odağın artık nettir.`;
  $("[data-first-transcript]").textContent = transcriptExcerpt(first.transcript);
  $("[data-retry-transcript]").textContent = transcriptExcerpt(retry.transcript);
  $("[data-result-bottleneck]").textContent = bottleneckTitles[bottleneck] || labels[bottleneck];
  $("[data-result-correction]").textContent = first.correction_tr;
  $("[data-result-next]").textContent = retry.next_action_tr;
  const message = [
    "Merhaba, Star Speaker Kariyer İngilizcesi Analizi'ni tamamladım.",
    `Ana odağım: ${bottleneckTitles[bottleneck] || labels[bottleneck]}.`,
    "Sonucumu bir Star Speaker uzmanıyla değerlendirmek istiyorum.",
  ].join("\n");
  $("[data-whatsapp-cta]").href = `https://wa.me/905525247746?text=${encodeURIComponent(message)}`;
  $("[data-booking-fallback-whatsapp]").href = `https://wa.me/905525247746?text=${encodeURIComponent(
    "Merhaba, ücretsiz Konuşma Performansı Görüşmesi için uygun bir saat bulamadım. Yardımcı olabilir misiniz?",
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
    if (!state.leadId) throw new Error("İletişim kaydı oluşturulamadı.");
    await advanceParticipant({ contact_status: "contact_submitted", lead_id: state.leadId });
    await trackEvent("contact_submitted", "result", {}, "contact_submitted");
    form.hidden = true;
    await loadBookingSlots();
  } catch (cause) {
    $$('button', form).forEach((button) => { button.disabled = false; });
    error.textContent = `${cause.message} Lütfen tekrar dene. Sonucun ekranda kalmaya devam edecek.`;
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
  if (!config.url || !config.anonKey) throw new Error("İletişim servisi yapılandırılmamış.");
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
  if (!response.ok) throw new Error(body.error || "İletişim kaydı oluşturulamadı.");
  if (body.lead_id) {
    state.leadId = body.lead_id;
    storeFlow();
  }
}

function bookingApi(payload) {
  const config = window.STAR_SPEAKER_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey) throw new Error("Randevu servisi yapılandırılmamış.");
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
    if (!response.ok) throw new Error(body.error || "Randevu işlemi tamamlanamadı.");
    return body;
  });
}

function formatBookingDate(value, includeTime = false) {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value));
}

function formatBookingTime(value) {
  return new Intl.DateTimeFormat("tr-TR", {
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
    slotsRoot.textContent = "Önümüzdeki yedi gün içinde uygun randevu görünmüyor.";
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
        $("[data-booking-selection]").textContent = `${formatBookingDate(slot.appointment_start, true)} · Türkiye saati`;
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
    setBookingError("Uygun saatler şu anda yüklenemiyor. Lütfen biraz sonra tekrar dene.");
  } finally {
    $("[data-booking-loading]").hidden = true;
  }
}

function renderBookingSuccess() {
  if (!state.booking) return;
  $("[data-booking-picker]").hidden = true;
  $("[data-booking-success]").hidden = false;
  $("[data-booking-confirmation]").textContent =
    `${formatBookingDate(state.booking.appointment_start, true)} · Türkiye saati`;
  const message = `Merhaba, ücretsiz Konuşma Performansı Görüşmemi ${formatBookingDate(
    state.booking.appointment_start,
  )} tarihinde saat ${formatBookingTime(state.booking.appointment_start)} için planladım. Randevumu onaylamak istiyorum.`;
  $("[data-booking-whatsapp]").href = `https://wa.me/905525247746?text=${encodeURIComponent(message)}`;
}

function storeBooking() {
  try { sessionStorage.setItem("performanceSprintBooking", JSON.stringify(state.booking)); } catch { /* optional */ }
}

function restoreBooking() {
  try {
    const saved = JSON.parse(sessionStorage.getItem("performanceSprintBooking") || "null");
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
  button.textContent = "Randevun planlanıyor…";
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
    button.textContent = "Randevuyu Onayla";
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
  if (!state.booking || !window.confirm("Randevunu iptal etmek istediğine emin misin?")) return;
  const button = $("[data-booking-cancel]");
  button.disabled = true;
  try {
    await bookingApi({
      action: "cancel",
      booking_id: state.booking.booking_id,
      management_token: state.booking.management_token,
    });
    state.booking = null;
    try { sessionStorage.removeItem("performanceSprintBooking"); } catch { /* optional */ }
    state.bookingMode = "create";
    $("[data-booking-success]").hidden = true;
    toast("Randevun iptal edildi. İstersen yeni bir saat seçebilirsin.");
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
    strength_tr: "Ana fikrini kariyer hedefinle ilişkilendirerek anlaşılır hale getirdin.",
    correction_tr: phase === "first"
      ? "Ana cevabını ilk cümlede söyle; ayrıntıları daha sonra ekle."
      : "Son cümlede kararının profesyonel etkisini açıkça bağla.",
    evidence_tr: "Ana mesajın cevabın ikinci yarısında ortaya çıktı; dinleyici ilk cümlelerde yönü tahmin etmek zorunda kaldı.",
    improved_opening_tr: "The skill I want to develop is confident public speaking, because it will help me contribute more clearly at work.",
    next_action_tr: "Bir sonraki cevabında aynı doğrudan açılışı koruyup somut bir örnekle bitir.",
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
    $("[data-duration-note]").textContent = `${state.recordingDuration} saniyeyi öneriyoruz; istersen değiştirebilirsin.`;
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
$("[data-countdown-start-now]").addEventListener("click", () => completeCountdown("skipped"));
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
  state.stream?.getTracks().forEach((track) => track.stop());
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
