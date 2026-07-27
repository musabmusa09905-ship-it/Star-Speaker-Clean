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
  assert.match(page, /class="stage-programs"/);
  assert.match(page, /id="contact"/);
  assert.match(page, /data-whatsapp-link/);
  assert.doesNotMatch(page, /href="[^"]*\.html/);
  assert.doesNotMatch(page, /\bSpark\b|14,999|19,999|30-Day Daily Speaking/);

  const sectionOrder = ["stage-home-hero", "stage-program", "stage-method", "stage-results", "stage-programs"].map(
    (className) => page.indexOf(`class="${className}`),
  );
  assert(sectionOrder.every((position) => position >= 0));
  assert.deepEqual(sectionOrder, [...sectionOrder].sort((a, b) => a - b));

  const programSection = page.match(/<section class="stage-programs"[\s\S]*?<\/section>/)?.[0];
  assert(programSection, `Missing Programs section in /${locale}/`);
  assert.match(programSection, /id="programs"/);
  assert.equal((programSection.match(/class="stage-programs-level /g) ?? []).length, 2);
  assert.equal((programSection.match(/class="stage-programs-level-icon"/g) ?? []).length, 2);
  assert.equal((programSection.match(/data-whatsapp-link/g) ?? []).length, 1);
  assert.equal((programSection.match(/stage-programs-analysis-cta/g) ?? []).length, 1);
  assert.doesNotMatch(programSection, /\bSpark\b|30-Day|30 Gün|taksit|installment|\b50 minutes?\b|\b20 minutes?\b/iu);

  const allWhatsappTargets = [...page.matchAll(/data-whatsapp-link[\s\S]*?href="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert(allWhatsappTargets.length >= 2);
  assert(allWhatsappTargets.every((target) => target === allWhatsappTargets[0]));

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

assert.match(pages.tr, /Star Speaker Engineer Flow/);
assert.match(pages.tr, /17\.000 TL/);
assert.match(pages.tr, /23\.000 TL/);
assert.match(pages.tr, /12\.000 TL/);
assert.match(pages.tr, /Mühendisler İçin 21 Günlük İngilizce Performans Sprinti/);
assert.match(pages.tr, /Haftada 2 birebir konuşma çalışması/);
assert.match(pages.tr, /Haftada 3 birebir konuşma çalışması/);
assert.match(pages.tr, /Daha derin kişiselleştirme/iu);
assert.match(pages.tr, /Daha hızlı ve daha detaylı öncelik geri bildirimi/);
assert.match(pages.tr, /Daha yakın ve detaylı gelişim takibi/);
assert.match(pages.tr, /Öncelikli destek ve daha fazla öğretmen erişimi/);

assert.match(pages.en, /Star Speaker Engineer Flow/);
assert.match(pages.en, /17,000 TL/);
assert.match(pages.en, /23,000 TL/);
assert.match(pages.en, /12,000 TL/);
assert.match(pages.en, /21-Day English Performance Sprint for Engineers/);
assert.match(pages.en, /2 private speaking sessions per week/);
assert.match(pages.en, /3 private speaking sessions per week/);
assert.match(pages.en, /deeper personalization/iu);
assert.match(pages.en, /Faster and more detailed priority feedback/);
assert.match(pages.en, /Closer and more detailed progress tracking/);
assert.match(pages.en, /Priority support and greater teacher access/);

for (const locale of supportedHomepageLocales) {
  const page = pages[locale];
  assert.equal((page.match(/\sid="programs"/g) ?? []).length, 1);
  assert.equal((page.match(/class="stage-programs-shared"/g) ?? []).length, 1);
  assert.equal((page.match(/class="stage-programs-sprint"/g) ?? []).length, 1);
  assert.equal((page.match(/class="stage-programs-analysis"/g) ?? []).length, 1);
}

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
