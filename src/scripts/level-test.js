(() => {
const placementForm = document.querySelector("#placement-test-form");
const quickQuestionsRoot = document.querySelector("#quick-questions");
const writtenPromptsRoot = document.querySelector("#written-prompts");
const voicePromptElement = document.querySelector("#voice-prompt");
const quickError = document.querySelector("#quick-check-error");
const writtenError = document.querySelector("#written-error");
const submitError = document.querySelector("#submit-error");
const testStatus = document.querySelector("#test-status");
const recorderStatus = document.querySelector("#recorder-status");
const recordingTimer = document.querySelector("#recording-timer");
const voicePanel = document.querySelector(".voice-panel");
const startRecordingButton = document.querySelector("#start-recording");
const stopRecordingButton = document.querySelector("#stop-recording");
const playRecordingButton = document.querySelector("#play-recording");
const rerecordButton = document.querySelector("#rerecord");
const recordingPlayback = document.querySelector("#recording-playback");
const submitTestButton = document.querySelector(".submit-test-button");

const attemptStorageKey = "starSpeakerLevelTestAttempt";
const maxRecordingSeconds = 120;

const translations = {
  en: {
    title: "Speaking Placement Test | Star Speaker",
    meta: "Take the Star Speaker speaking placement test for a manual speaking-level and Star Path recommendation within 1 hour.",
    ui: {
      "hero.eyebrow": "Speaking Placement Test",
      "hero.title": "Find Your<br>Star Speaker Level",
      "hero.subtitle": "A short speaking-focused placement test designed to understand your confidence, communication habits, and English goals.",
      "hero.trust.time": "Takes 5-8 minutes",
      "hero.trust.pressure": "No pressure",
      "hero.trust.review": "Reviewed within 1 hour",
      "basic.title": "Basic Information",
      "basic.helper": "Help us personalize your test and recommendation.",
      "quick.title": "Quick English Check",
      "quick.helper": "5 randomized multiple-choice questions from our comprehensive question bank.",
      "quick.note": "Questions are randomly selected.",
      "written.title": "Written Response",
      "written.helper": "Answer the following prompts in a few sentences.",
      "voice.title": "Voice Recording",
      "voice.helper": "Record yourself speaking on the topic below for 1-2 minutes.",
      "voice.note": "Voice is recommended for the most accurate speaking recommendation. If you are not ready, complete the written section carefully.",
      "voice.topic": "Topic",
      "voice.start": "Start Recording",
      "voice.stop": "Stop",
      "voice.play": "Play Recording",
      "voice.rerecord": "Re-record",
      "submit.title": "Submit Your Placement Test",
      "submit.helper": "Please review your answers before submitting.",
      "submit.button": "Submit Placement Test",
      "fields.fullName": "Full Name",
      "fields.whatsapp": "WhatsApp Number",
      "fields.currentLevel": "Current Level",
      "fields.goal": "Goal",
      "fields.consultationLanguage": "Preferred Consultation Language",
      "options.level.placeholder": "Select your level",
      "options.notSure": "Not sure",
      "options.goal.placeholder": "Select your goal",
      "options.goal.studyAbroad": "Study abroad",
      "options.goal.prep": "University prep school",
      "options.goal.work": "Work / career growth",
      "options.goal.confidence": "Speaking confidence",
      "options.goal.other": "Other",
      "options.language.placeholder": "Select an option",
      "options.language.turkish": "Turkish",
      "options.language.english": "English",
      "options.language.hybrid": "Hybrid",
      "options.language.turkishDescription": "Clear explanation and comfort",
      "options.language.englishDescription": "Show your level directly",
      "options.language.hybridDescription": "Turkish explanation + short English speaking check",
      "sidebar.assess.title": "How We Assess You",
      "sidebar.assess.step1Title": "Self-Assessment",
      "sidebar.assess.step1Text": "You share your goals, experience, and communication comfort.",
      "sidebar.assess.step2Title": "Quick English Check",
      "sidebar.assess.step2Text": "5 randomized questions help us understand your real-time language use.",
      "sidebar.assess.step3Title": "Written Response",
      "sidebar.assess.step3Text": "3 short prompts help us evaluate clarity, structure, and expression.",
      "sidebar.assess.step4Title": "Voice Sample",
      "sidebar.assess.step4Text": "A 1-2 minute recording helps us assess fluency, pronunciation, and confidence.",
      "sidebar.assess.reviewTitle": "Manual Review & Recommendation within 1 hour",
      "sidebar.assess.reviewText": "Our team reviews your responses and recommends your Star Speaker level and Star Path.",
      "sidebar.next.title": "What Happens Next?",
      "sidebar.next.text": "Your test will be reviewed within 1 hour. You will receive:",
      "sidebar.next.item1": "Your Star Speaker Level",
      "sidebar.next.item2": "Detailed feedback",
      "sidebar.next.item3": "Personalized Star Path recommendation",
      "sidebar.next.note": "You'll get a WhatsApp message as soon as your results are ready.",
    },
    placeholders: {
      "placeholders.fullName": "Enter your full name",
      textarea: "Type your answer here...",
    },
    categories: {
      grammar: "Grammar",
      vocabulary: "Vocabulary",
      natural: "Natural Response",
      meaning: "Meaning",
      correction: "Sentence Correction",
    },
    messages: {
      required: "This field is required.",
      basicFullName: "Please enter your full name.",
      basicWhatsapp: "Please enter your WhatsApp number.",
      basicLevel: "Please select your current level.",
      basicGoal: "Please select your goal.",
      basicLanguage: "Please select a preferred consultation language.",
      quick: "Please answer all 5 quick-check questions.",
      written: "Please complete all 3 written responses.",
      success: "Your placement test has been received. We will review your answers and get back to you within 1 hour.",
      successNext: "Your final level and Star Path recommendation will be sent by WhatsApp.",
      loading: "Submitting your placement test...",
      error: "We could not submit this right now. Please try again or contact us directly.",
      voiceUploadError: "We could not upload your voice recording. Please try again or submit without voice.",
      demo: "Supabase is not configured. Demo submit mode is active.",
      recorderUnsupported: "Voice recording is not available on this device. You can still submit your written responses.",
      recorderReady: "Voice recording is available on supported browsers. If it does not work, you can submit written responses.",
      recorderRequesting: "Requesting microphone permission...",
      recorderRecording: "Recording...",
      recorderSaved: "Recording saved. You can play it back or re-record.",
      recorderCleared: "Recording cleared. You can record again when ready.",
      recorderError: "Voice recording is not available on this device. You can still submit your written responses.",
      wordCount: "{count} / 200 words",
    },
  },
  tr: {
    title: "Konuşma Seviye Tespiti | Star Speaker",
    meta: "Star Speaker konuşma seviye tespit testi ile seviyeniz ve Star Path öneriniz manuel olarak 1 saat içinde değerlendirilir.",
    ui: {
      "hero.eyebrow": "Konuşma Seviye Tespiti",
      "hero.title": "Star Speaker<br>Seviyenizi Keşfedin",
      "hero.subtitle": "Özgüveninizi, iletişim alışkanlıklarınızı ve İngilizce hedeflerinizi anlamak için tasarlanmış kısa ve konuşma odaklı bir seviye tespit testi.",
      "hero.trust.time": "5-8 dakika sürer",
      "hero.trust.pressure": "Baskı yok",
      "hero.trust.review": "1 saat içinde değerlendirilir",
      "basic.title": "Temel Bilgiler",
      "basic.helper": "Testinizi ve önerinizi kişiselleştirmemize yardımcı olun.",
      "quick.title": "Kısa İngilizce Kontrolü",
      "quick.helper": "Kapsamlı soru bankamızdan rastgele seçilen 5 çoktan seçmeli soru.",
      "quick.note": "Sorular rastgele seçilir.",
      "written.title": "Yazılı Cevap",
      "written.helper": "Aşağıdaki soruları birkaç cümleyle cevaplayın.",
      "voice.title": "Ses Kaydı",
      "voice.helper": "Aşağıdaki konu hakkında 1-2 dakika konuşarak kendinizi kaydedin.",
      "voice.note": "Ses kaydı, en doğru konuşma önerisi için tavsiye edilir. Hazır değilseniz yazılı bölümü dikkatli tamamlayabilirsiniz.",
      "voice.topic": "Konu",
      "voice.start": "Kaydı Başlat",
      "voice.stop": "Durdur",
      "voice.play": "Kaydı Dinle",
      "voice.rerecord": "Yeniden Kaydet",
      "submit.title": "Seviye Testinizi Gönderin",
      "submit.helper": "Göndermeden önce cevaplarınızı kontrol edin.",
      "submit.button": "Seviye Testini Gönder",
      "fields.fullName": "Ad Soyad",
      "fields.whatsapp": "WhatsApp Numarası",
      "fields.currentLevel": "Mevcut Seviye",
      "fields.goal": "Hedef",
      "fields.consultationLanguage": "Görüşme Dili Tercihi",
      "options.level.placeholder": "Seviyenizi seçin",
      "options.notSure": "Emin değilim",
      "options.goal.placeholder": "Hedefinizi seçin",
      "options.goal.studyAbroad": "Yurt dışı eğitim",
      "options.goal.prep": "Üniversite hazırlık",
      "options.goal.work": "İş / kariyer gelişimi",
      "options.goal.confidence": "Konuşma özgüveni",
      "options.goal.other": "Diğer",
      "options.language.placeholder": "Bir seçenek seçin",
      "options.language.turkish": "Türkçe",
      "options.language.english": "İngilizce",
      "options.language.hybrid": "Hibrit",
      "sidebar.assess.title": "Sizi Nasıl Değerlendiriyoruz?",
      "sidebar.assess.step1Title": "Öz Değerlendirme",
      "sidebar.assess.step1Text": "Hedeflerinizi, deneyiminizi ve iletişim rahatlığınızı paylaşırsınız.",
      "sidebar.assess.step2Title": "Kısa İngilizce Kontrolü",
      "sidebar.assess.step2Text": "5 rastgele soru, gerçek zamanlı dil kullanımınızı anlamamıza yardımcı olur.",
      "sidebar.assess.step3Title": "Yazılı Cevap",
      "sidebar.assess.step3Text": "3 kısa soru; netlik, yapı ve ifade gücünüzü değerlendirmemize yardımcı olur.",
      "sidebar.assess.step4Title": "Ses Örneği",
      "sidebar.assess.step4Text": "1-2 dakikalık kayıt akıcılık, telaffuz ve özgüveninizi değerlendirmemize yardımcı olur.",
      "sidebar.assess.reviewTitle": "1 saat içinde manuel değerlendirme ve öneri",
      "sidebar.assess.reviewText": "Ekibimiz cevaplarınızı inceler ve Star Speaker seviyeniz ile Star Path önerinizi belirler.",
      "sidebar.next.title": "Sonra Ne Olur?",
      "sidebar.next.text": "Testiniz 1 saat içinde değerlendirilir. Şunları alırsınız:",
      "sidebar.next.item1": "Star Speaker seviyeniz",
      "sidebar.next.item2": "Detaylı geri bildirim",
      "sidebar.next.item3": "Kişisel Star Path önerisi",
      "sidebar.next.note": "Sonuçlarınız hazır olur olmaz WhatsApp üzerinden mesaj alırsınız.",
    },
    placeholders: {
      "placeholders.fullName": "Ad soyadınızı yazın",
      textarea: "Cevabınızı buraya yazın...",
    },
    categories: {
      grammar: "Grammar",
      vocabulary: "Vocabulary",
      natural: "Natural Response",
      meaning: "Meaning",
      correction: "Sentence Correction",
    },
    messages: {
      required: "Bu alan zorunludur.",
      basicFullName: "Lütfen adınızı ve soyadınızı yazın.",
      basicWhatsapp: "Lütfen WhatsApp numaranızı yazın.",
      basicLevel: "Lütfen mevcut seviyenizi seçin.",
      basicGoal: "Lütfen hedefinizi seçin.",
      basicLanguage: "Lütfen görüşme dili tercihinizi seçin.",
      quick: "Lütfen 5 kısa kontrol sorusunun tamamını cevaplayın.",
      written: "Lütfen 3 yazılı cevabın tamamını doldurun.",
      success: "Seviye testiniz alındı. Cevaplarınızı inceleyip 1 saat içinde sizinle iletişime geçeceğiz.",
      successNext: "Son seviyeniz ve Star Path öneriniz WhatsApp üzerinden gönderilecek.",
      loading: "Seviye testiniz gönderiliyor...",
      error: "Şu anda gönderim yapılamadı. Lütfen tekrar deneyin veya bizimle doğrudan iletişime geçin.",
      demo: "Supabase is not configured. Demo submit mode is active.",
      recorderUnsupported: "Bu cihazda ses kaydı kullanılamıyor. Yazılı cevaplarınızı göndererek devam edebilirsiniz.",
      recorderReady: "Ses kaydı desteklenen tarayıcılarda kullanılabilir. Çalışmazsa yazılı cevaplarınızı gönderebilirsiniz.",
      recorderRequesting: "Mikrofon izni isteniyor...",
      recorderRecording: "Kayıt yapılıyor...",
      recorderSaved: "Kayıt kaydedildi. Dinleyebilir veya yeniden kaydedebilirsiniz.",
      recorderCleared: "Kayıt temizlendi. Hazır olduğunuzda yeniden kaydedebilirsiniz.",
      recorderError: "Bu cihazda ses kaydı kullanılamıyor. Yazılı cevaplarınızı göndererek devam edebilirsiniz.",
      voiceUploadError: "Ses kaydınız yüklenemedi. Lütfen tekrar deneyin veya ses kaydı olmadan gönderin.",
      wordCount: "{count} / 200 kelime",
    },
  },
};

Object.assign(translations.tr.ui, {
  "options.language.turkishDescription": "Net açıklama ve rahatlık",
  "options.language.englishDescription": "Seviyenizi doğrudan gösterin",
  "options.language.hybridDescription": "Türkçe açıklama + kısa İngilizce konuşma kontrolü",
});

const questionBank = {
  grammar: [
    { id: "grammar-1", question: "She ___ to school every day.", options: ["goes", "go", "going", "gone"], correctAnswer: "goes" },
    { id: "grammar-2", question: "I have lived here ___ 2020.", options: ["since", "for", "from", "during"], correctAnswer: "since" },
    { id: "grammar-3", question: "If I had more time, I ___ more books.", options: ["read", "will read", "would read", "reading"], correctAnswer: "would read" },
    { id: "grammar-4", question: "They ___ dinner when I called.", options: ["have", "had", "were having", "are having"], correctAnswer: "were having" },
    { id: "grammar-5", question: "He is interested ___ learning English.", options: ["on", "in", "at", "for"], correctAnswer: "in" },
  ],
  vocabulary: [
    { id: "vocabulary-1", question: "What does \"improve\" mean?", options: ["make better", "make worse", "stop", "forget"], correctAnswer: "make better" },
    { id: "vocabulary-2", question: "Which word is closest to \"confident\"?", options: ["sure", "angry", "tired", "confused"], correctAnswer: "sure" },
    { id: "vocabulary-3", question: "\"Opportunity\" means:", options: ["a chance", "a mistake", "a problem", "a rule"], correctAnswer: "a chance" },
    { id: "vocabulary-4", question: "Which word means \"to explain again briefly\"?", options: ["summarize", "ignore", "complain", "translate"], correctAnswer: "summarize" },
    { id: "vocabulary-5", question: "Which word is closest to \"challenge\"?", options: ["difficulty", "celebration", "habit", "comfort"], correctAnswer: "difficulty" },
  ],
  natural: [
    { id: "natural-1", question: "Someone says: \"How was your weekend?\" Best answer:", options: ["It was relaxing", "Yes I am", "At 5 o'clock", "Because I like it"], correctAnswer: "It was relaxing" },
    { id: "natural-2", question: "Someone asks: \"Could you repeat that, please?\" Best answer:", options: ["Sure, I'll say it again", "No I am not", "Yesterday", "I like coffee"], correctAnswer: "Sure, I'll say it again" },
    { id: "natural-3", question: "Someone says: \"Nice to meet you.\" Best answer:", options: ["Nice to meet you too", "I am 20", "It is expensive", "I went there"], correctAnswer: "Nice to meet you too" },
    { id: "natural-4", question: "Someone asks: \"What do you do?\" Best answer:", options: ["I'm a student", "I'm fine thanks", "It is blue", "Tomorrow"], correctAnswer: "I'm a student" },
    { id: "natural-5", question: "Someone says: \"Good luck with your exam.\" Best answer:", options: ["Thank you, I hope it goes well", "I am from Turkey", "It is raining", "At home"], correctAnswer: "Thank you, I hope it goes well" },
  ],
  meaning: [
    { id: "meaning-1", question: "\"I used to play tennis when I was younger.\" This means:", options: ["I played tennis in the past", "I play tennis every day now", "I will play tomorrow", "I hate tennis"], correctAnswer: "I played tennis in the past" },
    { id: "meaning-2", question: "\"She is looking forward to the trip.\" This means:", options: ["She is excited about it", "She canceled it", "She forgot it", "She dislikes it"], correctAnswer: "She is excited about it" },
    { id: "meaning-3", question: "\"He rarely eats fast food.\" This means:", options: ["He does not eat it often", "He always eats it", "He never eats anything", "He cooks fast"], correctAnswer: "He does not eat it often" },
    { id: "meaning-4", question: "\"I ran out of time.\" This means:", options: ["I had no time left", "I ran outside", "I arrived early", "I saved time"], correctAnswer: "I had no time left" },
    { id: "meaning-5", question: "\"The meeting was postponed.\" This means:", options: ["It was delayed", "It was finished", "It was canceled forever", "It started early"], correctAnswer: "It was delayed" },
  ],
  correction: [
    { id: "correction-1", question: "Choose the correct sentence:", options: ["He doesn't like coffee", "He don't like coffee", "He not like coffee", "He isn't like coffee"], correctAnswer: "He doesn't like coffee" },
    { id: "correction-2", question: "Choose the correct sentence:", options: ["I went to the cinema yesterday", "I go to cinema yesterday", "I have went yesterday", "I did went yesterday"], correctAnswer: "I went to the cinema yesterday" },
    { id: "correction-3", question: "Choose the correct sentence:", options: ["She is better than me at speaking", "She is more better than me", "She better me", "She is best than me"], correctAnswer: "She is better than me at speaking" },
    { id: "correction-4", question: "Choose the correct sentence:", options: ["I want to improve my English", "I want improve my English", "I want improving English", "I want to improving my English"], correctAnswer: "I want to improve my English" },
    { id: "correction-5", question: "Choose the correct sentence:", options: ["Can you help me with this?", "Can you help me this?", "Can you to help me?", "Do you can help me?"], correctAnswer: "Can you help me with this?" },
  ],
};

const writtenPromptBank = [
  "Why do you want to improve your English speaking?",
  "What usually happens when you try to speak English?",
  "Describe one situation where you need to speak English confidently.",
  "What is your biggest fear when speaking English?",
  "How would better English change your life?",
  "Tell us about your experience learning English so far.",
  "What kind of conversations are difficult for you?",
  "Why do you want to join Star Speaker?",
  "What is one speaking goal you want to achieve in the next 60 days?",
  "Describe a time when you needed English but felt blocked.",
];

const voicePromptBank = [
  "Tell us about your English goal and why speaking matters to you.",
  "Describe your biggest speaking problem in English.",
  "Talk about a situation where you want to use English confidently.",
  "Explain why you want to study or work internationally.",
  "Tell us what happens when you try to speak English.",
  "Describe your ideal future after improving your English.",
  "Talk about a topic you enjoy and explain why.",
  "Tell us about your daily routine and your English goals.",
  "Explain what confidence means to you.",
  "Describe the kind of English speaker you want to become.",
];

let currentLanguage = window.starSpeakerI18n?.getLanguage?.() || "en";
let mediaRecorder = null;
let mediaStream = null;
let recordingChunks = [];
let recordingBlob = null;
let recordingUrl = "";
let recordingSeconds = 0;
let recordingInterval = null;
let recordingFinalizePromise = null;
let resolveRecordingFinalize = null;

function getCopy() {
  return translations[currentLanguage] || translations.en;
}

function sampleOne(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function sampleMany(items, count) {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getAttempt() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(attemptStorageKey) || "null");
    if (saved?.questions?.length === 5 && saved?.writtenPrompts?.length === 3 && saved?.voicePrompt) {
      return saved;
    }
  } catch (error) {
    sessionStorage.removeItem(attemptStorageKey);
  }

  const categories = ["grammar", "vocabulary", "natural", "meaning", "correction"];
  const attempt = {
    questions: categories.map((category) => ({ ...sampleOne(questionBank[category]), category })),
    writtenPrompts: sampleMany(writtenPromptBank, 3),
    voicePrompt: sampleOne(voicePromptBank),
  };
  sessionStorage.setItem(attemptStorageKey, JSON.stringify(attempt));
  return attempt;
}

const attempt = getAttempt();

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function countWords(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function setError(field, message) {
  const wrapper = field?.closest(".level-field, .written-card, .question-card");
  const describedBy = field?.getAttribute("aria-describedby");
  const error = describedBy ? document.getElementById(describedBy) : null;
  wrapper?.classList.toggle("has-error", Boolean(message));
  field?.setAttribute("aria-invalid", message ? "true" : "false");
  if (error) error.textContent = message;
}

function setPanelError(element, message) {
  if (element) element.textContent = message || "";
}

function applyLevelLanguage() {
  const copy = getCopy();
  document.title = copy.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", copy.meta);

  document.querySelectorAll("[data-level-i18n]").forEach((element) => {
    const key = element.getAttribute("data-level-i18n");
    if (copy.ui[key]) element.textContent = copy.ui[key];
  });

  document.querySelectorAll("[data-level-description]").forEach((element) => {
    const key = element.getAttribute("data-level-description");
    if (copy.ui[key]) element.dataset.description = copy.ui[key];
  });

  document.querySelectorAll("[data-level-i18n-html]").forEach((element) => {
    const key = element.getAttribute("data-level-i18n-html");
    if (copy.ui[key]) element.innerHTML = copy.ui[key];
  });

  document.querySelectorAll("[data-level-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-level-placeholder");
    if (copy.placeholders[key]) element.setAttribute("placeholder", copy.placeholders[key]);
  });

  document.querySelectorAll(".written-card textarea").forEach((textarea) => {
    textarea.setAttribute("placeholder", copy.placeholders.textarea);
    updateCounter(textarea);
  });

  renderQuestions();
  renderWrittenPrompts();
  renderVoicePrompt();
  updateRecorderStatus(getRecorderStatusMessage(), recorderStatus?.classList.contains("is-error"));
  window.starSpeakerPremiumSelects?.refreshAll?.();

  if (testStatus?.classList.contains("is-visible")) {
    if (testStatus.classList.contains("is-error")) {
      testStatus.innerHTML = escapeHtml(copy.messages.error);
    } else if (testStatus.classList.contains("is-loading")) {
      testStatus.innerHTML = escapeHtml(copy.messages.loading);
    } else {
      testStatus.innerHTML = `${escapeHtml(copy.messages.success)}<br>${escapeHtml(copy.messages.successNext)}`;
    }
  }
}

