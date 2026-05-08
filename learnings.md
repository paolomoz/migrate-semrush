# Stardust learnings — semrush → Adobe redesign

Living log of stardust gaps, friction points, and improvement candidates encountered while running this redesign. Every entry should be specific enough that someone could turn it into a skill change.

---

## Run context

- **Source site:** https://www.semrush.com/ (homepage only)
- **Target design:** Adobe Acrobat Studio prototype system
  - DS source of truth: `designs/hub/` (styles/global/, nav, components, animations)
  - Page-pattern reference: `designs/bizpro-hub-prototype/bizpro-hub.html`
  - Live deployed reference: https://paolomoz.github.io/redesign-businessadobe/
- **Pipeline variant:** Adapted "B" flow — `/direct` replaced with a manual inverse-extract pass against the Adobe references, since `/direct` is built to *synthesize* a direction and we have a concrete target to *adopt*.

## Adapted pipeline

```
1a. /stardust:extract  → stardust/current/   (semrush as-is)
1b. inverse-extract    → stardust/target/    (Adobe refs → DESIGN.md/.json) ← MANUAL, gap-filler
2.  author target PRODUCT.md                  ← partial /direct replacement
3.  /stardust:prototype                        (semrush homepage with target DESIGN)
4.  /stardust:migrate                          (single page output)
```

---

## Gap log

Format per entry:
- **What we hit** — concrete friction during the run
- **Why it's a gap** — what stardust does today vs. what was needed
- **Proposed fix** — skill change, new sub-skill, or doc update

### G1. `/direct` cannot adopt an external design reference

- **What we hit:** User has a finished target design (Adobe DS as code + live URL). `/direct` is built to *synthesize* a palette + voice from a brief, not to *adopt* an existing implementation.
- **Why it's a gap:** No path to feed `/direct` a reference site or local implementation and have it derive `DESIGN.md` / `DESIGN.json` from it. Forces a manual inverse-extract pass.
- **Proposed fix:** Either (a) extend `/direct` with a `--reference <url|path>` mode that reverse-engineers tokens from CSS + DOM, or (b) introduce a sibling `/stardust:adopt` that runs `extract` semantics against a *target* (not the *current*) and writes target spec directly. Option (b) is cleaner — it reuses extract's machinery and keeps `direct` focused on synthesis.

### G2. Brand-surface aggregation has three correctness bugs that all bias the captured DESIGN

Hit during the semrush extract; all three caused real divergence between what the brand surface reported and what semrush actually ships visually.

- **G2a — Logo locator chain misses base64 data-URLs in CSS `background-image`.** Semrush's logo lives entirely in `getComputedStyle(a.srf-header__logo).backgroundImage` as `url(data:image/svg+xml;base64,...)`. The v1 priority chain (inline-svg → `<img>` → apple-touch-icon → og-image → favicon) silently fell back to apple-touch-icon — a 180×180 PNG of a *different* mark. Required a one-off `logo-probe.mjs`. Spec fix: after each step in the priority chain, also read computed `backgroundImage` on the same selectors and decode any `data:` URL.
- **G2b — Palette aggregation can't see gradient stops.** Semrush exposes a rich pastel palette via `linear-gradient(180deg, #dceeeb 0%, #e8e1ff 75%, #fff 100%)` on hero/product surfaces. `getComputedStyle().backgroundColor` returns `rgba(0,0,0,0)` when the surface is painted by a gradient, so none of those colors enter aggregation. *Single biggest accuracy gap on this run.* Spec fix: parse `backgroundImage` for `linear-gradient(...)`/`radial-gradient(...)` and extract stop colors into the palette, OR cite `cssCustomProperties` as a complementary source.
- **G2c — "background" role wrongly populated by dominant CTA-section color.** Default rule "most-frequent color used as background" picks dark CTA sections (large area-weighted occurrence) over the actual page-body white. Spec fix: prefer per-page sampled `<body>` background-color as canonical "background"; only fall back to area-weighted frequency when body is transparent.
- **G2d (related) — Pill-radius threshold is wrong.** Spec says pill = `>= 9999px`. Semrush ships pills at literal `border-radius: 100px` on 60px-tall buttons — visually pill, but value is < 9999. Without a fix, primary radius gets reported as 100px and cards (10px, the actual primary) become secondary. Spec fix: any radius ≥ 100px on an element where radius ≥ 50% of min(width,height) should be treated as a pill candidate.

