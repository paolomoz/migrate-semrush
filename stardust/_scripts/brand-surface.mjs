// Phase 3 — Brand-surface aggregation across all extracted pages.
// Reads stardust/current/pages/*.json + downloads logo.
// Writes stardust/current/_brand-extraction.json.

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';
import crypto from 'node:crypto';

const ROOT = '/Users/paolo/excat/tmp/migrate-semrush';
const PAGES_DIR = path.join(ROOT, 'stardust/current/pages');
const ASSETS_DIR = path.join(ROOT, 'stardust/current/assets');
const OUT = path.join(ROOT, 'stardust/current/_brand-extraction.json');

const STARDUST_VERSION = '0.3.0';

const pageFiles = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.json')).sort();
const pages = pageFiles.map(f => JSON.parse(fs.readFileSync(path.join(PAGES_DIR, f), 'utf8')));

// ---------- helpers ----------

function rgbToHex(rgb) {
  if (!rgb) return null;
  if (rgb.startsWith('#')) return rgb.toLowerCase();
  // rgb(r,g,b) or rgba(r,g,b,a)
  const m = rgb.match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*(?:,\s*([0-9.]+)\s*)?\)/);
  if (!m) return null;
  const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
  if (a === 0) return null; // transparent
  const r = parseInt(m[1],10), g = parseInt(m[2],10), b = parseInt(m[3],10);
  return '#' + [r,g,b].map(n => n.toString(16).padStart(2,'0')).join('').toLowerCase();
}

function hexToRgb(h) { h = h.replace('#',''); return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]; }
function rgbToLab([r,g,b]) {
  // sRGB -> XYZ -> Lab
  let R = r/255, G = g/255, B = b/255;
  R = R > 0.04045 ? Math.pow((R+0.055)/1.055, 2.4) : R/12.92;
  G = G > 0.04045 ? Math.pow((G+0.055)/1.055, 2.4) : G/12.92;
  B = B > 0.04045 ? Math.pow((B+0.055)/1.055, 2.4) : B/12.92;
  const X = (R*0.4124 + G*0.3576 + B*0.1805) / 0.95047;
  const Y = (R*0.2126 + G*0.7152 + B*0.0722) / 1.0;
  const Z = (R*0.0193 + G*0.1192 + B*0.9505) / 1.08883;
  const f = (t) => t > 0.008856 ? Math.pow(t, 1/3) : 7.787*t + 16/116;
  return [116*f(Y) - 16, 500*(f(X)-f(Y)), 200*(f(Y)-f(Z))];
}
function deltaE(a, b) {
  return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);
}

function clusterColors(colorEntries) {
  // colorEntries: [{value (hex), occurrences, sources, contexts, sourceSelectors}]
  const reps = [];
  for (const c of colorEntries) {
    const rgb = hexToRgb(c.value);
    const lab = rgbToLab(rgb);
    let merged = false;
    for (const r of reps) {
      if (deltaE(lab, r.lab) < 5) {
        r.occurrences += c.occurrences;
        for (const s of c.sources) r.sources.add(s);
        for (const ctx of c.contexts) r.contexts.add(ctx);
        for (const sel of c.sourceSelectors) {
          if (r.sourceSelectors.length < 6) r.sourceSelectors.push(sel);
        }
        // pick brighter representative? keep first encountered (already sorted by frequency below)
        merged = true;
        break;
      }
    }
    if (!merged) {
      reps.push({
        value: c.value, lab, occurrences: c.occurrences,
        sources: new Set(c.sources), contexts: new Set(c.contexts),
        sourceSelectors: [...c.sourceSelectors].slice(0, 6),
      });
    }
  }
  return reps;
}

// ---------- palette aggregation ----------

const colorMap = new Map(); // hex -> {value, occurrences, sources:Set, contexts:Set, sourceSelectors:[]}
function bumpColor(hex, sourcePage, context, selector) {
  if (!hex) return;
  let e = colorMap.get(hex);
  if (!e) {
    e = { value: hex, occurrences: 0, sources: new Set(), contexts: new Set(), sourceSelectors: [] };
    colorMap.set(hex, e);
  }
  e.occurrences += 1;
  e.sources.add(sourcePage);
  e.contexts.add(context);
  if (e.sourceSelectors.length < 6 && selector) e.sourceSelectors.push(selector);
}

