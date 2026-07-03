"use client";

import { useEffect, useState } from "react";

export default function GlassWidget() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = document.querySelector(".trusted-brands");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.08 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <aside
      className={`glass-widget${visible ? " is-visible" : ""}`}
      aria-label="Quick actions"
      aria-hidden={!visible}
    >
      <button type="button" className="glass-widget-star" aria-label="Highlight">
        <img src="/star.svg" alt="" draggable="false" />
      </button>
      <span className="glass-widget-divider" aria-hidden="true" />
    </aside>
  );
}
