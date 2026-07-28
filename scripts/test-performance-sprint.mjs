import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const page = await readFile(resolve("tr", "performans-testi", "index.html"), "utf8");
const script = await readFile(resolve("src", "scripts", "performance-sprint.js"), "utf8");
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
assert.match(page, /İngilizcen değil,\s*<em>performansın<\/em> test edilecek\./);
assert.match(page, /data-screen="intro"/);
assert.match(page, /data-screen="setup"/);
assert.match(page, /data-screen="record"/);
assert.match(page, /data-screen="analysis"/);
assert.match(page, /data-screen="diagnosis"/);
assert.match(page, /data-screen="method"/);
assert.match(page, /data-screen="feedback"/);
assert.match(page, /data-screen="result"/);
assert.match(page, /data-whatsapp-cta/);
assert.match(page, /data-booking-confirm/);
assert.match(page, /data-booking-reschedule/);
assert.match(page, /data-booking-cancel/);
assert.match(page, /Ücretsiz Görüşmeni Planla/);
assert.match(page, /Türkiye saati/);
assert.match(page, /name="budget"/);
assert.match(page, /autocomplete="tel"/);
assert.match(page, /name="consent" required/);

for (const phase of ["baseline-1", "baseline-2", "practice", "retry", "challenge"]) {
  assert.match(script, new RegExp(`["']${phase}["']`));
}
for (const metric of ["clarity", "structure", "pressure", "interaction"]) {
  assert.match(script, new RegExp(`${metric}:`));
  assert.match(edgeFunction, new RegExp(`${metric}:`));
}
for (const bottleneck of ["clarity", "structure", "pressure", "interaction"]) {
  assert.match(script, new RegExp(`${bottleneck}:\\s*\\{`));
}

assert.match(script, /MediaRecorder/);
assert.match(script, /getUserMedia/);
assert.match(script, /functions\/v1\/ai-speaking-coach/);
assert.match(script, /data-whatsapp-cta/);
assert.match(script, /saveLead\("whatsapp_clicked"\)/);
assert.match(script, /trackEvent\("budget_selected"/);
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
assert.match(script, /URLSearchParams\(location\.search\)\.get\("demo"\) === "1"/);
assert.doesNotMatch(script, /OPENAI_API_KEY/);
assert.doesNotMatch(script, /sk-[A-Za-z0-9]/);

assert.match(styles, /@media \(max-width: 560px\)/);
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
assert.doesNotMatch(styles, /overflow-x:\s*auto/);

assert.match(edgeFunction, /Deno\.env\.get\("OPENAI_API_KEY"\)/);
assert.match(edgeFunction, /gpt-4o-mini-transcribe/);
assert.match(edgeFunction, /gpt-5\.6-luna/);
assert.match(edgeFunction, /json_schema/);
assert.match(edgeFunction, /audio\.size > 8_000_000/);
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
