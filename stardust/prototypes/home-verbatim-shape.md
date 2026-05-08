<!-- stardust:provenance
  writtenBy:        stardust:prototype/manual-v2 (verbatim-copy delta)
  writtenAt:        2026-05-08T20:00:00Z
  page:             home (alternate variant; NOT a state.json transition)
  pageUrl:          https://www.semrush.com/
  variantOf:        stardust/prototypes/home-shape.md (v1, register-adopted)
  consumedBy:       impeccable:craft (Phase 2 v2 render)
  readArtifacts:
    - stardust/prototypes/home-shape.md
    - stardust/prototypes/home-proposed.html
    - stardust/current/pages/home.json
    - DESIGN.md
    - DESIGN.json
    - PRODUCT.md
    - stardust/direction.md
  stardustVersion:  0.3.0
  notes: >
    Thin delta brief. v1 (home-shape.md / home-proposed.html) is preserved unchanged.
    This document records ONLY the decisions that reverse for v2's verbatim-copy
    variant. The v1 brief's section list, structural composition, token contract,
    motion vocabulary, and component primitives all carry over verbatim. The
    semrush copy strings carry over verbatim from home.json instead of being
    rewritten through the PRODUCT.md voice-table.
-->
---
slug: home
url: https://www.semrush.com/
register: brand
template: landing
mode: adopted (visuals only) / verbatim (copy)
variant: v2
---

# Page shape delta: home (verbatim variant)

v2 of the home prototype. **Adobe Acrobat Studio DS visuals are LOCKED in (same as v1).** The semrush homepage **copy is preserved verbatim** from `current/pages/home.json` everywhere — no PRODUCT.md voice-table rewrites, no Adobe-register normalisation, no uppercase → sentence-case fixes. Voice diverges from visuals on purpose: the visual system is Adobe; the words are semrush as it stood on 2026-05-08.

This delta records every v1 decision that reverses for v2. It does not re-spec the page. Read it alongside `home-shape.md` — anything not listed below carries from v1.

## What stays from v1