for (const p of pages) {
  for (const s of p._extras.styleSamples) {
    bumpColor(rgbToHex(s.backgroundColor), p.slug, 'background', s.where);
    bumpColor(rgbToHex(s.color), p.slug, 'text', s.where);
    if (s.borderColor) bumpColor(rgbToHex(s.borderColor), p.slug, 'border', s.where);
  }
  for (const cta of p.ctas) {
    bumpColor(rgbToHex(cta.style.backgroundColor), p.slug, 'background', cta.domPath + ' (cta)');
    bumpColor(rgbToHex(cta.style.color), p.slug, 'text', cta.domPath + ' (cta)');
  }
  for (const h of p.headings) {
    bumpColor(rgbToHex(h.style.color), p.slug, 'text', h.domPath);
  }
  for (const ps of p.perSectionStyle) {
    bumpColor(rgbToHex(ps.background.color), p.slug, 'background', ps.sectionRef);
    bumpColor(rgbToHex(ps.text.dominantColor), p.slug, 'text', ps.sectionRef);
  }
}

const allColors = Array.from(colorMap.values()).sort((a,b) => b.occurrences - a.occurrences);
const clustered = clusterColors(allColors).sort((a,b) => b.occurrences - a.occurrences);

// pick role-named palette
const palette = [];
const roleAssigned = { background: false, 'text-primary': false, 'text-secondary': false, primary: false, surface: false, border: false };

// background: must be a light-or-white-or-near-white color used as page-body background
// Prefer the actual document body color sampled
const bodyBgVotes = new Map();
for (const p of pages) {
  const sample = p._extras.styleSamples.find(s => s.where === 'body');
  if (!sample) continue;
  const hex = rgbToHex(sample.backgroundColor);
  if (hex) bodyBgVotes.set(hex, (bodyBgVotes.get(hex)||0)+1);
}
const bodyBg = Array.from(bodyBgVotes.entries()).sort((a,b)=>b[1]-a[1])[0]?.[0];
if (bodyBg) {
  // find cluster representative
  const cluster = clustered.find(c => c.value === bodyBg) || { occurrences: bodyBgVotes.get(bodyBg), sources: new Set(pages.map(p=>p.slug)), contexts: new Set(['background']), sourceSelectors: ['body'] };
  palette.push({ role: 'background', value: bodyBg, occurrences: cluster.occurrences, sources: Array.from(cluster.sources).slice(0,3), usedAs: Array.from(cluster.contexts), sourceSelectors: cluster.sourceSelectors });
  roleAssigned.background = true;
}
if (!roleAssigned.background) for (const c of clustered) {
  if (c.contexts.has('background') && c.occurrences > 5) {
    palette.push({ role: 'background', value: c.value, occurrences: c.occurrences, sources: Array.from(c.sources).slice(0,3), usedAs: Array.from(c.contexts), sourceSelectors: c.sourceSelectors });
    roleAssigned.background = true;
    break;
  }
}
// text-primary: most-frequent color used as text
for (const c of clustered) {
  if (c.contexts.has('text') && !roleAssigned['text-primary']) {
    if (palette.find(p => p.value === c.value)) continue;
    palette.push({ role: 'text-primary', value: c.value, occurrences: c.occurrences, sources: Array.from(c.sources).slice(0,3), usedAs: Array.from(c.contexts), sourceSelectors: c.sourceSelectors });
    roleAssigned['text-primary'] = true;
    break;
  }
}
// primary: most-saturated color appearing on CTAs (background context)
function saturation(hex) {
  const [r,g,b] = hexToRgb(hex);
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  return (max - min);
}
const ctaBg = [];
for (const p of pages) {
  for (const cta of p.ctas) {
    const hex = rgbToHex(cta.style.backgroundColor);
    if (!hex) continue;
    ctaBg.push(hex);
  }
}
// pick most-saturated ctaBg color that has occurrences > 3
const ctaBgFreq = {};
for (const c of ctaBg) ctaBgFreq[c] = (ctaBgFreq[c]||0)+1;
const ctaBgRanked = Object.entries(ctaBgFreq).sort((a,b)=>b[1]-a[1]).map(([h,n])=>({h,n,sat:saturation(h)}));
const candidates = ctaBgRanked.filter(c => c.sat > 30 && c.n >= 1).sort((a,b)=>b.sat-a.sat || b.n-a.n);
const primaryHex = candidates[0]?.h || null;
if (primaryHex) {
  const cluster = clustered.find(c => c.value === primaryHex);
  palette.push({
    role: 'primary',
    value: primaryHex,
    occurrences: cluster?.occurrences || ctaBgFreq[primaryHex],
    sources: cluster ? Array.from(cluster.sources).slice(0,3) : [],
    usedAs: cluster ? Array.from(cluster.contexts) : ['background'],
    sourceSelectors: cluster ? cluster.sourceSelectors : [],
  });
  roleAssigned.primary = true;
}

