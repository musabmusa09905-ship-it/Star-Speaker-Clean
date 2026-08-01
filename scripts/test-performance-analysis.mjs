import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  EXPERIENCE_VERSION,
  QUESTION_BANK,
  REPORTED_LEVELS,
  SITUATIONS,
  normalizeReportedLevel,
  resolveQuestion,
  resolveQuestionById,
  validateFirstName,
} from "../src/scripts/performance-analysis-config.js";

const page = await readFile(resolve("tr", "performans-testi", "index.html"), "utf8");
const client = await readFile(resolve("src", "scripts", "performance-sprint.js"), "utf8");
const edge = await readFile(resolve("supabase", "functions", "ai-speaking-coach", "index.ts"), "utf8");
const migration = await readFile(
  resolve("supabase", "migrations", "0142_add_performance_analysis_participants.sql"),
  "utf8",
);

assert.equal(EXPERIENCE_VERSION, "speaking_analysis_v2");

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
assert.equal(normalizeReportedLevel("unsure"), "b1_plus");
assert.match(resolveQuestion("meeting", "unsure").id, /unsure/);
assert.notEqual(resolveQuestion("meeting", "unsure").id, resolveQuestion("meeting", "b1_plus").id);
assert.equal(resolveQuestion("unknown", "b1"), null);
assert.equal(resolveQuestion("meeting", "unknown"), null);

assert.match(page, /Adın nedir\?/);
assert.match(page, /name="firstName"/);
assert.match(page, /autocomplete="given-name"/);
assert.match(page, /maxlength="40"/);
assert.match(page, /Hangi durumda İngilizce konuşmak istiyorsun\?/);
assert.match(page, /İngilizce konuşma seviyen hangisine daha yakın\?/);
assert.match(page, /Emin değilsen sorun değil\. Sana uygun bir başlangıç sorusu göstereceğiz\./);
assert.match(page, /Sorunu Gör <span aria-hidden="true">→<\/span>/);
assert.doesNotMatch(page.slice(0, page.indexOf('data-screen="mic"')), /email|telephone|surname|budget|deadline/i);

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
assert.match(client, /if \(event\?\.detail > 1\) return/);
assert.match(client, /state\.question \|\| resolveQuestion/);
assert.match(client, /form\.append\("session_id", state\.sessionId\)/);
assert.match(client, /question_id: state\.question\.id/);
assert.match(client, /participant_id: state\.participantId/);
assert.match(client, /state\.isDemo\) return \{ ok: true, demo: true/);

assert.match(edge, /action === "save_participant"/);
assert.match(edge, /action === "advance_participant"/);
assert.match(edge, /upsert_performance_analysis_participant/);
assert.match(edge, /advance_performance_analysis_participant/);
assert.match(edge, /track_performance_analysis_event/);
assert.match(edge, /level_is_self_reported|self-reported level/);

assert.match(migration, /create table if not exists public\.performance_analysis_participants/);
assert.match(migration, /session_id uuid not null unique/);
assert.match(migration, /on conflict \(session_id\) do update/);
assert.match(migration, /performance_sprint_leads_participant_unique/);
assert.match(migration, /participant_id uuid references public\.performance_analysis_participants/);
assert.match(migration, /on conflict \(session_id, event_key\).*do nothing/s);
assert.match(migration, /experience_version = p_experience_version/);
assert.match(migration, /not e\.is_demo/);
assert.match(migration, /not coalesce\(p\.is_internal, false\)/);
assert.match(migration, /group by e\.session_id/);
assert.match(migration, /valid_first_submitted/);
assert.match(migration, /valid_result and contact_action/);
assert.match(migration, /with \(security_invoker = true\)/);
assert.match(migration, /if not public\.is_admin\(\)/);
assert.match(migration, /when 'booking_confirmed' then 5/);
for (const definition of migration.split(/create or replace function/i).slice(1)) {
  if (/security definer/i.test(definition)) assert.match(definition, /set search_path = ''/i);
}
assert.match(migration, /participants remain separate from leads/);
assert.doesNotMatch(migration, /delete from public\.performance_sprint_(events|leads)/);

console.log("Performance analysis participant, question-bank, persistence, and funnel tests passed");
