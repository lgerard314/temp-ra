"use client";

import { useEffect, useState, type ReactElement } from "react";
import { GdPhone } from "@/app/_components/GdPhone";
import { GdWeather } from "@/app/_components/GdWeather";

/**
 * SiteHeader — the real site chrome. Two stacked strips:
 *   .gd-banner   thin dark strip (collapses on scroll)
 *   .gd-topnav   logo + weather + tabs + phone slot + primary CTA
 *
 * Scroll state is tracked as a React boolean and reflected on the
 * header root as the .is-scrolled state class. NO design custom
 * properties are written at runtime — the only runtime-written CSS
 * variables in this repo are the three sanctioned UI-state ones
 * (--read-nav-x/y, --gd-slider-pos), and this scroll-collapse isn't
 * one of them. The class-based approach also means the transition
 * timings live in CSS (tokens) where they belong.
 *
 * `forceScrolled` lets the design guide demo render the compact state
 * side-by-side with the rest state without needing real scroll input.
 */

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Services",  href: "#" },
  { label: "Locations", href: "#" },
  { label: "Reviews",   href: "#" },
  { label: "Blog",      href: "#" },
  { label: "About",     href: "#" },
  { label: "Contact",   href: "#" },
];

const SCROLL_THRESHOLD_PX = 24;

export function SiteHeader({
  forceScrolled,
  embed,
}: {
  forceScrolled?: boolean;
  embed?: boolean;
} = {}): ReactElement {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Embed renders are static snapshots used inside the design guide —
    // they must never react to real page scroll, otherwise scrolling
    // down to read the section collapses the demo's banner and the
    // topbar is never seen. forceScrolled has the same effect (state
    // is pinned by the prop), so skip the listener in both cases.
    if (forceScrolled !== undefined || embed) return;
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [forceScrolled, embed]);

  const isScrolled = forceScrolled ?? scrolled;
  const className = [
    "gd-site-header",
    embed && "gd-site-header--embed",
    isScrolled && "is-scrolled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={className}>
      <div className="gd-banner">
        <div className="gd-banner__inner">
          <span className="gd-banner__meta">Licensed &amp; Insured · TX RCC #12345</span>
          <GdPhone tier="dark" />
        </div>
      </div>
      <nav className="gd-topnav" aria-label="Primary">
        <div className="gd-topnav__inner">
          <a className="gd-topnav__brand" href="/" aria-label="RA Contracting home">
            <img
              className="gd-topnav__logo"
              src="/photos/brand/logo-horizontal.svg"
              alt="RA Contracting"
            />
          </a>
          <GdWeather />
          <ul className="gd-topnav__links">
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={label}>
                <a className="gd-topnav__link" href={href}>{label}</a>
              </li>
            ))}
          </ul>
          <div className="gd-topnav__cta">
            <span className="gd-topnav__phone-slot">
              <GdPhone tier="light" />
            </span>
            <a className="gd-btn" href="#quote">Get a free quote</a>
          </div>
        </div>
      </nav>
    </header>
  );
}
