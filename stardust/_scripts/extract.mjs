// stardust:extract — semrush.com Phase 2 per-page extractor.
// Runs Playwright @ 1440x900 @ 2x DPR, prefers-reduced-motion, scroll-pass.
// Output: stardust/current/pages/<slug>.json + screenshots + media downloads.

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import https from 'node:https';
import http from 'node:http';

const ROOT = '/Users/paolo/excat/tmp/migrate-semrush';
const OUT_PAGES = path.join(ROOT, 'stardust/current/pages');
const OUT_SHOTS = path.join(ROOT, 'stardust/current/assets/screenshots');
const OUT_MEDIA = path.join(ROOT, 'stardust/current/assets/media');
const OUT_LOG = path.join(ROOT, 'stardust/current/_crawl-log.json');

fs.mkdirSync(OUT_PAGES, { recursive: true });
fs.mkdirSync(OUT_SHOTS, { recursive: true });
fs.mkdirSync(OUT_MEDIA, { recursive: true });

const STARDUST_VERSION = '0.3.0';
const WAIT_MODE = 'medium';
const WAIT_GRACE_MS = 2000;
const HARD_CAP_MS = 8000;

const PAGES = [
  { slug: 'home',     url: 'https://www.semrush.com/' },
  { slug: 'pricing',  url: 'https://www.semrush.com/pricing/' },
  { slug: 'features', url: 'https://www.semrush.com/features/' },
  { slug: 'features__keyword-magic-tool',
                       url: 'https://www.semrush.com/features/keyword-magic-tool/' },
  { slug: 'company',  url: 'https://www.semrush.com/company/' },
];

// ---------- helpers ----------

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

function shortHash(s) { return sha256(s).slice(0, 8); }

function hostOf(u) { try { return new URL(u).host; } catch { return null; } }

async function downloadBinary(url, destDir) {
  return new Promise((resolve) => {
    let lib;
    try { lib = url.startsWith('https:') ? https : http; }
    catch { return resolve({ ok: false, error: 'invalid-scheme' }); }
    const u = new URL(url);
    const ext = (path.extname(u.pathname) || '').toLowerCase();
    const safeBase = path.basename(u.pathname).replace(/[^a-z0-9_.-]/gi, '_').slice(0, 60) || 'asset';
    const hash = shortHash(url);
    const filename = `${safeBase.replace(/(\.[^.]+)?$/, '')}-${hash}${ext || ''}`;
    const dest = path.join(destDir, filename);
    if (fs.existsSync(dest)) return resolve({ ok: true, localPath: path.relative(ROOT, dest) });
    const req = lib.get(url, { headers: { 'User-Agent': 'stardust/0.3.0' }, timeout: 15000 }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // follow one redirect
        const next = new URL(res.headers.location, url).href;
        downloadBinary(next, destDir).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        return resolve({ ok: false, error: `HTTP ${res.statusCode}` });
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        try {
          fs.writeFileSync(dest, Buffer.concat(chunks));
          resolve({ ok: true, localPath: path.relative(ROOT, dest) });
        } catch (e) {
          resolve({ ok: false, error: e.message });
        }
      });
    });
    req.on('error', (e) => resolve({ ok: false, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, error: 'timeout' }); });
  });
}

// ---------- in-page extractor (runs in browser context) ----------

