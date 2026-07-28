const questions = [
  {
    key: "field",
    title: "Hangi mühendislik alanında çalışıyorsun?",
    help: "Konuşma senaryolarını sana göre uyarlayacağız.",
    options: [
      ["mechanical", "Makine / Mekatronik"],
      ["software", "Yazılım / Bilgisayar"],
      ["civil", "İnşaat / Mimarlık"],
      ["electrical", "Elektrik / Elektronik"],
      ["industrial", "Endüstri / Üretim"],
      ["chemical", "Kimya / Malzeme / Enerji"],
      ["other", "Diğer mühendislik alanı"],
    ],
  },
  {
    key: "role",
    title: "Şu an kariyerinin hangi aşamasındasın?",
    help: "Soruların seviyesi unvanına değil, gerçek sorumluluklarına göre ayarlanacak.",
    options: [
      ["student", "Öğrenci / Yeni mezun"],
      ["junior", "0–3 yıl deneyim"],
      ["mid", "4–8 yıl deneyim"],
      ["senior", "9+ yıl deneyim"],
      ["lead", "Takım lideri / Yönetici"],
    ],
  },
  {
    key: "situation",
    title: "İngilizce performansın en çok hangi durumda önemli?",
    help: "İkinci konuşma görevin doğrudan bu duruma göre seçilecek.",
    options: [
      ["interview", "İş görüşmesi"],
      ["meeting", "Toplantı / Teknik tartışma"],
      ["presentation", "Sunum"],
      ["international", "Uluslararası ekip / proje"],
      ["daily", "Günlük iş iletişimi"],
    ],
  },
  {
    key: "deadline",
    title: "Bu konuda ne kadar yakın bir hedefin var?",
    help: "Yakın bir tarih yoksa da seansa devam edebilirsin.",
    options: [
      ["14", "Önümüzdeki 2 hafta içinde"],
      ["30", "Önümüzdeki 30 gün içinde"],
      ["90", "Önümüzdeki 3 ay içinde"],
      ["ongoing", "Her hafta karşılaştığım bir problem"],
      ["none", "Belirli bir tarihim yok"],
    ],
  },
  {
    key: "readiness",
    title: "Sonucun gerçek bir problem gösterirse ne yapmak istiyorsun?",
    help: "Bu cevap test sonucunu değiştirmez; sana doğru sonraki adımı göstermemizi sağlar.",
    options: [
      ["start", "Hemen çalışmaya başlamak istiyorum"],
      ["explore", "Önce doğru çözümü görmek istiyorum"],
      ["self", "Şimdilik kendim çalışmak istiyorum"],
      ["curious", "Sadece merak ediyorum"],
    ],
  },
];

const labels = {
  clarity: "Netlik",
  structure: "Yapı",
  pressure: "Baskı altında performans",
  interaction: "Profesyonel etkileşim",
};

