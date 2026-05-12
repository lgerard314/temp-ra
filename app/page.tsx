import type { ReactNode } from "react";
import { ReadSection } from "@/app/_components/ReadSection";
import { GdSlider } from "@/app/_components/GdSlider";
import { SiteHeader } from "@/app/_components/SiteHeader";
import { GdPhone } from "@/app/_components/GdPhone";
import { GdClassChip } from "@/app/_components/GdClassChip";
import { ReadTypeTable } from "@/app/_components/ReadTypeTable";
import { UsesCell } from "@/app/_components/UsesCell";

/* Ordered by visual similarity so adjacent rows in the colors table read
   as a coherent group, not a checklist:
     1. Light grounds — page / warm / mute (page & section backgrounds)
     2. Surface       — pure-white elevated component ground (special role)
     3. Dark fg tones — fg-strong / fg / fg-muted (text + structural dark)
     4. On-dark tiers — fg-on-dark / fg-on-dark-dim (text on dark surfaces)
     5. Accent        — accent / accent-soft (the system's single chroma)
     6. Status        — success (reserved closed/success state) */
type ColorUse = "typography" | "lines" | "shadows" | "accents" | "statuses" | "backgrounds";

/* usesByCategory replaces the prior flat `classes` + `uses` pair. Each
   key is the role this color plays in that consumer; the value is the
   list of .gd-* classes that consume the color in that role. An empty
   array means the role is recognized but no production class consumes
   it yet (page-grounds via the body element, the reserved bg-dark,
   etc.). The "Uses" column renders each category as a collapsable
   badge that discloses the chips for that specific category. */
const colorTokens: {
  key: string;
  token: string;
  value: string;
  usesByCategory: Partial<Record<ColorUse, string[]>>;
  when: string;
}[] = [
  { key: "bg-page",     token: "--gd-color-bg-page",     value: "#fafaf6",
    usesByCategory: { backgrounds: [".gd-card", ".gd-site-header", ".gd-topnav"] },
    when: "Background — primary page ground." },
  { key: "bg-warm",     token: "--gd-color-bg-warm",     value: "#f0eee6",
    usesByCategory: { backgrounds: [] },
    when: "Background — warm hero / featured sections. (No production class consumes this yet — reserved for warm-ground sections.)" },
  { key: "bg-mute",     token: "--gd-color-bg-mute",     value: "#e6e8e6",
    usesByCategory: { backgrounds: [".gd-btn--ghost", ".gd-ledger__row--header", ".gd-pm__photo", ".gd-ratio"] },
    when: "Background — quiet fills and divider grounds." },
  { key: "bg-surface",  token: "--gd-color-bg-surface",  value: "#ffffff",
    usesByCategory: {
      backgrounds: [".gd-filebar", ".gd-input", ".gd-ledger", ".gd-quote", ".gd-select", ".gd-textarea", ".gd-trust"],
      typography:  [".gd-btn", ".gd-slider__grip", ".gd-slider__meta", ".gd-slider__tag"],
    },
    when: "Background — elevated component surfaces only (cards, ledger, filebar, inputs, quote). Never a page or section background. Also used as text-on-dark color for slider chrome." },
  { key: "fg-strong",   token: "--gd-color-fg-strong",   value: "#0c1117",
    usesByCategory: {
      typography:  [".gd-btn--ghost", ".gd-card__title", ".gd-display", ".gd-filebar__value", ".gd-h1", ".gd-h2", ".gd-h2-display", ".gd-h3", ".gd-h4", ".gd-h5", ".gd-label", ".gd-ledger__label", ".gd-ledger__money", ".gd-phone", ".gd-pm__name", ".gd-pullquote", ".gd-serif", ".gd-stat", ".gd-status--active", ".gd-topnav__link", ".gd-warranty__text", ".gd-weather__temp"],
      backgrounds: [".gd-banner", ".gd-bar--dark", ".gd-frame", ".gd-slider", ".gd-slider__layer--before", ".gd-slider__meta", ".gd-surface--dark"],
    },
    when: "Typography — structural headers and emphasis. Also a background — banner-style sections + slider chrome." },
  { key: "bg-dark", token: "--gd-color-bg-dark", value: "#161a1f",
    usesByCategory: { backgrounds: [] },
    when: "Reserved alt dark surface — held for cases that need to read as distinctly different from --gd-color-fg-strong while still in the dark vocabulary. NEVER substituted for --gd-color-fg-strong on banner / structural surfaces; pick one and stay with it. No production class consumes this yet." },
  { key: "fg",          token: "--gd-color-fg",          value: "#1d242d",
    usesByCategory: {
      typography: [".gd-body", ".gd-body-l", ".gd-card__body", ".gd-chip", ".gd-frame__meta-top", ".gd-input", ".gd-ledger__meta", ".gd-list", ".gd-mono-data", ".gd-select", ".gd-textarea"],
    },
    when: "Typography — body text and tabular-data mono." },
  { key: "fg-muted",    token: "--gd-color-fg-muted",    value: "#5a6168",
    usesByCategory: {
      typography: [".gd-banner__meta", ".gd-body-s", ".gd-caption", ".gd-filebar__label", ".gd-frame__meta-bot", ".gd-mono", ".gd-mono-s", ".gd-mono-xs", ".gd-pm__meta", ".gd-pm__title", ".gd-quote__cite", ".gd-status", ".gd-status--filed", ".gd-trust__label", ".gd-weather__label"],
    },
    when: "Typography — secondary text (mono labels, captions, small body, dimmed meta)." },
  { key: "fg-on-dark",     token: "--gd-color-fg-on-dark",     value: "rgba(255,255,255,0.85)",
    usesByCategory: {
      typography: [".gd-banner", ".gd-bar--dark", ".gd-frame", ".gd-phone--on-dark", ".gd-slider", ".gd-surface--dark"],
    },
    when: "Typography on dark surfaces — primary readable text. Applied via the role-token cascade inside .gd-surface--dark." },
  { key: "fg-on-dark-dim", token: "--gd-color-fg-on-dark-dim", value: "rgba(255,255,255,0.7)",
    usesByCategory: {
      typography: [".gd-banner__meta", ".gd-frame__meta-bot"],
    },
    when: "Typography on dark surfaces — dimmed/secondary text. Applied via the role-token cascade." },
  { key: "accent",      token: "--gd-color-brand",      value: "#fb6a1d",
    usesByCategory: {
      typography:  [".gd-accent", ".gd-caption-meta", ".gd-card__eyebrow", ".gd-card__link", ".gd-eyebrow", ".gd-field__error", ".gd-link", ".gd-list", ".gd-list--ordered", ".gd-quote__mark", ".gd-slider__meta-num", ".gd-stamp", ".gd-warranty__shape", ".gd-weather__icon"],
      lines:       [".gd-frame__brackets", ".gd-stamp", ".gd-warranty__shape"],
      statuses:    [".gd-filebar__value--active", ".gd-status--active"],
      backgrounds: [".gd-btn", ".gd-slider__grip", ".gd-slider__handle"],
      accents:     [".gd-btn--ghost", ".gd-phone", ".gd-phone--on-dark", ".gd-topnav__link"],
    },
    when: "Accent — the single chromatic highlight. The only chromatic color in the system, used across typography, lines, statuses, and backgrounds." },
  { key: "accent-soft", token: "--gd-color-brand-soft", value: "#ff8442",
    usesByCategory: {
      accents: [".gd-btn", ".gd-link"],
    },
    when: "Accent — softer hover variant of --gd-color-brand. Never used at rest." },
  { key: "success",     token: "--gd-color-success",     value: "#1a4a1a",
    usesByCategory: {
      statuses: [".gd-status--closed"],
    },
    when: "Status — success / “closed” state. Reserved; never a generic green." },
];

/* (USE_LABELS map is no longer needed — UsesCell handles category
   labels internally. The ColorUse axis is preserved on the data side
   so colors can still be authored "this color plays N roles" while
   UsesCell categorizes consumers by component-area at render time.) */

