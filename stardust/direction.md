<!-- stardust:provenance
  writtenBy: stardust:adopt (manual backfill — see learnings.md G15)
  writtenAt: 2026-05-08T16:30:00Z
  readArtifacts:
    - stardust/state.json
    - stardust/current/_brand-extraction.json
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - DESIGN.md
    - DESIGN.json
    - stardust/target/_brand-extraction.json
    - PRODUCT.md
    - designs/hub/
    - designs/bizpro-hub-prototype (1)/
  synthesizedInputs:
    - mode: adopted
    - referenceSites:
        - designs/hub/                      (canonical DS source)
        - designs/bizpro-hub-prototype (1)/ (page-pattern reference)
        - https://paolomoz.github.io/redesign-businessadobe/  (live deployed reference)
  stardustVersion: 0.3.0
  notes: >
    This direction was authored manually as a backfill, not by /stardust:direct.
    See learnings.md G15 for the gap; future /stardust:adopt skill should write
    this artifact natively. Mode "adopted" is a proposed third mode beyond
    brand-faithful / brand-replacing — neither preserve nor invent, but
    reverse-engineer from a reference DS.
-->
---
title: "Adopt the Adobe Acrobat Studio DS for the semrush marketing surface"
resolvedAt: 2026-05-08T16:30:00Z
toolkitVersion: "v1.0 (stardust v2)"
schemaVersion: 1
mode: adopted
---

# Active direction (2026-05-08T16:30:00Z)

## Phrase

> Adopt the Adobe Acrobat Studio design system for the semrush marketing surface — preserve semrush's product substance, replace its visual language with Adobe's.

The user-supplied source phrase: *"I want to redesign https://www.semrush.com/ into the new Adobe design."* The adoption mode resolves the implicit substance/register split.

## Restatement

