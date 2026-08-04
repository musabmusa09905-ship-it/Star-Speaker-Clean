import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  EXPERIENCE_VERSION,
  QUESTION_BANK_VERSION,
  REPORTED_LEVELS,
  SITUATIONS,
  normalizeReportedLevel,
  eligibleQuestions,
  recommendedDuration,
  resolveQuestion,
  resolveQuestionById,
  validateFirstName,
} from "../src/scripts/performance-analysis-config.js";
import { persistSetupAttempt } from "../src/scripts/performance-setup-recovery.js";

const page = await readFile(resolve("tr", "performans-testi", "index.html"), "utf8");
const client = await readFile(resolve("src", "scripts", "performance-sprint.js"), "utf8");
const edge = await readFile(resolve("supabase", "functions", "ai-speaking-coach", "index.ts"), "utf8");
const migration = await readFile(
  resolve("..", "StarSpeaker-App", "supabase", "migrations", "0152_performance_question_rotation_v2.sql"),
  "utf8",
);

assert.equal(EXPERIENCE_VERSION, "career_english_v3");

let recoverySession = "locked-session";
let recoveryQuestion = "preserved-question";
let recoverySelectCount = 0;
let recoverySaveCount = 0;
let recoveryResetCount = 0;
const recoveredAttempt = await persistSetupAttempt({
  ensureQuestion: async () => {
    recoverySelectCount += 1;
    recoveryQuestion ||= "new-question";
    return recoveryQuestion;
  },
  saveParticipant: async () => {
    recoverySaveCount += 1;
    if (recoverySession === "locked-session") throw Object.assign(new Error("locked"), { code: "participant_attempt_locked" });
  },
  resetLockedAttempt: () => {
    recoveryResetCount += 1;
    recoverySession = "fresh-session";
    recoveryQuestion = "";
  },
});
assert.deepEqual(recoveredAttempt, { recovered: true });
assert.equal(recoverySelectCount, 2, "locked recovery must select once for each session");
assert.equal(recoverySaveCount, 2, "locked recovery must retry participant creation exactly once");
assert.equal(recoveryResetCount, 1, "locked recovery must create exactly one fresh session");

await assert.rejects(
  persistSetupAttempt({
    ensureQuestion: async () => "question",
    saveParticipant: async () => { throw Object.assign(new Error("offline"), { code: "network_failure" }); },
    resetLockedAttempt: () => assert.fail("non-lock failures must not rotate the session"),
  }),
  (error) => error.code === "network_failure",
);
for (const setup of [
  { situation: "meeting", reportedLevel: "b1_2", duration: 60, feeling: "calm" },
  { situation: "other", reportedLevel: "unsure", duration: 60, feeling: "calm" },
]) {
  assert.equal(eligibleQuestions(setup.situation, setup.reportedLevel).length, 4);
  assert.ok(normalizeReportedLevel(setup.reportedLevel));
  assert.ok([45, 60, 90, 120].includes(setup.duration));
  assert.ok(["fantastic", "confident", "calm", "nervous", "tired"].includes(setup.feeling));
}

for (const validName of ["Dilruba", "Çağla", "İrem", "Özgür", "Şükrü", "Gül", "Nur Ece", "Ali-Can"]) {
  const result = validateFirstName(`  ${validName}  `);
  assert.equal(result.valid, true, `${validName} should be accepted`);
  assert.equal(result.value, validName);
}
for (const invalidName of ["", "   ", "A1", "<script>", "A".repeat(41), "Deniz_Y"]) {
  assert.equal(validateFirstName(invalidName).valid, false, `${JSON.stringify(invalidName)} should be rejected`);
}

