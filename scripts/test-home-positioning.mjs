import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homepageCopy as copy, homepageLocales as locales } from '../src/i18n/homepage-locales.mjs';
const baselineSource=execFileSync('git',['show','a2904488b94d167fe33544e27d2b2a69b5ca1cbc:src/i18n/homepage-locales.mjs'],{encoding:'utf8'});
const baseline=await import('data:text/javascript;base64,'+Buffer.from(baselineSource).toString('base64'));
const normalize=s=>s.replace(/\s+/g,' ').trim();
for(const lang of ['en','tr']) {
 const html=fs.readFileSync(`${lang}/index.html`,'utf8');
 const text=normalize(html.replace(/<[^>]*>/g,' '));
 assert.deepEqual(locales[lang].stories,baseline.homepageLocales[lang].stories,'Published testimonial evidence must stay exact');
 for(const [key,entry] of Object.entries(baseline.homepageCopy)) {
  if(/^(flow|star|superStar|sprint)/.test(key)&&!['starPlans'].includes(key)) {
   assert.deepEqual(copy[key],entry,`Published offer changed: ${key}`);
   assert(normalize(html).includes(normalize(entry[lang])),`Missing offer fact: ${lang}/${key}`);
  }
 }
 for(const item of locales[lang].faqItems) {
  const visible=html.slice(html.indexOf('<section class="stage-closing-faq"'));
  assert(normalize(visible).includes(normalize(item.answer)),'Visible FAQ must match locale data');
 }
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 assert.deepEqual(graph[2].mainEntity.map(x=>x.acceptedAnswer.text),locales[lang].faqItems.map(x=>x.answer));
 assert(!('areaServed' in graph[1]));
 assert.equal(graph[1].name,baseline.homepageCopy.serviceName[lang]);
 assert.equal(graph[1].serviceType,baseline.homepageCopy.serviceType[lang]);
 assert(!/Worldwide|three.minute|3 dakika|üç dakika|main speaking problem|ana konuşma problemi|compare the two recordings/i.test(html));
 assert(!html.includes('/en/performans-testi/'));
 assert(html.includes('hreflang="x-default" href="https://starspeakerstudio.com/en/"'));
 assert(text.includes(copy.footerBrandLine[lang]));
 assert(text.includes(copy.heroTitleOne[lang]+' '+copy.heroTitleTwo[lang]));
 assert(text.includes(copy.brandDescriptor[lang]));
 assert.equal((html.match(/<section class="stage-situations"/g)||[]).length,1);
 assert.equal((html.match(/<li class="stage-method-step /g)||[]).length,5);
 assert(html.indexOf('id="method"')<html.indexOf('id="programs"'));
 assert(html.indexOf('id="programs"')<html.indexOf('id="results"'));
}
console.log('Positioning: exact offer and testimonial preservation, FAQ parity, claims, hero, situations, order, footer and x-default passed.');
