import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ||
    "../../StarSpeaker-App/node_modules/playwright/index.mjs"
);
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [320, 360, 390, 768, 1440])
    for (const [name, copy] of [
      ["NotAllowedError", "permission was denied"],
      ["NotFoundError", "No available microphone"],
      ["NotReadableError", "No available microphone"],
      ["unsupported", "cannot record audio"],
    ]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      await page.addInitScript((name) => {
        if (name === "unsupported") window.MediaRecorder = undefined;
        else
          navigator.mediaDevices.getUserMedia = async () => {
            throw new DOMException("QA fixture", name);
          };
      }, name);
      await page.route("**/functions/v1/english-speaking-analysis", (route) =>
        route.fulfill({
          json:
            JSON.parse(route.request().postData()).action === "create"
              ? {
                  token: "a".repeat(64),
                  session: {
                    id: "11111111-1111-4111-8111-111111111111",
                    experience_version: "speaking_analysis_en_v1",
                    task: {
                      prompt: "Describe a place you like to visit.",
                      level: "b1",
                      category: "everyday_life",
                    },
                    first_result: null,
                    retry_result: null,
                  },
                }
              : { ok: true },
        }),
      );
      await page.goto("http://127.0.0.1:4189/en/speaking-analysis/");
      await page.getByRole("button", { name: "Start my analysis" }).click();
      await page
        .getByRole("button", { name: "Start Now", exact: true })
        .click();
      await page.locator('[data-screen="error"]').waitFor({ state: "visible" });
      assert.ok(
        (await page.locator("#error-message").textContent()).includes(copy),
      );
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      );
      assert.equal(await page.locator("h1:focus").count(), 1);
      await page
        .getByRole("button", { name: "Record again", exact: true })
        .click();
      await page
        .locator('[data-screen="record"]')
        .waitFor({ state: "visible" });
      await context.close();
    }
  console.log(
    "PASS error copy, focus, rerecord recovery and overflow for four microphone states at all five widths.",
  );
} finally {
  await browser.close();
}