const questionIds = new Set();
for (const situation of SITUATIONS) {
  const titles = new Set();
  for (const level of REPORTED_LEVELS) {
    const eligible = eligibleQuestions(situation, level);
    assert.equal(eligible.length, 4, `${situation}/${level} must have four active questions`);
    const selected = eligible[0];
    assert.ok(selected, `${situation}/${level} must resolve`);
    assert.ok(selected.id && selected.title && selected.context && selected.guide);
    assert.equal(resolveQuestionById(selected.id)?.id, selected.id);
    for (const question of eligible) {
      assert.equal(questionIds.has(question.id), false, `${question.id} must be globally unique`);
      questionIds.add(question.id);
    }
    titles.add(selected.title);
  }
  assert.equal(titles.size, REPORTED_LEVELS.length, `${situation} must have genuinely distinct level questions`);
}
assert.equal(questionIds.size, 128);
assert.equal(QUESTION_BANK_VERSION, "speaking_question_bank_v2");
assert.equal(normalizeReportedLevel("unsure"), "b1_1");
assert.deepEqual(REPORTED_LEVELS, ["a2_1", "a2_2", "b1_1", "b1_2", "b2_1", "b2_2", "c1_1", "unsure"]);
assert.equal(recommendedDuration("a2_1"), 45);
assert.equal(recommendedDuration("b1_2"), 60);
assert.equal(recommendedDuration("b2_2"), 90);
assert.equal(recommendedDuration("c1_1"), 120);
assert.match(resolveQuestion("meeting", "unsure").id, /unsure/);
assert.notEqual(resolveQuestion("meeting", "unsure").id, resolveQuestion("meeting", "b1_1").id);
assert.equal(resolveQuestion("unknown", "b1_1"), null);
assert.equal(resolveQuestion("meeting", "unknown"), null);

assert.match(page, /Adın nedir\?/);
assert.match(page, /name="firstName"/);
assert.match(page, /autocomplete="given-name"/);
assert.match(page, /maxlength="40"/);
assert.match(page, /Hangi durumda İngilizce konuşmak istiyorsun\?/);
assert.match(page, /İngilizce konuşma seviyen hangisine daha yakın\?/);
assert.match(page, /Emin değilsen sorun değil\. Sana uygun bir başlangıç sorusu göstereceğiz\./);
assert.match(page, /Sorunu Gör <span aria-hidden="true">→<\/span>/);
assert.doesNotMatch(page.slice(0, page.indexOf('data-screen="record"')), /email|telephone|surname|budget|deadline/i);
assert.doesNotMatch(page, /data-screen="mic"/);
assert.match(page, /data-feeling="nervous"/);
assert.match(page, /data-duration="120"/);
assert.match(page, /data-situation="other"/);

for (const contract of [
  "validateFirstName",
  "resolveQuestion",
  "normalizeReportedLevel",
  "performanceAnalysisFlow",
  "setupSubmitting",
  "saveParticipant",
  "advanceParticipant",
  "participant_id",
  "experience_version",
  "setup_completed",
]) assert.match(client, new RegExp(contract));
assert.match(client, /if \(state\.setupSubmitting\) return/);
assert.match(client, /rotateAttemptSession/);
assert.match(client, /persistSetupAttempt/);
assert.match(client, /await selectAndSaveParticipant\(\)/);
assert.match(client, /questionHistoryStatus/);
assert.match(client, /Şu anda devam edemedik\. Lütfen tekrar dene\./);
assert.match(client, /beginCountdown/);
assert.match(client, /cancelCountdown/);
assert.match(client, /state\.question \|\| resolveQuestion/);
assert.match(client, /form\.append\("session_id", state\.sessionId\)/);
assert.match(client, /question_id: state\.question\.id/);
assert.match(client, /participant_id: state\.participantId/);
assert.match(client, /state\.isDemo\) return \{ ok: true, demo: true/);

assert.match(edge, /action === "save_participant"/);
assert.match(edge, /action === "advance_participant"/);
assert.match(edge, /action === "select_question"/);
assert.match(edge, /questionById\.get\(questionId\)/);
assert.match(edge, /upsert_career_english_participant/);
assert.match(edge, /advance_career_english_participant/);
assert.match(edge, /track_career_english_event/);
assert.match(edge, /participant_attempt_locked/);
assert.match(edge, /X-Correlation-ID/);
assert.match(edge, /question_history_read_failed/);
assert.match(edge, /question_history_write_failed/);
assert.match(edge, /history_status: warningCode \? "degraded" : "saved"/);
assert.doesNotMatch(edge, /throw Object\.assign\(new Error\("Question history (?:is unavailable|could not be saved)\."/);
assert.match(edge, /level_is_self_reported|self-reported level/);

assert.match(migration, /performance_analysis_question_history/);
assert.match(migration, /'other'/);
assert.match(migration, /on conflict \(session_id\) do update/);
assert.match(migration, /career_english_v3/);
assert.match(migration, /enable row level security/);
for (const definition of migration.split(/create or replace function/i).slice(1)) {
  if (/security definer/i.test(definition)) assert.match(definition, /set search_path = ''/i);
}
assert.doesNotMatch(migration, /delete from public\.performance_sprint_(events|leads)/);

console.log("Performance analysis participant, question-bank, persistence, and funnel tests passed");