const typeRoles: {
  className: string;
  sample: ReactNode;
  tokens: string[];
  classes?: string[];
  when: string;
}[] = [
  { className: "gd-display",   sample: <>The quick <span className="gd-accent">brown fox</span></>,
    tokens: ["--gd-font-display", "--gd-fs-display", "--gd-fw-bold", "--gd-lh-display", "--gd-tr-display-tight", "--gd-fg-strong"],
    when: "Hero display headline — page-opening titles only. At most one per page." },
  { className: "gd-h1",        sample: "The quick brown fox",
    tokens: ["--gd-font-display", "--gd-fs-h1", "--gd-fw-bold", "--gd-lh-heading", "--gd-tr-display-tight", "--gd-fg-strong"],
    when: "Page-level primary heading. Exactly one per page." },
  { className: "gd-h2-display", sample: <>The quick <span className="gd-accent">brown fox</span></>,
    tokens: ["--gd-font-display", "--gd-fs-h2-display", "--gd-fw-bold", "--gd-lh-heading", "--gd-tr-display-tight", "--gd-fg-strong"],
    when: "Semantic <h2> promoted to display size — use when an h2 needs hero-level prominence (landing-section openers). Size tracks --gd-fs-h1." },
  { className: "gd-h2",        sample: "The quick brown fox jumps",
    tokens: ["--gd-font-display", "--gd-fs-h2", "--gd-fw-bold", "--gd-lh-heading", "--gd-tr-display-tight", "--gd-fg-strong"],
    when: "Section heading — the primary in-section title." },
  { className: "gd-h3",        sample: "The quick brown fox jumps over the lazy dog",
    tokens: ["--gd-font-display", "--gd-fs-h3", "--gd-fw-bold", "--gd-lh-heading", "--gd-tr-display-tight", "--gd-fg-strong"],
    classes: [".gd-warranty__text"],
    when: "Subsection heading inside a section." },
  { className: "gd-h4",        sample: "The quick brown fox jumps over the lazy dog",
    tokens: ["--gd-font-display", "--gd-fs-h4", "--gd-fw-bold", "--gd-lh-heading", "--gd-fg-strong"],
    classes: [".gd-card__title", ".gd-weather__temp"],
    when: "Smallest heading in the regular heading scale — labels content within a subsection. h4 deliberately does NOT carry --gd-tr-display-tight (the negative-tracking primitive applied to display/h1-h3); at h4's smaller size the negative tracking would crush the glyphs." },
  { className: "gd-h5",        sample: "The quick brown fox jumps over the lazy dog",
    tokens: ["--gd-font-display", "--gd-fs-h5", "--gd-fw-bold", "--gd-lh-heading", "--gd-fg-strong"],
    classes: [".gd-ledger__label", ".gd-ledger__money"],
    when: "Secondary display tier — sub-h4 size for ledger-money / process-title style consumers. Sits within 0.1rem of both .gd-h4 AND .gd-body-l — borderline near-duplicate; decide before adopting widely. Same no-tracking posture as .gd-h4." },
  { className: "gd-body-l",    sample: "The quick brown fox jumps over the lazy dog and lopes back home before sunset.",
    tokens: ["--gd-font-body", "--gd-fs-body-l", "--gd-fw-medium", "--gd-lh-body", "--gd-fg"],
    when: "Large body — intro paragraphs and lead sentences. Body family with promoted medium weight; never substituted for .gd-h4." },
  { className: "gd-body",      sample: "The quick brown fox jumps over the lazy dog and lopes back home before sunset.",
    tokens: ["--gd-font-body", "--gd-fs-body", "--gd-fw-regular", "--gd-lh-body", "--gd-fg"],
    classes: [".gd-input", ".gd-textarea", ".gd-select"],
    when: "Default body copy — the workhorse for prose paragraphs." },
  { className: "gd-body-s",    sample: "The quick brown fox jumps over the lazy dog and lopes back home before sunset.",
    tokens: ["--gd-font-body", "--gd-fs-body-s", "--gd-fw-regular", "--gd-lh-body", "--gd-fg-muted"],
    classes: [".gd-card__body", ".gd-list"],
    when: "Small body — captions, meta text, or fine print within a body context. Drops to fg-muted because at this size it's a secondary information tier." },
  { className: "gd-mono",      sample: "STATUS · 240924 · OPEN",
    tokens: ["--gd-font-mono", "--gd-fs-mono", "--gd-fw-bold", "--gd-lh-body", "--gd-tr-mono", "--gd-fg-muted"],
    classes: [".gd-btn", ".gd-btn--ghost", ".gd-card__link", ".gd-filebar__value", ".gd-filebar__value--active", ".gd-ledger__meta", ".gd-ledger__num", ".gd-link--mono", ".gd-phone", ".gd-phone--on-dark", ".gd-slider__grip", ".gd-topnav__link"],
    when: "Mono labels — file numbers, status text, tabular meta. The ONLY mono role that defaults to bold; .gd-mono-s and .gd-mono-xs default to medium. Compose with .gd-mono--medium to drop this base size to medium too." },
  { className: "gd-mono gd-mono--medium", sample: "STATUS · 240924 · OPEN",
    tokens: ["--gd-font-mono", "--gd-fs-mono", "--gd-fw-medium", "--gd-lh-body", "--gd-tr-mono", "--gd-fg-muted"],
    when: "Mono medium — composes .gd-mono with the --medium modifier when the default bold mono reads too loud (calmer table cells, secondary metadata)." },
  { className: "gd-mono-s",    sample: "STATUS · 240924 · OPEN",
    tokens: ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-medium", "--gd-lh-body", "--gd-tr-mono-s", "--gd-fg-muted"],
    when: "Smaller mono — secondary meta annotations (filebar values, ledger meta, caption-meta). Defaults to medium weight." },
  { className: "gd-mono-s gd-mono-s--bold", sample: "STATUS · 240924 · OPEN",
    tokens: ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-lh-body", "--gd-tr-mono-s", "--gd-fg-muted"],
    classes: [".gd-banner__meta", ".gd-bar", ".gd-caption", ".gd-chip", ".gd-field__error", ".gd-label", ".gd-pm__meta", ".gd-quote__cite", ".gd-slider__meta", ".gd-status", ".gd-trust__label", ".gd-warranty__unit", ".gd-weather__label"],
    when: "Mono-s bold — composes .gd-mono-s with the --bold modifier. The workhorse for label/status/chip/banner-meta/caption/quote-cite/slider-meta/trust-label slots that want the emphatic 700 weight at mono-s size." },
  { className: "gd-mono-xs",   sample: "STATUS · 240924 · OPEN",
    tokens: ["--gd-font-mono", "--gd-fs-mono-xs", "--gd-fw-medium", "--gd-lh-body", "--gd-tr-mono-xs", "--gd-fg-muted"],
    when: "Smallest mono — micro overlays (frame meta rows, slider tag pills, micro footer chrome). Defaults to medium weight and the tightest mono tracking (--gd-tr-mono-xs) so glyphs at this size don't crowd." },
  { className: "gd-mono-xs gd-mono-xs--bold", sample: "STATUS · 240924 · OPEN",
    tokens: ["--gd-font-mono", "--gd-fs-mono-xs", "--gd-fw-bold", "--gd-lh-body", "--gd-tr-mono-xs", "--gd-fg-muted"],
    classes: [".gd-filebar__label", ".gd-frame__meta-bot", ".gd-frame__meta-top", ".gd-slider__tag"],
    when: "Mono-xs bold — composes .gd-mono-xs with the --bold modifier. Used by filebar-label, frame-meta, and slider-tag slots where the smallest mono needs emphatic weight." },
  { className: "gd-mono-data", sample: "+ Decking, rotted (8 sheets)",
    tokens: ["--gd-font-mono", "--gd-fs-mono-data", "--gd-fw-regular", "--gd-lh-body", "--gd-tr-mono-data", "--gd-fg"],
    classes: [".gd-audit-row"],
    when: "Tabular-data mono — the ONLY mono role rendered mixed-case. For prose-like cells in numeric line-items (ledger rows, audit-row body). Mixed case + tight 0.04em tracking + regular weight + ink color distinguish it from every uppercase-label mono above." },
  { className: "gd-mono-data gd-mono-data--semibold", sample: "$14,200",
    tokens: ["--gd-font-mono", "--gd-fs-mono-data", "--gd-fw-semibold", "--gd-lh-body", "--gd-tr-mono-data", "--gd-fg"],
    classes: [".gd-audit-row__value"],
    when: "Tabular-data mono with semibold weight — for the numeric value cell inside an audit / ledger line-item where the figure needs to read structurally without going full bold." },
  { className: "gd-mono-data gd-mono-data--l gd-mono-data--bold", sample: "Closed file · $28,400",
    tokens: ["--gd-font-mono", "--gd-fs-mono-data-l", "--gd-fw-bold", "--gd-lh-body", "--gd-tr-mono-data", "--gd-fg"],
    classes: [".gd-audit-row--total"],
    when: "Tabular-data mono at the summary tier — composes --l (size jumps to body 1rem) with --bold for total / closing rows. Add --uppercase to all-caps the label/value content." },
  { className: "gd-mono-data gd-mono-data--bold gd-mono-data--uppercase", sample: "SUPPLEMENT UPLIFT",
    tokens: ["--gd-font-mono", "--gd-fs-mono-data", "--gd-fw-bold", "--gd-lh-body", "--gd-tr-mono-data", "--gd-fg"],
    classes: [".gd-audit-row--uplift"],
    when: "Tabular-data mono with both emphasis modifiers — for the .gd-audit-row--uplift treatment (marketing-style closing line, no border, all caps)." },
  { className: "gd-eyebrow",   sample: "RE: STORM CLAIM · PLANO",
    tokens: ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-lh-body", "--gd-tr-mono", "--gd-color-brand"],
    classes: [".gd-card__eyebrow"],
    when: "Section eyebrow — mono uppercase label sitting above a heading. Distinguished from .gd-mono-s by weight (bold here, medium there) and color (brand here, muted there); tracking matches the default --gd-tr-mono." },
  { className: "gd-stat",      sample: <>240+ · 14<small>min</small></>,
    tokens: ["--gd-font-display", "--gd-fs-h1", "--gd-fw-bold", "--gd-lh-heading", "--gd-tr-display-tight", "--gd-fg-strong"],
    when: "Stat-number role — big numerals / short numeric strings for stat cells, key figures, totals (trust grid, audit stats, ledger totals). Same composition as .gd-h1 minus uppercase; numerals have no case. Inner <small> renders an accent-colored unit suffix sized at --gd-fs-h4 with --gd-space-1 left margin (e.g. \"14\" + small \"min\"). Never used for prose." },
  { className: "gd-pullquote", sample: "“The quick brown fox jumps over the lazy dog.”",
    tokens: ["--gd-font-serif", "--gd-fs-pullquote", "--gd-fw-regular", "--gd-lh-pullquote", "--gd-fg-strong"],
    when: "Pull-quote — large italic serif for emphasized quotations. The ONLY Newsreader role at display size; never substituted for body italic. Uses the lighter regular weight so the display-size italic reads soft, not heavy." },
  { className: "gd-serif",     sample: "“The quick brown fox jumps over the lazy dog.”",
    tokens: ["--gd-font-serif", "--gd-fs-body", "--gd-fw-medium", "--gd-lh-body", "--gd-fg-strong"],
    when: "Generic body-size italic serif — inline citations, attribution, italic emphasis where the serif tone is intentional. Never display-size." },
];

const spacingTokens: { step: string; token: string; px: number; classes?: string[]; note: string }[] = [
  { step: "1",  token: "--gd-space-1",  px: 4,
    classes: [".gd-caption", ".gd-chip", ".gd-chips", ".gd-filebar__cell", ".gd-frame__meta-bot", ".gd-frame__meta-top", ".gd-link", ".gd-link--mono", ".gd-list--ordered", ".gd-pm__meta", ".gd-status"],
    note: "Tightest gap — inline chip metadata, label-to-control offset." },
  { step: "2",  token: "--gd-space-2",  px: 8,
    classes: [".gd-audit-row", ".gd-caption", ".gd-chip", ".gd-field", ".gd-frame__brackets", ".gd-frame__meta-bot", ".gd-frame__meta-top", ".gd-ledger__row--header", ".gd-list", ".gd-phone", ".gd-slider__meta", ".gd-slider__tag--after", ".gd-slider__tag--before", ".gd-stamp", ".gd-status", ".gd-weather"],
    note: "Tight gap — chip-group spacing, dense list rows." },
  { step: "3",  token: "--gd-space-3",  px: 12,
    classes: [".gd-audit-row--total", ".gd-bar", ".gd-caption", ".gd-card", ".gd-card__link", ".gd-filebar__cell", ".gd-frame__meta-bot", ".gd-frame__meta-top", ".gd-input", ".gd-pm", ".gd-quote__cite", ".gd-select", ".gd-slider__meta", ".gd-textarea", ".gd-trust__cell", ".gd-trust__label", ".gd-warranty__shape", ".gd-weather"],
    note: "Comfortable inline gap — column groups inside cards, list items." },
  { step: "4",  token: "--gd-space-4",  px: 16,
    classes: [".gd-bar", ".gd-btn", ".gd-filebar__cell", ".gd-frame__brackets", ".gd-input", ".gd-ledger__row", ".gd-quote", ".gd-quote__cite", ".gd-select", ".gd-stamp", ".gd-textarea", ".gd-topnav__cta", ".gd-warranty", ".gd-warranty__shape"],
    note: "Default container padding and list-row vertical rhythm." },
  { step: "5",  token: "--gd-space-5",  px: 20,
    note: "Sub-block separator inside a section. (No production class consumes this yet — reserved for hero/banner sub-sections.)" },
  { step: "6",  token: "--gd-space-6",  px: 24,
    classes: [".gd-banner__inner", ".gd-bar", ".gd-btn", ".gd-card", ".gd-card--file", ".gd-card--photo", ".gd-card--profile", ".gd-divider", ".gd-ledger__row", ".gd-list", ".gd-slider__tag--after", ".gd-topnav__inner", ".gd-topnav__links", ".gd-trust__cell"],
    note: "Surface-panel padding and sub-section gap." },
  { step: "8",  token: "--gd-space-8",  px: 32,
    classes: [".gd-list--ordered", ".gd-quote", ".gd-slider__grip"],
    note: "Section-internal vertical rhythm — between content blocks." },
  { step: "10", token: "--gd-space-10", px: 40,
    note: "Generous inset for hero copy and banner-style content blocks. (No production class consumes this yet — reserved.)" },
  { step: "12", token: "--gd-space-12", px: 48,
    classes: [".gd-banner", ".gd-image", ".gd-ledger__row", ".gd-pm", ".gd-pm__photo", ".gd-textarea"],
    note: "Major section gap — between two distinct content groupings." },
  { step: "16", token: "--gd-space-16", px: 64,
    classes: [".gd-card--photo", ".gd-card--profile", ".gd-warranty__shape"],
    note: "Page section break — top-level section padding." },
  { step: "20", token: "--gd-space-20", px: 80,
    classes: [".gd-card--photo", ".gd-card--profile"],
    note: "Largest sectional rhythm — used sparingly at page-top hero." },
];

