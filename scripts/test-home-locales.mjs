import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  homepageCopy,
  homepageLocales,
  supportedHomepageLocales,
  validateHomepageLocales,
} from "../src/i18n/homepage-locales.mjs";

validateHomepageLocales();
assert.deepEqual([...supportedHomepageLocales].sort(), ["en", "tr"]);
assert.equal(homepageLocales.fr, undefined, "Unsupported locales must not fall back to a different language.");

const pages = Object.fromEntries(
  await Promise.all(
    supportedHomepageLocales.map(async (locale) => [
      locale,
      await readFile(resolve(locale, "index.html"), "utf8"),
    ]),
  ),
);

for (const locale of supportedHomepageLocales) {
  const page = pages[locale];
  assert.match(page, new RegExp(`<html lang="${locale}">`));
  assert.match(page, new RegExp(`rel="canonical" href="https://starspeakerstudio.com/${locale}/"`));
  assert.match(
    page,
    new RegExp(`class="stage-home-lang-button is-active" href="/${locale}/" aria-current="page"`),
  );
  assert.match(page, /href="\/(?:en|tr)\/"/);
  assert.match(page, /class="stage-program"/);
  assert.match(page, /class="stage-method"/);
  assert.match(page, /class="stage-results"/);

  const sectionOrder = ["stage-home-hero", "stage-program", "stage-method", "stage-results"].map((className) =>
    page.indexOf(`class="${className}`),
  );
  assert(sectionOrder.every((position) => position >= 0));
  assert.deepEqual(sectionOrder, [...sectionOrder].sort((a, b) => a - b));
}

assert.match(pages.tr, new RegExp(homepageCopy.programTitle.tr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(pages.en, new RegExp(homepageCopy.programTitle.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.doesNotMatch(pages.en, new RegExp(homepageCopy.programTitle.tr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(pages.en, /Show Ömer Karademir's result/);
assert.match(pages.tr, /Ömer Karademir sonucunu göster/);

console.log("Homepage locale checks passed for /tr/ and /en/.");
