"use client";

import { useRef } from "react";

const ratioClass = {
  cinema:    "gd-ratio--cinema",
  wide:      "gd-ratio--wide",
  landscape: "gd-ratio--landscape",
  portrait:  "gd-ratio--portrait",
  square:    "gd-ratio--square",
} as const;

type RatioKey = keyof typeof ratioClass;

type Props = {
  ratio: RatioKey;
  metaLabel: string;
  metaValue: string;
};

// Writes --gd-slider-pos (UI state, not a design value) at runtime via
// setProperty — same pattern the floating-nav drag handler uses for its
// own UI-state custom properties.
export function GdSlider({ ratio, metaLabel, metaValue }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const x = clientX - rect.left;
    const clamped = Math.min(Math.max(x, 0), rect.width);
    const pct = (clamped / rect.width) * 100;
    el.style.setProperty("--gd-slider-pos", `${pct}%`);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={ref}
      className={`gd-ratio ${ratioClass[ratio]} gd-slider`}
      role="slider"
      aria-label={`Before/after comparison — ${metaLabel}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <span className="gd-slider__layer gd-slider__layer--before" aria-hidden="true" />
      <span className="gd-slider__layer gd-slider__layer--after" aria-hidden="true" />
      <span className="gd-slider__tag gd-slider__tag--before">Before</span>
      <span className="gd-slider__tag gd-slider__tag--after">After</span>
      <span className="gd-slider__handle" aria-hidden="true" />
      <span className="gd-slider__grip" aria-hidden="true">↔</span>
      <span className="gd-slider__meta">
        <span>
          <span className="gd-slider__meta-num">§ 02</span> · {metaLabel}
        </span>
        <span>{metaValue}</span>
      </span>
    </div>
  );
}