**Why grouped:** all four are bugs in `reference/brand-surface.md`'s aggregation rules — they don't need new skills, just spec fixes. Worth filing as one PR.

### G3. Discovery doesn't de-rank content-surface sub-sitemaps

- **What we hit:** semrush's sitemap index lists 22 sub-sitemaps. The blog/news/kb/academy/locale-blog ones are huge by URL count and outrank marketing pillars by sitemap priority. Without an explicit override, the BFS would have selected 5 blog posts.
- **Why it's a gap:** `reference/ia-extraction.md` § Page selection has no built-in heuristic for "core marketing surface vs ancillary content surface." Locale variants are de-ranked but content-types aren't.
- **Proposed fix:** Maintain a small built-in list of common content-surface path prefixes (`/blog`, `/news`, `/kb`, `/academy`, `/articles`, `/posts`, `/help`, `/docs`) that get de-ranked the same way locale-specific sub-sitemaps already are, when the cap is small (≤10) and the goal is brand-surface aggregation.

### G4. Tensions detectors: false positives + missing detector

- **G4a — `T-cta-vocab` over-fires on legitimate funnel-stage CTA variation.** Semrush's "Sign Up / Start free trial / Try for free / Get insights" are deliberately distinct (hero vs pricing vs feature-page vs solutions). Detector flags as fragmentation. Closed-list bucket approach needs page-type awareness, or a per-page-type allowlist for variants.
- **G4b — `T-nav-conflict` closed list is missing acquisition-funnel pairs.** "Sign Up vs Request a Demo" is a real self-serve-vs-assisted-sales tension on semrush but the closed list doesn't include "request a demo" as a synonym for "book a demo" / "talk to sales."
- **G4c — Missing detector: temporal acquisition banners.** Semrush ships a "Now an Adobe company" banner — that's a temporal mark (stale in a year) but `T-temporal-mark` only matches anniversary / centennial / year-in-review patterns. Worth adding an "acquisition / merger / rebrand" sub-detector.
- **Proposed fix:** Per-page-type CTA-vocab allowlist; expand T-nav-conflict closed list; add acquisition-banner sub-detector.

### G5. System-component detection is too heading-sequence dependent

- **What we hit:** Most semrush landmarks (header, footer, sidebar) don't have headings inside their immediate-child sections, so the fingerprint key collapses to `header::::banner` for every page → fires as a system-component but with no useful heading-sequence content. Brand-review can't render meaningful info. Detected cross-promo cluster turned out to be the footer mega-menu, not a CTA band.
- **Why it's a gap:** `reference/brand-surface.md` § System components claims detection uses "heading-sequence + CTA-label fingerprint" but implementation is heading-only.
- **Proposed fix:** Implement the documented CTA-label fingerprint as fallback when heading-sequence is empty; add a DOM-shape hash as tertiary signal so footer mega-menus don't get classified as cta-bands.

### G6. No reference implementation for the three reusable Phase-2/3/5 scripts (biggest QoL win)

- **What we hit:** Subagent had to write three ad-hoc Node scripts from scratch — `extract.mjs` (Playwright extractor), `brand-surface.mjs` (cross-page aggregator), `brand-review.mjs` (HTML renderer). The brand-review renderer alone is ~500 lines of CSS+templating. Every fresh stardust run reinvents these.
- **Why it's a gap:** The skill describes the recipe in prose; there's no scaffold to copy from. This is the single biggest contributor to per-run time and the most likely place for inconsistency between runs.
- **Proposed fix:** Ship reference implementations under `skills/extract/scripts/` (or similar) — even minimal starter `.mjs` files would dramatically reduce friction. Could be invoked directly by the skill or copied + customized.

### G7. Reporting: wait-summary conflates two different times

- **What we hit:** Skill's report format prints "avg 2.4s" for waits, suggesting all good. In reality, semrush pages took 6–18s of total wall-clock per page (goto + grace + scroll + capture). The 8s `domcontentloaded` cap was hit fast, but the *extraction* was slow.
- **Proposed fix:** Distinguish "resolved-wait time" (mode-defined) from "total per-page extract time" in the wait-summary. The latter is what actually predicts crawl duration on subsequent runs.

### G8 (minor). Skill doc + slug-derivation polish

