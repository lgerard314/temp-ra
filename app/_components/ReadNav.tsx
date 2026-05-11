"use client";

import { useEffect, useId, useRef, useState } from "react";

const sections = [
  { hash: "#colors", label: "Colors" },
  { hash: "#typography", label: "Typography" },
  { hash: "#spacing", label: "Spacing & Padding" },
  { hash: "#borders", label: "Borders" },
  { hash: "#radii", label: "Radii" },
  { hash: "#shadows", label: "Shadows" },
  { hash: "#containers", label: "Containers" },
  { hash: "#header", label: "Site header" },
  { hash: "#motion", label: "Motion" },
  { hash: "#buttons", label: "Buttons & Links" },
  { hash: "#forms", label: "Form fields" },
  { hash: "#filebar", label: "Filebar" },
  { hash: "#tags", label: "Tags" },
  { hash: "#dividers", label: "Dividers" },
  { hash: "#ledger", label: "Ledger" },
  { hash: "#quotes", label: "Quotes" },
  { hash: "#trust", label: "Trust grid" },
  { hash: "#lists", label: "Lists" },
  { hash: "#warranty", label: "Warranty seal" },
  { hash: "#pm-listing", label: "PM listing" },
];

const imageSubs = [
  { hash: "#images-standard", label: "Standard" },
  { hash: "#frames-frame", label: "Frame" },
  { hash: "#frames-slider", label: "Slider" },
];

const cardSubs = [
  { hash: "#cards-standard", label: "Standard cards" },
  { hash: "#cards-image", label: "Image cards" },
];

export function ReadNav() {
  const navRef = useRef<HTMLElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const listId = useId();

  useEffect(() => {
    const nav = navRef.current;
    const handle = handleRef.current;
    if (!nav || !handle) return;

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // Writes only readability-namespace custom properties at runtime.
    // This is UI state, not a design decision — never a design value.
    const setPos = (x: number, y: number) => {
      const maxX = Math.max(0, window.innerWidth - nav.offsetWidth);
      const maxY = Math.max(0, window.innerHeight - nav.offsetHeight);
      const cx = Math.min(Math.max(0, x), maxX);
      const cy = Math.min(Math.max(0, y), maxY);
      nav.style.setProperty("--read-nav-x", `${cx}px`);
      nav.style.setProperty("--read-nav-y", `${cy}px`);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      const rect = nav.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      try {
        handle.setPointerCapture(e.pointerId);
      } catch {}
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      setPos(e.clientX - offsetX, e.clientY - offsetY);
    };

    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      try {
        handle.releasePointerCapture(e.pointerId);
      } catch {}
    };

    const onResize = () => {
      const rect = nav.getBoundingClientRect();
      setPos(rect.left, rect.top);
    };

    handle.addEventListener("pointerdown", onPointerDown);
    handle.addEventListener("pointermove", onPointerMove);
    handle.addEventListener("pointerup", onPointerUp);
    handle.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", onResize);

    return () => {
      handle.removeEventListener("pointerdown", onPointerDown);
      handle.removeEventListener("pointermove", onPointerMove);
      handle.removeEventListener("pointerup", onPointerUp);
      handle.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const navClassName = collapsed
    ? "read-nav read-nav--collapsed"
    : "read-nav";

  // Esc inside a group dismisses the flyout by blurring the focused
  // child — :focus-within drops, hover-only flyouts also collapse the
  // moment the pointer leaves. Keeps keyboard parity with mouse users.
  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Escape") return;
    const active = document.activeElement;
    if (active instanceof HTMLElement && navRef.current?.contains(active)) {
      active.blur();
    }
  };

  return (
    <nav
      className={navClassName}
      ref={navRef}
      aria-label="Design guide sections"
      onKeyDown={onKeyDown}
    >
      <div className="read-nav__bar">
        <div
          className="read-nav__handle"
          ref={handleRef}
          role="button"
          aria-label="Drag to reposition the guide navigator"
          tabIndex={0}
        >
          <span className="read-nav__handle-dots" aria-hidden="true">⋮⋮</span>
          <span>Guide nav</span>
        </div>
        <button
          type="button"
          className="read-nav__toggle"
          aria-expanded={!collapsed}
          aria-controls={listId}
          aria-label={collapsed ? "Expand guide navigator" : "Collapse guide navigator"}
          onClick={() => setCollapsed((c) => !c)}
        >
          <span aria-hidden="true">{collapsed ? "+" : "−"}</span>
        </button>
      </div>
      <ul className="read-nav__list" id={listId}>
        {sections.map(({ hash, label }) => (
          <li key={hash}>
            <a className="read-nav__link" href={hash}>
              {label}
            </a>
          </li>
        ))}
        <li className="read-nav__group">
          <a className="read-nav__link read-nav__link--parent" href="#images" aria-haspopup="true">
            <span>Images</span>
            <span className="read-nav__chevron" aria-hidden="true">›</span>
          </a>
          <ul className="read-nav__sub" aria-label="Images subsections">
            {imageSubs.map(({ hash, label }) => (
              <li key={hash}>
                <a className="read-nav__link" href={hash}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </li>
        <li className="read-nav__group">
          <a className="read-nav__link read-nav__link--parent" href="#cards" aria-haspopup="true">
            <span>Cards</span>
            <span className="read-nav__chevron" aria-hidden="true">›</span>
          </a>
          <ul className="read-nav__sub" aria-label="Cards subsections">
            {cardSubs.map(({ hash, label }) => (
              <li key={hash}>
                <a className="read-nav__link" href={hash}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}
