import { LEGACY_QUESTION_IDS, QUESTIONS, QUESTION_BANK_VERSION } from "./performance-question-bank.js";

export const EXPERIENCE_VERSION = "career_english_v3";
export { QUESTION_BANK_VERSION };

export const SITUATIONS = ["meeting", "interview", "presentation", "other"];
export const REPORTED_LEVELS = ["a2_1", "a2_2", "b1_1", "b1_2", "b2_1", "b2_2", "c1_1", "unsure"];
export const RECORDING_DURATIONS = [45, 60, 90, 120];
export const FEELINGS = ["fantastic", "confident", "calm", "nervous", "tired"];

export const LEVEL_LABELS = {
  a2_1: "A2.1", a2_2: "A2.2", b1_1: "B1.1", b1_2: "B1.2",
  b2_1: "B2.1", b2_2: "B2.2", c1_1: "C1.1", unsure: "Emin değilim",
};

export const LEVEL_DEFAULT_DURATIONS = {
  a2_1: 45, a2_2: 45, b1_1: 60, b1_2: 60,
  b2_1: 90, b2_2: 90, c1_1: 120, unsure: 60,
};

// "Unsure" intentionally uses the neutral middle-difficulty B1.1 expectation.
export const NORMALIZED_LEVELS = {
  a2_1: "a2_1", a2_2: "a2_2", b1_1: "b1_1", b1_2: "b1_2",
  b2_1: "b2_1", b2_2: "b2_2", c1_1: "c1_1", unsure: "b1_1",
};

const question = (id, title, translationTr, context, guide, demand) => Object.freeze({
  id, title, translationTr, context, guide, demand,
});

