<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (Phase 1, manual — adoption mode)
  writtenAt:        2026-05-08T18:00:00Z
  page:             home
  pageUrl:          https://www.semrush.com/
  againstDirection: stardust/direction.md (Active 2026-05-08T16:30:00Z, mode=adopted)
  consumedBy:       impeccable:craft (Phase 2)
  readArtifacts:
    - stardust/current/pages/home.json
    - stardust/current/_brand-extraction.json
    - stardust/target/_brand-extraction.json
    - DESIGN.md
    - DESIGN.json
    - PRODUCT.md
    - stardust/direction.md
    - skills/prototype/reference/page-shape-brief.md
    - skills/prototype/reference/before-after-shell.md
    - skills/stardust/reference/token-contract.md
    - skills/stardust/reference/data-attributes.md
  stardustVersion:  0.3.0
  notes: >
    Adopted-direction brief: tokens, motion, and component vocabulary are LOCKED
    by the Adobe Acrobat Studio DS (DESIGN.md / DESIGN.json). This brief makes the
    per-page DEPLOYMENT decisions only — which sections from the semrush home
    map onto which Adobe components, where Adobe DS has no slot for what
    semrush ships, and where literal copy is preserved / rewritten / placeholder.
-->
---
slug: home
url: https://www.semrush.com/
register: brand
template: landing
mode: adopted
---

# Page shape: home

Adobe Acrobat Studio DS deployed onto semrush.com homepage content. The semrush home is the highest-traffic page on a B2B SEO platform — it has to do trust (logos, stats, third-party validation), product breadth (5 pillars, 50+ tools), and conversion (free-trial CTA + sales path) on one surface. Adobe's DS was authored for a creative-tools marketing surface (Acrobat Studio) where the same primitives carry a narrower brief: hero + editorial + carousel + perks + sticky CTA. The mapping below preserves every load-bearing semrush moment while giving each one an Adobe-shaped vehicle.

## User decisions (resolved 2026-05-08T17:00)

The 8 open questions surfaced at end-of-brief have been resolved by the user. Phase 2 (craft) operates against these decisions:

1. **Pillar IA:** 5+4 split (home.json's 9-pillar surface). 5 in hub-router, 4 in perks-grid.
2. **Stat-row:** keep as PLACEHOLDER (user fills real data after render).
3. **Enterprise-band CTA on dark:** ghost-white outline (matches Adobe DS `designs/hub/index.html` dark-hero pattern).
4. **Closing-CTA color:** ink-dark pill (preserves The One Blue Rule, DESIGN.md § 6).
5. **Free-tools strip:** keep on home (real semrush feature).
6. **Announcement banner:** **inline into hero eyebrow** (drops the custom compositional move, uses Adobe's existing eyebrow slot, preserves the load-bearing acquisition message). Section 2 is consequently DROPPED; section count is now **12** sections.
7. **Voice rewrites:** accept all (mechanical application of PRODUCT.md voice-table; user fine-tunes individual lines after render).
8. **Customer-logo / testimonial handling:** full F-002 PLACEHOLDER signature. If resulting density is too dashed-outline-heavy, that's evidence for learnings G16 (soft-placeholder mode); revisit in Phase 4 iteration.

## Sections (in render order)

1. **gnav** (system-component role: `header` → maps to `global-nav` in DESIGN.json `extensions.systemComponents`). Composition for this page: top-fixed pill, transparent over the hero, frosted-glass crossfade at >40px scroll, white wordmark over hero → black on scroll. Five primary nav links (`Products`, `Use Cases`, `Solutions`, `Plans`, `Free Tools`). Right side: outline-pill `Sign In` (ghost-white over hero, dark-outline scrolled) + ink-dark pill `Start free trial`. The `Free Tools` link is added beyond Adobe's canonical 4-link sequence (`Products / Use Cases / Solutions / Learn & Support`) because semrush's Free Tools strip is load-bearing top-of-funnel substance — see Composition gap §1 below. Mega-nav clip-path morph triggers on `Products` and `Use Cases`.
   - Source-side gnav has six labels: `Products`, `Resources`, `Pricing`, `Sign Up`, `Log In`, `Start free trial` (`current/pages/home.json` headings 1–7 + ctas + `_brand-extraction.json#voice.navItems`). Direction.md adopts Adobe's nav register, so `Resources` collapses into `Learn & Support`-style mega-nav under `Use Cases`/`Solutions` (Resources is excluded from this run per direction.md `Pages in scope`); `Pricing` becomes a top-level link (preserves the semrush IA — Pricing is its own page); `Sign Up` is dropped from the nav as a verbatim label (Adobe register: `Sign In` only) and consolidated with the trial CTA. *Verbatim labels: `Sign In`, `Start free trial`, `Pricing`, `Free Tools`.*

2. ~~**announcement-banner**~~ — **DROPPED** per user decision #6. The "Now an Adobe company" message is inlined into the hero eyebrow (§3) instead of authored as a separate compositional move. Rationale: drops a custom composition, uses Adobe DS's existing eyebrow slot, preserves the load-bearing acquisition message. Composition gap §2 (Friction notes) still records this as evidence that adopt-mode shape-authoring needs a "composition gap → drop / adapt-existing / author-new" disposition slot in the brief schema; the resolution here was "adapt-existing" (eyebrow).

3. **hero** (system-component role: `hero` → maps to DESIGN.md § 5 Components / Mosaic-Convergence Hero). Composition for this page: full-bleed white ground with the canonical 5-col × 3-row image mosaic-converge motion. Centered text block over the mosaic. Eyebrow + Title 1 + body-medium + CTA pair.
   - **Eyebrow** (16/700/-0.01em, text-muted) — `Now an Adobe company · Visibility platform` (preserved acquisition message from `current/pages/home.json` H3 `Adobe Completes Semrush Acquisition` + product positioning rewritten from `_brand-extraction.json#site.tagline`. Per user decision #6: inlines the announcement banner into the eyebrow slot rather than authoring a separate row. The `·` middot separator is the Adobe register choice — see `target/_brand-extraction.json voiceSamples[hero-eyebrow]: "PDF & Productivity"` for the comparable single-eyebrow pattern). Optional 24×24 brand glyph at 8px gap before the eyebrow text.
   - **Title 1** (Adobe Clean Display Black 80px / 0.96 / -0.04em) — `Show up wherever search happens.` (rewritten from semrush H1 `Be found everywhere search happens`, per PRODUCT.md § Voice & Tone Reference voice-table row 1; period-terminated, sentence case). Max-width 16ch.
   - **Body-medium** (Adobe Clean 16px / 1.3 / +0.01em, text-mid) — `Measure your visibility — everywhere it counts: organic, paid, AI search, social.` (rewritten from semrush subcopy "The leading platform to grow and measure brand visibility across virtually every digital channel" — PRODUCT.md voice-table row 2). Max-width 48ch.
   - **CTA pair** — primary `Start free trial` ink-dark pill (preserved verbatim from `current/pages/home.json#ctas[15]: "Start free trial"`); secondary `Talk to sales` outline pill (rewritten from `current/pages/home.json#ctas: "Get insights" + "Sign Up"` collapsed; "Talk to sales" is the semrush enterprise path and is in semrush voice — see PRODUCT.md voice-table row 4 which kills the three-CTA hero density and pairs primary + secondary).
   - **Mosaic content** — 15 tiles. Source: `assets/media/` (placeholder for Phase 2 — no source images yet captured from semrush; see Unsourced content below). Each tile is an abstract data-viz frame, screenshot-flat product UI, or marketing-shot of a person at work, per PRODUCT.md § Photography & Imagery shift-recommendation. Mosaic tiles all 16px-radius, 8px gap at convergence, scaled by viewport.
   - **Hero ground** ends with 32px rounded bottom corners so the next section can peek through (DESIGN.md § Sections / editorial bento rule).
   - **Motion** — `hero-mosaic-converge` from DESIGN.json `extensions.motion[name=hero-mosaic-converge]`: 220–240vh pin, scrub: 0.8, Chebyshev-distance ring ripple load-in. **Sticky-CTA pill (#5)** floats over this section; gnav (#1) sits above. Note: the sticky-CTA's signature "Start free trial" is the same label as the hero primary CTA — that's intentional per DESIGN.md (single trial wayfinder; the hero CTA leads to the same flow as the pill).

4. **pillar-router** (system-component role: per-pillar entry → maps to **hub-router accordion** in DESIGN.md § 5 Components, `target/_brand-extraction.json#motifs.patterns[hub-router-accordion]`). Composition for this page: a 5-card flex row immediately below the hero, the **single load-bearing pillar IA** that semrush ships. Cards represent the five pillars verbatim: `Semrush One`, `SEO`, `AI Visibility`, `Traffic & Market`, `Content` (preserved from `current/pages/home.json` H3 + H4 pairs lines 188–296: `SEMRUSH ONE / Grow your digital brand visibility`, `SEO / Outrank the rest with better SEO`, `AI VISIBILITY / Get LLMs to cite your brand`, `TRAFFIC AND MARKET / Analyze traffic on any website`, `CONTENT / Craft SEO and AI-ready content in minutes`).
   - The semrush home has **9 pillars** (`Solutions ( 9 )` per H2 line 175; the additional four are `Local`, `Advertising`, `AI PR`, `Social`) but the hub-router accordion is a 4–5 card pattern in `target/_brand-extraction.json#motifs.patterns[hub-router-accordion]`. **Deployment decision:** keep the top 5 pillars as hub-router cards (the five named brand pillars per `direction.md#Anti-references` "Pillar names preserved verbatim: Semrush One, AI Toolkit, .Trends, Enterprise SEO Solutions, Local SEO" — note the slight mismatch between direction.md's pillar names and the home page's IA: the home displays `Semrush One / SEO / AI Visibility / Traffic & Market / Content` as the *headline pillars* and demotes `Local / Advertising / AI PR / Social` to a downstream grid). Use the home page's actual IA (5 pillars verbatim from H3/H4) and surface `Local / Advertising / AI PR / Social` as a 4-up perks-style row in §5. **Open question for user**: is the home page's 5+4 split correct, or should we collapse to direction.md's brand pillars (`Semrush One / AI Toolkit / .Trends / Enterprise SEO Solutions / Local SEO`)?
   - **Eyebrow** — `Solutions` (rewritten from semrush H2 `SOLUTIONS ( 9 )` — uppercase + count parenthetical out per DESIGN.md § 6 Don'ts and PRODUCT.md voice-table row 5).
   - **Section headline** (Title 2, 56px, scroll-scrubbed via `[data-ta]` `[data-ta-group]`) — `Your edge to win every search.` (preserved from `current/pages/home.json` H2 line 148 `Your edge to win every search`, with period appended per PRODUCT.md voice rule).
   - **Card composition** — each card carries: pillar name (small label, 14/700, label-style), one-line tagline (Title 4 24px, Adobe-shape: single clause + period), one-line body, a single white-plus icon CTA. Active card grows from 291px → ~491px and crossfades to ink-dark ground with white type, per `extensions.motion[name=hub-router-accordion]` (600ms cubic-bezier(0.16, 1, 0.3, 1)). Reduced-motion: instant flex-basis change per `extensions.reducedMotion.collapseRules.hub-router-accordion`.
   - **Tagline rewrites** (semrush → Adobe register, per PRODUCT.md tone rules; one clause, period, sentence case):
     - `Semrush One — Grow your digital brand visibility` → `One platform. Every channel.`
     - `SEO — Outrank the rest with better SEO` → `Outrank the rest.`
     - `AI Visibility — Get LLMs to cite your brand` → `Get cited by the models.`
     - `Traffic & Market — Analyze traffic on any website` → `Read any market.`
     - `Content — Craft SEO and AI-ready content in minutes` → `Write for search and AI.`

5. **secondary-pillar-grid** (4-up perks-style grid, repurposed from DESIGN.md § 5 Components / **Perks 4-up**). Composition for this page: 4 perk-style cards on `var(--color-surface-light)` (#f8f8f8) ground, 16px radius, 32/24 padding, single section padding 128/0/128. The four cards surface the remaining home-page pillars `Local`, `Advertising`, `AI PR`, `Social` (from `current/pages/home.json` H3 line 230+ verbatim). Each card: pillar name (Title 4 24/900) + one-line body (rewritten Adobe-register from each H4 subtitle in home.json).
   - **Eyebrow** — `More toolkits` (synthesized — not in source. Adobe register, sentence-case).
   - **Section headline** (Title 2, 56px, `[data-ta]`) — `Every channel covered.` (synthesized — not in source. Closes the pillar IA loop with a single-clause statement; flagged for user review.)
   - **Card body rewrites:**
     - `Local — Own your local presence` → `Own the map pack.`
     - `Advertising — Make every ad dollar work harder` → `Spend smarter.`
     - `AI PR — Build AI trust through earned press` → `Earn the model's trust.`
     - `Social — Manage social all in one place` → `Run social in one window.`
   - At ≤1023px collapses to 2-up (per DESIGN.md § 5 Components / Perks 4-up rule); at ≤767px to 1-up.

6. **editorial-bento** (system-component role: → maps to DESIGN.md § 5 Components / **Editorial bento ("There's more to X than X")**). Composition for this page: two-card row tucked behind the previous section's 32px rounded bottom (`margin-top: -32px` per DESIGN.md). Background `var(--color-surface-soft)` (#f6f6f6).
   - **Left card** (`editorialBentoLeft`): 892px-flex large square, full-bleed photographic cover, white type inset 48px. Content: a *single* hero proof-statement in the form of a stat + verb + outcome — per PRODUCT.md design principle 5 ("data must read fast"). This is the place to put **one** of semrush's trust signals as marketing data (e.g. *"4.6 stars · G2 SEO category leader"* or a customer count). All such data is **PLACEHOLDER** at brief-time — the captured page does not surface clean stat candidates beyond the H2 `STATS AND FACTS` section heading and the `mp-stats-header` hook (see Unsourced content). Content slot: eyebrow `By the numbers` + Title 3 stat figure (placeholder) + one-line body.
   - **Right card** (`editorialBentoRight`): 492px-flex shorter image card with `box-shadow: 0 4px 100px rgba(0,0,0,0.25)` (the One-Photo-Shadow Rule), photographic image above, copy block on the gray ground. Content: a one-line proof tied to AI Visibility — semrush's flagship 2026 narrative (per H2 line 170 `Bigger scale. Bigger advantage.` and AI Visibility pillar). Eyebrow `AI Visibility Index` (preserved from `current/pages/home.json` H2 line `AI VISIBILITY INDEX` — sentence-case rewrite per voice rule) + Title 3 + body.
   - **Section eyebrow + headline pair** (above the bento, centered): eyebrow `The data behind it` + Title 2 `Where you stand. What to do next.` (synthesized; the source has H3 `THE DATA YOU NEED TO OUTRANK THE COMPETITION` which is uppercase and capability-dense — replaced per PRODUCT.md voice-table). Both `[data-ta]`-scrubbed.

7. **stories-carousel** (system-component role: → maps to DESIGN.md § 5 Components / **App carousel** repurposed for customer stories per `target/_brand-extraction.json#voiceSamples[section-headline]: "Real teams. Real work. Real impact."` and bizpro-hub-prototype's stories pattern). Composition for this page: section padding 128px, eyebrow + headline + body + CTA stack centered, then a horizontal carousel of testimonial cards.
   - **Eyebrow** — `Customer stories` (preserved from `target/_brand-extraction.json#voiceSamples[section-eyebrow]: "Customer Stories"` — sentence-case).
   - **Section headline** (Title 2, `[data-ta]`) — `Real teams. Real wins. Real numbers.` (rewritten from `target/_brand-extraction.json#voiceSamples[section-headline]: "Real teams. Real work. Real impact."` — adapted to semrush's data substance per PRODUCT.md design principle 5).
   - **Body** — rewritten from `target/_brand-extraction.json#voiceSamples[section-deck]: "From small businesses to the world's largest enterprises..."` adapted to semrush: `From scrappy startups to enterprise teams — marketers use Semrush to see, measure, and win their search.`
   - **Card content** — semrush home reports 11 testimonial cards (`current/pages/home.json#components.testimonialCards.count: 11`). Adobe carousel pattern is the natural fit. Each card: customer logo glyph + one-line quote + name + role + company. **Card width JS-synced to grid column 1**, dot navigation centered.
   - **Quote sourcing**: `home.json` doesn't expose the quote *text* in the captured headings — only the testimonial card *count* and the section heading. This means the brief MUST flag every quote, attribution, name, role, and company logo as PLACEHOLDER. See Unsourced content. The customer logos themselves (`Booking, Samsung, Amazon, FedEx, Decathlon, Dropbox, Netflix, P&G, Shopify, TikTok` per PRODUCT.md design principle 7) are referenced by name in PRODUCT.md but the literal logo images are not captured — also PLACEHOLDER.

8. **enterprise-band** (system-component role: → adapts the **editorial bento** treatment to a single full-bleed dark band; alternative is the hub-router pattern repurposed). Composition for this page: a full-bleed dark section (background ink-dark #000) with rounded-32px bottom (per DESIGN.md). Title 2 in white, body-medium in `rgba(255,255,255,0.7)`, two-CTA pair with primary trial-blue on dark ground (Note: this is the *only other place* trial-blue appears outside the sticky-CTA — DESIGN.md § Colors / The One Blue Rule says blue is reserved for trial CTA and plan-trial pill; this is the trial CTA in a dark-ground variant of the hero treatment, so it stays compliant. **Open question for user**: should the enterprise CTA be ink-dark-on-dark-fails — fall back to ghost-white outline, OR flip to white-pill with ink-dark text? See Open questions §3).
   - **Eyebrow** — `Enterprise SEO` (preserved from direction.md pillar list, sentence-cased).
   - **Section headline** (Title 2, white, `[data-ta]`) — `Bigger scale. Bigger advantage.` (preserved verbatim from `current/pages/home.json` H2 line 162 — already in Adobe register: paired single-clause statements with period termination. This is the cleanest source-side line on the page — ironic, since the source uses uppercase elsewhere but this H2 reads as if Adobe wrote it).
   - **Body** — `For teams running 50+ markets, 500+ pages, and the data tables to prove it.` (synthesized; the source has no Enterprise body copy beyond the H2). PLACEHOLDER eligibility: this is a generic enterprise framing in semrush register — flag for user confirmation.
   - **CTA pair** — primary `Talk to sales` (preserved verbatim from semrush enterprise path), secondary `See enterprise features` (synthesized).

9. **free-tools-strip** (composition gap, see §3 — adapts the **app carousel** pattern). Composition for this page: section padding 128px, eyebrow + headline stack, then a horizontal scroller of small tool cards (`var(--color-surface-soft)` ground, 24px radius — same as the app-carousel pattern). Each card: tool name (Title 4) + one-line use case + arrow. The semrush home has a Free Tools strip in the gnav mega-nav (H3 line 105 `Explore Free Tools`) and references free tools across the site — surfacing them on the home page is preserved IA. Adobe DS has no "free tools" pattern; the app carousel is the closest visual fit. Cards link to the existing semrush free tool pages.
   - **Tool list**: PLACEHOLDER. The captured `home.json` does not expose tool names beyond the mega-nav heading. Phase 2 craft can pull from `current/pages/home.json#headings` if more tool labels surface in deeper inspection, otherwise mark every card as PLACEHOLDER. Likely real tools (per common semrush IA): `Backlink Analytics, Domain Overview, Keyword Generator, Site Audit Lite, AI Overview Checker` — but unsourced.
   - **Eyebrow** — `Free tools`.
   - **Section headline** — `Try the tool before the trial.` (synthesized).

10. **resources** (system-component role: → maps to DESIGN.md § 5 Components / **App carousel** or 3-up card grid). Composition for this page: 3-up card row of recent posts/news. Source: `current/pages/home.json` H3s lines 271–298 — `Adobe Completes Semrush Acquisition`, `FAQ for Customers: Adobe Acquires Semrush`, `Direct Access to Semrush Data in ChatGPT`, `How We're Driving LLM Visibility at Semrush`, `Sharpen Your Digital Marketing Skills with Our Free Webinars`, `Enterprise AIO Adds Persona-Based Prompt Generation`, `Where Ambitious Marketers Take Center Stage`. Pick the top 3 (Adobe acquisition + ChatGPT integration + LLM visibility) — all preserved verbatim as titles.
   - **Eyebrow** — `Stay current` (rewritten from semrush H3 `STAY AHEAD OF WHAT'S NEXT` — uppercase + multi-clause out).
   - **Section headline** — `What's new at Semrush.` (synthesized).
   - Cards: small image at top, eyebrow (date — PLACEHOLDER), Title 4 title, one-line excerpt, arrow.

11. **closing-cta** (system-component role: full-width band → adapts editorial bento full-bleed left card pattern). Composition for this page: full-bleed white ground, centered eyebrow + Title 1 + body + single CTA. The page's existing closing band reads `GET STARTED WITH SEMRUSH TODAY` (H2 line `GET STARTED WITH SEMRUSH TODAY`, source-side uppercase).
   - **Eyebrow** — `Ready when you are`.
   - **Title 1** (80px) — `Start measuring today.` (per PRODUCT.md voice-table row 3 — the canonical translation of the source uppercase H2).
   - **Body** — `Free for 7 days. No credit card. Every feature.` (synthesized; flag as PLACEHOLDER for trial-terms accuracy — the actual trial terms are unsourced and could be wrong).
   - **CTA** — single primary `Start free trial`. (Note: this is the third place trial-blue could appear — but per The One Blue Rule, blue is reserved for the hero + the sticky-CTA modal. Closing CTA here is **ink-dark pill**, not blue, to keep the rule clean. Open question §4 for user confirmation.)

12. **sticky-cta-pill** (system-component role: → maps to DESIGN.md § 5 Components / **Sticky CTA Pill** + DESIGN.json `extensions.systemComponents[name=sticky-cta-pill]`). Composition for this page: floating bottom-center, 279×56 ink-dark pill, label `Start free trial`, GSAP morphs into the full pricing modal with three plan-cards. Plan-card content is PLACEHOLDER — semrush's pricing tiers (Pro/Guru/Business per typical semrush IA) are not captured in `home.json`; the brief flags all plan-card prices, feature-counts, and tier names as unsourced. Reduced-motion: pill expands to modal with no GSAP scale/radius interpolation, scrim immediate, per `extensions.reducedMotion.collapseRules.sticky-cta-morph`.

13. **footer** (system-component role: `footer` → maps to DESIGN.md § 5 Components / **Footer** + DESIGN.json `extensions.systemComponents[name=site-footer]`). Composition for this page: full-bleed `background: #000`, white type, 5-column link grid on desktop (6 at widest), stacks mobile-side. Wordmark with clip-path-reveal-on-scroll (60% inset → 0%). Link columns from `current/_brand-extraction.json#crossPromo.cluster` (which G5 misidentified as cross-promo but is actually the footer/mega-nav cluster — see learnings.md G5):
   - Column 1 — `Start Here` (sub-links PLACEHOLDER from cross-promo cluster)
   - Column 2 — `Find the Right Tools`
   - Column 3 — `Platform`
   - Column 4 — `Top Apps`
   - Column 5 — `Grow with Semrush`
   - Footer also surfaces: `Explore Free Tools`, `About Semrush` (per heading sequence). All eight cluster headings preserved verbatim as column titles.
   - **Sub-link content** under each column is unsourced in `home.json` (the cross-promo cluster captures the headings but not the link items). **PLACEHOLDER** for every sub-link label and href — Phase 2 should mark each `<li>` with `data-placeholder="true"` and the migration step needs to crawl deeper to populate.
   - Legal row at bottom: copyright, `Privacy`, `Terms`, `Cookie settings`, `Adchoices`, `CCPA` (CCPA + adchoices preserved per DESIGN.md § Footer). `Cookie settings` is preserved verbatim from `current/_brand-extraction.json#voice.ctaSamples[10]: "Cookie settings"`.

## Layout strategy

- **Density:** generous (per direction.md `density: dense → generous`). Section padding 128px top + bottom (`var(--section-padding)`); inner content max-width 1920px on `.grid` container, with 8.333% margin (per DESIGN.json `extensions.grid.margin.m`).
- **Type-swap-by-breakpoint** (per DESIGN.md § 6 Don'ts / Don't use clamp() on Title sizes): every Title token redefines at desktop (96/80/56/48/24) → tablet (72/56/40/32/20) → mobile (56/40/32/24/20). Brief assumes Phase 2 honors this; do NOT use `clamp()` for Title sizes.
- **Grid:** 12-col on desktop (≥1024px), 6-col on tablet (768–1023px), 6-col on mobile (≤767px) — per DESIGN.json `extensions.grid.columns`. Gutter 8px.
- **Section transitions:** white ↔ surface-soft (#f6f6f6) ↔ ink-dark (#000) alternation. Hero ground white → editorial-bento gray → free-tools-strip gray → enterprise-band ink-dark → resources white → closing-cta white → footer ink-dark. Two-gray rule respected: surfaces are #f8f8f8 (perks-grid §5, planless `surfaceLight` use) OR #f6f6f6 (editorial-bento §6, app/free-tools carousels §7/§9). No third gray.
- **Section bottom corners:** hero (#3) and enterprise-band (#8) get 32px rounded bottoms so the next layer peeks through (per `motifs.borderRadius.section-bottom: 32px`). All other sections square-bottom.

## Key states

- **Default** — described per section above.
- **Scrolled-nav** — gnav frosted-glass crossfade at >40px scroll, logo + link colors flip from white to ink-dark in lockstep (per DESIGN.json `extensions.componentStyle.navPill.scrollTriggerThreshold: "40px"`).
- **Mega-nav-open** — clip-path morph of the gnav pill expands to full-viewport panel; mega-nav-dim scrim (`backdrop-filter: blur(32px); background: rgba(0,0,0,0.72)`) appears behind. Cards stagger in at 25ms per `extensions.motion[name=mega-nav-clip-expand]`.
- **Pillar-card-active (hub-router)** — active card grows 291→491px and crossfades to ink-dark + white type (`extensions.motion[name=hub-router-accordion]`). Adjacent cards stay at 291px in surface-soft.
- **Sticky-CTA-expanded** — pill morphs into 3-column plan-card modal with scrim. Plan-trial pill (the second permitted use of trial-blue per The One Blue Rule).
- **Carousel-states** (stories §7, free-tools §9) — dot navigation: 8px dots, inactive `var(--color-border)` (#d0d0d0), active scaled 1.25× and ink-dark. Round arrows on either side, 1.5px outline.
- **Card-flip-hover** (mega-nav product/use-case cards, where applicable) — surface-white → ink-near-black (#1a1a1a), all text inverts, 200ms ease (`extensions.motion[name=card-flip-hover]`).
- **Reduced-motion** — every motion above collapses per `DESIGN.json#extensions.reducedMotion.collapseRules` referenced by name. The brief deploys: `hero-mosaic-converge`, `text-scrub-reveal`, `hub-router-accordion`, `sticky-cta-morph`, `mega-nav-clip-expand`, `footer-wordmark-clip`, `lenis-smooth-scroll`, `default-transition`, `ease-emphasized`, `ease-spring-out`, `anim-enter-section`. **Audit:** all 11 collapse rules are declared in DESIGN.json. Coverage = complete for this brief — see Friction notes for the one ambiguity.
- **Empty / loading / error** — N/A (static marketing page).

## Interaction model

- **gnav mega-nav** — JS-driven clip-path morph on link click (`Products`, `Use Cases`); panel content per `extensions.systemComponents[name=mega-nav-panel]`. Mobile nav: hamburger toggle + clip-path overlay from gnav-pill geometry.
- **announcement-banner** — CSS `<details>` wrapper for closeable behavior; no JS.
- **hero** — scroll-pinned 220–240vh + ScrollTrigger scrub: 0.8 mosaic-converge timeline; Lenis smooth scroll wraps the page.
- **pillar-router** — click on inactive card → flex-basis transition to active state; one card active at a time. JS-light: state managed via class toggle, transition CSS-only per `--hhub-duration / --hhub-ease`.
- **stories-carousel** & **free-tools-strip** — horizontal scroll with snap-points; dot nav clicks scroll to nth card. Card width JS-synced to grid column 1 width per DESIGN.md § App carousel.
- **sticky-CTA** — tap pill → GSAP morph into modal; modal close button → reverse morph. ESC key closes modal.
- **resources cards, free-tools cards, pillar cards** — entire card click target (no nested click conflicts).
- **All section headlines** — `[data-ta]` + `[data-ta-group]` decorated for Text Animator scroll-scrub reveals (per `extensions.motion[name=text-scrub-reveal]`).

## Data attributes

```html
<header data-section="gnav" data-intent="navigate" data-layout="full-bleed" data-canon>
<section data-section="announcement-banner" data-intent="announce" data-layout="full-bleed" data-items="1">
<section data-section="hero" data-intent="emotional hook" data-layout="full-bleed" data-media="image" data-items="2">
<section data-section="pillar-router" data-intent="value proposition" data-layout="grid" data-items="5" data-interactive="accordion">
<section data-section="secondary-pillar-grid" data-intent="value proposition" data-layout="grid" data-items="4">
<section data-section="editorial-bento" data-intent="build trust" data-layout="grid" data-items="2" data-media="image">
<section data-section="stories-carousel" data-intent="build trust" data-layout="grid" data-items="11" data-interactive="carousel" data-fragment="testimonial-card" data-fragment-role="source">
<section data-section="enterprise-band" data-intent="value proposition" data-layout="full-bleed" data-items="1">
<section data-section="free-tools-strip" data-intent="discovery" data-layout="grid" data-items="5" data-interactive="carousel">
<section data-section="resources" data-intent="cross-link" data-layout="grid" data-items="3" data-fragment="resource-card" data-fragment-role="source">
<section data-section="closing-cta" data-intent="drive action" data-layout="full-bleed" data-items="1">
<aside data-section="sticky-cta" data-intent="drive action" data-layout="floating" data-items="1" data-interactive="modal">
<footer data-section="footer" data-intent="navigate" data-layout="grid" data-items="5" data-canon>
<body data-template="landing">
```

## Token contract additions

The `:root` block must expose the standard token-contract.md vocabulary mapped per `DESIGN.json#extensions.tokenContract.mapping`. Adobe-specific tokens beyond the contract minimum (already authored in `extensions.tokenContract.extraTokens`):

- `--radius-pill: 75px`, `--radius-full: 999px`, `--radius-section-bottom: 32px`
- `--color-surface-light: #f8f8f8`, `--color-surface-soft: #f6f6f6`, `--color-ink-near-black: #1a1a1a`
- `--color-text-mid: #4a4a4a`, `--color-text-muted: #6e6e6e`
- `--color-trial-blue: #3b63fb`, `--color-trial-blue-hover: #274dea`
- `--ease-emphasized: cubic-bezier(0.4, 0, 0.2, 1)`, `--ease-spring-out: cubic-bezier(0.16, 1, 0.3, 1)`
- `--duration-fast: 200ms`, `--duration-base: 400ms`, `--duration-emphasized: 480ms`, `--duration-spring: 600ms`

Phase 2 should expose all of these on `:root`. **Color format: hex** (per `before-after-shell.md` § Hard Requirement 6: "color format follows DESIGN.md frontmatter" — Acrobat ships hex throughout). The brand-faithful pure-#000 / pure-#fff inversion applies (per Hard Requirement 6 second bullet) — Adobe DS uses pure white as ground and pure black as ink as deliberate brand choices, so the no-pure-#000/#fff agent-default rule is inverted here. Document this in the proposed file's provenance.

## Vendor dependencies

Per DESIGN.json `extensions.vendorDependencies`: GSAP, ScrollTrigger, Lenis are required. Vendored locally (no CDN for migrate output; CDN acceptable for the Phase 2 prototype). **Do NOT load ScrollSmoother.min.js** — collapses document height to 0 (DESIGN.md § Don'ts).

## Unsourced content (placeholder list)

Per `before-after-shell.md` § Content sourcing hierarchy and the F-002 PLACEHOLDER contract. Every placeholder below must render with the visual signature (2px dashed `var(--color-trial-blue)` outline, monospace eyebrow `PLACEHOLDER · <type>`, surface-light tint background, illustrative shape hint) and appear in the proposed file's `unsourcedContent[]` after Phase 2 render.

The semrush home is a B2B marketing surface where stats, customer logos, and pricing are the trust signal — and the captured `home.json` provides almost none of these as literal values. This means the F-002 contract will dominate the Phase 2 render. See Friction notes §5 for the friction this creates.

| selector | type | reason |
|---|---|---|
| `section[data-section="hero"] .hero-mosaic .tile:nth-child(*)` (15 tiles) | `image` | Mosaic image surfaces unsourced — `home.json` captures no hero imagery. |
| `section[data-section="editorial-bento"] .bento-left .stat-figure` | `stat` | Stat figure for "By the numbers" left card. `home.json` has H2 "STATS AND FACTS" but no stat values captured. |
| `section[data-section="editorial-bento"] .bento-left .stat-body` | `other` | One-line proof-statement supporting the stat. Unsourced. |
| `section[data-section="editorial-bento"] .bento-right .body` | `other` | AI Visibility Index proof body. The H2 exists; the supporting copy does not. |
| `section[data-section="stories-carousel"] .story-card:nth-child(*) blockquote` (11 cards) | `quote` | Customer testimonial text. `home.json` reports `testimonialCards.count: 11` but captures no quote text. |
| `section[data-section="stories-carousel"] .story-card:nth-child(*) .name` (11) | `other` | Customer name. Unsourced. |
| `section[data-section="stories-carousel"] .story-card:nth-child(*) .role` (11) | `other` | Customer role/title. Unsourced. |
| `section[data-section="stories-carousel"] .story-card:nth-child(*) .company-logo` (11) | `image` | Customer company logo. PRODUCT.md names brands (Booking, Samsung, Amazon, FedEx, Decathlon, Dropbox, Netflix, P&G, Shopify, TikTok) but no logo files captured. |
| `section[data-section="enterprise-band"] .body` | `other` | Enterprise body copy. Section H2 exists; body does not. |
| `section[data-section="free-tools-strip"] .tool-card:nth-child(*)` (5 cards × name/body/href) | `other` | Free tool name, one-liner, target. `home.json` has only the gnav heading "Explore Free Tools" — no tool list captured. |
| `section[data-section="resources"] .resource-card:nth-child(*) .date` (3) | `other` | Resource date/timestamp. Titles preserved verbatim but dates unsourced. |
| `section[data-section="resources"] .resource-card:nth-child(*) .excerpt` (3) | `other` | Resource excerpt body. Titles preserved; excerpts not captured. |
| `section[data-section="closing-cta"] .body` | `other` | Trial-terms body ("Free for 7 days. No credit card."). Trial terms unsourced — flag as PLACEHOLDER until verified against semrush's actual offer. |
| `aside[data-section="sticky-cta"] .plan-card:nth-child(*) .price` (3) | `price` | Plan-card price tags. Pricing not captured in `home.json` (lives on `pricing.json` which is out of scope). |
| `aside[data-section="sticky-cta"] .plan-card:nth-child(*) .tier-name` (3) | `other` | Plan tier name (Pro/Guru/Business per typical semrush IA — but unsourced for this run). |
| `aside[data-section="sticky-cta"] .plan-card:nth-child(*) .feature-list li` (~30) | `other` | Per-tier feature bullets. |
| `footer .footer-col:nth-child(*) li` (~30 sub-links) | `other` | Footer column sub-links. `_brand-extraction.json#crossPromo.cluster` captures column *headings* but not the link items. |
| `footer .legal-row .registration-info` | `other` | Legal copyright + EIN/registration info. Unsourced. |
| `section[data-section="announcement-banner"] .link[href]` | `other` | Announcement banner link target — text preserved but href unsourced. |
| `section[data-section="secondary-pillar-grid"] .perk-card .body` (4 cards) | `other` | One-liner bodies for Local/Advertising/AI PR/Social — taglines rewritten in brief, but each card's secondary body line is unsourced. |
| `section[data-section="editorial-bento"] .section-headline` | `other` | "Where you stand. What to do next." — synthesized headline, flag for user review. |
| `section[data-section="secondary-pillar-grid"] .section-headline` | `other` | "Every channel covered." — synthesized. |
| `section[data-section="free-tools-strip"] .section-headline` | `other` | "Try the tool before the trial." — synthesized. |

**Total placeholder slots: 65 distinct content units** (counting card-instance multiples). This is a higher density of placeholders than typical, and is the consequence of the F-002 contract applied honestly to a B2B SaaS surface. See Friction notes §5.

## Open questions for craft / for user (BEFORE Phase 2)

1. **Pillar IA: 5+4 split or direction.md's 5 brand pillars?** The home page surfaces `Semrush One / SEO / AI Visibility / Traffic & Market / Content` as headline pillars (top 5 of 9), with `Local / Advertising / AI PR / Social` demoted. Direction.md names a different 5: `Semrush One / AI Toolkit / .Trends / Enterprise SEO Solutions / Local SEO`. These are *different sets*. Which is canonical for the redesigned home? Recommendation: use the home page's actual 5 (since direction.md says "pillar names preserved verbatim from semrush's IA" but the pillar list it gives doesn't match the live home page). User confirmation needed.

2. **Stat row in editorial-bento (§6) — preserve as PLACEHOLDER, drop, or seek live data?** The semrush home has an H2 `STATS AND FACTS` section that we can't surface honestly without invented numbers (F-002). Options: (a) preserve the stat slot with PLACEHOLDER signature visible in proposed HTML; (b) drop the stat half of the bento and lean entirely on the AI Visibility Index half; (c) defer until the user can supply actual numbers. Recommendation: (a), with prominent PLACEHOLDER markers — preserves the design pattern and the F-002 contract.

3. **Enterprise-band CTA color treatment.** Trial-blue is reserved for hero + sticky-CTA-modal-plan-trial (The One Blue Rule, exactly two locations site-wide). The enterprise band has its own primary CTA (`Talk to sales`). Options: (a) ghost-white outline pill on dark ground; (b) white-pill with ink-dark text (inverts the primary-pill rule for dark grounds — Adobe references show this in the editorial-bento-left card). Recommendation: (b), as a defined dark-ground variant of `btn-primary`.

4. **Closing-CTA (§11) color treatment.** Same question as §3 but on white ground: keep ink-dark pill (per The One Blue Rule, the third trial-blue site-wide would violate the exactly-two rule), or break the rule for the closing CTA? Recommendation: ink-dark pill (preserve The One Blue Rule); the trial-blue's scarcity is the rule's whole point.

5. **Free-tools-strip (§9) — keep on home or move?** Adobe DS has no precedent for a free-tools strip on the home; semrush ships one as a top-of-funnel hook. Options: (a) keep, adapted as app-carousel pattern; (b) drop, route to a `/free-tools` page from the gnav `Free Tools` link only; (c) drop, route via mega-nav. Recommendation: (a) — free-tools is one of the five named pillars in PRODUCT.md § Content Pillars, and dropping it loses substance.

6. **Announcement banner (§2) — keep, drop, or inline into hero eyebrow?** Adobe DS has no announcement-bar slot. Options: (a) keep as authored composition above the gnav region (not below — Adobe's gnav floats above the hero, banner above gnav would create stacking conflicts) → **revise: keep it** *between gnav and hero, anchored to top of hero ground, height 40px*; (b) inline into hero eyebrow as `Now an Adobe company · Visibility platform`; (c) drop and rely on the homepage acquisition card in resources (§10). Recommendation: (a) revised positioning — the Adobe acquisition is load-bearing brand context for the redesign itself.

7. **Voice rewrites — accept all, partial, or revise?** This brief rewrites every uppercase H2/H3 into Adobe register per PRODUCT.md voice-table. Specific rewrites that are aggressive (rather than mechanical case-fixes) include:
   - "Be found everywhere search happens" → "Show up wherever search happens." (hero)
   - "Your edge to win every search" → "Your edge to win every search." (only added period — pillar-router headline)
   - "GET STARTED WITH SEMRUSH TODAY" → "Start measuring today." (closing CTA)
   - The five pillar-card taglines (§4)
   - The four secondary-pillar-card taglines (§5)
   User can accept/reject per line; flagging for explicit sign-off before Phase 2.

8. **Customer-logo handling (§7 stories-carousel).** PRODUCT.md names 10 customer brands. Render the logos in Phase 2: (a) inline SVG placeholders with brand-name text labels; (b) wordmark-only render (text in brand color, no real logo); (c) full PLACEHOLDER signature for each. Recommendation: (c) for first render to make the F-002 status visible, then user can drop in actual logos in iteration. Note: customer logos are *the* B2B trust signal — see Friction notes §5.

## Friction notes for learnings.md

- **Adobe DS lacks a slot for an announcement banner.** Semrush surfaces "Now an Adobe company" prominently above the hero; Adobe's hub-page DS has no equivalent. Brief authors a new compositional move (§2) but it is not in DESIGN.md, so it bypasses the system spec. A future `/stardust:adopt` skill should detect "structural moves the source ships that the target doesn't" during stage 1b inverse-extract and either (a) add the missing component to DESIGN.md before page-shape time, or (b) explicitly document them as page-level authored compositions in the brief schema. Currently page-shape-brief.md doesn't have a "composition gaps" section type — would be worth adding.

- **page-shape-brief.md format spec is ambiguous on multi-card sections.** The example brief has `data-items="3"` for stories-grid but doesn't clarify whether `data-items` counts cards or content units. For semrush's 11-testimonial carousel, `data-items="11"` reads cleanly, but for the editorial-bento (2 cards × multiple slots), it's not obvious. Clarification: `data-items` should = repeated-instance count of the section's primary unit, per data-attributes.md "number of repeated items" — confirmed by re-reading, but the brief schema would benefit from an explicit example.

- **Reduced-motion collapseRules audit — coverage gap on `editorial-bento parallax-lift`.** DESIGN.md § Sections describes the editorial bento as "parallax-lifts as the user scrolls" but no `extensions.motion[]` entry captures parallax-lift, and no `extensions.reducedMotion.collapseRules` rule names it. The brief deploys the editorial bento (§6) and Phase 2 will need to either (a) implement parallax-lift and add a collapse rule mid-render (drift back into DESIGN.md), or (b) drop the parallax-lift on the prototype and document the omission. Recommend authoring a `editorial-bento-parallax` motion entry in DESIGN.json + a corresponding collapse rule before Phase 2.

- **`/stardust:adopt` shape-authoring would differ from `/stardust:direct` shape-authoring** in three ways: (i) the brief can cite the source DS by name and component-class — `→ maps to hub-router accordion` is a precise structural reference, not a synthesized one; (ii) the brief surfaces *gaps* between source-page content and target-DS slots more sharply (semrush has stat-rows, free-tools, announcement banner that Adobe DS doesn't), so the open-questions section is longer and more substantive than a directed brief would have; (iii) the rewrite work — translating semrush's uppercase H2s into Adobe-register single-clause headlines — dominates the brief, where a synthesized brief would generate copy from PRODUCT.md voice rules in one pass. The adopt brief is more "deployment + gap log" than "deployment + rationale."

- **F-002 PLACEHOLDER contract creates outsized friction on B2B SaaS pages where stats and customer logos are *the* trust signal.** This brief flags 65+ placeholder slots, with the heaviest concentration on the stories-carousel (11 testimonials × name/role/company/quote = 44 unsourced units) and the sticky-CTA-modal plan-cards (3 tiers × name/price/features). For a marketing-focused redesign, "11 visible PLACEHOLDER cards in the testimonials section" defeats the visual point of the section — the reader sees dashed-outline boxes where social proof should be. Two paths forward worth piloting: (i) allow brief-time scrape of the source page's *actual* testimonial copy as a separate extraction step (page-shape-brief is downstream of extract; right now the F-002 contract trusts that extract captured everything load-bearing, but extract's `testimonialCards.count: 11` doesn't capture the quotes themselves); (ii) author a "trust-signal placeholder visual" that's less alarming than the dashed-outline default — e.g. blurred-name placeholders that read as "real but withheld" rather than "missing." Either is a meaningful tweak to the F-002 spec.

- **Direction.md / PRODUCT.md / home.json pillar lists do not agree.** Direction.md lists pillars as `Semrush One / AI Toolkit / .Trends / Enterprise SEO Solutions / Local SEO` (the brand pillars per direction.md anti-references). PRODUCT.md preserves "five product pillars carry the toolset — Semrush One, the AI Toolkit, .Trends, Enterprise SEO Solutions, and Local SEO." But the live home page (`current/pages/home.json`) surfaces 9 pillars headed by `Semrush One / SEO / AI Visibility / Traffic & Market / Content` (then 4 more). The brief uses the home page's actual IA but flags as Open Question §1. Future `/stardust:adopt` should reconcile site-IA vs brand-IA at extract time and surface the conflict to the user before direction is resolved, not at prototype-shape time.

- **Token contract format spec gap.** `token-contract.md` § Sourcing the values from DESIGN.md table maps `--max-width` to `DESIGN.json extensions.breakpoints.containerMaxWidth`, but Adobe's container max-width lives at `extensions.spacing.containerMaxWidth` (1920px) AND at `extensions.grid.containerMaxWidth` AND in the `extensions.breakpoints[]` array as a final entry `container-max: 1920px`. Three sources for the same value. The brief assumes 1920px (the DESIGN.json declares it consistently) but the contract spec should be tightened to one canonical source.

---

End of brief.