const borderWidths: { key: string; token: string; value: string; classes?: string[]; note: string }[] = [
  { key: "hair", token: "--gd-bw-hair", value: "1px",
    classes: [".gd-audit-row", ".gd-audit-row--total", ".gd-banner", ".gd-btn", ".gd-chip", ".gd-divider", ".gd-filebar", ".gd-filebar__cell", ".gd-frame__brackets", ".gd-image > .gd-ratio", ".gd-frame", ".gd-slider", ".gd-card", ".gd-input", ".gd-ledger", ".gd-ledger__row", ".gd-link", ".gd-pm", ".gd-pm__photo", ".gd-quote", ".gd-quote__cite", ".gd-select", ".gd-slider__handle", ".gd-status", ".gd-textarea", ".gd-topnav", ".gd-trust", ".gd-trust--rich", ".gd-trust__cell", ".gd-weather"],
    note: "Default hairline — every divider, filebar cell, ledger row." },
  { key: "rule", token: "--gd-bw-rule", value: "2px",
    classes: [".gd-stamp", ".gd-warranty__shape"],
    note: "Full rule — section-heading underline, warranty stamp ring, hero stamp." },
];

const ruleColors: { key: string; token: string; value: string; classes?: string[]; note: string }[] = [
  { key: "default", token: "--gd-rule-default", value: "rgba(12,17,23,0.15)",
    classes: [".gd-audit-row", ".gd-audit-row--firstpass", ".gd-chip", ".gd-divider (via --gd-rule)", ".gd-filebar", ".gd-filebar__cell", ".gd-image > .gd-ratio", ".gd-frame", ".gd-slider", ".gd-card", ".gd-ledger__row", ".gd-pm", ".gd-pm__photo", ".gd-quote", ".gd-quote__cite", ".gd-topnav", ".gd-trust", ".gd-trust--rich", ".gd-trust__cell", ".gd-weather"],
    note: "Hairline on light surfaces — divider default." },
  { key: "strong",  token: "--gd-rule-strong",  value: "var(--gd-color-fg-strong)",
    classes: [".gd-btn--ghost", ".gd-input", ".gd-ledger", ".gd-select", ".gd-textarea"],
    note: "Full-strength rule on light surfaces — structural emphasis." },
  { key: "active",  token: "--gd-rule-active",  value: "var(--gd-color-brand)",
    classes: [".gd-btn--ghost", ".gd-input", ".gd-select", ".gd-textarea"],
    note: "Highlight — the one active filebar cell, focus indicators." },
  { key: "dim",     token: "--gd-rule-dim",     value: "rgba(255,255,255,0.16)",
    classes: [".gd-banner", ".gd-divider (via --gd-rule inside .gd-surface--dark)"],
    note: "Hairline on dark surfaces (banner sections, dark hero)." },
];

const radii: { key: string; token: string; value: string; classes?: string[]; note: string }[] = [
  { key: "none", token: "--gd-r-none", value: "0",
    note: "Default — every container, photo, button, card. Sharp by intent; the system is print-flat. (Not consumed explicitly anywhere — sharp corners are the absence of a radius, so no class needs to opt in.)" },
  { key: "full", token: "--gd-r-full", value: "9999px",
    classes: [".gd-slider__grip", ".gd-warranty__shape"],
    note: "Sanctioned circular roles only — currently .gd-slider__grip and .gd-warranty. Both are role-singular per-page elements; never decorative." },
];

const shadows: { key: string; token: string; value: string; classes?: string[]; note: string }[] = [
  { key: "none", token: "--gd-shadow-none", value: "0 0 0 transparent",
    classes: [".gd-btn", ".gd-image > .gd-ratio", ".gd-frame", ".gd-slider", ".gd-card"],
    note: "Default for nearly every surface — print-flat preference." },
  { key: "lift", token: "--gd-shadow-lift", value: "0 1px 0 + 0 8px 24px -16px",
    classes: [".gd-btn:hover", ".gd-image:hover > .gd-ratio", ".gd-frame:hover", ".gd-slider:hover", ".gd-card:hover"],
    note: "Reserved lift — hover-elevated cards, floating dialogs." },
];

const ratioMap = {
  cinema:    "gd-ratio--cinema",
  wide:      "gd-ratio--wide",
  landscape: "gd-ratio--landscape",
  portrait:  "gd-ratio--portrait",
  square:    "gd-ratio--square",
} as const;

type RatioKey = keyof typeof ratioMap;

/* meta = the four corners of .gd-frame in [TL, TR, BL, BR] order. The
   five demos below tell a coherent "audit documentation" story so the
   reader sees how the meta supports varied use cases: an exhibit photo,
   a detail callout, a crew profile, a portrait exhibit, a tight detail
   crop. TL identifies the subject; TR carries date/file/scale/person;
   BL carries the technical line (dimension / phase / role); BR is the
   sequence indicator. */
const aspectRatios: {
  key: RatioKey;
  token: string;
  modifier: string;
  value: string;
  note: string;
  meta: [string, string, string, string];
}[] = [
  { key: "cinema",    token: "--gd-ar-cinema",    modifier: ".gd-ratio--cinema",    value: "21 / 9", note: "Cinema — hero / cinematic banner; widest sanctioned shape.",
    meta: ["EXHIBIT A · PLANO, TX", "08·14·24", "← 38'-2\" → · 2,400 SQ FT", "1 / 5"] },
  { key: "wide",      token: "--gd-ar-wide",      modifier: ".gd-ratio--wide",      value: "16 / 9", note: "Wide — default landscape; in-section photo, slider rail.",
    meta: ["DETAIL · A·04", "SCALE 1:48", "SHINGLE LIFT · PRE-INSTALL", "2 / 5"] },
  { key: "landscape", token: "--gd-ar-landscape", modifier: ".gd-ratio--landscape", value: "4 / 3",  note: "Landscape — editorial photo, gallery thumbnail.",
    meta: ["CREW · DFW", "D. RAMIREZ", "ROOFING PM · EST. 2012", "3 / 5"] },
  { key: "portrait",  token: "--gd-ar-portrait",  modifier: ".gd-ratio--portrait",  value: "3 / 4",  note: "Portrait — vertical / crew / profile imagery.",
    meta: ["EXHIBIT B · FRISCO", "FILE 042", "STONEBROOK · 09·02·24", "4 / 5"] },
  { key: "square",    token: "--gd-ar-square",    modifier: ".gd-ratio--square",    value: "1 / 1",  note: "Square — chip thumbnail, equal-weight grid tile.",
    meta: ["DETAIL · B·11", "MICRO·HAIL", "GRANULE LOSS", "5 / 5"] },
];

const maxWidths: { key: string; token: string; value: string; note: string }[] = [
  { key: "prose", token: "--gd-mw-prose", value: "64ch",  note: "Body-copy max line length. Never wider — readability ceiling." },
  { key: "cta",   token: "--gd-mw-cta",   value: "960px", note: "CTA banner — narrower than page width by intent." },
  { key: "page",  token: "--gd-mw-page",  value: "100%",  note: "Full-bleed page container; horizontal gutters via --gd-pad-x." },
];

const padDemos: { key: string; token: string; value: string; classes?: string[]; note: string }[] = [
  { key: "x",        token: "--gd-pad-x",    value: "clamp(1.5rem, 4vw, 4rem) — 24–64px", classes: [".gd-section"], note: "Fluid page-edge gutter; scales with viewport." },
  { key: "space-2",  token: "--gd-space-2",  value: "0.5rem — 8px",                       note: "Tight inset — chip-like UI (status pills, micro-tags)." },
  { key: "space-4",  token: "--gd-space-4",  value: "1rem — 16px",                        note: "Default container inset — cards, list rows." },
  { key: "space-6",  token: "--gd-space-6",  value: "1.5rem — 24px",                      note: "Comfortable inset — surface panels, prose blocks." },
  { key: "space-10", token: "--gd-space-10", value: "2.5rem — 40px",                      note: "Generous inset — hero copy blocks, banner-style sections." },
];