function renderQuestions() {
  const copy = getCopy();
  if (!quickQuestionsRoot) return;
  const selectedAnswers = {};
  quickQuestionsRoot.querySelectorAll("input[type='radio']:checked").forEach((input) => {
    selectedAnswers[input.name] = input.value;
  });

  quickQuestionsRoot.innerHTML = attempt.questions.map((question, index) => {
    const groupName = `quick-${question.id}`;
    return `
      <article class="question-card">
        <fieldset aria-describedby="${groupName}-error">
          <legend>
            <span class="question-topline">
              <span class="question-index">${index + 1}</span>
              <span>${escapeHtml(copy.categories[question.category] || question.category)}</span>
            </span>
            <span class="question-text">${escapeHtml(question.question)}</span>
          </legend>
          <div class="answer-list">
            ${question.options.map((option, optionIndex) => `
              <label class="answer-option">
                <input type="radio" name="${groupName}" value="${escapeHtml(option)}" data-question-id="${question.id}" aria-describedby="${groupName}-error"${selectedAnswers[groupName] === option ? " checked" : ""}>
                <span class="answer-letter">${String.fromCharCode(65 + optionIndex)}</span>
                <span>${escapeHtml(option)}</span>
              </label>
            `).join("")}
          </div>
          <p class="field-error" id="${groupName}-error"></p>
        </fieldset>
      </article>
    `;
  }).join("");

  quickQuestionsRoot.querySelectorAll("input[type='radio']").forEach((input) => {
    input.addEventListener("change", () => {
      setPanelError(quickError, "");
      input.closest(".question-card")?.classList.remove("has-error");
    });
  });
}