A brand-replacing redesign with concrete adoption targets. semrush's product substance is fully preserved (B2B SEO/visibility platform, technical-confident audience, dashboard product reality, multi-pillar brand architecture). Its visual language is fully replaced by Adobe's Acrobat Studio DS — restrained two-gray light surface, Adobe Clean Display Black at 80–96px, signature trial blue (#3b63fb) reserved to one CTA, Adobe red (#eb1000) reserved to the wordmark, motion-led scroll experience (mosaic-converge hero, scrubbed text reveals, sticky-pill morph). Register moves from listicle/capability-dense/uppercase to single-clause/sentence-case/em-dash. Density moves from comp-rich to generous. Distinctiveness moves from familiar-SaaS to motion-distinctive.

## Movements

- **register** — `brand` (preserved from `current/PRODUCT.md`). Marketing surface; product UI is out of scope for this adoption.
- **expressive axis** — `restrained` → `committed-restrained` (Adobe DS is restrained palette but committed in motion + type scale)
- **tone** — `technical-listy` → `bold-direct` (sentence-case, single-clause, em-dash preferred)
- **density** — `dense` → `generous` (long sections at 128px padding, large type, single-action CTAs)
- **distinctiveness** — `familiar` → `motion-distinctive` (scroll-pinned hero, scrubbed text reveals are the signature)
- **audience** — preserved: SEO professionals, content marketers, agencies, in-house digital teams. NOT shifted to "creative professionals" — that would be substance loss.
- **constraints** — Homepage-only redesign for this run; remaining pages (pricing, features, features/keyword-magic-tool, company) extracted but out of scope. Adobe Clean is a licensed font; Source Sans 3 is the documented fallback (DESIGN.md § Font availability).

## Gaps and questions

None — the adoption mode resolves what `direct` would have asked. The target DS is fully specified by the source code in `designs/hub/` + `designs/bizpro-hub-prototype/`; the user-confirmed open questions from stage 2 (token vocabulary canonical = hub; sticky-CTA JS deferred to prototype; reduced-motion baked into DESIGN.md §7) close the remaining ambiguities.

## Anchor references

- `designs/hub/` — Adobe Acrobat Studio Offer Page Prototype (canonical DS source: `styles/global/`, nav system, hero animation, components)
- `designs/bizpro-hub-prototype (1)/bizpro-hub.html` — sibling page applying the same DS to a "Business Pro hub" layout; closer page-pattern match for semrush's marketing surface than the offer page
- https://paolomoz.github.io/redesign-businessadobe/ — live deployed reference

## Anti-references

Substance anti-references (preserved from `current/PRODUCT.md`):

- Pure-black + neon AI-startup look. semrush is data-rich and trusted; the redesign should not signal "yet another GenAI tool."
- Generic-2026-SaaS gradient hero with badge soup beneath. The current site is already cleaner than that; the adoption must not regress.

Register anti-references (rejected from current semrush register):

- "10 reasons why" / listicle headlines. Adobe register is single-clause headlines.
- Capability-dense subheads ("Find, fix, and optimize keywords across the entire funnel"). Adobe register collapses to one or two clauses with em-dash preference.
- Three-CTA hero density. Adobe hero is one primary CTA + one secondary, never three.
- ALL CAPS H2/H3. Adobe register is sentence case throughout; uppercase reads as a different design language.
- 8/12px-radius rounded-rectangle buttons. Adobe DS is pill-shaped (75px or 999px) for all CTAs.

Adoption anti-reference:

- "Adobe.com" mimicry. The result must read as semrush in Adobe's voice, not as Adobe's site repainted with semrush copy. Pillar names (`Semrush One`, `AI Toolkit`, `.Trends`, `Enterprise SEO Solutions`, `Local SEO`) preserved verbatim; pillar voice adopts the register.

## Divergence inputs

This is an **adopted** direction — divergence inputs are not seed-derived but reference-derived:

- **mode** — `adopted` (proposed third mode; see learnings G15)
- **seed** — N/A (deterministic seed is for synthesized directions; adopted directions trace to source files)
- **font deck** — `adobe-clean` (Adobe Clean Display Black + Adobe Clean body, licensed); fallback `source-sans-3` (Source Sans 3 weight 900 + body); documented in DESIGN.md § Font availability
- **palette** — `acrobat-studio-2025` (15 colors total: 1 ground, 3 surfaces, 5 inks, 2 brand-blues, 1 reserved-red, 3 utility-grays). Sourced from `designs/hub/styles/` and `designs/bizpro-hub-prototype/bizpro-hub.html` `:root` blocks. Hex format retained per source.
- **anti-toolbox audit** — pre-cleared. Every anti-toolbox hit Adobe's DS makes (sticky pill nav, full-bleed photographic hero, large-radius cards) is justified by the source DS itself, not a stardust default. Recorded in `DESIGN.json.extensions.divergence.anti_toolbox_hits` during prototype Phase 2.
- **brand-faithful inversions** — N/A. This is brand-replacing (semrush's brand surface is fully replaced), not brand-faithful. Inversions on the *target* side are inherent to the Adobe DS and live in `DESIGN.md` (no `box-shadow` on gnav, no clamp() on Title sizes, ScrollSmoother explicitly omitted, `#fa0f00`/`#eb1000` reserved to wordmark, etc. — see DESIGN.md § 6 Do's and Don'ts).

## Command sequence (proposed)

This is an adopted direction, so the standard `colorize`/`typeset` steps are skipped — those tokens are locked by the source DS. The sequence reduces to compose + validate + iterate:

1. ✅ `$stardust extract https://www.semrush.com/` — completed (5 pages, brand surface aggregated)
2. ✅ Manual stage 1b (inverse-extract Adobe refs → DESIGN.md/DESIGN.json) — completed; future `/stardust:adopt` would replace this step
3. ✅ Manual stage 2 (target `_brand-extraction.json` + PRODUCT.md authoring) — completed
4. ⏭ `$stardust prototype home` — current step. Compose Adobe DS onto semrush homepage content via `$impeccable craft`; validate via `$impeccable critique`; iterate via `$impeccable live`.
5. ⏭ `$stardust migrate home` — final deployable static HTML.

## User confirmation

> "proceed" (delivered after stages 1a, 1b, and 2 each completed; user has reviewed brand-review.html, DESIGN.md, PRODUCT.md, and confirmed the four stage-2 open questions)

## Pages in scope

- `home` (homepage only; user's stated scope from the initial AskUserQuestion: "Homepage only")

The other 4 extracted pages (`pricing`, `features`, `features__keyword-magic-tool`, `company`) remain `extracted` and are out of scope for this run. The brand surface they fed into is aggregated and consumed; they do not progress to `directed`.
