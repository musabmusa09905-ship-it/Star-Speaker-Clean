import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
const engines = await import(
  process.env.PLAYWRIGHT_MODULE ||
    "../../StarSpeaker-App/node_modules/playwright/index.mjs"
);
const engine = process.env.QA_BROWSER || "chromium";
const browser = await (
  engine === "firefox"
    ? engines.firefox
    : engine === "webkit"
      ? engines.webkit
      : engines.chromium
).launch({
  headless: true,
  ...(["chrome", "msedge"].includes(engine) ? { channel: engine } : {}),
  ...(engine === "firefox"
    ? {
        firefoxUserPrefs: {
          "media.navigator.streams.fake": true,
          "media.navigator.permission.disabled": true,
        },
      }
    : engine === "webkit"
      ? {}
      : {
          args: [
            "--use-fake-ui-for-media-stream",
            "--use-fake-device-for-media-stream",
          ],
        }),
});
const first = {
  schema_version: "speaking_analysis_en_v1",
  status: "valid",
  transcript: "I like the park because it is quiet. I walk there on Sunday.",
  strength: {
    text: "You explain why you like the park.",
    evidence_quote: "because it is quiet",
  },
  priority: {
    area: "answer_development",
    text: "Give one detail about your visit.",
    evidence_quote: "I walk there on Sunday",
  },
  correction: "Describe something you do on your walk.",
  better_answer_direction: {
    opening: "On a typical Sunday, I…",
    next_step: "Give one detail about the walk.",
  },
  retry_instruction: "Answer the question again with that detail.",
  comparison: null,
};
const retry = {
  ...first,
  comparison: {
    outcome: "no_clear_change",
    what_improved: "The answer gives the same reason and example.",
    still_to_work_on: "Add a specific detail about the visit.",
    evidence: {
      first_quote: "I walk there on Sunday",
      retry_quote: "I walk there on Sunday",
      explanation:
        "Both answers describe the same action without an added detail.",
    },
  },
};
for (const width of process.env.QA_WIDTH
  ? [Number(process.env.QA_WIDTH)]
  : [320, 360, 390, 768, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    permissions: ["microphone"],
  });
  const page = await context.newPage();
  let session;
  let lose = false;
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.__qaStreams = [];
    const original = navigator.mediaDevices.getUserMedia.bind(
      navigator.mediaDevices,
    );
    navigator.mediaDevices.getUserMedia = async (...args) => {
      const stream = await original(...args);
      window.__qaStreams.push(stream);
      return stream;
    };
  });
  await page.route(
    "**/functions/v1/english-speaking-analysis",
    async (route) => {
      const req = route.request(),
        raw = req.postData() || "";
      let p;
      if (req.headers()["content-type"]?.includes("multipart")) {
        const match = raw.match(/name="metadata"\r\n\r\n([^\r]+)/);
        p = JSON.parse(match[1]);
      } else p = JSON.parse(raw);
      if (p.action === "create") {
        session = {
          id: "11111111-1111-4111-8111-111111111111",
          experience_version: "speaking_analysis_en_v1",
          level: p.level,
          category: p.category,
          task: {
            id: "en-v1-b1-everyday_life",
            level: "b1",
            category: "everyday_life",
            prompt:
              "Describe a place you like to visit. Why do you like it? Give an example.",
          },
          first_result: null,
          retry_result: null,
        };
        return route.fulfill({ json: { session, token: "a".repeat(64) } });
      }
      if (p.action === "get") return route.fulfill({ json: { session } });
      if (p.action === "event") return route.fulfill({ json: { ok: true } });
      const result = p.phase === "first" ? first : retry;
      session[p.phase === "first" ? "first_result" : "retry_result"] = result;
      if (lose) {
        lose = false;
        return route.abort("failed");
      }
      return route.fulfill({ json: { result } });
    },
  );
  async function check(name) {
    await page.locator(`[data-screen="${name}"]`).waitFor({ state: "visible" });
    assert.equal(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
      true,
      `${width} ${name} overflow`,
    );
    if (
      process.env.QA_ARTIFACT_DIR &&
      ["setup", "feedback", "comparison", "error"].includes(name)
    ) {
      await mkdir(process.env.QA_ARTIFACT_DIR, { recursive: true });
      await page.screenshot({
        path: join(
          process.env.QA_ARTIFACT_DIR,
          `${engine}-${width}-${name}.png`,
        ),
        fullPage: true,
      });
    }
  }
  await page.goto("http://127.0.0.1:4189/en/speaking-analysis/");
  await check("setup");
  await page.getByRole("button", { name: "Start my analysis" }).click();
  await check("record");
  await page.getByRole("button", { name: "Start Now", exact: true }).click();
  await page
    .getByRole("button", { name: "Stop recording", exact: true })
    .waitFor({ state: "visible" });
  await check("record");
  await page.waitForTimeout(3300);
  await page
    .getByRole("button", { name: "Stop recording", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Submit my answer", exact: true })
    .waitFor({ state: "visible" });
  assert.ok(
    await page.evaluate(() =>
      window.__qaStreams.every((s) =>
        s.getTracks().every((t) => t.readyState === "ended"),
      ),
    ),
    "Microphone tracks retained after stop",
  );
  lose = true;
  await page
    .getByRole("button", { name: "Submit my answer", exact: true })
    .click();
  await check("error");
  await page
    .getByRole("button", { name: "Recover result", exact: true })
    .click();
  await check("feedback");
  await page.reload();
  await check("feedback");
  await page
    .getByRole("button", { name: "Try the same question once more" })
    .click();
  await check("record");
  await page.getByRole("button", { name: "Start Now", exact: true }).click();
  await page
    .getByRole("button", { name: "Stop recording", exact: true })
    .waitFor({ state: "visible" });
  await page.waitForTimeout(3300);
  await page
    .getByRole("button", { name: "Stop recording", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Submit my answer", exact: true })
    .click();
  await check("comparison");
  await page.reload();
  await check("comparison");
  assert.equal(await page.locator("h1:focus").count(), 1);
  assert.match(
    await page.locator("#whatsapp").getAttribute("href"),
    /905525247746/,
  );
  assert.deepEqual(errors, []);
  console.log(
    `PASS ${engine} ${width}: capture, first response loss, recovery, refresh, retry, comparison, focus and overflow`,
  );
  await context.close();
}
await browser.close();
