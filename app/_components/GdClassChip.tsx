"use client";

import { useId, useState } from "react";

/* Reusable design-class chip. Every class chip across every read-* table
   renders through this single component so the toggle behavior, the
   button/expand chrome, and the rule-body styling stay in one place.

   Behavior:
     • A consumer can pass an explicit `tokens={[…]}` prop (the typography
       table does this — each row carries its own token list).
     • If no prop is given, the component falls back to a centralized
       CLASS_TOKENS map below. This keeps page.tsx call sites trivial
       (just `<GdClassChip className="gd-btn" />`) while concentrating the
       class → tokens data in one auditable place.
     • If the class has neither prop tokens nor a CLASS_TOKENS entry, the
       chip degrades to a plain non-interactive <span>. Structural-slot
       chips (.gd-card__title, .gd-frame__brackets, .gd-pm__photo, etc.)
       intentionally have no entry — their tokens are inherited from the
       parent compound, so listing tokens for them would be misleading.
       Promote to a button by adding a CLASS_TOKENS entry later. */

const tokenProperty = (t: string): string => {
  if (t.startsWith("--gd-font-")) return "font-family";
  if (t.startsWith("--gd-fs-")) return "font-size";
  if (t.startsWith("--gd-fw-")) return "font-weight";
  if (t.startsWith("--gd-lh-")) return "line-height";
  if (t.startsWith("--gd-tr-")) return "letter-spacing";
  if (t.startsWith("--gd-fg")) return "color";
  if (t.startsWith("--gd-color-fg")) return "color";
  if (t.startsWith("--gd-color-brand")) return "color";
  if (t.startsWith("--gd-color-success")) return "color";
  if (t.startsWith("--gd-color-bg")) return "background";
  if (t.startsWith("--gd-color-")) return "color";
  if (t.startsWith("--gd-bw-")) return "border-width";
  if (t.startsWith("--gd-rule-")) return "border-color";
  if (t.startsWith("--gd-r-")) return "border-radius";
  if (t.startsWith("--gd-shadow-")) return "box-shadow";
  if (t.startsWith("--gd-space-")) return "padding";
  if (t.startsWith("--gd-pad-")) return "padding";
  if (t.startsWith("--gd-ar-")) return "aspect-ratio";
  if (t.startsWith("--gd-d-")) return "transition-duration";
  if (t === "--gd-ease") return "transition-timing-function";
  if (t === "--gd-lift") return "transform";
  if (t.startsWith("--gd-header-")) return "padding";
  if (t.startsWith("--gd-banner-")) return "padding";
  if (t.startsWith("--gd-logo-")) return "height";
  if (t.startsWith("--gd-z-")) return "z-index";
  if (t.startsWith("--gd-mw-")) return "max-width";
  if (t.startsWith("--gd-image-")) return "max-height";
  return "—";
};

/* Hand-encoded mirror of design tokens (the right-side resolved-value
   annotation in each declaration). Update alongside tokens.css when
   values change. */
