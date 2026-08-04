import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const page = await readFile(resolve("tr", "performans-testi", "index.html"), "utf8");
const script = await readFile(resolve("src", "scripts", "performance-sprint.js"), "utf8");
const config = await readFile(resolve("src", "scripts", "performance-analysis-config.js"), "utf8");
const styles = await readFile(resolve("src", "styles", "performance-sprint.css"), "utf8");
const edgeFunction = await readFile(
  resolve("supabase", "functions", "ai-speaking-coach", "index.ts"),
  "utf8",
);
const bookingFunction = await readFile(
  resolve("supabase", "functions", "performance-sprint-booking", "index.ts"),
  "utf8",
);
const schema = await readFile(
  resolve("supabase", "schemas", "performance-sprint-schema.sql"),
  "utf8",
);

assert.match(page, /<html lang="tr">/);
assert.match(page, /rel="canonical" href="https:\/\/starspeakerstudio\.com\/tr\/performans-testi\/"/);
assert.match(page, /KARİYER İNGİLİZCESİ · ÜCRETSİZ/);
assert.match(page, /İngilizce cevabını<br><em>daha güçlü<\/em> kur\./);
assert.match(page, /Ücretsiz Analize Başla/);
assert.match(page, /Seviye sınavı değil · Hazırlık gerektirmez · Sonucun hemen hazır/);
assert.match(page, /data-screen="intro"/);
assert.match(page, /data-screen="setup"/);
assert.match(page, /data-screen="record"/);
assert.doesNotMatch(page, /data-screen="mic"/);
assert.match(page, /data-screen="analysis"/);
assert.match(page, /data-screen="correction"/);
assert.match(page, /data-screen="result"/);
assert.doesNotMatch(page, /data-screen="contact"/);
assert.doesNotMatch(page, /Yaklaşık 15 dakika/);
assert.doesNotMatch(page, /BU SEANSTA/);
assert.doesNotMatch(page, /Performans Sprint/i);
assert.ok(
  page.indexOf('data-screen="result"') < page.indexOf("data-contact-form"),
  "The optional contact form must remain inside the completed result.",
);
for (const situation of ["meeting", "interview", "presentation", "other"]) {
  assert.match(page, new RegExp(`data-situation="${situation}"`));
  assert.match(config, new RegExp(`"${situation}"`));
}
assert.match(page, /data-whatsapp-cta/);
assert.match(page, /data-booking-confirm/);
assert.match(page, /data-booking-reschedule/);
assert.match(page, /data-booking-cancel/);
assert.match(page, /Ücretsiz Görüşmeni Planla/);
assert.match(page, /Türkiye saati/);
assert.match(page, /autocomplete="tel"/);
assert.match(page, /name="consent" required/);
for (const level of ["a2_1", "a2_2", "b1_1", "b1_2", "b2_1", "b2_2", "c1_1", "unsure"]) assert.match(page, new RegExp(`data-level="${level}"`));
for (const duration of [45, 60, 90, 120]) assert.match(page, new RegExp(`data-duration="${duration}"`));
for (const feeling of ["fantastic", "confident", "calm", "nervous", "tired"]) assert.match(page, new RegExp(`data-feeling="${feeling}"`));
for (const cue of ["💬", "🤝", "🎤", "✨", "🤩", "😎", "😌", "😬", "😴"]) assert.match(page, new RegExp(cue));
for (const step of ["situation", "level", "duration", "feeling"]) assert.match(page, new RegExp(`data-setup-step="${step}"`));
assert.match(page, /Hazırsan sana uygun soruyu gösterelim/);
assert.match(page, /sprint-setup-submit" type="submit" disabled/);
for (const qualification of ["under_5000", "5000_10000", "10000_15000", "15000_25000", "25000_plus", "unsure"]) assert.match(page, new RegExp(`data-budget="${qualification}"`));
assert.match(script, /recording_countdown_started/);
assert.match(script, /consent_version/);
assert.doesNotMatch(script, /budget_range:\s*null/);

for (const phase of ["first", "retry"]) {
  assert.match(script, new RegExp(`["']${phase}["']`));
}
for (const metric of ["clarity", "structure", "pressure", "interaction"]) {
  assert.match(script, new RegExp(`${metric}:`));
  assert.match(edgeFunction, new RegExp(`${metric}:`));
}
assert.match(script, /MediaRecorder/);
assert.match(script, /getUserMedia/);
assert.match(script, /functions\/v1\/ai-speaking-coach/);
assert.match(script, /data-whatsapp-cta/);
for (const eventName of [
  "landing_viewed",
  "start_clicked",
  "purpose_selected",
  "microphone_granted",
  "microphone_denied",
  "first_recording_started",
  "first_answer_submitted",
  "personal_correction_viewed",
  "retry_started",
  "retry_submitted",
  "result_viewed",
  "whatsapp_clicked",
  "contact_submitted",
]) assert.match(script, new RegExp(eventName));
for (const eventName of [
  "booking_viewed",
  "booking_date_selected",
  "booking_slot_selected",
  "booking_submitted",
  "booking_failed",
  "booking_reschedule_started",
  "booking_whatsapp_clicked",
  "booking_no_slot_whatsapp_clicked",
]) assert.match(script, new RegExp(eventName));
assert.match(script, /performance-sprint-booking/);
assert.match(script, /Europe\/Istanbul/);
assert.match(script, /Randevuyu WhatsApp’tan Onayla|data-booking-whatsapp/);
assert.match(script, /Uygun bir saat bulamadın mı|data-booking-fallback-whatsapp/);
assert.match(script, /state\.bookingSubmitting/);
assert.match(script, /performanceSprintBooking/);
assert.match(script, /restoreBooking\(\)/);
assert.match(script, /session_abandoned/);
assert.match(script, /setup_abandoned/);
assert.match(script, /completed_steps/);
assert.match(script, /URLSearchParams\(location\.search\)\.get\("demo"\) === "1"/);
assert.match(script, /state\.recordings\[phase\]/);
assert.match(script, /state\.submitting/);
assert.match(page, /data-demo-badge hidden/);
assert.match(script, /if \(state\.isDemo\) \$\("\[data-demo-badge\]"\)\.hidden = false/);
assert.match(script, /state\.analyses\.first\?\.improved_opening_tr/);
assert.match(script, /state\.phase === "retry"/);
assert.doesNotMatch(script, /OPENAI_API_KEY/);
assert.doesNotMatch(script, /sk-[A-Za-z0-9]/);

assert.match(styles, /@media \(max-width: 560px\)/);
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(styles, /sprint-feeling-options button:last-child/);
assert.match(styles, /sprint-setup-submit\[data-ready="true"\]/);
assert.equal((page.match(/class="sprint-choice-card /g) || []).length, 21);
assert.equal((page.match(/sprint-choice-card__content/g) || []).length, 21);
assert.equal((page.match(/class="sprint-level-mark /g) || []).length, 7);
assert.equal((page.match(/class="sprint-duration-mark"/g) || []).length, 4);
assert.equal((page.match(/sprint-choice-card--feeling/g) || []).length, 5);
assert.match(styles, /\.sprint-choice-card\[aria-pressed="true"\]::after/);
assert.match(styles, /\.sprint-choice-card\[aria-pressed="true"\][^{]*\{[^}]*transform:\s*none/s);
assert.match(styles, /\.sprint-choice-card__content[^}]*justify-content:\s*center/s);
assert.match(styles, /\.sprint-duration-options\s*\{\s*grid-template-columns:\s*repeat\(2,/s);
assert.match(styles, /animation:\s*sprint-check-in 180ms/);
assert.doesNotMatch(styles, /overflow-x:\s*auto/);

assert.match(edgeFunction, /Deno\.env\.get\("OPENAI_API_KEY"\)/);
assert.match(edgeFunction, /gpt-4o-mini-transcribe/);
assert.match(edgeFunction, /gpt-5\.6-luna/);
assert.match(edgeFunction, /json_schema/);
assert.match(edgeFunction, /audio\.size > 16_000_000/);
assert.match(edgeFunction, /audio_type_invalid/);
assert.match(edgeFunction, /allowedOrigins/);
assert.match(edgeFunction, /performance_sprint_events/);
assert.doesNotMatch(edgeFunction, /sk-[A-Za-z0-9]/);

assert.match(bookingFunction, /allowedOrigins/);
assert.match(bookingFunction, /create_performance_sprint_booking/);
assert.match(bookingFunction, /reschedule_performance_sprint_booking/);
assert.match(bookingFunction, /cancel_performance_sprint_booking/);
assert.match(bookingFunction, /crypto\.getRandomValues/);
assert.match(bookingFunction, /SUPABASE_SERVICE_ROLE_KEY/);
assert.doesNotMatch(bookingFunction, /participant_whatsapp|participant_email|private_admin_note/);
assert.doesNotMatch(bookingFunction, /sk-[A-Za-z0-9]/);

assert.match(schema, /create table if not exists public\.performance_sprint_leads/);
assert.match(schema, /create table if not exists public\.performance_sprint_events/);
assert.match(schema, /performance_sprint_leads_admin_all/);
assert.match(schema, /enable row level security/);
assert.match(schema, /revoke all on table public\.performance_sprint_leads from anon, authenticated/);

console.log("Performance Sprint structure, safety, and funnel tests passed");
