import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '../../StarSpeaker-App/node_modules/playwright/index.mjs';
const base='https://starspeakerstudio.com';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
  const page=await browser.newPage();
  await page.route('**/*.supabase.co/**',r=>r.abort());
  const route=await page.goto(base+'/en/speaking-analysis/'); assert.equal(route.status(),200);
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),base+'/en/speaking-analysis/');
  for(const selector of ['title','meta[name=description]','meta[property="og:title"]','meta[property="og:description"]','meta[property="og:url"]','meta[property="og:image"]','meta[name="twitter:card"]','meta[name="twitter:title"]','meta[name="twitter:description"]','meta[name="twitter:image"]']) assert.equal(await page.locator(selector).count(),1,selector);
  const assets=await page.locator('script[src],link[rel=stylesheet]').evaluateAll(es=>es.map(e=>e.src||e.href));
  for(const url of assets){ const r=await fetch(url); assert.equal(r.status,200,url); }
  const sitemap=await (await fetch(base+'/sitemap.xml')).text();
  for(const path of ['/en/speaking-analysis/','/tr/performans-testi/']) assert.equal(sitemap.split(base+path).length-1,1);
  await mkdir('../english-production-qa',{recursive:true});
  for(const width of [320,360,390,768,1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto(base+'/en/');
    await page.locator('[data-performance-link]').first().waitFor({state:'attached'});
    const links=await page.locator('[data-performance-link]').evaluateAll(es=>es.map(e=>({text:e.textContent.trim(),href:e.getAttribute('href'),location:e.dataset.homeLocation})));
    assert.equal(links.length,5); assert(links.every(l=>l.text==='Free Speaking Analysis'&&l.href==='/en/speaking-analysis/'));
    assert.deepEqual(links.map(l=>l.location),['header','mobile_header','hero','program_analysis','final_cta']);
    assert.equal(await page.locator('[data-whatsapp-link]').count(),1);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'homepage overflow '+width);
    await page.screenshot({path:'../english-production-qa/home-en-'+width+'.png'});
    console.log('PASS live homepage CTA and layout '+width);
  }
  await page.goto(base+'/?utm_source=release_qa&utm_campaign=rollout#programs');
  await page.waitForURL('**/en/?**');
  assert.equal(new URL(page.url()).searchParams.get('utm_source'),'release_qa');
  assert.equal(new URL(page.url()).hash,'#programs');
  const tr=page.locator('[data-locale-link=tr]').first(); const trURL=new URL(await tr.getAttribute('href'),base);
  assert.equal(trURL.searchParams.get('utm_campaign'),'rollout'); await page.goto(trURL.href);
  assert.equal(await page.locator('html').getAttribute('lang'),'tr');
  assert.equal(await page.locator('[data-performance-link][href="/tr/performans-testi/"]').count(),5);
  const missing=await page.goto(base+'/release-qa-missing-page'); assert.equal(missing.status(),404); assert(await page.locator('a[href="/en/"]').count());
  const http=await fetch('http://starspeakerstudio.com/',{redirect:'manual'}); assert([301,302,307,308].includes(http.status)); assert.match(http.headers.get('location'),/^https:/);
  console.log('PASS live route metadata/assets, sitemap, root English, Turkish, UTM/language switch, 404 and HTTPS');
} finally {await browser.close();}