const pageCaptureFn = `async () => {
  const u = (n) => (n == null ? null : n);
  const text = (el) => (el?.innerText || '').replace(/\\s+/g, ' ').trim();
  const cs = (el) => window.getComputedStyle(el);
  const rect = (el) => { try { const r = el.getBoundingClientRect(); return { x: r.x|0, y: r.y|0, width: r.width|0, height: r.height|0 }; } catch { return null; } };

  const domPath = (el) => {
    if (!el || el === document.body) return 'body';
    const parts = [];
    let n = el;
    while (n && n.nodeType === 1 && n !== document.body && parts.length < 8) {
      let s = n.tagName.toLowerCase();
      if (n.id) s += '#' + n.id;
      else if (n.classList && n.classList.length) s += '.' + Array.from(n.classList).slice(0,2).join('.');
      const sib = Array.from(n.parentNode ? n.parentNode.children : []).filter(c => c.tagName === n.tagName);
      if (sib.length > 1) s += ':nth-of-type(' + (sib.indexOf(n) + 1) + ')';
      parts.unshift(s);
      n = n.parentNode;
    }
    return parts.join(' > ');
  };

  // --- meta
  const metaName = (n) => document.querySelector('meta[name="' + n + '"]')?.content || null;
  const metaProp = (p) => document.querySelector('meta[property="' + p + '"]')?.content || null;
  const themeColorLight = document.querySelector('meta[name="theme-color"][media*="light"]')?.content
    || document.querySelector('meta[name="theme-color"]:not([media])')?.content
    || metaName('theme-color');
  const themeColorDark = document.querySelector('meta[name="theme-color"][media*="dark"]')?.content || null;

  // --- headings
  const headingEls = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
  const headings = headingEls.map((h, i) => {
    const c = cs(h);
    return {
      level: parseInt(h.tagName.substring(1), 10),
      text: text(h),
      id: u(h.id) || null,
      domPath: domPath(h),
      style: {
        fontFamily: c.fontFamily,
        fontWeight: parseInt(c.fontWeight, 10) || c.fontWeight,
        fontSize: c.fontSize,
        lineHeight: c.lineHeight,
        letterSpacing: c.letterSpacing,
        color: c.color,
      },
    };
  });

  // --- landmarks
  const landmarkSel = 'header,nav,main,aside,footer,[role=banner],[role=navigation],[role=main],[role=complementary],[role=contentinfo],[role=region]';
  const landmarkEls = Array.from(document.querySelectorAll(landmarkSel));
  const landmarks = landmarkEls.map((el) => {
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role') || (['header','nav','main','aside','footer'].includes(tag) ? tag.replace('header','banner').replace('footer','contentinfo').replace('nav','navigation').replace('aside','complementary') : null);
    const sections = Array.from(el.querySelectorAll(':scope > section, :scope > div > section')).slice(0, 24);
    const headSeq = sections.map((s) => {
      const h = s.querySelector('h1,h2,h3');
      return h ? text(h).slice(0, 80) : null;
    }).filter(Boolean);
    return {
      tag,
      role,
      id: el.id || null,
      classes: Array.from(el.classList).slice(0, 8),
      innerText: text(el).slice(0, 4000),
      headingSequence: headSeq,
      children: sections.map((s) => {
        const head = s.querySelector('h1,h2,h3,h4');
        const className = (s.className || '').toString();
        const headText = head ? text(head).toLowerCase() : '';
        const hasForm = !!s.querySelector('form');
        let purpose = 'unknown';
        if (className.match(/hero/i) || s.querySelector(':scope > h1')) purpose = 'hero';
        else if (s.querySelectorAll(':scope img, :scope svg[role=img]').length >= 4 && text(s).length < 200) purpose = 'social-proof';
        else if (hasForm) purpose = 'form';
        else if (headText.match(/get started|start now|sign up|talk to|contact us/)) purpose = 'cta-band';
        else if (s.querySelectorAll(':scope > div, :scope > ul > li').length >= 3 && className.match(/feature|grid|card/i)) purpose = 'feature-list';
        else if (text(s).length > 600) purpose = 'rich-text';
        return {
          tag: s.tagName.toLowerCase(),
          role: s.getAttribute('role') || null,
          id: s.id || null,
          classes: Array.from(s.classList).slice(0, 6),
          purpose,
          headlineRef: head ? headingEls.indexOf(head) : null,
          innerTextSummary: text(s).slice(0, 240),
          wordCount: text(s).split(/\\s+/).filter(Boolean).length,
        };
      }),
    };
  });

  // --- CTAs (visually-button-like)
  const ctaCandidates = Array.from(document.querySelectorAll('button, [role=button], a'));
  const fold = 900;
  const ctas = [];
  for (const el of ctaCandidates) {
    if (!el.offsetParent && el.tagName !== 'A') continue;
    const c = cs(el);
    const bg = c.backgroundColor;
    const isVisualBtn =
      el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' ||
      (el.tagName === 'A' &&
        bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' &&
        parseFloat(c.borderRadius) > 1 &&
        (parseFloat(c.paddingTop) + parseFloat(c.paddingBottom)) > 6);
    if (!isVisualBtn) continue;
    const r = rect(el);
    if (!r || r.width < 4 || r.height < 4) continue;
    const label = text(el);
    if (!label || label.length > 80) continue;
    ctas.push({
      label,
      href: el.getAttribute('href') || null,
      tag: el.tagName.toLowerCase(),
      domPath: domPath(el),
      style: {
        backgroundColor: c.backgroundColor,
        color: c.color,
        fontFamily: c.fontFamily,
        fontWeight: parseInt(c.fontWeight,10) || c.fontWeight,
        borderRadius: c.borderRadius,
        padding: c.padding,
        boxShadow: c.boxShadow,
      },
      appearsAbove: r.y < fold ? 'fold' : 'below-fold',
    });
    if (ctas.length >= 60) break;
  }

  // --- links
  const allLinks = Array.from(document.querySelectorAll('a[href]'));
  const internal = [], external = [];
  const seen = new Set();
  for (const a of allLinks) {
    const href = a.getAttribute('href');
    if (!href) continue;
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('javascript:')) continue;
    let absUrl;
    try { absUrl = new URL(href, location.href).href; } catch { continue; }
    const host = new URL(absUrl).host;
    const linkText = text(a).slice(0, 120);
    const key = absUrl + '|' + linkText;
    if (seen.has(key)) continue;
    seen.add(key);
    const entry = { href: absUrl, text: linkText, domPath: domPath(a) };
    if (host === location.host) internal.push(entry);
    else external.push(entry);
    if (internal.length + external.length > 400) break;
  }

  // --- media
  const imgs = Array.from(document.querySelectorAll('img'));
  const images = imgs.slice(0, 80).map((img) => ({
    src: img.currentSrc || img.src || null,
    srcset: img.getAttribute('srcset'),
    alt: img.getAttribute('alt') || '',
    naturalWidth: img.naturalWidth || null,
    naturalHeight: img.naturalHeight || null,
    domPath: domPath(img),
  }));
  const inlineSvgs = Array.from(document.querySelectorAll('svg')).slice(0, 60).map((svg) => ({
    viewBox: svg.getAttribute('viewBox'),
    domPath: domPath(svg),
    width: svg.getAttribute('width'),
    height: svg.getAttribute('height'),
    markupLength: svg.outerHTML.length,
  }));
  const cssBackgrounds = [];
  const allEls = document.querySelectorAll('*');
  let cssBgCount = 0;
  for (const el of allEls) {
    if (cssBgCount > 60) break;
    const c = cs(el);
    const bi = c.backgroundImage;
    if (!bi || bi === 'none') continue;
    const urls = Array.from(bi.matchAll(/url\\(["']?([^"')]+)["']?\\)/g)).map(m => m[1]);
    if (!urls.length) continue;
    const r = rect(el);
    if (!r || r.width < 100 || r.height < 80) continue;
    for (const url of urls) {
      cssBackgrounds.push({
        url: new URL(url, location.href).href,
        domPath: domPath(el),
        boundingClientRect: r,
        backgroundSize: c.backgroundSize,
        backgroundPosition: c.backgroundPosition,
        backgroundRepeat: c.backgroundRepeat,
      });
      cssBgCount++;
    }
  }
  const videos = Array.from(document.querySelectorAll('video')).slice(0,20).map(v => ({
    src: v.currentSrc || v.src || null,
    poster: v.getAttribute('poster') || null,
  }));
  const iframes = Array.from(document.querySelectorAll('iframe')).slice(0,30).map((f) => {
    const r = rect(f);
    const fHost = (() => { try { return new URL(f.src, location.href).host; } catch { return null; } })();
    return {
      src: f.src || null,
      title: f.getAttribute('title') || null,
      crossOrigin: fHost && fHost !== location.host,
      boundingClientRect: r,
    };
  });

  // --- forms
  const forms = Array.from(document.querySelectorAll('form')).slice(0,10).map((f) => {
    const fields = Array.from(f.querySelectorAll('input,select,textarea')).slice(0,30).map((i) => ({
      type: i.type || i.tagName.toLowerCase(),
      name: i.getAttribute('name') || null,
      label: (() => {
        const id = i.id;
        if (id) {
          const lab = document.querySelector('label[for="' + id + '"]');
          if (lab) return text(lab).slice(0,80);
        }
        const wrap = i.closest('label');
        if (wrap) return text(wrap).slice(0,80);
        return i.getAttribute('placeholder') || null;
      })(),
      required: i.required || i.getAttribute('aria-required') === 'true',
    }));
    let thirdParty = null;
    const action = (f.action || '').toLowerCase();
    if (action.includes('stripe')) thirdParty = 'stripe';
    else if (action.includes('calendly')) thirdParty = 'calendly';
    else if (action.includes('typeform')) thirdParty = 'typeform';
    else if (action.includes('mailchimp') || action.includes('list-manage')) thirdParty = 'mailchimp';
    return { action: f.action || null, method: (f.method || 'get').toLowerCase(), fields, thirdParty };
  });

  // --- widgets
  const widgets = {
    modals: Array.from(document.querySelectorAll('dialog,[role=dialog]')).slice(0,10).map(el => ({
      domPath: domPath(el),
      open: el.hasAttribute('open') || cs(el).display !== 'none',
    })),
    accordions: Array.from(document.querySelectorAll('details')).slice(0,30).map(el => ({
      domPath: domPath(el),
      itemCount: 1,
    })),
    tabs: Array.from(document.querySelectorAll('[role=tablist]')).slice(0,10).map(el => ({
      domPath: domPath(el),
      tabCount: el.querySelectorAll('[role=tab]').length,
    })),
  };

  // --- components inventory (closed list)
  const compEx = (sel, n=2) => Array.from(document.querySelectorAll(sel)).slice(0,n).map(domPath);
  const components = {
    cards:           { count: document.querySelectorAll('.card, [class*="card"]:not([class*="card-grid"])').length, examples: compEx('.card, [class*="card"]') },
    grids:           { count: document.querySelectorAll('[class*="grid"]').length, examples: compEx('[class*="grid"]') },
    accordions:      { count: document.querySelectorAll('details').length, examples: compEx('details') },
    tabs:            { count: document.querySelectorAll('[role=tablist]').length, examples: compEx('[role=tablist]') },
    tables:          { count: document.querySelectorAll('table:not([role=presentation])').length, examples: compEx('table') },
    modals:          { count: document.querySelectorAll('dialog,[role=dialog]').length, examples: compEx('dialog,[role=dialog]') },
    carousels:       { count: document.querySelectorAll('[class*="carousel"],[class*="swiper"],[class*="slick"]').length, examples: compEx('[class*="carousel"],[class*="swiper"]') },
    videos:          { count: document.querySelectorAll('video').length, examples: compEx('video') },
    iframes:         { count: document.querySelectorAll('iframe').length, examples: compEx('iframe') },
    dataVizEmbeds:   { count: document.querySelectorAll('iframe[src*="datawrapper"],iframe[src*="flourish"],[class*="chart"]').length, examples: compEx('iframe[src*="datawrapper"],[class*="chart"]') },
    teamTiles:       { count: document.querySelectorAll('[class*="team"] [class*="member"],[class*="staff"]').length, examples: compEx('[class*="team"] [class*="member"]') },
    pricingTiles:    { count: document.querySelectorAll('[class*="pricing"] [class*="tier"],[class*="plan"][class*="card"]').length, examples: compEx('[class*="pricing"] [class*="plan"],[class*="plan-card"]') },
    testimonialCards:{ count: document.querySelectorAll('[class*="testimonial"], blockquote').length, examples: compEx('[class*="testimonial"]') },
    logoStrip:       { count: document.querySelectorAll('[class*="logos"], [class*="logo-strip"], [class*="customers"]').length, examples: compEx('[class*="logos"]') },
    timeline:        { count: document.querySelectorAll('[class*="timeline"]').length, examples: compEx('[class*="timeline"]') },
    breadcrumbs:     { count: document.querySelectorAll('nav[aria-label*="breadcrumb" i],[class*="breadcrumb"]').length, examples: compEx('nav[aria-label*="breadcrumb" i]') },
    statRow:         { count: document.querySelectorAll('[class*="stat"]').length, examples: compEx('[class*="stat"]') },
    ctaBand:         { count: document.querySelectorAll('[class*="cta"]').length, examples: compEx('[class*="cta"]') },
    formFields:      { count: document.querySelectorAll('form input, form textarea, form select').length, examples: [] },
    other:           [],
  };

  // --- per-section style
  const main = document.querySelector('main') || document.body;
  const sectionEls = Array.from(main.querySelectorAll(':scope > section, :scope > div > section')).slice(0, 16);
  const perSectionStyle = sectionEls.map((s) => {
    const c = cs(s);
    const bg = c.backgroundColor;
    const hasImg = c.backgroundImage && c.backgroundImage !== 'none' && !c.backgroundImage.startsWith('linear-gradient') && !c.backgroundImage.startsWith('radial-gradient');
    const hasGrad = c.backgroundImage && (c.backgroundImage.includes('gradient'));
    // sample a child for radius
    const child = s.querySelector('a,button,[class*="card"]');
    const childCS = child ? cs(child) : null;
    return {
      sectionRef: domPath(s),
      purpose: 'unknown',
      background: { color: bg, hasImage: hasImg, hasGradient: hasGrad },
      text: { dominantColor: c.color },
      spacing: { paddingBlock: c.paddingTop + ' ' + c.paddingBottom, paddingInline: c.paddingLeft + ' ' + c.paddingRight, gap: c.gap },
      borderRadius: childCS ? childCS.borderRadius : c.borderRadius,
      fontFamilies: [c.fontFamily],
      shadowsUsed: childCS && childCS.boxShadow !== 'none' ? [childCS.boxShadow] : [],
    };
  });

  // --- embed dominance
  const dominantIframe = iframes.find((f) => {
    if (!f.boundingClientRect || !f.crossOrigin) return false;
    const cov = (f.boundingClientRect.width * f.boundingClientRect.height) / (1440 * 900);
    return cov > 0.5;
  });
  const embedDominance = dominantIframe
    ? { dominated: true, iframeSrc: dominantIframe.src, viewportCoveragePct: Math.round((dominantIframe.boundingClientRect.width * dominantIframe.boundingClientRect.height) / (1440 * 900) * 100), mainHeightCoveragePct: null, screenshot: null }
    : { dominated: false, iframeSrc: null, viewportCoveragePct: null, mainHeightCoveragePct: null, screenshot: null };

  // --- CSS custom properties on :root
  const rootCS = cs(document.documentElement);
  const cssCustomProperties = [];
  for (let i = 0; i < rootCS.length; i++) {
    const name = rootCS[i];
    if (name && name.startsWith('--')) {
      cssCustomProperties.push({ name, value: rootCS.getPropertyValue(name).trim() });
    }
  }

  // --- All button-like and CTA bg colors used (for palette aggregation we sample broadly)
  // gather a flat list of (selector, bg, color, fontFamily) on representative elements
  const styleSamples = [];
  const bodyCS = cs(document.body);
  styleSamples.push({ where: 'body', backgroundColor: bodyCS.backgroundColor, color: bodyCS.color, fontFamily: bodyCS.fontFamily });
  // iterate visible significant elements
  let sampleN = 0;
  for (const el of document.querySelectorAll('section, header, footer, nav, main, aside, [class*="card"], [class*="hero"], [class*="cta"], button, .btn, [role=button]')) {
    if (sampleN > 200) break;
    const r = rect(el);
    if (!r || r.width < 50 || r.height < 24) continue;
    const c = cs(el);
    styleSamples.push({
      where: domPath(el),
      backgroundColor: c.backgroundColor,
      color: c.color,
      fontFamily: c.fontFamily,
      fontWeight: c.fontWeight,
      fontSize: c.fontSize,
      lineHeight: c.lineHeight,
      borderRadius: c.borderRadius,
      boxShadow: c.boxShadow,
      padding: c.padding,
      borderColor: c.borderColor,
    });
    sampleN++;
  }

  // --- icons for logo locator
  const headerLogoSvg = document.querySelector('header svg, [role=banner] svg, nav svg');
  const headerLogoImg = document.querySelector('header img[alt*="emrush" i], header img[src*="logo" i], header img[class*="logo" i], [role=banner] img[alt*="emrush" i]');
  const appleTouch = document.querySelector('link[rel="apple-touch-icon"]')?.href || null;
  const ogImage = metaProp('og:image');
  const favIcon = document.querySelector('link[rel="icon"]')?.href || null;

  return {
    title: document.title || null,
    metaDescription: metaName('description'),
    canonical: document.querySelector('link[rel=canonical]')?.href || null,
    og: {
      title: metaProp('og:title'),
      description: metaProp('og:description'),
      image: ogImage,
      type: metaProp('og:type'),
      siteName: metaProp('og:site_name'),
    },
    themeColor: { light: themeColorLight, dark: themeColorDark },
    language: document.documentElement.lang || null,
    headings,
    landmarks,
    ctas,
    links: { internal, external },
    media: { images, inlineSvgs, cssBackgrounds, videos, iframes },
    forms,
    widgets,
    components,
    perSectionStyle,
    embedDominance,
    cssCustomProperties,
    logoCandidates: {
      inlineSvg: headerLogoSvg ? { domPath: domPath(headerLogoSvg), markup: headerLogoSvg.outerHTML.slice(0, 4000), width: headerLogoSvg.getBoundingClientRect().width } : null,
      img: headerLogoImg ? { src: headerLogoImg.currentSrc || headerLogoImg.src, alt: headerLogoImg.alt } : null,
      appleTouch,
      ogImage,
      favicon: favIcon,
    },
    styleSamples,
    body: {
      firstParagraph: (() => {
        const p = document.querySelector('main p, article p, body p');
        return p ? text(p).slice(0, 600) : null;
      })(),
    },
  };
}`;

