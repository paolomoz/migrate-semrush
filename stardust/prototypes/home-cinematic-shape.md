<!-- stardust:provenance
  writtenBy:        stardust:prototype/manual-v3 (cinematic delta on top of v2 verbatim)
  writtenAt:        2026-05-08T21:00:00Z
  page:             home (alternate variant; NOT a state.json transition)
  pageUrl:          https://www.semrush.com/
  variantOf:        stardust/prototypes/home-verbatim-shape.md (v2)
  carriesFromV2:    every section, copy string, deliberate-violation, F-002 placeholder
  consumedBy:       impeccable:craft (Phase 2 v3 render — cinematic moves)
  readArtifacts:
    - stardust/prototypes/home-verbatim-shape.md
    - stardust/prototypes/home-verbatim-proposed.html
    - stardust/prototypes/home-shape.md
    - designs/hub/scripts/hero.js
    - designs/hub/scripts/text-animate.js
    - designs/hub/scripts/mega-nav.js
    - designs/hub/scripts/mobile-nav.js
    - designs/hub/HANDOFF.md
    - designs/hub/index.html (re-read for shader CSS)
    - designs/bizpro-hub-prototype (1)/bizpro-hub.html (lateral-scroll patterns)
    - DESIGN.md
    - DESIGN.json
  stardustVersion:  0.3.0
  notes: >
    Thin delta brief. v2 (home-verbatim-shape.md / home-verbatim-proposed.html) is
    preserved unchanged. v3 = v2 + cinematic moves. Every move below has a source
    file in designs/hub/scripts/ or designs/bizpro-hub-prototype (1)/bizpro-hub.html.
    No copy changes. No section reorder. The cinematic ambition exists WITHIN the
    verbatim-copy constraint — that's the design challenge.
-->
---
slug: home
url: https://www.semrush.com/
register: brand
template: landing
mode: adopted (visuals + motion) / verbatim (copy)
variant: v3-cinematic
---

# Page shape delta: home (cinematic variant)

v3 of the home prototype. **v2's verbatim copy contract is LOCKED in.** v2's component palette is LOCKED in. v3 layers cinematic motion + shaders + asymmetric breakouts + bolder typography color over v2 — exactly the moves the user named when they said v1/v2 "feel like a template." The Adobe reference's actual motion choreography lives in `designs/hub/scripts/` and `designs/bizpro-hub-prototype (1)/bizpro-hub.html`; v1/v2 captured the components but not the timeline structure. v3 wires the timelines.

## What stays from v2

- **Section list and order** (announcement-banner, gnav, hero, semrush-one-promo, pillar-router, secondary-pillar-grid, stats, ai-visibility-index, stories-carousel, enterprise-band, free-tools-strip, resources, closing-cta, sticky-cta, footer).
- **All semrush copy verbatim** from `home.json` per v2's `_provenance.contentSourcing[]`.
- **All 7 deliberate violations** (uppercase headings, 3-CTA hero, section count parentheticals, announcement banner, multi-clause taglines, etc.).
- **Token contract** (`:root` block from v2 carries verbatim, plus the v3 additions in § Token additions below).
- **F-002 PLACEHOLDER signature** for the same items v2 left placeholder. Same count target ~60.
- **Adobe DS palette + Adobe Clean type stack + Source Sans 3 fallback at weight 900.**
- **Reduced-motion guard pattern** (`matchMedia('(prefers-reduced-motion: no-preference)')` wrap on every timeline init).

## Cinematic ambitions — what v3 adds

### A. Motion choreography (wired, not faked)

