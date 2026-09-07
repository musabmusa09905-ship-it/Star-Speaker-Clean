import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import * as en from "../src/scripts/performance-english-config.js";
import * as tr from "../src/scripts/performance-analysis-config.js";
const files = [
  "en/speaking-analysis/index.html",
  "src/scripts/english-analysis.js",
  "src/scripts/performance-english-contact.js",
];
const before = files.map((p) => readFileSync(p, "utf8"));
execFileSync(process.execPath, ["scripts/build-performance-english.mjs"]);
assert.deepEqual(
  files.map((p) => readFileSync(p, "utf8")),
  before,
  "generated files must match canonical source/dictionary",
);
const [html, js, contact] = before;
for (const s of before)
  assert.doesNotMatch(
    s,
    /[çğıöşüÇĞİÖŞÜ]|\b(Tekrar|Sesli|Analiz|saniye|Randevu|Mikrofon|kur\.|tarihinde|cevap)\b/,
    "no Turkish UI copy, including ASCII words",
  );
assert.match(html, /<html lang="en">/);
assert.match(html, /\/en\/speaking-analysis\//);
const original = readFileSync("tr/performans-testi/index.html", "utf8");
const screens = (s) =>
  [...s.matchAll(/data-screen="([^"]+)"/g)].map((x) => x[1]);
assert.deepEqual(screens(html), screens(original));
assert.deepEqual(en.SITUATIONS, tr.SITUATIONS);
assert.deepEqual(en.FEELINGS, tr.FEELINGS);
assert.deepEqual(en.RECORDING_DURATIONS, tr.RECORDING_DURATIONS);
assert.deepEqual(en.REPORTED_LEVELS, ["b1_1", "b1_2", "b2_1", "b2_2", "c1_1"]);
for (const level of en.REPORTED_LEVELS) {
  assert.equal(en.recommendedDuration(level), tr.recommendedDuration(level));
  for (const purpose of en.SITUATIONS) {
    assert.equal(en.eligibleQuestions(purpose, level).length, 4);
    assert.equal(
      en.resolveQuestion(purpose, level).title,
      tr.resolveQuestion(purpose, level).title,
    );
    assert.equal(en.resolveQuestion(purpose, level).translationTr, "");
  }
}
for (const selector of [
  "firstName",
  "data-feeling",
  "data-countdown-start-now",
  "data-record-again",
  "data-use-recording",
  "data-score-ring",
  "data-overall-score",
  "data-start-retry",
  "data-before-score",
  "data-after-score",
  "data-first-transcript",
  "data-retry-transcript",
  "data-contact-form",
  "data-budget",
  "data-urgency",
  "data-booking-confirm",
])
  assert.ok(html.includes(selector), selector);
assert.match(html, /src\/styles\/performance-sprint.css/);
assert.ok(!html.includes("english-analysis.css"));
assert.match(js, /performanceEnglishFlow/);
assert.match(js, /performanceEnglishBooking/);
assert.match(js, /get_result/);
assert.match(contact, /Turkish mobile number/);
assert.match(
  readFileSync("src/styles/performance-sprint.css", "utf8"),
  /html\[lang="en"\] \.sprint-header-status::after \{ content: "personal";/,
);
console.log(
  "PASS English canonical generation, copy coverage, setup/question/duration parity, scores/retry/comparison/contact/booking and isolated persistence.",
);