// ---------- runner ----------

async function extractOne(browserContext, page, idx) {
  const t0 = Date.now();
  const startedAt = new Date().toISOString();
  let httpStatus = null;
  let contentType = null;
  let waitModeUsed = WAIT_MODE;
  let finalUrl = page.url;
  let fail = null;

  const context = browserContext;
  const pw = await context.newPage();
  await pw.setViewportSize({ width: 1440, height: 900 });
  await pw.emulateMedia({ reducedMotion: 'reduce' });

  try {
    const resp = await pw.goto(page.url, { waitUntil: 'domcontentloaded', timeout: HARD_CAP_MS });
    if (resp) {
      httpStatus = resp.status();
      contentType = (resp.headers()['content-type'] || '').split(';')[0];
    }
    if (httpStatus && httpStatus >= 400) {
      fail = { errorClass: 'HTTPError', message: `HTTP ${httpStatus}` };
    }
    if (!fail && contentType && !contentType.startsWith('text/html') && !contentType.startsWith('application/xhtml+xml')) {
      fail = { errorClass: 'ContentTypeError', message: `unexpected content-type: ${contentType}` };
    }
    if (!fail) {
      // grace
      await pw.waitForTimeout(WAIT_GRACE_MS);
      // scroll pass: 4 viewport-height steps with 300ms pauses
      await pw.evaluate(async () => {
        const vh = window.innerHeight;
        for (let i = 1; i <= 4; i++) {
          window.scrollTo(0, vh * i);
          await new Promise(r => setTimeout(r, 300));
        }
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 300));
      });
      finalUrl = pw.url();
    }
  } catch (e) {
    fail = { errorClass: e.name === 'TimeoutError' ? 'TimeoutError' : 'NetworkError', message: e.message };
  }

  if (fail) {
    await pw.close();
    const waitMs = Date.now() - t0;
    return { ok: false, slug: page.slug, url: page.url, error: fail, waitMs, waitMode: waitModeUsed };
  }

  // --- screenshot
  const shotPath = path.join(OUT_SHOTS, `${page.slug}.png`);
  try {
    await pw.screenshot({ path: shotPath, fullPage: true });
  } catch (e) {
    console.error(`screenshot fail ${page.slug}:`, e.message);
  }

  // --- run capture
  let captured;
  try {
    captured = await pw.evaluate(`(${pageCaptureFn})()`);
  } catch (e) {
    await pw.close();
    return { ok: false, slug: page.slug, url: page.url, error: { errorClass: 'CaptureError', message: e.message }, waitMs: Date.now() - t0, waitMode: waitModeUsed };
  }

  // soft-404 check
  const hasText = captured.landmarks.some(l => l.innerText && l.innerText.length > 20);
  const hasH = captured.headings.length > 0;
  const hasImgs = captured.media.images.length > 0;
  const hasForms = captured.forms.length > 0;
  const hasIframes = captured.media.iframes.length > 0;
  if (!hasText && !hasH && !hasImgs && !hasForms && !hasIframes) {
    await pw.close();
    return { ok: false, slug: page.slug, url: page.url, error: { errorClass: 'EmptyPageError', message: 'empty page — possibly soft-404' }, waitMs: Date.now() - t0, waitMode: waitModeUsed };
  }

  await pw.close();

  // --- download media (cap to 25 to keep things fast)
  const mediaToFetch = [];
  for (const im of captured.media.images.slice(0, 12)) {
    if (im.src && im.src.startsWith('http')) mediaToFetch.push({ url: im.src, ref: im });
  }
  for (const cb of captured.media.cssBackgrounds.slice(0, 8)) {
    if (cb.url && cb.url.startsWith('http')) mediaToFetch.push({ url: cb.url, ref: cb });
  }
  for (const t of mediaToFetch) {
    const r = await downloadBinary(t.url, OUT_MEDIA);
    if (r.ok) t.ref.localPath = r.localPath;
    else { t.ref.localPath = null; t.ref.downloadError = r.error; }
  }

  // --- attach localPath to remaining images explicitly null
  for (const im of captured.media.images) {
    if (im.localPath === undefined) im.localPath = null;
  }
  for (const cb of captured.media.cssBackgrounds) {
    if (cb.localPath === undefined) cb.localPath = null;
  }

  // --- stats
  const text = captured.landmarks.map(l => l.innerText || '').join(' ');
  const stats = {
    wordCount: text.split(/\s+/).filter(Boolean).length,
    ctaCount: captured.ctas.length,
    internalLinkCount: captured.links.internal.length,
    externalLinkCount: captured.links.external.length,
    imageCount: captured.media.images.length,
    inlineSvgCount: captured.media.inlineSvgs.length,
    cssBackgroundCount: captured.media.cssBackgrounds.length,
  };

  const waitMs = Date.now() - t0;

  const out = {
    _provenance: {
      writtenBy: 'stardust:extract',
      writtenAt: startedAt,
      readArtifacts: [page.url],
      synthesizedInputs: [],
      stardustVersion: STARDUST_VERSION,
      waitMode: waitModeUsed,
      waitMs,
      httpStatus,
      contentType,
    },
    slug: page.slug,
    url: page.url,
    finalUrl,
    title: captured.title,
    metaDescription: captured.metaDescription,
    og: captured.og,
    themeColor: captured.themeColor,
    language: captured.language,
    headings: captured.headings,
    landmarks: captured.landmarks,
    ctas: captured.ctas,
    links: captured.links,
    media: captured.media,
    forms: captured.forms,
    widgets: captured.widgets,
    components: captured.components,
    perSectionStyle: captured.perSectionStyle,
    embedDominance: captured.embedDominance,
    cssCustomProperties: captured.cssCustomProperties,
    screenshot: path.relative(ROOT, shotPath),
    stats,
    // extras for brand-surface aggregation
    _extras: {
      logoCandidates: captured.logoCandidates,
      styleSamples: captured.styleSamples,
      firstParagraph: captured.body.firstParagraph,
    },
  };

  fs.writeFileSync(path.join(OUT_PAGES, `${page.slug}.json`), JSON.stringify(out, null, 2));
  return { ok: true, slug: page.slug, url: page.url, waitMs, waitMode: waitModeUsed };
}