const bottleneckCopy = {
  clarity: {
    title: "Teknik Netlik",
    summary: "Teknik bilgin var; fakat ana mesajın dinleyicinin takip edebileceği kadar sade ve görünür olmayabiliyor.",
    method: "Teknikten Netliğe",
    intro: "Önce sonucu söyle, sonra yalnızca dinleyicinin karar vermesi için gereken teknik ayrıntıyı ekle.",
    steps: [
      ["Ana mesaj", "Dinleyicinin bilmesi gereken sonucu tek cümlede söyle."],
      ["Neden", "Bu sonucun neden önemli olduğunu açıkla."],
      ["Teknik kanıt", "Yalnızca bir ilgili veri veya teknik ayrıntı ekle."],
      ["Etkisi", "İş, risk, zaman veya kalite üzerindeki etkisini bağla."],
    ],
    example: "The main issue was excessive heat loss. We traced it to the insulation layer, and fixing it reduced energy consumption by 12%.",
    guide: "Main message → Why → One technical detail → Impact",
    next: "Farklı dinleyiciler için teknik açıklama derinliğini ayarlamak",
  },
  structure: {
    title: "Cevap Yapısı",
    summary: "Ne söylemek istediğini biliyorsun; fakat ana fikir, gerekçe ve kanıt doğru sırada görünmeyince güçlü bilgin daha zayıf duyulabiliyor.",
    method: "Nokta–Gerekçe–Kanıt–Aksiyon",
    intro: "Cevabını dört görünür parçaya böl. Dinleyici daha ilk cümlede nereye gittiğini anlamalı.",
    steps: [
      ["Nokta", "Sorunun doğrudan cevabını ver."],
      ["Gerekçe", "Bu cevabın nedenini açıkla."],
      ["Kanıt", "Bir proje, veri veya teknik örnek ekle."],
      ["Aksiyon", "Ne yaptığını veya ne önerdiğini söyle."],
    ],
    example: "I would prioritize reliability. The reason is that downtime is our biggest operational risk. In my last project, this approach reduced failures by 18%, so I would begin with a reliability review.",
    guide: "Point → Reason → Evidence → Action",
    next: "Takip sorularında yapıyı korumak",
  },
  pressure: {
    title: "Baskı Altında Başlangıç",
    summary: "Bilgin kaybolmuyor; cevaba başlamadan önce kusursuz cümleyi kurmaya çalışmak erişimini yavaşlatıyor.",
    method: "5 Saniyelik Başlangıç",
    intro: "Mükemmel cevabı bekleme. Beş saniye içinde güvenli bir ana cümleyle başla, sonra fikrini geliştir.",
    steps: [
      ["Ana kelime", "Sorunun merkezindeki bir kelimeyi seç."],
      ["Net başlangıç", "I would… / The main reason is… kalıbıyla pozisyonunu söyle."],
      ["Tek gerekçe", "Yalnızca bir nedeni geliştir."],
      ["Somutlaştır", "Kısa bir örnekle cevabı tamamla."],
    ],
    example: "The main challenge was coordination. I solved it by creating a short daily handover, which helped us identify delays before they affected the schedule.",
    guide: "Keyword → Direct start → One reason → Example",
    next: "Beklenmedik takip sorularına daha hızlı cevap vermek",
  },
  interaction: {
    title: "Profesyonel Etkileşim",
    summary: "Hazırladığın açıklamalarda daha rahatsın; fakat belirsiz soru, itiraz veya takip sorusunda kontrol azalabiliyor.",
    method: "Netleştir–Doğrula–Cevapla",
    intro: "Soruyu tahmin ederek cevaplamak yerine kısa bir netleştirme ile kontrolü geri al.",
    steps: [
      ["Netleştir", "Sorunun hangi kısmına odaklanman gerektiğini sor."],
      ["Doğrula", "Anladığın noktayı tek cümlede teyit et."],
      ["Cevapla", "Ana pozisyonunu doğrudan söyle."],
      ["Kontrol et", "Cevabının soruyu karşılayıp karşılamadığını doğrula."],
    ],
    example: "If I understand correctly, you are asking about the schedule risk rather than the technical feasibility. The main risk is supplier delay, and we have two mitigation options.",
    guide: "Clarify → Confirm → Respond → Check",
    next: "İtiraz ve anlaşmazlık anlarında profesyonel dil kullanmak",
  },
};

const scenarioPrompts = {
  interview: {
    title: "Tell me about a difficult technical problem you solved.",
    context: "Explain the problem, your decision, and the result.",
  },
  meeting: {
    title: "Your team must choose between speed and reliability. What do you recommend?",
    context: "State your recommendation and explain the engineering reason behind it.",
  },
  presentation: {
    title: "Explain one important result from a recent project.",
    context: "Make the result understandable to a manager who is not an engineer.",
  },
  international: {
    title: "A project is falling behind schedule. Give your international team a short update.",
    context: "Explain the cause, current risk, and the next action.",
  },
  daily: {
    title: "Explain a technical decision you made recently.",
    context: "State the decision, why you made it, and its impact.",
  },
};

