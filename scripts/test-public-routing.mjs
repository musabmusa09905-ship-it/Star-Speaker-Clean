import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { runInNewContext } from "node:vm";

function redirect(html, search, hash) {
  let destination;
  const source = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert(source, "Redirect must have an executable navigation script");
  runInNewContext(source, {
    URLSearchParams,
    location: { search, hash, replace(value) { destination = value; } },
  });
  return new URL(destination, "https://starspeakerstudio.com");
}

const root = await readFile("index.html", "utf8");
const hashes = ["#programs", "#method", "#results", "#contact", "#faq"];
const queries = [
  "?utm_source=instagram",
  "?utm_campaign=summer%20speaking&ref=a%2Bb&tag=one&tag=two",
  "?lang=en&utm_source=inspection&utm_campaign=test&safe=value",
  "?lang=tr&utm_source=instagram&return=%2Fen%2F%3Ftopic%3Dmeetings",
  "?lang=unsupported&safe=%3Cscript%3E",
  "",
];
for (const search of queries) {
  for (const hash of [...hashes, "", "#unknown"]) {
    const input = new URLSearchParams(search);
    const expectedLocale = input.get("lang") === "tr" ? "tr" : "en";
    input.delete("lang");
    const result = redirect(root, search, hash);
    assert.equal(result.pathname, `/${expectedLocale}/`);
    assert.deepEqual([...result.searchParams], [...input]);
    assert.equal(result.hash, hashes.includes(hash) ? hash : "");
  }
}

const landing = await readFile("src/scripts/landing.js", "utf8");
const switchSource = landing.match(/function syncLocaleLinks\(\) \{[\s\S]*?\n  \}/)?.[0];
assert(switchSource);
for (const search of queries) {
  for (const hash of [...hashes, "", "#unknown"]) {
    const links = ["en", "tr"].map(locale => ({ dataset: { localeLink: locale } }));
    runInNewContext(`${switchSource}; syncLocaleLinks();`, {
      URLSearchParams,
      supportedSectionHashes: new Set(hashes),
      window: { location: { search, hash } },
      document: { querySelectorAll: () => links },
    });
    for (const link of links) {
      const result = new URL(link.href, "https://starspeakerstudio.com");
      const expected = new URLSearchParams(search);
      expected.delete("lang");
      assert.equal(result.pathname, `/${link.dataset.localeLink}/`);
      assert.deepEqual([...result.searchParams], [...expected]);
      assert.equal(result.hash, hashes.includes(hash) ? hash : "");
    }
  }
}

for (const [name, hash] of Object.entries({ program: "#programs", method: "#method", results: "#results", about: "", apply: "", "level-test": "", resources: "" })) {
  assert((await stat(name)).isDirectory(), `${name} must never be a downloadable extensionless file`);
  for (const path of [`${name}/index.html`, `${name}.html`]) {
    const html = await readFile(path, "utf8");
    const result = redirect(html, "?lang=en&utm_source=legacy&safe=one%20two", "#obsolete");
    assert.equal(result.pathname, "/en/");
    assert.equal(result.hash, hash);
    assert.equal(result.searchParams.get("utm_source"), "legacy");
    assert.equal(result.searchParams.get("safe"), "one two");
    assert.equal(result.searchParams.has("lang"), false);
  }
}
const notFound = await readFile("404.html", "utf8");
assert.match(notFound, /href="\/en\/"/);
assert.match(notFound, /href="\/tr\/"/);
assert.doesNotMatch(notFound, /location\.replace|http-equiv="refresh"/);
console.log("Public routing: root/locale query and hash matrix, legacy HTML compatibility, neutral fallback and 404 passed.");