- SKILL.md references like `reference/playwright-recipe.md` are ambiguous about whether paths are relative to the SKILL.md or the project root. Worth clarifying.
- Slug derivation produces `features__keyword-magic-tool` for nested marketing pages — readable but the double-underscore is awkward in `migrated/` URL paths. Consider single-segment-flatten with type prefix.

### G9. DESIGN.md/DESIGN.json schema is too thin for adopting a real production design system

Surfaced during the manual stage-1b adopt against Adobe's hub/. Each item below was something the subagent had to invent schema for because impeccable's frontmatter had no slot:

- **Motion patterns have no first-class home.** GSAP timelines, ScrollTrigger configs, Lenis settings, scroll-pinned hero geometry, scrub lag values, clip-path morph from→to states — all live in JS in the source DS but should be canonical to the target spec. Subagent invented `extensions.motion[]` with `{kind, vendor, trigger, geometry}` keys. A motion-pattern subschema with a fixed `kind` enum (`scroll-pinned | scrubbed | clip-morph | state | page-scroll`) is the right shape.
- **Vendor runtime dependencies have no schema slot.** Adobe DS literally requires GSAP + ScrollTrigger + Lenis loaded in specific order. A target spec without this is non-renderable. Invented `extensions.vendorDependencies[]`.
- **"Deliberate omission" is load-bearing data.** ScrollSmoother is in `vendor/` but explicitly NOT loaded (HANDOFF.md warns it collapses document height). That's a fact downstream needs to know. Schema should formalize `required: false` + `omittedReason` as a first-class signal.
- **Type scale audit needs a third state.** `extract` brand-surface allows only `kind: "modular" | "ad-hoc"`. Adobe's scale (96/80/56/48/24, ratios 1.20→1.43→1.17→2.0) is deliberate per-token, not modular and not messy. Add `kind: "deliberate-token-set"`.
- **Per-breakpoint type tokens have no schema slot.** Adobe titles ship 3 fixed sizes (desktop/tablet/mobile) swapped via media queries — token-swap-by-breakpoint, not `clamp()`. Stitch frontmatter only holds one `fontSize`. Subagent had to invent `extensions.type.tabletSizes` / `mobileSizes` arrays.
- **Stitch's 8-prop component frontmatter can't hold real components.** Border, shadow, backdrop-filter, transition, min-height, state-flips (`hoverFlip: "background → #1a1a1a, text inverts"`) — half of Adobe's components are unrepresentable in the schema's component shorthand. Subagent put full specs under `extensions.componentStyle.*` with invented keys. Need a formalized component-extension subschema.
- **Fallback-font decision has no schema slot.** Whether the target uses a licensed font or open-source fallback is a target-spec authoring choice with downstream consequences (prototypes need to know which path to render). Subagent invented `extensions.type.fallbackFontDecision: { primary, fallback, rationale }`.

**Why grouped:** all are schema additions to impeccable's `document.md` spec + the stardust extensions block. Could be one PR against impeccable + a sibling stardust extensions doc update.

### G11. impeccable's `teach.md` (PRODUCT.md spec) leans greenfield, not redesign-of-existing

Surfaced authoring stage-2 PRODUCT.md (semrush substance, Adobe register). The teach flow assumes one project to define from scratch; here the input is two specs to merge (current substance + target register). Concrete gaps:

- **No "voice provenance per section" slot.** Each PRODUCT.md section blends substance from one source with register from another. teach.md gives no structured way to annotate that — author had to invent inline `<!-- _provenance: substance-preserved-from-X / register-applied-from-Y / synthesized -->` HTML comments per section. A redesign-aware spec should declare `substanceSource` and `registerSource` fields per section (or top-level pair).
- **No "redesign with explicit current+target" branch in teach's decision tree.** Step 1 doesn't surface this case; Step 3's interview script doesn't ask the substance-vs-register split that's load-bearing. A `/stardust:adopt`-aware variant should accept `--current PRODUCT.md --register-from target/_brand-extraction.json` and skip the user interview entirely.
- **Brand Personality synthesis is unstructured.** "Technical-confident expressed bold and direct" is the load-bearing synthesis in the whole document; teach.md only gives "[Voice, tone, 3-word personality, emotional goals]" as a freeform paragraph. Should be structured: `substancePersonality[]` + `targetRegisterPersonality[]` + `synthesizedPersonality`.
- **Anti-references need a substance/register split.** Substance-anti-references ("not a pure-black AI-startup look") and register-anti-references ("no listicle headlines, no capability-dense subheads, no three-CTA hero density") are different categories of guardrail. Recommend `antiReferences.substance` + `antiReferences.register`.
- **Design Principles need a `kind` enum.** Some principles are `adopted` from target DS, some `preserved` from current product reality, some `synthesized-conflict-resolution` (where the source/target registers fight). Principle 5 in our PRODUCT.md ("Data must read fast") is the latter — it's the most decision-relevant, but flat-listed alongside others, easy to lose.

