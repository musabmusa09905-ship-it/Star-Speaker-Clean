import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const html = readFileSync("en/speaking-analysis/index.html", "utf8").replace(/\s+/g, " ");
const source = readFileSync("src/scripts/english-analysis.js", "utf8");
const levels = [
  ...html
    .match(/<select id="level"[\s\S]*?<\/select\s*>/)[0]
    .matchAll(/value="([^"]+)"/g),
].map((x) => x[1]);
assert.deepEqual(levels, ["b1", "b1_plus", "b2", "b2_plus", "c1"]);
for (const category of [
  "Everyday Life",
  "Work",
  "Study",
  "Speaking Under Pressure",
  "Opinions &amp; Explaining Ideas",
])
  assert.ok(html.includes(category));
assert.match(html, /<html lang="en">/);
assert.match(
  html,
  /canonical" href="https:\/\/starspeakerstudio.com\/en\/speaking-analysis\//,
);
assert.ok(html.includes("Prepare for 5 seconds"));
assert.ok(html.includes("Start Now"));
for (const forbidden of [
  'type="tel"',
  'type="email"',
  'name="firstName"',
  "/100",
  "score-ring",
  "booking-form",
  "budget",
  "urgency",
])
  assert.ok(!html.includes(forbidden), forbidden);
assert.ok(html.includes("Star Speaker does not store the raw audio"));
assert.ok(html.includes("transcript and feedback may be stored"));
assert.ok(!source.includes("innerHTML"));
assert.ok(source.includes("unsent recording was lost"));
assert.match(html, /wa\.me\/905525247746/);
console.log(
  "English entry: exact setup, truthful notice, metadata, no scores/contact form, countdown, safe rendering and recovery passed.",
);
