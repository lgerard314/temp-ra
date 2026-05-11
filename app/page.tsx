import type { ReactNode } from "react";
import { ReadSection } from "@/app/_components/ReadSection";
import { GdSlider } from "@/app/_components/GdSlider";
import { SiteHeader } from "@/app/_components/SiteHeader";
import { ReadTypeRow } from "@/app/_components/ReadTypeRow";

/* Ordered by visual similarity so adjacent rows in the colors table read
   as a coherent group, not a checklist:
     1. Light grounds — page / warm / mute (page & section backgrounds)
     2. Surface       — pure-white elevated component ground (special role)
     3. Dark fg tones — fg-strong / fg / fg-muted (text + structural dark)
     4. On-dark tiers — fg-on-dark / fg-on-dark-dim (text on dark surfaces)
     5. Accent        — accent / accent-soft (the system's single chroma)
     6. Status        — success (reserved closed/success state) */
type ColorUse = "typography" | "lines" | "shadows" | "accents" | "statuses" | "backgrounds";

const colorTokens: { key: string; token: string; value: string; classes?: string[]; uses: ColorUse[]; when: string }[] = [
  { key: "bg-page",     token: "--gd-color-bg-page",     value: "#fafaf6",
    classes: [".gd-card", ".gd-site-header", ".gd-topnav"],
    uses: ["backgrounds"],
    when: "Background — primary page ground." },
  { key: "bg-warm",     token: "--gd-color-bg-warm",     value: "#f0eee6",
    uses: ["backgrounds"],
    when: "Background — warm hero / featured sections. (No production class consumes this yet — reserved for warm-ground sections.)" },
  { key: "bg-mute",     token: "--gd-color-bg-mute",     value: "#e6e8e6",
    classes: [".gd-btn--ghost", ".gd-ledger__row--header", ".gd-pm__photo", ".gd-ratio"],
    uses: ["backgrounds", "lines"],
    when: "Background or border — quiet fills and hairline dividers." },
  { key: "bg-surface",  token: "--gd-color-bg-surface",  value: "#ffffff",
    classes: [".gd-btn", ".gd-filebar", ".gd-ledger", ".gd-quote", ".gd-select", ".gd-slider", ".gd-slider__grip", ".gd-slider__meta", ".gd-slider__tag", ".gd-trust"],
    uses: ["backgrounds"],
    when: "Background — elevated component surfaces only (cards, ledger, filebar, inputs, quote). Never a page or section background — page/section grounds use --gd-color-bg-page or --gd-color-bg-warm." },
  { key: "fg-strong",   token: "--gd-color-fg-strong",   value: "#0c1117",
    classes: [".gd-banner", ".gd-bar--dark", ".gd-btn--ghost", ".gd-card__title", ".gd-filebar__value", ".gd-frame", ".gd-h2", ".gd-h2-display", ".gd-h4", ".gd-label", ".gd-ledger__label", ".gd-ledger__money", ".gd-phone", ".gd-pm__name", ".gd-serif", ".gd-slider", ".gd-slider__layer--before", ".gd-slider__meta", ".gd-status--active", ".gd-surface--dark", ".gd-topnav__link", ".gd-trust__value", ".gd-warranty__text", ".gd-weather__temp"],
    uses: ["typography", "backgrounds"],
    when: "Typography — structural headers and emphasis. Also a background — banner-style sections." },
  { key: "bg-dark", token: "--gd-color-bg-dark", value: "#161a1f",
    uses: ["backgrounds"],
    when: "Reserved alt dark surface — held for cases that need to read as distinctly different from --gd-color-fg-strong while still in the dark vocabulary. NEVER substituted for --gd-color-fg-strong on banner / structural surfaces; pick one and stay with it. No production class consumes this yet." },
  { key: "fg",          token: "--gd-color-fg",          value: "#1d242d",
    classes: [".gd-body-s", ".gd-card__body", ".gd-chip", ".gd-ledger__meta", ".gd-list", ".gd-select"],
    uses: ["typography"],
    when: "Typography — body text." },
  { key: "fg-muted",    token: "--gd-color-fg-muted",    value: "#5a6168",
    classes: [".gd-caption", ".gd-filebar__label", ".gd-ledger__num", ".gd-ledger__row--header", ".gd-mono-s", ".gd-pm__meta", ".gd-pm__title", ".gd-quote__cite", ".gd-slider__layer--after", ".gd-status", ".gd-trust__label", ".gd-weather", ".gd-weather__label"],
    uses: ["typography", "lines"],
    when: "Typography or border — secondary text and dividers." },
  { key: "fg-on-dark",     token: "--gd-color-fg-on-dark",     value: "rgba(255,255,255,0.85)",
    classes: [".gd-banner", ".gd-bar--dark", ".gd-frame__meta-top", ".gd-phone--on-dark"],
    uses: ["typography"],
    when: "Typography on dark surfaces — primary readable text." },
  { key: "fg-on-dark-dim", token: "--gd-color-fg-on-dark-dim", value: "rgba(255,255,255,0.7)",
    classes: [".gd-banner__meta", ".gd-frame__meta-bot"],
    uses: ["typography"],
    when: "Typography on dark surfaces — dimmed/secondary text." },
  { key: "accent",      token: "--gd-color-brand",      value: "#fb6a1d",
    classes: [".gd-accent", ".gd-btn", ".gd-btn--ghost", ".gd-caption-meta", ".gd-card__eyebrow", ".gd-card__link", ".gd-eyebrow", ".gd-field__error", ".gd-filebar__value--active", ".gd-frame__brackets", ".gd-link", ".gd-list", ".gd-list--ordered", ".gd-phone", ".gd-phone--on-dark", ".gd-quote__mark", ".gd-slider__grip", ".gd-slider__handle", ".gd-slider__meta-num", ".gd-stamp", ".gd-status--active", ".gd-topnav__link", ".gd-warranty__shape", ".gd-weather__icon"],
    uses: ["accents", "typography", "statuses", "lines", "backgrounds"],
    when: "Accent — the single chromatic highlight; active states, status, focus emphasis." },
  { key: "accent-soft", token: "--gd-color-brand-soft", value: "#ff8442",
    classes: [".gd-btn", ".gd-link"],
    uses: ["accents"],
    when: "Accent — softer hover variant of --gd-color-brand. Never used at rest." },
  { key: "success",     token: "--gd-color-success",     value: "#1a4a1a",
    classes: [".gd-status--closed"],
    uses: ["statuses"],
    when: "Status — success / “closed” state. Reserved; never a generic green." },
];

const USE_LABELS: Record<ColorUse, string> = {
  typography: "Type",
  lines: "Lines",
  shadows: "Shadows",
  accents: "Accents",
  statuses: "Statuses",
  backgrounds: "Bgs",
};