### G12. `_brand-extraction.json` schema is missing two redesign-critical slots

Surfaced when authoring `stardust/target/_brand-extraction.json`:

- **No `register-comparison` block.** The source-vs-target diff is the load-bearing input downstream prototypes need to enforce: heading-uppercase ratio (semrush 27% vs Adobe 0%), CTA verb register ("Sign Up" vs "Try it free"), headline shape (capability-dense vs single-clause), period termination convention. Author had to scatter this across `voiceSamples`, `voice.tone.evidence`, and PRODUCT.md's voice table. Should be a single first-class block in `_brand-extraction.json`.
- **No verbatim `voiceSamples[]` array.** Source schema collapses voice into `voice.heroHeadline / heroSubcopy / ctaSamples / firstParagraph` plus aggregated `voiceTable.ctaFrequency / headingFrequency`. Redesign needs many more samples (section headlines, tile taglines, eyebrow + headline pairs, dual-CTA pairings) with citations. Author added `voiceSamples[]` array — should be backported to source schema so extract captures more too.

### G13. Provenance shape is inconsistent across artifacts

- **What we hit:** Provenance is sometimes a string (`"_provenance: inferred"`), sometimes a typed key (`"_provenance: not-applicable"`), sometimes needs both a kind and a reason (`{ "_provenance": "not-applicable", "_reason": "..." }`). Format drifts across `stardust/current/_brand-extraction.json`, DESIGN.json extensions, target `_brand-extraction.json`, and PRODUCT.md inline HTML comments.
- **Proposed fix:** Single typed provenance shape used everywhere: `{ "kind": "extracted" | "synthesized" | "inferred" | "not-applicable" | "preserved-from" | "adopted-from", "basis": "...", "source": "..." }`. Document in `stardust/reference/artifact-map.md` § Provenance shape.

### G16. F-002 PLACEHOLDER contract is high-friction on B2B SaaS pages

- **What we hit:** Authoring the home-shape brief, ~65 PLACEHOLDER slots flagged for Phase 2 (hero mosaic 15 tiles, 11 testimonials × 4 fields, footer sub-links ~30, plan tiers ~30 bullets, stats, addresses, dates). The F-002 contract (`reference/before-after-shell.md` § Content sourcing hierarchy) was designed to prevent the agent inventing trust signals. But on a B2B SaaS marketing page, the trust signals (customer logos, stats, testimonials, plan prices) ARE the visual content — turning all of them into dashed-outline boxes defeats the redesign's purpose, which is to *demonstrate* the new design language on a representative page. The honesty mechanism collides with the demo mechanism.
- **Why it's a gap:** F-002's design assumed pages where placeholder = visible-disclaimer, and the rest of the page can carry the design read. B2B home pages where placeholder = >40% of the surface need a softer signature.
- **Proposed fix (sketch):** A second tier of placeholder visual — "real-shape, withheld-content" — that preserves the visual presence (a logo card with realistic dimensions, a testimonial card with a realistic copy block) without inventing the actual literal value. Distinct from PLACEHOLDER but still F-002-compliant: `_provenance.unsourcedContent[]` records each as `withheld`, migrate refuses to ship them without `--allow-withheld`. Or: a `--placeholder-mode aggressive|soft` flag at prototype time.

### G17. `page-shape-brief.md` spec ambiguities surfaced

- **`data-items` semantics ambiguous.** The format spec doesn't distinguish "cards" from "content units" — when a section is a 4-card grid where each card has 3 content slots, is `data-items=4` or `data-items=12`? Author guessed; should be defined.
- **Token contract `--max-width` is dual-mapped.** Maps to both `DESIGN.json.frontmatter.layout.max-content-width` and `extensions.tokenContract.mapping['--max-width']` with potentially different values. Spec should say which is canonical.

### G21. Anti-toolbox audit / `audit_hits[]` schema needs a `deliberateViolation` flag

