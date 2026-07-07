"use client";

import PanelNavLink from "@/components/PanelNavLink";

export default function BookACall({ className = "", wide = false }) {
  const blockClass = [
    "cta-block",
    wide && "cta-block--wide",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={blockClass}>
      <div className="cta-row">
        <PanelNavLink panelId="contact" className="book-a-call">
          Book A Call
        </PanelNavLink>
        <span className="spinner" aria-hidden="true">
          <span className="spinner-dot" />
          <span className="spinner-dot" />
          <span className="spinner-dot" />
          <span className="spinner-dot" />
          <span className="spinner-dot" />
          <span className="spinner-dot" />
          <span className="spinner-dot" />
          <span className="spinner-dot" />
        </span>
      </div>
      <span className="book-a-call-line" aria-hidden="true" />
    </div>
  );
}