| # | Pattern | Source file | What v2 had | What v3 adds |
|---|---|---|---|---|
| M1 | **Hero mosaic-converge** | `designs/hub/scripts/hero.js` | static grid at opacity 0.18 | Pin spacer 220vh; sticky `#hero` 100vh; 5×3 mosaic with x/y deltas per column scaled by vw/vh (per Figma node 7379:8963 — `xFrom = [-178,-89,0,90,179] / 1440 * vw`, `yFrom = [-307,-124,0,-100,-290] / 1024 * vh`); Chebyshev ring-ripple load-in (Ring 0/1/2, 0.1s/ring, `inset(50% round 16px)` → `inset(0% round 16px)`); ScrollTrigger `scrub: 0.8` collapsing to (0,0) tight grid. Hero text fades up `y:-80` opacity:0 over the same scrub. |
| M2 | **Text-animate scroll-scrubbed reveal** | `designs/hub/scripts/text-animate.js` | `[data-ta]` markup present but NOT animated; collapsed to static | Wire the `wrapLines()` line-splitter + `animateGroup()` per text-animate.js verbatim. Each `[data-ta-group]` collects `[data-ta]` (line-split) and `[data-ta-unit]` (whole-block) children in DOM order; assigns each a progressively-larger starting y offset (`(i+1) * window.innerHeight * 0.065`); ScrollTrigger `start: 'top 90%', end: 'top 40%', scrub: true`, `ease: power2.out`, no clip-mask. Wait for `document.fonts.ready` before measuring lines. |
| M3 | **Stories-carousel — sticky horizontal scroll** | `designs/bizpro-hub-prototype (1)/bizpro-hub.html` (tutorial-carousel pattern) + user directive | scroll-snap `overflow-x: auto` row | **Pin the section for 200vh; scrub the horizontal translateX of the card track from 0 to `-(trackWidth - viewportWidth)`.** User scrolls vertically; cards slide laterally. ScrollTrigger pin + scrub. The "cards move laterally with the scroll" moment the user asked for explicitly. |
| M4 | **Pillar-router scroll-driven active card** | `designs/hub/scripts/hub-router.js` (referenced — not in mandatory reads but pattern is named in DESIGN.json#extensions.motion[hub-router-accordion]) + scroll-trigger layered on top | hover/click only | Click + scroll: as user enters the section, `is-active` migrates from card 1 → 2 → 3 → 4 → 5 based on scroll progress through a pinned 100vh window. Click overrides scroll (sticky pointer takes precedence). Spring-out ease 600ms `cubic-bezier(0.16, 1, 0.3, 1)`. |
| M5 | **Sticky CTA pill morph (real GSAP)** | `designs/hub/styles/sticky-cta.css` + DESIGN.json#extensions.motion[sticky-cta-morph] | CSS-only modal slide-in | GSAP timeline: pill width 279 → modal-width, height 56 → modal-height, border-radius 16 → 24, `inner-pill-content` opacity 1→0, `modal-content` opacity 0→1; `--ease-spring-out`, 600ms; backdrop-blur scrim animates from 0 → blur(12px) `rgba(0,0,0,0.6)` over 400ms. |
| M6 | **Reduced-motion guard** | `DESIGN.md § 7` + `DESIGN.json#extensions.reducedMotion.collapseRules` | partial (only mosaic guarded) | Every GSAP timeline + ScrollTrigger.create wrapped in `matchMedia('(prefers-reduced-motion: no-preference)').matches` check. Static fallbacks: hero mosaic in tight grid, `[data-ta]` lines at y:0 opacity:1 first paint, stories-carousel reverts to scroll-snap row, pillar first card `is-active`, CTA pill expands to modal without GSAP interpolation. |
| M7 | **Anim-enter-section bizpro pattern** | `designs/bizpro-hub-prototype (1)/bizpro-hub.html` (scroll-driven section IIFE) + DESIGN.json#extensions.motion[anim-enter-section] | none | Sections that aren't text-scrub-revealed get a softer `opacity 0 → 1, translateY(40px) → 0` reveal triggered at 85% viewport, easeOut3, 30vh duration. Adds rhythm without overlapping M2. |

### B. Shaders / visual effects

| # | Effect | Where | How |
|---|---|---|---|
| S1 | **Animated gradient hero ground** | `.hero` background | Replace v2's flat `#fff` with a layered radial-gradient + linear-gradient on `background-position` animated via `@keyframes` (60s cycle, `ease-in-out`). Subtle warm-cool drift; final paint reads as off-white. Drops the perceived flatness without breaking The Two-Gray Rule (the gradient is a chromatic veil, not a third gray surface). |
| S2 | **Editorial bento with photographic treatment** | `.semrush-one-promo .so-card-cover` (left full-bleed) | Linear-gradient `135deg, #1a1a1a 0%, #2c2c2c 50%, #4a4a4a 100%` ground (already in v2) UPGRADED with a `mix-blend-mode: multiply` color overlay tinted toward `var(--color-trial-blue)` at 22% alpha — gives the dark surface a brand-aligned chromatic tint without breaking the One Blue Rule (the blue is sub-saturation, not a CTA). Plus a `0 4px 100px rgba(0,0,0,0.25)` photo-shadow per the canonical Adobe DS one-photo-shadow rule. |
| S3 | **Frosted glass on a second surface** | sticky-cta backdrop scrim AND a floating "section header" pill | Already on nav. Add: (a) the `.cta-modal-backdrop` gets `backdrop-filter: blur(12px)` per DESIGN.md § Backdrop Vocabulary — wired with the GSAP morph; (b) the `stories-carousel` section header ("OUR CUSTOMERS / HOW WE HELP MARKETERS WIN") sits in a floating glass panel that stays sticky-pinned at top during the horizontal scroll (`position: sticky; top: 96px; backdrop-filter: blur(24px); background: rgba(255,255,255,0.65); border-radius: 16px;`). |
| S4 | **Light-leak / film-grain on enterprise band** | `.enterprise-band` `::before` overlay | Conic-gradient `from 0deg, rgba(59,99,251,0.18) 0%, transparent 30%, transparent 70%, rgba(235,16,0,0.10) 100%` on `::before`, `mix-blend-mode: screen`, `filter: blur(80px)`, slow 24s rotation via `@keyframes rotate-light-leak`. Plus an SVG-data-URI noise overlay at `mix-blend-mode: overlay` opacity 0.04 for film grain. The black enterprise band gains chromatic life without losing its dark identity. |
| S5 | **Section-corner reveal (negative-margin overlap)** | `.stats-section` and `.ai-visibility-index` | v2 already has `margin-top: calc(-1 * var(--radius-section-bottom))` on `.stats-section`. v3 deepens this: stats sits with `-32px` margin-top peeking the hero's rounded bottom; AI-visibility-index uses `-48px` margin-top with a 32px rounded bottom of its own (clipping the section ABOVE through the gap). The page reads as composed strata. Add `overflow: clip` (not hidden) so horizontal motion isn't blocked. |
| S6 | **Gradient text fill** | `.enterprise-inner h2` ("Bigger scale. Bigger advantage.") | `background: linear-gradient(120deg, #ffffff 0%, #ffffff 35%, #c190ff 70%, #3b63fb 100%); -webkit-background-clip: text; background-clip: text; color: transparent;`. Uses the trial-blue at the tail (the only place the One Blue Rule is bent — it's a chromatic accent on a display headline, not a CTA, justified as a v3 cinematic move and recorded in deliberateViolations[]). Sentence `Bigger scale. Bigger advantage.` reads white-to-blue across the period. |
| S7 | **Hero headline color move (additional)** | `.hero-title` ("Be found everywhere search happens") | Single-word accent: the word `everywhere` rendered in trial-blue (`#3b63fb`). Two-color treatment without gradient. The first clause ("Be found") and last clause ("search happens") stay ink-dark. This is the bolder typography color move the user named ("first clause one color, second another"). Recorded as deliberateViolation row 8 — bends the One Blue Rule for a display headline accent. |

### C. Asymmetric / breakout layouts

| # | Move | Section | What changes |
|---|---|---|---|
| L1 | **Editorial bento offset** | `.semrush-one-promo` | v2 ships a 1.2fr / 1fr column split at the same height. v3 makes the right-side aside `align-self: end`, shorter (480px vs 540px cover height), and offsets it `transform: translateX(-32px) translateY(60px)` to overlap the cover card's right edge. Z-index 2 on aside. The bento now reads as overlapping strata not a clean 50/50 split. |
| L2 | **Full-bleed photographic band** | new wrapper around `.stats-section` | The stats section gets a `::before` full-bleed pseudo-band: 100vw width, 200px tall, sits half above and half behind the stats grid (`top: -100px`), `background: linear-gradient(135deg, #1a1a1a 0%, rgba(59,99,251,0.4) 50%, #1a1a1a 100%)` with a placeholder F-002 photo treatment. Stats cards float on top with `box-shadow` photo-card shadow. Defies section padding rhythm. |
| L3 | **Sections that overlap (z-index strata)** | hero / semrush-one-promo / stats | Hero (z:1) → semrush-one-promo (z:2, `margin-top: -64px`) → stats (z:3, `margin-top: -96px`). Each section has rounded-bottom 32px so the layer beneath shows through the gap. The page reads as composed slabs, not stacked rectangles. |
| L4 | **Asymmetric resources grid** | `.resources` | Replace v2's 3-column equal grid with a CSS-grid asymmetric layout: `grid-template-columns: 1.4fr 1fr 1fr; grid-template-rows: auto auto auto;` where card[1] spans 2 rows on the left (the Adobe Acquisition card — featured), and the remaining 6 cards fill the right two columns in 3 rows. Breaks the equal-card rhythm v2 carried. |

### D. Typography color moves

| # | Move | Where |
|---|---|---|
| T1 | **Eyebrow in trial-blue** | `.semrush-one-promo .stat-eyebrow` ("SEMRUSH ONE") | Render in `var(--color-trial-blue)` instead of muted gray. Single section break — pillar-router and stats keep muted-eyebrow per The Eyebrow-Headline Pair Rule. |
| T2 | **Hero headline two-color treatment** | `.hero-title` | Per S7 — single word `everywhere` in trial-blue. |
| T3 | **Enterprise headline gradient fill** | `.enterprise-band h2` | Per S6 — white-to-purple-to-trial-blue gradient. |
| T4 | **Closing CTA H1-sized + accent** | `.closing-cta h2` ("GET STARTED WITH SEMRUSH TODAY") | Render at Title 1 size (80/56/40 across breakpoints) instead of v2's Title 2. The word `TODAY` gets `color: var(--color-trial-blue)` accent. Trial-blue here is consistent with The One Blue Rule — `Start free trial` is the section's CTA, so the accent points at the trial intent. |

## Token additions for v3

These join the v2 `:root` block, not replace it. New tokens noted in `_provenance.tokensAdded[]`:

```css
--color-trial-blue-soft:    rgba(59, 99, 251, 0.22);    /* S2 multiply tint */
--color-light-leak-blue:    rgba(59, 99, 251, 0.18);    /* S4 conic-gradient stop */
--color-light-leak-red:     rgba(235, 16, 0, 0.10);     /* S4 conic-gradient stop */
--gradient-hero-ground:     radial-gradient(ellipse 1200px 800px at 30% 30%, rgba(59,99,251,0.04) 0%, transparent 60%),
                            radial-gradient(ellipse 1000px 600px at 80% 80%, rgba(193,144,255,0.05) 0%, transparent 55%),
                            #ffffff;
--gradient-headline:        linear-gradient(120deg, #ffffff 0%, #ffffff 35%, #c190ff 70%, #3b63fb 100%);
--shadow-photo-card:        0 4px 100px rgba(0, 0, 0, 0.25);   /* DESIGN.md § Elevation canonical */
--noise-svg-uri:            data-uri SVG turbulence (8-byte fragment baseline, 0.04 opacity overlay);
--scroll-pin-hero:          220vh;
--scroll-pin-stories:       200vh;
--scroll-pin-pillar:        100vh;
```

## Patterns NOT yet in DESIGN.json

These v3 cinematic moves are not currently in `DESIGN.json#extensions.motion[]` or `extensions.motifs.gradients[]` (which is empty, line 207). Recording for the friction log so a backport can happen post-render — NOT modifying DESIGN.json mid-run:

- **`stories-carousel-horizontal-scroll`** — sticky-pinned horizontal translateX scrub. The `bizpro-hub.html` tutorial-carousel uses click-driven horizontal motion; v3's scroll-driven version is a sibling but distinct pattern.
- **`pillar-router-scroll-driven`** — scroll position activates cards 1→2→3→4→5 as user enters/exits section. DESIGN.json captures `hub-router-accordion` (click-driven) but not the scroll-driven variant.
- **`gradient-hero-ground`** — animated radial+linear-gradient stack on the hero. `extensions.motifs.gradients[]` is empty.
- **`light-leak-conic`** — slow rotating conic-gradient at `mix-blend-mode: screen`. New shader.
- **`section-overlap-strata`** — z-indexed overlapping sections via negative margin. Adjacent to the `section-bottom-rounded` pattern but distinct (it's about overlap, not just the rounded bottom).
- **`gradient-text-fill`** — display headline `background-clip: text`. New typographic pattern.
- **`headline-single-word-accent`** — `<span class="accent">everywhere</span>` in trial-blue. New typographic pattern.

The user explicitly directed authoring missing patterns into v3 directly; backport is a separate friction item.

## Reduced-motion fallbacks for new patterns

Suggested additions to `DESIGN.json#extensions.reducedMotion.collapseRules` (don't update mid-run):

- `stories-carousel-horizontal-scroll`: revert to `overflow-x: auto; scroll-snap-type: x mandatory`. No pin, no scrub. Cards visible in their final positions on first paint.
- `pillar-router-scroll-driven`: first card `is-active` on first paint; click handler from v2 stays active. No scroll-driven activation.
- `gradient-hero-ground`: set `animation: none` on the keyframed `background-position`. Static gradient stack remains (it's chromatic depth, not motion).
- `light-leak-conic`: `animation: none` on the rotation; conic-gradient stays static (doesn't break the surface).
- `text-scrub-reveal` (carries from v2): already collapses per DESIGN.json.
- `sticky-cta-morph` (carries from v2): already collapses per DESIGN.json.
- `anim-enter-section` (M7): items render at final position/opacity on first paint; skip stagger and easeOut3 ramp.

All cinematic moves degrade to a static visual that still reads as "the redesigned semrush home" — never to a stripped page.

## Vendor dependencies — CDN exception

Per the user's explicit amendment for v3 (the prototype skill normally forbids external dependencies; cinematic prototypes need GSAP):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.42/bundled/lenis.min.js"></script>
```

Recorded as a documented amendment in `_provenance.cdnException`. The amendment surfaces a friction item: stardust's "self-contained" rule needs a clause for animation libraries.

## Deliberate violations added in v3 (on top of v2's 7)

| # | Rule violated | Source-of-truth basis | Why violated | Render directive |
|---|---|---|---|---|
| 8 | "Spread the trial-blue (#3b63fb) onto links, eyebrows, nav, or feature accents" | DESIGN.md § 6 Don'ts second bullet (The One Blue Rule) | v3 user directive: "typography colors aligned with the brand" — bolder accent moments. Hero headline single-word accent + Semrush One eyebrow + Today accent. | Render trial-blue accents as documented; record `deliberateViolation: true` with `directedBy: user` |
| 9 | "Don't use clamp() on Title sizes" | DESIGN.md § 6 Don'ts | v3 closing-cta H2 is bumped from Title 2 to Title 1 (80→56→40 token-swap by breakpoint, NOT clamp — verifies token-swap discipline). NOT a violation if implemented as breakpoint media-query swap; verified inline. | Token-swap by `@media`, not clamp. No violation if rendered correctly. |

v2's 7 deliberate violations all carry over.

## Procedure for craft (Phase 2 v3)

1. **Reuse v2's `:root` token block + extras.** Add v3's token additions inline.
2. **Reuse v2's CSS architecture** (resets, type tokens, `.btn--*`, `.grid`, breakpoint media queries, motion declarations). Layer v3's cinematic CSS on top in a dedicated `<style>` block tagged `/* v3 cinematic */`.
3. **Reuse v2's structural skeleton verbatim** — no section reorder, no copy change.
4. **Layer in cinematic CSS:**
   - Hero: replace flat `#fff` with `--gradient-hero-ground`, add `@keyframes` slow drift on `background-position`.
   - `.semrush-one-promo`: add the multiply tint, photo-shadow, asymmetric overlap.
   - `.pillar-router`: pin wrapper + scroll-driven `is-active` JS.
   - `.stats-section` + `.ai-visibility-index`: deepen the negative-margin overlap, add the photographic band pseudo-element.
   - `.stories`: rewrite as sticky-pinned horizontal scrub; sticky glass section header.
   - `.enterprise-band`: light-leak conic + film-grain noise + gradient text fill.
   - `.closing-cta`: bump to Title 1, accent the word `TODAY`.
   - `.hero-title`: span the word `everywhere` with trial-blue.
5. **Add inline GSAP + ScrollTrigger + Lenis** via CDN (per § Vendor dependencies).
6. **Wire all timelines:**
   - Hero mosaic-converge per hero.js verbatim.
   - text-animate per text-animate.js verbatim.
   - Stories horizontal scrub.
   - Pillar scroll-driven active.
   - Sticky CTA morph.
7. **Wrap every timeline in `matchMedia('(prefers-reduced-motion: no-preference)').matches`** check.
8. **Provenance comment:** `_provenance.cinematicMoves[]` lists each pattern with its source file. `_provenance.shaderEffects[]` lists each visual effect. `_provenance.deliberateViolations[]` carries v2's 7 + v3's 1 new.
9. **Output:** `stardust/prototypes/home-cinematic-proposed.html`.

## Friction notes for learnings.md

- **DESIGN.json#extensions.motifs.gradients[] is empty.** v3 needs gradients for hero ground, headline fill, light-leak. The DS source files contain gradient declarations (bizpro-hub.html: 5 linear-gradients; nav-pill rgba; backdrop-filter blur values up to 128px). The extract pass should backfill `gradients[]` and `mixBlendModes[]` — currently no inventory.
- **DESIGN.json#extensions.motion[] doesn't capture scroll-driven horizontal translation.** The bizpro tutorial-carousel is click-driven, not scroll-pinned. v3's stories-carousel pattern is a NEW addition. Suggests the motion catalog needs an `interaction` field (click / hover / scroll-pinned / scroll-scrubbed) so a renderer can pick the right primitive.
- **CDN exception is a stardust contract gap.** `prototype/SKILL.md` § Self-contained rule forbids external scripts. Cinematic prototypes need vendor libs (GSAP, Lenis). Either: (a) bundle inline (~80KB), (b) allow CDN as documented amendment, (c) provide a stardust-vendor-cache pattern. v3 chose (b); the amendment needs to be canonized.
- **Breakout / asymmetric layouts trip data-* attributes.** Sections with negative margin + z-index need `data-layout="overlap"` (or `data-z` numeric) to communicate the strata to the migrate stage. v3 invents `data-layout="overlap"` and `data-z="2"` inline; suggest adding to the data-* spec.
- **Reduced-motion collapse rules need expansion.** v3 introduces 4 new patterns (gradient-hero-ground, light-leak-conic, stories-carousel-horizontal-scroll, pillar-router-scroll-driven) — none are in `extensions.reducedMotion.collapseRules`. The render handles them inline; backport needed.
- **The verbatim copy + cinematic motion pairing surfaces a layering question.** v3 wraps verbatim semrush copy (uppercase headlines, multi-clause taglines) in Adobe-DS motion choreography. Does the motion read awkwardly when the words it's revealing read as semrush, not Adobe? The render is the data; this is worth a learnings entry once the user reviews.

End of delta.