- **What we hit:** v2 verbatim render trips ~10 P1 audit warnings (uppercase headings, 3-CTA hero density, multi-clause taglines, banner-with-no-slot) that would block `prototyped` status. But every one of these violations is **user-directed** — the whole point of v2 is to preserve semrush copy verbatim, including the structural moves Adobe DS forbids. The audit schema today treats all violations as fix-or-block.
- **Why it's a gap:** Audit needs to distinguish "system violation we should fix" from "system violation user directed us to commit and accept the consequence." Without that distinction, an adopt-mode prototype that intentionally breaks rules (e.g., a verbatim-copy variant for A/B comparison) can never clear the gate.
- **Proposed fix:** Add to `audit_hits[]` schema:
  ```
  { rule, hit_count, justification, deliberateViolation: true|false, directedBy?: "user"|"direction.md"|null, basis?: "..." }
  ```
  When `deliberateViolation: true`, the gate skips the block and records the hit as advisory in `_provenance.deliberateViolations[]`. Same shape works for the F-002 contract's `unsourcedContent[]` if/when a content rule is intentionally relaxed.

### G22. Adopt-mode needs a "voice-coupled component" flag in DESIGN.json

- **What we hit:** v2 made the visual + voice mismatch concrete — Adobe visuals + semrush verbatim copy degrades cleanly in most sections (footer, sticky CTA, dark-band, gnav, mosaic hero ground are unaffected) but visibly breaks in three: hero CTA cluster, hub-router tagline shape, eyebrow-with-count parentheticals. These are components whose visual integrity *depends* on the target register being adopted; verbatim source copy breaks them.
- **Why it's a gap:** A future `/stardust:adopt` skill (or a v2-aware prototype skill) should know which components are register-coupled vs register-agnostic, so the agent can flag those three component classes up-front when verbatim mode is requested. Currently the agent has no signal — it discovers the breakage by rendering and reading the result.
- **Proposed fix:** Add to `DESIGN.json.extensions.componentStyle.<name>`:
  ```
  voiceCoupling: "high"|"medium"|"low",
  voiceCouplingNotes: "..." (e.g., "Hero designed for 1+1 CTA pair; 3+ CTAs collapses negative space")
  ```
  At adopt time, components with `voiceCoupling: high` get a render-time warning if verbatim mode would force a violation. Surface in the shape brief's "voice-coupling risks" section.

### G22a (related). DESIGN schema needs an "eyebrow with count" token

- **What we hit:** semrush's `SOLUTIONS ( 9 )`, `RESOURCES ( 7 )` are taxonomy-bleed at first glance but are load-bearing UX cues — they tell the reader "this is a curated set of N, not an open list." Adobe DS has no eyebrow-with-count slot, so the parenthetical reads as cruft visually.
- **Proposed fix:** Add `t-eyebrow-with-count` to `DESIGN.json.extensions.componentStyle.text` as a first-class affordance with appropriate styling for the parenthetical (smaller weight, tabular figures, opacity step).

### G23. Source-mining mode should be a first-class extraction concept

- **What we hit:** v2 lifted ~50 placeholders from v1 by mining `home.json#main.innerText` and `home.json#footer.innerText` — strings that are *captured* but not in discrete `headings[]` / `links[]` / `ctas[]` arrays. v1 left these on the table because the prototype skill's content-sourcing hierarchy reads from structured fields. The strings exist; they're just behind a less-structured key.
- **Why it's a gap:** Two consecutive prototypes from the same `home.json` produced 111 vs 75 placeholders (32% reduction) just from mining innerText. The first-pass placeholder count is therefore not a real signal of source data depth — it reflects only the structured-extract surface.
- **Proposed fix:** Either
  - (a) Extract should normalize innerText into structured slots at capture time (e.g., `home.json#sections[].body.text` arrays). More work upfront, cleaner downstream.
  - (b) Prototype should add a `mineInnerText: true` content-sourcing tier between structured-fields and PLACEHOLDER, with a `_provenance.sourceMining[]` audit field recording which strings came from regex-on-innerText vs structured fields.
  Recommend (a) — keeps the data structure honest at extract time. (b) is the workaround until then.

### G24. Pattern-fitting can erase semantic information that the source ranks

