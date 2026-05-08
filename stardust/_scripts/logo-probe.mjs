// Quick targeted logo probe — grab whatever is inside a.srf-header__logo
import { chromium } from 'playwright';
import fs from 'node:fs';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('https://www.semrush.com/', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(2500);

const result = await page.evaluate(() => {
  const cs = (el) => window.getComputedStyle(el);
  const a = document.querySelector('a.srf-header__logo, header a[href="/"], header [class*="logo"]');
  if (!a) return { found: false };
  const c = cs(a);
  const svg = a.querySelector('svg');
  const img = a.querySelector('img');
  const r = a.getBoundingClientRect();
  return {
    found: true,
    domPath: a.tagName.toLowerCase() + (a.className ? '.' + Array.from(a.classList).slice(0,2).join('.') : ''),
    width: r.width|0, height: r.height|0,
    backgroundImage: c.backgroundImage,
    innerHTML: a.innerHTML.slice(0, 8000),
    svgMarkup: svg ? svg.outerHTML.slice(0, 8000) : null,
    imgSrc: img ? (img.currentSrc || img.src) : null,
  };
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
