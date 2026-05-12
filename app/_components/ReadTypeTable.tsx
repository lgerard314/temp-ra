"use client";

import { useState, type ReactNode } from "react";
import { ReadTypeRow } from "@/app/_components/ReadTypeRow";

/* Typography table with a surface-toggle header. Owns a `surface`
   state that switches the demo wrapper's background between the four
   canonical design surfaces (page / warm / surface / dark). On dark,
   adds .gd-surface--dark to the wrapper so the typography role-token
   cascade re-points --gd-fg* for every sample inside — no per-row
   override needed. */

type TypeRole = {
  className: string;
  sample: ReactNode;
  tokens: string[];
  /* Flat list of slot classes that compose this typography role in JSX
     (e.g. .gd-h4 is composed by .gd-card__title and .gd-weather__temp).
     UsesCell categorizes them into component-area badges at render
     time. Omit / empty for roles used standalone via their own
     className (.gd-display, .gd-stat, .gd-pullquote). */
  classes?: string[];
  when: string;
};

type Surface = "page" | "warm" | "surface" | "dark";

const SURFACES: { id: Surface; label: string }[] = [
  { id: "page",    label: "Page" },
  { id: "warm",    label: "Warm" },
  { id: "surface", label: "Surface" },
  { id: "dark",    label: "Dark" },
];

export function ReadTypeTable({ roles }: { roles: TypeRole[] }) {
  const [surface, setSurface] = useState<Surface>("page");
  const wrapperClass = [
    "read-type-surface",
    surface === "dark" && "gd-surface--dark",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div
        className="read-surface-toggle"
        role="group"
        aria-label="Sample background surface"
      >
        {SURFACES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="read-surface-toggle__btn"
            aria-pressed={surface === id}
            onClick={() => setSurface(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={wrapperClass} data-surface={surface}>
        <table className="read-type-table">
          <thead>
            <tr>
              <th scope="col">Sample</th>
              <th scope="col">Styles</th>
              <th scope="col">Uses</th>
              <th scope="col">When to use</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(({ className, sample, tokens, classes, when }) => (
              <ReadTypeRow
                key={className}
                className={className}
                sample={sample}
                tokens={tokens}
                classes={classes}
                when={when}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
