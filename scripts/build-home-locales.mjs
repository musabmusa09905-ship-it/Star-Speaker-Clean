import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  homepageCopy,
  homepageLocales,
  supportedHomepageLocales,
  validateHomepageLocales,
} from "../src/i18n/homepage-locales.mjs";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(repositoryRoot, "tr", "index.html");

function flexibleTextPattern(value) {
  return value
    .trim()
    .split(/\s+/)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("\\s+");
}

function translatePage(source, locale) {
  let output = source;
  const storyTranslations = homepageLocales.tr.stories.flatMap((story, index) =>
    Object.keys(story).map((key) => ({
      tr: story[key],
      en: homepageLocales.en.stories[index][key],
    })),
  );
  const faqTranslations = homepageLocales.tr.faqItems.flatMap((item, index) =>
    Object.keys(item).map((key) => ({
      tr: item[key],
      en: homepageLocales.en.faqItems[index][key],
    })),
  );
  const translations = [...Object.values(homepageCopy), ...storyTranslations, ...faqTranslations].sort(
    (a, b) => b.tr.length - a.tr.length,
  );

  if (locale === "en") {
    translations.forEach(({ tr, en }) => {
      if (tr === en) return;
      output = output.replace(new RegExp(flexibleTextPattern(tr), "gu"), en);
    });
  }

  output = output.replace(/<html lang="(?:tr|en)">/, `<html lang="${locale}">`);
  output = output.replace(
    /<link rel="canonical" href="[^"]+">/,
    `<link rel="canonical" href="https://starspeakerstudio.com/${locale}/">`,
  );
  output = output.replace(
    /<meta property="og:url" content="[^"]+">/,
    `<meta property="og:url" content="https://starspeakerstudio.com/${locale}/">`,
  );
  output = output.replace(/href="\/tr\/"\s+data-home-link/, `href="/${locale}/" data-home-link`);
  output = output.replace(/\s+aria-current="page"/g, "");
  output = output.replace(/stage-home-lang-button is-active/g, "stage-home-lang-button");
  output = output.replace(
    new RegExp(`class="stage-home-lang-button"\\s+href="/${locale}/"`, "g"),
    `class="stage-home-lang-button is-active" href="/${locale}/" aria-current="page"`,
  );

  output = output.replace(/\b(href|src|data-src)="(public|src)\//g, '$1="/$2/');
  output = output.replace(
    /https:\/\/wa\.me\/905525247746\?text=[^"]+/g,
    `https://wa.me/905525247746?text=${encodeURIComponent(homepageLocales[locale].whatsappMessage)}`,
  );
  if (locale === "en") {
    output = output.replace(
      /^([ \t]*)data-performance-link\s+href="\/tr\/performans-testi\/"/gm,
      (_, indentation) => `${indentation}data-whatsapp-link
${indentation}href="https://wa.me/905525247746?text=${encodeURIComponent(homepageLocales.en.whatsappMessage)}"
${indentation}target="_blank"
${indentation}rel="noopener noreferrer"`,
    );
  }
  const faqEntities = homepageLocales[locale].faqItems.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  }));
  output = output.replace('"mainEntity": []', `"mainEntity": ${JSON.stringify(faqEntities)}`);
  return output;
}

validateHomepageLocales();
const source = await readFile(sourcePath, "utf8");

for (const locale of supportedHomepageLocales) {
  const destination = resolve(repositoryRoot, locale, "index.html");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, translatePage(source, locale), "utf8");
}

console.log("Generated localized homepages: /tr/ and /en/");