function renderWrittenPrompts() {
  const copy = getCopy();
  if (!writtenPromptsRoot) return;

  const existingValues = Array.from(writtenPromptsRoot.querySelectorAll("textarea")).map((textarea) => textarea.value);
  writtenPromptsRoot.innerHTML = attempt.writtenPrompts.map((prompt, index) => `
    <article class="written-card">
      <label for="written-${index}">
        <span>${index + 1}</span>
        <span>${escapeHtml(prompt)}</span>
      </label>
      <textarea id="written-${index}" name="written-${index}" maxlength="1400" required aria-describedby="written-${index}-error" placeholder="${escapeHtml(copy.placeholders.textarea)}">${escapeHtml(existingValues[index] || "")}</textarea>
      <p class="counter" data-counter-for="written-${index}">${copy.messages.wordCount.replace("{count}", countWords(existingValues[index] || ""))}</p>
      <p class="field-error" id="written-${index}-error"></p>
    </article>
  `).join("");

  writtenPromptsRoot.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      updateCounter(textarea);
      setError(textarea, "");
      setPanelError(writtenError, "");
    });
  });
}

function updateCounter(textarea) {
  const counter = document.querySelector(`[data-counter-for="${textarea.id}"]`);
  if (!counter) return;
  counter.textContent = getCopy().messages.wordCount.replace("{count}", countWords(textarea.value));
}