export const LEGACY_QUESTION_BANK = Object.freeze({
  meeting: Object.freeze({
    a2_1: question("meeting-a2-1-helpful-routine", "What is one routine that helps you have a good day?", "İyi bir gün geçirmeni sağlayan bir alışkanlık nedir?", "Describe the routine and give one simple reason.", "Routine → Reason → Example", "Describe a familiar routine with one reason."),
    a2_2: question("meeting-a2-2-useful-app", "Tell us about an app or tool you use often. How does it help you?", "Sık kullandığın bir uygulama veya araçtan bahset. Sana nasıl yardımcı oluyor?", "Explain what you use and one practical benefit.", "Tool → How you use it → Benefit", "Describe a familiar tool and its result."),
    b1_1: question("meeting-b1-1-time-organization", "What helps you organize your time when you have a busy week?", "Yoğun bir haftada zamanını düzenlemene ne yardımcı olur?", "Share your approach, a reason, and a real example.", "Approach → Reason → Example", "Explain an approach with supporting experience."),
    b1_2: question("meeting-b1-2-home-or-office", "Do you work better at home or in an office? Explain your choice.", "Evde mi yoksa ofiste mi daha iyi çalışırsın? Seçimini açıkla.", "Compare both settings and support your preference.", "Choice → Advantages → Disadvantage → Example", "Compare familiar options and consequences."),
    b2_1: question("meeting-b2-1-useful-meetings", "What makes a meeting useful rather than a waste of time?", "Bir toplantıyı zaman kaybı yerine faydalı yapan nedir?", "Give a clear position, causes, and a practical example.", "Position → Reasons → Example → Recommendation", "Support a position and explain cause and effect."),
    b2_2: question("meeting-b2-2-digital-communication", "When does digital communication improve teamwork, and when can it make teamwork harder?", "Dijital iletişim ekip çalışmasını ne zaman geliştirir, ne zaman zorlaştırır?", "Consider benefits, limitations, and conditions.", "Benefit → Limitation → Conditions → Judgment", "Balance multiple perspectives with qualification."),
    c1_1: question("meeting-c1-1-productive-disagreement", "How can disagreement lead to better decisions, and when does it become unproductive?", "Fikir ayrılığı daha iyi kararlara nasıl yol açabilir ve ne zaman verimsizleşir?", "Analyze assumptions, boundaries, and implications using relatable examples.", "Principle → Boundary → Example → Implication", "Evaluate nuance and implications."),
    unsure: question("meeting-unsure-practical-change", "What is one small change that would make your day easier?", "Gününü kolaylaştıracak küçük bir değişiklik nedir?", "Give one practical change, a reason, and an example.", "Change → Reason → Example", "Neutral B1.1: explain a familiar idea."),
  }),
  interview: Object.freeze({
    a2_1: question("interview-a2-1-enjoyable-activity", "What is an activity you enjoy, and why do you like it?", "Keyif aldığın bir etkinlik nedir ve neden hoşuna gidiyor?", "Name the activity and give one example.", "Activity → Reason → Example", "Describe a preference simply."),
    a2_2: question("interview-a2-2-learned-skill", "Tell me about a useful skill you learned recently.", "Yakın zamanda öğrendiğin faydalı bir beceriden bahset.", "Say what you learned, how, and how it helps.", "Skill → How you learned → Result", "Describe a recent experience and result."),
    b1_1: question("interview-b1-1-recent-problem", "Tell me about a recent problem you solved. What did you do?", "Yakın zamanda çözdüğün bir problemden bahset. Ne yaptın?", "Describe the problem, your response, and the result.", "Problem → Action → Result", "Narrate a problem and response."),
    b1_2: question("interview-b1-2-difficult-choice", "Describe a difficult choice you made. What helped you decide?", "Verdiğin zor bir kararı anlat. Karar vermene ne yardımcı oldu?", "Explain the options, decision, and consequence.", "Options → Decision → Reason → Consequence", "Organize a decision with comparison."),
    b2_1: question("interview-b2-1-learning-goal", "What is an important skill you want to develop, and what is the best way to develop it?", "Geliştirmek istediğin önemli bir beceri nedir ve bunu geliştirmenin en iyi yolu nedir?", "Make a case, discuss trade-offs, and use a relevant example.", "Goal → Approach → Trade-off → Example", "Defend a practical development strategy."),
    b2_2: question("interview-b2-2-changed-opinion", "Tell me about an opinion you changed after learning something new. What changed your mind?", "Yeni bir şey öğrendikten sonra değiştirdiğin bir görüşü anlat. Fikrini ne değiştirdi?", "Explain the earlier view, new evidence, and nuanced conclusion.", "Earlier view → Evidence → Change → Qualification", "Explain a nuanced change of mind."),
    c1_1: question("interview-c1-1-success-definition", "How should people define career success when their priorities change over time?", "İnsanlar öncelikleri zamanla değişirken kariyer başarısını nasıl tanımlamalı?", "Challenge a simple definition and evaluate changing implications.", "Definition → Assumption → Change → Implication", "Analyze an abstract but relatable career idea."),
    unsure: question("interview-unsure-proud-moment", "Tell me about something you did recently that made you feel proud.", "Yakın zamanda yaptığın ve gurur duyduğun bir şeyi anlat.", "Describe what happened, your role, and why it mattered.", "Situation → Your action → Why it mattered", "Neutral B1.1: narrate a familiar experience."),
  }),
  presentation: Object.freeze({
    a2_1: question("presentation-a2-1-favorite-place", "Describe a place you like spending time in.", "Vakit geçirmekten hoşlandığın bir yeri anlat.", "Say where it is, what it is like, and why you like it.", "Place → Description → Reason", "Give a concrete personal description."),
    a2_2: question("presentation-a2-2-recommend-experience", "Recommend an enjoyable experience to a friend. Why should they try it?", "Bir arkadaşına keyifli bir deneyim öner. Neden denemeli?", "Describe it, give a reason, and mention a result.", "Experience → Reason → Expected result", "Make a simple recommendation."),
    b1_1: question("presentation-b1-1-helpful-habit", "Explain a habit that has made your life easier.", "Hayatını kolaylaştıran bir alışkanlığı açıkla.", "Explain the habit, why it works, and an example.", "Habit → How it works → Example", "Explain a familiar process and benefit."),
    b1_2: question("presentation-b1-2-recent-change", "Describe a change you made in your life. What were the advantages and disadvantages?", "Hayatında yaptığın bir değişikliği anlat. Avantajları ve dezavantajları nelerdi?", "Organize the change, both sides, and its outcome.", "Change → Advantages → Disadvantages → Outcome", "Present a balanced personal comparison."),
    b2_1: question("presentation-b2-1-technology-boundaries", "What boundaries help people use technology in a healthy and productive way?", "İnsanların teknolojiyi sağlıklı ve verimli kullanmasına hangi sınırlar yardımcı olur?", "Explain trade-offs, causes, and practical examples.", "Position → Trade-offs → Example → Recommendation", "Develop a supported, practical position."),
    b2_2: question("presentation-b2-2-place-to-live", "What makes a place attractive to live in, and which factors are often overlooked?", "Bir yeri yaşamak için çekici yapan nedir ve hangi etkenler sıkça gözden kaçar?", "Consider perspectives, qualify priorities, and reach a judgment.", "Main factors → Overlooked factor → Perspective → Judgment", "Build a nuanced multi-factor argument."),
    c1_1: question("presentation-c1-1-convenience-cost", "Modern life values convenience. What do we gain from it, and what might we lose?", "Modern yaşam kolaylığa değer veriyor. Bundan ne kazanıyor, ne kaybediyor olabiliriz?", "Analyze competing values, assumptions, and wider implications.", "Claim → Benefits → Hidden costs → Implications", "Evaluate a sophisticated but relatable trade-off."),
    unsure: question("presentation-unsure-useful-recommendation", "Recommend something useful that has helped you recently.", "Yakın zamanda sana yardımcı olan faydalı bir şeyi öner.", "Explain what it is, how it helped, and who may benefit.", "Recommendation → Benefit → Example", "Neutral B1.1: explain and recommend."),
  }),
});

