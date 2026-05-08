// Phase 5 — render stardust/current/brand-review.html
// Renders in semrush's own captured colors and fonts.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/Users/paolo/excat/tmp/migrate-semrush';
const CURRENT = path.join(ROOT, 'stardust/current');
const PAGES_DIR = path.join(CURRENT, 'pages');
const OUT = path.join(CURRENT, 'brand-review.html');

const brand = JSON.parse(fs.readFileSync(path.join(CURRENT, '_brand-extraction.json'), 'utf8'));
const log = JSON.parse(fs.readFileSync(path.join(CURRENT, '_crawl-log.json'), 'utf8'));
const designJson = JSON.parse(fs.readFileSync(path.join(CURRENT, 'DESIGN.json'), 'utf8'));
const pageFiles = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.json'));
const pages = pageFiles.map(f => JSON.parse(fs.readFileSync(path.join(PAGES_DIR, f), 'utf8')));

// ----- helpers
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function hexToRgb(h) { h = h.replace('#',''); return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]; }
function saturation(hex) { const [r,g,b] = hexToRgb(hex); return Math.max(r,g,b) - Math.min(r,g,b); }
function rgbToHsl([r,g,b]) {
  r/=255; g/=255; b/=255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max+min)/2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g-b)/d + (g < b ? 6 : 0); break;
      case g: h = (b-r)/d + 2; break;
      case b: h = (r-g)/d + 4; break;
    }
    h = h * 60;
  }
  return [h, s, l];
}
function hueDistance(h1, h2) {
  const d = Math.abs(h1 - h2) % 360;
  return d > 180 ? 360 - d : d;
}
function relLum(hex) { const [r,g,b]=hexToRgb(hex).map(v=>{v/=255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}); return 0.2126*r+0.7152*g+0.0722*b; }
function contrast(a,b) { const la = relLum(a), lb = relLum(b); const [l,d] = la>lb?[la,lb]:[lb,la]; return (l+0.05)/(d+0.05); }

// ----- resolve chrome tokens
const palette = brand.palette;
const isSat = (h) => saturation(h) > 30 && Math.max(...hexToRgb(h)) < 240;
function pickPrimary() {
  // most-frequent saturated palette color
  const sat = palette.filter(p => isSat(p.value)).sort((a,b) => b.occurrences - a.occurrences);
  if (sat.length) return sat[0].value;
  const named = palette.find(p => p.role === 'primary');
  return named ? named.value : '#147aff';
}
function pickPrimaryDark(primary) {
  const ph = rgbToHsl(hexToRgb(primary))[0];
  const cands = palette.filter(p => isSat(p.value) && p.value !== primary);
  for (const c of cands) {
    const ch = rgbToHsl(hexToRgb(c.value))[0];
    if (hueDistance(ph, ch) <= 30 && relLum(c.value) < relLum(primary)) return c.value;
  }
  // darken algorithmically
  const [r,g,b] = hexToRgb(primary);
  const d = (n) => Math.max(0, Math.min(255, Math.round(n * 0.7)));
  return '#' + [d(r),d(g),d(b)].map(n => n.toString(16).padStart(2,'0')).join('');
}
function pickAccent(primary, primaryDark) {
  const ph = rgbToHsl(hexToRgb(primary))[0];
  const cands = palette.filter(p => isSat(p.value) && p.value !== primary && p.value !== primaryDark);
  for (const c of cands) {
    const ch = rgbToHsl(hexToRgb(c.value))[0];
    if (hueDistance(ph, ch) > 60) return c.value;
  }
  // try designJson colorMeta secondary entries (lime/lavender/aqua)
  const meta = designJson.extensions?.colorMeta || {};
  for (const [name, m] of Object.entries(meta)) {
    if (m.role === 'secondary' && m.canonical) return m.canonical;
  }
  const sec = palette.find(p => p.role === 'secondary');
  return sec ? sec.value : primary;
}

const C = {
  primary: pickPrimary(),
};
C.primaryDark = pickPrimaryDark(C.primary);
C.accent = pickAccent(C.primary, C.primaryDark);
C.bg = palette.find(p => p.role === 'background')?.value || '#ffffff';
C.text = palette.find(p => p.role === 'text-primary')?.value || '#181e15';
C.textMuted = palette.find(p => p.role.startsWith('accent'))?.value || '#575c66';
C.surfaceAlt = (() => {
  // pick a tinted surface
  const meta = designJson.extensions?.colorMeta || {};
  const tertiary = Object.values(meta).find(m => m.role === 'tertiary');
  return tertiary ? tertiary.canonical : (palette.find(p => p.role === 'surface')?.value || '#f7f8fa');
})();
C.border = palette.find(p => p.role === 'border')?.value || '#d1d4db';

// font stacks
const headingFam = brand.type.headingFamily.name || 'system-ui';
const bodyFam = brand.type.bodyFamily.name || 'system-ui';
const SYS_SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif';
const display = `"${headingFam}", ${SYS_SANS}`;
const body = `"${bodyFam}", ${SYS_SANS}`;

// fix contrast
let bodyText = C.text, bodyBg = C.bg;
if (contrast(bodyText, bodyBg) < 4.5) {
  bodyText = '#0f1217'; bodyBg = '#ffffff';
}

