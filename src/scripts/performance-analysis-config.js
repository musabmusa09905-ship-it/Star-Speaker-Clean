export const EXPERIENCE_VERSION = "speaking_analysis_v2";

export const SITUATIONS = ["meeting", "interview", "presentation"];
export const REPORTED_LEVELS = ["b1", "b1_plus", "b2", "b2_plus", "c1", "unsure"];

export const LEVEL_LABELS = {
  b1: "B1",
  b1_plus: "B1+",
  b2: "B2",
  b2_plus: "B2+",
  c1: "C1",
  unsure: "Emin değilim",
};

export const NORMALIZED_LEVELS = {
  b1: "b1",
  b1_plus: "b1_plus",
  b2: "b2",
  b2_plus: "b2_plus",
  c1: "c1",
  unsure: "b1_plus",
};

const question = (id, title, context, guide) => Object.freeze({ id, title, context, guide });

export const QUESTION_BANK = Object.freeze({
  meeting: Object.freeze({
    b1: question(
      "meeting-b1-regular-update",
      "Describe a regular team meeting. What do you usually share with your colleagues?",
      "Talk about a familiar meeting, your update, and what the team needs to know.",
      "Meeting → Your update → Why it matters",
    ),
    b1_plus: question(
      "meeting-b1-plus-small-problem",
      "Tell your team about a small problem at work. What happened, and what help do you need?",
      "Explain the problem clearly and give one reason for the help you are requesting.",
      "Problem → Reason → Request",
    ),
    b2: question(
      "meeting-b2-team-decision",
      "Describe a meeting where your team had to make an important decision. What did you recommend, and what happened?",
      "Give a structured example with the situation, your recommendation, and the result.",
      "Situation → Recommendation → Action → Result",
    ),
    b2_plus: question(
      "meeting-b2-plus-speed-reliability",
      "Your team must choose between speed and reliability. What do you recommend?",
      "Compare the priorities, make a recommendation, and explain the trade-off.",
      "Recommendation → Reason → Trade-off → Impact",
    ),
    c1: question(
      "meeting-c1-delay-launch",
      "A senior stakeholder wants to launch now, but you believe the technical risk is too high. How would you persuade them to delay?",
      "Balance commercial pressure, technical uncertainty, and a credible alternative plan.",
      "Position → Evidence → Acknowledge pressure → Safer proposal",
    ),
    unsure: question(
      "meeting-unsure-improvement-suggestion",
      "What is one suggestion you would make to improve a team meeting, and why?",
      "Give one accessible recommendation and support it with a practical reason.",
      "Suggestion → Reason → Expected benefit",
    ),
  }),
  interview: Object.freeze({
    b1: question(
      "interview-b1-role-task",
      "Tell me about your current role and one task you do well.",
      "Describe your role, the familiar task, and why you are good at it.",
      "Role → Task → Strength",
    ),
    b1_plus: question(
      "interview-b1-plus-project",
      "Tell me about a project you enjoyed. What did you do, and why was it important?",
      "Give a concrete example and one reason the project mattered.",
      "Project → Your contribution → Why it mattered",
    ),
    b2: question(
      "interview-b2-technical-problem",
      "Tell me about a difficult technical problem you solved.",
      "Explain the problem, your action, and the result in a clear sequence.",
      "Problem → Action → Result → Learning",
    ),
    b2_plus: question(
      "interview-b2-plus-solution-tradeoff",
      "Tell me about two possible solutions you considered for a technical problem. How did you choose between them?",
      "Compare the options, explain the trade-off, and defend your decision.",
      "Problem → Options → Trade-off → Decision",
    ),
    c1: question(
      "interview-c1-challenged-decision",
      "Describe a professional decision that stakeholders challenged. How did you defend your reasoning and adapt your approach?",
      "Show nuanced judgment, stakeholder awareness, and what changed after the challenge.",
      "Decision → Challenge → Reasoning → Adaptation → Outcome",
    ),
    unsure: question(
      "interview-unsure-contribution",
      "Tell me about a recent project and one contribution you made.",
      "Describe a familiar project, your contribution, and one reason it helped.",
      "Project → Your contribution → Benefit",
    ),
  }),
  presentation: Object.freeze({
    b1: question(
      "presentation-b1-familiar-project",
      "Describe a project or product you know well.",
      "Explain what it is, what it does, and who uses it.",
      "What it is → What it does → Who it helps",
    ),
    b1_plus: question(
      "presentation-b1-plus-process",
      "Explain a tool or process you use at work. How does it help your team?",
      "Give a simple explanation and support it with one practical benefit.",
      "Tool or process → How it works → Benefit",
    ),
    b2: question(
      "presentation-b2-project-result",
      "Explain one important result from a recent project.",
      "State the result, explain what caused it, and show why it matters.",
      "Result → Evidence → Cause → Impact",
    ),
    b2_plus: question(
      "presentation-b2-plus-unexpected-result",
      "A project produced an unexpected result. How would you explain the likely causes and recommend the next action?",
      "Analyze the evidence, distinguish likely causes, and make a recommendation.",
      "Unexpected result → Causes → Evidence → Recommendation",
    ),
    c1: question(
      "presentation-c1-strategy-change",
      "How would you persuade senior leaders to change strategy when the technical evidence is complex and still uncertain?",
      "Translate uncertainty into a clear judgment, address objections, and recommend a responsible decision.",
      "Strategic position → Evidence → Uncertainty → Objection → Decision",
    ),
    unsure: question(
      "presentation-unsure-recent-result",
      "Explain a recent project and one result your audience should remember.",
      "Give an accessible overview and make one result clear.",
      "Project → Result → Why it matters",
    ),
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

export function resolveQuestion(situation, reportedLevel) {
  if (!SITUATIONS.includes(situation) || !REPORTED_LEVELS.includes(reportedLevel)) return null;
  return QUESTION_BANK[situation][reportedLevel] || null;
}

export function resolveQuestionById(questionId) {
  for (const situation of SITUATIONS) {
    for (const level of REPORTED_LEVELS) {
      const candidate = QUESTION_BANK[situation][level];
      if (candidate.id === questionId) return candidate;
    }
  }
  return null;
}