const waitingInsights = [
  "Güçlü bir profesyonel cevap, karmaşık kelimelerden önce net bir ana fikirle başlar.",
  "Duraksama her zaman kelime eksikliği değildir; bazen cevap yapısının görünür olmamasıdır.",
  "Teknik ayrıntı ancak dinleyicinin kararını destekliyorsa değerlidir.",
  "İyi bir cevapta ilk cümle yönü, son cümle ise profesyonel etkisini gösterir.",
  "Konuşma gelişimi, aynı beceriyi geri bildirimle tekrar ettiğinde görünür hale gelir.",
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

const state = {
  answers: {},
  questionIndex: 0,
  stream: null,
  recorder: null,
  chunks: [],
  blob: null,
  timerId: null,
  remaining: 45,
  phase: "baseline-1",
  analyses: {},
  pending: {},
  contact: {},
  leadId: null,
  retryFocus: "",
  budgetRange: "",
  sessionId: persistentSessionId(),
  sourceData: getSourceData(),
  lastTrackedStage: "",
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
  setup: [1, "Profesyonel bağlam"],
  mic: [2, "Konuşma örnekleri"],
  record: [2, "Konuşma örnekleri"],
  contact: [3, "Kişisel analiz"],
  analysis: [3, "AI analizi"],
  diagnosis: [4, "Darboğaz"],
  method: [5, "İlk düzeltme"],
  feedback: [5, "Uygulama"],
  result: [6, "Sonuç"],
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === name);
  });
  progressShell.hidden = name === "intro";
  if (progressMap[name]) {
    const [step, label] = progressMap[name];
    $("[data-progress-label]").textContent = label;
    $("[data-progress-count]").textContent = `${step} / 6`;
    $("[data-progress]").setAttribute("aria-valuenow", String(step));
    $("[data-progress-fill]").style.width = `${(step / 6) * 100}%`;
  }
  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  trackStage(name);
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

const stageEvents = {
  intro: "page_opened",
  setup: "test_started",
  mic: "setup_completed",
  contact: "baseline_submitted",
  diagnosis: "diagnosis_received",
  method: "training_started",
  result: "result_viewed",
};

function trackStage(stage) {
  const eventType = stageEvents[stage];
  if (!eventType || state.lastTrackedStage === stage) return;
  state.lastTrackedStage = stage;
  trackEvent(eventType, stage);
}

