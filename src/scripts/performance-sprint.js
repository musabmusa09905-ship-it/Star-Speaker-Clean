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

const scenarioPrompts = {
  meeting: {
    title: "Your team must choose between speed and reliability. What do you recommend?",
    context: "Give your recommendation, one reason, and the professional impact.",
    guide: "Recommendation → Reason → Example → Impact",
  },
  interview: {
    title: "Tell me about a difficult technical problem you solved.",
    context: "Explain the problem, your action, and the result.",
    guide: "Problem → Your action → Result",
  },
  presentation: {
    title: "Explain one important result from a recent project.",
    context: "State the result, what caused it, and why it matters.",
    guide: "Result → Evidence → Why it matters",
  },
};

const waitingInsights = [
  "Güçlü bir profesyonel cevap, karmaşık kelimelerden önce net bir ana fikirle başlar.",
  "Kısa bir cevapta tek bir ana mesajı desteklemek, çok sayıda ayrıntı vermekten daha etkilidir.",
  "Teknik ayrıntı ancak dinleyicinin kararını destekliyorsa değerlidir.",
];

function persistentSessionId() {
  try {
    const existing = sessionStorage.getItem("performanceSprintSessionId");
    if (existing) return existing;
    const created = crypto.randomUUID();
    sessionStorage.setItem("performanceSprintSessionId", created);
    return created;
  } catch {
    return crypto.randomUUID();
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

const state = {
  situation: "",
  stream: null,
  recorder: null,
  demoRecording: false,
  chunks: [],
  blob: null,
  timerId: null,
  remaining: 45,
  phase: "first",
  recordings: {},
  analyses: {},
  pending: {},
  submitting: false,
  retryFocus: "",
  contact: {},
  leadId: null,
  sessionId: persistentSessionId(),
  sourceData: getSourceData(),
  trackedEvents: new Set(),
  currentScreen: "intro",
  isDemo: new URLSearchParams(location.search).get("demo") === "1",
  bookingSlots: [],
  selectedBookingStart: "",
  booking: null,
  bookingSubmitting: false,
  bookingMode: "create",
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const screens = Object.fromEntries($$("[data-screen]").map((screen) => [screen.dataset.screen, screen]));
const progressShell = $("[data-progress-shell]");
const progressMap = {
  situation: [1, "Durumunu seç"],
  mic: [2, "Sesli cevap"],
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
  fetch(`${config.url}/functions/v1/ai-speaking-coach`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
    },
    body: JSON.stringify({
      action: "track_event",
      session_id: state.sessionId,
      lead_id: state.leadId,
      event_type: eventType,
      stage,
      metadata,
      source_data: state.sourceData,
    }),
    keepalive: true,
  }).catch(() => {});
}

function promptForSituation() {
  return scenarioPrompts[state.situation] || scenarioPrompts.meeting;
}

function preparePrompt() {
  const prompt = promptForSituation();
  const isRetry = state.phase === "retry";
  $("[data-record-kicker]").textContent = isRetry ? "TEKRAR DENE · 30–45 SANİYE" : "İLK CEVAP · 30–45 SANİYE";
  $("[data-prompt-title]").textContent = prompt.title;
  $("[data-prompt-context]").textContent = prompt.context;
  $("[data-prompt-guide]").textContent = prompt.guide;
  $("[data-correction-reminder]").hidden = !isRetry;
  if (isRetry) {
    $("[data-retry-focus]").textContent = state.retryFocus;
    $("[data-retry-opening]").textContent = state.analyses.first?.improved_opening_tr || "";
  }
  resetRecorder();
}

async function ensureMicrophone() {
  const error = $("[data-mic-error]");
  error.hidden = true;
  try {
    if (state.isDemo) {
      state.phase = "first";
      preparePrompt();
      showScreen("record");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      throw new Error("Bu tarayıcı ses kaydını desteklemiyor. Güncel Chrome, Edge veya Safari ile tekrar dene.");
    }
    state.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.stream.getTracks().forEach((track) => { track.enabled = true; });
    trackEvent("microphone_granted", "microphone", {}, "microphone_granted");
    state.phase = "first";
    preparePrompt();
    showScreen("record");
  } catch (cause) {
    trackEvent("microphone_denied", "microphone", { reason: cause?.name || "unknown" }, "microphone_denied");
    error.textContent = cause?.message?.includes("tarayıcı")
      ? cause.message
      : "Mikrofon izni alınamadı. Tarayıcıdaki kilit simgesinden mikrofonu açıp tekrar dene.";
    error.hidden = false;
  }
}

function resetRecorder() {
  state.blob = null;
  state.chunks = [];
  state.remaining = 45;
  clearInterval(state.timerId);
  $("[data-timer]").textContent = "00:45";
  $("[data-recorder]").classList.remove("is-recording");
  $("[data-record-label]").textContent = "Kaydı Başlat";
  $("[data-record-hint]").textContent = "Hazır olduğunda başla. En fazla 45 saniye.";
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
    state.remaining = 45;
    $("[data-recorder]").classList.add("is-recording");
    $("[data-record-label]").textContent = "Kaydı Bitir";
    $("[data-record-hint]").textContent = "Yerel demo cevabı kaydediliyor.";
    trackEvent(
      state.phase === "retry" ? "retry_recording_started" : "first_recording_started",
      state.phase,
      {},
      `recording_started:${state.phase}`,
    );
    state.timerId = setInterval(() => {
      state.remaining -= 1;
      $("[data-timer]").textContent = `00:${String(Math.max(0, state.remaining)).padStart(2, "0")}`;
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
    $("[data-record-hint]").textContent = `${45 - state.remaining} saniyelik cevap hazır.`;
    $("[data-record-actions]").hidden = false;
  }, { once: true });
  state.recorder.start(250);
  trackEvent(
    state.phase === "retry" ? "retry_recording_started" : "first_recording_started",
    state.phase,
    {},
    `recording_started:${state.phase}`,
  );
  $("[data-recorder]").classList.add("is-recording");
  $("[data-record-label]").textContent = "Kaydı Bitir";
  $("[data-record-hint]").textContent = "Doğal konuş. Kusursuz olmaya çalışma.";
  state.timerId = setInterval(() => {
    state.remaining -= 1;
    $("[data-timer]").textContent = `00:${String(Math.max(0, state.remaining)).padStart(2, "0")}`;
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
    $("[data-record-hint]").textContent = `${45 - state.remaining} saniyelik demo cevabı hazır.`;
    $("[data-record-actions]").hidden = false;
    return;
  }
  if (state.recorder?.state === "recording") state.recorder.stop();
}

function handleRecordButton() {
  if (state.isDemo && state.demoRecording) {
    stopRecording();
    return;
  }
  if (state.recorder?.state === "recording") stopRecording();
  else startRecording();
}

async function useRecording() {
  const error = $("[data-record-error]");
  if (state.submitting) return;
  if (!state.blob || state.blob.size < 1500 || 45 - state.remaining < 4) {
    error.textContent = "Analiz için en az birkaç saniye konuşman gerekiyor. Lütfen yeniden kaydet.";
    error.hidden = false;
    return;
  }
  state.submitting = true;
  $("[data-use-recording]").disabled = true;
  const phase = state.phase;
  const blob = state.blob;
  state.recordings[phase] = blob;
  const duration = 45 - state.remaining;
  trackEvent("recording_submitted", phase, { duration_seconds: duration }, `recording_submitted:${phase}`);
  trackEvent(
    phase === "retry" ? "retry_submitted" : "first_answer_submitted",
    phase,
    { duration_seconds: duration },
    `answer_submitted:${phase}`,
  );
  state.pending[phase] = analyzeRecording(blob, phase, promptForSituation());
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
  form.append("prompt", JSON.stringify(prompt));
  form.append("context", JSON.stringify({ situation: state.situation }));
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
    stopAnalysisAnimations();
    if (phase === "first") {
      renderCorrection();
      trackEvent("personal_correction_viewed", "correction", {}, "personal_correction_viewed");
      trackEvent("diagnosis_received", "correction", {}, "diagnosis_received");
      showScreen("correction");
    } else {
      renderResult();
      trackEvent("result_viewed", "result", {}, "result_viewed");
      showScreen("result");
    }
  } catch (cause) {
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
    "Merhaba, 3 Dakikalık Konuşma Performans Analizi'ni tamamladım.",
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
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const data = new FormData(form);
  state.contact = {
    fullName: String(data.get("fullName") || "").trim(),
    whatsapp: String(data.get("whatsapp") || "").trim(),
    email: String(data.get("email") || "").trim(),
  };
  const submit = $("button[type='submit']", form);
  submit.disabled = true;
  submit.textContent = "Uygun saatler hazırlanıyor…";
  trackEvent("contact_submitted", "result", {}, "contact_submitted");
  try {
    await saveLead("completed");
    if (!state.leadId) throw new Error("İletişim kaydı oluşturulamadı.");
    form.hidden = true;
    await loadBookingSlots();
  } catch (cause) {
    submit.disabled = false;
    submit.innerHTML = 'Uygun Saatleri Göster <span aria-hidden="true">→</span>';
    error.textContent = `${cause.message} Lütfen tekrar dene. Sonucun ekranda kalmaya devam edecek.`;
    error.hidden = false;
  }
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
    context: { situation: state.situation },
    qualification: "nurture",
    bottleneck: getPrimaryBottleneck(),
    baseline_metrics: state.analyses.first?.metrics || null,
    final_metrics: state.analyses.retry?.metrics || null,
    transcripts: {
      first: state.analyses.first?.transcript || "",
      retry: state.analyses.retry?.transcript || "",
    },
    session_id: state.sessionId,
    budget_range: null,
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
  if (body.lead_id) state.leadId = body.lead_id;
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
      ? "The main decision I made was to prioritize reliability because downtime was our biggest operational risk. I compared both options, aligned the team, and the release remained stable."
      : "We had a project and there were different options. I think reliability was important and we discussed it with the team before the release.",
    metrics: { clarity: base[0], structure: base[1], pressure: base[2], interaction: base[3] },
    strength_tr: "Teknik kararının nedenini somut bir proje ayrıntısıyla destekledin.",
    correction_tr: phase === "first"
      ? "Ana cevabını ilk cümlede söyle; ayrıntıları daha sonra ekle."
      : "Son cümlede kararının profesyonel etkisini açıkça bağla.",
    evidence_tr: "Ana mesajın cevabın ikinci yarısında ortaya çıktı; dinleyici ilk cümlelerde yönü tahmin etmek zorunda kaldı.",
    improved_opening_tr: "The main decision I made was to prioritize reliability, because downtime was our biggest operational risk.",
    next_action_tr: "Bir sonraki cevabında aynı doğrudan açılışı koruyup sonucu tek cümlede bağla.",
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
  showScreen("situation");
});

$$("[data-situation]").forEach((button) => {
  button.addEventListener("click", () => {
    state.situation = button.dataset.situation;
    trackEvent("situation_selected", "situation", { situation: state.situation }, "situation_selected");
    showScreen("mic");
  });
});

$("[data-enable-mic]").addEventListener("click", ensureMicrophone);
$("[data-record-button]").addEventListener("click", handleRecordButton);
$("[data-record-again]").addEventListener("click", resetRecorder);
$("[data-use-recording]").addEventListener("click", useRecording);
$("[data-start-retry]").addEventListener("click", () => {
  trackEvent("retry_started", "correction", {}, "retry_started");
  state.phase = "retry";
  preparePrompt();
  showScreen("record");
});
$("[data-open-contact]").addEventListener("click", () => {
  $("[data-contact-form]").hidden = false;
  $("[data-open-contact]").hidden = true;
  trackEvent("booking_intent_clicked", "result", {}, "booking_intent_clicked");
});
$("[data-contact-form]").addEventListener("submit", handleContactSubmit);
$("[data-whatsapp-cta]").addEventListener("click", () => {
  trackEvent("whatsapp_clicked", "result", {}, "whatsapp_clicked");
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

window.addEventListener("beforeunload", () => {
  if (!state.isDemo && state.currentScreen !== "intro" && state.currentScreen !== "result") {
    trackEvent("session_abandoned", state.currentScreen, {}, `session_abandoned:${state.currentScreen}`);
  }
  state.stream?.getTracks().forEach((track) => track.stop());
});

trackEvent("landing_viewed", "intro", {}, "landing_viewed");
trackEvent("page_opened", "intro", {}, "page_opened");
if (state.isDemo) $("[data-demo-badge]").hidden = false;
restoreBooking();