function renderVoicePrompt() {
  if (voicePromptElement) {
    voicePromptElement.textContent = attempt.voicePrompt;
  }
}

function getRecorderStatusMessage() {
  if (!("mediaDevices" in navigator) || typeof MediaRecorder === "undefined") {
    return getCopy().messages.recorderUnsupported;
  }
  if (recordingBlob) return getCopy().messages.recorderSaved;
  return getCopy().messages.recorderReady;
}

function updateRecorderStatus(message, isError = false, isSuccess = false) {
  if (!recorderStatus) return;
  recorderStatus.textContent = message || "";
  recorderStatus.classList.toggle("is-error", Boolean(isError));
  recorderStatus.classList.toggle("is-success", Boolean(isSuccess));
}

function updateRecorderButtons(state) {
  if (startRecordingButton) startRecordingButton.disabled = state === "requesting" || state === "recording";
  if (stopRecordingButton) stopRecordingButton.disabled = state !== "recording";
  if (playRecordingButton) playRecordingButton.disabled = !recordingBlob || state === "recording";
  if (rerecordButton) rerecordButton.disabled = !recordingBlob || state === "requesting" || state === "recording";
  voicePanel?.classList.toggle("is-recording", state === "recording");
}

function resolveRecordingFinalization() {
  if (resolveRecordingFinalize) {
    resolveRecordingFinalize(recordingBlob);
  }
  recordingFinalizePromise = null;
  resolveRecordingFinalize = null;
}

