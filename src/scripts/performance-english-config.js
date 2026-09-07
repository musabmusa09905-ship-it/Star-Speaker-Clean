import {
  QUESTIONS,
  QUESTION_BANK_VERSION,
} from "./performance-question-bank.js";
export { QUESTION_BANK_VERSION };
export const EXPERIENCE_VERSION = "career_english_v3";
export const LEVEL_LABELS = {
  b1_1: "B1",
  b1_2: "B1+",
  b2_1: "B2",
  b2_2: "B2+",
  c1_1: "C1",
};
export const REPORTED_LEVELS = Object.keys(LEVEL_LABELS);
export const SITUATIONS = ["meeting", "interview", "presentation", "other"];
export const RECORDING_DURATIONS = [45, 60, 90, 120];
export const FEELINGS = ["fantastic", "confident", "calm", "nervous", "tired"];
export function normalizeReportedLevel(level) {
  return REPORTED_LEVELS.includes(level) ? level : "";
}
export function recommendedDuration(level) {
  return { b1_1: 60, b1_2: 60, b2_1: 90, b2_2: 90, c1_1: 120 }[level] || 60;
}
export function validateFirstName(value) {
  const name = String(value || "")
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ");
  if (!name)
    return {
      valid: false,
      value: name,
      message: "Please enter your first name.",
    };
  if (name.length > 40)
    return {
      valid: false,
      value: name,
      message: "Your first name can contain up to 40 characters.",
    };
  if (
    !/^[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû]+(?:[ '-][A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû]+)*$/u.test(
      name,
    )
  )
    return {
      valid: false,
      value: name,
      message: "Please enter your first name using Latin letters.",
    };
  return { valid: true, value: name, message: "" };
}
export function presentQuestion(q) {
  return q
    ? {
        ...q,
        title: q.question_en,
        translationTr: "",
        context: q.context_en,
        guide: q.structure_hint_en,
        demand: q.difficulty_version,
      }
    : null;
}
export function resolveQuestion(situation, level) {
  return presentQuestion(
    QUESTIONS.find(
      (q) =>
        q.active &&
        q.purpose === situation &&
        q.level === level &&
        REPORTED_LEVELS.includes(level),
    ),
  );
}
export function resolveQuestionById(id) {
  return presentQuestion(
    QUESTIONS.find(
      (q) => q.active && q.id === id && REPORTED_LEVELS.includes(q.level),
    ),
  );
}
export function eligibleQuestions(situation, level) {
  return QUESTIONS.filter(
    (q) =>
      q.active &&
      q.purpose === situation &&
      q.level === level &&
      REPORTED_LEVELS.includes(level),
  ).map(presentQuestion);
}