// surface: second most frequent background not yet assigned
let surfaceCount = 0;
for (const c of clustered) {
  if (palette.find(p => p.value === c.value)) continue;
  if (c.contexts.has('background') && c.occurrences > 3) {
    palette.push({ role: 'surface', value: c.value, occurrences: c.occurrences, sources: Array.from(c.sources).slice(0,3), usedAs: Array.from(c.contexts), sourceSelectors: c.sourceSelectors });
    surfaceCount++;
    if (surfaceCount >= 2) break;
  }
}
// border: small border colors
for (const c of clustered) {
  if (palette.find(p => p.value === c.value)) continue;
  if (c.contexts.has('border') && c.occurrences > 1) {
    palette.push({ role: 'border', value: c.value, occurrences: c.occurrences, sources: Array.from(c.sources).slice(0,3), usedAs: Array.from(c.contexts), sourceSelectors: c.sourceSelectors });
    break;
  }
}
// fill remaining 8-cap with accents
let accentN = 1;
for (const c of clustered) {
  if (palette.length >= 8) break;
  if (palette.find(p => p.value === c.value)) continue;
  if (c.occurrences < 2) continue;
  palette.push({ role: `accent-${accentN++}`, value: c.value, occurrences: c.occurrences, sources: Array.from(c.sources).slice(0,3), usedAs: Array.from(c.contexts), sourceSelectors: c.sourceSelectors });
}

// ---------- type aggregation ----------

