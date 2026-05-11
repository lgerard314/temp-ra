"use client";

import type { ReactNode } from "react";
import { useState } from "react";

type ReadSectionProps = {
  id: string;
  title: string;
  level?: 1 | 2;
  intro?: ReactNode;
  whenToUse?: ReactNode;
  children?: ReactNode;
};

export function ReadSection({
  id,
  title,
  level = 1,
  intro,
  whenToUse,
  children,
}: ReadSectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const titleId = `${id}-title`;
  const headerBodyId = `${id}-header-body`;
  const childrenId = `${id}-children`;
  const TitleTag = (level === 1 ? "h1" : "h2") as "h1" | "h2";
  const hasHeaderBody = Boolean(intro) || Boolean(whenToUse);
  const hasChildren = Boolean(children);
  const controlledIds = [
    hasHeaderBody ? headerBodyId : null,
    hasChildren ? childrenId : null,
  ]
    .filter(Boolean)
    .join(" ");
  const headerClassName = collapsed
    ? "read-section read-section--collapsed"
    : "read-section";

  return (
    <section id={id} aria-labelledby={titleId}>
      <header className={headerClassName}>
        <TitleTag className="read-section__title" id={titleId}>
          <button
            type="button"
            className="read-section__title-btn"
            aria-expanded={!collapsed}
            aria-controls={controlledIds || undefined}
            onClick={() => setCollapsed((c) => !c)}
          >
            <span className="read-section__title-text">{title}</span>
            <span className="read-section__chevron" aria-hidden="true" />
          </button>
        </TitleTag>
        {hasHeaderBody ? (
          <div
            id={headerBodyId}
            className="read-section__body"
            hidden={collapsed}
          >
            {intro ? <p className="read-section__intro">{intro}</p> : null}
            {whenToUse ? <p className="read-section__when">{whenToUse}</p> : null}
          </div>
        ) : null}
      </header>
      {hasChildren ? (
        <div id={childrenId} hidden={collapsed}>
          {children}
        </div>
      ) : null}
    </section>
  );
}
