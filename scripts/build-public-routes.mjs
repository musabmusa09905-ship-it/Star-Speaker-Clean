import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const supportedHashes = new Set(["#programs", "#method", "#results", "#contact", "#faq"]);

const legacyRoutes = new Map([
  ["programs.html", "#programs"],
  ["program.html", "#programs"],
  ["program/index.html", "#programs"],
  ["method.html", "#method"],
  ["method/index.html", "#method"],
  ["results.html", "#results"],
  ["results/index.html", "#results"],
  ["about.html", ""],
  ["about/index.html", ""],
  ["apply.html", ""],
  ["apply/index.html", ""],
  ["resources.html", ""],
  ["resources/index.html", ""],
  ["level-test.html", ""],
  ["level-test/index.html", ""],
]);

function rootRedirectDocument() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, follow">
    <meta http-equiv="refresh" content="0; url=/en/">
    <link rel="canonical" href="https://starspeakerstudio.com/en/">
    <link rel="alternate" hreflang="tr" href="https://starspeakerstudio.com/tr/">
    <link rel="alternate" hreflang="en" href="https://starspeakerstudio.com/en/">
    <link rel="alternate" hreflang="x-default" href="https://starspeakerstudio.com/en/">
    <title>Star Speaker</title>
    <script>
      (() => {
        const query = new URLSearchParams(location.search);
        const requestedLocale = query.get("lang");
        const locale = requestedLocale === "tr" ? "tr" : "en";
        query.delete("lang");
        const search = query.size ? \`?\${query}\` : "";
        const supportedHashes = new Set(${JSON.stringify([...supportedHashes])});
        const hash = supportedHashes.has(location.hash) ? location.hash : "";
        location.replace(\`/\${locale}/\${search}\${hash}\`);
      })();
    </script>
  </head>
  <body>
    <p><a href="/en/">Open the Star Speaker English homepage</a></p>
  </body>
</html>
`;
}

function legacyRedirectDocument(route, hash) {
  const fallbackTarget = `/tr/${hash}`;
  return `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, follow">
    <meta http-equiv="refresh" content="0; url=${fallbackTarget}">
    <link rel="canonical" href="https://starspeakerstudio.com/tr/">
    <title>Star Speaker</title>
    <script>
      (() => {
        const query = new URLSearchParams(location.search);
        const requestedLocale = query.get("lang");
        const locale = requestedLocale === "en" ? "en" : "tr";
        query.delete("lang");
        const search = query.size ? \`?\${query}\` : "";
        location.replace(\`/\${locale}/\${search}${hash}\`);
      })();
    </script>
  </head>
  <body data-legacy-route="${route}">
    <p><a href="${fallbackTarget}">Star Speaker ana sayfasına devam et</a></p>
  </body>
</html>
`;
}

await writeFile(resolve(repositoryRoot, "index.html"), rootRedirectDocument(), "utf8");

for (const [route, hash] of legacyRoutes) {
  await mkdir(dirname(resolve(repositoryRoot, route)), { recursive: true });
  await writeFile(resolve(repositoryRoot, route), legacyRedirectDocument(route, hash), "utf8");
}

await writeFile(
  resolve(repositoryRoot, "robots.txt"),
  "User-agent: *\nAllow: /\n\nSitemap: https://starspeakerstudio.com/sitemap.xml\n",
  "utf8",
);

await writeFile(
  resolve(repositoryRoot, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://starspeakerstudio.com/tr/</loc>
    <xhtml:link rel="alternate" hreflang="tr" href="https://starspeakerstudio.com/tr/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://starspeakerstudio.com/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://starspeakerstudio.com/en/"/>
  </url>
  <url>
    <loc>https://starspeakerstudio.com/en/</loc>
    <xhtml:link rel="alternate" hreflang="tr" href="https://starspeakerstudio.com/tr/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://starspeakerstudio.com/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://starspeakerstudio.com/en/"/>
  </url>
  <url>
    <loc>https://starspeakerstudio.com/tr/performans-testi/</loc>
  </url>
  <url>
    <loc>https://starspeakerstudio.com/en/speaking-analysis/</loc>
  </url>
</urlset>
`,
  "utf8",
);

console.log("Generated root route, legacy redirects, robots.txt, and sitemap.xml");
