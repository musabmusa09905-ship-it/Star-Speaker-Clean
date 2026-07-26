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

const majorSectionIds = ["programs", "method", "results"];

for (const locale of supportedHomepageLocales) {
  const page = pages[locale];
  assert.match(page, new RegExp(`<html lang="${locale}">`));
  assert.match(page, new RegExp(`rel="canonical" href="https://starspeakerstudio.com/${locale}/"`));
  assert.match(page, new RegExp(`property="og:title" content="${homepageCopy.metaTitle[locale]}`));
  assert.match(page, /property="og:description"/);
  assert.match(
    page,
    new RegExp(`class="stage-home-lang-button is-active" href="/${locale}/" aria-current="page"`),
  );
  const oppositeLocale = locale === "tr" ? "en" : "tr";
  assert.match(page, new RegExp(`data-locale-link="${oppositeLocale}"`));
  assert.match(page, /class="stage-program"/);
  assert.match(page, /class="stage-method"/);
  assert.match(page, /class="stage-results"/);
  assert.match(page, /class="stage-results-carousel"/);
  assert.match(page, /id="contact"/);
  assert.match(page, /data-whatsapp-link/);
  assert.doesNotMatch(page, /href="[^"]*\.html/);
  assert.doesNotMatch(page, /\bSpark\b|14,999|19,999|30-Day Daily Speaking/);

  const sectionOrder = ["stage-home-hero", "stage-program", "stage-method", "stage-results"].map((className) =>
    page.indexOf(`class="${className}`),
  );
  assert(sectionOrder.every((position) => position >= 0));
  assert.deepEqual(sectionOrder, [...sectionOrder].sort((a, b) => a - b));

  for (const sectionId of majorSectionIds) {
    assert.match(page, new RegExp(`id="${sectionId}"`));
    assert.match(page, new RegExp(`href="#${sectionId}"`));
  }

  const documentIds = new Set([...page.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  const localHashes = [...page.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  for (const hash of localHashes) {
    assert(documentIds.has(hash), `Missing #${hash} target in /${locale}/`);
  }
}

assert.match(pages.tr, new RegExp(homepageCopy.programTitle.tr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(pages.en, new RegExp(homepageCopy.programTitle.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.doesNotMatch(pages.en, new RegExp(homepageCopy.programTitle.tr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(pages.en, /Show Ömer Karademir's result/);
assert.match(pages.tr, /Ömer Karademir sonucunu göster/);

const landingScript = await readFile(resolve("src", "scripts", "landing.js"), "utf8");
for (const hash of ["#programs", "#method", "#results", "#contact"]) {
  assert.match(landingScript, new RegExp(hash));
}
assert.match(landingScript, /data-locale-link/);
assert.match(landingScript, /hashchange/);

const rootPage = await readFile(resolve("index.html"), "utf8");
assert.match(rootPage, /http-equiv="refresh" content="0; url=\/tr\/"/);
assert.match(rootPage, /location\.replace/);
assert.doesNotMatch(rootPage, /stage-home-hero/);

const legacyRoutes = {
  "programs.html": "#programs",
  "program.html": "#programs",
  program: "#programs",
  "method.html": "#method",
  method: "#method",
  "results.html": "#results",
  results: "#results",
  "about.html": "",
  about: "",
  "apply.html": "#contact",
  "resources.html": "",
  "level-test.html": "#contact",
};

for (const [route, hash] of Object.entries(legacyRoutes)) {
  const page = await readFile(resolve(route), "utf8");
  assert.match(page, /meta name="robots" content="noindex, follow"/);
  assert.match(page, new RegExp(`url=/tr/${hash}`));
  assert.match(page, /location\.replace/);
  assert.doesNotMatch(page, /stage-home-hero|\bSpark\b|14,999|19,999|application-form/);
}

const sitemap = await readFile(resolve("sitemap.xml"), "utf8");
assert.match(sitemap, /https:\/\/starspeakerstudio\.com\/tr\//);
assert.match(sitemap, /https:\/\/starspeakerstudio\.com\/en\//);
assert.doesNotMatch(sitemap, /\.html/);

console.log("Homepage locale, navigation, metadata, and legacy-route checks passed.");