function stopTracks() {
  mediaStream?.getTracks().forEach((track) => track.stop());
  mediaStream = null;
}

function clearRecording() {
  if (recordingUrl) URL.revokeObjectURL(recordingUrl);
  recordingUrl = "";
  recordingBlob = null;
  recordingChunks = [];
  recordingSeconds = 0;
  recordingFinalizePromise = null;
  resolveRecordingFinalize = null;
  if (recordingPlayback) {
    recordingPlayback.hidden = true;
    recordingPlayback.removeAttribute("src");
  }
  if (recordingTimer) recordingTimer.textContent = "00:00 / 02:00";
}

function finishRecording() {
  clearInterval(recordingInterval);
  recordingInterval = null;
  stopTracks();
  voicePanel?.classList.remove("is-recording");
  updateRecorderButtons("recorded");
}

async function startRecording() {
  const copy = getCopy();
  if (!("mediaDevices" in navigator) || typeof MediaRecorder === "undefined") {
    updateRecorderStatus(copy.messages.recorderUnsupported, true);
    updateRecorderButtons("idle");
    return;
  }

  try {
    clearRecording();
    updateRecorderButtons("requesting");
    updateRecorderStatus(copy.messages.recorderRequesting);
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(mediaStream);
    recordingChunks = [];
    recordingFinalizePromise = new Promise((resolve) => {
      resolveRecordingFinalize = resolve;
    });

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) recordingChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      recordingBlob = new Blob(recordingChunks, { type: mediaRecorder.mimeType || "audio/webm" });
      recordingUrl = URL.createObjectURL(recordingBlob);
      if (recordingPlayback) {
        recordingPlayback.src = recordingUrl;
        recordingPlayback.hidden = false;
      }
      finishRecording();
      updateRecorderStatus(getCopy().messages.recorderSaved, false, true);
      resolveRecordingFinalization();
    });

    mediaRecorder.start();
    updateRecorderButtons("recording");
    updateRecorderStatus(copy.messages.recorderRecording);
    recordingInterval = window.setInterval(() => {
      recordingSeconds += 1;
      if (recordingTimer) {
        recordingTimer.textContent = `${formatTime(recordingSeconds)} / 02:00`;
      }
      if (recordingSeconds >= maxRecordingSeconds) {
        stopRecording();
      }
    }, 1000);
  } catch (error) {
    console.warn("Voice recording failed:", error);
    finishRecording();
    resolveRecordingFinalization();
    updateRecorderStatus(copy.messages.recorderError, true);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  } else {
    finishRecording();
  }
}