- **What we hit:** semrush's 9 pillars ship in two strata — 5 headline pillars (Semrush One, SEO, AI Visibility, Traffic & Market, Content) and 4 demoted (Local at slide 6, Advertising at 7, AI PR at 8, Social at 9). Adobe's perks 4-up renders the demoted four as coequal cards, erasing the source's ranking. v1 and v2 both lost it.
- **Why it's a gap:** Component-fitting (cf. G18) doesn't preserve semantic ordering when the source's ranking is structural (DOM order or explicit slide-of-N) rather than visually obvious. Adopt-mode shape-authoring should flag rank-bearing source structures whose target component lacks a rank affordance.
- **Proposed fix:** In adopt shape brief, add `## Rank-bearing structures` — for each source structure with implicit ranking, document whether the target DS preserves or erases it, and whether the brief authoring intends to preserve it via positioning, ordering, or visual weight (e.g., first card emphasized).

### G20. Phase 3 viewer's action buttons have no listener in the file:// agent context

- **What we hit:** `before-after-shell.md` describes Approve/Stash buttons that "postMessage to `window.parent`" or "copy a command to clipboard" — but the viewer opens as a `file://` page with no parent window and no agent-side listener. Subagent implemented a graceful fallback (postMessage attempt → toast with the literal user-prompt fallback if no parent), but the spec assumes a runtime hook that doesn't exist in the CLI/agent-loop flow.
- **Why it's a gap:** "Approve" and "Stash" are advertised as in-page actions; in practice they're user-prompts-with-extra-steps. The toast-with-instruction is the only working path.
- **Proposed fix:** Either (a) drop postMessage entirely from the spec and standardize on toast-with-instruction (the viewer is a review surface, not a control surface), or (b) ship a tiny local listener (e.g. an MCP server / a writable event-bus file the agent polls) so the buttons actually do something. (a) is simpler and matches reality.
- **Related:** "Try live" toggle on real production sites silently fails due to `frame-ancestors` CSP — already documented as F-001 in stardust feedback. The viewer surfaces a 6s heuristic notice but cannot auto-revert. Worth tightening F-001's documentation: detection is one-way only.
- **Minor polish:** before-after-shell.md prose mentions "iframe-shaped container" near the screenshot resolution, which can mislead an implementer to try `<iframe src="*.png">` (browsers refuse). One-line fix: "Use `<img>`, not `<iframe>`, for the screenshot."

### G19. Impeccable critique detector is cascade-blind on contrast and font-stack-blind on overuse

Surfaced during Phase 2.5 critique gate. The deterministic detector returned 14 P3 findings on the proposed file; **all 14 are false positives.**

- **13 × `low-contrast: 1.0:1 — text #ffffff on #ffffff`.** The detector reads CSS rules in isolation: `color: #ffffff` on a class without resolving what that class actually sits on at runtime. Every white-on-dark surface (footer ground `#000`, enterprise-band `#000`, button-primary ink-dark, gnav-logo over hero) reads as 1:1 contrast. On any redesign with dark-band sections this noises the floor — meaningful contrast issues drown.
- **1 × `overused-font: roboto`.** Detector picks the last-named-typical-font in the stack as primary. Adobe Clean is the licensed primary face; Roboto is in the system fallback chain per DESIGN.json `extensions.type.headingFamily.stack`. Any DS that exposes a system-font fallback chain trips this.
- **Proposed fix:** Detector should resolve the rendered cascade rather than scanning property pairs (or accept a `--ignore-out-of-context-contrast` flag). For font detection, pick the *first* declared font, not the last; or accept a list of known-fallback fonts to ignore.
- **Practical workaround in this run:** I treated all 14 as advisory and let the page transition to `prototyped` since they're cascade artifacts, not real design failures. Recorded in `_provenance.critique[]` on the proposed file.

### G9 (extension). `editorial-bento parallax-lift` motion missing from DESIGN.json

DESIGN.md describes the editorial-bento parallax-lift in prose ("Parallax-lifts as the user scrolls") but `DESIGN.json.extensions.motion[]` doesn't catalog it as a named pattern, and `extensions.reducedMotion.collapseRules` has no entry for it. Phase 2 rendered the bento without parallax to avoid drifting back to DESIGN.md mid-render. Tightens the existing "motion catalog incomplete" thread under G9 — every motion described in DESIGN.md prose needs a corresponding `extensions.motion[]` entry with a reduced-motion fallback.

### G18 (extension). Craft has no adoption-mode branch — needs --shape flag and skip-mock semantics

Surfaced during Phase 2 craft invocation. Two concrete additions for adoption-mode:

- **`--shape <path-to-shape.md>` flag** — let craft read the canonical deployment plan directly rather than re-parse it from the prose feature description. Eliminates the "Step 1: Shape" redundancy when shape is already authored.
- **Skip-mock-when-mode=adopted branch** — craft's "Step 3: North Star Mock" generation step is correct to skip when the direction is `adopted`, but craft.md doesn't document that branch. Adoption mode means the target spec is concrete (not synthesized), so mock generation duplicates work and risks drift. Future `/stardust:adopt` should pass an `adoption_inputs` parameter that craft natively reads to skip mock generation.

### G18. Adoption shape-authoring differs structurally from direction shape-authoring

- **What we hit:** `page-shape-brief.md` assumes the brief author is composing a synthesized direction onto page content. In adoption, the author is fitting *adopted DS components* onto page content — a different decision tree. Three concrete differences emerged:
  1. **Composition-gap calls.** Adoption surfaces "section in source has no slot in target DS" cases (announcement banner, customer-logo strip, free-tools strip). Direction-mode authoring doesn't hit these because the target DS is invented to fit. Adopt shape-author needs explicit "drop / adapt-existing / author-new" guidance per gap.
  2. **Component-fitting calls.** semrush's 9-pillar product surface fits Adobe's hub-router (5 cards) + perks-4-up only via a deliberate 5+4 split. The direction-mode brief assumes component count is flexible to content; adopt-mode brief assumes component count is fixed by target DS, content must be sliced to fit.
  3. **Voice-rewrite calls.** Adopt mode mechanically applies a register table from PRODUCT.md to every preserved-substance string (semrush's "Be found everywhere search happens" → Adobe register "Show up wherever search happens"). Direction-mode authoring doesn't have this systematic per-string rewrite. Should be a structured input (the register-comparison table from G12).
- **Proposed fix:** `/stardust:adopt` companion shape-brief format with three new sections: "Composition gaps" (with disposition per gap), "Component-fitting decisions" (where source content was sliced to fit target DS), "Voice rewrite log" (per-string before/after with register-rule citation).

### G15. `/stardust:prototype` hard-refuses without `direction.md` + `directed` status

- **What we hit:** Prototype's setup checks (Setup §2 + §4) require `state.json` to contain ≥1 `directed` page AND `stardust/direction.md` with an Active section. Our adapted "B" flow produced equivalent artifacts (DESIGN.md/DESIGN.json/PRODUCT.md at root, target `_brand-extraction.json`, learnings) but never wrote `direction.md` or transitioned pages to `directed`. Prototype refuses.
- **Why it's a gap:** The "adopt" path duplicates everything `direct` writes EXCEPT the bookkeeping artifacts (`direction.md` + state transition). Prototype's preconditions are reasonable in isolation but they're functionally a state-machine handshake, not a content check.
- **Workaround applied this run:** Hand-authored `stardust/direction.md` from our adoption notes (the Active block is a backfill — Phrase = "Adopt the Adobe Acrobat Studio DS for the semrush marketing surface", Movements/Divergence inputs/Command sequence derived from DESIGN.md + PRODUCT.md). Bumped home's `state.json.status` to `directed` and set `direction` block.
- **Proposed fix:** A future `/stardust:adopt` skill must produce `direction.md` + state-transition as its closing step, exactly as `/direct` does. Concretely, the adopt skill writes:
  - `direction.md` Active section with `Mode: adopted` (a third mode beyond brand-faithful/brand-replacing — adopted is "neither preserve current brand nor invent new direction; reverse-engineer from a reference"). Movements describe the *delta* between current and target brand surfaces; Divergence inputs cite source files instead of seed-derived; Command sequence skips `colorize`/`typeset` (already locked by adopted DS) and adds `live` for layout-fit.
  - `state.json.direction.resolvedAt = adoptedAt`, `direction.phrase = "<adoption phrase>"`, page transitions to `directed` for every page in scope.
- **Cross-ref:** This is the concrete state-machine handoff that G14 ("state.json doesn't track manual outputs") flagged abstractly.

### G14. `stardust/state.json` doesn't track manual stage outputs

- **What we hit:** `state.json` updated cleanly after `/stardust:extract` but knows nothing about stage-1b's `DESIGN.md`/`DESIGN.json` at project root or stage-2's `stardust/target/_brand-extraction.json` + `PRODUCT.md`. Downstream `prototype` and `migrate` will need to be told these exist or scan-detect them.
- **Proposed fix:** A future `/stardust:adopt` skill should write its outputs explicitly into `state.json` (`target.adoptedAt`, `target.designSpecPath`, `target.brandExtractionPath`). For now, no manual entry to add — the pipeline runs once end-to-end.

### G10. Adopt-specific tooling gaps (what `/stardust:adopt` would need beyond `/extract`)

- **CSS custom-property extractor.** Subagent had to manually grep `:root` blocks across 11 CSS files + 2 inline `<style>` blocks to recover Adobe's tokens. A shared script that parses `--*` declarations across a directory tree, dedupes, labels with source file + line, and normalizes hex/rgb/oklch is high-leverage. Reusable by extract too (when sites expose tokens via `:root`).
- **Component HTML slicing.** `_brand-extraction.json#systemComponents[].exampleBlock` expects a verbatim DOM snippet. Extract gets these from rendered Playwright HTML; adopt has no equivalent — subagent had to summarize. Should slice canonical fragments out of the source `index.html`/sibling pages and store them at `stardust/canon/<component>.html`, mirroring extract's behavior.
- **Multi-source merge contract.** `designs/hub/` and `designs/bizpro-hub-prototype/` declare the same DS with **disjoint token vocabularies** (`--font-display` vs `--s2a-*` prefix; explicit gray ramp in bizpro absent in hub; explicit brand colors in bizpro absent in hub). Both are valid same-DS sources. No formal "primary source vs supplementary source" merge rule today — subagent picked hub as canonical, treated bizpro as a value-only source. Need an explicit `--primary <path> --supplementary <path>...` semantics with conflict-resolution rules.
- **Target `_brand-extraction.json` analog.** Extract writes one (descriptive); direct writes one (synthesized). Adopt should write one (reverse-engineered) so downstream PRODUCT.md authoring has a structured voice/component grounding rather than re-reading source HTML.
- **Token-contract auto-mapping.** Stardust's `:root` token contract names tokens like `--heading-xxl` / `--text-secondary`. Adopting a real DS means manually mapping its token names (e.g., `--type-title-1-size` → `--heading-xl`). Subagent hand-wrote `extensions.tokenContract`. A skill should derive this mapping automatically from the frontmatter and validate every required contract token resolves to a concrete value.

*(More entries appended as we hit them.)*

---

## New-skill candidates

Captured ideas for net-new stardust capabilities (vs. tweaks to existing skills).

- **`/stardust:adopt`** — see G1, G9, G10 for accumulated requirements. Inverse of `/direct`: takes a reference (URL + optional local code path[s]) and produces target `DESIGN.md` / `DESIGN.json` / `PRODUCT.md` by reverse-engineering rather than synthesizing. Concrete shape that emerged from this run:
  - Inputs: `--primary <path|url>`, optional `--supplementary <path>...`, optional `--live <url>` (for sanity-check).
  - Reuses `/extract`'s machinery: same Playwright recipe (against the live URL), same `_brand-extraction.json` shape (target variant), same junk filter, same brand-review template (renders the *target*'s captured chrome).
  - Adds: CSS custom-property extractor (G10), component HTML slicing into `stardust/canon/<component>.html` (G10), multi-source merge contract (G10), motion-pattern subschema (G9), vendor-deps + deliberate-omissions schema (G9), per-breakpoint type tokens (G9), fallback-font decision slot (G9).
  - Output: target `DESIGN.md` / `DESIGN.json` at project root; `stardust/target/_brand-extraction.json`; `stardust/canon/<component>.html`; provenance citing source files line-by-line.

---

## Validated patterns

What worked well — things to keep doing in future stardust runs.

- **Brand-review chrome rendering in captured colors + uppercase rule** — both fired correctly on semrush. The review reads as Semrush-shaped, not stardust-shaped, which is the point. Keep this as the eyeball-first artifact.
- **Cap=5 + manually-curated marketing-surface sub-sitemaps** — produced clean cross-page aggregation. The pattern (orchestrator pre-filters which sub-sitemaps the agent considers, before page-selection runs) is worth codifying for any large multi-template marketing site.
- **Friction-notes-as-tool-result from delegated extract subagent** — having the subagent return a `## Friction notes for learnings.md` section in its final report was a clean way to capture gaps without the orchestrator needing to instrument every step. Keep this delegation pattern for future stages.