// uppercase rule
const ucPct = brand.voiceTable?.toneMetrics?.headingsUppercasePercent || 0;
const useUpper = ucPct >= 25;

// --- Tensions detectors ---
const tensions = [];

// T-scale
if (brand.type.scaleAudit?.kind === 'ad-hoc') {
  const sizes = brand.type.scaleAudit.observedSizesPx || designJson.extensions?.scaleAudit?.observedSizesPx || [];
  tensions.push({
    id: 'T-scale', badge: 'observed', title: 'Type scale is ad-hoc',
    body: `${sizes.join(' → ')}, no consistent ratio. Direct will need to decide whether the target adopts a modular scale.`,
    source: '_brand-extraction.json § type.scaleAudit',
  });
}

// T-radius-vocab
const occ = brand.motifs.borderRadius.occurrences || {};
const smallDistinct = Object.entries(occ).filter(([k,v]) => parseFloat(k) > 0 && parseFloat(k) < 16 && v >= 10);
if (smallDistinct.length > 2) {
  tensions.push({
    id: 'T-radius-vocab', badge: 'observed', title: 'Multiple small radii in use',
    body: `Radius vocabulary is fragmented: ${smallDistinct.map(([k,v]) => `${k} (×${v})`).join(', ')}. Direct will need to pick a single small-radius value or accept the variance.`,
    source: '_brand-extraction.json § motifs.borderRadius.occurrences',
  });
}

// T-cta-vocab
const ctaBuckets = {
  'see-more': ['see more','learn more','more info','more','read more','view more','discover more','explore'],
  'start': ['get started','start now','start free','try it','try now','try free','try for free','begin'],
  'contact': ['contact','contact us','get in touch','talk to us','reach out','say hello'],
  'signup': ['sign up','signup','create account','register','join','subscribe'],
};
const allCtas = pages.flatMap(p => p.ctas.map(c => (c.label||'').trim().toLowerCase()));
const matchedByBucket = {};
for (const [bucket, members] of Object.entries(ctaBuckets)) {
  const hit = new Set();
  for (const m of members) {
    const cnt = allCtas.filter(c => c === m).length;
    if (cnt > 0) hit.add(`${m} (×${cnt})`);
  }
  if (hit.size >= 2) matchedByBucket[bucket] = Array.from(hit);
}
for (const [bucket, items] of Object.entries(matchedByBucket)) {
  tensions.push({
    id: 'T-cta-vocab', badge: 'observed', title: `CTA voice fragmented (${bucket})`,
    body: `${items.join(', ')}. Direct will need to pick a canonical voice.`,
    source: 'aggregated pages/*.json § ctas.label',
  });
}

// T-link-content-free
const contentFreeWords = ['here','click here','read this','more','this'];
const cfMatches = [];
for (const p of pages) {
  for (const a of [...p.links.internal, ...p.links.external]) {
    const t = (a.text || '').trim().toLowerCase();
    if (contentFreeWords.includes(t)) cfMatches.push({ text: a.text || '', slug: p.slug });
  }
}
if (cfMatches.length) {
  // group
  const grouped = {};
  for (const m of cfMatches) {
    grouped[m.text.toLowerCase()] = grouped[m.text.toLowerCase()] || { count: 0, pages: new Set(), label: m.text };
    grouped[m.text.toLowerCase()].count++;
    grouped[m.text.toLowerCase()].pages.add(m.slug);
  }
  const summary = Object.values(grouped).map(g => `"${g.label}" (×${g.count} on ${g.pages.size} page${g.pages.size > 1 ? 's' : ''})`).join(', ');
  tensions.push({
    id: 'T-link-content-free', badge: 'observed', title: 'Content-free link labels in use',
    body: `${summary}. Accessibility issue — screen readers and crawlers cannot tell what these point to.`,
    source: 'aggregated pages/*.json § links.*',
  });
}

// T-logo-variants
tensions.push({
  id: 'T-logo-variants', badge: 'observed', title: 'Single logo variant captured',
  body: `Only one logo variant captured (${brand.logo?.source || 'unknown'}). The redesign will need a monochrome / inverted / SVG variant set; direct should plan that.`,
  source: '_brand-extraction.json § logo',
});

// T-color-imbalance (consolidated)
const imbalanced = palette.filter(p => {
  if (p.role === 'background' || p.role.startsWith('text')) return false;
  if (p.value === '#000000' || p.value === '#ffffff') return false;
  if (!p.usedAs || p.usedAs.length !== 1) return false;
  return p.usedAs[0] === 'text' || p.usedAs[0] === 'background';
});
if (imbalanced.length) {
  if (imbalanced.length > 3) {
    tensions.push({
      id: 'T-color-imbalance', badge: 'observed', title: 'Multiple palette colors used in only one context',
      body: `${imbalanced.map(c => `${c.value} (${c.role}, only as ${c.usedAs[0]})`).join('; ')}. Direct will need to decide for each: drop, expand, or keep as accent.`,
      source: '_brand-extraction.json § palette[].usedAs',
    });
  } else {
    for (const c of imbalanced) {
      tensions.push({
        id: 'T-color-imbalance', badge: 'observed', title: `Color used in one context only`,
        body: `${c.value} (${c.role}) appears as ${c.usedAs[0]} only. Direct will need to decide: drop, expand, or keep as accent.`,
        source: '_brand-extraction.json § palette',
      });
    }
  }
}

