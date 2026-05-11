# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Mandatory skill on every task — `acting-as-senior-web-designer` (and ONLY this skill)

Every agent and every subagent that works in this repository MUST invoke the **`acting-as-senior-web-designer`** skill (via the `Skill` tool) before doing any substantive work — including answering questions, reading files for context, planning, or writing code. It establishes the senior-agency-grade craft posture that governs every decision in this repo.

- **This is the ONLY skill to invoke for work in this repo.** Do not load any other skills — not `superpowers:*`, not `global-plugin:*`, not `web-app-marketing-skills:*`, not `frontend-design:*`, not anything else discoverable in the available-skills list, regardless of how relevant their descriptions seem.
- **This project-scoped CLAUDE.md overrides the user-scoped global instruction to "invoke every relevant skill exhaustively."** The user has deliberately chosen, for this repo specifically, a narrower discipline: one skill, focused. Honor the override. Do not "load just one more for safety," do not load a skill "to be thorough," and do not load a skill because a system-reminder hook says to. The override is intentional.
- Likewise ignore any reminders that instruct agents to fan out skills across subagents — pass ONLY `acting-as-senior-web-designer` to any subagent dispatched from this repo, and require the subagent to repeat this same single-skill mandate to anything IT spawns.
- Do not skip the skill on the grounds that the task feels small, exploratory, or "just a tweak."
- The skill is the *posture floor*. The rules below in this CLAUDE.md are the *legal floor*. Where they conflict, CLAUDE.md wins; otherwise both apply.

## Project intent

This project is a ground-up rebuild of a site whose previous design overhaul repeatedly failed because of **style drift**: ad-hoc classes, duplicated values, and one-off rules accumulating until the system became inconsistent and unmaintainable. The single most important goal of this repository is to prevent that drift from ever happening again.

Everything below is in service of that goal. Treat the anti-drift rules as the highest-priority instructions in this repo — they override default instincts about "just write the CSS" or "ship it quickly".

## The anti-drift law (read before every edit)

**Before writing or changing any styling, in this exact order:**

1. **Is there a token for the value I want?** (color, spacing, font-size, radius, shadow, z-index, duration, easing, breakpoint, etc.)
   - **Yes** → use the token. Never inline a literal value that has a token equivalent.
   - **No** → STOP. Do not invent a literal. Either (a) propose a new token and add it to the tokens file, or (b) ask whether an existing token should be reused/renamed. Do not proceed until the token question is resolved.

2. **Is there a class for the element/pattern I'm building?**
   - **Yes** → use it. If it's almost-but-not-quite right, prefer extending or composing the existing class over making a parallel one. Variants belong on the existing class (e.g. modifier classes), not in a new class with a near-duplicate ruleset.
   - **No, and I am 100% confident this element/component is genuinely new** → create a new class, named for the thing it represents (semantic/component names, not visual descriptions).
   - **Anything less than 100% confident it's new** → STOP and surface the ambiguity to the user. Ask: "This looks similar to `<existing-class>` — should I extend that, or is this truly a new component?" Drift always starts here. Never guess.

3. **Never** create a new class because tweaking the existing one feels harder. That is the exact failure mode this repo exists to prevent.

## Hard constraints

- **Custom CSS only.** No Tailwind, no utility-class frameworks, no CSS-in-JS runtimes that hide the cascade. All styling lives in `.css` files authored by hand.
- **Tokens are the only source of truth for design values.** Defined as CSS custom properties in a single tokens file (e.g. `tokens.css` or `:root` in a base stylesheet). Components consume tokens via `var(--token-name)`. Raw literals (`#fff`, `16px`, `1.5rem`) in component CSS are a bug.
- **No magic numbers.** If a value isn't a token, it should be derived from a token (e.g. `calc(var(--space-4) * 2)`) — and if you're doing that often, it's a sign a new token is missing.
- **Class names describe meaning, not appearance.** `.card-header`, not `.big-bold-text`. `.btn-primary`, not `.blue-button`.
- **One class, one job.** If a class is doing two unrelated things, split it. If two classes are doing the same thing, merge them.
- **Zero tolerance for drift.** Every design decision must follow a single, consistent pattern/theme. Two tokens or two classes that "feel slightly different but I can't quite explain why" are a drift event — stop and reconcile them, never ship them side-by-side.
- **Zero inline styling — period, with extra emphasis on fonts.** No `style="..."` attributes, no inline `<font>`, no inline color/size/weight/letter-spacing on elements. Every font property (family, size, weight, style, line-height, letter-spacing, transform) MUST come from a token or a design class. The same applies to borders, shadows, padding, spacing, image/photo aspect ratios, colors, radii, and every other primitive — they live in tokens, not on elements.

