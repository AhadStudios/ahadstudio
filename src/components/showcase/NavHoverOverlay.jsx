"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/helpers";
import { WORK_HOVER_ENTRIES } from "@/data/navHoverContent";
import NavPreview from "@/components/showcase/NavPreview";
import { showcaseNavItems } from "@/data/sectionNav";

const PANEL_IDS = showcaseNavItems.map((item) => item.id);

const HIDDEN = {
  autoAlpha: 0,
  scale: 0.96,
  filter: "blur(14px)",
};

const VISIBLE = {
  autoAlpha: 1,
  scale: 1,
  filter: "blur(0px)",
};

function resetPanel(panel) {
  if (!panel) return;

  gsap.killTweensOf(panel.querySelectorAll("[data-hover-step], [data-hover-intro], [data-hover-card], [data-hover-icon], [data-hover-form], [data-hover-glow]"));

  gsap.set(panel, { autoAlpha: 0, pointerEvents: "none" });
  gsap.set(panel.querySelectorAll("[data-hover-step]"), {
    ...HIDDEN,
    y: 36,
  });
  gsap.set(panel.querySelectorAll("[data-hover-intro]"), {
    ...HIDDEN,
    y: 28,
  });
  gsap.set(panel.querySelectorAll("[data-hover-card]"), {
    ...HIDDEN,
    rotation: 0,
  });
  gsap.set(panel.querySelectorAll("[data-hover-icon]"), {
    ...HIDDEN,
    y: 24,
    xPercent: -50,
    yPercent: -50,
  });
  gsap.set(panel.querySelector("[data-hover-form]"), {
    ...HIDDEN,
    y: 32,
  });
  gsap.set(panel.querySelector("[data-hover-glow]"), {
    autoAlpha: 0,
    scale: 0.85,
  });
}

function animateHome(panel, timeline) {
  const steps = panel.querySelectorAll("[data-hover-step]");
  steps.forEach((step, index) => {
    const enter = index * 0.42;
    timeline.fromTo(
      step,
      { autoAlpha: 0, y: 36, scale: 0.96, filter: "blur(10px)" },
      { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.32, ease: "power3.out" },
      enter,
    );
    if (index < steps.length - 1) {
      timeline.to(
        step,
        { autoAlpha: 0, y: -24, filter: "blur(8px)", duration: 0.22, ease: "power2.in" },
        enter + 0.34,
      );
    }
  });
}

function animateWork(panel, timeline) {
  const intros = panel.querySelectorAll("[data-hover-intro]");
  const cards = panel.querySelectorAll("[data-hover-card]");

  timeline.fromTo(
    intros[0],
    { autoAlpha: 0, y: 28, scale: 0.96, filter: "blur(10px)" },
    { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power3.out" },
    0,
  );
  timeline.fromTo(
    intros[1],
    { autoAlpha: 0, y: 24, scale: 0.97, filter: "blur(8px)" },
    { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "power3.out" },
    0.18,
  );

  cards.forEach((card, index) => {
    const entry = WORK_HOVER_ENTRIES[index] || WORK_HOVER_ENTRIES[0];
    timeline.fromTo(
      card,
      {
        autoAlpha: 0,
        x: entry.x,
        y: entry.y,
        scale: 0.88,
        rotation: entry.rotation,
        filter: "blur(12px)",
      },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        filter: "blur(0px)",
        duration: 0.72,
        ease: "power3.out",
      },
      0.34 + index * 0.12,
    );
  });
}

function animateStack(panel, timeline) {
  const title = panel.querySelector("[data-hover-intro]");
  const icons = panel.querySelectorAll("[data-hover-icon]");

  timeline.fromTo(
    title,
    { autoAlpha: 0, y: 30, scale: 0.95, filter: "blur(10px)" },
    { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "power3.out" },
    0,
  );

  icons.forEach((icon, index) => {
    timeline.fromTo(
      icon,
      { autoAlpha: 0, y: 40, xPercent: -50, yPercent: -50, scale: 0.82, filter: "blur(10px)" },
      { autoAlpha: 1, y: 0, xPercent: -50, yPercent: -50, scale: 1, filter: "blur(0px)", duration: 0.55, ease: "power3.out" },
      0.2 + index * 0.08,
    );
    timeline.to(
      icon,
      { y: -10, xPercent: -50, yPercent: -50, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 },
      0.75 + index * 0.08,
    );
  });
}

function animateContact(panel, timeline) {
  const title = panel.querySelector("[data-hover-intro]");
  const form = panel.querySelector("[data-hover-form]");
  const glow = panel.querySelector("[data-hover-glow]");

  timeline.fromTo(
    glow,
    { autoAlpha: 0, scale: 0.85 },
    { autoAlpha: 0.55, scale: 1, duration: 0.8, ease: "power2.out" },
    0,
  );
  timeline.to(glow, {
    scale: 1.08,
    autoAlpha: 0.7,
    duration: 2.4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  timeline.fromTo(
    title,
    { autoAlpha: 0, y: 32, scale: 0.96, filter: "blur(12px)" },
    { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.55, ease: "power3.out" },
    0.08,
  );
  timeline.fromTo(
    form,
    { autoAlpha: 0, y: 36, scale: 0.94, filter: "blur(10px)" },
    { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.65, ease: "power3.out" },
    0.28,
  );
}

const PANEL_ANIMATORS = {
  hero: animateHome,
  work: animateWork,
  stack: animateStack,
  contact: animateContact,
};

export default function NavHoverOverlay({ activePanelId, disabled }) {
  const rootRef = useRef(null);
  const panelRefs = useRef({});
  const timelineRef = useRef(null);

  useEffect(() => {
    PANEL_IDS.forEach((id) => resetPanel(panelRefs.current[id]));
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    timelineRef.current?.kill();
    timelineRef.current = null;

    if (!activePanelId || disabled) {
      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => {
          PANEL_IDS.forEach((id) => resetPanel(panelRefs.current[id]));
        },
      });
      return undefined;
    }

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return undefined;
    }

    const panel = panelRefs.current[activePanelId];
    if (!panel) return undefined;

    PANEL_IDS.forEach((id) => {
      if (id !== activePanelId) resetPanel(panelRefs.current[id]);
    });

    resetPanel(panel);
    gsap.set(panel, { autoAlpha: 1, pointerEvents: "none" });

    gsap.to(root, {
      autoAlpha: 1,
      duration: 0.55,
      ease: "power3.out",
    });

    const timeline = gsap.timeline();
    timelineRef.current = timeline;

    const animate = PANEL_ANIMATORS[activePanelId];
    if (typeof animate === "function") {
      try {
        animate(panel, timeline);
      } catch (error) {
        console.error("[nav-hover] preview animation failed", activePanelId, error);
      }
    }

    return () => {
      timeline.kill();
    };
  }, [activePanelId, disabled]);

  return (
    <div
      ref={rootRef}
      className="nav-hover-overlay"
      aria-hidden={!activePanelId}
      data-active-panel={activePanelId || ""}
    >
      <div className="nav-hover-overlay-scrim" aria-hidden="true" />
      {PANEL_IDS.map((panelId) => (
        <div
          key={panelId}
          ref={(node) => {
            panelRefs.current[panelId] = node;
          }}
          className={`nav-hover-overlay-panel nav-hover-overlay-panel--${panelId}`}
          data-panel={panelId}
        >
          <NavPreview panelId={panelId} />
        </div>
      ))}
    </div>
  );
}