const TOKEN_VALUES: Record<string, string> = {
  // Fonts
  "--gd-font-display": "Archivo Narrow",
  "--gd-font-body": "Work Sans",
  "--gd-font-mono": "JetBrains Mono",
  "--gd-font-serif": "Newsreader",
  // Sizes
  "--gd-fs-display": "clamp(2.6rem, 5vw, 4.2rem)",
  "--gd-fs-h1": "clamp(2rem, 3.6vw, 3rem)",
  "--gd-fs-h2": "clamp(1.6rem, 2.6vw, 2.2rem)",
  "--gd-fs-h2-display": "= --gd-fs-h1",
  "--gd-fs-h3": "1.5rem",
  "--gd-fs-h4": "1.15rem",
  "--gd-fs-h5": "1.05rem",
  "--gd-fs-body-l": "1.05rem",
  "--gd-fs-body": "1rem",
  "--gd-fs-body-s": "0.92rem",
  "--gd-fs-mono": "0.78rem",
  "--gd-fs-mono-s": "0.65rem",
  "--gd-fs-mono-xs": "0.6rem",
  "--gd-fs-mono-data": "0.86rem",
  "--gd-fs-mono-data-l": "1rem",
  "--gd-fs-pullquote": "clamp(1.4rem, 2.2vw, 1.75rem)",
  // Weights
  "--gd-fw-regular": "400",
  "--gd-fw-medium": "500",
  "--gd-fw-semibold": "600",
  "--gd-fw-bold": "700",
  // Line heights
  "--gd-lh-display": "0.95",
  "--gd-lh-heading": "1.05",
  "--gd-lh-pullquote": "1.35",
  "--gd-lh-body": "1.4",
  // Tracking
  "--gd-tr-mono": "0.18em",
  "--gd-tr-mono-s": "0.16em",
  "--gd-tr-mono-xs": "0.14em",
  "--gd-tr-mono-data": "0.04em",
  "--gd-tr-display-tight": "-0.005em",
  // Colors — primitives
  "--gd-color-fg": "#1d242d",
  "--gd-color-fg-strong": "#0c1117",
  "--gd-color-fg-muted": "#5a6168",
  "--gd-color-bg-page": "#fafaf6",
  "--gd-color-bg-surface": "#ffffff",
  "--gd-color-bg-warm": "#f0eee6",
  "--gd-color-bg-mute": "#e6e8e6",
  "--gd-color-bg-dark": "#161a1f",
  "--gd-color-brand": "#fb6a1d",
  "--gd-color-brand-soft": "#ff8442",
  "--gd-color-success": "#1a4a1a",
  // Colors — role tokens
  "--gd-fg": "= --gd-color-fg",
  "--gd-fg-strong": "= --gd-color-fg-strong",
  "--gd-fg-muted": "= --gd-color-fg-muted",
  // Rules / borders
  "--gd-bw-hair": "1px",
  "--gd-bw-rule": "2px",
  "--gd-rule-default": "rgba(12,17,23,0.15)",
  "--gd-rule-strong": "= --gd-color-fg-strong",
  "--gd-rule-active": "= --gd-color-brand",
  "--gd-rule-dim": "rgba(255,255,255,0.16)",
  // Radii
  "--gd-r-none": "0",
  "--gd-r-full": "9999px",
  // Shadows
  "--gd-shadow-none": "0 0 0 transparent",
  "--gd-shadow-lift": "0 1px 0 + 0 8px 24px -16px",
  // Spacing
  "--gd-space-1": "0.25rem",
  "--gd-space-2": "0.5rem",
  "--gd-space-3": "0.75rem",
  "--gd-space-4": "1rem",
  "--gd-space-5": "1.25rem",
  "--gd-space-6": "1.5rem",
  "--gd-space-8": "2rem",
  "--gd-space-10": "2.5rem",
  "--gd-space-12": "3rem",
  "--gd-space-16": "4rem",
  "--gd-pad-x": "clamp(1.5rem, 4vw, 4rem)",
  // Aspect ratios
  "--gd-ar-cinema": "21/9",
  "--gd-ar-wide": "16/9",
  "--gd-ar-landscape": "4/3",
  "--gd-ar-portrait": "3/4",
  "--gd-ar-square": "1/1",
  // Motion
  "--gd-d-fast": "120ms",
  "--gd-d-base": "240ms",
  "--gd-ease": "cubic-bezier(0.2, 0.8, 0.2, 1)",
  "--gd-lift": "0.125rem",
  // Spacing
  "--gd-space-20": "5rem",
  // Container max-widths
  "--gd-mw-prose": "64ch",
  "--gd-mw-page": "100%",
  "--gd-mw-cta": "960px",
  // Layout / header
  "--gd-header-h": "4.5rem",
  "--gd-header-pad-y": "= --gd-space-4",
  "--gd-header-pad-y-compact": "calc(--gd-header-pad-y / 2)",
  "--gd-banner-pad-y": "= --gd-space-2",
  "--gd-logo-h": "= --gd-space-10",
  "--gd-section-pad-y": "= --gd-space-12",
  "--gd-section-pad-x": "= --gd-pad-x",
  "--gd-z-header": "50",
  "--gd-image-max-h": "calc(100vh − 2 × pad-y − header-h)",
  // Role token — context-aware hairline
  "--gd-rule": "= --gd-rule-default (flips to --gd-rule-dim on dark surface)",
};