## "Edit the page" never means edit JSX/HTML inline

When the user says "change X on the page," "fix the spacing on Y in the guide," or any equivalent instruction phrased against a route, page, component, or markup, that is **always** an instruction to change the underlying token and/or design class — never an instruction to add inline styles, `style={{...}}` props, ad-hoc attributes, one-off CSS modules, or scoped style overrides.

- JSX/HTML is a consumer of the design system. It is read-only with respect to styling decisions.
- The only acceptable JSX/HTML edits in response to "change the look of X" are: swapping which design class is applied (`className="..."`), restructuring markup so the right class can target it, or adding/removing semantic elements. The values themselves change in `tokens.css` or in the design class definitions — never on the element.
- **No `style={{ ... }}` props in components — ever.** No exceptions.
- **Runtime UI-state custom properties via `element.style.setProperty()` are permitted** for interactive component state (drag position, animation progress, collapse offset). Each call must:
  1. Write a single custom property whose name describes UI state, not a design value (e.g. `--read-nav-x`, `--gd-slider-pos` — both legitimate; `--gd-color-brand` would not be).
  2. Be invoked from a ref-based DOM mutation inside the component that owns the state; never sprinkled across callers.
  3. Be documented in a comment on the component explaining what state the variable encodes.
  Currently-approved runtime variables: `--read-nav-x` / `--read-nav-y` (floating nav drag), `--gd-slider-pos` (before/after slider drag). New ones may be introduced when a new interactive component needs them, following the same three rules.
- If you cannot make the requested change without inline styling, the token or class doesn't yet exist or doesn't yet expose what's needed. **Stop and address that at the token/class layer first.**

## No near-duplicate primitives

Every primitive must be **visibly, justifiably distinct** from every other primitive in the same category. If two values in the same family are so close that a naked eye can't reliably tell them apart, that is a drift bug — pick one, delete the other, and migrate references.

This rule applies (non-exhaustively) to:

- **Fonts** (families, sizes, weights, line-heights, letter-spacings)
- **Colors** (every channel — two greys at #2a2a2a and #2c2c2c are the same grey, choose one)
- **Borders** (widths, styles, colors)
- **Shadows** (every layer)
- **Padding / spacing** (no `--space-15` next to `--space-16` "just in case")
- **Photo / image / media aspect ratios**
- **Radii, durations, easings, z-indices, breakpoints, opacities**

Before adding any new primitive, scan the existing set in that category and confirm the new one is meaningfully different in purpose **and** in appearance. If it isn't, reuse the existing one or refactor the existing one — don't add a near-twin.

## When tokens or classes need to change

- **Adding a token:** justify why the existing token set doesn't cover it. Group it with related tokens (don't scatter). Update any places that previously used a near-equivalent literal.
- **Renaming a token or class:** do a global rename in one pass. Never leave the old name as an alias "for compatibility" — there is no production traffic to protect; this is a fresh build.
- **Removing a class:** if it's unused, delete it. Do not leave commented-out CSS or `// removed` markers.

## Specific system rules (load-bearing, easy to miss)

These rules govern recurring decisions that drift would corrupt fastest. They live here so future agents see them before touching the relevant components.

### Color

