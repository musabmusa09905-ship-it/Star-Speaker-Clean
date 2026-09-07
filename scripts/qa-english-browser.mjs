import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { chromium } from "../../StarSpeaker-App/node_modules/playwright/index.mjs";
import { resolveQuestion } from "../src/scripts/performance-analysis-config.js";
const root = resolve(".");
const output = resolve(process.env.QA_OUTPUT || "../english-localization-qa");
await mkdir(output, { recursive: true });
const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (path.endsWith("/")) path += "index.html";
    const file = resolve(root, "." + path);
    assert.ok(file.startsWith(root + sep));
    res.setHeader(
      "Content-Type",
      {
        ".js": "text/javascript",
        ".html": "text/html",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".woff2": "font/woff2",
      }[extname(file)] || "application/octet-stream",
    );
    res.end(await readFile(file));
  } catch {
    res.statusCode = 404;
    res.end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
// QA_BASE_URL tests deployed assets; API responses remain isolated fixtures.
const base = process.env.QA_BASE_URL || "http://127.0.0.1:" + server.address().port;
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.QA_EXECUTABLE ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: [
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
  ],
});
const signatures = {};
try {
  for (const width of (process.env.QA_WIDTHS || "320,360,390,768,1440")
    .split(",")
    .map(Number))
    for (const locale of ["tr", "en"]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      let releaseProvider;
      const errors = [];
      await page.addInitScript(() => {
        window.qaTracks = [];
        const gum = navigator.mediaDevices.getUserMedia.bind(
          navigator.mediaDevices,
        );
        navigator.mediaDevices.getUserMedia = async (...args) => {
          if (window.qaDeny)
            throw new DOMException("Permission denied", "NotAllowedError");
          const stream = await gum(...args);
          window.qaTracks.push(...stream.getTracks());
          return stream;
        };
      });
      page.on("pageerror", (e) => errors.push(e.message));
      await page.route("**/*", async (route) => {
        const url = route.request().url();
        if (url.startsWith(base)) return route.continue();
        if (url.includes("/functions/v1/")) {
          let b = {};
          try {
            b = route.request().postDataJSON();
          } catch {}
          let body = {
            ok: true,
            participant_id: "22222222-2222-4222-8222-222222222222",
            lead_id: "11111111-1111-4111-8111-111111111111",
          };
          if (b?.action === "slots")
            body = {
              slots: [
                {
                  appointment_start: "2026-09-10T09:00:00Z",
                  booking_date: "2026-09-10",
                },
              ],
            };
          if (["create", "reschedule"].includes(b?.action))
            body = {
              booking: {
                booking_id: "33333333-3333-4333-8333-333333333333",
                appointment_start: b.appointment_start,
              },
              management_token: "fixture-only",
            };
          if (b?.action === "select_question") {
            const q = resolveQuestion(b.situation, b.reported_level);
            body = {
              question: {
                ...q,
                ...(locale === "en" ? { translationTr: "" } : {}),
              },
            };
          }
          if (
            route.request().headers()["content-type"]?.includes("multipart")
          ) {
            await new Promise((r) => {
              releaseProvider = r;
            });
            body = {
              transcript:
                "I believe a concrete example helps an interviewer understand a professional strength.",
              metrics: {
                clarity: 66,
                structure: 55,
                pressure: 63,
                interaction: 61,
              },
              strength_tr: "You give a clear reason for your approach.",
              correction_tr:
                "Start with the main point and add a concrete example.",
              evidence_tr:
                "You give the reason but do not describe a specific event.",
              improved_opening_tr:
                "The best way is to describe a specific action and result.",
              next_action_tr:
                "Give one practical example after your main point.",
            };
          }
          return route.fulfill({ json: body });
        }
        return route.abort();
      });
      await page.goto(
        base +
          (locale === "en"
            ? "/en/speaking-analysis/"
            : "/tr/performans-testi/"),
      );
      async function check(state) {
        if (["setup", "question", "correction", "result"].includes(state))
          assert.equal(
            await page.evaluate(() => document.activeElement.tagName),
            "H2",
            state + " heading focus",
          );
        const detail = await page.evaluate(() => ({
          overflow: [...document.querySelectorAll("body *")]
            .filter((e) => {
              const r = e.getBoundingClientRect();
              return (
                r.width > 0 &&
                r.height > 0 &&
                getComputedStyle(e).visibility !== "hidden" &&
                (r.right > innerWidth + 1 || r.left < -1)
              );
            })
            .map((e) => e.tagName + "." + e.className),
          signature: [
            ...document
              .querySelector(".sprint-screen.is-active")
              .querySelectorAll("*"),
          ]
            .filter(
              (e) =>
                !e.closest(
                  '[data-level="a2_1"],[data-level="a2_2"],[data-level="unsure"]',
                ) && !e.matches("[data-contact-form] > .sprint-level-note"),
            )
            .map((e) => e.tagName + ":" + e.className)
            .join("|"),
          text:
            document.body.innerText +
            " " +
            getComputedStyle(
              document.querySelector(".sprint-header-status"),
              "::after",
            ).content,
        }));
        assert.deepEqual(
          detail.overflow,
          [],
          `${locale} ${width} ${state} overflow`,
        );
        if (locale === "en")
          assert.doesNotMatch(
            detail.text,
            /[çğıöşüÇĞİÖŞÜ]|\b(Tekrar|Sesli|Analiz|saniye|Randevu|Mikrofon|kur\.|tarihinde)\b/,
          );
        const key = width + ":" + state;
        if (locale === "tr") signatures[key] = detail.signature;
        else
          assert.equal(
            detail.signature,
            signatures[key],
            `${key}: same element/class structure`,
          );
        await page.screenshot({
          path: resolve(output, `${locale}-${width}-${state}.png`),
          fullPage: true,
        });
      }
      await check("intro");
      await page.locator("[data-start]").click();
      await check("setup");
      await page.locator("[name=firstName]").fill("Alex");
      await page.locator("[data-situation=interview]").click();
      await page.locator("[data-level=b2_1]").click();
      await page.locator('[data-duration="45"]').click();
      await page.locator("[data-feeling=calm]").click();
      await page.locator(".sprint-setup-submit").click();
      await page.locator("[data-screen=record].is-active").waitFor();
      await check("question");
      if (width === 390) {
        await page.evaluate(() => {
          window.qaDeny = true;
        });
        await page.locator("[data-record-button]").click();
        await page.locator("[data-record-error]:visible").waitFor();
        await check("microphone-error");
        await page.evaluate(() => {
          window.qaDeny = false;
        });
        await page.locator("[data-record-button]").click();
        await page.locator("[data-countdown]:visible").waitFor();
        await page.locator("[data-countdown-cancel]").click();
        assert.ok(
          await page.evaluate(() =>
            window.qaTracks.every((t) => t.readyState === "ended"),
          ),
        );
        await check("cancelled-countdown");
      }
      const question = await page
        .locator("[data-prompt-title]")
        .textContent()
        .catch(() => null);
      for (const phase of ["first", "retry"]) {
        await page.locator("[data-record-button]").click();
        await page.locator("[data-countdown]:visible").waitFor();
        await check(phase + "-countdown");
        await page.locator("[data-countdown-start-now]").click();
        await page.locator(".sprint-recorder.is-recording").waitFor();
        await check(phase + "-recording");
        await new Promise((r) => setTimeout(r, 4500));
        await page.locator("[data-record-button]").click();
        await page.locator("[data-use-recording]:visible").waitFor();
        await check(phase + "-recorded");
        if (width === 390 && phase === "first") {
          await page.locator("[data-record-again]").click();
          await page.locator("[data-record-button]").click();
          await page.locator("[data-countdown]:visible").waitFor();
          await page.locator("[data-countdown-start-now]").click();
          await page.locator(".sprint-recorder.is-recording").waitFor();
          await new Promise((r) => setTimeout(r, 4500));
          await page.locator("[data-record-button]").click();
          await page.locator("[data-use-recording]:visible").waitFor();
          await check("rerecorded");
        }
        assert.ok(
          await page.evaluate(() =>
            window.qaTracks.every((t) => t.readyState === "ended"),
          ),
          "microphone tracks ended after stop",
        );
        await page.locator("[data-use-recording]").click();
        await page.locator("[data-screen=analysis].is-active").waitFor();
        await check(phase + "-processing");
        assert.ok(releaseProvider);
        releaseProvider();
        releaseProvider = null;
        await new Promise((r) => setTimeout(r, 800));
        await page
          .locator(
            phase === "first"
              ? "[data-screen=correction].is-active"
              : "[data-screen=result].is-active",
          )
          .waitFor();
        await check(phase === "first" ? "correction" : "result");
        if (phase === "first") {
          assert.match(
            await page.locator("[data-overall-score]").innerText(),
            /^\d+$/,
          );
          await page.locator("[data-start-retry]").click();
          if (question)
            assert.equal(
              await page.locator("[data-prompt-title]").textContent(),
              question,
            );
        }
      }
      await page.locator("[data-open-contact]").click();
      await check("contact");
      await page.locator("[name=fullName]").fill("Alex Tester");
      await page.locator("[name=whatsapp]").fill("+905551234567");
      await page.locator("[name=consent]").check();
      await page.locator("[data-booking-next=budget]").click();
      await check("budget");
      await page.locator("[data-budget=unsure]").click();
      await check("urgency");
      await page.locator("[data-urgency=researching]").click();
      await page.locator("[data-booking-picker]:visible").waitFor();
      await check("calendar");
      if (width === 390) {
        await page.locator("[data-booking-slots] button").first().click();
        await page.locator("[data-booking-confirm]").click();
        await page.locator("[data-booking-success]:visible").waitFor();
        await check("booking-confirmed");
        await page.locator("[data-booking-reschedule]").click();
        await page.locator("[data-booking-picker]:visible").waitFor();
        await check("booking-reschedule");
        await page.locator("[data-booking-slots] button").first().click();
        await page.locator("[data-booking-confirm]").click();
        await page.locator("[data-booking-success]:visible").waitFor();
        page.once("dialog", (d) => d.accept());
        await page.locator("[data-booking-cancel]").click();
        await page.locator("[data-booking-picker]:visible").waitFor();
        await check("booking-cancelled");
      }
      assert.deepEqual(errors, [], `${locale} ${width} browser errors`);
      console.log(
        `PASS ${locale} ${width}: 17 states, structure, copy, overflow, scored first/retry, comparison and contact/calendar`,
      );
      await context.close();
    }
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
console.log("Screenshots: " + output);
