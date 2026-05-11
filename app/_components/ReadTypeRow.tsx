"use client";

import { useId, useState, type ReactNode } from "react";

/* Single row of the Typography table. Each row owns its own collapsed
   state — the class-label chip is rendered as a real <button> that
   toggles whether the formatted { styles } block is visible. Default
   state is collapsed so the table reads as a scannable list of role
   classes; click any chip to inspect its declarations. */

type Props = {
  className: string;
  sample: ReactNode;
  tokens: string[];
  when: string;
};

const tokenProperty = (t: string): string => {
  if (t.startsWith("--gd-font-")) return "font-family";
  if (t.startsWith("--gd-fs-")) return "font-size";
  if (t.startsWith("--gd-fw-")) return "font-weight";
  if (t.startsWith("--gd-lh-")) return "line-height";
  if (t.startsWith("--gd-tr-")) return "letter-spacing";
  if (t.startsWith("--gd-fg")) return "color";        // context-aware role tokens
  if (t.startsWith("--gd-color-")) return "color";    // raw primitives
  return "—";
};

/* Hand-encoded mirror of the typography-related token values defined in
   tokens.css. Shown to the right of each token so a reader can see what
   the var() resolves to without opening the source. If a token value
   changes in tokens.css, update it here too. */
const TOKEN_VALUES: Record<string, string> = {
  "--gd-font-display": "Archivo Narrow",
  "--gd-font-body": "Work Sans",
  "--gd-font-mono": "JetBrains Mono",
  "--gd-font-serif": "Newsreader",
  "--gd-fs-display": "clamp(2.6rem, 5vw, 4.2rem)",
  "--gd-fs-h1": "clamp(2rem, 3.6vw, 3rem)",
  "--gd-fs-h2": "clamp(1.6rem, 2.6vw, 2.2rem)",
  "--gd-fs-h2-display": "= --gd-fs-h1",
  "--gd-fs-h3": "1.5rem",
  "--gd-fs-h4": "1.15rem",
  "--gd-fs-body-l": "1.1rem",
  "--gd-fs-body": "1rem",
  "--gd-fs-body-s": "0.92rem",
  "--gd-fs-mono": "0.78rem",
  "--gd-fs-mono-s": "0.65rem",
  "--gd-fs-pullquote": "1.4rem",
  "--gd-fw-regular": "400",
  "--gd-fw-medium": "500",
  "--gd-fw-semibold": "600",
  "--gd-fw-bold": "700",
  "--gd-lh-display": "0.95",
  "--gd-lh-heading": "1.05",
  "--gd-lh-pullquote": "1.35",
  "--gd-lh-body": "1.55",
  "--gd-tr-mono": "0.18em",
  "--gd-tr-mono-s": "0.16rem",
  "--gd-tr-mono-wide": "0.22em",
  "--gd-color-fg": "#1d242d",
  "--gd-color-fg-strong": "#0c1117",
  "--gd-color-fg-muted": "#5a6168",
  "--gd-color-brand": "#fb6a1d",
  /* Context-aware role tokens. At root they alias the primitives;
     inside a .gd-surface--dark wrapper they re-point to on-dark
     equivalents. The displayed value shows the alias so the reader
     sees the indirection clearly. */
  "--gd-fg": "= --gd-color-fg",
  "--gd-fg-strong": "= --gd-color-fg-strong",
  "--gd-fg-muted": "= --gd-color-fg-muted",
};

export function ReadTypeRow({ className, sample, tokens, when }: Props) {
  const [expanded, setExpanded] = useState(false);
  const ruleId = useId();

  return (
    <tr>
      <td className="read-type-table__sample">
        <p className={`gd-type-row__sample ${className}`}>{sample}</p>
      </td>
      <td>
        <code className="read-type-table__rule">
          <button
            type="button"
            className="read-gd-class-lbl read-gd-class-lbl--toggle"
            aria-expanded={expanded}
            aria-controls={ruleId}
            onClick={() => setExpanded((x) => !x)}
          >
            .{className}
          </button>
          {expanded ? (
            <span id={ruleId}>
              <span className="read-type-table__brace"> {"{"}</span>
              {tokens.map((t) => (
                <span className="read-type-table__decl" key={t}>
                  <span className="read-type-table__prop">{tokenProperty(t)}:</span>{" "}
                  <span className="read-gd-token-lbl">{t}</span>
                  <span className="read-type-table__punct">;</span>{" "}
                  <span className="read-type-table__value">{TOKEN_VALUES[t] ?? "—"}</span>
                </span>
              ))}
              <span className="read-type-table__brace">{"}"}</span>
            </span>
          ) : null}
        </code>
      </td>
      <td className="read-type-table__when">{when}</td>
    </tr>
  );
}