// ---------- main ----------

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    locale: 'en-US',
    reducedMotion: 'reduce',
    ignoreHTTPSErrors: true,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  });

  const results = [];
  for (let i = 0; i < PAGES.length; i++) {
    const p = PAGES[i];
    console.log(`[${i+1}/${PAGES.length}] extracting ${p.slug} (${p.url})`);
    const r = await extractOne(context, p, i);
    if (r.ok) console.log(`  ok in ${r.waitMs}ms`);
    else console.log(`  FAIL ${r.error.errorClass}: ${r.error.message}`);
    results.push(r);
  }
  await context.close();
  await browser.close();

  // crawl-log
  const log = {
    _provenance: {
      writtenBy: 'stardust:extract',
      writtenAt: new Date().toISOString(),
      stardustVersion: STARDUST_VERSION,
    },
    discovery: {
      source: 'sitemap_index',
      sourceUrl: 'https://www.semrush.com/sitemap.xml',
      fetchedAt: new Date().toISOString(),
      discoveredCount: 22,
      filteredCount: 22 - PAGES.length,
      filteredAsJunk: [],
      waitMode: WAIT_MODE,
      waitModeAutoDetect: null,
      cappedAt: 5,
      cap: 5,
      capSource: 'default',
      userChoice: null,
      kept: PAGES.map(p => ({ url: p.url, slug: p.slug, score: null })),
      cut: [
        { reason: 'sub-sitemap excluded as ancillary', urls: [
          'blog/', 'news/', 'kb/', 'academy/', 'apps/', 'careers/', 'eyeon/', 'trending-websites/',
          'free-tools/', 'website/', 'vs/', 'content-hub/', 'pt./es./it./fr./de./ja. blogs (locale)',
        ]},
      ],
      scores: { rules: ['home','IA-pillar keyword','sitemap priority','shallow path','page-type checklist'], sample: null },
      malformed: [],
      requiresAuth: [],
      notes: 'Page selection: home + pricing (high IA priority) + features (IA pillar) + features/keyword-magic-tool (long-form feature page for body typography variety) + company (about/IA pillar). Cross-page coverage = 5 distinct page-types: landing, pricing, IA-index, feature-detail, about/static. Locale-specific blog sitemaps and ancillary surfaces (kb, academy, news, blog, apps, careers, vs, free-tools) excluded — these are downstream blog/help/ancillary content, not core marketing IA. Solutions sub-sitemap had only one entry (competitive-research), redundant against features.',
    },
    crawl: {
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      successes: results.filter(r => r.ok).length,
      failures: results.filter(r => !r.ok).map((r) => ({
        slug: r.slug, url: r.url,
        errorClass: r.error.errorClass, message: r.error.message,
        at: new Date().toISOString(),
      })),
      perPageWait: results.map(r => ({ slug: r.slug, waitMs: r.waitMs, waitMode: r.waitMode, ok: r.ok })),
    },
  };
  fs.writeFileSync(OUT_LOG, JSON.stringify(log, null, 2));
  console.log('\nDone. log:', OUT_LOG);
  for (const r of results) console.log(' ', r.ok ? '✓' : '✗', r.slug, r.waitMs + 'ms', r.error?.errorClass || '');
})();