// T-no-tokens
const allCustomProps = pages.flatMap(p => p.cssCustomProperties || []);
if (!allCustomProps.length) {
  tensions.push({
    id: 'T-no-tokens', badge: 'observed', title: 'Site ships no design tokens',
    body: 'No CSS custom properties defined on :root across any extracted page. The migration target will introduce tokens, which is a structural change worth calling out.',
    source: 'aggregated pages/*.json § cssCustomProperties',
  });
}

// T-img-alt-empty
let imgsTotal = 0, emptyAlt = 0;
for (const p of pages) for (const im of p.media.images) { imgsTotal++; if (!im.alt || !im.alt.trim()) emptyAlt++; }
if (imgsTotal && emptyAlt / imgsTotal >= 0.3) {
  tensions.push({
    id: 'T-img-alt-empty', badge: 'observed', title: 'Empty alt text widespread',
    body: `${Math.round(emptyAlt/imgsTotal*100)}% of images carry empty alt text (${emptyAlt}/${imgsTotal}). Accessibility issue and a content-sourcing decision for direct.`,
    source: 'aggregated pages/*.json § media.images[].alt',
  });
}

// T-img-alt-generic
const genericAlts = ['logo','image','picture','photo','img','icon'];
let genCount = 0;
for (const p of pages) for (const im of p.media.images) if (im.alt && genericAlts.includes(im.alt.trim().toLowerCase())) genCount++;
if (genCount > 0) {
  tensions.push({
    id: 'T-img-alt-generic', badge: 'observed', title: 'Generic alt text found',
    body: `${genCount} image(s) carry alt text equal to a stock placeholder (logo / image / icon / etc.). Distinct from empty alt — these images claim a label but the label is content-free. Failing screen readers.`,
    source: 'aggregated pages/*.json § media.images[].alt',
  });
}

// T-embed-dominance
const dominated = pages.filter(p => p.embedDominance?.dominated);
if (dominated.length) {
  tensions.push({
    id: 'T-embed-dominance', badge: 'observed', title: 'Embed-dominated page exists',
    body: `Page(s) ${dominated.map(p=>p.slug).join(', ')} have primary content inside a cross-origin embed. Direct will need to decide whether the redesign targets the host page or the embed surface.`,
    source: 'aggregated pages/*.json § embedDominance',
  });
}

// T-nav-conflict
const navItems = (brand.voice.navItems || []).map(s => s.toLowerCase());
const conflictPairs = [
  ['donate', ['crisis','get help','find help']],
  ['pricing', ['contact sales']],
  ['sign up', ['start free trial']],
  ['book a demo', ['talk to sales']],
  ['sign in', ['log in']],
];
for (const [a, bs] of conflictPairs) {
  if (navItems.some(n => n.includes(a))) {
    for (const b of bs) {
      if (navItems.some(n => n.includes(b))) {
        tensions.push({
          id: 'T-nav-conflict', badge: 'observed', title: 'Top-nav action conflict',
          body: `Top-nav contains both "${a}" and "${b}"; these typically compete for the same user moment. Direct should resolve which is primary.`,
          source: '_brand-extraction.json § voice.navItems',
        });
      }
    }
  }
}

// T-tokens-unused — Bootstrap defaults check
const fwDefaults = ['#007bff','#6c757d','#28a745','#17a2b8','#ffc107','#dc3545'];
for (const c of allCustomProps) {
  if (/(--primary|--secondary|--success|--info|--warning|--danger)/i.test(c.name)) {
    if (fwDefaults.some(d => c.value.toLowerCase().includes(d))) {
      tensions.push({
        id: 'T-tokens-unused', badge: 'observed', title: 'Design tokens defined but unused',
        body: `${c.name} ships as ${c.value} (likely a Bootstrap default) while the brand's actual primary is ${C.primary}. Token layer exists in name only.`,
        source: 'aggregated pages/*.json § cssCustomProperties',
      });
      break;
    }
  }
}

// T-temporal-mark
const temporalRe = /anniversary|centennial|year[- ]in[- ]review|20\d{2} edition/i;
if (temporalRe.test(brand.voice.heroHeadline || '') || temporalRe.test(brand.logo?.sourceSelector || '')) {
  tensions.push({
    id: 'T-temporal-mark', badge: 'observed', title: 'Temporal mark detected',
    body: `A temporal mark was detected. Direct will need to decide whether the redesign carries the temporal flag forward or returns to an evergreen brand.`,
    source: '_brand-extraction.json § logo / voice.heroHeadline',
  });
}

// ----- HTML render -----

function badge(b) { return `<span class="badge">${esc(b)}</span>`; }
function tag(text) { return `<span class="tag">${esc(text)}</span>`; }
function tableRows(rows) { return rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join(''); }

const successCount = log.crawl.successes;
const failCount = log.crawl.failures.length;
const avgWait = Math.round(log.crawl.perPageWait.filter(w => w.ok).reduce((a,w) => a+w.waitMs,0) / Math.max(1, successCount));