function playRecording() {
  if (recordingPlayback?.src) {
    recordingPlayback.hidden = false;
    recordingPlayback.play().catch(() => updateRecorderStatus(getCopy().messages.recorderError, true));
  }
}

function rerecord() {
  if (mediaRecorder?.state === "recording") stopRecording();
  clearRecording();
  updateRecorderButtons("idle");
  updateRecorderStatus(getCopy().messages.recorderCleared);
}

async function getReadyRecordingBlob() {
  if (mediaRecorder?.state === "recording") {
    stopRecording();
  }

  if (recordingFinalizePromise) {
    await recordingFinalizePromise;
  }

  return recordingBlob?.size ? recordingBlob : null;
}

function validateBasicFields() {
  const fields = [
    ["#test-full-name", "basicFullName"],
    ["#test-whatsapp", "basicWhatsapp"],
    ["#test-current-level", "basicLevel"],
    ["#test-goal", "basicGoal"],
    ["#test-consultation-language", "basicLanguage"],
  ];

  const invalid = [];
  fields.forEach(([selector, messageKey]) => {
    const field = document.querySelector(selector);
    const message = field?.value.trim() ? "" : getCopy().messages[messageKey];
    setError(field, message);
    if (message) invalid.push(field);
  });
  return invalid;
}

