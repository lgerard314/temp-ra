"use client";

import { Fragment, useId, useState, type ReactElement } from "react";
import { GdClassChip } from "@/app/_components/GdClassChip";

/* UsesCell — the collapsable "Uses" column shared by every token table.
   A row passes a flat list of consumer class names; UsesCell sorts each
   consumer into one of the system's component-area categories and
   renders one .read-use-badge per category present. Each badge is a
   button that toggles a disclosure panel of GdClassChip pills for the
   classes in that category, BEM-grouped (parent + attached suffix
   chips like .gd-card __title __eyebrow __link __photo). */

type Category =
  | "type"
  | "header"
  | "buttons"
  | "forms"
  | "cards"
  | "media"
  | "filebar"
  | "ledger"
  | "audit"
  | "trust"
  | "pm"
  | "quote"
  | "lists"
  | "marks"
  | "surface"
  | "section";

const CATEGORY_LABELS: Record<Category, string> = {
  type: "Type",
  header: "Header",
  buttons: "Buttons",
  forms: "Forms",
  cards: "Cards",
  media: "Media",
  filebar: "Filebar",
  ledger: "Ledger",
  audit: "Audit",
  trust: "Trust",
  pm: "PM",
  quote: "Quote",
  lists: "Lists",
  marks: "Marks",
  surface: "Surface",
  section: "Section",
};

/* Render order — badges always appear in this order regardless of which
   classes happen to come first in the input list. Structural categories
   (type, surface, section) lead; component areas follow in
   roughly-page-flow order. */
const CATEGORY_ORDER: Category[] = [
  "type",
  "section",
  "surface",
  "header",
  "buttons",
  "forms",
  "filebar",
  "cards",
  "media",
  "ledger",
  "audit",
  "trust",
  "pm",
  "quote",
  "lists",
  "marks",
];

/* Membership for typography-role classes — explicit set so a future
   class like `.gd-headway` can't accidentally land in `type` by
   prefix-match. */
const TYPE_ROLES = new Set<string>([
  "gd-display", "gd-h1", "gd-h2", "gd-h2-display", "gd-h3", "gd-h4", "gd-h5",
  "gd-body", "gd-body-l", "gd-body-s",
  "gd-mono", "gd-mono-s", "gd-mono-xs",
  "gd-mono-data",
  "gd-mono--medium", "gd-mono-s--bold", "gd-mono-xs--bold",
  "gd-mono-data--l", "gd-mono-data--semibold", "gd-mono-data--bold", "gd-mono-data--uppercase",
  "gd-eyebrow", "gd-pullquote", "gd-serif", "gd-stat", "gd-accent",
]);

function categorize(c: string): Category | null {
  const stripped = c.replace(/^\./, "");
  if (/[\s()>]/.test(stripped)) return null;

  if (TYPE_ROLES.has(stripped)) return "type";

  if (stripped === "gd-section") return "section";
  if (stripped === "gd-surface--dark") return "surface";

  if (
    stripped.startsWith("gd-banner")
    || stripped.startsWith("gd-topnav")
    || stripped.startsWith("gd-site-header")
    || stripped.startsWith("gd-phone")
    || stripped.startsWith("gd-weather")
  ) return "header";

  if (stripped.startsWith("gd-btn") || stripped.startsWith("gd-link")) return "buttons";

  if (
    stripped === "gd-input"
    || stripped === "gd-textarea"
    || stripped === "gd-select"
    || stripped === "gd-label"
    || stripped.startsWith("gd-field")
  ) return "forms";

  if (stripped.startsWith("gd-filebar")) return "filebar";
  if (stripped.startsWith("gd-card")) return "cards";
  if (stripped.startsWith("gd-ledger")) return "ledger";
  if (stripped.startsWith("gd-audit-row")) return "audit";
  if (stripped.startsWith("gd-trust") || stripped.startsWith("gd-bar")) return "trust";
  if (stripped.startsWith("gd-pm")) return "pm";
  if (stripped.startsWith("gd-quote")) return "quote";
  if (stripped.startsWith("gd-list")) return "lists";

  if (
    stripped.startsWith("gd-warranty")
    || stripped === "gd-stamp"
    || stripped === "gd-chip" || stripped === "gd-chips"
    || stripped.startsWith("gd-status")
    || stripped === "gd-divider"
  ) return "marks";

  if (
    stripped.startsWith("gd-image")
    || stripped === "gd-caption"
    || stripped === "gd-caption-meta"
    || stripped.startsWith("gd-ratio")
    || stripped.startsWith("gd-frame")
    || stripped.startsWith("gd-slider")
  ) return "media";

  return null;
}

/* ---- BEM grouping inside a category's disclosure panel --------------- */

