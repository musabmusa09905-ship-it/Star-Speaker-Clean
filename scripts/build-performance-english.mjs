import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const copy = JSON.parse(
  await readFile(
    resolve(root, "src/i18n/performance-english-copy.json"),
    "utf8",
  ),
);
function localizedSource(source) {
  const replacements = copy
    .filter((x) => ["StringLiteral", "TemplateElement"].includes(x.kind))
    .map((x) => [
      x.raw,
      x.kind === "StringLiteral"
        ? JSON.stringify(x.english)
        : x.english.replace(/`/g, "\\`"),
    ])
    .sort((a, b) => b[0].length - a[0].length);
  // Single pass avoids translating inserted English or reprocessing nested fragments.
  const lookup = new Map(replacements);
  const pattern = new RegExp(
    replacements
      .map(([s]) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|"),
    "g",
  );
  return source.replace(pattern, (match) => lookup.get(match));
}
let html = await readFile(
  resolve(root, "tr/performans-testi/index.html"),
  "utf8",
);
const textMap = new Map(
  copy.filter((x) => x.kind === "html").map((x) => [x.raw, x.english]),
);
html = html.replace(/>([^<>]+)</g, (all, text) => {
  const key = text.replace(/\s+/g, " ").trim();
  return textMap.has(key)
    ? ">" + text.replace(key, textMap.get(key)) + "<"
    : all;
});
// Multiline text nodes retain their surrounding whitespace, but not Turkish text.
html = html.replace(/>([^<>]+)</g, (all, text) => {
  const key = text.replace(/\s+/g, " ").trim();
  return textMap.has(key) ? ">" + textMap.get(key) + "<" : all;
});
for (const row of copy.filter((x) => x.kind === "attribute"))
  html = html
    .split('"' + row.raw + '"')
    .join('"' + row.english.replaceAll('"', "&quot;") + '"');
html = html
  .replace('lang="tr"', 'lang="en"')
  .replaceAll("/tr/performans-testi/", "/en/speaking-analysis/")
  .replaceAll('href="/tr/"', 'href="/en/"')
  .replace(
    "/src/scripts/performance-sprint.js?v=20260901-start-now-race",
    "/src/scripts/english-analysis.js",
  );
html = html.replace(
  /\s*<button\b[^>]*data-level="(?:a2_1|a2_2|unsure)"[\s\S]*?<\/button>/g,
  "",
);
for (const [old, label] of Object.entries({
  "B1.1": "B1",
  "B1.2": "B1+",
  "B2.1": "B2",
  "B2.2": "B2+",
  "C1.1": "C1",
}))
  html = html.replaceAll(">" + old + "<", ">" + label + "<");
html = html.replace(
  /<p class="sprint-level-note">[^<]*<\/p>/,
  '<p class="sprint-level-note">Choose the level closest to your current speaking.</p>',
);
html = html.replace(
  '<form class="sprint-contact-card" data-contact-form hidden novalidate>',
  '<form class="sprint-contact-card" data-contact-form hidden novalidate><p class="sprint-level-note">Online booking currently supports Turkish mobile numbers (+90). If you use another country’s number, choose Ask on WhatsApp above. Appointment times are shown in Istanbul time.</p>',
);
let js = localizedSource(
  await readFile(resolve(root, "src/scripts/performance-sprint.js"), "utf8"),
);
js =
  '// Generated from the canonical Turkish controller. Edit the source/copy dictionary, then rebuild.\nimport { localizedFetch as fetch } from "./performance-english-transport.js";\n' +
  js;
js = js
  .replace(
    "./performance-analysis-config.js",
    "./performance-english-config.js",
  )
  .replace(
    "./performance-contact-contract.js",
    "./performance-english-contact.js",
  )
  .replaceAll("performanceSprintSessionId", "performanceEnglishSessionId")
  .replaceAll("performanceAnalysisFlow", "performanceEnglishFlow")
  .replaceAll(
    "starSpeakerQuestionHistoryV2",
    "starSpeakerEnglishQuestionHistoryV2",
  )
  .replaceAll('"tr-TR"', '"en-GB"')
  .replaceAll("performanceSprintBooking", "performanceEnglishBooking")
  .replaceAll(
    "starSpeakerAnonymousParticipantId",
    "starSpeakerEnglishAnonymousParticipantId",
  );
js += `\n// Recover only server-owned evidence, keeping the canonical screens and score rendering.\nif (state.participantSaved && !state.isDemo) {\n  try {\n    const recovered = await participantApi({action: 'get_result'});\n    if(recovered.first) state.analyses.first = recovered.first;\n    if(recovered.retry) state.analyses.retry = recovered.retry;\n    storeFlow();\n    if(state.analyses.retry) { renderResult(); showScreen('result'); }\n    else if(state.analyses.first) { renderCorrection(); showScreen('correction'); }\n  } catch { /* Keep the existing locally recovered screen available. */ }\n}\n`;
await mkdir(resolve(root, "en/speaking-analysis"), { recursive: true });
await writeFile(resolve(root, "en/speaking-analysis/index.html"), html);
await writeFile(resolve(root, "src/scripts/english-analysis.js"), js);
await writeFile(
  resolve(root, "src/scripts/performance-english-contact.js"),
  localizedSource(
    await readFile(
      resolve(root, "src/scripts/performance-contact-contract.js"),
      "utf8",
    ),
  ),
);
console.log(
  "Generated English localization of the canonical Turkish analysis.",
);
