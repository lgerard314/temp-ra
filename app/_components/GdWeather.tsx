import type { ReactElement } from "react";

/**
 * GdWeather — decorative weather widget for the topnav.
 *
 * Static placeholder values (per spec — non-functional). Uses the
 * existing mono / display / muted vocabulary; introduces no new
 * tokens. The sun icon uses currentColor and is themed by tokens.css
 * to read in --gd-color-brand.
 */

export function GdWeather(): ReactElement {
  return (
    <span className="gd-weather" aria-label="Current weather in DFW">
      <svg
        className="gd-weather__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M4.5 19.5l2-2M17.5 6.5l2-2" />
      </svg>
      <span className="gd-weather__temp">86°</span>
      <span className="gd-weather__label">DFW · Clear</span>
    </span>
  );
}