const typeRoles: {
  className: string;
  sample: ReactNode;
  tokens: string[];
  when: string;
}[] = [
  { className: "gd-display",   sample: <>The quick <span className="gd-accent">brown fox</span></>, tokens: ["--gd-font-display", "--gd-fs-display", "--gd-fw-bold", "--gd-lh-display", "--gd-fg-strong"],
    when: "Hero display headline — page-opening titles only. At most one per page." },
  { className: "gd-h1",        sample: "The quick brown fox", tokens: ["--gd-font-display", "--gd-fs-h1", "--gd-fw-bold", "--gd-lh-display", "--gd-fg-strong"],
    when: "Page-level primary heading. Exactly one per page." },
  { className: "gd-h2-display", sample: <>The quick <span className="gd-accent">brown fox</span></>, tokens: ["--gd-font-display", "--gd-fs-h2-display", "--gd-fw-bold", "--gd-lh-display", "--gd-fg-strong"],
    when: "Semantic <h2> promoted to display size — use when an h2 needs hero-level prominence (landing-section openers). Size tracks --gd-fs-h1." },
  { className: "gd-h2",        sample: "The quick brown fox jumps", tokens: ["--gd-font-display", "--gd-fs-h2", "--gd-fw-bold", "--gd-lh-heading", "--gd-fg-strong"],
    when: "Section heading — the primary in-section title." },
  { className: "gd-h3",        sample: "The quick brown fox jumps over the lazy dog", tokens: ["--gd-font-display", "--gd-fs-h3", "--gd-fw-semibold", "--gd-lh-heading", "--gd-fg-strong"],
    when: "Subsection heading inside a section." },
  { className: "gd-h4",        sample: "The quick brown fox jumps over the lazy dog", tokens: ["--gd-font-display", "--gd-fs-h4", "--gd-fw-semibold", "--gd-lh-heading", "--gd-fg-strong"],
    when: "Smallest heading — labels content within a subsection. Never substituted for body copy despite the close pixel size to --gd-fs-body-l; the display family + uppercase + semibold make the role distinct." },
  { className: "gd-body-l",    sample: "The quick brown fox jumps over the lazy dog and lopes back home before sunset.", tokens: ["--gd-font-body", "--gd-fs-body-l", "--gd-fw-medium", "--gd-lh-body", "--gd-fg"],
    when: "Large body — intro paragraphs and lead sentences. Body family; never substituted for .gd-h4." },
  { className: "gd-body",      sample: "The quick brown fox jumps over the lazy dog and lopes back home before sunset.", tokens: ["--gd-font-body", "--gd-fs-body", "--gd-fw-regular", "--gd-lh-body", "--gd-fg"],
    when: "Default body copy — the workhorse for prose paragraphs." },
  { className: "gd-body-s",    sample: "The quick brown fox jumps over the lazy dog and lopes back home before sunset.", tokens: ["--gd-font-body", "--gd-fs-body-s", "--gd-fw-regular", "--gd-lh-body", "--gd-fg"],
    when: "Small body — captions, meta text, or fine print within a body context." },
  { className: "gd-mono",      sample: "STATUS · 240924 · OPEN", tokens: ["--gd-font-mono", "--gd-fs-mono", "--gd-fw-bold", "--gd-lh-body", "--gd-tr-mono", "--gd-fg-muted"],
    when: "Mono labels — file numbers, status text, tabular meta. Casing is set by the consuming component class." },
  { className: "gd-mono-s",    sample: "STATUS · 240924 · OPEN", tokens: ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-lh-body", "--gd-tr-mono", "--gd-fg-muted"],
    when: "Smaller mono — secondary meta annotations (filebar values, ledger meta, caption-meta)." },
  { className: "gd-eyebrow",   sample: "RE: STORM CLAIM · PLANO", tokens: ["--gd-font-mono", "--gd-fs-mono-s", "--gd-fw-bold", "--gd-lh-body", "--gd-tr-mono-wide", "--gd-color-brand"],
    when: "Section eyebrow — mono uppercase label sitting above a heading. The ONLY role that uses --gd-tr-mono-wide (0.22em); never substitute for .gd-mono-s." },
  { className: "gd-pullquote", sample: "“The quick brown fox jumps over the lazy dog.”", tokens: ["--gd-font-serif", "--gd-fs-pullquote", "--gd-fw-medium", "--gd-lh-pullquote", "--gd-fg-strong"],
    when: "Pull-quote — large italic serif for emphasized quotations. The ONLY Newsreader role at display size; never substituted for body italic." },
  { className: "gd-serif",     sample: "“The quick brown fox jumps over the lazy dog.”", tokens: ["--gd-font-serif", "--gd-fs-body", "--gd-fw-medium", "--gd-lh-body", "--gd-fg-strong"],
    when: "Generic body-size italic serif — inline citations, attribution, italic emphasis where the serif tone is intentional. Never display-size." },
];

const spacingTokens: { step: string; token: string; px: number }[] = [
  { step: "1",  token: "--gd-space-1",  px: 4   },
  { step: "2",  token: "--gd-space-2",  px: 8   },
  { step: "3",  token: "--gd-space-3",  px: 12  },
  { step: "4",  token: "--gd-space-4",  px: 16  },
  { step: "5",  token: "--gd-space-5",  px: 20  },
  { step: "6",  token: "--gd-space-6",  px: 24  },
  { step: "8",  token: "--gd-space-8",  px: 32  },
  { step: "10", token: "--gd-space-10", px: 40  },
  { step: "12", token: "--gd-space-12", px: 48  },
  { step: "16", token: "--gd-space-16", px: 64  },
  { step: "20", token: "--gd-space-20", px: 80  },
];

const borderWidths: { key: string; token: string; value: string; note: string }[] = [
  { key: "hair", token: "--gd-bw-hair", value: "1px", note: "Default hairline — every divider, filebar cell, ledger row." },
  { key: "rule", token: "--gd-bw-rule", value: "2px", note: "Full rule — section-heading underline, warranty stamp ring, hero stamp." },
];

const ruleColors: { key: string; token: string; value: string; note: string }[] = [
  { key: "default", token: "--gd-rule-default", value: "rgba(12,17,23,0.15)", note: "Hairline on light surfaces — divider default." },
  { key: "strong",  token: "--gd-rule-strong",  value: "var(--gd-color-fg-strong)", note: "Full-strength rule on light surfaces — structural emphasis." },
  { key: "active",  token: "--gd-rule-active",  value: "var(--gd-color-brand)", note: "Highlight — the one active filebar cell, focus indicators." },
  { key: "dim",     token: "--gd-rule-dim",     value: "rgba(255,255,255,0.16)", note: "Hairline on dark surfaces (banner sections, dark hero)." },
];

const radii: { key: string; token: string; value: string; note: string }[] = [
  { key: "none", token: "--gd-r-none", value: "0",      note: "Default — every container, photo, button, card. Sharp by intent; the system is print-flat." },
  { key: "full", token: "--gd-r-full", value: "9999px", note: "Sanctioned circular roles only — currently .gd-slider__grip and .gd-warranty. Both are role-singular per-page elements; never decorative." },
];

const shadows: { key: string; token: string; value: string; note: string }[] = [
  { key: "none", token: "--gd-shadow-none", value: "0 0 0 transparent", note: "Default for nearly every surface — print-flat preference." },
  { key: "lift", token: "--gd-shadow-lift", value: "0 1px 0 + 0 8px 24px -16px",      note: "Reserved lift — hover-elevated cards, floating dialogs." },
];

const ratioMap = {
  cinema:    "gd-ratio--cinema",
  wide:      "gd-ratio--wide",
  landscape: "gd-ratio--landscape",
  portrait:  "gd-ratio--portrait",
  square:    "gd-ratio--square",
} as const;

type RatioKey = keyof typeof ratioMap;

