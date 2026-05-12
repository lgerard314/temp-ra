import type { ReactElement } from "react";

/**
 * GdPhone — the system's phone-number CTA link.
 *
 * Single component used in two slots (banner at top, topnav when
 * scrolled). The `tier` prop selects the on-dark vs on-light color
 * variant; both renders share identical structure and identical class
 * definitions in tokens.css.
 *
 * No background, no border (per spec). Icon sits to the LEFT of the
 * number; the icon uses currentColor so it follows the active tier.
 */

const E164 = "+15551234567";
const DISPLAY = "+1 (555) 123-4567";

export function GdPhone({
  tier = "light",
}: {
  tier?: "dark" | "light";
}): ReactElement {
  // Typography (mono family, fs-mono, bold, tr-mono, uppercase) comes
  // from .gd-mono composed onto the .gd-phone slot.
  const className =
    tier === "dark" ? "gd-phone gd-phone--on-dark gd-mono" : "gd-phone gd-mono";
  return (
    <a className={className} href={`tel:${E164}`} aria-label={`Call ${DISPLAY}`}>
      <svg
        className="gd-phone__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        aria-hidden="true"
      >
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
      </svg>
      <span>{DISPLAY}</span>
    </a>
  );
}