function pagesGrid() {
  return pages.map(p => `
    <figure class="thumb">
      <img src="${esc(path.relative(CURRENT, path.join(ROOT, p.screenshot)))}" alt="${esc(p.title || p.slug)} screenshot" loading="lazy" />
      <figcaption>
        <div class="thumb-title">${esc(p.title?.slice(0,80) || p.slug)}</div>
        <code>${esc(new URL(p.url).pathname)}</code>
      </figcaption>
    </figure>`).join('');
}

function paletteGrid() {
  return palette.map(c => {
    const dark = relLum(c.value) < 0.5;
    return `
    <div class="swatch">
      <div class="chip" style="background:${c.value}; color:${dark ? '#fff' : '#181e15'}">${esc(c.role)}</div>
      <div class="swatch-meta">
        <code>${esc(c.value)}</code>
        <div class="muted">${esc(String(c.occurrences || 0))} uses</div>
        <div class="chips-row">${(c.usedAs || []).map(u => `<span class="chip-mini">${esc(u)}</span>`).join('')}</div>
        <div class="muted small">on: ${(c.sources || []).slice(0,3).map(s => esc(s)).join(', ') || '—'}</div>
      </div>
    </div>`;
  }).join('');
}

function typographySpec() {
  const sizes = brand.type.headingFamily.sizes || [];
  const sample = brand.voice.heroHeadline || 'Sample heading';
  const specimens = sizes.map((s, i) => {
    const lvl = i + 1;
    const px = parseFloat(s);
    return `
    <div class="spec-row">
      <code class="spec-meta">H${lvl} · ${esc(brand.type.headingFamily.name)} ${brand.type.headingFamily.weights?.[brand.type.headingFamily.weights.length-1] || 600} / ${esc(s)}</code>
      <div class="spec" style="font-family:${display}; font-size:${px}px; font-weight:600; line-height:1.1; letter-spacing:-0.02em;">${esc(sample)}</div>
    </div>`;
  }).join('');

  const fp = brand.voice.heroSubcopy || 'The leading platform to grow and measure brand visibility.';
  const audit = brand.type.scaleAudit;
  const auditBadge = audit?.kind === 'modular' ? `<span class="badge">modular ${esc(audit.matchedScale)}</span>` : `<span class="badge badge-warn">No modular scale</span>`;
  return `
    ${specimens}
    <div class="spec-row">
      <code class="spec-meta">Body · ${esc(brand.type.bodyFamily.name)} 400 / 16px / 1.5</code>
      <div class="spec body-spec">${esc(fp)}</div>
    </div>
    <div class="audit-row">${auditBadge} <span class="muted">observed sizes (px): ${(audit?.ratios?.length ? '[ratios] ' + audit.ratios.join(', ') : '')}</span></div>
  `;
}

function voiceCards() {
  return `
    <div class="voice-grid">
      <div class="voice-card">
        <div class="voice-label">Hero headline</div>
        <div class="voice-text" style="font-family:${display};">${esc(brand.voice.heroHeadline || '')}</div>
      </div>
      <div class="voice-card">
        <div class="voice-label">Tagline</div>
        <div class="voice-text">${esc(brand.site.tagline || '')}</div>
      </div>
      <div class="voice-card">
        <div class="voice-label">First paragraph</div>
        <div class="voice-text">${esc(brand.voice.firstParagraph || brand.voice.heroSubcopy || '')}</div>
      </div>
    </div>`;
}

function ctaTable() {
  const rows = (brand.voiceTable.ctaFrequency || []).slice(0,8).map(c => [
    `<span class="pill">${esc(c.label)}</span>`,
    String(c.total),
    String(c.pageCount),
    (c.pages || []).slice(0,3).map(p => `<code>${esc(p)}</code>`).join(' '),
  ]);
  return `
    <table class="cta-table">
      <thead><tr><th>Label</th><th>Total</th><th>Pages</th><th>Examples</th></tr></thead>
      <tbody>${tableRows(rows)}</tbody>
    </table>`;
}

function headingFreqList() {
  const items = (brand.voiceTable.headingFrequency || []).slice(0,16);
  if (!items.length) return '<p class="muted">No repeated headings reach the threshold.</p>';
  return `<div class="head-grid">${items.map(h => `<div class="head-row"><span class="head-text">${esc(h.text)}</span><span class="muted small">H${h.level} × ${h.total} on ${h.pageCount}p</span></div>`).join('')}</div>`;
}

function toneMetrics() {
  const t = brand.voiceTable.toneMetrics || {};
  return `
    <div class="stats-row">
      <div class="stat-box"><div class="stat-num">${t.headingsUppercasePercent ?? '—'}%</div><div class="stat-label">Uppercase headings</div></div>
      <div class="stat-box"><div class="stat-num">${t.distinctHeadings ?? '—'}</div><div class="stat-label">Distinct headings</div></div>
      <div class="stat-box"><div class="stat-num">${t.distinctCtaLabels ?? '—'}</div><div class="stat-label">Distinct CTA labels</div></div>
    </div>`;
}

