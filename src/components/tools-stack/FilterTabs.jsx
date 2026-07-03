"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/helpers";
import { stackFilters } from "@/data/stackCategories";

export default function FilterTabs({ activeFilter, onChange }) {
  const trackRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const glow = glowRef.current;
    if (!track || !glow) return undefined;

    const activeButton = track.querySelector(".tools-stack-filter.is-active");
    if (!activeButton) return undefined;

    const moveGlow = (button) => {
      const trackRect = track.getBoundingClientRect();
      const rect = button.getBoundingClientRect();

      gsap.to(glow, {
        x: rect.left - trackRect.left,
        y: rect.top - trackRect.top,
        width: rect.width,
        height: rect.height,
        autoAlpha: 1,
        duration: 0.45,
        ease: "power3.out",
      });
    };

    moveGlow(activeButton);

    return undefined;
  }, [activeFilter]);

  return (
    <div
      className="tools-stack-filters"
      role="tablist"
      aria-label="Filter technology stack"
      ref={trackRef}
    >
      <span className="tools-stack-filter-glow" ref={glowRef} aria-hidden="true" />
      {stackFilters.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`tools-stack-filter${isActive ? " is-active" : ""}`}
            onClick={() => onChange(filter.id)}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