export function normalizeFirstName(value) {
  return String(value || "").normalize("NFC").trim().replace(/\s+/g, " ");
}

export function validateFirstName(value) {
  const normalized = normalizeFirstName(value);
  if (!normalized) return { valid: false, value: "", message: "Lütfen adını yaz." };
  if (normalized.length > 40) return { valid: false, value: normalized, message: "Adın en fazla 40 karakter olabilir." };
  if (!/^[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû]+(?:[ '-][A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû]+)*$/u.test(normalized)) {
    return { valid: false, value: normalized, message: "Lütfen yalnızca adını, harfleri kullanarak yaz." };
  }
  return { valid: true, value: normalized, message: "" };
}

export function normalizeReportedLevel(value) {
  return REPORTED_LEVELS.includes(value) ? NORMALIZED_LEVELS[value] : "";
}

export function recommendedDuration(value) {
  return LEVEL_DEFAULT_DURATIONS[value] || 60;
}

export function resolveQuestion(situation, reportedLevel) {
  if (!SITUATIONS.includes(situation) || !REPORTED_LEVELS.includes(reportedLevel)) return null;
  const candidate = QUESTIONS.find((item) => item.active && item.purpose === situation && item.level === reportedLevel);
  return candidate ? presentQuestion(candidate) : null;
}

export function resolveQuestionById(questionId) {
  const current = QUESTIONS.find((item) => item.id === questionId);
  if (current) return presentQuestion(current);
  for (const situation of ["meeting", "interview", "presentation"]) {
    for (const level of REPORTED_LEVELS) {
      const candidate = LEGACY_QUESTION_BANK[situation][level];
      if (candidate.id === questionId) return candidate;
    }
  }
  return null;
}

export function eligibleQuestions(situation, reportedLevel) {
  if (!SITUATIONS.includes(situation) || !REPORTED_LEVELS.includes(reportedLevel)) return [];
  return QUESTIONS.filter((item) => item.active && item.purpose === situation && item.level === reportedLevel).map(presentQuestion);
}

export function isLegacyQuestionId(questionId) {
  return LEGACY_QUESTION_IDS.includes(questionId);
}

export function presentQuestion(item) {
  return Object.freeze({
    ...item,
    title: item.question_en,
    translationTr: item.question_tr,
    context: item.context_en,
    guide: item.structure_hint_en,
    demand: item.difficulty_version,
  });
}
