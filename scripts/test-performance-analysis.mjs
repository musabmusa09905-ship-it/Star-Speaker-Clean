import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  EXPERIENCE_VERSION,
  QUESTION_BANK,
  REPORTED_LEVELS,
  SITUATIONS,
  normalizeReportedLevel,
  recommendedDuration,
  resolveQuestion,
  resolveQuestionById,
  validateFirstName,
} from "../src/scripts/performance-analysis-config.js";

const page = await readFile(resolve("tr", "performans-testi", "index.html"), "utf8");
const client = await readFile(resolve("src", "scripts", "performance-sprint.js"), "utf8");
const edge = await readFile(resolve("supabase", "functions", "ai-speaking-coach", "index.ts"), "utf8");
const migration = await readFile(
  resolve("..", "StarSpeaker-App", "supabase", "migrations", "0151_career_english_funnel_v3.sql"),
  "utf8",
);

assert.equal(EXPERIENCE_VERSION, "career_english_v3");

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
  assert.ok(QUESTION_BANK[situation]);
  const titles = new Set();
  for (const level of REPORTED_LEVELS) {
    const selected = resolveQuestion(situation, level);
    assert.ok(selected, `${situation}/${level} must resolve`);
    assert.ok(selected.id && selected.title && selected.context && selected.guide);
    assert.equal(resolveQuestionById(selected.id)?.id, selected.id);
    assert.match(edge, new RegExp(`"${situation}:${level}":\\s*"${selected.id}"`));
    assert.equal(questionIds.has(selected.id), false, `${selected.id} must be globally unique`);
    questionIds.add(selected.id);
    titles.add(selected.title);
  }
  assert.equal(titles.size, REPORTED_LEVELS.length, `${situation} must have genuinely distinct level questions`);
}
assert.equal(questionIds.size, SITUATIONS.length * REPORTED_LEVELS.length);
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
assert.match(client, /beginCountdown/);
assert.match(client, /cancelCountdown/);
assert.match(client, /state\.question \|\| resolveQuestion/);
assert.match(client, /form\.append\("session_id", state\.sessionId\)/);
assert.match(client, /question_id: state\.question\.id/);
assert.match(client, /participant_id: state\.participantId/);
assert.match(client, /state\.isDemo\) return \{ ok: true, demo: true/);

assert.match(edge, /action === "save_participant"/);
assert.match(edge, /action === "advance_participant"/);
assert.match(edge, /upsert_career_english_participant/);
assert.match(edge, /advance_career_english_participant/);
assert.match(edge, /track_career_english_event/);
assert.match(edge, /level_is_self_reported|self-reported level/);

assert.match(migration, /add column if not exists recording_duration_seconds/);
assert.match(migration, /add column if not exists emotional_state/);
assert.match(migration, /on conflict \(session_id\) do update/);
assert.match(migration, /on conflict\(session_id,event_key\).*do nothing/s);
assert.match(migration, /career_english_v3/);
assert.match(migration, /with\(security_invoker=true\)/);
for (const definition of migration.split(/create or replace function/i).slice(1)) {
  if (/security definer/i.test(definition)) assert.match(definition, /set search_path = ''/i);
}
assert.doesNotMatch(migration, /delete from public\.performance_sprint_(events|leads)/);

console.log("Performance analysis participant, question-bank, persistence, and funnel tests passed");