export default function DesignPage() {
  return (
    <>
      <ReadSection
        id="design"
        title="Design"
        level={1}
        intro="[Intro — what this guide is and how to navigate it.]"
      />

      <ReadSection
        id="colors"
        title="Colors"
        level={2}
        intro="[Section intro — what colors are tokenized and how the system uses them.]"
        whenToUse="Orange (--gd-color-brand) is the system's only chromatic punctuation — used for active state, status, focus, eyebrow color. Never as fill or decoration. --gd-color-success is reserved for the closed-file / success state. Page and section backgrounds are NEVER white — use --gd-color-bg-page (default ground) or --gd-color-bg-warm (warm hero); --gd-color-bg-surface (#fff) is reserved for elevated component surfaces only. Banner-style sections use --gd-color-fg-strong — that is the only structural dark in the system. Text on dark surfaces comes in exactly two tiers: --gd-color-fg-on-dark (primary) and --gd-color-fg-on-dark-dim (secondary); no third tier. Every other color is grayscale or cream; no other chromatic value is permitted anywhere on the site. Components consume foreground colors through context-aware role tokens (--gd-fg, --gd-fg-strong, --gd-fg-muted), never the raw --gd-color-fg* primitives — the shared .gd-surface--dark/.gd-banner/.gd-bar--dark rule re-points those role tokens to the on-dark equivalents so any descendant typography adapts automatically. To flip a section to the dark vocabulary, wrap it in .gd-surface--dark; no per-component overrides required."
      >
        <div className="read-table-card">
          <table className="read-color-table">
              <thead>
                <tr>
                  <th scope="col" className="read-color-table__col-swatch" aria-label="Color swatch" />
                  <th scope="col">Token</th>
                  <th scope="col">Uses</th>
                  <th scope="col">When to use</th>
                </tr>
              </thead>
              <tbody>
                {colorTokens.map(({ key, token, value, usesByCategory, when }) => (
                  <tr key={key}>
                    <td className="read-color-table__swatch" data-color={key} aria-hidden="true" />
                    <td className="read-token-cell">
                      <span className="read-gd-token-lbl">{token}</span>
                      <span className="read-gd-token-value">{value}</span>
                    </td>
                    <td>
                      <UsesCell
                        classes={Object.values(usesByCategory).flat() as string[]}
                      />
                    </td>
                    <td>{when}</td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      </ReadSection>

      <ReadSection
        id="typography"
        title="Typography"
        level={2}
        intro="[Section intro — what typographic primitives are tokenized.]"
        whenToUse="All headings (.gd-display / .gd-h1–.gd-h5) use --gd-font-display (Archivo Narrow) — uppercase, never substituted. Body copy uses --gd-font-body (Work Sans) — sentence-case. --gd-tr-display-tight (-0.005em) is the system's only negative-tracking primitive; applied to .gd-display / .gd-h1–.gd-h3 and to .gd-stat. .gd-h4 / .gd-h5 carry no tracking. .gd-pullquote is the only Newsreader role at display size; .gd-serif is for generic body-size italic only."
      >
        <div className="read-table-card">
          <ReadTypeTable roles={typeRoles} />
        </div>
      </ReadSection>

      <ReadSection
        id="spacing"
        title="Spacing & Padding"
        level={2}
        intro="[Section intro — the spacing scale is the source for every gap, margin, and (composed) padding decision. Padding role tokens compose from the same scale; raw spacing values are also valid as padding directly.]"
        whenToUse="Every gap, margin, or padding value must reference a --gd-space-* token (or a calc() composition of tokens). Literal pixel / rem values in component CSS are a bug. Page-level horizontal gutters always use --gd-pad-x; never substitute a raw spacing value at the page edge."
      >
        <div className="read-table-row">
          <div className="read-table-card">
            <table className="read-primitive-table">
              <thead>
                <tr className="read-primitive-table__section">
                  <th colSpan={4} scope="colgroup">Spacing scale</th>
                </tr>
                <tr>
                  <th scope="col">Demo</th>
                  <th scope="col">Token</th>
                  <th scope="col">Uses</th>
                  <th scope="col">When to use</th>
                </tr>
              </thead>
              <tbody>
                {spacingTokens.map(({ step, token, px, classes, note }) => (
                  <tr key={token}>
                    <td className="read-primitive-table__demo">
                      <i className="read-ruler__bar" data-step={step} aria-hidden="true" />
                    </td>
                    <td className="read-token-cell">
                      <span className="read-gd-token-lbl">{token}</span>
                      <span className="read-gd-token-value">{px} px</span>
                    </td>
                    <td>
                      <UsesCell classes={classes ?? []} />
                    </td>
                    <td className="read-primitive-table__when">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="read-table-card">
            <table className="read-primitive-table">
              <thead>
                <tr className="read-primitive-table__section">
                  <th colSpan={4} scope="colgroup">Padding role tokens</th>
                </tr>
                <tr>
                  <th scope="col">Demo</th>
                  <th scope="col">Token</th>
                  <th scope="col">Uses</th>
                  <th scope="col">When to use</th>
                </tr>
              </thead>
              <tbody>
                {padDemos.map(({ key, token, value, classes, note }) => (
                  <tr key={key}>
                    <td className="read-primitive-table__demo">
                      <div className="read-pad-demo__box" data-pad={key}>
                        <span className="read-pad-demo__fill">content</span>
                      </div>
                    </td>
                    <td className="read-token-cell">
                      <span className="read-gd-token-lbl">{token}</span>
                      <span className="read-gd-token-value">{value}</span>
                    </td>
                    <td>
                      <UsesCell classes={classes ?? []} />
                    </td>
                    <td className="read-primitive-table__when">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="lines"
        title="Lines"
        level={2}
        intro="[Section intro — every horizontal/vertical line in the system. Two widths, four rule colors. Each row shows the value rendered as a free-floating line on the left and as a border around a small surface on the right.]"
        whenToUse="Only two border widths exist: --gd-bw-hair (1px) for every divider, filebar cell, ledger row; --gd-bw-rule (2px) for structural rules (section-heading underlines, warranty stamp, hero stamp). Anything thicker should be a different element entirely. --gd-rule-dim is the only rule color permitted on dark surfaces. --gd-rule-active (orange) marks single-instance highlights only — never a generic decorative rule."
      >
        <div className="read-table-card">
          <table className="read-primitive-table read-primitive-table--no-rules">
            <thead>
              <tr>
                <th scope="col">Line</th>
                <th scope="col">Border</th>
                <th scope="col">Token</th>
                <th scope="col">Uses</th>
                <th scope="col">When to use</th>
              </tr>
            </thead>
            <tbody>
              <tr className="read-primitive-table__section">
                <th colSpan={5} scope="colgroup">Widths</th>
              </tr>
              {borderWidths.map(({ key, token, value, classes, note }) => (
                <tr key={key}>
                  <td className="read-primitive-table__demo">
                    <span className="read-border-demo__bar" data-bw={key} aria-hidden="true" />
                  </td>
                  <td className="read-primitive-table__demo">
                    <span className="read-border-demo__box" data-bw={key} aria-hidden="true" />
                  </td>
                  <td className="read-token-cell">
                    <span className="read-gd-token-lbl">{token}</span>
                    <span className="read-gd-token-value">{value}</span>
                  </td>
                  <td>
                    <UsesCell classes={classes ?? []} />
                  </td>
                  <td className="read-primitive-table__when">{note}</td>
                </tr>
              ))}
              <tr className="read-primitive-table__section">
                <th colSpan={5} scope="colgroup">Rule colors</th>
              </tr>
              {ruleColors.map(({ key, token, value, classes, note }) => (
                <tr key={key}>
                  <td className="read-primitive-table__demo">
                    <span className="read-rule-demo__bar" data-rule={key} aria-hidden="true" />
                  </td>
                  <td className="read-primitive-table__demo">
                    <span className="read-rule-demo__frame" data-rule={key}>
                      <span className="read-rule-demo__box" data-rule={key} aria-hidden="true" />
                    </span>
                  </td>
                  <td className="read-token-cell">
                    <span className="read-gd-token-lbl">{token}</span>
                    <span className="read-gd-token-value">{value}</span>
                  </td>
                  <td>
                    <UsesCell classes={classes ?? []} />
                  </td>
                  <td className="read-primitive-table__when">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ReadSection>

      <ReadSection
        id="radii-shadows"
        title="Radii & Shadows"
        level={2}
        intro="[Section intro — corner radii and elevation shadows. The system is sharp + flat by default; only role-singular elements opt into a circular radius or a lifted shadow.]"
        whenToUse="--gd-r-none (0) is the default — every container, photo, button, card, badge, input, and surface is square-cornered. --gd-r-full (9999px) is reserved exclusively for sanctioned circular roles: .gd-slider__grip (drag affordance) and .gd-warranty (warranty seal). --gd-shadow-none is the default — most pages use it on every surface (the system prefers print-flat). --gd-shadow-lift is reserved for elevated states only: hover-elevated cards, floating dialogs, drag previews. Never decorative; never another shadow value."
      >
        <div className="read-table-row">
          <div className="read-table-card">
            <table className="read-primitive-table">
              <thead>
                <tr className="read-primitive-table__section">
                  <th colSpan={4} scope="colgroup">Radii</th>
                </tr>
                <tr>
                  <th scope="col">Demo</th>
                  <th scope="col">Token</th>
                  <th scope="col">Uses</th>
                  <th scope="col">When to use</th>
                </tr>
              </thead>
              <tbody>
                {radii.map(({ key, token, value, classes, note }) => (
                  <tr key={key}>
                    <td className="read-primitive-table__demo">
                      <div className="read-radius-demo__box" data-r={key} aria-hidden="true" />
                    </td>
                    <td className="read-token-cell">
                      <span className="read-gd-token-lbl">{token}</span>
                      <span className="read-gd-token-value">{value}</span>
                    </td>
                    <td>
                      <UsesCell classes={classes ?? []} />
                    </td>
                    <td className="read-primitive-table__when">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="read-table-card">
            <table className="read-primitive-table">
              <thead>
                <tr className="read-primitive-table__section">
                  <th colSpan={4} scope="colgroup">Shadows</th>
                </tr>
                <tr>
                  <th scope="col">Demo</th>
                  <th scope="col">Token</th>
                  <th scope="col">Uses</th>
                  <th scope="col">When to use</th>
                </tr>
              </thead>
              <tbody>
                {shadows.map(({ key, token, value, classes, note }) => (
                  <tr key={key}>
                    <td className="read-primitive-table__demo">
                      <div className="read-shadow-demo__box" data-shadow={key} aria-hidden="true" />
                    </td>
                    <td className="read-token-cell">
                      <span className="read-gd-token-lbl">{token}</span>
                      <span className="read-gd-token-value">{value}</span>
                    </td>
                    <td>
                      <UsesCell classes={classes ?? []} />
                    </td>
                    <td className="read-primitive-table__when">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="containers"
        title="Containers"
        level={2}
        intro="[Section intro — container max-widths. Three roles; page gutters come from --gd-pad-x.]"
        whenToUse="Body copy never exceeds --gd-mw-prose (64ch) — the readability ceiling. Page containers use --gd-mw-page (100%) with --gd-pad-x gutters; never substitute a raw value for the page width. --gd-mw-cta (960px) is the CTA-banner role and must not be used for general page content."
      >
        <div className="gd-section">
          <div className="read-mw-demo">
            {maxWidths.map(({ key, token, value, note }) => (
              <div className="read-demo-row" key={key}>
                <div className="read-demo-row__labels">
                  <div className="read-gd-tokens">
                    <span className="read-gd-token-lbl">{token}</span>
                  </div>
                  <span className="read-gd-token-value">{value}</span>
                </div>
                <p className="read-section__notes">{note}</p>
                <div className="read-mw-demo__track">
                  <div className="read-mw-demo__bar" data-mw={key} aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="header"
        title="Site header"
        level={2}
        intro="[Section intro — the real top-of-page chrome. A thin dark banner over a light topnav. Collapses to a single compact topnav on scroll.]"
        whenToUse="Exactly one .gd-banner per page, and only at the very top. The banner uses --gd-color-fg-strong (the system's only structural dark) — never invent a second dark. Exactly one .gd-btn (primary CTA) in the header — it is the page's primary action. The scroll transition is transition-based only: max-height + opacity on the banner, padding-block on the topnav, both via --gd-d-base / --gd-ease. Never @keyframes. The weather widget is decorative chrome, never a feature — it carries no interactivity and never grows into a forecast surface. The .gd-phone class powers both renders (banner + topnav-on-scroll); never duplicate the element with bespoke styles. Demo is locked to the rest state so the topbar (.gd-banner) stays visible while you read — the live header at the top of this page is the canonical reference for the scroll-collapse behavior. On scroll: the dark .gd-banner strip collapses (max-height + opacity → 0), the phone migrates into the .gd-topnav next to the CTA, and topnav vertical padding halves from --gd-header-pad-y to --gd-header-pad-y-compact. Phone-icon link has no background and no border by spec."
        tokens={
          <div className="read-gd-tokens">
            <GdClassChip className="gd-site-header" />
            <GdClassChip className="gd-banner" />
            <GdClassChip className="gd-topnav" />
            <GdClassChip className="gd-phone" />
            <GdClassChip className="gd-weather" />
            <span className="read-gd-token-lbl">--gd-header-pad-y</span>
            <span className="read-gd-token-lbl">--gd-header-pad-y-compact</span>
            <span className="read-gd-token-lbl">--gd-banner-pad-y</span>
            <span className="read-gd-token-lbl">--gd-logo-h</span>
            <span className="read-gd-token-lbl">--gd-z-header</span>
          </div>
        }
      >
        <div className="gd-section">
          <SiteHeader embed />
        </div>
      </ReadSection>

      <ReadSection
        id="motion"
        title="Motion"
        level={2}
        intro="[Section intro — every transition in the system, grouped by trigger. Hover the demos to see the motion live; the scroll-collapse motion is best seen on the real site header at the top of the page.]"
        whenToUse="All motion is transition-based. No @keyframes, no scroll-linked animation, no animation libraries — without explicit user approval. --gd-d-fast (120ms) for micro-interactions (button hover, link color shift). --gd-d-base (240ms) for default UI state changes — hover lift on images / cards / frames / sliders, header scroll-collapse. --gd-ease is the one curve, site-wide; never substitute another easing function. The hover-lift treatment (border + shadow + translate at --gd-d-base / --gd-ease) is one rule applied to multiple selectors via a comma-grouped list — any new component that adopts this hover behavior joins the existing selector list, never writes a fifth duplicate rule body."
      >
        <div className="read-table-card">
          <table className="read-primitive-table">
            <thead>
              <tr>
                <th scope="col">Demo</th>
                <th scope="col">Class</th>
                <th scope="col">Tokens</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="read-primitive-table__section">
                <th colSpan={4} scope="colgroup">Hover · micro (fast)</th>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <button type="button" className="gd-btn gd-mono">Hover me</button>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-btn" />
                </td>
                <td className="read-token-cell">
                  <span className="read-gd-token-lbl">--gd-d-fast</span>
                  <span className="read-gd-token-lbl">--gd-ease</span>
                </td>
                <td className="read-primitive-table__when">
                  Background, border, and text color fade to the brand-soft / accent vocabulary on hover. Also gets the base-duration shadow + transform from the lift family (only fast+base mix in the system).
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <a href="#motion" className="gd-link">Hover me</a>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-link" />
                </td>
                <td className="read-token-cell">
                  <span className="read-gd-token-lbl">--gd-d-fast</span>
                  <span className="read-gd-token-lbl">--gd-ease</span>
                </td>
                <td className="read-primitive-table__when">
                  Color shifts from <code>--gd-color-brand</code> to <code>--gd-color-brand-soft</code>.
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <a href="#motion" className="gd-topnav__link gd-mono">Services</a>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-topnav__link" />
                </td>
                <td className="read-token-cell">
                  <span className="read-gd-token-lbl">--gd-d-fast</span>
                  <span className="read-gd-token-lbl">--gd-ease</span>
                </td>
                <td className="read-primitive-table__when">
                  Color shifts from <code>--gd-fg-strong</code> to <code>--gd-color-brand</code>.
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <GdPhone tier="light" />
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-phone" />
                </td>
                <td className="read-token-cell">
                  <span className="read-gd-token-lbl">--gd-d-fast</span>
                  <span className="read-gd-token-lbl">--gd-ease</span>
                </td>
                <td className="read-primitive-table__when">
                  Icon + number color shift to brand on hover. Same fast curve as other micro-hovers.
                </td>
              </tr>

              <tr className="read-primitive-table__section">
                <th colSpan={4} scope="colgroup">Focus (fast)</th>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <input type="text" className="gd-input gd-body" placeholder="Click me" />
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-input" />
                  <GdClassChip className="gd-textarea" />
                  <GdClassChip className="gd-select" />
                </td>
                <td className="read-token-cell">
                  <span className="read-gd-token-lbl">--gd-d-fast</span>
                  <span className="read-gd-token-lbl">--gd-ease</span>
                </td>
                <td className="read-primitive-table__when">
                  Border color fades from <code>--gd-rule-strong</code> to <code>--gd-rule-active</code> (orange) on focus. No custom focus ring — the border IS the focus indicator.
                </td>
              </tr>

              <tr className="read-primitive-table__section">
                <th colSpan={4} scope="colgroup">Hover · lift (base)</th>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <figure className="gd-image read-motion-demo">
                    <div className="gd-ratio gd-ratio--landscape" aria-hidden="true" />
                  </figure>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-image &gt; .gd-ratio" />
                </td>
                <td className="read-token-cell">
                  <span className="read-gd-token-lbl">--gd-d-base</span>
                  <span className="read-gd-token-lbl">--gd-ease</span>
                  <span className="read-gd-token-lbl">--gd-shadow-lift</span>
                  <span className="read-gd-token-lbl">--gd-lift</span>
                </td>
                <td className="read-primitive-table__when">
                  Lift scoped to the image frame only, never the caption. Border + box-shadow + translate.
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <div className="gd-ratio gd-ratio--landscape gd-frame read-motion-demo">
                    <span className="gd-frame__brackets" aria-hidden="true" />
                  </div>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-frame" />
                </td>
                <td className="read-token-cell">
                  <span className="read-gd-token-lbl">--gd-d-base</span>
                  <span className="read-gd-token-lbl">--gd-ease</span>
                  <span className="read-gd-token-lbl">--gd-shadow-lift</span>
                  <span className="read-gd-token-lbl">--gd-lift</span>
                </td>
                <td className="read-primitive-table__when">
                  Same lift family as image. Wraps frame + meta rows as one element.
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <div className="read-motion-demo">
                    <GdSlider ratio="landscape" metaLabel="hover" metaValue="lift" />
                  </div>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-slider" />
                </td>
                <td className="read-token-cell">
                  <span className="read-gd-token-lbl">--gd-d-base</span>
                  <span className="read-gd-token-lbl">--gd-ease</span>
                  <span className="read-gd-token-lbl">--gd-shadow-lift</span>
                  <span className="read-gd-token-lbl">--gd-lift</span>
                </td>
                <td className="read-primitive-table__when">
                  Slider + meta wrap as one. Drag handle moves separately — see the Drag row below.
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <a href="#motion" className="gd-card read-motion-demo">
                    <span className="gd-card__eyebrow gd-eyebrow">Hover me</span>
                    <h3 className="gd-card__title gd-h4">Lift demo</h3>
                  </a>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-card" />
                </td>
                <td className="read-token-cell">
                  <span className="read-gd-token-lbl">--gd-d-base</span>
                  <span className="read-gd-token-lbl">--gd-ease</span>
                  <span className="read-gd-token-lbl">--gd-shadow-lift</span>
                  <span className="read-gd-token-lbl">--gd-lift</span>
                </td>
                <td className="read-primitive-table__when">
                  Card + photo variants both lift on hover. One shared rule via comma-grouped selector with image / frame / slider — never a duplicate rule body.
                </td>
              </tr>

              <tr className="read-primitive-table__section">
                <th colSpan={4} scope="colgroup">Scroll (base)</th>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <span className="read-gd-token-value">scroll the page</span>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-banner" />
                  <GdClassChip className="gd-topnav" />
                  <GdClassChip className="gd-site-header.is-scrolled" />
                </td>
                <td className="read-token-cell">
                  <span className="read-gd-token-lbl">--gd-d-base</span>
                  <span className="read-gd-token-lbl">--gd-ease</span>
                </td>
                <td className="read-primitive-table__when">
                  Header scroll-collapse: banner animates max-height + opacity + border-color to 0; topnav padding-block halves from <code>--gd-header-pad-y</code> to <code>--gd-header-pad-y-compact</code>. State class flipped by a scroll listener at threshold 24px. Scroll the real header at the top of this page to see it.
                </td>
              </tr>

              <tr className="read-primitive-table__section">
                <th colSpan={4} scope="colgroup">Drag (no transition)</th>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <div className="read-motion-demo">
                    <GdSlider ratio="landscape" metaLabel="drag" metaValue="me" />
                  </div>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-slider" />
                  <GdClassChip className="gd-slider__grip" />
                </td>
                <td className="read-token-cell">
                  <span className="read-gd-token-value">none</span>
                </td>
                <td className="read-primitive-table__when">
                  Drag tracks the pointer 1:1 — pointer-driven runtime <code>--gd-slider-pos</code> updates via <code>element.style.setProperty</code>, no transition (transition would add lag to the drag feel). One of three sanctioned runtime custom-property writes in the repo.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ReadSection>

      <ReadSection
        id="images"
        title="Images"
        level={2}
        intro="[Section intro — five sanctioned aspect ratios with three chrome variants. Standard image, dark frame, and before/after slider — all locked to the same ratio vocabulary.]"
        whenToUse="Every image on the site must lock to one of the five aspect-ratio tokens (--gd-ar-cinema, --gd-ar-wide, --gd-ar-landscape, --gd-ar-portrait, --gd-ar-square) via a .gd-ratio--* modifier. Images inside .gd-ratio are always object-fit: cover — they can never stretch or distort. No image may exceed --gd-image-max-h (= 100vh − 2 × section padding − header); when the cap kicks in the entire box shrinks proportionally, the aspect lock is preserved. Attached chrome counts toward the cap: contexts (.gd-image with caption, .gd-card--photo / .gd-card--profile with content stack) set --gd-image-fit-h to subtract their chrome reserve, so the image AND its chrome together fit in the viewport-fit window. The single exception is a photo used as full-bleed background for an entire section. Use .gd-frame as the default frame for any standalone photo — dark fallback surface, orange corner brackets, optional top/bottom meta rows. Use .gd-slider for any before/after comparison; never use it for a simple image gallery."
      >
        <section id="images-standard" aria-labelledby="images-standard-title">
          <header className="read-subsection">
            <div className="read-section__heading">
              <h3 className="read-subsection__title" id="images-standard-title">
                Standard
              </h3>
              <p className="read-section__intro">
                Every image on the site adopts one of the five aspect ratios. <code>.gd-image</code> is the bare figure + caption stack; the ratio is set on the inner <code>.gd-ratio--*</code> div.
              </p>
            </div>
          </header>
          <div className="read-table-card">
            <table className="read-primitive-table read-primitive-table--transposed">
              <thead>
                <tr>
                  <th scope="col" className="read-primitive-table__row-label" aria-hidden="true" />
                  {aspectRatios.map(({ key, value }) => (
                    <th key={key} scope="col">
                      {key.charAt(0).toUpperCase() + key.slice(1)} <span className="read-gd-token-value">{value}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className="read-primitive-table__row-label">Demo</th>
                  {aspectRatios.map(({ key }) => (
                    <td key={key} className="read-primitive-table__demo">
                      <figure className="gd-image">
                        <div className={`gd-ratio ${ratioMap[key]}`} aria-hidden="true" />
                      </figure>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="read-primitive-table__row-label">Token / Class</th>
                  {aspectRatios.map(({ key, token, modifier }) => (
                    <td key={key} className="read-token-cell">
                      <span className="read-gd-token-lbl">{token}</span>
                      <GdClassChip className={modifier.replace(/^./, "")} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="read-primitive-table__row-label">When to use</th>
                  {aspectRatios.map(({ key, note }) => (
                    <td key={key} className="read-primitive-table__when">{note}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="images-frame" aria-labelledby="images-frame-title">
          <header className="read-subsection">
            <div className="read-section__heading">
              <h3 className="read-subsection__title" id="images-frame-title">
                Frame
              </h3>
              <p className="read-section__intro">
                Photo frame at each sanctioned aspect ratio. Dark fallback surface, orange corner brackets, optional top/bottom mono meta rows.
              </p>
            </div>
          </header>
          <div className="read-table-card">
            <table className="read-primitive-table read-primitive-table--transposed">
              <thead>
                <tr>
                  <th scope="col" className="read-primitive-table__row-label" aria-hidden="true" />
                  {aspectRatios.map(({ key, value }) => (
                    <th key={key} scope="col">
                      {key.charAt(0).toUpperCase() + key.slice(1)} <span className="read-gd-token-value">{value}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className="read-primitive-table__row-label">Demo</th>
                  {aspectRatios.map(({ key, meta }) => (
                    <td key={key} className="read-primitive-table__demo">
                      <div className={`gd-ratio ${ratioMap[key]} gd-frame`}>
                        <span className="gd-frame__brackets" aria-hidden="true" />
                        <span className="gd-frame__meta-top gd-mono-xs gd-mono-xs--bold">
                          <span>{meta[0]}</span>
                          <span>{meta[1]}</span>
                        </span>
                        <span className="gd-frame__meta-bot gd-mono-xs gd-mono-xs--bold">
                          <span>{meta[2]}</span>
                          <span>{meta[3]}</span>
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="read-primitive-table__row-label">Token / Class</th>
                  {aspectRatios.map(({ key, token, modifier }) => (
                    <td key={key} className="read-token-cell">
                      <span className="read-gd-token-lbl">{token}</span>
                      <GdClassChip className="gd-frame" />
                      <GdClassChip className={modifier.replace(/^./, "")} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="read-primitive-table__row-label">When to use</th>
                  {aspectRatios.map(({ key, note }) => (
                    <td key={key} className="read-primitive-table__when">{note}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="images-slider" aria-labelledby="images-slider-title">
          <header className="read-subsection">
            <div className="read-section__heading">
              <h3 className="read-subsection__title" id="images-slider-title">
                Slider
              </h3>
              <p className="read-section__intro">
                Before/after comparison overlay at each sanctioned aspect ratio. Orange vertical handle at the 50% line; before/after tags top-left and top-right; bottom mono meta bar.
              </p>
            </div>
          </header>
          <div className="read-table-card">
            <table className="read-primitive-table read-primitive-table--transposed">
              <thead>
                <tr>
                  <th scope="col" className="read-primitive-table__row-label" aria-hidden="true" />
                  {aspectRatios.map(({ key, value }) => (
                    <th key={key} scope="col">
                      {key.charAt(0).toUpperCase() + key.slice(1)} <span className="read-gd-token-value">{value}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className="read-primitive-table__row-label">Demo</th>
                  {aspectRatios.map(({ key, token, value }) => (
                    <td key={key} className="read-primitive-table__demo">
                      <GdSlider
                        ratio={key}
                        metaLabel={token.replace("--gd-ar-", "")}
                        metaValue={value}
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="read-primitive-table__row-label">Token / Class</th>
                  {aspectRatios.map(({ key, token, modifier }) => (
                    <td key={key} className="read-token-cell">
                      <span className="read-gd-token-lbl">{token}</span>
                      <GdClassChip className="gd-slider" />
                      <GdClassChip className={modifier.replace(/^./, "")} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="read-primitive-table__row-label">When to use</th>
                  {aspectRatios.map(({ key, note }) => (
                    <td key={key} className="read-primitive-table__when">{note}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </ReadSection>

      <ReadSection
        id="buttons"
        title="Buttons & Links"
        level={2}
        intro="[Section intro — interactive surfaces. Two button variants and two link variants cover the full interactive vocabulary.]"
        whenToUse=".gd-btn (filled accent) for primary actions — there should rarely be more than one on a page. .gd-btn--ghost (outlined slate) for secondary actions. .gd-link for inline body anchors. .gd-link--mono for mono CTA-style links inside cards or ledger rows. Never invent a third button or fourth link style — if the system can't express a state, the design needs to back up."
      >
        <div className="read-table-card">
          <table className="read-primitive-table">
            <thead>
              <tr>
                <th scope="col">Demo</th>
                <th scope="col">Class</th>
                <th scope="col">When to use</th>
              </tr>
            </thead>
            <tbody>
              <tr className="read-primitive-table__section">
                <th colSpan={3} scope="colgroup">Buttons</th>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <button type="button" className="gd-btn gd-mono">Get a quote</button>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-btn" />
                </td>
                <td className="read-primitive-table__when">
                  Primary action — fills with --gd-color-brand, lifts to --gd-color-brand-soft on hover. Rarely more than one per page.
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <button type="button" className="gd-btn gd-btn--ghost gd-mono">Read more</button>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-btn" />
                  <GdClassChip className="gd-btn--ghost" />
                </td>
                <td className="read-primitive-table__when">
                  Secondary action — slate outline at rest, inverts on hover (muted fill, accent border).
                </td>
              </tr>
              <tr className="read-primitive-table__section">
                <th colSpan={3} scope="colgroup">Links</th>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <a href="#" className="gd-link">Start a new file</a>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-link" />
                </td>
                <td className="read-primitive-table__when">
                  Inline anchor inside body copy — inherits surrounding type; adds accent color + underline only.
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <a href="#" className="gd-link gd-link--mono gd-mono">View case study →</a>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-link" />
                  <GdClassChip className="gd-link--mono" />
                </td>
                <td className="read-primitive-table__when">
                  CTA-style link — mono uppercase. Used inside cards, ledger rows, end-of-section reads-more.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ReadSection>

      <ReadSection
        id="forms"
        title="Form fields"
        level={2}
        intro="[Section intro — text input, textarea, select, label, and field wrapper. Focus state uses the system orange — no custom focus rings.]"
        whenToUse=".gd-input / .gd-textarea / .gd-select share a single visual treatment (hairline strong border, full-width, focus-orange). .gd-label is always mono uppercase. Wrap label + control + optional error in .gd-field for vertical rhythm. Errors use --gd-color-brand (the system's only chromatic signal); never invent a red."
      >
        <div className="read-table-card">
          <table className="read-primitive-table">
            <thead>
              <tr>
                <th scope="col">Demo</th>
                <th scope="col">Class</th>
                <th scope="col">When to use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="read-primitive-table__demo">
                  <div className="gd-field">
                    <label className="gd-label gd-mono-s gd-mono-s--bold" htmlFor="demo-name">Name</label>
                    <input id="demo-name" className="gd-input gd-body" type="text" placeholder="Daniel" />
                  </div>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-field" />
                  <GdClassChip className="gd-label" />
                  <GdClassChip className="gd-input" />
                </td>
                <td className="read-primitive-table__when">
                  Default text input — label sits above the control; focus turns the border accent-orange.
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <div className="gd-field">
                    <label className="gd-label gd-mono-s gd-mono-s--bold" htmlFor="demo-email">Email</label>
                    <input id="demo-email" className="gd-input gd-body" type="email" defaultValue="not-an-email" />
                    <span className="gd-field__error gd-mono-s gd-mono-s--bold">Enter a valid email address.</span>
                  </div>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-field" />
                  <GdClassChip className="gd-input" />
                  <GdClassChip className="gd-field__error" />
                </td>
                <td className="read-primitive-table__when">
                  Input with error message — error uses --gd-color-brand (the system's only chromatic signal); never invent a red.
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <div className="gd-field">
                    <label className="gd-label gd-mono-s gd-mono-s--bold" htmlFor="demo-carrier">Carrier</label>
                    <select id="demo-carrier" className="gd-select gd-body" defaultValue="">
                      <option value="" disabled>Select carrier…</option>
                      <option>State Farm</option>
                      <option>Allstate</option>
                      <option>Travelers</option>
                    </select>
                  </div>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-field" />
                  <GdClassChip className="gd-label" />
                  <GdClassChip className="gd-select" />
                </td>
                <td className="read-primitive-table__when">
                  Single-choice picker — same border treatment as input; native dropdown affordance.
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <div className="gd-field">
                    <label className="gd-label gd-mono-s gd-mono-s--bold" htmlFor="demo-notes">Notes</label>
                    <textarea id="demo-notes" className="gd-textarea gd-body" placeholder="Describe the damage…" />
                  </div>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-field" />
                  <GdClassChip className="gd-label" />
                  <GdClassChip className="gd-textarea" />
                </td>
                <td className="read-primitive-table__when">
                  Multi-line text — sized for short descriptive paragraphs; same border + focus as input.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ReadSection>

      <ReadSection
        id="filebar"
        title="Filebar"
        level={2}
        intro="[Section intro — multi-cell horizontal bar for file metadata. Each cell is a small label + value pair; one value can be active.]"
        whenToUse="Used at the top of file/claim pages and inside file-style cards. Cells divide evenly across the bar width. Exactly one cell value may carry the .gd-filebar__value--active modifier per filebar (system rule — one highlighted cell). Never use it as a generic navbar."
      >
        <div id="filebar-A-cells" className="read-section">
          <div className="read-gd-tokens">
            <GdClassChip className="gd-filebar" />
            <GdClassChip className="gd-filebar__cell" />
            <GdClassChip className="gd-filebar__label" />
            <GdClassChip className="gd-filebar__value" />
            <GdClassChip className="gd-filebar__value--active" />
          </div>
          <p className="read-section__notes">
            5 cells, one active (orange). The active value points at the section currently in focus.
          </p>
        </div>
        <div className="gd-section">
          <div className="gd-filebar">
            <div className="gd-filebar__cell">
              <span className="gd-filebar__label gd-mono-xs gd-mono-xs--bold">File</span>
              <span className="gd-filebar__value gd-mono">042</span>
            </div>
            <div className="gd-filebar__cell">
              <span className="gd-filebar__label gd-mono-xs gd-mono-xs--bold">Date</span>
              <span className="gd-filebar__value gd-mono">08·14·24</span>
            </div>
            <div className="gd-filebar__cell">
              <span className="gd-filebar__label gd-mono-xs gd-mono-xs--bold">Carrier</span>
              <span className="gd-filebar__value gd-mono">State Farm</span>
            </div>
            <div className="gd-filebar__cell">
              <span className="gd-filebar__label gd-mono-xs gd-mono-xs--bold">Status</span>
              <span className="gd-filebar__value gd-filebar__value--active gd-mono">Active</span>
            </div>
            <div className="gd-filebar__cell">
              <span className="gd-filebar__label gd-mono-xs gd-mono-xs--bold">Region</span>
              <span className="gd-filebar__value gd-mono">DFW</span>
            </div>
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="cards"
        title="Cards"
        level={2}
        intro="[Section intro — bordered content block. Standard cards stack eyebrow → title → body → optional mono CTA link. Image cards add a top photo above the same stack, locked to a sanctioned aspect ratio. Lifts on hover, same as images / sliders / frames.]"
        whenToUse=".gd-card for grid-laid project listings, service cards, recent work. Add .gd-card--photo when the card needs an image at the top — composes with .gd-ratio--* to lock the image to one of the sanctioned aspect ratios (cinema / 21:9 is reserved for hero / banner contexts and is never used inside a card). Card slots are optional but their order is fixed: image (if any) → eyebrow → title → body → link."
      >
        <section id="cards-standard" aria-labelledby="cards-standard-title">
          <header className="read-subsection">
            <div className="read-section__heading">
              <h3 className="read-subsection__title" id="cards-standard-title">
                Standard cards
              </h3>
              <p className="read-section__intro">
                Base <code>.gd-card</code> — eyebrow → title → body → optional CTA. No image; the entire stack is type and hairline border. Hover to see the system-wide lift treatment shared with images, frames, and sliders.
              </p>
            </div>
          </header>
          <div id="cards-standard-A-grid" className="read-section">
            <div className="read-gd-tokens">
              <GdClassChip className="gd-card" />
              <GdClassChip className="gd-card__eyebrow" />
              <GdClassChip className="gd-card__title" />
              <GdClassChip className="gd-card__body" />
              <GdClassChip className="gd-card__link" />
            </div>
            <p className="read-section__notes">
              Three cards in a grid — hover any to see the lift treatment shared with images / frames / sliders.
            </p>
          </div>
          <div className="gd-section">
            <div className="read-demo-grid">
              <a href="#" className="gd-card">
                <span className="gd-card__eyebrow gd-eyebrow">Project · 042</span>
                <h3 className="gd-card__title gd-h4">Storm Claim · Plano</h3>
                <p className="gd-card__body gd-body-s">State Farm supplement filed and closed at $28,400 against the carrier's initial $11,800.</p>
                <span className="gd-card__link gd-mono">View case study →</span>
              </a>
              <a href="#" className="gd-card">
                <span className="gd-card__eyebrow gd-eyebrow">Project · 058</span>
                <h3 className="gd-card__title gd-h4">Roof Replacement · DFW</h3>
                <p className="gd-card__body gd-body-s">Full tear-off and replacement on a 28-square commercial property. Carrier accepted on first pass.</p>
                <span className="gd-card__link gd-mono">View case study →</span>
              </a>
              <a href="#" className="gd-card">
                <span className="gd-card__eyebrow gd-eyebrow">Project · 071</span>
                <h3 className="gd-card__title gd-h4">Emergency HVAC · Frisco</h3>
                <p className="gd-card__body gd-body-s">Same-day system failure response. Diagnosed, sourced, replaced — owners had cool air by sunset.</p>
                <span className="gd-card__link gd-mono">View case study →</span>
              </a>
            </div>
          </div>
        </section>

        <section id="cards-image" aria-labelledby="cards-image-title">
          <header className="read-subsection">
            <div className="read-section__heading">
              <h3 className="read-subsection__title" id="cards-image-title">
                Image cards
              </h3>
              <p className="read-section__intro">
                <code>.gd-card--photo</code> with a top image locked to one of the four card-sanctioned aspect ratios. Cinema (21:9) is intentionally excluded — that ratio is reserved for hero / banner contexts, never inside a card.
              </p>
            </div>
          </header>
          <div id="cards-image-A-rail" className="read-section">
            <div className="read-gd-tokens">
              <GdClassChip className="gd-card" />
              <GdClassChip className="gd-card--photo" />
              <GdClassChip className="gd-ratio--wide" />
              <GdClassChip className="gd-ratio--landscape" />
              <GdClassChip className="gd-ratio--portrait" />
              <GdClassChip className="gd-ratio--square" />
            </div>
            <p className="read-section__notes">
              One image card per sanctioned ratio (cinema excluded). Image at top locks to the ratio; the content stack below is identical to the standard card.
            </p>
          </div>
          <div className="gd-section">
            <div className="read-ratio-rail">
              {aspectRatios.filter(({ key }) => key !== "cinema").map(({ key, token, value }) => (
                <div className="read-ratio-rail__cell" key={key}>
                  <a href="#" className="gd-card gd-card--photo">
                    <div className={`gd-ratio ${ratioMap[key]}`} aria-hidden="true" />
                    <span className="gd-card__eyebrow gd-eyebrow">{token.replace("--gd-ar-", "").toUpperCase()} · {value}</span>
                    <h3 className="gd-card__title gd-h4">Project · 042</h3>
                    <p className="gd-card__body gd-body-s">Storm claim, full roof replacement. Supplement filed and closed.</p>
                    <span className="gd-card__link gd-mono">View case study →</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ReadSection>

      <ReadSection
        id="marks"
        title="Marks"
        level={2}
        intro="[Section intro — small visual primitives that decorate templates. Statuses, stamps, seals, dividers — graphic accents you reach for the way you'd reach for an icon.]"
        whenToUse=".gd-status for the file/state indicator — one .gd-status--active per page maximum; the border picks up currentColor automatically, so each --variant changes only the color property. .gd-stamp is the loud editorial mark — never more than one per page; the -12° tilt is the stamp's signature, not a broader rotation scale. .gd-warranty is reserved for genuine warranty / certification claims and is one of two sanctioned circular roles in the system. .gd-divider is the only generic separator — hairline rule with built-in vertical rhythm; not for inside cards or filebars (those have their own hairline structure). Chips (.gd-chips / .gd-chip) are a separate marks family with their own demo treatment — wired in a future pass."
      >
        <div className="read-table-card">
          <table className="read-primitive-table">
            <thead>
              <tr>
                <th scope="col">Demo</th>
                <th scope="col">Class</th>
                <th scope="col">When to use</th>
              </tr>
            </thead>
            <tbody>
              <tr className="read-primitive-table__section">
                <th colSpan={3} scope="colgroup">Status</th>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <span className="gd-status gd-status--closed gd-mono-s gd-mono-s--bold">Closed</span>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-status" />
                  <GdClassChip className="gd-status--closed" />
                </td>
                <td className="read-primitive-table__when">
                  File-closed indicator. Border picks up the color via currentColor.
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <span className="gd-status gd-status--active gd-mono-s gd-mono-s--bold">Active</span>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-status" />
                  <GdClassChip className="gd-status--active" />
                </td>
                <td className="read-primitive-table__when">
                  In-progress indicator — one .gd-status--active per page maximum.
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <span className="gd-status gd-status--filed gd-mono-s gd-mono-s--bold">Filed</span>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-status" />
                  <GdClassChip className="gd-status--filed" />
                </td>
                <td className="read-primitive-table__when">
                  Submitted / pending state. Same shape, different color via currentColor.
                </td>
              </tr>
              <tr className="read-primitive-table__section">
                <th colSpan={3} scope="colgroup">Stamp</th>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <span className="gd-stamp gd-mono-s gd-mono-s--bold">Closed · $28,400</span>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-stamp" />
                </td>
                <td className="read-primitive-table__when">
                  Loud editorial mark — one per page max. The -12° tilt is the stamp's signature.
                </td>
              </tr>
              <tr className="read-primitive-table__section">
                <th colSpan={3} scope="colgroup">Warranty seal</th>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <span className="gd-warranty">
                    <span className="gd-warranty__shape">
                      25
                      <span className="gd-warranty__unit gd-mono-s gd-mono-s--bold">Years</span>
                    </span>
                    <span className="gd-warranty__text gd-h3">
                      Written.
                      <br />
                      Signed.
                    </span>
                  </span>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-warranty" />
                  <GdClassChip className="gd-warranty__shape" />
                  <GdClassChip className="gd-warranty__unit" />
                  <GdClassChip className="gd-warranty__text" />
                </td>
                <td className="read-primitive-table__when">
                  Workmanship / certification seal with side caption. One per page; the round shape is one of two sanctioned circular roles.
                </td>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <span className="gd-warranty">
                    <span className="gd-warranty__shape">
                      10
                      <span className="gd-warranty__unit gd-mono-s gd-mono-s--bold">Year</span>
                    </span>
                  </span>
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-warranty" />
                  <GdClassChip className="gd-warranty__shape" />
                  <GdClassChip className="gd-warranty__unit" />
                </td>
                <td className="read-primitive-table__when">
                  Bare seal without the written caption — when surrounding copy already names the warranty.
                </td>
              </tr>
              <tr className="read-primitive-table__section">
                <th colSpan={3} scope="colgroup">Divider</th>
              </tr>
              <tr>
                <td className="read-primitive-table__demo">
                  <hr className="gd-divider" />
                </td>
                <td className="read-token-cell">
                  <GdClassChip className="gd-divider" />
                </td>
                <td className="read-primitive-table__when">
                  Hairline break between unrelated content blocks. Not for inside cards or filebars — those have their own hairline structure.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ReadSection>

      <ReadSection
        id="ledger"
        title="Ledger"
        level={2}
        intro="[Section intro — tabular row listing for monetary / file / job entries. Header row is muted; body rows mix mono numbers and display titles.]"
        whenToUse="Use for any structured list where each row has the same shape (number, label, money, date, status). Header row uses .gd-ledger__row--header. Hairline rules between rows; no row borders top or bottom outside the container's own."
      >
        <div id="ledger-A-rows" className="read-section">
          <div className="read-gd-tokens">
            <GdClassChip className="gd-ledger" />
            <GdClassChip className="gd-ledger__row" />
            <GdClassChip className="gd-ledger__row--header" />
            <GdClassChip className="gd-ledger__num" />
            <GdClassChip className="gd-ledger__label" />
            <GdClassChip className="gd-ledger__money" />
            <GdClassChip className="gd-ledger__meta" />
          </div>
          <p className="read-section__notes">
            Header + three rows showing the canonical row shape. Columns: number → label → meta → carrier → money.
          </p>
        </div>
        <div className="gd-section">
          <div className="gd-ledger">
            <div className="gd-ledger__row gd-ledger__row--header">
              <span className="gd-mono-s gd-mono-s--bold">File</span>
              <span className="gd-mono-s gd-mono-s--bold">Job</span>
              <span className="gd-mono-s gd-mono-s--bold">Carrier</span>
              <span className="gd-mono-s gd-mono-s--bold">Closed</span>
              <span className="gd-mono-s gd-mono-s--bold">Amount</span>
            </div>
            <div className="gd-ledger__row">
              <span className="gd-ledger__num gd-mono">042</span>
              <span className="gd-ledger__label gd-h5">Storm Claim · Plano</span>
              <span className="gd-ledger__meta gd-mono">State Farm</span>
              <span className="gd-ledger__meta gd-mono">08·14·24</span>
              <span className="gd-ledger__money gd-h5">$28,400</span>
            </div>
            <div className="gd-ledger__row">
              <span className="gd-ledger__num gd-mono">058</span>
              <span className="gd-ledger__label gd-h5">Roof Replacement · DFW</span>
              <span className="gd-ledger__meta gd-mono">Allstate</span>
              <span className="gd-ledger__meta gd-mono">07·02·24</span>
              <span className="gd-ledger__money gd-h5">$42,100</span>
            </div>
            <div className="gd-ledger__row">
              <span className="gd-ledger__num gd-mono">071</span>
              <span className="gd-ledger__label gd-h5">Emergency HVAC · Frisco</span>
              <span className="gd-ledger__meta gd-mono">Travelers</span>
              <span className="gd-ledger__meta gd-mono">06·19·24</span>
              <span className="gd-ledger__money gd-h5">$11,800</span>
            </div>
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="audit"
        title="Audit row"
        level={2}
        intro="[Section intro — tabular line-item rows for itemized estimates / supplements / audit cards. Pairs a label and a numeric value per row, with first-pass / total / uplift variants.]"
        whenToUse="Compose .gd-mono-data on the row for the tabular-data typography (mixed-case mono, regular weight, ink color, tight 0.04em tracking). Value cells compose .gd-mono-data--semibold for numeric emphasis. Total rows add .gd-mono-data--l for body-size; uplift rows compose .gd-mono-data--bold .gd-mono-data--uppercase. The slot CSS carries only layout, dividers, color, and the firstpass strikethrough — every font property comes from .gd-mono-data and its modifiers."
        tokens={
          <div className="read-gd-tokens">
            <GdClassChip className="gd-audit-row" />
            <GdClassChip className="gd-audit-row--firstpass" />
            <GdClassChip className="gd-audit-row--total" />
            <GdClassChip className="gd-audit-row--uplift" />
            <GdClassChip className="gd-audit-row__label" />
            <GdClassChip className="gd-audit-row__value" />
            <GdClassChip className="gd-mono-data" />
            <GdClassChip className="gd-mono-data--l" />
            <GdClassChip className="gd-mono-data--semibold" />
            <GdClassChip className="gd-mono-data--bold" />
            <GdClassChip className="gd-mono-data--uppercase" />
          </div>
        }
      >
        <div className="gd-section">
          <div className="gd-audit-row gd-audit-row--firstpass gd-mono-data">
            <span className="gd-audit-row__label">First-pass estimate</span>
            <span className="gd-audit-row__value gd-mono-data--semibold">$14,200</span>
          </div>
          <div className="gd-audit-row gd-mono-data">
            <span className="gd-audit-row__label">+ Decking, rotted (8 sheets)</span>
            <span className="gd-audit-row__value gd-mono-data--semibold">$2,400</span>
          </div>
          <div className="gd-audit-row gd-mono-data">
            <span className="gd-audit-row__label">+ Synthetic underlayment</span>
            <span className="gd-audit-row__value gd-mono-data--semibold">$3,800</span>
          </div>
          <div className="gd-audit-row gd-mono-data">
            <span className="gd-audit-row__label">+ Ridge venting, code</span>
            <span className="gd-audit-row__value gd-mono-data--semibold">$1,600</span>
          </div>
          <div className="gd-audit-row gd-mono-data">
            <span className="gd-audit-row__label">+ Code upgrade, ice &amp; water</span>
            <span className="gd-audit-row__value gd-mono-data--semibold">$6,400</span>
          </div>
          <div className="gd-audit-row gd-audit-row--total gd-mono-data gd-mono-data--l">
            <span className="gd-audit-row__label gd-mono-data--bold gd-mono-data--uppercase">Closed file</span>
            <span className="gd-audit-row__value gd-mono-data--bold">$28,400</span>
          </div>
          <div className="gd-audit-row gd-audit-row--uplift gd-mono-data gd-mono-data--bold gd-mono-data--uppercase">
            <span className="gd-audit-row__label">Supplement uplift</span>
            <span className="gd-audit-row__value">+ $14,200 · 100%</span>
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="quotes"
        title="Quotes"
        level={2}
        intro="[Section intro — bordered pull-quote block with orange opening mark and a mono citation row. Quote body uses .gd-pullquote (the existing serif role).]"
        whenToUse="Use .gd-quote for testimonials, customer quotes, and editorial pull-outs that need a self-contained box. The mark, body, and citation are all required slots. For inline italic emphasis inside prose, use .gd-serif (without the .gd-quote wrapper)."
      >
        <div id="quotes-A-pull" className="read-section">
          <div className="read-gd-tokens">
            <GdClassChip className="gd-quote" />
            <GdClassChip className="gd-quote__mark" />
            <GdClassChip className="gd-pullquote" />
            <GdClassChip className="gd-quote__cite" />
          </div>
          <p className="read-section__notes">
            Bordered quote with orange opening mark, pull-quote body, and mono citation footer.
          </p>
        </div>
        <div className="gd-section">
          <blockquote className="gd-quote">
            <span className="gd-quote__mark">“</span>
            <p className="gd-pullquote">Daniel walked the roof with the adjuster, filed the supplements, and we closed at $28,400. Same number when a shingle went sideways in year three.</p>
            <footer className="gd-quote__cite gd-mono-s gd-mono-s--bold">
              <span>Maria K. · Homeowner</span>
              <span>Plano · 2024</span>
            </footer>
          </blockquote>
        </div>
      </ReadSection>

      <ReadSection
        id="trust"
        title="Trust grid"
        level={2}
        intro="[Section intro — bordered horizontal row of stat cells. Used for at-a-glance credibility (years in business, files closed, carriers handled).]"
        whenToUse="Use for compact metric / credential rows. 2–4 cells typical; more than 5 starts to crowd. Label sits above value in each cell. Never mix marketing copy into a trust cell — these are bare metrics."
      >
        <div id="trust-A-strip" className="read-section">
          <div className="read-gd-tokens">
            <GdClassChip className="gd-trust" />
            <GdClassChip className="gd-trust__cell" />
            <GdClassChip className="gd-trust__label" />
            <GdClassChip className="gd-stat" />
          </div>
          <p className="read-section__notes">
            Three cells, mono label over display value. Cells divide evenly across the bar width.
          </p>
        </div>
        <div className="gd-section">
          <div className="gd-trust">
            <div className="gd-trust__cell">
              <span className="gd-trust__label gd-mono-s gd-mono-s--bold">Years in business</span>
              <span className="gd-stat">12</span>
            </div>
            <div className="gd-trust__cell">
              <span className="gd-trust__label gd-mono-s gd-mono-s--bold">Files closed</span>
              <span className="gd-stat">240+</span>
            </div>
            <div className="gd-trust__cell">
              <span className="gd-trust__label gd-mono-s gd-mono-s--bold">Carriers handled</span>
              <span className="gd-stat">6</span>
            </div>
          </div>
        </div>

        <div id="trust-B-rich" className="read-section">
          <div className="read-gd-tokens">
            <GdClassChip className="gd-trust--rich" />
            <GdClassChip className="gd-trust__body" />
            <GdClassChip className="gd-trust__cell" />
            <GdClassChip className="gd-trust__label" />
            <GdClassChip className="gd-bar" />
            <GdClassChip className="gd-bar--dark" />
          </div>
          <p className="read-section__notes">
            Consolidated variant — dark mono meta-bar on top, three rich cells underneath. Each cell stacks a mono label and arbitrary primitives: <code>.gd-pm</code> rows, the <code>.gd-warranty</code> seal, a <code>.gd-chips</code> group. Same <code>.gd-trust</code> shell as the stat strip above; the <code>--rich</code> modifier switches the layout to a vertical stack with the bar on top.
          </p>
        </div>
        <div className="gd-section">
          <div className="gd-trust gd-trust--rich">
              <div className="gd-bar gd-bar--dark gd-mono-s gd-mono-s--bold">
                <span>Exhibit B · Standing</span>
                <span>03 Entries</span>
                <span>On file since 2010</span>
              </div>
              <div className="gd-trust__body">
                <div className="gd-trust__cell">
                  <span className="gd-trust__label gd-mono-s gd-mono-s--bold">Who runs your job</span>
                  <div className="gd-pm">
                    <div className="gd-pm__photo" aria-hidden="true" />
                    <span className="gd-pm__meta gd-mono-s gd-mono-s--bold">
                      <span className="gd-pm__name">Daniel R.</span>
                      <span className="gd-pm__title">Roofing · DFW · 12 yr</span>
                    </span>
                  </div>
                  <div className="gd-pm">
                    <div className="gd-pm__photo" aria-hidden="true" />
                    <span className="gd-pm__meta gd-mono-s gd-mono-s--bold">
                      <span className="gd-pm__name">Jorge M.</span>
                      <span className="gd-pm__title">Remodel · DFW · 9 yr</span>
                    </span>
                  </div>
                  <div className="gd-pm">
                    <div className="gd-pm__photo" aria-hidden="true" />
                    <span className="gd-pm__meta gd-mono-s gd-mono-s--bold">
                      <span className="gd-pm__name">Mike T.</span>
                      <span className="gd-pm__title">Cleveland · 7 yr</span>
                    </span>
                  </div>
                </div>
                <div className="gd-trust__cell">
                  <span className="gd-trust__label gd-mono-s gd-mono-s--bold">Workmanship warranty</span>
                  <span className="gd-warranty">
                    <span className="gd-warranty__shape">
                      25
                      <span className="gd-warranty__unit gd-mono-s gd-mono-s--bold">Years</span>
                    </span>
                    <span className="gd-warranty__text gd-h3">
                      Written.
                      <br />
                      Signed.
                    </span>
                  </span>
                  <p className="gd-body-s">
                    <b>Roof workmanship · 25 yr</b>
                    <br />
                    Remodel workmanship · 5 yr
                    <br />
                    Same number, year 25.
                  </p>
                </div>
                <div className="gd-trust__cell">
                  <span className="gd-trust__label gd-mono-s gd-mono-s--bold">Carriers we file with</span>
                  <div className="gd-chips">
                    <span className="gd-chip gd-mono-s gd-mono-s--bold">State Farm</span>
                    <span className="gd-chip gd-mono-s gd-mono-s--bold">Allstate</span>
                    <span className="gd-chip gd-mono-s gd-mono-s--bold">Travelers</span>
                    <span className="gd-chip gd-mono-s gd-mono-s--bold">USAA</span>
                    <span className="gd-chip gd-mono-s gd-mono-s--bold">Progressive</span>
                    <span className="gd-chip gd-mono-s gd-mono-s--bold">Nationwide</span>
                    <span className="gd-chip gd-mono-s gd-mono-s--bold">Liberty Mutual</span>
                    <span className="gd-chip gd-mono-s gd-mono-s--bold">Farmers</span>
                  </div>
                  <p className="gd-body-s">Eight carriers, every quirk on file. We write supplements. Carriers see them weekly.</p>
                </div>
              </div>
            </div>
          </div>
      </ReadSection>

      <ReadSection
        id="lists"
        title="Lists"
        level={2}
        intro="[Section intro — body-typography ordered and unordered lists. Unordered uses an orange em-dash; ordered uses mono leading-zero numbers in accent.]"
        whenToUse="Apply .gd-list to any <ul>. Add .gd-list--ordered to any <ol>. Both share body typography. Don't nest lists more than one level deep — if you need deeper hierarchy, restructure the content into headed sections instead."
      >
        <div id="lists-A-ul" className="read-section">
          <div className="read-gd-tokens">
            <GdClassChip className="gd-list" />
          </div>
          <p className="read-section__notes">
            Unordered list — orange em-dash marker for each item.
          </p>
        </div>
        <div className="gd-section">
          <ul className="gd-list gd-body-s">
            <li>Insurance supplement filed within 48 hours of inspection.</li>
            <li>Direct-to-carrier communication; no homeowner translation tax.</li>
            <li>Closed-file audit on every job at the 30-day mark.</li>
            <li>Lifetime workmanship warranty, transferable on sale.</li>
          </ul>
        </div>

        <div id="lists-B-ol" className="read-section">
          <div className="read-gd-tokens">
            <GdClassChip className="gd-list" />
            <GdClassChip className="gd-list--ordered" />
          </div>
          <p className="read-section__notes">
            Ordered list — mono leading-zero numbers (01, 02, 03 …) in accent color.
          </p>
        </div>
        <div className="gd-section">
          <ol className="gd-list gd-list--ordered gd-body-s">
            <li>Schedule a roof inspection — no obligation, no high-pressure walkthrough.</li>
            <li>We document damage and file the supplement with your carrier.</li>
            <li>Carrier issues a revised estimate; we walk you through it line by line.</li>
            <li>Work begins on your timeline, not the adjuster's.</li>
          </ol>
        </div>
      </ReadSection>

      <ReadSection
        id="pm-listing"
        title="PM listing"
        level={2}
        intro="[Section intro — dense person-row listing. Square portrait on the left, name + role meta beside.]"
        whenToUse="Use .gd-pm for team / project-manager / contact rows in dense layouts (sidebars, &quot;who's on this file&quot; sections). For full-card profile presentation, use .gd-card--profile instead. Each row has a hairline divider below it (suppressed on the last row); rows stack flush, no extra gap needed."
      >
        <div id="pm-listing-A-rows" className="read-section">
          <div className="read-gd-tokens">
            <GdClassChip className="gd-pm" />
            <GdClassChip className="gd-pm__photo" />
            <GdClassChip className="gd-pm__meta" />
            <GdClassChip className="gd-pm__name" />
            <GdClassChip className="gd-pm__title" />
          </div>
          <p className="read-section__notes">
            Four people-rows. Each row: 48px square portrait + 2-row mono meta — name (strong) on top, title / role (muted) below.
          </p>
        </div>
        <div className="gd-section">
          <div className="gd-pm">
            <div className="gd-pm__photo" aria-hidden="true" />
            <span className="gd-pm__meta gd-mono-s gd-mono-s--bold">
              <span className="gd-pm__name">Daniel R.</span>
              <span className="gd-pm__title">Project Manager</span>
            </span>
          </div>
          <div className="gd-pm">
            <div className="gd-pm__photo" aria-hidden="true" />
            <span className="gd-pm__meta gd-mono-s gd-mono-s--bold">
              <span className="gd-pm__name">Lisa C.</span>
              <span className="gd-pm__title">Claims Coordinator</span>
            </span>
          </div>
          <div className="gd-pm">
            <div className="gd-pm__photo" aria-hidden="true" />
            <span className="gd-pm__meta gd-mono-s gd-mono-s--bold">
              <span className="gd-pm__name">André T.</span>
              <span className="gd-pm__title">Roofing Lead</span>
            </span>
          </div>
          <div className="gd-pm">
            <div className="gd-pm__photo" aria-hidden="true" />
            <span className="gd-pm__meta gd-mono-s gd-mono-s--bold">
              <span className="gd-pm__name">Marisol P.</span>
              <span className="gd-pm__title">Office &amp; Scheduling</span>
            </span>
          </div>
        </div>
      </ReadSection>
    </>
  );
}
