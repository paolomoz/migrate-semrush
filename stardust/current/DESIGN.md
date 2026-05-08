<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-05-08T15:10:00Z
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/*.json
  synthesizedInputs:
    - rule names (inferred — observed patterns translated into doctrines)
  stardustVersion: 0.3.0
  scope: descriptive snapshot of the existing semrush.com visual system
-->
---
name: Semrush (current state)
description: The leading platform to grow and measure brand visibility across AI search, SEO, PPC, and social.
colors:
  background: "#ffffff"
  text-primary: "#181e15"
  primary: "#008ff8"
  surface-mint: "#dceeeb"
  surface-lavender: "#e8e1ff"
  border-soft: "#d1d4db"
  accent-lime: "#89ff75"
  accent-lavender: "#c190ff"
  accent-aqua: "#18f0bf"
  accent-text-soft: "#575c66"
  pure-black: "#000000"
typography:
  display:
    fontFamily: "Lazzer, system-ui, sans-serif"
    fontSize: "84px"
    fontWeight: 600
    lineHeight: "1.05"
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Lazzer, system-ui, sans-serif"
    fontSize: "46px"
    fontWeight: 600
    lineHeight: "1.1"
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Lazzer, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: "1.2"
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "1.4"
    letterSpacing: "0.02em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "20px"
  pill: "100px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "60px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-secondary:
    backgroundColor: "#ffffff"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  card-default:
    backgroundColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "24px"
  pricing-tile:
    backgroundColor: "{colors.surface-mint}"
    rounded: "{rounded.lg}"
    padding: "32px"
---

# Design System: Semrush (current state)

## 1. Overview

**Creative North Star: "Pastel Operator Console"**

Semrush's surface is a marketing site that reads as a **lightweight, pastel cousin of an operator dashboard**. The hero starts on white. Below the fold, mint-into-lavender gradients carry the platform overview. Each tool gets a colored badge or tile — lime, aqua, lavender — but the primary action button is always the same signal blue. The dominant personality is **bright-but-calm, dense-but-breathable, expert-friendly**.

Two type families share the work: **Lazzer** (a tight contemporary sans) carries every heading and the hero display, while **Inter** runs the body. The pairing is loud-but-not-shouty: no serifs, no scripts, no decorative type — the variety lives in size, weight, and color, not in family count.

Semrush rejects three things explicitly visible in the surface: **dropshadow-heavy SaaS-app screenshots in the hero** (hero is type + an input field), **flat unit-test grids of features** (feature density lives on dedicated pages, not the home), and **dark-mode neon gradients** (every gradient is pastel, every CTA is on white).

**Key Characteristics:**

- White background plus tinted surfaces (mint `#dceeeb`, lavender `#e8e1ff`); never a dark home page.
- One signal blue (`#008ff8`) carries every primary CTA across the site — the One Voice Rule.
- Pill-radius (100px) for actions and chrome; 10px / 6px for cards and inputs. Two radii, two jobs.
- Customer logo strip appears on home, features, and company — proof is structural, not decorative.
- Type scale is **ad-hoc**, not a strict modular ratio (84 → 46 → 46 → 42 → 28 px observed).

## 2. Colors

The palette is deliberately **tinted, not grayed** — saturation is held back, but every neutral has a hue (the "white" is `#ffffff`, the "soft border" is `#d1d4db`, but the surface alts are pastel mint and lavender, never `#f5f5f5`).

### Primary
- **Semrush Blue** (`#008ff8`): every primary call-to-action — Sign Up, Get insights, Start free trial, Try for free. Appears as solid background only on buttons; never as a section background.

### Secondary (accent palette — used on tool tiles, illustrations, and tinted surfaces)
- **Mint Surface** (`#dceeeb`): hero gradient stop, tool-tile backgrounds, pricing-tile fills.
- **Lavender Surface** (`#e8e1ff`): mid-page gradient stop, secondary product surface.
- **Lime** (`#89ff75`): tool badge fill, illustration accent. Used sparingly, never as a body color.
- **Lavender Solid** (`#c190ff`): tool badge fill, illustration accent. Companion to lime on multi-tool diagrams.
- **Aqua** (`#18f0bf`): tool badge fill, .Trends product accent.

### Neutral
- **Surface White** (`#ffffff`): default page background. Always.
- **Text Primary** (`#181e15`): body and heading color (a near-black with a barely-perceptible green cast — emerges from the brand's tinted-neutral discipline).
- **Text Soft** (`#575c66`): meta text, secondary labels, footer copy.
- **Border Soft** (`#d1d4db`): card and input borders.
- **Pure Black** (`#000000`): used in dark-band callouts and the cookie-consent overlay only.

### Named Rules

**The One Voice Rule.** Primary blue (`#008ff8`) only appears on call-to-action buttons. Never on text, never on backgrounds wider than a button. Its rarity is the conversion signal.

**The Tinted-Neutral Rule.** No `#f5f5f5`-family grays. Every "neutral" surface alt has a hue (mint or lavender). Pure neutral is only `#ffffff` and `#181e15`.

## 3. Typography

**Display Font:** Lazzer (with system-ui, sans-serif fallback)
**Body Font:** Inter (with system-ui, sans-serif fallback)

**Character:** A contemporary sans pairing — Lazzer carries the hero with tight letter-spacing and a slight optical narrowness; Inter handles every paragraph, label, and form input. There's no serif, no mono, no script. Variety lives in size and weight, not family count.

### Hierarchy
- **Display** (Lazzer 600, 84px / 1.05 / -0.02em): hero H1 only — `Be found everywhere search happens`.
- **Headline** (Lazzer 600, 46px / 1.1): section H2s on home and feature pages.
- **Title** (Lazzer 500–600, 28px / 1.2): tile titles, pricing tier names.
- **Body** (Inter 400, 16px / 1.5): paragraphs, list items, descriptions. No max-line-length token observed.
- **Label** (Inter 500, 14px / 1.4 / 0.02em letter-spacing, sometimes uppercase): chip labels, badges, footer headings.

### Named Rules

**The Two-Family Rule.** Lazzer for headings + chrome, Inter for body and form inputs. Never invert.

**The Ad-Hoc Scale Caveat.** The site's heading scale is observed as `84 → 46 → 46 → 42 → 28 px` — no consistent ratio. Two adjacent levels share 46px (H2 and H3 collide on size, distinguish by weight only). The redesign target should decide whether to formalize a modular scale.

## 4. Elevation

Semrush is **flat-default with a soft hover lift.** Surfaces sit at rest with no shadow. State is conveyed by background-color shifts (mint → lavender on hover for tool tiles), border highlights on inputs, and a light glass shadow on a few floating elements.

### Shadow Vocabulary
- **Glass Soft** (`box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05)`, captured as `--mp-shadow-glass`): the only shadow defined as a design token. Used on overlays and floating tool callouts.

### Named Rules

**The Flat-By-Default Rule.** Sections, cards, and pricing tiles do not carry shadows. Depth is implied by surface color, not blur.

## 5. Components

### Buttons

- **Shape:** `100px` border-radius (effectively pill at the captured 60px button heights).
- **Primary:** background `#008ff8`, text `#ffffff`, font-weight 500, padding ~16px × 32px. The single CTA voice across the site.
- **Secondary:** background `#ffffff`, text `#181e15`, 1px border or no border, same pill radius. Used as the second action in dual-CTA hero patterns.
- **Hover / Focus:** focus ring tokenized as `--mp-focus-color: #008ff87f` (semi-transparent blue) and `--mp-focus-border: #006dca`. Transitions at `--mp-transition-duration: 200ms`.
- **Tertiary / Ghost:** observed in nav and footer as text links with subtle underline-on-hover; not pill-shaped.

### Cards / Containers

- **Corner Style:** `10px` (`--rounded-md` equivalent) for default cards; `20px` for the larger pricing and feature tiles.
- **Background:** white default; pricing tiles use `#dceeeb` (mint) or `#e8e1ff` (lavender) as alternates.
- **Shadow Strategy:** flat at rest. No elevation on cards.
- **Border:** 1px `#d1d4db` on inputs and bordered cards.
- **Internal Padding:** 24px default, 32px on the larger tiles.

### Inputs / Fields

- **Style:** white background, 1px `#d1d4db` border, 6–10px radius, padding ~12px × 16px.
- **Focus:** 3px focus ring at `#008ff87f`, border deepens to `#006dca`. Transition 200ms.
- **The hero URL bar** is the signature input — pill radius, larger padding, paired with the primary blue Get insights button.

### Navigation

- **Style:** sticky white header, Lazzer Title size, with a hover-revealed mega-dropdown (`srf-header-dropdown-items`).
- **Active states:** color shift to text-primary; no underline.
- **Mobile:** hamburger replaces the inline menu (DOM still ships both, hidden via media query).

### Tool Tiles (signature component)

A repeated pattern on the home and features pages: a square tinted card with a colored icon top-left, a tool name in title type, a one-line description, and an arrow link to the tool detail page. The tile background rotates through mint, lavender, and aqua tints — the **color is the differentiator**, not iconography.

## 6. Do's and Don'ts

### Do:

- **Do** carry every primary call-to-action in `#008ff8`, pill-shaped (100px radius). The One Voice Rule.
- **Do** start every page on white. Tinted surfaces (mint, lavender) appear below the fold, never as the page-top background.
- **Do** lead feature pages with a tool name; the brand treats tools as named characters.
- **Do** keep the customer logo strip on home, features, and company — it's a structural proof move, not a decoration.
- **Do** use Lazzer for every heading and Inter for every paragraph, no exceptions.

### Don't:

- **Don't** ship a dark-mode neon AI-startup aesthetic. Every gradient here is pastel (mint → lavender), every CTA is on white.
- **Don't** add screenshot-of-app dropshadow heroes. The hero centers on the URL input bar — the surface IS the product moment.
- **Don't** introduce new chrome radii. 100px (pill) and 10px (card) are doing different jobs; 6px is for inputs. Don't add 4px or 12px to the vocabulary without a deliberate role.
- **Don't** elevate cards. The brand is flat-default; only the glass-shadow token (`0 2px 12px rgba(0,0,0,0.05)`) is allowed, and it's reserved for floating overlays.
- **Don't** introduce a third type family. Lazzer + Inter is the pairing; serif and mono additions break the brand.

## Third-party embeds (opaque to extraction)

No embed-dominated pages were detected in the 5-page scope.
