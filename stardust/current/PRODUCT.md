<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-05-08T15:10:00Z
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/home.json
    - stardust/current/pages/pricing.json
    - stardust/current/pages/features.json
    - stardust/current/pages/features__keyword-magic-tool.json
    - stardust/current/pages/company.json
  synthesizedInputs:
    - register (heuristic; landing-page indicators dominate)
    - brand personality (inferred from voice samples)
    - design principles (inferred from observed patterns)
  stardustVersion: 0.3.0
  scope: descriptive snapshot of the existing semrush.com — what IS, not what should be
-->

# Product

## Register

brand

## Users

Marketers, SEO specialists, content strategists, agencies, and in-house growth teams responsible for organic search, paid search, content, social, and competitive intelligence. The site addresses both individual practitioners (self-serve trial path) and enterprise buyers (sales-assisted path), with secondary surfaces for prospective hires (Join Our Team), partners, and the press.

The dominant user moment is **evaluation** — the visitor is comparing Semrush against alternatives, sizing a workflow against their own, or sampling capability before signing up. The home headline frames the offer as **"Be found everywhere search happens"** — a positioning move that goes beyond classical SEO into AI search and broader visibility.

<!-- _provenance: inferred — basis: hero copy ("Be found everywhere search happens"), nav items (Pricing, Sign Up, Log In, Request a Demo), CTA mix (Start free trial, Get insights, Try for free, Talk to sales) — combination of self-serve and assisted-sales paths is the canonical landing-page register. -->

## Product Purpose

Semrush positions itself as the leading platform to **grow and measure brand visibility across AI search, SEO, PPC, social, and adjacent digital channels.** The home page consolidates ~50+ tools under five product pillars (Semrush One, AI Toolkit, .Trends, Enterprise SEO Solutions, Local SEO) and surfaces a single conversion path: **enter your website → get insights → sign up.**

Success looks like: a marketer enters a URL, receives a credible snapshot of their visibility (organic, paid, AI-mention share), and converts to a free trial that escalates into paid usage as their workflow expands.

The voice is **action-oriented, data-aware, and inclusive of both small marketers and enterprise buyers.** Hero copy uses imperative verbs ("Be found", "Enter your website", "Get insights"). Trust language leans on third-party validation (G2, Forrester, Forbes Advisor), market-share claims ("#1 most-trusted SEO software"), and customer logos at scale (Booking, Samsung, Amazon, FedEx, Decathlon, Dropbox, Netflix, P&G, Shopify, TikTok, etc.).

## Brand Personality

**Confident · pragmatic · expert-friendly.** Semrush sounds like a tool the operator already trusts — the language assumes domain literacy ("AI Overviews", "keyword strategy", "backlink analytics") without slipping into jargon. There's optimism in the headline tone but no oversell; benefits are stated, then immediately backed by either a tool name, a number, or a customer logo.

In three words: **Trusted · capable · current.** The "Now an Adobe company" announcement banner at the top of every page positions current-state as a moment of escalation in the brand's standing — confident, not embarrassed about the acquisition.

<!-- _provenance: inferred — basis: hero headline, primary CTA labels (Start free trial vs. Talk to sales), repeated trust signals (G2 #1, Forrester Wave, customer logos), tone-metrics (27% uppercase headings, 40 distinct CTA labels suggesting vocabulary breadth, no exclamations in body). -->

## Anti-references

- **Generic SaaS hero with screenshot-of-app dropshadow.** Semrush's hero is centered on its own input field (the URL bar), not on app chrome — the surface IS the product moment.
- **Fluffy AI marketing language ("revolutionary AI", "next-gen platform").** Semrush mentions AI substantially but anchors every claim to a tool, an integration (ChatGPT, AI Overviews, Perplexity), or a use case.
- **Dense, tabular feature matrices on the home page.** Semrush keeps the home loose — feature density lives on `/features/` and `/pricing/`, not on the landing.
- **Pure black backgrounds + neon gradients (the "AI startup" cliché).** Semrush uses mint green, lavender pastels, and a bright signal blue (`#008ff8`) — chromatic but never neon, and almost always on a white surface.

## Design Principles

<!-- _provenance: inferred — basis: observed visual moves and copy patterns across home / pricing / features / company. -->

1. **Pastel-and-signal.** Soft mint, lavender, and aqua establish the surface; one saturated signal blue (`#008ff8`) carries every primary CTA. The palette is deliberately tinted, not grayed.
2. **Logos as proof.** Customer logo strips appear on home, features, and company. The list is long and well-known; the design move is "you've heard of all of these."
3. **Tool name first, capability second.** Feature pages lead with a product name (Keyword Magic Tool, Site Audit, Traffic Analytics) and immediately describe what it does. The brand surface treats tools as named characters.
4. **Pill is the chrome.** Primary CTAs, filter chips, status badges, and persistent nav use a `100px` (effectively pill) radius. Cards use `10px`. The two radii are doing different jobs and never blur.
5. **Density without crowding.** Pricing tile groups, feature lists, and the platform-overview band on home all carry a lot of content but breathe — section padding sits at ~60–96px, body copy at 1rem with generous line-height.

## Accessibility & Inclusion

The site declares `lang="en"` and ships a "Skip to content" link as the first focusable element. The browser-out-of-date banner (`#srf-browser-unhappy`) suggests modern-browser-first design. Focus rings are tokenized (`--mp-focus-color`, `--mp-focus-border`).

Heading hierarchy is structured (H1 on home, H2 for section heads, H3 for tile titles), but a few page templates use 27% uppercase headings (cookie consent, footer micro-copy). Cross-page heading distinct count is 134 across 175 captured headings — enough variety to suggest IA care, not template-stuffing.

Specific WCAG-level commitments are not surfaced on the homepage. The redesign target should re-affirm them.

## Optional sections

### Photography / imagery

The home page does not lead with photography. Hero is type + an input field. Below the fold, the visual surface is a mix of: pastel gradient backgrounds (mint → lavender), 3D-rendered or illustrated UI mockups of the Semrush app, abstract product diagrams, and customer logo strips. There are very few photographs of people — the brand sells **the tool**, not the role of the operator.

### Content pillars

Five pillars dominate the IA: **Products** (the toolset; surfaced via mega-menu), **Pricing**, **Resources** (blog, kb, academy, news, eyeon, trending-websites), **Free tools** (single-tool entry points for top-of-funnel SEO use cases), and **Company** (about, stories, careers, legal). The blog and resource surfaces are intentionally excluded from this extract scope — the redesign target is the marketing site (home + pricing + features + company), not the content-marketing arm.
