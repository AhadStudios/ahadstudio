"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/helpers";
import { usePanelNavigate } from "@/hooks/usePanelNavigate";

export default function MagneticCtaButton({
  href = "/contact",
  panelId,
  label = "Start A Project",
}) {
  const { navigateTo } = usePanelNavigate();
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const btn = btnRef.current;
    const glow = glowRef.current;
    if (!wrap || !btn || !glow) return undefined;

    if (!window.matchMedia("(pointer: fine)").matches) return undefined;

    const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
    const glowX = gsap.quickTo(glow, "x", { duration: 0.35, ease: "power2.out" });
    const glowY = gsap.quickTo(glow, "y", { duration: 0.35, ease: "power2.out" });

    const onMove = (event) => {
      const rect = wrap.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (event.clientX - centerX) * 0.32;
      const dy = (event.clientY - centerY) * 0.32;

      xTo(dx);
      yTo(dy);
      glowX(event.clientX - rect.left);
      glowY(event.clientY - rect.top);
      gsap.to(glow, { opacity: 0.9, scale: 1, duration: 0.3, ease: "power2.out" });
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
      gsap.to(glow, { opacity: 0, scale: 0.85, duration: 0.45, ease: "power2.out" });
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const handleClick = (event) => {
    if (!panelId) return;
    event.preventDefault();
    navigateTo(panelId);
  };

  return (
    <div className="our-work-magnetic-cta" ref={wrapRef}>
      <span className="our-work-magnetic-cta-glow" ref={glowRef} aria-hidden="true" />
      <a
        href={panelId ? "#" : href}
        className="our-work-magnetic-cta-btn"
        ref={btnRef}
        onClick={handleClick}
      >
        <span className="our-work-magnetic-cta-label">{label}</span>
        <span className="our-work-magnetic-cta-arrow" aria-hidden="true">
          →
        </span>
      </a>
    </div>
  );
}
