import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
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

function flexibleTextPattern(value) {
  return value
    .trim()
    .split(/\s+/)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("\\s+");
}

const pages = Object.fromEntries(
  await Promise.all(
    supportedHomepageLocales.map(async (locale) => [
      locale,
      await readFile(resolve(locale, "index.html"), "utf8"),
    ]),
  ),
);

const majorSectionIds = ["programs", "method", "results", "faq"];

for (const locale of supportedHomepageLocales) {
  const page = pages[locale];
  assert.match(page, new RegExp(`<html lang="${locale}">`));
  assert.match(page, new RegExp(`rel="canonical" href="https://starspeakerstudio.com/${locale}/"`));
  assert.match(page, new RegExp(`property="og:title" content="${homepageCopy.metaTitle[locale]}`));
  assert.match(page, new RegExp(`property="og:url" content="https://starspeakerstudio.com/${locale}/"`));
  assert.match(page, new RegExp(`name="twitter:title" content="${homepageCopy.metaTitle[locale]}`));
  assert.match(page, new RegExp(flexibleTextPattern(homepageCopy.metaDescription[locale])));
  assert.match(page, /name="twitter:card" content="summary_large_image"/);
  const structuredData = JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]);
  assert.deepEqual(structuredData["@graph"].map((entry) => entry["@type"]), ["Organization", "Service", "FAQPage"]);
  assert.equal(structuredData["@graph"][2].mainEntity.length, 8);
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
  assert.match(page, /class="stage-closing-faq"/);
  assert.match(page, /class="stage-final-cta"/);
  assert.match(page, /class="stage-closing-footer"/);
  assert.match(page, /id="contact"/);
  assert.match(page, /data-whatsapp-link/);
  assert.doesNotMatch(page, /href="[^"]*\.html/);
  assert.doesNotMatch(page, /\bSpark\b|14,999|19,999|30-Day Daily Speaking/);

  const sectionOrder = [
    "stage-home-hero",
    "stage-program",
    "stage-method",
    "stage-results",
    "stage-programs",
    "stage-closing-faq",
    "stage-final-cta",
    "stage-closing-footer",
  ].map((className) => page.indexOf(`class="${className}`));
  assert(sectionOrder.every((position) => position >= 0));
  assert.deepEqual(sectionOrder, [...sectionOrder].sort((a, b) => a - b));

  const programSection = page.match(/<section class="stage-programs"[\s\S]*?<\/section>/)?.[0];
  assert(programSection, `Missing Programs section in /${locale}/`);
  assert.match(programSection, /id="programs"/);
  assert.equal((programSection.match(/class="stage-programs-level /g) ?? []).length, 2);
  assert.equal((programSection.match(/class="stage-programs-level-icon"/g) ?? []).length, 2);
  assert.equal((programSection.match(locale === "tr" ? /data-performance-link/g : /data-whatsapp-link/g) ?? []).length, 1);
  assert.equal((programSection.match(/stage-programs-analysis-cta/g) ?? []).length, 1);
  assert.doesNotMatch(programSection, /\bSpark\b|30-Day|30 Gün|taksit|installment|\b50 minutes?\b|\b20 minutes?\b/iu);

  const faqSection = page.match(/<section class="stage-closing-faq"[\s\S]*?<\/section>/)?.[0];
  assert(faqSection, `Missing FAQ section in /${locale}/`);
  assert.equal((faqSection.match(/class="stage-closing-faq-item/g) ?? []).length, 8);
  assert.equal((faqSection.match(/class="stage-closing-faq-button"/g) ?? []).length, 8);
  assert.equal((faqSection.match(/aria-expanded="true"/g) ?? []).length, 1);
  assert.equal((faqSection.match(/aria-expanded="false"/g) ?? []).length, 7);
  assert.equal((faqSection.match(/class="stage-closing-faq-answer"[\s\S]*?\shidden/g) ?? []).length, 7);
  assert.match(faqSection, /id="faq-question-1"[\s\S]*?aria-expanded="true"[\s\S]*?aria-controls="faq-answer-1"/);
  assert.match(faqSection, /id="faq-answer-1"[\s\S]*?aria-labelledby="faq-question-1"/);
  assert.equal((faqSection.match(/data-whatsapp-link/g) ?? []).length, 0);

  const finalCtaSection = page.match(/<section class="stage-final-cta"[\s\S]*?<\/section>/)?.[0];
  assert(finalCtaSection, `Missing final CTA section in /${locale}/`);
  assert.equal((finalCtaSection.match(/stage-final-cta-button/g) ?? []).length, 1);
  assert.equal((finalCtaSection.match(locale === "tr" ? /data-performance-link/g : /data-whatsapp-link/g) ?? []).length, 1);
  const programCtaTarget = programSection.match(/class="stage-programs-analysis-cta"[\s\S]*?href="([^"]+)"/)?.[1];
  const finalCtaTarget = finalCtaSection.match(/class="stage-final-cta-button"[\s\S]*?href="([^"]+)"/)?.[1];
  assert.equal(finalCtaTarget, programCtaTarget, `Final CTA must reuse the Programs destination in /${locale}/`);

  const footer = page.match(/<footer class="stage-closing-footer"[\s\S]*?<\/footer>/)?.[0];
  assert(footer, `Missing closing footer in /${locale}/`);
  assert.match(footer, /src="\/public\/assets\/star-speaker\/star-speaker-monogram-transparent\.png"/);
  assert.doesNotMatch(footer, /\.html/);
  for (const hash of ["main", "method", "results", "programs", "faq"]) {
    assert.match(footer, new RegExp(`href="#${hash}"`));
  }

  const allWhatsappTargets = [...page.matchAll(/data-whatsapp-link[\s\S]*?href="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert(allWhatsappTargets.length >= 1);
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

  const localAssets = new Set(
    [...page.matchAll(/(?:src|href)="\/(public|src)\/([^"]+)"/g)].map((match) => `${match[1]}/${match[2].split("?")[0]}`),
  );
  for (const assetPath of localAssets) await stat(resolve(assetPath));
  const localRoutes = new Set(
    [...page.matchAll(/href="(\/[^"]*)"/g)]
      .map((match) => match[1].split(/[?#]/)[0])
      .filter((route) => route && !route.startsWith("/public/") && !route.startsWith("/src/")),
  );
  for (const route of localRoutes) {
    const routeTarget = route.endsWith("/") ? `${route.slice(1)}index.html` : route.slice(1);
    await stat(resolve(routeTarget));
  }
}

assert.match(pages.tr, new RegExp(homepageCopy.programTitle.tr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(pages.en, new RegExp(homepageCopy.programTitle.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.doesNotMatch(pages.en, new RegExp(homepageCopy.programTitle.tr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(pages.en, /Show Ömer Karademir's result/);
assert.match(pages.tr, /Ömer Karademir sonucunu göster/);
assert.match(pages.tr, new RegExp(homepageCopy.faqHeading.tr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(pages.en, new RegExp(homepageCopy.faqHeading.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(pages.tr, new RegExp(homepageCopy.finalCtaTitle.tr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(pages.en, new RegExp(homepageCopy.finalCtaTitle.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(pages.tr, new RegExp(homepageCopy.footerBrandLine.tr));
assert.match(pages.en, new RegExp(homepageCopy.footerBrandLine.en));
assert.doesNotMatch(pages.tr, /İngilizce biliyorsun\. Artık konuş\./i);
assert.doesNotMatch(pages.en, /You know English\. Now speak\./i);

for (const locale of supportedHomepageLocales) {
  assert.equal(homepageLocales[locale].faqItems.length, 8);
  homepageLocales[locale].faqItems.forEach(({ question, answer }) => {
    assert.match(pages[locale], new RegExp(flexibleTextPattern(question)));
    assert.match(pages[locale], new RegExp(flexibleTextPattern(answer)));
  });
}

assert.match(pages.tr, /Star Speaker Career Flow/);
const turkishPerformanceCtas = [
  ...pages.tr.matchAll(
    /<a(?=[^>]*data-performance-link)(?=[^>]*href="([^"]+)")[^>]*>([\s\S]*?)<\/a>/g,
  ),
];
assert.equal(turkishPerformanceCtas.length, 5, "All five Turkish primary homepage CTAs must use the Performance Test.");
assert(turkishPerformanceCtas.every(([, target]) => target === "/tr/performans-testi/"));
assert(turkishPerformanceCtas.every(([cta]) => !/\btarget="_blank"/.test(cta)));
assert.equal(
  turkishPerformanceCtas.filter(([, , content]) => /Ücretsiz Performans Testi/.test(content)).length,
  3,
);
assert.match(pages.tr, /<span>Ücretsiz Performans Testini Başlat<\/span>/);
assert.doesNotMatch(pages.en, /data-performance-link|\/tr\/performans-testi\//);
assert.equal(
  (pages.en.match(/class="stage-home-nav-cta"/g) ?? []).length,
  2,
  "English desktop and mobile header CTAs must remain localized.",
);
assert.equal((pages.en.match(/Free Speaking Analysis/g) ?? []).length, 3);
assert.match(pages.tr, /17\.000 TL/);
assert.match(pages.tr, /23\.000 TL/);
assert.match(pages.tr, /12\.000 TL/);
assert.match(pages.tr, /21 Günlük İngilizce Performans Sprinti/);
assert.match(pages.tr, /Haftada 2 birebir konuşma çalışması/);
assert.match(pages.tr, /Haftada 3 birebir konuşma çalışması/);
assert.match(pages.tr, /Daha derin kişiselleştirme/iu);
assert.match(pages.tr, /Daha hızlı ve daha detaylı öncelik geri bildirimi/);
assert.match(pages.tr, /Daha yakın ve detaylı gelişim takibi/);
assert.match(pages.tr, /Öncelikli destek ve daha fazla öğretmen erişimi/);

assert.match(pages.en, /Star Speaker Career Flow/);
assert.match(pages.en, /17,000 TL/);
assert.match(pages.en, /23,000 TL/);
assert.match(pages.en, /12,000 TL/);
assert.match(pages.en, /21-Day English Performance Sprint/);
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
for (const hash of ["#programs", "#method", "#results", "#contact", "#faq"]) {
  assert.match(landingScript, new RegExp(hash));
}
assert.match(landingScript, /data-locale-link/);
assert.match(landingScript, /hashchange/);
assert.match(landingScript, /setFaqItem/);
assert.match(landingScript, /aria-expanded/);
assert.match(landingScript, /panel\.hidden/);
for (const eventName of [
  "homepage_viewed",
  "hero_cta_clicked",
  "whatsapp_clicked",
  "program_section_viewed",
  "program_cta_clicked",
  "test_cta_clicked",
  "faq_interacted",
  "final_cta_clicked",
]) {
  assert.match(`${landingScript}\n${pages.tr}`, new RegExp(eventName));
}
for (const field of ["locale", "source", "utm_source", "device_category"]) {
  assert.match(landingScript, new RegExp(field));
}

const forbiddenActivePhrases = [
  /English-Speaking Engineers/i,
  /İngilizce Konuşan Mühendisler/i,
  /Engineer Flow/i,
  /Mühendisliğini İngilizce/i,
  /Mühendisler İçin 21 Günlük/i,
  /15 dakikalık ücretsiz konuşma performans analizi/i,
];
for (const page of Object.values(pages)) {
  for (const phrase of forbiddenActivePhrases) assert.doesNotMatch(page, phrase);
}

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
assert.match(sitemap, /https:\/\/starspeakerstudio\.com\/tr\/performans-testi\//);
assert.doesNotMatch(sitemap, /\.html/);

console.log("Homepage locale, navigation, metadata, and legacy-route checks passed.");
