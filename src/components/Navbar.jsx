"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/helpers";
import WorldClockWidget from "@/components/WorldClockWidget";
import PageDropdownMenu from "@/components/PageDropdownMenu";
import { useIntroExperience } from "@/components/intro/IntroExperienceProvider";
import {
  INTERNAL_PANEL_IDS,
  useShowcaseScroll,
} from "@/context/ShowcaseScrollContext";

const ENTER_DURATION = 0.65;
const EXIT_DURATION = 0.4;

export default function Navbar() {
  const { introComplete } = useIntroExperience();
  const { activePanelId, isShowcaseActive } = useShowcaseScroll();

  const heroRef = useRef(null);
  const pillRef = useRef(null);
  const modeRef = useRef("hero");

  const showPill =
    introComplete &&
    isShowcaseActive &&
    INTERNAL_PANEL_IDS.has(activePanelId);

  useEffect(() => {
    const hero = heroRef.current;
    const pill = pillRef.current;
    if (!hero || !pill || !introComplete) return undefined;

    const nextMode = showPill ? "pill" : "hero";
    if (modeRef.current === nextMode) return undefined;

    modeRef.current = nextMode;

    if (nextMode === "pill") {
      gsap.killTweensOf([hero, pill]);
      gsap.set(pill, { visibility: "visible", pointerEvents: "auto" });
      gsap.to(hero, {
        autoAlpha: 0,
        y: -8,
        duration: EXIT_DURATION,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(hero, { visibility: "hidden", pointerEvents: "none" });
        },
      });
      gsap.fromTo(
        pill,
        { autoAlpha: 0, y: -10, scale: 0.98, filter: "blur(4px)" },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: ENTER_DURATION,
          ease: "power3.out",
        },
      );
      return undefined;
    }

    gsap.killTweensOf([hero, pill]);
    gsap.set(hero, { visibility: "visible", pointerEvents: "auto" });
    gsap.to(pill, {
      autoAlpha: 0,
      y: -8,
      scale: 0.98,
      filter: "blur(4px)",
      duration: EXIT_DURATION,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(pill, { visibility: "hidden", pointerEvents: "none" });
      },
    });
    gsap.fromTo(
      hero,
      { autoAlpha: 0, y: -8 },
      { autoAlpha: 1, y: 0, duration: ENTER_DURATION, ease: "power3.out" },
    );

    return undefined;
  }, [showPill, introComplete]);

  useEffect(() => {
    if (!introComplete) return undefined;

    const hero = heroRef.current;
    const pill = pillRef.current;
    if (!hero || !pill) return undefined;

    gsap.set(hero, { autoAlpha: 1, y: 0, visibility: "visible", pointerEvents: "auto" });
    gsap.set(pill, {
      autoAlpha: 0,
      y: -8,
      scale: 0.98,
      filter: "blur(4px)",
      visibility: "hidden",
      pointerEvents: "none",
    });
    modeRef.current = "hero";

    return undefined;
  }, [introComplete]);

  return (
    <>
      <header className="navbar navbar--hero" ref={heroRef} aria-label="Site navigation">
        <a href="/" className="navbar-logo">
          AHADSTUDIOS<span className="navbar-logo-mark">®</span>
        </a>

        <div className="navbar-actions">
          <PageDropdownMenu />
        </div>
      </header>

      <header
        className="navbar navbar--pill"
        ref={pillRef}
        aria-label="Site navigation"
        aria-hidden={!showPill}
      >
        <div className="navbar-pill-inner">
          <div className="navbar-pill-slot navbar-pill-slot--start">
            <WorldClockWidget active={showPill} compact />
          </div>

          <a href="/" className="navbar-logo navbar-logo--pill">
            AHADSTUDIOS<span className="navbar-logo-mark">®</span>
          </a>

          <div className="navbar-pill-slot navbar-pill-slot--end">
            <PageDropdownMenu />
          </div>
        </div>
      </header>
    </>
  );
}