async function trackEvent(eventType, stage, metadata = {}) {
  if (state.isDemo) return;
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

function renderQuestion() {
  const question = questions[state.questionIndex];
  $("[data-question-number]").textContent = `Soru ${state.questionIndex + 1} / ${questions.length}`;
  $("[data-question-title]").textContent = question.title;
  $("[data-question-help]").textContent = question.help;
  const options = $("[data-options]");
  options.replaceChildren();
  question.options.forEach(([value, text], index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sprint-option";
    button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span><strong>${text}</strong>`;
    button.addEventListener("click", () => {
      state.answers[question.key] = value;
      if (state.questionIndex < questions.length - 1) {
        state.questionIndex += 1;
        renderQuestion();
      } else {
        showScreen("mic");
      }
    });
    options.append(button);
  });
  $("[data-setup-back]").hidden = state.questionIndex === 0;
}

async function ensureMicrophone() {
  const error = $("[data-mic-error]");
  error.hidden = true;
  try {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      throw new Error("Bu tarayıcı ses kaydını desteklemiyor. Güncel Chrome, Edge veya Safari ile tekrar dene.");
    }
    state.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.stream.getTracks().forEach((track) => { track.enabled = true; });
    state.phase = "baseline-1";
    preparePrompt();
    showScreen("record");
  } catch (cause) {
    error.textContent = cause?.message?.includes("tarayıcı")
      ? cause.message
      : "Mikrofon izni alınamadı. Tarayıcıdaki kilit simgesinden mikrofonu açıp tekrar dene.";
    error.hidden = false;
  }
}

function promptForPhase() {
  if (state.phase === "baseline-1") {
    return {
      kicker: "KONUŞMA 1 / 2 · BAŞLANGIÇ",
      title: "Tell me about an engineering project you are proud of.",
      context: "Explain the goal, your responsibility, and one decision you made.",
      guide: "Goal → Your role → Decision → Result",
    };
  }
  if (state.phase === "baseline-2") {
    return {
      kicker: "KONUŞMA 2 / 2 · PROFESYONEL SENARYO",
      ...scenarioPrompts[state.answers.situation || "daily"],
      guide: "Direct answer → Reason → Example → Professional impact",
    };
  }
  const bottleneck = getPrimaryBottleneck();
  const method = bottleneckCopy[bottleneck];
  const base = scenarioPrompts[state.answers.situation || "daily"];
  if (state.phase === "challenge") {
    return {
      kicker: "SON GÖREV · BİR ADIM DAHA ZOR",
      title: `${base.title} Then explain one risk or trade-off.`,
      context: "Use the method, then add one realistic risk and the action you would take.",
      guide: `${method.guide} → Risk → Action`,
    };
  }
  return {
    kicker: state.phase === "retry" ? "YENİDEN DENE · GERİ BİLDİRİMİ UYGULA" : "İLK UYGULAMA",
    title: base.title,
    context: base.context,
    guide: method.guide,
  };
}

function preparePrompt() {
  const prompt = promptForPhase();
  $("[data-record-kicker]").textContent = prompt.kicker;
  $("[data-prompt-title]").textContent = prompt.title;
  $("[data-prompt-context]").textContent = prompt.context;
  $("[data-prompt-guide] strong").textContent = prompt.guide;
  resetRecorder();
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
}

function selectMimeType() {
  return ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function startRecording() {
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
  });
  state.recorder.start(250);
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
  if (state.recorder?.state === "recording") state.recorder.stop();
}

function handleRecordButton() {
  if (state.recorder?.state === "recording") {
    stopRecording();
  } else {
    startRecording();
  }
}

async function useRecording() {
  const error = $("[data-record-error]");
  if (!state.blob || state.blob.size < 1500 || 45 - state.remaining < 4) {
    error.textContent = "Analiz için en az birkaç saniye konuşman gerekiyor. Lütfen yeniden kaydet.";
    error.hidden = false;
    return;
  }
  const phase = state.phase;
  trackEvent("recording_submitted", phase, { duration_seconds: 45 - state.remaining });
  const blob = state.blob;
  const prompt = promptForPhase();
  state.pending[phase] = analyzeRecording(blob, phase, prompt);

  if (phase === "baseline-1") {
    state.phase = "baseline-2";
    preparePrompt();
    toast("İlk cevabın arka planda inceleniyor. Sen ikinci göreve devam edebilirsin.");
    return;
  }
  if (phase === "baseline-2") {
    showScreen("contact");
    return;
  }
  await waitForAnalysis(phase);
}

async function analyzeRecording(blob, phase, prompt) {
  if (state.isDemo) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return demoAnalysis(phase);
  }
  const config = window.STAR_SPEAKER_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey) throw new Error("Analiz servisi yapılandırılmamış.");
  const form = new FormData();
  form.append("audio", blob, `answer-${phase}.${blob.type.includes("mp4") ? "m4a" : "webm"}`);
  form.append("phase", phase);
  form.append("prompt", JSON.stringify(prompt));
  form.append("context", JSON.stringify(state.answers));
  if (state.retryFocus) form.append("retry_focus", state.retryFocus);
  const response = await fetch(`${config.url}/functions/v1/ai-speaking-coach`, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
    },
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
  error.hidden = true;
  retry.hidden = true;
  rotateInsights();
  animateAnalysisSteps();
  try {
    state.analyses[phase] = await state.pending[phase];
    stopAnalysisAnimations();
    if (phase === "practice" || phase === "retry") {
      renderFeedback(state.analyses[phase], phase);
      showScreen("feedback");
    } else if (phase === "challenge") {
      renderResult();
      showScreen("result");
      saveLead("completed").catch(() => {});
    } else {
      renderDiagnosis();
      showScreen("diagnosis");
    }
  } catch (cause) {
    stopAnalysisAnimations();
    status.textContent = "Analiz tamamlanamadı.";
    error.textContent = `${cause.message} Kaydın bu ekranda duruyor; yeniden kayıt yapman gerekmiyor.`;
    error.hidden = false;
    retry.hidden = false;
    retry.onclick = () => {
      state.pending[phase] = analyzeRecording(state.blob, phase, promptForPhase());
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
  steps.forEach((step, index) => {
    step.className = index === 0 ? "is-active" : "";
  });
  stepTimers.forEach(clearTimeout);
  stepTimers = steps.slice(1).map((step, index) => setTimeout(() => {
    steps[index].className = "is-complete";
    step.className = "is-active";
    $("[data-analysis-status]").textContent = [
      "Cevap yapın haritalanıyor…",
      "Netlik ve profesyonel etki karşılaştırılıyor…",
      "En değerli düzeltme seçiliyor…",
    ][index];
  }, 900 + index * 1200));
}
function stopAnalysisAnimations() {
  clearInterval(insightTimer);
  stepTimers.forEach(clearTimeout);
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
  submit.textContent = "Sonucun hazırlanıyor…";
  try {
    showScreen("analysis");
    rotateInsights();
    animateAnalysisSteps();
    const results = await Promise.all([state.pending["baseline-1"], state.pending["baseline-2"]]);
    state.analyses["baseline-1"] = results[0];
    state.analyses["baseline-2"] = results[1];
    stopAnalysisAnimations();
    await saveLead("diagnosed").catch(() => {});
    renderDiagnosis();
    showScreen("diagnosis");
  } catch (cause) {
    stopAnalysisAnimations();
    showScreen("contact");
    submit.disabled = false;
    submit.innerHTML = 'Kişisel Sonucumu Göster <span aria-hidden="true">→</span>';
    error.textContent = `${cause.message} Lütfen tekrar dene; kayıtların kaybolmadı.`;
    error.hidden = false;
  }
}

function averageMetrics(...items) {
  const keys = Object.keys(labels);
  return Object.fromEntries(keys.map((key) => [
    key,
    Math.round(items.reduce((total, item) => total + Number(item?.metrics?.[key] || 0), 0) / items.length),
  ]));
}

function getBaselineMetrics() {
  return averageMetrics(state.analyses["baseline-1"], state.analyses["baseline-2"]);
}

function getPrimaryBottleneck() {
  const metrics = getBaselineMetrics();
  return Object.entries(metrics).sort((a, b) => a[1] - b[1])[0]?.[0] || "structure";
}

function scoreFrom(metrics) {
  return Math.round(Object.values(metrics).reduce((total, value) => total + Number(value || 0), 0) / 4);
}

function renderDiagnosis() {
  const metrics = getBaselineMetrics();
  const bottleneck = getPrimaryBottleneck();
  const copy = bottleneckCopy[bottleneck];
  const score = scoreFrom(metrics);
  $("[data-overall-score]").textContent = score;
  $("[data-score-ring]").style.background =
    `radial-gradient(circle closest-side, #0d0c0a 82%, transparent 84% 100%), conic-gradient(var(--champagne) ${score}%, rgba(255,255,255,.1) 0)`;
  $("[data-bottleneck-title]").textContent = copy.title;
  $("[data-diagnosis-summary]").textContent = copy.summary;
  $("[data-evidence]").textContent =
    state.analyses["baseline-2"]?.evidence_tr || state.analyses["baseline-1"]?.evidence_tr || "Cevabının ana yönü dinleyici için yeterince erken görünür olmadı.";
  const metricsRoot = $("[data-metrics]");
  metricsRoot.replaceChildren();
  Object.entries(labels).forEach(([key, label]) => {
    const metric = document.createElement("div");
    metric.className = "sprint-metric";
    metric.innerHTML = `<span>${label}</span><strong>${metrics[key]}</strong>`;
    metricsRoot.append(metric);
  });
}

function renderMethod() {
  const copy = bottleneckCopy[getPrimaryBottleneck()];
  $("[data-method-title]").textContent = copy.method;
  $("[data-method-intro]").textContent = copy.intro;
  $("[data-method-example]").textContent = copy.example;
  const root = $("[data-method-steps]");
  root.replaceChildren();
  copy.steps.forEach(([title, detail]) => {
    const item = document.createElement("div");
    item.className = "sprint-method-step";
    item.innerHTML = `<div><strong>${title}</strong><span>${detail}</span></div>`;
    root.append(item);
  });
}

function renderFeedback(analysis, phase) {
  $("[data-feedback-strength]").textContent = analysis.strength_tr;
  $("[data-feedback-correction]").textContent = analysis.correction_tr;
  $("[data-feedback-opening]").textContent = analysis.improved_opening_tr;
  state.retryFocus = analysis.correction_tr;
  const button = $("[data-retry-with-feedback]");
  button.innerHTML = phase === "retry"
    ? 'Son Profesyonel Göreve Geç <span aria-hidden="true">→</span>'
    : 'Geri Bildirimle Tekrar Dene <span aria-hidden="true">→</span>';
  button.dataset.nextPhase = phase === "retry" ? "challenge" : "retry";
}

function renderResult() {
  const baselineMetrics = getBaselineMetrics();
  const finalMetrics = state.analyses.challenge.metrics;
  const before = scoreFrom(baselineMetrics);
  const after = scoreFrom(finalMetrics);
  const difference = after - before;
  const bottleneck = getPrimaryBottleneck();
  const copy = bottleneckCopy[bottleneck];
  $("[data-before-score]").textContent = before;
  $("[data-after-score]").textContent = after;
  $("[data-improvement-copy]").textContent = difference > 0
    ? `Bu kısa seans içinde performans göstergen ${difference} puan yükseldi. En önemli fark, öğrendiğin yöntemi cevabında görünür biçimde kullanman oldu.`
    : "Yöntemi ilk kez uyguladın. Puan değişmemiş olsa bile artık bir sonraki çalışmanda hangi davranışa odaklanacağını biliyorsun.";
  $("[data-result-bottleneck]").textContent = copy.title;
  $("[data-result-method]").textContent = copy.method;
  $("[data-result-next]").textContent = state.analyses.challenge.next_action_tr || copy.next;
  const qualification = qualifyLead();
  const message = [
    `Merhaba, ben ${state.contact.fullName}.`,
    "Mühendislik İngilizcesi Performans Seansı'nı tamamladım.",
    `Ana darboğazım: ${copy.title}.`,
    `İlk skor: ${before}/100, son skor: ${after}/100.`,
    `Profesyonel hedefim: ${state.answers.situation}; zamanlama: ${state.answers.deadline}.`,
    qualification === "priority"
      ? "Ücretsiz 15 dakikalık konuşma analizinde uygun saatleri görmek istiyorum."
      : "Ücretsiz konuşma analizi hakkında bilgi almak istiyorum.",
  ].join("\n");
  $("[data-whatsapp-cta]").href = `https://wa.me/905525247746?text=${encodeURIComponent(message)}`;
  $("[data-booking-fallback-whatsapp]").href = `https://wa.me/905525247746?text=${encodeURIComponent(
    "Merhaba, ücretsiz Konuşma Performansı Görüşmesi için uygun bir saat bulamadım. Yardımcı olabilir misiniz?",
  )}`;
}

function qualifyLead() {
  const urgent = ["14", "30", "ongoing"].includes(state.answers.deadline);
  const ready = ["start", "explore"].includes(state.answers.readiness);
  return urgent && ready ? "priority" : ready ? "nurture" : "low_intent";
}

async function saveLead(stage) {
  if (state.isDemo) return;
  const config = window.STAR_SPEAKER_SUPABASE_CONFIG || {};
  const payload = {
    action: "save_lead",
    stage,
    lead_id: state.leadId,
    contact: state.contact,
    context: state.answers,
    qualification: qualifyLead(),
    bottleneck: state.analyses["baseline-1"] ? getPrimaryBottleneck() : null,
    baseline_metrics: state.analyses["baseline-1"] ? getBaselineMetrics() : null,
    final_metrics: state.analyses.challenge?.metrics || null,
    transcripts: Object.fromEntries(
      Object.entries(state.analyses).map(([key, value]) => [key, value.transcript || ""]),
    ),
    session_id: state.sessionId,
    budget_range: state.budgetRange || null,
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
  if (response.ok && body.lead_id) state.leadId = body.lead_id;
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
  let activeDate = [...groups.keys()][0];
  const drawTimes = (date) => {
    activeDate = date;
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
        $("[data-booking-selection]").textContent =
          `${formatBookingDate(slot.appointment_start, true)} · Türkiye saati`;
        $("[data-booking-review]").hidden = false;
        trackEvent("booking_slot_selected", "booking", { booking_date: slot.booking_date });
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
      trackEvent("booking_date_selected", "booking", { booking_date: date });
    });
    datesRoot.append(button);
  });
  drawTimes(activeDate);
}

async function loadBookingSlots() {
  const bookingRoot = $("[data-booking]");
  bookingRoot.hidden = false;
  $("[data-booking-loading]").hidden = false;
  $("[data-booking-picker]").hidden = true;
  setBookingError();
  trackEvent("booking_viewed", "booking");
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
  const booking = state.booking;
  if (!booking) return;
  $("[data-booking-picker]").hidden = true;
  $("[data-booking-success]").hidden = false;
  $("[data-booking-confirmation]").textContent =
    `${formatBookingDate(booking.appointment_start, true)} · Türkiye saati`;
  const message = `Merhaba, ücretsiz Konuşma Performansı Görüşmemi ${formatBookingDate(
    booking.appointment_start,
  )} tarihinde saat ${formatBookingTime(booking.appointment_start)} için planladım. Randevumu onaylamak istiyorum.`;
  $("[data-booking-whatsapp]").href =
    `https://wa.me/905525247746?text=${encodeURIComponent(message)}`;
}

function storeBooking() {
  try {
    sessionStorage.setItem("performanceSprintBooking", JSON.stringify(state.booking));
  } catch {
    // The database remains authoritative when browser storage is unavailable.
  }
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
    // Ignore unavailable or malformed browser storage.
  }
}

async function confirmBooking() {
  if (!state.selectedBookingStart || state.bookingSubmitting) return;
  const button = $("[data-booking-confirm]");
  state.bookingSubmitting = true;
  button.disabled = true;
  button.textContent = "Randevun planlanıyor…";
  setBookingError();
  trackEvent("booking_submitted", "booking", { mode: state.bookingMode });
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
    const message = cause.message;
    trackEvent("booking_failed", "booking", { mode: state.bookingMode });
    await loadBookingSlots();
    setBookingError(message);
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
  trackEvent("booking_reschedule_started", "booking");
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
    try { sessionStorage.removeItem("performanceSprintBooking"); } catch { /* Storage is optional. */ }
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
  const base = {
    "baseline-1": [64, 47, 51, 58],
    "baseline-2": [61, 45, 48, 54],
    practice: [67, 60, 62, 59],
    retry: [72, 70, 68, 64],
    challenge: [76, 74, 72, 69],
  }[phase] || [60, 50, 55, 58];
  return {
    transcript: "Demo transcript for local experience testing.",
    metrics: { clarity: base[0], structure: base[1], pressure: base[2], interaction: base[3] },
    strength_tr: "Teknik kararının nedenini somut bir proje ayrıntısıyla destekledin.",
    correction_tr: phase.startsWith("baseline")
      ? "Ana cevabını ilk cümlede söyle; ayrıntıları daha sonra ekle."
      : "Son cümlede kararının profesyonel etkisini açıkça bağla.",
    evidence_tr: "Ana mesajın ikinci yarıda ortaya çıktı; dinleyici ilk cümlelerde cevabının yönünü tahmin etmek zorunda kaldı.",
    improved_opening_tr: "The main decision I made was to prioritize reliability, because downtime was our biggest operational risk.",
    next_action_tr: "Takip sorularında aynı yapıyı bozmadan daha kısa cevap vermek",
  };
}

function toast(message) {
  const root = $("[data-toast]");
  root.textContent = message;
  root.hidden = false;
  setTimeout(() => { root.hidden = true; }, 3600);
}

$("[data-start]").addEventListener("click", () => {
  renderQuestion();
  showScreen("setup");
});
$("[data-budget]").addEventListener("change", async (event) => {
  if (event.target.name !== "budget") return;
  state.budgetRange = event.target.value;
  const cta = $("[data-whatsapp-cta]");
  cta.classList.remove("is-disabled");
  cta.setAttribute("aria-disabled", "false");
  $("[data-budget-error]").hidden = true;
  trackEvent("budget_selected", "result", { budget_range: state.budgetRange });
  try {
    await saveLead("completed");
    await loadBookingSlots();
  } catch {
    $("[data-booking]").hidden = false;
    setBookingError("Randevu adımı hazırlanamadı. Lütfen bağlantını kontrol edip tekrar dene.");
  }
});
$("[data-setup-back]").addEventListener("click", () => {
  state.questionIndex = Math.max(0, state.questionIndex - 1);
  renderQuestion();
});
$("[data-enable-mic]").addEventListener("click", ensureMicrophone);
$("[data-record-button]").addEventListener("click", handleRecordButton);
$("[data-record-again]").addEventListener("click", resetRecorder);
$("[data-use-recording]").addEventListener("click", useRecording);
$("[data-contact-form]").addEventListener("submit", handleContactSubmit);
$("[data-start-training]").addEventListener("click", () => {
  renderMethod();
  showScreen("method");
});
$("[data-method-continue]").addEventListener("click", () => {
  state.phase = "practice";
  preparePrompt();
  showScreen("record");
});
$("[data-retry-with-feedback]").addEventListener("click", (event) => {
  state.phase = event.currentTarget.dataset.nextPhase || "retry";
  preparePrompt();
  showScreen("record");
});
$("[data-whatsapp-cta]").addEventListener("click", (event) => {
  if (!state.budgetRange) {
    event.preventDefault();
    $("[data-budget-error]").hidden = false;
    return;
  }
  trackEvent("whatsapp_clicked", "result", { budget_range: state.budgetRange });
  saveLead("whatsapp_clicked").catch(() => {});
});
$("[data-booking-confirm]").addEventListener("click", confirmBooking);
$("[data-booking-reschedule]").addEventListener("click", startReschedule);
$("[data-booking-cancel]").addEventListener("click", cancelBooking);
$("[data-booking-whatsapp]").addEventListener("click", () => {
  trackEvent("booking_whatsapp_clicked", "booking");
});
$("[data-booking-fallback-whatsapp]").addEventListener("click", () => {
  trackEvent("booking_no_slot_whatsapp_clicked", "booking");
});

window.addEventListener("beforeunload", () => {
  if (!state.isDemo && state.lastTrackedStage && state.lastTrackedStage !== "result") {
    trackEvent("session_abandoned", state.lastTrackedStage);
  }
  state.stream?.getTracks().forEach((track) => track.stop());
});

trackStage("intro");
restoreBooking();