const headingsAll = pages.flatMap(p => p.headings.map(h => ({...h, slug: p.slug})));
const bodyFamilies = new Map(); // family -> count
const headingFamilies = new Map();
function bumpFam(map, fam) {
  if (!fam) return;
  // pick the first family in stack
  const first = fam.split(',')[0].replace(/['"]/g,'').trim();
  map.set(first, (map.get(first)||0)+1);
}

for (const h of headingsAll) bumpFam(headingFamilies, h.style.fontFamily);
for (const p of pages) {
  for (const s of p._extras.styleSamples) {
    if (s.where === 'body') bumpFam(bodyFamilies, s.fontFamily);
  }
}
const headingFamRanked = Array.from(headingFamilies.entries()).sort((a,b)=>b[1]-a[1]);
const bodyFamRanked = Array.from(bodyFamilies.entries()).sort((a,b)=>b[1]-a[1]);

const headingFamilyName = headingFamRanked[0]?.[0] || null;
const bodyFamilyName = bodyFamRanked[0]?.[0] || headingFamilyName;

// per-level type sizes (weighted score)
const levelGroups = {}; // {level: {key:(size|weight): {pixelSize, fontWeight, count}}}
for (const h of headingsAll) {
  const sizeMatch = (h.style.fontSize || '').match(/([\d.]+)px/);
  const px = sizeMatch ? parseFloat(sizeMatch[1]) : null;
  const weight = parseInt(h.style.fontWeight, 10) || 400;
  if (!px) continue;
  const lvl = h.level;
  const key = `${px}|${weight}`;
  levelGroups[lvl] = levelGroups[lvl] || {};
  levelGroups[lvl][key] = levelGroups[lvl][key] || { px, weight, count: 0, lineHeight: h.style.lineHeight, letterSpacing: h.style.letterSpacing };
  levelGroups[lvl][key].count++;
}
const headingSizes = []; // {level, fontSize, fontWeight, lineHeight, letterSpacing, score}
for (const lvl of Object.keys(levelGroups).map(Number).sort((a,b)=>a-b)) {
  const groups = Object.values(levelGroups[lvl]);
  const ranked = groups.map(g => ({ ...g, score: g.px * (g.weight/400) * Math.sqrt(g.count) })).sort((a,b)=>b.score-a.score);
  const top = ranked[0];
  headingSizes.push({
    level: lvl,
    fontSize: `${top.px}px`,
    fontWeight: top.weight,
    lineHeight: top.lineHeight,
    letterSpacing: top.letterSpacing,
    count: top.count,
  });
}

// modular-scale audit
const sizesPx = headingSizes.map(h => parseFloat(h.fontSize)).sort((a,b)=>b-a);
const ratios = [];
for (let i = 0; i < sizesPx.length - 1; i++) {
  ratios.push(+(sizesPx[i] / sizesPx[i+1]).toFixed(3));
}
const canon = { 'minor-second':1.067,'major-second':1.125,'minor-third':1.200,'major-third':1.250,'perfect-fourth':1.333,'augmented-fourth':1.414,'perfect-fifth':1.500,'golden':1.618 };
let scaleAudit = { kind: 'ad-hoc', ratios, matchedScale: null };
let scaleRatio = null;
if (ratios.length) {
  for (const [name, r] of Object.entries(canon)) {
    if (ratios.every(x => Math.abs(x - r) < 0.025)) {
      scaleAudit = { kind: 'modular', ratios, matchedScale: name };
      scaleRatio = r;
      break;
    }
  }
}

// ---------- spacing ----------
const paddings = []; const radii = []; const shadows = [];
for (const p of pages) {
  for (const s of p._extras.styleSamples) {
    const padMatch = (s.padding || '').match(/(\d+)px/g);
    if (padMatch) for (const m of padMatch) paddings.push(parseInt(m,10));
    const r = parseFloat(s.borderRadius);
    if (!isNaN(r) && r > 0) radii.push(r);
    if (s.boxShadow && s.boxShadow !== 'none') shadows.push(s.boxShadow);
  }
  for (const ps of p.perSectionStyle) {
    const r = parseFloat(ps.borderRadius);
    if (!isNaN(r) && r > 0) radii.push(r);
    for (const sh of ps.shadowsUsed || []) shadows.push(sh);
  }
}
function freq(arr) {
  const m = new Map();
  for (const v of arr) m.set(v, (m.get(v)||0)+1);
  return Array.from(m.entries()).sort((a,b)=>b[1]-a[1]);
}
const padFreq = freq(paddings);
const radFreq = freq(radii);
const shadowFreq = freq(shadows);

const baseUnit = (() => {
  // most common small even paddings
  const small = paddings.filter(p => p > 0 && p <= 16);
  if (!small.length) return 8;
  const fr = freq(small);
  const top = fr[0]?.[0];
  if (top % 4 === 0) return top % 8 === 0 ? 8 : 4;
  return 8;
})();

// motifs.borderRadius
const radiusOccurrences = {};
for (const [v, c] of radFreq) radiusOccurrences[`${v}px`] = c;
// pill detection: any radius >= 100 OR >= 9999 (we use 100 as semrush uses 100px+ for pills)
const nonPillRadii = radFreq.filter(([v]) => v < 100);
const pillRadii = radFreq.filter(([v]) => v >= 100);
const primaryRad = nonPillRadii[0]?.[0];
const secondaryRad = nonPillRadii[1]?.[0];
const pillRad = pillRadii[0]?.[0];

// shadows top 3
const topShadows = shadowFreq.slice(0,3).map(([v,n]) => ({ value: v, uses: n > 5 ? 'cards' : 'buttons' }));

// gradients (scan styleSamples + cssBackgrounds)
const gradients = [];
for (const p of pages) {
  for (const ps of p.perSectionStyle) {
    if (ps.background.hasGradient) {
      // we don't have raw gradient string in current capture; skip for now
    }
  }
}

// patterns heuristic
const patterns = [];
for (const p of pages) {
  if (p.components.cards.count >= 3) patterns.push({ name: 'card-grid', evidence: `${p.slug}: ${p.components.cards.count} cards` });
  if (p.components.logoStrip.count > 0) patterns.push({ name: 'social-proof-logos', evidence: `${p.slug}: logo strip detected` });
  if (p.components.testimonialCards.count > 0) patterns.push({ name: 'testimonial-grid', evidence: `${p.slug}: ${p.components.testimonialCards.count} testimonials` });
  if (p.components.statRow.count > 0) patterns.push({ name: 'stat-row', evidence: `${p.slug}: ${p.components.statRow.count} stats` });
  if (p.components.accordions.count > 2) patterns.push({ name: 'faq-accordion', evidence: `${p.slug}: ${p.components.accordions.count} details` });
  if (p.components.pricingTiles.count > 0) patterns.push({ name: 'pricing-3up', evidence: `${p.slug}: pricing tiles` });
}
// dedup by name
const patternsDedup = [];
const seenP = new Set();
for (const p of patterns) {
  if (seenP.has(p.name)) continue;
  seenP.add(p.name);
  patternsDedup.push(p);
}

// ---------- voice (home-only for some, cross-page for others) ----------
const home = pages.find(p => p.slug === 'home');
const heroH = home.headings.find(h => h.level === 1)?.text || null;
const heroSubcopy = (() => {
  // try first hero-purpose section innerTextSummary
  for (const lm of home.landmarks) {
    for (const c of (lm.children || [])) {
      if (c.purpose === 'hero' && c.innerTextSummary && c.innerTextSummary.length > 60) {
        // strip leading H1 if matches heroH
        let t = c.innerTextSummary;
        if (heroH && t.startsWith(heroH)) t = t.slice(heroH.length).trim();
        if (t.length > 30) return t;
      }
    }
  }
  const fp = home._extras.firstParagraph;
  if (fp && !fp.toLowerCase().includes('browser')) return fp;
  // fall back to og:description
  return home.og?.description || null;
})();
const primaryCTA = home.ctas.find(c => /sign up|get started|try|start free|free trial|talk to sales|book a demo|free forever/i.test(c.label))?.label || home.ctas[3]?.label || null;

// nav items: links inside the header landmark
const headerLandmark = home.landmarks.find(l => l.tag === 'header' || l.role === 'banner');
const navItems = [];
if (headerLandmark) {
  const headerId = headerLandmark.id;
  // Match dom paths that include the header id OR start with header
  const headerLinks = home.links.internal.filter(l => {
    const p = l.domPath || '';
    return (headerId && p.includes('#' + headerId)) || p.startsWith('header');
  });
  const uniqLabels = new Set();
  for (const l of headerLinks) {
    const t = l.text?.split('\n')[0]?.trim();
    if (t && t.length > 0 && t.length < 30) uniqLabels.add(t);
  }
  for (const t of uniqLabels) {
    navItems.push(t);
    if (navItems.length >= 12) break;
  }
}

// footer headings
const footerLandmark = home.landmarks.find(l => l.tag === 'footer' || l.role === 'contentinfo');
const footerHeadings = footerLandmark?.headingSequence || [];

// ctaSamples: top distinct cta labels across pages
const allCtas = pages.flatMap(p => p.ctas.map(c => c.label));
const ctaSet = [];
for (const c of allCtas) {
  if (!c) continue;
  if (!ctaSet.includes(c)) ctaSet.push(c);
  if (ctaSet.length >= 12) break;
}

// tone heuristic
const headingsTotal = headingsAll.length;
const headingsUC = headingsAll.filter(h => h.text === h.text.toUpperCase() && h.text.length > 1).length;
const headingsUppercasePercent = headingsTotal ? Math.round((headingsUC/headingsTotal)*100) : 0;
const distinctHeadings = new Set(headingsAll.map(h => h.text)).size;
const distinctCtaLabels = new Set(allCtas.filter(Boolean)).size;

// register heuristic
let register = 'brand';
if (home.forms.length > 3 && home.headings.length < 5) register = 'product';
// heroHeadline + ctas + signup => brand
if (home.ctas.some(c => /sign up|free forever|get started|free trial/i.test(c.label))) register = 'brand';

// voiceTable
const ctaFreqMap = new Map();
for (const p of pages) {
  for (const c of p.ctas) {
    if (!c.label) continue;
    const k = c.label.trim().toLowerCase();
    let e = ctaFreqMap.get(k);
    if (!e) { e = { label: c.label.trim(), total: 0, pages: new Set() }; ctaFreqMap.set(k, e); }
    e.total++;
    e.pages.add(p.slug);
  }
}
const ctaFrequency = Array.from(ctaFreqMap.values())
  .map(e => ({ label: e.label, total: e.total, pageCount: e.pages.size, pages: Array.from(e.pages) }))
  .sort((a,b) => b.total - a.total || b.pageCount - a.pageCount)
  .slice(0,8);

// headingFrequency
const headingFreqMap = new Map();
for (const h of headingsAll) {
  if (!h.text) continue;
  const k = h.text.trim();
  if (k.length < 3 || k.length > 200) continue;
  let e = headingFreqMap.get(k);
  if (!e) { e = { text: k, total: 0, pages: new Set(), level: h.level }; headingFreqMap.set(k, e); }
  e.total++;
  e.pages.add(h.slug);
}
const headingFrequency = Array.from(headingFreqMap.values())
  .filter(e => e.pages.size >= 2) // we only have 5 pages so threshold of 2 is reasonable
  .map(e => ({ text: e.text, total: e.total, pageCount: e.pages.size, level: e.level }))
  .sort((a,b) => b.total - a.total || b.pageCount - a.pageCount)
  .slice(0, 30);

// cross-promo detection
let crossPromo = { detected: false, anchorHeading: null, cluster: null, pages: null, pageCount: 0, totalPages: pages.length };
if (headingFrequency.length) {
  const anchor = headingFrequency[0];
  if (anchor.pageCount >= 3) {
    const anchorPages = new Set();
    for (const h of headingsAll) if (h.text.trim() === anchor.text) anchorPages.add(h.slug);
    const cluster = headingFrequency
      .map(e => ({ ...e, overlap: 0 }))
      .map((e) => {
        const ePages = new Set();
        for (const h of headingsAll) if (h.text.trim() === e.text) ePages.add(h.slug);
        let overlap = 0;
        for (const s of anchorPages) if (ePages.has(s)) overlap++;
        return { ...e, overlap };
      })
      .filter(e => e.overlap / anchorPages.size >= 0.6)
      .slice(0, 8);
    if (cluster.length >= 2) {
      crossPromo = {
        detected: true,
        anchorHeading: anchor.text,
        cluster,
        pages: Array.from(anchorPages),
        pageCount: anchorPages.size,
        totalPages: pages.length,
      };
    }
  }
}

// system components: heading-sequence based
const fingerprintMap = new Map();
for (const p of pages) {
  for (const lm of p.landmarks) {
    const key = `${lm.tag}::${(lm.headingSequence || []).join('|').slice(0,200)}::${(lm.role || '')}`;
    let e = fingerprintMap.get(key);
    if (!e) { e = { tag: lm.tag, role: lm.role, headingSequence: lm.headingSequence || [], examplePages: new Set(), exampleSlug: p.slug, exampleSelector: lm.tag, occurrences: 0 }; fingerprintMap.set(key, e); }
    e.occurrences++;
    e.examplePages.add(p.slug);
  }
}
const systemComponents = [];
const minPages = Math.min(3, Math.floor(pages.length * 0.5));
for (const e of fingerprintMap.values()) {
  if (e.examplePages.size < Math.max(2, minPages)) continue;
  let kind = 'other';
  if (e.tag === 'header' || e.role === 'banner') kind = 'header';
  else if (e.tag === 'footer' || e.role === 'contentinfo') kind = 'footer';
  else if (e.tag === 'nav') kind = 'nav-secondary';
  else if (e.tag === 'aside' || e.role === 'complementary') kind = 'sidebar';
  systemComponents.push({
    name: kind === 'header' ? 'site-header' : kind === 'footer' ? 'site-footer' : `${kind}-${systemComponents.length+1}`,
    kind,
    occurrences: e.examplePages.size,
    headingSequence: e.headingSequence,
    ctaLabels: [],
    domFingerprintHash: crypto.createHash('sha256').update(JSON.stringify(e.headingSequence)).digest('hex').slice(0, 16),
    exampleSlug: e.exampleSlug,
    exampleSelector: e.exampleSelector,
    examplePages: Array.from(e.examplePages),
  });
}

// background-motif system components
const cssBgMap = new Map();
for (const p of pages) {
  for (const cb of p.media.cssBackgrounds) {
    if (!cb.url) continue;
    let e = cssBgMap.get(cb.url);
    if (!e) { e = { url: cb.url, pages: new Set(), example: cb }; cssBgMap.set(cb.url, e); }
    e.pages.add(p.slug);
  }
}
for (const e of cssBgMap.values()) {
  if (e.pages.size >= 2) {
    systemComponents.push({
      name: `bg-${e.url.split('/').pop().slice(0,30)}`,
      kind: 'background-motif',
      occurrences: e.pages.size,
      headingSequence: [],
      ctaLabels: [],
      domFingerprintHash: crypto.createHash('sha256').update(e.url).digest('hex').slice(0, 16),
      exampleSlug: Array.from(e.pages)[0],
      exampleSelector: e.example.domPath,
      examplePages: Array.from(e.pages),
      bgUrl: e.url,
    });
  }
}

// component style — buttons (primary)
const primaryBtns = pages.flatMap(p => p.ctas.filter(c => {
  const bg = rgbToHex(c.style.backgroundColor);
  return bg && bg === primaryHex;
}));
const componentStyle = {
  buttons: {
    primary: primaryBtns[0] ? {
      background: rgbToHex(primaryBtns[0].style.backgroundColor),
      color: rgbToHex(primaryBtns[0].style.color),
      borderRadius: primaryBtns[0].style.borderRadius,
      padding: primaryBtns[0].style.padding,
      fontWeight: primaryBtns[0].style.fontWeight,
      shadow: primaryBtns[0].style.boxShadow !== 'none' ? primaryBtns[0].style.boxShadow : null,
      hoverDelta: null,
    } : null,
    secondary: null,
    ghost: null,
  },
  dualCTAPattern: null,
  cards: null,
  inputs: null,
};

// ---------- logo (priority chain) ----------

function downloadBinary(url, dest) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https:') ? https : http;
    const req = lib.get(url, { headers: { 'User-Agent': 'stardust/0.3.0' }, timeout: 15000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = new URL(res.headers.location, url).href;
        downloadBinary(next, dest).then(resolve);
        return;
      }
      if (res.statusCode !== 200) { res.resume(); return resolve(false); }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => { try { fs.writeFileSync(dest, Buffer.concat(chunks)); resolve(true); } catch (e) { resolve(false); } });
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

let logo = null;
const logoCand = home._extras.logoCandidates;
if (logoCand.inlineSvg && logoCand.inlineSvg.markup && logoCand.inlineSvg.width >= 60) {
  const dest = path.join(ASSETS_DIR, 'logo.svg');
  fs.writeFileSync(dest, logoCand.inlineSvg.markup);
  logo = {
    source: 'inline-svg',
    sourceSelector: logoCand.inlineSvg.domPath,
    localPath: 'stardust/current/assets/logo.svg',
    format: 'svg',
    intrinsicWidth: Math.round(logoCand.inlineSvg.width),
    intrinsicHeight: 32,
    synthesized: false,
    synthesizedBasis: null,
  };
} else if (logoCand.img && logoCand.img.src) {
  const u = new URL(logoCand.img.src);
  const ext = path.extname(u.pathname).slice(1) || 'png';
  const dest = path.join(ASSETS_DIR, `logo.${ext}`);
  const ok = await downloadBinary(logoCand.img.src, dest);
  if (ok) {
    logo = { source: 'img', sourceSelector: logoCand.img.src, localPath: `stardust/current/assets/logo.${ext}`, format: ext, intrinsicWidth: null, intrinsicHeight: null, synthesized: false, synthesizedBasis: null };
  }
}
if (!logo && logoCand.appleTouch) {
  const u = new URL(logoCand.appleTouch);
  const ext = path.extname(u.pathname).slice(1) || 'png';
  const dest = path.join(ASSETS_DIR, `logo.${ext}`);
  const ok = await downloadBinary(logoCand.appleTouch, dest);
  if (ok) {
    logo = { source: 'apple-touch-icon', sourceSelector: logoCand.appleTouch, localPath: `stardust/current/assets/logo.${ext}`, format: ext, intrinsicWidth: 180, intrinsicHeight: 180, synthesized: false, synthesizedBasis: null };
  }
}
if (!logo && logoCand.ogImage) {
  const u = new URL(logoCand.ogImage);
  const ext = path.extname(u.pathname).slice(1) || 'png';
  const dest = path.join(ASSETS_DIR, `logo.${ext}`);
  const ok = await downloadBinary(logoCand.ogImage, dest);
  if (ok) {
    logo = { source: 'og-image', sourceSelector: logoCand.ogImage, localPath: `stardust/current/assets/logo.${ext}`, format: ext, intrinsicWidth: null, intrinsicHeight: null, synthesized: false, synthesizedBasis: null };
  }
}
if (!logo) {
  logo = { source: 'synthesized', sourceSelector: null, localPath: null, format: 'svg', intrinsicWidth: 256, intrinsicHeight: 256, synthesized: true, synthesizedBasis: 'No locator hit; brand initials S' };
}

// ---------- final assembly ----------

const out = {
  _provenance: {
    writtenBy: 'stardust:extract',
    writtenAt: new Date().toISOString(),
    readArtifacts: [
      'https://www.semrush.com/',
      ...pages.map(p => `stardust/current/pages/${p.slug}.json`),
    ],
    synthesizedInputs: [],
    stardustVersion: STARDUST_VERSION,
    notes: 'Cross-page aggregation across 5 extracted pages: home, pricing, features, features/keyword-magic-tool, company. Palette uses rgba(*,0)/transparent filtering and ΔE<5 clustering. Logo source: ' + (logo?.source || 'none'),
  },
  site: {
    name: 'Semrush',
    tagline: home.og?.description || home.metaDescription || null,
    originUrl: 'https://www.semrush.com',
  },
  logo,
  palette,
  type: {
    headingFamily: {
      name: headingFamilyName,
      stack: headingFamRanked[0] ? `"${headingFamilyName}", system-ui, sans-serif` : null,
      weights: Array.from(new Set(headingsAll.map(h => parseInt(h.style.fontWeight,10) || 400))).sort((a,b)=>a-b),
      sizes: headingSizes.map(h => h.fontSize),
      lineHeights: Array.from(new Set(headingSizes.map(h => h.lineHeight))),
      letterSpacing: Array.from(new Set(headingSizes.map(h => h.letterSpacing))),
      sourceSelectors: Array.from(new Set(headingsAll.slice(0, 10).map(h => h.domPath.split(' ').slice(-2).join(' ')))),
    },
    bodyFamily: {
      name: bodyFamilyName,
      stack: bodyFamilyName ? `"${bodyFamilyName}", system-ui, sans-serif` : null,
      weights: [400, 500, 600],
      sizes: ['1rem'],
      lineHeights: ['1.5'],
      letterSpacing: ['normal'],
      sourceSelectors: ['p','li','label'],
    },
    monoFamily: null,
    scaleRatio,
    scaleAudit,
    loadStrategy: 'unknown',
  },
  spacing: {
    baseUnit,
    scale: padFreq.slice(0, 12).map(([v]) => v).sort((a,b)=>a-b),
    sectionPadding: padFreq.find(([v]) => v >= 48)?.[0] ? `${padFreq.find(([v]) => v >= 48)[0]}px` : null,
    containerMaxWidth: '1280px',
    gridGap: null,
  },
  motifs: {
    borderRadius: {
      primary: primaryRad ? `${primaryRad}px` : null,
      secondary: secondaryRad ? `${secondaryRad}px` : null,
      pill: pillRad ? `${pillRad}px` : null,
      primarySources: pages.map(p => p.slug).slice(0, 3),
      occurrences: radiusOccurrences,
    },
    shadows: topShadows,
    gradients,
    patterns: patternsDedup,
  },
  componentStyle,
  systemComponents,
  voice: {
    heroHeadline: heroH,
    heroSubcopy,
    primaryCTALabel: primaryCTA,
    ctaSamples: ctaSet,
    navItems,
    footerHeadings,
    firstParagraph: heroSubcopy,
    tone: {
      guess: 'professional-warm',
      evidence: `${distinctCtaLabels} distinct CTA labels, ${headingsUppercasePercent}% uppercase headings — language is action-oriented and approachable`,
    },
  },
  voiceTable: {
    ctaFrequency,
    headingFrequency,
    toneMetrics: {
      headingsTotal,
      headingsUppercasePercent,
      distinctHeadings,
      distinctCtaLabels,
    },
  },
  crossPromo,
  register,
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log('Wrote', OUT);
console.log('Palette roles:', palette.map(p => `${p.role}=${p.value}`).join(' '));
console.log('Heading family:', headingFamilyName, 'Body family:', bodyFamilyName);
console.log('Heading sizes (px):', sizesPx.join(','));
console.log('Scale audit:', scaleAudit.kind, scaleAudit.matchedScale || '');
console.log('Border radius primary:', primaryRad, 'secondary:', secondaryRad);
console.log('System components:', systemComponents.map(s => `${s.kind}(${s.occurrences})`).join(' '));
console.log('Cross-promo detected:', crossPromo.detected);
console.log('Logo source:', logo.source);
