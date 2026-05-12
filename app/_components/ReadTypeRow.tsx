"use client";

import type { ReactNode } from "react";
import { GdClassChip } from "@/app/_components/GdClassChip";
import { UsesCell } from "@/app/_components/UsesCell";

/* Single row of the Typography table. The class chip in the Styles
   column renders via GdClassChip (same toggle + { styles } chrome as
   everywhere). The Uses column renders via the shared UsesCell with
   collapsable category badges (auto-derived from class names). */

type Props = {
  className: string;
  sample: ReactNode;
  tokens: string[];
  classes?: string[];
  when: string;
};

export function ReadTypeRow({ className, sample, tokens, classes, when }: Props) {
  return (
    <tr>
      <td className="read-type-table__sample">
        <p className={`gd-type-row__sample ${className}`}>{sample}</p>
      </td>
      <td>
        <GdClassChip className={className} tokens={tokens} />
      </td>
      <td>{classes?.length ? <UsesCell classes={classes} /> : null}</td>
      <td className="read-type-table__when">{when}</td>
    </tr>
  );
}