function tensionCards() {
  // consolidate per-element rules with > 3 hits
  const byId = {};
  for (const t of tensions) (byId[t.id] = byId[t.id] || []).push(t);
  const rendered = [];
  for (const [id, ts] of Object.entries(byId)) {
    if (ts.length > 3 && ['T-color-imbalance','T-link-content-free','T-img-alt-empty','T-img-alt-generic','T-tokens-unused'].includes(id)) {
      rendered.push({
        id, badge: ts[0].badge,
        title: `${ts.length} ${id.replace(/^T-/,'')} hits`,
        body: ts.map(t => `<li>${t.body}</li>`).join(''),
        source: ts[0].source,
        consolidated: true,
      });
    } else for (const t of ts) rendered.push(t);
  }
  if (!rendered.length) return '<p class="muted">No tensions detected at this crawl scope.</p>';
  return `<div class="tensions-grid">${rendered.map(t => `
    <article class="tension">
      <div class="tension-head"><code class="tag">${esc(t.id)}</code> ${badge(t.badge)}</div>
      <h4>${esc(t.title)}</h4>
      <div class="tension-body">${t.consolidated ? `<ul>${t.body}</ul>` : esc(t.body)}</div>
      <footer class="tension-src">Source: <code>${esc(t.source)}</code></footer>
    </article>`).join('')}</div>`;
}

function motifsRow() {
  const rOcc = brand.motifs.borderRadius.occurrences || {};
  const sortedRad = Object.entries(rOcc).sort((a,b) => b[1] - a[1]);
  const radCards = sortedRad.map(([k,v]) => {
    const px = parseFloat(k);
    return `
    <div class="motif-card">
      <div class="motif-shape" style="border-radius:${esc(k)}; width:80px; height:80px; background:${C.primary};"></div>
      <code>${esc(k)}</code>
      <div class="muted small">× ${v}</div>
    </div>`;
  }).join('');
  const shadows = (brand.motifs.shadows || []).slice(0,3).map(s => `
    <div class="motif-card">
      <div style="width:80px; height:80px; background:#fff; border-radius:8px; box-shadow:${esc(s.value || s)};"></div>
      <code>${esc(s.uses || 'shadow')}</code>
    </div>`).join('');
  return `<div class="motifs-row">${radCards}${shadows}</div>`;
}

function componentsList() {
  const compsObserved = {};
  for (const p of pages) {
    for (const [k, v] of Object.entries(p.components)) {
      if (k === 'other') continue;
      if (!v || typeof v.count !== 'number') continue;
      if (v.count === 0) continue;
      compsObserved[k] = compsObserved[k] || { count: 0, pages: new Set() };
      compsObserved[k].count += v.count;
      compsObserved[k].pages.add(p.slug);
    }
  }
  const rows = Object.entries(compsObserved).sort((a,b) => b[1].count - a[1].count).map(([k,v]) =>
    `<li><strong>${esc(k)}</strong> <span class="muted">×${v.count} across ${v.pages.size} page${v.pages.size>1?'s':''}</span></li>`
  );
  const patterns = (brand.motifs.patterns || []).map(p => `<li><strong>${esc(p.name)}</strong> <span class="muted">${esc(p.evidence)}</span></li>`);
  return `<ul class="comp-list">${rows.join('')}</ul><h4>Observed patterns</h4><ul class="comp-list">${patterns.join('')}</ul>`;
}

function crossPromoSection() {
  const cp = brand.crossPromo;
  if (!cp || !cp.detected) return '';
  return `
  <section id="crosspromo">
    <h2>Cross-promo reproduction <span class="badge">cross-page</span></h2>
    <div class="crosspromo-tag">Reproduction · approximate</div>
    <div class="crosspromo-block">
      <h3 style="font-family:${display}; color:${C.bg};">${esc(cp.anchorHeading)}</h3>
      <div class="crosspromo-tiles">
        ${cp.cluster.slice(1, 7).map(c => `<div class="crosspromo-tile">${esc(c.text)}</div>`).join('')}
      </div>
      <div class="muted" style="color:rgba(255,255,255,0.7); margin-top:16px;">Repeated on ${cp.pageCount} of ${cp.totalPages} extracted pages</div>
    </div>
  </section>`;
}

function systemComponentsSection() {
  const sc = brand.systemComponents.filter(s => s.headingSequence?.length || s.kind === 'background-motif');
  if (!sc.length) return '';
  return `
  <section id="syscomp">
    <h2>System components <span class="badge">cross-page</span></h2>
    <div class="syscomp-list">
      ${sc.map(s => `
        <div class="syscomp">
          <header><strong>${esc(s.name)}</strong> <code class="tag">${esc(s.kind)}</code> <span class="muted">×${s.occurrences} pages</span></header>
          ${s.headingSequence?.length ? `<div class="muted">heading seq: ${s.headingSequence.slice(0,6).map(esc).join(' · ')}</div>` : ''}
          ${s.ctaLabels?.length ? `<div class="muted">CTAs: ${s.ctaLabels.map(esc).join(', ')}</div>` : ''}
          ${s.bgUrl ? `<div class="muted small">bg: <code>${esc(s.bgUrl.split('/').pop())}</code></div>` : ''}
        </div>`).join('')}
    </div>
  </section>`;
}

