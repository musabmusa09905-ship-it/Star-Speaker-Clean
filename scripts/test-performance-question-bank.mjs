import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { QUESTIONS, QUESTION_BANK_VERSION, LEGACY_QUESTION_IDS } from "../src/scripts/performance-question-bank.js";
import { chooseQuestion } from "../supabase/functions/_shared/question-selection.js";

const purposes = ["meeting", "interview", "presentation", "other"];
const levels = ["a2_1", "a2_2", "b1_1", "b1_2", "b2_1", "b2_2", "c1_1", "unsure"];
const ids = new Set();
const normalizedPrompts = new Set();
const distribution = {};

assert.equal(QUESTION_BANK_VERSION, "speaking_question_bank_v2");
assert.ok(QUESTIONS.length >= 100);
assert.equal(QUESTIONS.filter((question) => question.active).length, 128);
assert.equal(LEGACY_QUESTION_IDS.length, 24);

for (const question of QUESTIONS) {
  assert.match(question.id, /^(meeting|interview|presentation|other)_(a2_1|a2_2|b1_1|b1_2|b2_1|b2_2|c1_1|unsure)_[a-z0-9_]+_\d{3}$/);
  assert.equal(ids.has(question.id), false, `duplicate ID: ${question.id}`);
  ids.add(question.id);
  assert.ok(purposes.includes(question.purpose));
  assert.ok(levels.includes(question.level));
  for (const field of ["question_tr", "question_en", "context_tr", "context_en", "structure_hint_tr", "structure_hint_en", "topic", "difficulty_version"]) {
    assert.ok(String(question[field] || "").trim(), `${question.id} missing ${field}`);
  }
  assert.ok([45, 60, 90, 120].includes(question.recommended_duration));
  assert.equal(question.question_bank_version, QUESTION_BANK_VERSION);
  assert.ok(question.question_en.length <= 190, `${question.id} is too long`);
  assert.ok((question.question_en.match(/\?/g) || []).length <= 2, `${question.id} has too many parts`);
  assert.doesNotMatch(question.question_en, /engineer|software architecture|quarterly earnings|procurement/i);
  const normalized = question.question_en.toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
  assert.equal(normalizedPrompts.has(normalized), false, `duplicate prompt: ${question.question_en}`);
  normalizedPrompts.add(normalized);
  const key = `${question.purpose}:${question.level}`;
  distribution[key] = (distribution[key] || 0) + 1;
}

for (const purpose of purposes) for (const level of levels) {
  assert.equal(distribution[`${purpose}:${level}`], 4, `${purpose}/${level} distribution`);
}

const sample = QUESTIONS.filter((question) => question.purpose === "other" && question.level === "unsure");
const history = [{ question_id: sample[0].id, last_served_at: "2026-08-04T10:00:00Z" }];
assert.notEqual(chooseQuestion(sample, history, [sample[0].id], 0).id, sample[0].id, "unseen question must beat an immediate repeat");
assert.equal(chooseQuestion(sample, history, [], 0).id, sample[1].id, "new sessions must prefer unseen questions");
const exhausted = sample.map((question, index) => ({ question_id: question.id, last_served_at: `2026-08-0${index + 1}T10:00:00Z` }));
assert.equal(chooseQuestion(sample, exhausted, sample.map((question) => question.id), 3).id, sample[0].id, "pool exhaustion must recycle the least recently served question");
assert.equal(chooseQuestion([], [], [], 0), null);

const edge = await readFile(resolve("supabase", "functions", "ai-speaking-coach", "index.ts"), "utf8");
assert.match(edge, /QUESTION_BANK_VERSION/);
assert.match(edge, /canonicalQuestion\.purpose/);
assert.match(edge, /canonicalQuestion\.level/);
assert.match(edge, /question_invalid/);
assert.match(edge, /chooseQuestion/);

console.log("128-question coverage, quality lint, canonical validation, legacy support, and rotation tests passed");