/* Class → tokens used by that class's rule in tokens.css. Add an entry
   to promote a chip from plain span to clickable toggle. Skip entries
   for structural slot classes whose own rule has no meaningful tokens
   (they inherit from the parent compound). */
const CLASS_TOKENS: Record<string, string[]> = {
  // Typography role classes (also passed explicitly by ReadTypeRow, but
  // the map covers them so any plain reference also works).
  "gd-display": ["--gd-font-display", "--gd-fs-display", "--gd-fw-bold", "--gd-lh-display", "--gd-tr-display-tight", "--gd-fg-strong"],
  "gd-h1": ["--gd-font-display", "--gd-fs-h1", "--gd-fw-bold", "--gd-lh-heading", "--gd-tr-display-tight", "--gd-fg-strong"],
  "gd-h2-display": ["--gd-font-display", "--gd-fs-h2-display", "--gd-fw-bold", "--gd-lh-heading", "--gd-tr-display-tight", "--gd-fg-strong"],
  "gd-h2": ["--gd-font-display", "--gd-fs-h2", "--gd-fw-bold", "--gd-lh-heading", "--gd-tr-display-tight", "--gd-fg-strong"],
  "gd-h3": ["--gd-font-display", "--gd-fs-h3", "--gd-fw-bold", "--gd-lh-heading", "--gd-tr-display-tight", "--gd-fg-strong"],
  "gd-h4": ["--gd-font-display", "--gd-fs-h4", "--gd-fw-bold", "--gd-lh-heading", "--gd-fg-strong"],
  "gd-h5": ["--gd-font-display", "--gd-fs-h5", "--gd-fw-bold", "--gd-lh-heading", "--gd-fg-strong"],
  "gd-body-l": ["--gd-font-body", "--gd-fs-body-l", "--gd-fw-medium", "--gd-lh-body", "--gd-fg"],
  "gd-body": ["--gd-font-body", "--gd-fs-body", "--gd-fw-regular", "--gd-lh-body", "--gd-fg"],
  "gd-body-s": ["--gd-font-body", "--gd-fs-body-s", "--gd-fw-regular", "--gd-lh-body", "--gd-fg-muted"],
  "gd-mono": ["--gd-font-mono", "--gd-fs-mono", "--gd-fw-bold", "--gd-lh-body", "--gd-tr-mono", "--gd-fg-muted"],
  "gd-mono-s": ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-medium", "--gd-lh-body", "--gd-tr-mono-s", "--gd-fg-muted"],
  "gd-mono-xs": ["--gd-font-mono", "--gd-fs-mono-xs", "--gd-fw-medium", "--gd-lh-body", "--gd-tr-mono-xs", "--gd-fg-muted"],
  "gd-mono--medium": ["--gd-fw-medium"],
  "gd-mono-s--bold": ["--gd-fw-bold"],
  "gd-mono-xs--bold": ["--gd-fw-bold"],
  "gd-mono-data": ["--gd-font-mono", "--gd-fs-mono-data", "--gd-fw-regular", "--gd-lh-body", "--gd-tr-mono-data", "--gd-fg"],
  "gd-mono-data--l": ["--gd-fs-mono-data-l"],
  "gd-mono-data--semibold": ["--gd-fw-semibold"],
  "gd-mono-data--bold": ["--gd-fw-bold"],
  "gd-mono-data--uppercase": [],
  "gd-eyebrow": ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-lh-body", "--gd-tr-mono", "--gd-color-brand"],
  "gd-stat": ["--gd-font-display", "--gd-fs-h1", "--gd-fw-bold", "--gd-lh-heading", "--gd-tr-display-tight", "--gd-fg-strong"],
  "gd-pullquote": ["--gd-font-serif", "--gd-fs-pullquote", "--gd-fw-regular", "--gd-lh-pullquote", "--gd-fg-strong"],
  "gd-serif": ["--gd-font-serif", "--gd-fs-body", "--gd-fw-medium", "--gd-lh-body", "--gd-fg-strong"],
  "gd-accent": ["--gd-color-brand"],

  // Buttons
  "gd-btn": [
    "--gd-font-mono", "--gd-fs-mono", "--gd-fw-bold", "--gd-tr-mono",
    "--gd-space-4", "--gd-space-6",
    "--gd-color-brand", "--gd-color-bg-surface", "--gd-color-brand-soft",
    "--gd-bw-hair", "--gd-shadow-lift", "--gd-lift",
    "--gd-d-fast", "--gd-d-base", "--gd-ease",
  ],
  "gd-btn--ghost": ["--gd-fg-strong", "--gd-rule-strong", "--gd-color-bg-mute", "--gd-rule-active", "--gd-color-brand"],

  // Links
  "gd-link": ["--gd-color-brand", "--gd-color-brand-soft", "--gd-space-1", "--gd-bw-hair", "--gd-d-fast", "--gd-ease"],
  "gd-link--mono": ["--gd-font-mono", "--gd-fs-mono", "--gd-fw-bold", "--gd-tr-mono", "--gd-space-1"],

  // Form controls
  "gd-input": ["--gd-font-body", "--gd-fs-body", "--gd-fw-regular", "--gd-lh-body", "--gd-fg", "--gd-color-bg-surface", "--gd-bw-hair", "--gd-rule-strong", "--gd-rule-active", "--gd-space-3", "--gd-space-4", "--gd-d-fast", "--gd-ease"],
  "gd-textarea": ["--gd-font-body", "--gd-fs-body", "--gd-fg", "--gd-color-bg-surface", "--gd-bw-hair", "--gd-rule-strong", "--gd-rule-active", "--gd-space-12"],
  "gd-select": ["--gd-font-body", "--gd-fs-body", "--gd-fg", "--gd-color-bg-surface", "--gd-bw-hair", "--gd-rule-strong", "--gd-rule-active"],
  "gd-label": ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-tr-mono-s", "--gd-fg-strong"],
  "gd-field": ["--gd-space-2"],
  "gd-field__error": ["--gd-font-mono", "--gd-fs-mono-s", "--gd-color-brand"],

  // Marks
  "gd-status": ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-tr-mono-s", "--gd-bw-hair", "--gd-space-1", "--gd-space-2"],
  "gd-status--closed": ["--gd-color-success"],
  "gd-status--filed": ["--gd-fg-muted"],
  "gd-status--active": ["--gd-color-brand"],
  "gd-stamp": ["--gd-font-display", "--gd-fs-pullquote", "--gd-fw-bold", "--gd-color-brand", "--gd-bw-rule", "--gd-space-2", "--gd-space-4"],
  "gd-warranty": ["--gd-font-display", "--gd-fw-bold", "--gd-color-brand", "--gd-bw-rule", "--gd-r-full"],
  "gd-divider": ["--gd-bw-hair", "--gd-rule-default", "--gd-space-8"],
  "gd-chips": ["--gd-space-2"],
  "gd-chip": ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-tr-mono-s", "--gd-bw-hair", "--gd-rule-default", "--gd-fg-muted", "--gd-space-1", "--gd-space-2"],

  // Compounds (abbreviated — just the distinctive tokens; the slot
  // children inherit and aren't worth listing on their own).
  "gd-card": ["--gd-color-bg-surface", "--gd-bw-hair", "--gd-rule-default", "--gd-shadow-none", "--gd-shadow-lift", "--gd-lift", "--gd-d-base", "--gd-ease", "--gd-space-4", "--gd-space-6"],
  "gd-card--photo": ["--gd-image-fit-h"],
  "gd-card--profile": ["--gd-image-fit-h"],
  "gd-card--file": ["--gd-image-fit-h"],
  "gd-frame": ["--gd-color-fg-strong", "--gd-fg-on-dark", "--gd-bw-hair", "--gd-rule-default", "--gd-shadow-none", "--gd-shadow-lift", "--gd-lift", "--gd-d-base", "--gd-ease"],
  "gd-slider": ["--gd-color-fg-strong", "--gd-fg-on-dark", "--gd-bw-hair", "--gd-rule-default", "--gd-shadow-none", "--gd-shadow-lift", "--gd-lift", "--gd-d-base", "--gd-ease"],
  "gd-trust": ["--gd-color-bg-surface", "--gd-bw-hair", "--gd-rule-default", "--gd-space-3", "--gd-space-6"],
  "gd-trust--rich": ["--gd-bw-hair", "--gd-rule-default"],
  "gd-trust__label": ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-tr-mono", "--gd-fg-muted", "--gd-space-3"],
  // .gd-stat (defined above with the typography roles) is the numeral
  // class for trust cells, audit stats, ledger totals, etc. The old
  // .gd-trust__value slot class was removed — trust JSX consumes
  // .gd-stat directly.
  "gd-ledger": ["--gd-color-bg-surface", "--gd-bw-hair", "--gd-rule-default"],
  "gd-ledger__row": ["--gd-bw-hair", "--gd-rule-default", "--gd-space-3", "--gd-space-4"],
  "gd-ledger__num": ["--gd-font-mono", "--gd-fs-mono", "--gd-fw-bold", "--gd-tr-mono", "--gd-fg-muted"],
  "gd-ledger__label": ["--gd-font-display", "--gd-fs-h4", "--gd-fw-semibold", "--gd-fg-strong"],
  "gd-ledger__money": ["--gd-font-mono", "--gd-fs-mono", "--gd-fw-bold", "--gd-fg-strong"],
  "gd-ledger__meta": ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fg-muted"],
  "gd-audit-row": ["--gd-bw-hair", "--gd-rule-default", "--gd-space-2"],
  "gd-audit-row--firstpass": ["--gd-rule-default"],
  "gd-audit-row--total": ["--gd-bw-hair", "--gd-fg-strong", "--gd-space-3"],
  "gd-audit-row--uplift": [],
  "gd-bar": ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-tr-mono-s", "--gd-space-3", "--gd-space-6"],
  "gd-bar--dark": ["--gd-color-fg-strong", "--gd-fg-on-dark"],
  "gd-quote": ["--gd-color-bg-surface", "--gd-bw-hair", "--gd-rule-default", "--gd-space-4", "--gd-space-6"],
  "gd-quote__mark": ["--gd-font-display", "--gd-color-brand", "--gd-fs-display"],
  "gd-quote__cite": ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-tr-mono-s", "--gd-fg-muted"],
  "gd-list": ["--gd-color-brand", "--gd-space-2", "--gd-space-3"],
  "gd-list--ordered": ["--gd-font-mono", "--gd-fw-bold", "--gd-color-brand"],
  "gd-filebar": ["--gd-color-bg-surface", "--gd-bw-hair", "--gd-rule-default"],
  "gd-filebar__cell": ["--gd-bw-hair", "--gd-rule-default", "--gd-space-3", "--gd-space-4"],
  "gd-filebar__label": ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-tr-mono-s", "--gd-fg-muted"],
  "gd-filebar__value": ["--gd-font-display", "--gd-fs-h4", "--gd-fw-semibold", "--gd-fg-strong"],
  "gd-filebar__value--active": ["--gd-color-brand"],
  "gd-pm": ["--gd-bw-hair", "--gd-rule-default", "--gd-space-3", "--gd-space-4"],
  "gd-pm__name": ["--gd-font-mono", "--gd-fs-mono", "--gd-fw-bold", "--gd-tr-mono", "--gd-fg-strong"],
  "gd-pm__title": ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-tr-mono", "--gd-fg-muted"],

  // Site header system
  "gd-site-header": ["--gd-z-header", "--gd-d-base", "--gd-ease"],
  "gd-banner": ["--gd-color-fg-strong", "--gd-fg-on-dark", "--gd-banner-pad-y", "--gd-d-base", "--gd-ease"],
  "gd-topnav": ["--gd-color-bg-page", "--gd-bw-hair", "--gd-rule-default", "--gd-header-pad-y", "--gd-d-base", "--gd-ease"],
  "gd-phone": ["--gd-font-mono", "--gd-fs-mono", "--gd-fw-bold", "--gd-tr-mono", "--gd-fg-strong", "--gd-color-brand", "--gd-d-fast", "--gd-ease"],
  "gd-weather": ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-tr-mono-s", "--gd-fg-muted"],
  "gd-topnav__link": ["--gd-font-mono", "--gd-fs-mono", "--gd-fw-bold", "--gd-tr-mono", "--gd-fg-strong", "--gd-color-brand", "--gd-d-fast", "--gd-ease"],

  // Image vocabulary — the .gd-ratio--* modifiers carry their aspect
  // ratio token + the per-ratio max-width derived from --gd-image-max-h.
  "gd-image": ["--gd-bw-hair", "--gd-rule-default"],
  "gd-image > .gd-ratio": ["--gd-bw-hair", "--gd-rule-default", "--gd-shadow-none", "--gd-shadow-lift", "--gd-lift", "--gd-d-base", "--gd-ease"],
  "gd-ratio--cinema": ["--gd-ar-cinema"],
  "gd-ratio--wide": ["--gd-ar-wide"],
  "gd-ratio--landscape": ["--gd-ar-landscape"],
  "gd-ratio--portrait": ["--gd-ar-portrait"],
  "gd-ratio--square": ["--gd-ar-square"],

  // Lines primitives' role classes (the demo bars themselves have no
  // tokens — they're commentary chrome — but the .gd-bw-* / .gd-rule-*
  // chips in JSX never come through GdClassChip; they come through the
  // .read-gd-token-lbl span instead).
};

