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
  const introId = intro ? `${id}-intro` : null;
  const whenId = whenToUse ? `${id}-when` : null;
  const childrenId = `${id}-children`;
  const TitleTag = (level === 1 ? "h1" : "h2") as "h1" | "h2";
  const hasChildren = Boolean(children);
  const controlledIds = [introId, whenId, hasChildren ? childrenId : null]
    .filter(Boolean)
    .join(" ");
  const headerClassName = collapsed
    ? "read-section read-section--collapsed"
    : "read-section";

  return (
    <section id={id} aria-labelledby={titleId}>
      <header className={headerClassName}>
        <div className="read-section__heading">
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
          {intro ? (
            <p
              id={introId ?? undefined}
              className="read-section__intro"
              hidden={collapsed}
            >
              {intro}
            </p>
          ) : null}
        </div>
        {whenToUse ? (
          <p
            id={whenId ?? undefined}
            className="read-section__when"
            hidden={collapsed}
          >
            {whenToUse}
          </p>
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