type ClassGroup = {
  root: string;
  /* "" means the root class itself is a consumer; non-empty values are
     BEM suffixes that resolve to {root}{suffix} for the rule-body lookup. */
  variants: string[];
};

function splitClassName(c: string): { root: string; suffix: string } | null {
  const stripped = c.replace(/^\./, "");
  if (/[\s()>]/.test(stripped)) return null;
  const elIdx = stripped.indexOf("__");
  const modIdx = stripped.indexOf("--");
  let cutAt = -1;
  if (elIdx >= 0 && (modIdx < 0 || elIdx < modIdx)) cutAt = elIdx;
  else if (modIdx >= 0) cutAt = modIdx;
  if (cutAt < 0) return { root: stripped, suffix: "" };
  return { root: stripped.slice(0, cutAt), suffix: stripped.slice(cutAt) };
}

function groupByRoot(classes: string[]): { groups: ClassGroup[]; standalone: string[] } {
  const order: string[] = [];
  const map = new Map<string, string[]>();
  const standalone: string[] = [];
  for (const c of classes) {
    const split = splitClassName(c);
    if (!split) {
      standalone.push(c);
      continue;
    }
    if (!map.has(split.root)) {
      map.set(split.root, []);
      order.push(split.root);
    }
    map.get(split.root)!.push(split.suffix);
  }
  const groups = order.map((root) => ({ root, variants: map.get(root)! }));
  return { groups, standalone };
}

/* ---- Component ------------------------------------------------------- */

export function UsesCell({ classes }: { classes: string[] }): ReactElement | null {
  /* Independent expansion state per category — every badge on the row
     can be opened simultaneously. Stored as a Set of category keys. */
  const [open, setOpen] = useState<Set<Category>>(new Set());
  const baseId = useId();

  if (!classes.length) return null;

  /* Bucket consumers by category in stable render order. Uncategorizable
     entries (annotations like ".gd-rule-active (role token)" or
     descendant selectors) bubble into a generic "other" bucket which
     renders as plain non-interactive chips at the end. */
  const buckets = new Map<Category, string[]>();
  const other: string[] = [];
  for (const c of classes) {
    const cat = categorize(c);
    if (!cat) { other.push(c); continue; }
    if (!buckets.has(cat)) buckets.set(cat, []);
    buckets.get(cat)!.push(c);
  }
  const orderedCats = CATEGORY_ORDER.filter((c) => buckets.has(c));

  const toggle = (k: Category) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  return (
    <div className="read-uses">
      {orderedCats.map((cat) => {
        const cs = buckets.get(cat)!;
        const expanded = open.has(cat);
        const panelId = `${baseId}-${cat}`;
        return (
          <Fragment key={cat}>
            <button
              type="button"
              className={`read-use-badge read-use-badge--${cat}`}
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => toggle(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </button>
            {expanded ? (() => {
              const { groups, standalone } = groupByRoot(cs);
              return (
                <div id={panelId} className="read-uses__expand read-gd-tokens">
                  {groups.map(({ root, variants }) => {
                    const hasBase = variants.includes("");
                    const suffixes = variants.filter((v) => v !== "");

                    /* Single-consumer family — no grouping benefit. Render
                       the one entry as its full class name. Avoids the
                       misleading display where ".gd-slider __grip" implies
                       ".gd-slider" is itself a consumer. */
                    if (variants.length === 1) {
                      const sole = variants[0];
                      return <GdClassChip key={`${root}${sole}`} className={`${root}${sole}`} />;
                    }

                    /* Multi-consumer family. The parent chip is interactive
                       (full rule body) ONLY when the root class is actually
                       in the consumer list (hasBase). Otherwise it's a
                       non-interactive marker showing the family prefix —
                       visually distinct so the user can tell at a glance
                       which entries are real consumers vs. hierarchy hooks. */
                    return (
                      <span key={root} className="read-class-group">
                        {hasBase ? (
                          <GdClassChip className={root} />
                        ) : (
                          <span className="read-class-marker">.{root}</span>
                        )}
                        {suffixes.map((s) => (
                          <GdClassChip
                            key={s}
                            className={`${root}${s}`}
                            displayName={s}
                          />
                        ))}
                      </span>
                    );
                  })}
                  {standalone.map((c) => (
                    <span key={c} className="read-gd-class-lbl">
                      {c.startsWith(".") ? c : `.${c}`}
                    </span>
                  ))}
                </div>
              );
            })() : null}
          </Fragment>
        );
      })}
      {other.length ? (
        <div className="read-uses__expand read-gd-tokens">
          {other.map((c) => (
            <span key={c} className="read-gd-class-lbl">
              {c.startsWith(".") ? c : `.${c}`}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