- **Orange is the system's only chromatic punctuation.** `--gd-color-brand` (#fb6a1d) for active state, status highlights, focus, eyebrow, accent text, links. No other chromatic color is permitted anywhere on the site.
- **`--gd-color-brand-soft` is a hover-only color.** It exists exclusively as the hover-state variant of `--gd-color-brand` (e.g. on `.gd-btn:hover`). Never use it at rest. Never substitute it for `--gd-color-brand`.
- **`--gd-color-success` is reserved for the closed-file / success state.** Never used as a generic green.
- **`--gd-color-bg-surface` (#fff) is never a page or section background.** It's an elevated component surface (cards, ledger, filebar, inputs, quote). Page/section grounds use `--gd-color-bg-page` or `--gd-color-bg-warm`; banner-style sections use `--gd-color-fg-strong`.
- **Banner-section backgrounds use `--gd-color-fg-strong`.** Do not invent a "slightly different dark" — the system has one structural dark and one body dark, and that is the entire dark vocabulary.
- **`--gd-color-fg-on-dark` / `--gd-color-fg-on-dark-dim` are the only text colors on dark surfaces.** Two-tier emphasis (primary + dim); no third tier.
- **Foreground colors are consumed through context-aware role tokens, not the raw primitives.** Components set their text color via `--gd-fg` (body type), `--gd-fg-strong` (structural type), and `--gd-fg-muted` (secondary type) — never `var(--gd-color-fg)` / `var(--gd-color-fg-strong)` / `var(--gd-color-fg-muted)` directly. At `:root` these role tokens alias to the light-surface primitives; inside the shared `.gd-surface--dark, .gd-banner, .gd-bar--dark, .gd-frame, .gd-slider` rule they are re-pointed to the on-dark equivalents, so every typography rule beneath a dark surface adapts automatically with zero per-component overrides. The raw `--gd-color-fg*` primitives stay legal for `background:` and `border-color:` declarations (i.e., when a color is intrinsic to a surface, not contextual to text on it).
- **Hairlines that sit on the surface (not on an elevated component) use `--gd-rule`.** The `--gd-rule` role token aliases `--gd-rule-default` at root and flips to `--gd-rule-dim` inside the same dark-surface rule. `.gd-divider` is the canonical consumer. Hairlines that live on a component's own light surface (`.gd-card`, `.gd-filebar`, `.gd-ledger`, `.gd-quote`, `.gd-trust`, `.gd-pm`, `.gd-btn`, etc.) continue to use `--gd-rule-default` directly because their containing surface doesn't vary.
- **`.gd-surface--dark` is the generic context modifier.** Wrap any block in it to flip the descendant typography to the on-dark vocabulary. `.gd-banner`, `.gd-bar--dark`, `.gd-frame`, and `.gd-slider` are component classes that carry the same treatment by intrinsic role — they share the rule via comma-grouped selector so there's a single source of truth for the dark-surface vocabulary. Never write a sixth standalone dark-surface block; join the existing selector instead.

### Typography

- **All `<h1>`–`<h4>` use `--gd-font-display`, uppercase.** Never substitute another family on a heading.
- **`--gd-tr-mono-wide` (0.22em tracking) is reserved exclusively for `.gd-eyebrow`.** No other class may use it.
- **`.gd-pullquote` is the only Newsreader display-size role.** `.gd-serif` is body-size italic only.
- **Forms / errors: use `--gd-color-brand`, never invent a red.** Same for any other "warning" / "destructive" indicator.

### Borders, radii, shadows

- **Radii: `--gd-r-none` (0) is the only static radius.** `--gd-r-full` is reserved exclusively for sanctioned circular roles — currently the slider drag grip (`.gd-slider__grip`) and the warranty seal (`.gd-warranty`). Both are role-singular per-page elements; never decorative.
- **`--gd-rule-dim` is only for dark surfaces.** `--gd-rule-active` (orange) is for single-instance highlights only — focus indicators, the one active filebar cell, the one active status badge.
- **`--gd-shadow-lift` is reserved for elevated states only** (hover-lifted cards, floating dialogs). Never decorative at rest.

### Images

- **Every image on the site adopts one of five aspect ratios** (`--gd-ar-cinema/-wide/-landscape/-portrait/-square`) via a `.gd-ratio--*` modifier. No other aspect ratio is sanctioned.
- **The single exception**: a photo used as full-bleed background for an entire section may follow the section's shape instead of locking to a ratio.
- **Images inside `.gd-ratio` are always `object-fit: cover`**; they cannot stretch or distort.
- **No image may exceed `--gd-image-max-h`** = `100vh - (2 × --gd-section-pad-y) - --gd-header-h`. The cap is enforced via per-ratio `max-width` on each `.gd-ratio--*` modifier, so when the bound kicks in the entire box shrinks proportionally (the aspect lock is preserved; the image is not clipped). This rule does **not** apply to full-bleed section background photos.
- **Attached chrome counts toward the cap.** When an image has attached chrome that shares its vertical stack (a `.gd-caption` under `.gd-image`, or the eyebrow/title/body/link stack under `.gd-card--photo` / `.gd-card--profile`), the image's effective cap is `--gd-image-max-h − (reserved chrome height)` so both image AND chrome fit inside the viewport-fit window together. Implementation: contexts set `--gd-image-fit-h` (a cascade custom property) to the reduced value; the `.gd-ratio--*` per-ratio `max-width` rules consume `--gd-image-fit-h` with a fallback to `--gd-image-max-h`. New image-bearing components that stack image + chrome vertically must follow the same pattern.

### Component cardinality and per-component rules

- **One `.gd-status--active` per page maximum.** One active status badge, ever.
- **One `.gd-stamp` per page maximum.**
- **One `.gd-filebar__value--active` cell per filebar.**
- **Rarely more than one `.gd-btn` (primary) per page.** Secondary actions are `.gd-btn--ghost`.
- **`.gd-filebar` is never a generic navbar.** It's for file/claim metadata only. If you need site navigation, use a real `<nav>` with anchor links.
- **Card slot order is fixed.** Eyebrow → title → body → link. Drop slots if you don't need them but never reshuffle their vertical order.
- **Pick a `.gd-card--*` variant by its anchor element, not by appearance.** `--photo` for image-anchored, `--profile` for portrait-anchored (people), `--file` for filebar-anchored.
- **`.gd-list` nests one level maximum.** Deeper hierarchy means the content wants to be sections with headings, not a nested list.
- **Trust grid: 2–4 cells typical.** 5+ starts to crowd — restructure into multiple rows or a different component.
- **Three button styles total — primary, ghost, and the mono CTA link.** Never invent a fourth button or link style. If a need arises, surface it and we redesign at the system layer.

### Hover-lift treatment

The shared border + box-shadow + transform-translateY treatment is one rule applied to `.gd-image > .gd-ratio`, `.gd-frame`, `.gd-slider`, `.gd-card` via a single comma-grouped selector in `tokens.css`. **Any new component that adopts this hover behavior must join the existing selector list**, not write a fifth duplicate rule body. New components get the same `--gd-d-base` / `--gd-ease` / `--gd-shadow-lift` / `--gd-lift` treatment or none.

### Motion

- **All motion is transition-based.** No `@keyframes`, no scroll-linked animation, no animation libraries — without explicit user approval. If motion can't be expressed as a transition on a state change, stop and ask.
- **One easing curve site-wide.** `--gd-ease` is the only curve. Three durations (`--gd-d-fast/base/slow`); pick by role, never substitute another value.

### Class portability

- **Design classes are self-contained.** Each typography role (`.gd-h1`, `.gd-mono`, `.gd-pullquote`, …) fully specs its family, size, weight, line-height, color. Components reuse role classes via combination, not by extracting fragments into utility classes (no `.gd-uppercase`, no `.gd-font-mono`-as-utility, no `.gd-fw-bold`-as-utility).
- **`currentColor` is the preferred mechanism** when a single class has variants that differ only in color (e.g. `.gd-status` border picks up `currentColor` so each `--variant` only sets `color`). Don't define separate `border-color` rules per variant.
- **No `!important` anywhere.** If specificity is fighting you, the cascade is being misused — fix the structure instead.

## Workflow expectations for Claude

- **Announce token/class decisions before writing code.** When implementing anything visual, first state: "I'll use token `--x` and class `.y`" (or "I need a new token `--x` because…"). Then write the code. This makes drift detectable in review.
- **Ask, don't assume, on similarity.** If something resembles an existing pattern, surface it. Wrong guesses here are how the previous overhaul died.
- **Edits are token/class audits.** Every time you touch a file, verify the rules above still hold for what you're touching. Fix nearby drift in the same change if you spot it; don't widen scope hunting for it.

## Repository layout and the two CSS namespaces

The repository deliberately separates **the design system** from **commentary about the design system**. These two things live in different files and use different naming conventions, and they must never be mixed.

```
ra-v2/
  app/                          ← THE WHOLE GUIDE. The website IS the design system.
    layout.tsx                  ← root layout, imports the three CSS files
    page.tsx                    ← THE Design page. Single route (/). All sections inline.
    styles/                     ← ALL CSS SOURCES live here
      base.css                  ← Bare-element resets + document-wide behavior
      tokens.css                ← THE DESIGN SYSTEM (every design value lives here)
      readability.css           ← NOTES/PROSE ABOUT the guide (NOT part of the design)
    _components/                ← Shared React components. Underscore = private folder; never a route.
      ReadNav.tsx               ← floating draggable horizontal nav (client) — anchor-jump links
      ReadSection.tsx           ← yellow read-section header (server)
      ReadPlaceholder.tsx       ← non-yellow design-content placeholder (server)
  public/                       ← Static assets served at /<path>
    photos/                     ← All photos
      brand/
      portfolio/
  package.json, tsconfig.json, next.config.mjs, .gitignore, …
```

**The website is the design system.** There is no separate `design/` folder, no separate `components/` folder, no separate `styles/` folder. Everything that defines or demonstrates the system lives inside `app/`. The Next.js site IS the guide; the guide IS the system.

### `app/styles/base.css` — element defaults

- Bare-element resets that neutralize browser user-agent defaults (e.g. `body { margin: 0 }`). Targets raw HTML elements — never classes, never tokens.
- Imported FIRST in `app/layout.tsx` so the cascade reads: element defaults → design tokens → readability commentary.
- This is part of the design system, not readability — it sets the foundation everything else builds on. Anything that isn't a raw-element reset does not belong here.

### `app/styles/tokens.css` — the design system

- Single source of truth for every design value: colors, spacing, typography, radii, shadows, z-indices, durations, easings, breakpoints, etc.
- Defines design tokens as CSS custom properties on `:root`.
- Class definitions for design components also belong adjacent to or alongside the tokens (in `tokens.css` or in additional design files under `app/styles/` as the system grows — but never in `readability.css`).
- **Naming is non-negotiable:**
  - Every design custom property MUST start with `--gd-*` (e.g. `--gd-color-fg`, `--gd-fs-h1`, `--gd-space-4`).
  - Every design class MUST start with `.gd-*` (e.g. `.gd-btn`, `.gd-card`, `.gd-section`).
  - The `--read-*` / `.read-*` prefix is **reserved for readability.css and forbidden here.**
- The `gd-` prefix exists so anyone scanning a file can tell at a glance which symbols are part of the real design system vs. the readability scaffolding. Never drop the prefix — even on tokens or classes that "feel obvious."

### `app/styles/readability.css` — commentary, never design

- Holds styles used **only** for prose, notes, captions, callouts, annotations, or any other meta-commentary **about** the design guide that is itself not part of the design.
- **Naming is non-negotiable:**
  - All custom properties MUST be prefixed `--read-*`
  - All classes MUST be prefixed `.read-*`
- Nothing in this file is part of the design system. If a rule could plausibly belong to the product's visual language, it does not belong here — move it to the design files.

### `app/_components/` — shared React components

- Underscore prefix is the Next.js explicit "private folder" convention — Next.js will never treat `_components/` as a route segment.
- Components are PascalCase and named for role (`ReadNav`, `ReadSection`, `ReadPlaceholder`). Currently all components are readability scaffolding; design components will land here too when they exist (named without `Read` prefix).
- Pages and the layout import from `@/app/_components/<Name>`.

### `public/photos/` — photos

- All photos used anywhere in the guide live under `public/photos/`, organized into subfolders by purpose (`brand/`, `portfolio/`, …). New subfolders are added when a new clearly-distinct purpose appears; do not invent overlapping or near-duplicate categories.
- `public/` is Next.js's standard static-asset root; files here are served verbatim at `/<path>` (so `public/photos/brand/x.svg` is reachable at `/photos/brand/x.svg`).
- The folder is named **`photos/`**, not `images/`, deliberately. The Images section of the design guide (covered by `<ReadSection id="images">` on the home page) is about image-related design tokens — not photo files. Two folders with the same name in different roles is drift; pick a precise word for each.
- Files are named for **what they are or where they're meant to go** — not for their dimensions, hash, or import order. Rename on copy if a name is unclear.
- Photos may appear in pages strictly as **visual placeholders** to demonstrate aspect ratios, image-bearing components, framing, treatments, etc. They are not content. Do not derive design decisions from the specifics of any individual photo (its subject, mood, era of the brand) and do not treat the choice of photo as authored copy.

### `app/` — the Next.js guide site

The guide is a Next.js 15 + React 19 + TypeScript app using the App Router and Turbopack dev. There is **no Tailwind, no utility framework, and no CSS-in-JS** — all styling comes from the three files in `app/styles/`, imported once in the root layout (`app/layout.tsx`) in this exact order: `base.css`, `tokens.css`, `readability.css`.

Routing rules:

- **Single page architecture.** The guide is one route (`/`) — the "Design" page — with every token category as an inline section (`<ReadSection id="colors">`, `<ReadSection id="typography">`, …). The floating nav uses **anchor-jump links** (`<a href="#colors">`) to scroll to sections, not separate routes.
- New token categories or subsections become new `<ReadSection>` blocks inline, with new section `id`s wired into `ReadNav.tsx`. **Do not** introduce a second route for "more pages" without explicit user direction — the website is one page.
- **Server Components by default.** A page or component only gets `"use client"` if it genuinely needs hooks, event handlers, or browser APIs (the floating draggable nav is the canonical example). Push the directive to the smallest leaf.
- **No business logic, fetching, or mutation in this repo right now.** It's a static design guide. If pages ever need data, follow Next.js App Router conventions: services in a separate module, route handlers/actions thin, explicit cache policy on every fetch.
- **Shared components live in `app/_components/`** (private folder; never a route). Pages import from `@/app/_components/<Name>`.
- Inside any page or component, content falls into exactly one of two buckets:
  - **Part of the guide** (a swatch, a button demo, a typography sample) → uses tokens from `tokens.css` and design classes. **No `read-` prefix.**
  - **About the guide** (a section header explanation, a "when to use" note, a caption) → uses `.read-*` classes and `--read-*` variables from `readability.css`. **Always `read-` prefixed.**
- When in doubt about which bucket something belongs in, **stop and ask.** Misclassification is exactly how design/commentary drift creeps back in.

Run the site locally with `npm run dev` (port 3000). Type-check with `npm run typecheck`. Build with `npm run build`.

### The separation rule (strict)

- A design class or token must **never** be referenced by a `.read-*` rule, and a `.read-*` class must **never** be used to style anything that is part of the design.
- If a value or pattern is needed in both places, define it twice — once as a design token and once as a `--read-*` variable — and keep them independent. They serve different purposes; coupling them re-introduces drift.
- Any edit that touches either file is also an audit: confirm every selector and every variable in scope still respects the namespace boundary.

## Content is out of scope — only design matters

This repository is exclusively about the **design system** right now. Copy, headlines, body text, button labels, captions, alt text wording, photo subjects — none of it is the focus of any current task.

- Do not edit copy to "improve" it. Do not flag awkward wording. Do not propose rewrites.
- Do not let the meaning of placeholder text or the subject of a placeholder photo influence any design decision. Lorem-ipsum-grade strings and stock-style images are fine; treat them as opaque content blobs whose only relevant properties are length, shape, and visual weight.
- If a token, class, or layout decision would only make sense given specific copy, that is a sign the design is being over-fitted to placeholder content — generalize it.
- Content review will happen later, in a separate pass, deliberately. Until the user explicitly opens that pass, ignore the words.

## Quarantined files (do not read unless explicitly directed)

Some files exist in this repo as **reference-only material** for one-off extraction work. They are NOT part of the design guide, NOT part of the design system, and NOT a source of truth for anything.

Currently quarantined:

- `spec-sheet-family-guide.html` — external reference. The user will, at their explicit direction in a specific turn, point at parts of this file to extract into `app/styles/tokens.css` and/or `app/page.tsx`. The file is scheduled for deletion once extraction is complete.

Hard rules for quarantined files:

- **Do not open or read them** unless the user has, **in the current turn**, explicitly instructed you to extract from that specific file. Curiosity, "for context," or "to understand the project better" are not valid reasons.
- Each quarantined file carries a banner at the top warning agents off; that banner is authoritative — respect it.
- **Never** confuse a quarantined file with the design guide. `app/page.tsx` is the design guide. `spec-sheet-family-guide.html` is **not**.
- **Never** cite, mimic, copy structure from, or otherwise treat a quarantined file as authoritative for the design system. Anything that ends up in the design system gets there only through an explicit, user-directed extraction step.
- When extraction is complete and the user says to delete the file, delete it without leaving aliases, references, or breadcrumbs behind.

If a future file needs to be quarantined under the same rules, add it to the list above and include the same kind of top-of-file banner.

## Repository state

The Next.js site is a **single-page design guide** with the readability namespace in place: a horizontal floating draggable + collapsable nav with anchor-jump links, yellow `.read-section` headers with intros and "When to use" callouts, and non-yellow `.read-placeholder` blocks marking where future design content will go. Sections inlined on the home page (`/`): Design (h1), Colors, Typography, Containers, Motion, Images (with Standard and Sliders subsections via `.read-subsection`).

`app/styles/tokens.css` is still empty — the design system has not been defined yet. Substantive work begins by populating tokens deliberately, one decision at a time, and adding design content into the corresponding `<ReadSection>` blocks on the home page. **Do not** generate design components, design markup, or design CSS ahead of the tokens they would depend on.

`spec-sheet-family-guide.html` is present as a quarantined reference file (see the section above) — not part of the project.