function logoSection() {
  const lo = brand.logo;
  if (!lo) return '';
  const localImg = lo.localPath ? `<img src="${esc(path.relative(CURRENT, path.join(ROOT, lo.localPath)))}" alt="${esc(brand.site.name)} logo" style="max-height:64px; max-width:280px;" />` : '<div class="muted">no logo image</div>';
  return `
  <section id="logo">
    <h2>Logo &amp; favicons</h2>
    <div class="logo-row">
      <div class="logo-img">${localImg}</div>
      <dl class="logo-meta">
        <dt>Source</dt><dd><code>${esc(lo.source)}</code></dd>
        <dt>File</dt><dd>${esc(lo.format || '?')} · ${esc(String(lo.intrinsicWidth||'?'))}×${esc(String(lo.intrinsicHeight||'?'))} (intrinsic)</dd>
        <dt>Variants captured</dt><dd>1 (primary)</dd>
        <dt>Variants not captured</dt><dd>monochrome / inverted</dd>
        ${lo.notes ? `<dt>Notes</dt><dd class="muted">${esc(lo.notes)}</dd>` : ''}
      </dl>
    </div>
  </section>`;
}

function spacingShape() {
  const sp = brand.spacing;
  const scale = sp.scale || [];
  const max = Math.max(...scale, 1);
  const bars = scale.map(v => `<div class="space-bar"><div class="bar" style="height:${(v/max)*60+8}px"></div><code>${v}px</code></div>`).join('');
  const radii = Object.keys(brand.motifs.borderRadius.occurrences || {}).map(k => `<span class="pill" style="border:1px solid ${C.border}; background:${C.bg}; color:${C.text}; border-radius:${k};">${esc(k)}</span>`).join('');
  return `
  <section id="spacing">
    <h2>Spacing &amp; shape <span class="badge">cross-page</span></h2>
    <div class="muted">Base unit: ${sp.baseUnit ?? '—'}px · Container: ${sp.containerMaxWidth || '—'}</div>
    <div class="space-row">${bars}</div>
    <h4>Radii revisited</h4>
    <div class="radii-row">${radii}</div>
  </section>`;
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Semrush · Current state</title>
<style>
:root {
  --primary:        ${C.primary};
  --primary-dark:   ${C.primaryDark};
  --accent:         ${C.accent};
  --secondary:      ${C.surfaceAlt};
  --text:           ${bodyText};
  --text-muted:     ${C.textMuted};
  --surface:        ${bodyBg};
  --surface-alt:    ${C.surfaceAlt};
  --border:         ${C.border};
  --display:        ${display};
  --body:           ${body};
}
* { box-sizing: border-box; }
body { margin: 0; padding: 0; background: var(--surface); color: var(--text); font-family: var(--body); font-size: 16px; line-height: 1.6; }
nav.top {
  position: sticky; top: 0; z-index: 99;
  background: var(--primary-dark); color: #fff;
  padding: 14px 32px;
  display: flex; flex-wrap: wrap; gap: 18px; align-items: center;
  font-family: var(--display);
  font-size: 12px; ${useUpper ? 'text-transform: uppercase;' : ''}
  letter-spacing: 1.5px;
}
nav.top strong { font-weight: 700; margin-right: 32px; }
nav.top a { color: rgba(255,255,255,0.8); text-decoration: none; padding: 6px 12px; border-radius: 150px; transition: background 200ms ease; }
nav.top a:hover { background: rgba(255,255,255,0.18); color: #fff; }
main { max-width: 1280px; margin: 0 auto; padding: 64px 32px; }
section { padding: 56px 0; border-top: 1px solid var(--border); }
section:first-of-type { border-top: 0; padding-top: 24px; }
h1, h2, h3, h4 { font-family: var(--display); color: var(--text); ${useUpper ? 'text-transform: uppercase;' : ''} margin-top: 0; letter-spacing: -0.01em; }
h1 { font-size: 56px; line-height: 1.05; margin-bottom: 12px; letter-spacing: -0.02em; ${useUpper ? '' : ''} }
h2 { font-size: 32px; margin-bottom: 24px; }
h3 { font-size: 22px; margin-bottom: 12px; }
h4 { font-size: 16px; margin-top: 24px; margin-bottom: 12px; }
p { margin-top: 0; }
code { font-family: ui-monospace, "SFMono-Regular", Menlo, monospace; font-size: 13px; background: var(--surface-alt); padding: 2px 6px; border-radius: 4px; color: var(--text); }
.badge { display: inline-block; padding: 4px 10px; border-radius: 150px; background: var(--primary); color: #fff; font-family: var(--display); ${useUpper ? 'text-transform: uppercase;' : ''} font-size: 11px; letter-spacing: 1px; }
.badge-warn { background: var(--accent); color: var(--text); }
.tag { display: inline-block; padding: 2px 8px; border-radius: 4px; background: rgba(0,143,248,0.1); color: var(--primary); font-family: ui-monospace, monospace; font-size: 11px; }
.muted { color: var(--text-muted); }
.small { font-size: 12px; }
.pill { display: inline-block; padding: 6px 14px; border-radius: 150px; background: var(--primary); color: #fff; font-size: 13px; font-weight: 500; ${useUpper ? '' : ''} }

/* masthead */
.masthead { padding: 64px 0 24px; }
.hero-line { font-family: var(--display); font-size: 36px; font-weight: 600; margin: 0 0 16px; color: var(--accent); line-height: 1.1; letter-spacing: -0.02em; }
.tagline { font-size: 18px; color: var(--text-muted); max-width: 720px; }
.origin { font-family: ui-monospace, monospace; font-size: 13px; color: var(--text-muted); margin-top: 8px; }

/* coverage */
.stats-row { display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0; }
.stat-box { flex: 1 1 220px; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 16px; padding: 20px 24px; }
.stat-num { font-family: var(--display); font-size: 32px; font-weight: 600; color: var(--primary-dark); line-height: 1; }
.stat-label { font-size: 13px; color: var(--text-muted); margin-top: 4px; ${useUpper ? '' : ''} }

/* pages thumbnails */
.thumbs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
.thumb { margin: 0; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; background: var(--surface); }
.thumb img { display: block; width: 100%; height: 200px; object-fit: cover; object-position: top; }
.thumb figcaption { padding: 12px 16px; }
.thumb-title { font-family: var(--display); font-weight: 600; font-size: 14px; line-height: 1.3; margin-bottom: 4px; }
.thumb code { font-size: 11px; background: transparent; padding: 0; color: var(--text-muted); }

/* palette */
.swatch-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
.swatch { border: 1px solid var(--border); border-radius: 16px; overflow: hidden; background: var(--surface); }
.chip { padding: 32px 16px; font-family: var(--display); ${useUpper ? 'text-transform: uppercase;' : ''} font-weight: 600; font-size: 14px; letter-spacing: 1px; }
.swatch-meta { padding: 16px; }
.swatch-meta code { background: transparent; padding: 0; }
.chips-row { display: flex; flex-wrap: wrap; gap: 4px; margin: 8px 0; }
.chip-mini { display: inline-block; padding: 2px 8px; border-radius: 8px; background: var(--surface-alt); font-size: 11px; color: var(--text-muted); ${useUpper ? '' : ''} }

/* typography */
.spec-row { padding: 16px 0; border-bottom: 1px solid var(--border); }
.spec-row:last-child { border-bottom: 0; }
.spec-meta { font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 8px; background: transparent; padding: 0; }
.spec { color: var(--text); }
.body-spec { font-family: var(--body); font-size: 16px; line-height: 1.5; max-width: 65ch; }
.audit-row { margin-top: 16px; }

/* voice */
.voice-grid { display: grid; gap: 16px; grid-template-columns: 1fr 1fr 1fr; }
.voice-card { background: var(--surface-alt); border-radius: 16px; padding: 20px 24px; }
.voice-label { font-family: var(--display); ${useUpper ? 'text-transform: uppercase;' : ''} font-size: 11px; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 8px; }
.voice-text { font-size: 16px; line-height: 1.5; color: var(--text); }
@media (max-width: 800px) { .voice-grid { grid-template-columns: 1fr; } }

.cta-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
.cta-table th { text-align: left; font-family: var(--display); ${useUpper ? 'text-transform: uppercase;' : ''} font-size: 11px; letter-spacing: 1px; color: var(--text-muted); padding: 8px 0; border-bottom: 1px solid var(--border); }
.cta-table td { padding: 12px 0; border-bottom: 1px solid var(--border); font-size: 14px; }

.head-grid { display: grid; gap: 8px; grid-template-columns: 1fr 1fr; }
@media (max-width: 700px) { .head-grid { grid-template-columns: 1fr; } }
.head-row { display: flex; justify-content: space-between; gap: 12px; padding: 8px 12px; background: var(--surface-alt); border-radius: 8px; }
.head-text { font-family: var(--display); font-weight: 500; }

/* tensions */
.tensions-grid { display: grid; gap: 16px; grid-template-columns: 1fr 1fr; }
@media (max-width: 720px) { .tensions-grid { grid-template-columns: 1fr; } }
.tension { background: var(--surface); border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 12px; padding: 16px 20px; }
.tension-head { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
.tension h4 { margin: 0 0 8px; font-size: 16px; }
.tension-body { font-size: 14px; line-height: 1.5; }
.tension-body ul { margin: 8px 0 0; padding-left: 20px; }
.tension-src { font-size: 11px; color: var(--text-muted); margin-top: 12px; }

/* motifs */
.motifs-row { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 16px; }
.motif-card { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.motif-card code { background: transparent; padding: 0; }

/* components */
.comp-list { padding-left: 16px; line-height: 2; border-left: 3px solid var(--primary); margin: 12px 0; }

/* cross-promo */
.crosspromo-tag { display: inline-block; padding: 4px 12px; border-radius: 8px; background: var(--accent); color: var(--text); ${useUpper ? 'text-transform: uppercase;' : ''} font-size: 11px; letter-spacing: 1px; margin-bottom: 16px; }
.crosspromo-block { background: var(--primary-dark); border: 4px dashed var(--primary); padding: 32px; border-radius: 16px; }
.crosspromo-block h3 { color: #fff; font-size: 28px; margin-bottom: 16px; }
.crosspromo-tiles { display: grid; gap: 8px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.crosspromo-tile { padding: 12px 16px; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); border-radius: 8px; font-size: 14px; }

/* syscomp */
.syscomp-list { display: grid; gap: 12px; }
.syscomp { background: var(--surface-alt); border-radius: 12px; padding: 14px 18px; }
.syscomp header { margin-bottom: 6px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

/* logo */
.logo-row { display: flex; gap: 32px; align-items: center; flex-wrap: wrap; }
.logo-img { background: var(--surface-alt); padding: 24px; border-radius: 16px; }
.logo-meta { display: grid; grid-template-columns: max-content 1fr; gap: 6px 16px; font-size: 14px; }
.logo-meta dt { font-family: var(--display); ${useUpper ? 'text-transform: uppercase;' : ''} font-size: 11px; letter-spacing: 1px; color: var(--text-muted); }
.logo-meta dd { margin: 0; }

/* spacing */
.space-row { display: flex; gap: 12px; align-items: end; margin: 16px 0; flex-wrap: wrap; }
.space-bar { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.bar { width: 24px; background: var(--primary); border-radius: 4px 4px 0 0; }
.radii-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }

/* footer */
footer.review-footer { margin-top: 64px; padding: 32px 0; border-top: 1px solid var(--border); font-size: 13px; color: var(--text-muted); }
.legend { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 12px; align-items: center; }

/* print */
@media print {
  nav.top { display: none; }
  section { break-inside: avoid; }
}
</style>
</head>
<body>
<nav class="top">
  <strong>${esc(brand.site.name)} · Current state</strong>
  <a href="#coverage">Coverage</a>
  <a href="#pages">Pages</a>
  <a href="#palette">Palette</a>
  <a href="#typography">Type</a>
  <a href="#voice">Voice</a>
  <a href="#tensions">Tensions</a>
  <a href="#motifs">Motifs</a>
  <a href="#components">Components</a>
  ${brand.crossPromo?.detected ? '<a href="#crosspromo">Cross-promo</a>' : ''}
  <a href="#syscomp">System</a>
  <a href="#logo">Logo</a>
  <a href="#spacing">Spacing</a>
</nav>

<main>
  <header class="masthead">
    <h1>${esc(brand.site.name)}</h1>
    <p class="hero-line">${esc(brand.voice.heroHeadline || '')}</p>
    <p class="tagline">${esc(brand.site.tagline || '')}</p>
    <p class="origin">${esc(brand.site.originUrl)}</p>
  </header>

  <section id="coverage">
    <h2>Coverage</h2>
    <div class="stats-row">
      <div class="stat-box"><div class="stat-num">${successCount}/${pages.length}</div><div class="stat-label">Pages extracted</div></div>
      <div class="stat-box"><div class="stat-num">${log.discovery.waitMode}</div><div class="stat-label">Wait mode · ${avgWait}ms avg</div></div>
      <div class="stat-box"><div class="stat-num">${palette.length}</div><div class="stat-label">Palette colors · ${(brand.type.headingFamily.weights||[]).length} weights captured</div></div>
    </div>
    ${failCount ? `<p class="muted">Failures: <strong style="color:var(--accent);">${failCount}</strong></p>` : ''}
  </section>

  <section id="pages">
    <h2>Pages <span class="badge">cross-page</span></h2>
    <div class="thumbs-grid">${pagesGrid()}</div>
  </section>

  <section id="palette">
    <h2>Palette <span class="badge">cross-page</span></h2>
    <div class="swatch-grid">${paletteGrid()}</div>
  </section>

  <section id="typography">
    <h2>Typography <span class="badge">cross-page</span></h2>
    ${typographySpec()}
  </section>

  <section id="voice">
    <h2>Voice <span class="badge">home-only</span> <span class="tag">tone: ${esc(brand.voice.tone?.guess || 'unknown')}</span></h2>
    ${voiceCards()}
    <h4>CTA frequency (top 8)</h4>
    ${ctaTable()}
    <h4>Repeated headings (≥2 pages)</h4>
    ${headingFreqList()}
    <h4>Tone metrics</h4>
    ${toneMetrics()}
  </section>

  <section id="tensions">
    <h2>Tensions <span class="badge">synthesized</span></h2>
    ${tensionCards()}
  </section>

  <section id="motifs">
    <h2>Motifs <span class="badge">cross-page</span></h2>
    ${motifsRow()}
  </section>

  <section id="components">
    <h2>Components <span class="badge">cross-page</span></h2>
    ${componentsList()}
  </section>

  ${crossPromoSection()}
  ${systemComponentsSection()}
  ${logoSection()}
  ${spacingShape()}

  <footer class="review-footer">
    <p>This review was generated by stardust:extract from <code>stardust/current/_brand-extraction.json</code>, <code>stardust/current/pages/*.json</code>, and <code>stardust/current/_crawl-log.json</code>. Render in semrush's own captured colors and fonts.</p>
    <p><strong>What's next:</strong> open <code>stardust/current/brand-review.html</code>, verify the extraction is faithful, then run <code>/stardust:direct</code> to resolve a redesign direction.</p>
    <div class="legend">
      ${badge('observed')} ${badge('home-only')} ${badge('cross-page')} ${badge('inferred')} ${badge('synthesized')}
    </div>
  </footer>
</main>
</body>
</html>`;

fs.writeFileSync(OUT, html);
console.log('Wrote', OUT, '\nTensions detected:', tensions.length);
for (const t of tensions) console.log('  -', t.id, ':', t.title);