const aspectRatios: { key: RatioKey; token: string; modifier: string; value: string; note: string }[] = [
  { key: "cinema",    token: "--gd-ar-cinema",    modifier: ".gd-ratio--cinema",    value: "21 / 9", note: "Cinema — hero / cinematic banner; widest sanctioned shape." },
  { key: "wide",      token: "--gd-ar-wide",      modifier: ".gd-ratio--wide",      value: "16 / 9", note: "Wide — default landscape; in-section photo, slider rail." },
  { key: "landscape", token: "--gd-ar-landscape", modifier: ".gd-ratio--landscape", value: "4 / 3",  note: "Landscape — editorial photo, gallery thumbnail." },
  { key: "portrait",  token: "--gd-ar-portrait",  modifier: ".gd-ratio--portrait",  value: "3 / 4",  note: "Portrait — vertical / crew / profile imagery." },
  { key: "square",    token: "--gd-ar-square",    modifier: ".gd-ratio--square",    value: "1 / 1",  note: "Square — chip thumbnail, equal-weight grid tile." },
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
                  <th scope="col">Classes</th>
                  <th scope="col">Uses</th>
                  <th scope="col">When to use</th>
                </tr>
              </thead>
              <tbody>
                {colorTokens.map(({ key, token, value, classes, uses, when }) => (
                  <tr key={key}>
                    <td className="read-color-table__swatch" data-color={key} aria-hidden="true" />
                    <td className="read-color-table__token-cell">
                      <span className="read-gd-token-lbl">{token}</span>
                      <span className="read-token-value">{value}</span>
                    </td>
                    <td>
                      {classes?.length ? (
                        <div className="read-gd-tokens">
                          {classes.map((c) => (
                            <span className="read-gd-class-lbl" key={c}>{c}</span>
                          ))}
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <div className="read-uses">
                        {uses.map((u) => (
                          <span key={u} className={`read-use-badge read-use-badge--${u}`}>
                            {USE_LABELS[u]}
                          </span>
                        ))}
                      </div>
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
        whenToUse="All headings (h1–h4) use --gd-font-display (Archivo Narrow) — uppercase, never substituted. Body copy uses --gd-font-body (Work Sans) — sentence-case. --gd-tr-mono-wide (0.22em) is reserved exclusively for .gd-eyebrow. .gd-pullquote is the only Newsreader role at display size; .gd-serif is for generic body-size italic only."
      >
        <div className="read-table-card">
          <table className="read-type-table">
            <thead>
              <tr>
                <th scope="col">Sample</th>
                <th scope="col">Styles</th>
                <th scope="col">When to use</th>
              </tr>
            </thead>
            <tbody>
              {typeRoles.map(({ className, sample, tokens, when }) => (
                <ReadTypeRow
                  key={className}
                  className={className}
                  sample={sample}
                  tokens={tokens}
                  when={when}
                />
              ))}
            </tbody>
          </table>
        </div>
      </ReadSection>

      <ReadSection
        id="spacing"
        title="Spacing & Padding"
        level={2}
        intro="[Section intro — the spacing scale is the source for every gap, margin, and (composed) padding decision. Padding role tokens compose from the same scale; raw spacing values are also valid as padding directly.]"
        whenToUse="Every gap, margin, or padding value must reference a --gd-space-* token (or a calc() composition of tokens). Literal pixel / rem values in component CSS are a bug. Page-level horizontal gutters always use --gd-pad-x; never substitute a raw spacing value at the page edge."
      >
        <div className="gd-section">
          <div className="read-ruler">
            {spacingTokens.map(({ step, token, px }) => (
              <div className="read-ruler__row" key={token}>
                <span className="read-gd-token-lbl">{token}</span>
                <span className="read-token-value">{px} px</span>
                <i className="read-ruler__bar" data-step={step} aria-hidden="true" />
              </div>
            ))}
          </div>

          <section id="spacing-padding" aria-labelledby="spacing-padding-title">
            <header className="read-subsection">
              <div className="read-section__heading">
                <h3 className="read-subsection__title" id="spacing-padding-title">
                  Padding
                </h3>
                <p className="read-section__intro">
                  Orange marks the padding zones the token actually controls. Gray is non-token visual buffer (kept so the inner content has breathing room).
                </p>
              </div>
            </header>
            <div className="read-pad-demo">
              {padDemos.map(({ key, token, value, classes, note }) => (
                <div className="read-demo-row" key={key}>
                  <div className="read-demo-row__labels">
                    <div className="read-gd-tokens">
                      <span className="read-gd-token-lbl">{token}</span>
                      {classes?.map((c) => (
                        <span className="read-gd-class-lbl" key={c}>{c}</span>
                      ))}
                    </div>
                    <span className="read-token-value">{value}</span>
                  </div>
                  <p className="read-section__when">{note}</p>
                  <div className="read-pad-demo__box" data-pad={key}>
                    <span className="read-pad-demo__fill">content</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </ReadSection>

      <ReadSection
        id="borders"
        title="Borders"
        level={2}
        intro="[Section intro — border widths and rule colors. Two widths, four rule roles.]"
        whenToUse="Only two border widths exist: --gd-bw-hair (1px) for every divider, filebar cell, ledger row; --gd-bw-rule (2px) for structural rules (section-heading underlines, warranty stamp, hero stamp). Anything thicker should be a different element entirely. --gd-rule-dim is the only rule color permitted on dark surfaces. --gd-rule-active (orange) marks single-instance highlights only — never a generic decorative rule."
      >
        <div className="gd-section">
          <div className="read-border-demo">
            {borderWidths.map(({ key, token, value, note }) => (
              <div className="read-demo-row" key={key}>
                <div className="read-demo-row__labels">
                  <div className="read-gd-tokens">
                    <span className="read-gd-token-lbl">{token}</span>
                  </div>
                  <span className="read-token-value">{value}</span>
                </div>
                <p className="read-section__when">{note}</p>
                <span className="read-border-demo__bar" data-bw={key} aria-hidden="true" />
              </div>
            ))}
          </div>

          <section id="borders-rule-colors" aria-labelledby="borders-rule-colors-title">
            <header className="read-subsection">
              <div className="read-section__heading">
                <h3 className="read-subsection__title" id="borders-rule-colors-title">
                  Rule colors
                </h3>
                <p className="read-section__intro">
                  Border colors paired with the context they sit on. Each role is single-purpose; the dim role is the only one for dark surfaces.
                </p>
              </div>
            </header>
            <div className="read-rule-demo">
              {ruleColors.map(({ key, token, value, note }) => (
                <div className="read-demo-row" key={key}>
                  <div className="read-demo-row__labels">
                    <div className="read-gd-tokens">
                      <span className="read-gd-token-lbl">{token}</span>
                    </div>
                    <span className="read-token-value">{value}</span>
                  </div>
                  <p className="read-section__when">{note}</p>
                  <span className="read-rule-demo__bar" data-rule={key} aria-hidden="true" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </ReadSection>

      <ReadSection
        id="radii"
        title="Radii"
        level={2}
        intro="[Section intro — the system is sharp by default. Two radius tokens: zero (default) and full-circle (sanctioned circular roles only).]"
        whenToUse="--gd-r-none (0) is the default — every container, photo, button, card, badge, input, and surface is square-cornered. The system is print-flat by intent. --gd-r-full (9999px) is reserved exclusively for sanctioned circular roles: .gd-slider__grip (drag affordance) and .gd-warranty (warranty seal). Both are role-singular per-page; never decorative."
      >
        <div className="gd-section">
          <div className="read-radius-demo">
            {radii.map(({ key, token, value, note }) => (
              <div className="read-demo-row" key={key}>
                <div className="read-demo-row__labels">
                  <div className="read-gd-tokens">
                    <span className="read-gd-token-lbl">{token}</span>
                  </div>
                  <span className="read-token-value">{value}</span>
                </div>
                <p className="read-section__when">{note}</p>
                <div className="read-radius-demo__box" data-r={key} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="shadows"
        title="Shadows"
        level={2}
        intro="[Section intro — two shadow values; most surfaces use neither.]"
        whenToUse="--gd-shadow-none is the default — most pages use it on every surface (the system prefers print-flat). --gd-shadow-lift is reserved for elevated states only: hover-elevated cards, floating dialogs, drag previews. Never used decoratively at rest. No other shadow value is permitted."
      >
        <div className="gd-section">
          <div className="read-shadow-demo">
            {shadows.map(({ key, token, value, note }) => (
              <div className="read-demo-row" key={key}>
                <div className="read-demo-row__labels">
                  <div className="read-gd-tokens">
                    <span className="read-gd-token-lbl">{token}</span>
                  </div>
                  <span className="read-token-value">{value}</span>
                </div>
                <p className="read-section__when">{note}</p>
                <div className="read-shadow-demo__box" data-shadow={key} aria-hidden="true" />
              </div>
            ))}
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
              <div className="read-demo-row read-demo-row--stack" key={key}>
                <div className="read-demo-row__labels">
                  <div className="read-gd-tokens">
                    <span className="read-gd-token-lbl">{token}</span>
                  </div>
                  <span className="read-token-value">{value}</span>
                </div>
                <p className="read-section__when">{note}</p>
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
        whenToUse="Exactly one .gd-banner per page, and only at the very top. The banner uses --gd-color-fg-strong (the system's only structural dark) — never invent a second dark. Exactly one .gd-btn (primary CTA) in the header — it is the page's primary action. The scroll transition is transition-based only: max-height + opacity on the banner, padding-block on the topnav, both via --gd-d-base / --gd-ease. Never @keyframes. The weather widget is decorative chrome, never a feature — it carries no interactivity and never grows into a forecast surface. The .gd-phone class powers both renders (banner + topnav-on-scroll); never duplicate the element with bespoke styles."
      >
        <div className="gd-section">
          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-site-header</span>
                <span className="read-gd-class-lbl">.gd-banner</span>
                <span className="read-gd-class-lbl">.gd-topnav</span>
                <span className="read-gd-class-lbl">.gd-phone</span>
                <span className="read-gd-class-lbl">.gd-weather</span>
                <span className="read-gd-token-lbl">--gd-header-pad-y</span>
                <span className="read-gd-token-lbl">--gd-header-pad-y-compact</span>
                <span className="read-gd-token-lbl">--gd-banner-pad-y</span>
                <span className="read-gd-token-lbl">--gd-logo-h</span>
                <span className="read-gd-token-lbl">--gd-z-header</span>
              </div>
            </div>
            <p className="read-section__when">
              Demo is locked to the rest state so the topbar (.gd-banner) stays visible while you read — the live header at the top of this page is the canonical reference for the scroll-collapse behavior. On scroll: the dark .gd-banner strip collapses (max-height + opacity → 0), the phone migrates into the .gd-topnav next to the CTA, and topnav vertical padding halves from --gd-header-pad-y to --gd-header-pad-y-compact. Phone-icon link has no background and no border by spec.
            </p>
            <SiteHeader embed />
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="motion"
        title="Motion"
        level={2}
        intro="Motions are applied to elements/classes accordingly. Three durations and one easing curve govern every animated state — there is no other curve, and no duration outside this scale."
        whenToUse="All motion is transition-based. No @keyframes, no scroll-linked animation, no animation libraries — without explicit user approval. --gd-d-fast (120ms) for micro-interactions (button hover, link color shift, status pill tick). --gd-d-base (240ms) for default UI state changes — hover lift on images / cards / frames / sliders, header scroll-collapse, filebar cell hover. --gd-d-slow (480ms) for hero crossfades and page transitions only. --gd-ease is the one curve, site-wide; never substitute another easing function. The hover-lift treatment (border + shadow + translate at --gd-d-base / --gd-ease) is one rule applied to multiple selectors via a comma-grouped list — any new component that adopts this hover behavior joins the existing selector list, never writes a fifth duplicate rule body. Motions are added per element/class — list below covers what's wired so far."
      >
        <div className="gd-section">
          <div className="read-pad-demo">
            <div className="read-demo-row read-demo-row--stack">
              <div className="read-demo-row__labels">
                <div className="read-gd-tokens">
                  <span className="read-gd-class-lbl">.gd-image &gt; .gd-ratio</span>
                  <span className="read-gd-token-lbl">--gd-d-base</span>
                  <span className="read-gd-token-lbl">--gd-ease</span>
                  <span className="read-gd-token-lbl">--gd-shadow-lift</span>
                  <span className="read-gd-token-lbl">--gd-lift</span>
                </div>
              </div>
              <p className="read-section__when">
                Standalone images — lift scoped to the image frame only, never the caption. At rest: hairline border, no shadow, no translation. On hover (anywhere in the figure): box-shadow lifts to --gd-shadow-lift and the frame translates upward by --gd-lift. Hover any image in the Images section to see it live.
              </p>
            </div>

            <div className="read-demo-row read-demo-row--stack">
              <div className="read-demo-row__labels">
                <div className="read-gd-tokens">
                  <span className="read-gd-class-lbl">.gd-slider</span>
                  <span className="read-gd-class-lbl">.gd-frame</span>
                  <span className="read-gd-token-lbl">--gd-d-base</span>
                  <span className="read-gd-token-lbl">--gd-ease</span>
                  <span className="read-gd-token-lbl">--gd-shadow-lift</span>
                  <span className="read-gd-token-lbl">--gd-lift</span>
                </div>
              </div>
              <p className="read-section__when">
                Sliders and frames — the lift applies to the whole element. The slider's caption role is played by .gd-slider__meta (internal), so the border + lift wraps slider + meta as one. Drag interaction is separate — pointer-driven --gd-slider-pos updates without a transition (drag tracks 1:1 with the pointer).
              </p>
            </div>
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="images"
        title="Images"
        level={2}
        intro="[Section intro — five sanctioned aspect ratios. No other shape is permitted.]"
        whenToUse="Every image on the site must lock to one of the five aspect-ratio tokens (--gd-ar-cinema, --gd-ar-wide, --gd-ar-landscape, --gd-ar-portrait, --gd-ar-square) via a .gd-ratio--* modifier. Images inside .gd-ratio are always object-fit: cover — they can never stretch or distort. No image may exceed --gd-image-max-h (= 100vh − 2 × section padding − header); when the cap kicks in the entire box shrinks proportionally, the aspect lock is preserved. Attached chrome counts toward the cap: contexts (.gd-image with caption, .gd-card--photo / .gd-card--profile with content stack) set --gd-image-fit-h to subtract their chrome reserve, so the image AND its chrome together fit in the viewport-fit window. The single exception is a photo used as full-bleed background for an entire section."
      >
        <section id="images-standard" aria-labelledby="images-standard-title">
          <header className="read-subsection">
            <div className="read-section__heading">
              <h3 className="read-subsection__title" id="images-standard-title">
                Standard
              </h3>
              <p className="read-section__intro">
                Every image on the site must adopt one of these five aspect ratios. Images inside <code>.gd-ratio</code> are always <code>object-fit: cover</code> — they can never stretch or distort. Each <code>.gd-ratio--*</code> modifier also enforces a per-ratio <code>max-width</code> derived from <code>--gd-image-max-h</code> so no image grows past the viewport-fit cap; when the cap kicks in the entire box shrinks proportionally. The only exception (for both rules) is a photo used as full-bleed background for an entire section.
              </p>
            </div>
          </header>
          <div className="gd-section">
            <div className="read-demo-row read-demo-row--stack">
              <div className="read-demo-row__labels">
                <div className="read-gd-tokens">
                  {aspectRatios.map(({ token }) => (
                    <span className="read-gd-token-lbl" key={token}>{token}</span>
                  ))}
                  {aspectRatios.map(({ modifier }) => (
                    <span className="read-gd-class-lbl" key={modifier}>{modifier}</span>
                  ))}
                </div>
              </div>
              <p className="read-section__when">
                All images locked to one of the five shapes — no other ratio is sanctioned. Heights vary across the row by design — that's the comparison.
              </p>
              <div className="read-ratio-rail">
                {aspectRatios.map(({ key, token, value }) => (
                  <div className="read-ratio-rail__cell" key={key}>
                    <figure className="gd-image">
                      <div className={`gd-ratio ${ratioMap[key]}`} aria-hidden="true" />
                      <figcaption className="gd-caption">
                        <span>{token.replace("--gd-ar-", "")}</span>
                        <span className="gd-caption-meta">{value}</span>
                      </figcaption>
                    </figure>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </ReadSection>

      <ReadSection
        id="frames"
        title="Frames"
        level={2}
        intro="[Section intro — frame and slider components. Both wrap a .gd-ratio--* and add the system's photo treatment.]"
        whenToUse="Use .gd-frame as the default frame for any standalone photo — dark fallback surface, orange corner brackets, optional top/bottom meta rows for status / location / file number. Use .gd-slider for any before/after comparison; never use it for a simple image gallery (use a horizontal-scrolled list of .gd-image instead). Both compose with .gd-ratio--* to lock to one of the five sanctioned aspect ratios."
      >
        <section id="frames-frame" aria-labelledby="frames-frame-title">
          <header className="read-subsection">
            <div className="read-section__heading">
              <h3 className="read-subsection__title" id="frames-frame-title">
                Frame
              </h3>
              <p className="read-section__intro">
                Photo frame at each sanctioned aspect ratio. Corner brackets are orange; meta rows are mono on the dark surface.
              </p>
            </div>
          </header>
          <div className="gd-section">
            <div className="read-demo-row read-demo-row--stack">
              <div className="read-demo-row__labels">
                <div className="read-gd-tokens">
                  <span className="read-gd-class-lbl">.gd-frame</span>
                  <span className="read-gd-class-lbl">.gd-frame__brackets</span>
                  <span className="read-gd-class-lbl">.gd-frame__meta-top</span>
                  <span className="read-gd-class-lbl">.gd-frame__meta-bot</span>
                </div>
              </div>
              <p className="read-section__when">
                One frame per aspect ratio — the same treatment scales to every sanctioned shape without modification.
              </p>
              <div className="read-ratio-rail">
                {aspectRatios.map(({ key, value, token }) => (
                  <div className="read-ratio-rail__cell" key={key}>
                    <div className={`gd-ratio ${ratioMap[key]} gd-frame`}>
                      <span className="gd-frame__brackets" aria-hidden="true" />
                      <span className="gd-frame__meta-top">
                        <span>FILE 042</span>
                        <span>{key.toUpperCase()}</span>
                      </span>
                      <span className="gd-frame__meta-bot">
                        <span>{token.replace("--gd-ar-", "")}</span>
                        <span>{value}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="frames-slider" aria-labelledby="frames-slider-title">
          <header className="read-subsection">
            <div className="read-section__heading">
              <h3 className="read-subsection__title" id="frames-slider-title">
                Slider
              </h3>
              <p className="read-section__intro">
                Before/after comparison overlay at each sanctioned aspect ratio. Orange vertical handle at the 50% line; before/after tags top-left and top-right; bottom mono meta bar.
              </p>
            </div>
          </header>
          <div className="gd-section">
            <div className="read-demo-row read-demo-row--stack">
              <div className="read-demo-row__labels">
                <div className="read-gd-tokens">
                  <span className="read-gd-class-lbl">.gd-slider</span>
                  <span className="read-gd-class-lbl">.gd-slider__layer</span>
                  <span className="read-gd-class-lbl">.gd-slider__tag</span>
                  <span className="read-gd-class-lbl">.gd-slider__handle</span>
                  <span className="read-gd-class-lbl">.gd-slider__grip</span>
                  <span className="read-gd-class-lbl">.gd-slider__meta</span>
                </div>
              </div>
              <p className="read-section__when">
                One slider per aspect ratio. The handle is fixed at 50% for the static demo — interactivity lives in component code, not the design system.
              </p>
              <div className="read-ratio-rail">
                {aspectRatios.map(({ key, value, token }) => (
                  <div className="read-ratio-rail__cell" key={key}>
                    <GdSlider
                      ratio={key}
                      metaLabel={token.replace("--gd-ar-", "")}
                      metaValue={value}
                    />
                  </div>
                ))}
              </div>
            </div>
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
        <div className="gd-section">
          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-btn</span>
                <span className="read-gd-class-lbl">.gd-btn--ghost</span>
                <span className="read-gd-token-lbl">--gd-color-brand</span>
                <span className="read-gd-token-lbl">--gd-color-brand-soft</span>
              </div>
            </div>
            <p className="read-section__when">
              Primary fills with --gd-color-brand and lifts on hover to --gd-color-brand-soft. Ghost variant inverts on hover (slate fill → muted background, accent border).
            </p>
            <div className="read-demo-strip">
              <button type="button" className="gd-btn">Get a quote</button>
              <button type="button" className="gd-btn gd-btn--ghost">Read more</button>
            </div>
          </div>

          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-link</span>
                <span className="read-gd-class-lbl">.gd-link--mono</span>
              </div>
            </div>
            <p className="read-section__when">
              Inline link inherits surrounding type; only color and underline are added. The mono modifier swaps the typography to mono uppercase for CTA-style links.
            </p>
            <div className="gd-body">
              Need help with a claim? <a href="#" className="gd-link">Start a new file</a> or browse our recent work below. <br />
              <a href="#" className="gd-link gd-link--mono">View case study →</a>
            </div>
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="forms"
        title="Form fields"
        level={2}
        intro="[Section intro — text input, textarea, select, label, and field wrapper. Focus state uses the system orange — no custom focus rings.]"
        whenToUse=".gd-input / .gd-textarea / .gd-select share a single visual treatment (hairline strong border, full-width, focus-orange). .gd-label is always mono uppercase. Wrap label + control + optional error in .gd-field for vertical rhythm. Errors use --gd-color-brand (the system's only chromatic signal); never invent a red."
      >
        <div className="gd-section">
          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-field</span>
                <span className="read-gd-class-lbl">.gd-label</span>
                <span className="read-gd-class-lbl">.gd-input</span>
                <span className="read-gd-class-lbl">.gd-textarea</span>
                <span className="read-gd-class-lbl">.gd-select</span>
                <span className="read-gd-class-lbl">.gd-field__error</span>
              </div>
            </div>
            <p className="read-section__when">
              Each field stacks label → control → error. Click into a control and watch the border turn accent-orange.
            </p>
            <div className="read-demo-stack">
              <div className="gd-field">
                <label className="gd-label" htmlFor="demo-name">Name</label>
                <input id="demo-name" className="gd-input" type="text" placeholder="Daniel" />
              </div>
              <div className="gd-field">
                <label className="gd-label" htmlFor="demo-email">Email</label>
                <input id="demo-email" className="gd-input" type="email" defaultValue="not-an-email" />
                <span className="gd-field__error">Enter a valid email address.</span>
              </div>
              <div className="gd-field">
                <label className="gd-label" htmlFor="demo-carrier">Carrier</label>
                <select id="demo-carrier" className="gd-select" defaultValue="">
                  <option value="" disabled>Select carrier…</option>
                  <option>State Farm</option>
                  <option>Allstate</option>
                  <option>Travelers</option>
                </select>
              </div>
              <div className="gd-field">
                <label className="gd-label" htmlFor="demo-notes">Notes</label>
                <textarea id="demo-notes" className="gd-textarea" placeholder="Describe the damage…" />
              </div>
            </div>
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="filebar"
        title="Filebar"
        level={2}
        intro="[Section intro — multi-cell horizontal bar for file metadata. Each cell is a small label + value pair; one value can be active.]"
        whenToUse="Used at the top of file/claim pages and inside file-style cards. Cells divide evenly across the bar width. Exactly one cell value may carry the .gd-filebar__value--active modifier per filebar (system rule — one highlighted cell). Never use it as a generic navbar."
      >
        <div className="gd-section">
          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-filebar</span>
                <span className="read-gd-class-lbl">.gd-filebar__cell</span>
                <span className="read-gd-class-lbl">.gd-filebar__label</span>
                <span className="read-gd-class-lbl">.gd-filebar__value</span>
                <span className="read-gd-class-lbl">.gd-filebar__value--active</span>
              </div>
            </div>
            <p className="read-section__when">
              5 cells, one active (orange). The active value points at the section currently in focus.
            </p>
            <div className="gd-filebar">
              <div className="gd-filebar__cell">
                <span className="gd-filebar__label">File</span>
                <span className="gd-filebar__value">042</span>
              </div>
              <div className="gd-filebar__cell">
                <span className="gd-filebar__label">Date</span>
                <span className="gd-filebar__value">08·14·24</span>
              </div>
              <div className="gd-filebar__cell">
                <span className="gd-filebar__label">Carrier</span>
                <span className="gd-filebar__value">State Farm</span>
              </div>
              <div className="gd-filebar__cell">
                <span className="gd-filebar__label">Status</span>
                <span className="gd-filebar__value gd-filebar__value--active">Active</span>
              </div>
              <div className="gd-filebar__cell">
                <span className="gd-filebar__label">Region</span>
                <span className="gd-filebar__value">DFW</span>
              </div>
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
          <div className="gd-section">
            <div className="read-demo-row read-demo-row--stack">
              <div className="read-demo-row__labels">
                <div className="read-gd-tokens">
                  <span className="read-gd-class-lbl">.gd-card</span>
                  <span className="read-gd-class-lbl">.gd-card__eyebrow</span>
                  <span className="read-gd-class-lbl">.gd-card__title</span>
                  <span className="read-gd-class-lbl">.gd-card__body</span>
                  <span className="read-gd-class-lbl">.gd-card__link</span>
                </div>
              </div>
              <p className="read-section__when">
                Three cards in a grid — hover any to see the lift treatment shared with images / frames / sliders.
              </p>
              <div className="read-demo-grid">
                <a href="#" className="gd-card">
                  <span className="gd-card__eyebrow">Project · 042</span>
                  <h3 className="gd-card__title">Storm Claim · Plano</h3>
                  <p className="gd-card__body">State Farm supplement filed and closed at $28,400 against the carrier's initial $11,800.</p>
                  <span className="gd-card__link">View case study →</span>
                </a>
                <a href="#" className="gd-card">
                  <span className="gd-card__eyebrow">Project · 058</span>
                  <h3 className="gd-card__title">Roof Replacement · DFW</h3>
                  <p className="gd-card__body">Full tear-off and replacement on a 28-square commercial property. Carrier accepted on first pass.</p>
                  <span className="gd-card__link">View case study →</span>
                </a>
                <a href="#" className="gd-card">
                  <span className="gd-card__eyebrow">Project · 071</span>
                  <h3 className="gd-card__title">Emergency HVAC · Frisco</h3>
                  <p className="gd-card__body">Same-day system failure response. Diagnosed, sourced, replaced — owners had cool air by sunset.</p>
                  <span className="gd-card__link">View case study →</span>
                </a>
              </div>
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
          <div className="gd-section">
            <div className="read-demo-row read-demo-row--stack">
              <div className="read-demo-row__labels">
                <div className="read-gd-tokens">
                  <span className="read-gd-class-lbl">.gd-card</span>
                  <span className="read-gd-class-lbl">.gd-card--photo</span>
                  <span className="read-gd-class-lbl">.gd-ratio--wide</span>
                  <span className="read-gd-class-lbl">.gd-ratio--landscape</span>
                  <span className="read-gd-class-lbl">.gd-ratio--portrait</span>
                  <span className="read-gd-class-lbl">.gd-ratio--square</span>
                </div>
              </div>
              <p className="read-section__when">
                One image card per sanctioned ratio (cinema excluded). Image at top locks to the ratio; the content stack below is identical to the standard card.
              </p>
              <div className="read-ratio-rail">
                {aspectRatios.filter(({ key }) => key !== "cinema").map(({ key, token, value }) => (
                  <div className="read-ratio-rail__cell" key={key}>
                    <a href="#" className="gd-card gd-card--photo">
                      <div className={`gd-ratio ${ratioMap[key]}`} aria-hidden="true" />
                      <span className="gd-card__eyebrow">{token.replace("--gd-ar-", "").toUpperCase()} · {value}</span>
                      <h3 className="gd-card__title">Project · 042</h3>
                      <p className="gd-card__body">Storm claim, full roof replacement. Supplement filed and closed.</p>
                      <span className="gd-card__link">View case study →</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ReadSection>

      <ReadSection
        id="tags"
        title="Tags"
        level={2}
        intro="[Section intro — small label-shaped elements. Three families: status (one active per page), chips (flat metadata groups), stamps (one per page max).]"
        whenToUse=".gd-status for the file/state indicator — one .gd-status--active per page maximum. .gd-chips for flat tag/exhibit groupings (no active state, no hover). .gd-stamp is the loud editorial mark — never more than one stamp on a page. All three reuse the same mono / accent vocabulary; pick the one whose shape matches the role. For status variants: the border picks up currentColor automatically — each --variant changes only the color property, never re-defines border-color. Use this same currentColor pattern whenever a class has variants that differ only in color."
      >
        <div className="gd-section">
          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-status</span>
                <span className="read-gd-class-lbl">.gd-status--closed</span>
                <span className="read-gd-class-lbl">.gd-status--active</span>
                <span className="read-gd-class-lbl">.gd-status--filed</span>
              </div>
            </div>
            <p className="read-section__when">
              Status badge — border picks up the color via currentColor, so the modifier is the only thing that changes.
            </p>
            <div className="read-demo-strip">
              <span className="gd-status gd-status--closed">Closed</span>
              <span className="gd-status gd-status--active">Active</span>
              <span className="gd-status gd-status--filed">Filed</span>
            </div>
          </div>

          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-chips</span>
                <span className="read-gd-class-lbl">.gd-chip</span>
              </div>
            </div>
            <p className="read-section__when">
              Chips — flexible inline labels. No state, no hover. Used for exhibit tags, scope items, filter chips.
            </p>
            <div className="gd-chips">
              <span className="gd-chip">Roofing</span>
              <span className="gd-chip">Storm</span>
              <span className="gd-chip">Supplement</span>
              <span className="gd-chip">Carrier · State Farm</span>
              <span className="gd-chip">DFW</span>
            </div>
          </div>

          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-stamp</span>
                <span className="read-gd-token-lbl">--gd-fs-pullquote</span>
                <span className="read-gd-token-lbl">--gd-bw-rule</span>
              </div>
            </div>
            <p className="read-section__when">
              Rotated stamp — one per page. The -12° tilt is the stamp's signature; not a broader rotation scale.
            </p>
            <div className="read-demo-strip">
              <span className="gd-stamp">Closed · $28,400</span>
            </div>
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="dividers"
        title="Dividers"
        level={2}
        intro="[Section intro — hairline horizontal rule with built-in vertical rhythm. The only generic separator in the system.]"
        whenToUse="One class. Use between unrelated content blocks where the spacing alone isn't enough to read as a break. Not for inside cards or filebars — those have their own hairline structure."
      >
        <div className="gd-section">
          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-divider</span>
              </div>
            </div>
            <p className="read-section__when">
              Used between blocks of content as a hairline break.
            </p>
            <div>
              <p className="gd-body">A short paragraph above the divider.</p>
              <hr className="gd-divider" />
              <p className="gd-body">And the next paragraph below.</p>
            </div>
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="ledger"
        title="Ledger"
        level={2}
        intro="[Section intro — tabular row listing for monetary / file / job entries. Header row is muted; body rows mix mono numbers and display titles.]"
        whenToUse="Use for any structured list where each row has the same shape (number, label, money, date, status). Header row uses .gd-ledger__row--header. Hairline rules between rows; no row borders top or bottom outside the container's own."
      >
        <div className="gd-section">
          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-ledger</span>
                <span className="read-gd-class-lbl">.gd-ledger__row</span>
                <span className="read-gd-class-lbl">.gd-ledger__row--header</span>
                <span className="read-gd-class-lbl">.gd-ledger__num</span>
                <span className="read-gd-class-lbl">.gd-ledger__label</span>
                <span className="read-gd-class-lbl">.gd-ledger__money</span>
                <span className="read-gd-class-lbl">.gd-ledger__meta</span>
              </div>
            </div>
            <p className="read-section__when">
              Header + three rows showing the canonical row shape. Columns: number → label → meta → carrier → money.
            </p>
            <div className="gd-ledger">
              <div className="gd-ledger__row gd-ledger__row--header">
                <span>File</span>
                <span>Job</span>
                <span>Carrier</span>
                <span>Closed</span>
                <span>Amount</span>
              </div>
              <div className="gd-ledger__row">
                <span className="gd-ledger__num">042</span>
                <span className="gd-ledger__label">Storm Claim · Plano</span>
                <span className="gd-ledger__meta">State Farm</span>
                <span className="gd-ledger__meta">08·14·24</span>
                <span className="gd-ledger__money">$28,400</span>
              </div>
              <div className="gd-ledger__row">
                <span className="gd-ledger__num">058</span>
                <span className="gd-ledger__label">Roof Replacement · DFW</span>
                <span className="gd-ledger__meta">Allstate</span>
                <span className="gd-ledger__meta">07·02·24</span>
                <span className="gd-ledger__money">$42,100</span>
              </div>
              <div className="gd-ledger__row">
                <span className="gd-ledger__num">071</span>
                <span className="gd-ledger__label">Emergency HVAC · Frisco</span>
                <span className="gd-ledger__meta">Travelers</span>
                <span className="gd-ledger__meta">06·19·24</span>
                <span className="gd-ledger__money">$11,800</span>
              </div>
            </div>
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
        <div className="gd-section">
          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-quote</span>
                <span className="read-gd-class-lbl">.gd-quote__mark</span>
                <span className="read-gd-class-lbl">.gd-pullquote</span>
                <span className="read-gd-class-lbl">.gd-quote__cite</span>
              </div>
            </div>
            <p className="read-section__when">
              Bordered quote with orange opening mark, pull-quote body, and mono citation footer.
            </p>
            <blockquote className="gd-quote">
              <span className="gd-quote__mark">“</span>
              <p className="gd-pullquote">Daniel walked the roof with the adjuster, filed the supplements, and we closed at $28,400. Same number when a shingle went sideways in year three.</p>
              <footer className="gd-quote__cite">
                <span>Maria K. · Homeowner</span>
                <span>Plano · 2024</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="trust"
        title="Trust grid"
        level={2}
        intro="[Section intro — bordered horizontal row of stat cells. Used for at-a-glance credibility (years in business, files closed, carriers handled).]"
        whenToUse="Use for compact metric / credential rows. 2–4 cells typical; more than 5 starts to crowd. Label sits above value in each cell. Never mix marketing copy into a trust cell — these are bare metrics."
      >
        <div className="read-section">
          <div className="read-gd-tokens">
            <span className="read-gd-class-lbl">.gd-trust</span>
            <span className="read-gd-class-lbl">.gd-trust__cell</span>
            <span className="read-gd-class-lbl">.gd-trust__label</span>
            <span className="read-gd-class-lbl">.gd-trust__value</span>
          </div>
          <p className="read-section__when">
            Three cells, mono label over display value. Cells divide evenly across the bar width.
          </p>
        </div>
        <div className="gd-section">
          <div className="gd-trust">
            <div className="gd-trust__cell">
              <span className="gd-trust__label">Years in business</span>
              <span className="gd-trust__value">12</span>
            </div>
            <div className="gd-trust__cell">
              <span className="gd-trust__label">Files closed</span>
              <span className="gd-trust__value">240+</span>
            </div>
            <div className="gd-trust__cell">
              <span className="gd-trust__label">Carriers handled</span>
              <span className="gd-trust__value">6</span>
            </div>
          </div>
        </div>

        <div className="read-section">
          <div className="read-gd-tokens">
            <span className="read-gd-class-lbl">.gd-trust--rich</span>
            <span className="read-gd-class-lbl">.gd-trust__body</span>
            <span className="read-gd-class-lbl">.gd-trust__cell</span>
            <span className="read-gd-class-lbl">.gd-trust__label</span>
            <span className="read-gd-class-lbl">.gd-bar</span>
            <span className="read-gd-class-lbl">.gd-bar--dark</span>
          </div>
          <p className="read-section__when">
            Consolidated variant — dark mono meta-bar on top, three rich cells underneath. Each cell stacks a mono label and arbitrary primitives: <code>.gd-pm</code> rows, the <code>.gd-warranty</code> seal, a <code>.gd-chips</code> group. Same <code>.gd-trust</code> shell as the stat strip above; the <code>--rich</code> modifier switches the layout to a vertical stack with the bar on top.
          </p>
        </div>
        <div className="gd-section">
          <div className="gd-trust gd-trust--rich">
              <div className="gd-bar gd-bar--dark">
                <span>Exhibit B · Standing</span>
                <span>03 Entries</span>
                <span>On file since 2010</span>
              </div>
              <div className="gd-trust__body">
                <div className="gd-trust__cell">
                  <span className="gd-trust__label">Who runs your job</span>
                  <div className="gd-pm">
                    <div className="gd-pm__photo" aria-hidden="true" />
                    <span className="gd-pm__meta">
                      <span className="gd-pm__name">Daniel R.</span>
                      <span className="gd-pm__title">Roofing · DFW · 12 yr</span>
                    </span>
                  </div>
                  <div className="gd-pm">
                    <div className="gd-pm__photo" aria-hidden="true" />
                    <span className="gd-pm__meta">
                      <span className="gd-pm__name">Jorge M.</span>
                      <span className="gd-pm__title">Remodel · DFW · 9 yr</span>
                    </span>
                  </div>
                  <div className="gd-pm">
                    <div className="gd-pm__photo" aria-hidden="true" />
                    <span className="gd-pm__meta">
                      <span className="gd-pm__name">Mike T.</span>
                      <span className="gd-pm__title">Cleveland · 7 yr</span>
                    </span>
                  </div>
                </div>
                <div className="gd-trust__cell">
                  <span className="gd-trust__label">Workmanship warranty</span>
                  <span className="gd-warranty">
                    <span className="gd-warranty__shape">
                      25
                      <span className="gd-warranty__unit">Years</span>
                    </span>
                    <span className="gd-warranty__text">
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
                  <span className="gd-trust__label">Carriers we file with</span>
                  <div className="gd-chips">
                    <span className="gd-chip">State Farm</span>
                    <span className="gd-chip">Allstate</span>
                    <span className="gd-chip">Travelers</span>
                    <span className="gd-chip">USAA</span>
                    <span className="gd-chip">Progressive</span>
                    <span className="gd-chip">Nationwide</span>
                    <span className="gd-chip">Liberty Mutual</span>
                    <span className="gd-chip">Farmers</span>
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
        <div className="gd-section">
          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-list</span>
              </div>
            </div>
            <p className="read-section__when">
              Unordered list — orange em-dash marker for each item.
            </p>
            <ul className="gd-list">
              <li>Insurance supplement filed within 48 hours of inspection.</li>
              <li>Direct-to-carrier communication; no homeowner translation tax.</li>
              <li>Closed-file audit on every job at the 30-day mark.</li>
              <li>Lifetime workmanship warranty, transferable on sale.</li>
            </ul>
          </div>

          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-list</span>
                <span className="read-gd-class-lbl">.gd-list--ordered</span>
              </div>
            </div>
            <p className="read-section__when">
              Ordered list — mono leading-zero numbers (01, 02, 03 …) in accent color.
            </p>
            <ol className="gd-list gd-list--ordered">
              <li>Schedule a roof inspection — no obligation, no high-pressure walkthrough.</li>
              <li>We document damage and file the supplement with your carrier.</li>
              <li>Carrier issues a revised estimate; we walk you through it line by line.</li>
              <li>Work begins on your timeline, not the adjuster's.</li>
            </ol>
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="warranty"
        title="Warranty seal"
        level={2}
        intro="[Section intro — the system's lone circular badge. One per page maximum; reserved for genuine warranty / certification claims, never decorative.]"
        whenToUse="Use .gd-warranty for an actual warranty or certification mark — the round shape is the recognition cue and is sanctioned alongside the slider grip as the only circular roles in the system. The text inside is display font, bold, uppercase; keep it to short factual claims (LIFETIME WARRANTY / CERTIFIED / NO LEAKS · 10YR). Never use as a decorative graphic flourish."
      >
        <div className="gd-section">
          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-warranty</span>
                <span className="read-gd-class-lbl">.gd-warranty__shape</span>
                <span className="read-gd-class-lbl">.gd-warranty__unit</span>
                <span className="read-gd-class-lbl">.gd-warranty__text</span>
                <span className="read-gd-token-lbl">--gd-r-full</span>
                <span className="read-gd-token-lbl">--gd-color-brand</span>
              </div>
            </div>
            <p className="read-section__when">
              Round outlined display badge. Composes existing tokens — no new primitives.
            </p>
            <div className="read-demo-strip">
              <span className="gd-warranty">
                <span className="gd-warranty__shape">
                  25
                  <span className="gd-warranty__unit">Years</span>
                </span>
                <span className="gd-warranty__text">
                  Written.
                  <br />
                  Signed.
                </span>
              </span>
              <span className="gd-warranty">
                <span className="gd-warranty__shape">
                  10
                  <span className="gd-warranty__unit">Year</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </ReadSection>

      <ReadSection
        id="pm-listing"
        title="PM listing"
        level={2}
        intro="[Section intro — dense person-row listing. Square portrait on the left, name + role meta beside.]"
        whenToUse="Use .gd-pm for team / project-manager / contact rows in dense layouts (sidebars, &quot;who's on this file&quot; sections). For full-card profile presentation, use .gd-card--profile instead. Each row has a hairline divider below it (suppressed on the last row); rows stack flush, no extra gap needed."
      >
        <div className="gd-section">
          <div className="read-demo-row read-demo-row--stack">
            <div className="read-demo-row__labels">
              <div className="read-gd-tokens">
                <span className="read-gd-class-lbl">.gd-pm</span>
                <span className="read-gd-class-lbl">.gd-pm__photo</span>
                <span className="read-gd-class-lbl">.gd-pm__meta</span>
                <span className="read-gd-class-lbl">.gd-pm__name</span>
                <span className="read-gd-class-lbl">.gd-pm__title</span>
              </div>
            </div>
            <p className="read-section__when">
              Four people-rows. Each row: 48px square portrait + 2-row mono meta — name (strong) on top, title / role (muted) below.
            </p>
            <div>
              <div className="gd-pm">
                <div className="gd-pm__photo" aria-hidden="true" />
                <span className="gd-pm__meta">
                  <span className="gd-pm__name">Daniel R.</span>
                  <span className="gd-pm__title">Project Manager</span>
                </span>
              </div>
              <div className="gd-pm">
                <div className="gd-pm__photo" aria-hidden="true" />
                <span className="gd-pm__meta">
                  <span className="gd-pm__name">Lisa C.</span>
                  <span className="gd-pm__title">Claims Coordinator</span>
                </span>
              </div>
              <div className="gd-pm">
                <div className="gd-pm__photo" aria-hidden="true" />
                <span className="gd-pm__meta">
                  <span className="gd-pm__name">André T.</span>
                  <span className="gd-pm__title">Roofing Lead</span>
                </span>
              </div>
              <div className="gd-pm">
                <div className="gd-pm__photo" aria-hidden="true" />
                <span className="gd-pm__meta">
                  <span className="gd-pm__name">Marisol P.</span>
                  <span className="gd-pm__title">Office &amp; Scheduling</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </ReadSection>
    </>
  );
}