type Props = {
  className: string;
  tokens?: string[];
  /* Optional override for the chip's visible label. Default is `.${className}`
     so a chip with className="gd-card__title" displays ".gd-card__title".
     UsesCell passes the BEM suffix (e.g. "__title") for child chips inside
     a parent group, so the visual hierarchy reads as `.gd-card __title`
     while the rule-body lookup still resolves through the full className.
     Pass exactly what should render — no leading dot is prepended. */
  displayName?: string;
};

export function GdClassChip({ className, tokens, displayName }: Props) {
  const [expanded, setExpanded] = useState(false);
  const ruleId = useId();

  // Pick tokens: explicit prop wins; otherwise consult the catalog.
  const resolvedTokens = tokens ?? CLASS_TOKENS[className];
  const hasRule = !!resolvedTokens && resolvedTokens.length > 0;

  const label = displayName ?? `.${className}`;

  // No data → render as a plain non-interactive chip. Promote to a
  // toggle button by adding an entry to CLASS_TOKENS above.
  if (!hasRule) {
    return <span className="read-gd-class-lbl">{label}</span>;
  }

  return (
    <span className="read-gd-chip">
      <button
        type="button"
        className="read-gd-class-lbl"
        aria-expanded={expanded}
        aria-controls={ruleId}
        onClick={() => setExpanded((x) => !x)}
      >
        {label}
      </button>
      {expanded ? (
        <code id={ruleId} className="read-class-rule">
          <span className="read-class-rule__brace">{"{"}</span>
          {resolvedTokens.map((t) => (
            <span className="read-class-rule__decl" key={t}>
              <span className="read-token-value">{tokenProperty(t)}:</span>{" "}
              <span className="read-gd-token-lbl">{t}</span>
              <span className="read-class-rule__punct">;</span>{" "}
              <span className="read-gd-token-value">{TOKEN_VALUES[t] ?? "—"}</span>
            </span>
          ))}
          <span className="read-class-rule__brace">{"}"}</span>
        </code>
      ) : null}
    </span>
  );
}