- **Section list and order** (13 sections total; v2 brings the announcement-banner row back as section 2, restoring the count from 12 → 13).
- **All Adobe DS components**: gnav (frosted-glass pill, mega-nav clip-morph), mosaic-converge hero, hub-router accordion, perks 4-up, editorial bento, app-carousel, sticky CTA pill, dark enterprise band, footer with wordmark clip-reveal.
- **All Adobe motion patterns** from `DESIGN.json#extensions.motion[]` plus their `extensions.reducedMotion.collapseRules` fallbacks.
- **Adobe Clean Display Black + Adobe Clean** type stack with Source Sans 3 fallback (per DESIGN.md § Font availability).
- **Token contract** including all extra Acrobat tokens (`--radius-pill: 75px`, `--radius-section-bottom: 32px`, `--color-surface-light/-soft`, `--color-text-mid/-muted`, `--color-trial-blue`, `--ease-emphasized`, `--ease-spring-out`, `--duration-*`).
- **Spacing rhythm**: 128px section padding, 8-based scale.
- **Pill CTAs** (75px or 999px), 16px card radius, 32px section-bottom radius.
- **F-002 PLACEHOLDER signature** for items genuinely not in `home.json` (mosaic tiles, customer logos, plan-card prices, free-tool descriptions, footer sub-link copy beyond column headings, resource excerpt bodies, resource dates, sticky-cta plan-tier names + features, hero-aside testimonial-block PLACEHOLDER count: see "Placeholders" below).
- **Color format**: hex (DESIGN.md frontmatter is hex; brand-faithful pure-#000 / pure-#fff inversion applies).

## What changes from v1 (delta)

### A. Copy contract — verbatim everywhere

| Section | v1 (Adobe-register rewrite) | v2 (semrush verbatim from home.json) |
|---|---|---|
| Hero H1 | "Show up wherever search happens." | **"Be found everywhere search happens"** (no period — preserves source termination, line 133) |
| Hero subhead | "Measure your visibility — everywhere it counts: organic, paid, AI search, social." | **"The leading platform to grow and measure brand visibility across virtually every digital channel"** (verbatim, line 19/706) |
| Hero CTA pair → CTA trio | primary "Start free trial" + secondary "Talk to sales" | **three CTAs preserved: primary "Sign Up" (verbatim, ctas[3]/internal[4]) + secondary "Get insights" (verbatim, ctas[5]) + tertiary "Request a Demo" (verbatim, internal links text 1356).** US-flag-pill domain selector preserved as a cosmetic element of the search-input affordance (verbatim "US" label, ctas[4]). **DELIBERATE VIOLATION** of Adobe DS § 6 Don'ts ("kill the three-CTA hero density"). Recorded below. |
| Pillar-router section H2 (eyebrow) | "Solutions" (sentence-case) | **"SOLUTIONS ( 9 )"** verbatim with the count parenthetical (line 175). **DELIBERATE VIOLATION** of Adobe DS § 6 ("no all-uppercase headers"). |
| Pillar-router section deck (h3) | n/a (collapsed in v1) | **"GET SEEN. GET CITED. BE THE ANSWER."** preserved as a Title 3 deck under the eyebrow (line 189). **DELIBERATE VIOLATION** of uppercase rule. |
| Semrush One promo (above pillar-router) — restored as authored section | n/a (v1 used pillar-router headline `Your edge to win every search.`) | **H2 "Your edge to win every search"** verbatim (line 147), **body "Semrush One unites SEO and AI visibility in one place — built on 17 years of search intelligence."** verbatim (innerText line 706), **CTA "Try for free"** verbatim (internal links, line 1531). |
| 9-pillar surface | 5+4 split with all 9 pillar taglines rewritten | **All 9 pillars preserved with their captured pairing format.** 5 pillars in the hub-router accordion (semrush-one / SEO / AI VISIBILITY / TRAFFIC AND MARKET / CONTENT). 4 pillars in the perks 4-up (LOCAL / ADVERTISING / AI PR / SOCIAL). Each card: pillar code label verbatim (uppercase), tagline verbatim, "Expand" button label verbatim. **DELIBERATE VIOLATION** of uppercase rule on each pillar code. |
| Pillar tagline pairs | rewritten (5 + 4 = 9 rewrites) | **verbatim** — `SEMRUSH ONE / Grow your digital brand visibility`, `SEO / Outrank the rest with better SEO`, `AI VISIBILITY / Get LLMs to cite your brand`, `TRAFFIC AND MARKET / Analyze traffic on any website`, `CONTENT / Craft SEO and AI-ready content in minutes`, `LOCAL / Own your local presence`, `ADVERTISING / Make every ad dollar work harder`, `AI PR / Build AI trust through earned press`, `SOCIAL / Manage social all in one place`. |
| Stats block (was editorial-bento left card) | synthesized "By the numbers" with stat PLACEHOLDER | **REAL DATA from home.json's innerText capture** (line 706): "STATS AND FACTS" eyebrow + "THE DATA YOU NEED TO OUTRANK THE COMPETITION" deck (line 469, **uppercase preserved**) + 5 actual stats: `28B Keywords` / `43T Backlinks` / `808M Domain profiles` / `142 Geo databases` / `239M+ LLM prompts`, each with its captured sub-line. **DELIBERATE VIOLATION** of uppercase deck rule. **Lifts ~5 placeholders** from v1's count. |
| AI Visibility Index (editorial-bento right card → its own section) | synthesized eyebrow + body | **H2 "AI VISIBILITY INDEX"** verbatim uppercase (line 483), body **"Explore the strategies powering today's AI search leaders and get clear steps to build your own."** verbatim, CTA **"Explore the index"** verbatim. The AI Visibility Index Brand Share-of-Voice list is preserved verbatim as a Title 4 row (Google 7.9 / Samsung 7.4 / Apple 5 / Microsoft 4.4 / Chase 2.7 / Vanguard 2.6 / Garmin 2.3 / Capital One 2.2 / Amazon 2.1 / Fitbit 2; AI Platform: ChatGPT, April 2026). **DELIBERATE VIOLATION** of uppercase rule. **Lifts ~3 placeholders.** |
| Stories carousel | 11 testimonial PLACEHOLDER cards + synthesized headlines | **H2 "OUR CUSTOMERS"** verbatim (line 497), deck **"HOW WE HELP MARKETERS WIN"** verbatim (line 511), uppercase preserved. **One verbatim testimonial card** populated with the captured James Roth / ZoomInfo quote: blockquote *"Semrush for Enterprise has been a game-changer for our marketing teams. It's helped us work more efficiently, cutting down on manual tasks so we can focus on what really matters—engaging with our audience and driving growth."* + name "James Roth" + role "CRO at ZoomInfo" + the captured stat treatment "+373% Increase in share of voice" rendered as a flag-stat next to the quote. The remaining **10 testimonial cards stay as F-002 PLACEHOLDERS** (count drops 11 → 10). **Lifts ~4 placeholders.** **DELIBERATE VIOLATION** uppercase. |
| Enterprise band | synthesized body + 2 CTAs | **H2 "Bigger scale. Bigger advantage."** preserved (line 161 — already verbatim in v1), body **"Semrush for Enterprise means brand visibility dominance. Win more customers across markets and domains. Everywhere they search."** verbatim (innerText line 706), CTA **"Book a demo"** verbatim (internal link, line 1536). v1's 2-CTA pair becomes a 1-CTA single per the source. |
| Resources section | "Stay current" eyebrow / "What's new at Semrush." synthesized headline / 3 cards | **H2 "RESOURCES ( 7 )"** verbatim uppercase (line 525), deck **"STAY AHEAD OF WHAT'S NEXT"** verbatim uppercase (line 539). **All 7 resource cards preserved** (not v1's top-3-only) with **verbatim title + verbatim excerpt body** captured from innerText line 706: Adobe Completes Semrush Acquisition / FAQ for Customers / Direct Access to Semrush Data in ChatGPT / How We're Driving LLM Visibility / Sharpen Your Digital Marketing Skills / Enterprise AIO Adds Persona-Based Prompt Generation / Where Ambitious Marketers Take Center Stage. Each card's tag-strip preserved verbatim (News / News / News·Product Update / Blog Article / Academy Course / News·Product Update / Spotlight). **DELIBERATE VIOLATION** uppercase eyebrow + deck. **Lifts ~6 placeholders** (excerpts now sourced; dates remain unsourced). |
| Closing CTA | "Ready when you are" / "Start measuring today." synthesized | **H2 "GET STARTED WITH SEMRUSH TODAY"** verbatim uppercase (line 651), body **"Try Semrush free for seven days. Cancel anytime."** verbatim (innerText line 981), CTA **"Start free trial"** verbatim (line 1621). **DELIBERATE VIOLATION** uppercase. |
| Sticky CTA pill | label "Start free trial" | unchanged — already verbatim from source. |
| Footer column titles | preserved column headings | unchanged. v2 also adds the verbatim footer link inventory captured at innerText line 981 (`Semrush One / Features / Pricing / Free Trial / Compare Semrush / Success Stories / Stats and Facts / Affiliate Program / More tools` etc.) — distributed across the columns instead of all-PLACEHOLDER. **Lifts ~30 placeholders.** |
| Announcement banner | inlined into hero eyebrow as `Now an Adobe company · Visibility platform` | **REVERTED to authored row above gnav.** Verbatim copy: **"Semrush is now an Adobe company. Read the announcement >"** (text line 1321). 40px tall, ink-dark ground, white type, full-bleed. Hero eyebrow drops the announcement text entirely — eyebrow becomes empty / micro-label only. This re-introduces section 2 (count goes 12 → 13). The `>` arrow character is preserved verbatim from the source (it's a typographic chevron, not the >, but the source captured `>`). |

### B. Hero eyebrow

v1 inlined the acquisition message. v2 reverts to the authored announcement banner above the gnav AND drops the eyebrow's text. The eyebrow slot is replaced with the Semrush wordmark-as-eyebrow (no copy needed — the brand is the announcement).

### C. The Semrush One promo card slot is restored

v1 absorbed the "Your edge to win every search" line into the pillar-router section headline. v2 preserves the source's structural read: there is a *separate* Semrush One promo card BETWEEN the hero and the pillar-router (just as the source has). It uses the editorial-bento pattern's **left full-bleed card** with the captured H2 "Your edge to win every search" + body about 17-year search intelligence + "Try for free" CTA.

This brings the section count to **14**: `gnav` + `announcement-banner` + `hero` + `semrush-one-promo` + `pillar-router` + `secondary-pillar-grid` + `stats` + `ai-visibility-index` + `stories-carousel` + `enterprise-band` + `free-tools-strip` + `resources` + `closing-cta` + `sticky-cta` + `footer`. (Strictly 15 with the floating sticky-cta aside, but it doesn't sit in the section flow.)

### D. Eyebrow / deck rendering rule

v1 normalized all uppercase H2/H3 to sentence-case. v2 preserves uppercase **but** uses Adobe Clean Display Black at the same body-eyebrow size token (not as enormous Title 2 uppercase walls). Render uppercase headings at:
- Eyebrow uppercase: `t-eyebrow` token (16px / 700 / -0.01em / `letter-spacing: 0.02em` to soften the all-caps).
- Deck uppercase (H3): Title 2 sized (56px desktop / 40px tablet / 32px mobile), weight 900, **but with `letter-spacing: -0.01em` instead of `-0.04em`** to keep all-caps legible (caps need looser tracking than mixed-case).

### E. CTA layout in hero

3 CTAs in a row at desktop (Sign Up + Get insights + Request a Demo), wrapping to a 2+1 stack at tablet, fully stacked vertical at mobile. Visually balanced via the `--spacing-md (16px)` gap. The "US" flag-selector stays visually grouped with the search-input glass affordance (left of the primary CTAs in a single mp-glass-style container).

## Deliberate violations (recorded in `_provenance.deliberateViolations[]`)

Each item below is a knowing departure from Adobe DS § 6 Don'ts, made because the user directed v2 to preserve semrush copy verbatim. The render must NOT auto-normalize.

| # | Rule violated | Source-of-truth basis | Why violated | Render directive |
|---|---|---|---|---|
| 1 | "Kill the three-CTA hero density" | DESIGN.md § 6 Don'ts | Source surfaces 3 hero CTAs (Sign Up + Get insights + Request a Demo) | Render all 3, full pill weight |
| 2 | "No all-uppercase headers" | DESIGN.md § 6 Don'ts | All section eyebrows + decks ship as `SOLUTIONS ( 9 )`, `STATS AND FACTS`, `AI VISIBILITY INDEX`, `OUR CUSTOMERS`, `RESOURCES ( 7 )`, `GET STARTED WITH SEMRUSH TODAY`, `GET SEEN. GET CITED. BE THE ANSWER.`, `THE DATA YOU NEED TO OUTRANK THE COMPETITION`, `HOW WE HELP MARKETERS WIN`, `STAY AHEAD OF WHAT'S NEXT` | Render uppercase verbatim with looser tracking |
| 3 | "Pillar tagline ≤ 4 words, single clause, period-terminated" | PRODUCT.md voice-table row 5 | All 9 source taglines are sentence fragments without periods, multi-clause, longer than 4 words | Render verbatim, no period appended |
| 4 | "Sentence-case all the things" | PRODUCT.md voice-table | The 9 pillar code labels (`SEMRUSH ONE`, `SEO`, `AI VISIBILITY`, `TRAFFIC AND MARKET`, `CONTENT`, `LOCAL`, `ADVERTISING`, `AI PR`, `SOCIAL`) are uppercase brand codes in source | Render verbatim |
| 5 | "Section count parentheticals are taxonomy bleed" | (implied by Adobe DS — no canonical example uses `H2 ( N )`) | Source ships `SOLUTIONS ( 9 )` and `RESOURCES ( 7 )` with the count baked into the heading | Render verbatim including the parenthetical |
| 6 | "No announcement banner above gnav" | DESIGN.md § 5 (no slot for it) | The Adobe acquisition is load-bearing context for the redesigned home; v1 inlined it, but verbatim mode preserves the source's structural read where the banner is its own row | Render as 40px ink-dark band above gnav, full-bleed, with verbatim copy |
| 7 | "Adobe register prefers single-clause + period termination" | PRODUCT.md voice-table | Source headlines like "Be found everywhere search happens" (no period), "Bigger scale. Bigger advantage." (already complies), "Your edge to win every search" (no period), "Outrank the rest with better SEO" (no period, multi-clause) | Render verbatim, no period appended |

`directedBy: user`. Each entry must appear in the proposed file's `_provenance.deliberateViolations[]` and in the anti-toolbox audit-hits as `deliberateViolation: true` with the basis URL.

## Placeholder accounting

v1 ran 23 placeholder-slot families totaling ~111 distinct content units (mosaic tiles, plan cards, customer logos, etc).

v2 lifts content from `home.json` that v1 left as PLACEHOLDER:
- **Stats block (5 placeholders → 0)**: 5 verbatim figures + 5 verbatim sub-lines.
- **AI Visibility Index (3 → 0)**: real H2, body, CTA, plus 10-row Brand SoV list verbatim.
- **One testimonial card (4 → 0)**: James Roth / ZoomInfo quote, name, role, +373% stat verbatim. Remaining 10 cards stay PLACEHOLDER.
- **All 7 resource cards (instead of 3) get verbatim title + verbatim excerpt body**: gain 7 sourced excerpts where v1 had 3 cards and 3 PLACEHOLDER excerpts.
- **Footer link inventory (~30 → ~5)**: most footer link labels surface in `home.json` innerText line 981.
- **Enterprise body (1 → 0)**: verbatim semrush body sourced.
- **Closing CTA body (1 → 0)**: verbatim "Try Semrush free for seven days. Cancel anytime." sourced.

Total placeholder lift: roughly 50 → final v2 placeholder count target **~60**, down from v1's 111.

What stays PLACEHOLDER in v2:
- 15 hero mosaic tiles (no source imagery).
- 10 testimonial cards (only 1 quote captured).
- 11 customer logos (no logo files captured).
- 5 free-tool cards (only the gnav heading captured).
- 3 sticky-cta plan-tier names + 3 prices + 30 features.
- 3 resource dates.
- 11 customer-name-flags on testimonial cards (10 flag stats unsourced).
- ~5 footer sub-link labels still missing.
- 1 legal-row registration string.

## Visual collisions worth flagging upfront

Adobe visuals + semrush voice will read awkwardly in three places. The render should NOT try to soften these — they are the point of v2.

1. **Hero CTA stack reads cluttered** at the Adobe DS density. Three pill CTAs side-by-side under an 80px Title 1 violates the system's negative-space discipline. The user wants to see this collision.
2. **All-caps section headings clash with Adobe Clean Display Black** at large sizes. The font is designed for sentence-case (its low-x-height aperture is tuned for mixed-case rhythm); rendering `STATS AND FACTS` or `THE DATA YOU NEED TO OUTRANK THE COMPETITION` at 56px Title 2 weight 900 makes the type look angry where Adobe wants it to read calm.
3. **The "Outrank the rest with better SEO" tagline pattern** — semrush ships pillar taglines with the pillar name embedded in the tagline (e.g. "Outrank the rest with better SEO" repeats "SEO" because it's redundant when the card label already reads "SEO"). The hub-router card pattern was authored for short single-clause taglines that complement the label, not echo it.

## Procedure for craft (Phase 2 v2)

1. **Reuse the v1 file's `:root` token block verbatim.** Do not reauthor.
2. **Reuse the v1 file's CSS architecture** (resets, type tokens, `.btn--*` classes, `.grid` container, breakpoint media queries, motion declarations, reduced-motion guards). Do not reauthor.
3. **Reuse the v1 structural skeleton** (gnav → hero → pillar-router → … → sticky-cta → footer) but:
   - Restore section 2 as the announcement-banner row above the gnav.
   - Insert a `semrush-one-promo` editorial-bento section between hero and pillar-router (uses the existing editorial-bento pattern from v1's `editorial-bento` section component).
   - Split v1's `editorial-bento` into two distinct sections: `stats` (left card pattern, full row, 5-stat list) and `ai-visibility-index` (full-bleed dark band — the source ships this on `rgb(24, 30, 21)` ground per `perSectionStyle[3]`).
   - Replace every copy string with the verbatim semrush capture per § A above.
   - Render uppercase verbatim per § D rule.
   - Render 3-CTA hero per § E.
4. **F-002 PLACEHOLDER signature** unchanged. Apply only to the items in "What stays PLACEHOLDER in v2" above.
5. **Anti-toolbox audit**: every uppercase heading, the 3-CTA hero, the announcement banner, the section count parentheticals, the multi-clause pillar taglines must appear in `_provenance.audit_hits[]` flagged `deliberateViolation: true` with `directedBy: user` and `basis: "stardust/prototypes/home-verbatim-shape.md § Deliberate violations"`.
6. **Reduced-motion**: same `prefers-reduced-motion: no-preference` guard wraps GSAP/ScrollTrigger init as v1.
7. **Output**: `stardust/prototypes/home-verbatim-proposed.html`.

## Friction notes for learnings.md

- **The verbatim-copy variant is the compatibility test for "adopted" mode.** It surfaces whether the visual system can carry source voice when source voice ignores the system's voice-rules. The collisions in § "Visual collisions worth flagging upfront" are the data; the system either holds (visual system is robust to voice mismatch) or breaks (visual system was load-bearing on voice rules). Worth a learnings entry once we see the render.
- **Anti-toolbox audit needs a `deliberateViolation: true` flag.** Without it, every v2 render trips ~10 P1 audit warnings that would block prototyped status. The audit flag must distinguish "system violation we should fix" from "system violation user directed us to commit." Recommend adding to `audit-hits.md` schema.
- **Placeholder accounting is more granular than the spec assumes.** v2 lifts ~50 of v1's placeholders into sourced content by mining `innerText` captures (line 706, 981) and the `headings[]` array more deeply than v1 did. Suggests the F-002 contract should declare a "source-mining mode" between PLACEHOLDER (no source data) and verbatim-from-discrete-capture (e.g. a heading entry); innerText is a *less structured* but valid source.

End of delta.