function validateQuickQuestions() {
  const invalidCards = [];
  attempt.questions.forEach((question) => {
    const groupName = `quick-${question.id}`;
    const checked = placementForm?.querySelector(`input[name="${groupName}"]:checked`);
    const card = placementForm?.querySelector(`input[name="${groupName}"]`)?.closest(".question-card");
    card?.classList.toggle("has-error", !checked);
    if (!checked) invalidCards.push(card);
  });
  setPanelError(quickError, invalidCards.length ? getCopy().messages.quick : "");
  return invalidCards;
}

function validateWrittenResponses() {
  const invalid = [];
  writtenPromptsRoot?.querySelectorAll("textarea").forEach((textarea) => {
    const message = textarea.value.trim() ? "" : getCopy().messages.required;
    setError(textarea, message);
    if (message) invalid.push(textarea);
  });
  setPanelError(writtenError, invalid.length ? getCopy().messages.written : "");
  return invalid;
}

function getQuickAnswers() {
  return attempt.questions.map((question) => {
    const selected = placementForm?.querySelector(`input[name="quick-${question.id}"]:checked`)?.value || "";
    return {
      id: question.id,
      category: question.category,
      question: question.question,
      selectedAnswer: selected,
      correctAnswer: question.correctAnswer,
      isCorrect: selected === question.correctAnswer,
    };
  });
}

function setTestStatus(message, type = "success") {
  if (!testStatus) return;
  testStatus.innerHTML = message;
  testStatus.classList.remove("is-error", "is-loading");
  testStatus.classList.add("is-visible");
  if (type === "error") testStatus.classList.add("is-error");
  if (type === "loading") testStatus.classList.add("is-loading");
}

async function submitPlacementTest(event) {
  event.preventDefault();
  setPanelError(submitError, "");
  testStatus?.classList.remove("is-visible", "is-error", "is-loading");

  const invalid = [
    ...validateBasicFields(),
    ...validateQuickQuestions(),
    ...validateWrittenResponses(),
  ].filter(Boolean);

  if (invalid.length) {
    invalid[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
    invalid[0]?.focus?.({ preventScroll: true });
    return;
  }

  const answers = getQuickAnswers();
  const fullName = document.querySelector("#test-full-name")?.value.trim();
  const copy = getCopy();
  const submission = {
    full_name: fullName,
    whatsapp_number: document.querySelector("#test-whatsapp")?.value.trim(),
    current_level: document.querySelector("#test-current-level")?.value,
    goal: document.querySelector("#test-goal")?.value,
    preferred_consultation_language: document.querySelector("#test-consultation-language")?.value,
    quick_check_questions: attempt.questions.map(({ correctAnswer, ...question }) => question),
    quick_check_answers: answers,
    quick_check_score: answers.filter((answer) => answer.isCorrect).length,
    written_prompts: attempt.writtenPrompts,
    written_responses: Array.from(writtenPromptsRoot?.querySelectorAll("textarea") || []).map((textarea) => textarea.value.trim()),
    voice_prompt: attempt.voicePrompt,
    voice_recording_path: null,
    voice_recording_url: null,
    source: "level_test_page",
    review_status: "pending",
  };

  try {
    submitTestButton?.setAttribute("disabled", "true");
    setTestStatus(escapeHtml(copy.messages.loading), "loading");
    if (!window.starSpeakerSupabase?.isConfigured?.()) {
      throw new Error("Supabase is not configured.");
    }

    const readyRecordingBlob = await getReadyRecordingBlob();

    if (readyRecordingBlob) {
      try {
        const upload = await window.starSpeakerSupabase.uploadLevelTestRecording(readyRecordingBlob, fullName);
        if (!upload?.path) {
          throw new Error("Voice upload did not return a storage path.");
        }
        submission.voice_recording_path = upload.path;
        submission.voice_recording_url = upload.publicUrl || null;
      } catch (uploadError) {
        uploadError.isVoiceUploadError = true;
        console.error("Voice recording upload failed:", uploadError);
        throw uploadError;
      }
    }

    await window.starSpeakerSupabase.insertLevelTestSubmission(submission);
    localStorage.setItem("starSpeakerLatestLevelTestSubmission", JSON.stringify({
      ...submission,
      savedAt: new Date().toISOString(),
    }));
    setTestStatus(`${escapeHtml(copy.messages.success)}<br>${escapeHtml(copy.messages.successNext)}`, "success");
  } catch (error) {
    console.warn("Level test submission failed:", error);
    localStorage.setItem("starSpeakerLatestLevelTestSubmission", JSON.stringify({
      ...submission,
      savedAt: new Date().toISOString(),
      submitError: error?.message || String(error),
    }));
    setTestStatus(escapeHtml(error?.isVoiceUploadError ? copy.messages.voiceUploadError : copy.messages.error), "error");
  } finally {
    submitTestButton?.removeAttribute("disabled");
  }
}

function initRecorder() {
  document.querySelectorAll(".wave-bars span").forEach((bar, index) => {
    bar.style.setProperty("--i", index + 1);
  });
  updateRecorderButtons("idle");
  updateRecorderStatus(getRecorderStatusMessage(), !("mediaDevices" in navigator) || typeof MediaRecorder === "undefined");
  startRecordingButton?.addEventListener("click", startRecording);
  stopRecordingButton?.addEventListener("click", stopRecording);
  playRecordingButton?.addEventListener("click", playRecording);
  rerecordButton?.addEventListener("click", rerecord);
}

function init() {
  const consultationLanguageField = document.querySelector("#test-consultation-language");
  if (consultationLanguageField && !consultationLanguageField.value) {
    consultationLanguageField.value = "hybrid";
  }

  renderQuestions();
  renderWrittenPrompts();
  renderVoicePrompt();
  applyLevelLanguage();
  initRecorder();

  placementForm?.addEventListener("submit", submitPlacementTest);
  placementForm?.querySelectorAll("input, select").forEach((field) => {
    field.addEventListener("input", () => setError(field, ""));
    field.addEventListener("change", () => setError(field, ""));
  });
}

window.addEventListener("starSpeakerLanguageChange", (event) => {
  currentLanguage = event.detail?.language === "tr" ? "tr" : "en";
  applyLevelLanguage();
});

init();
})();
