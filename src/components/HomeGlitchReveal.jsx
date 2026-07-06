"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/helpers";
import { useIntroExperience } from "@/components/intro/IntroExperienceProvider";

export default function HomeGlitchReveal() {
  const { introComplete } = useIntroExperience();

  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const imgRef = useRef(null);
  const cyanRef = useRef(null);
  const redRef = useRef(null);
  const ctxRef = useRef(null);
  const briefRef = useRef(null);
  const briefCtxRef = useRef(null);

  // Ensure RGB layers are hidden before first paint
  useLayoutEffect(() => {
    if (cyanRef.current) gsap.set(cyanRef.current, { opacity: 0, x: 0 });
    if (redRef.current) gsap.set(redRef.current, { opacity: 0, x: 0 });
  }, []);

  useEffect(() => {
    if (!introComplete || !sectionRef.current || !frameRef.current) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const section = sectionRef.current;
    const frame = frameRef.current;
    const img = imgRef.current;
    const cyan = cyanRef.current;
    const red = redRef.current;
    const scroller = section.closest(".showcase-panel-inner") || undefined;

    if (prefersReducedMotion) {
      // Static display — no animation
      gsap.set(frame, {
        opacity: 1,
        scale: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0% round 999px)",
        filter: "blur(0px) saturate(1)",
      });
      return undefined;
    }

    ctxRef.current = gsap.context(() => {
      // ── 1. Main reveal: clipPath expand + fade + scale ────────────────────────
      gsap.fromTo(
        frame,
        {
          clipPath: "inset(46% 18% 46% 18% round 999px)",
          opacity: 0,
          scale: 0.88,
          y: 90,
          filter: "blur(22px) saturate(1.5)",
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 999px)",
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px) saturate(1.06)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top 95%",
            end: "top 8%",
            scrub: 1.4,
            invalidateOnRefresh: true,
          },
        },
      );

      // ── 2. Parallax — image drifts inside the capsule while scrolling ─────────
      if (img) {
        gsap.fromTo(
          img,
          { yPercent: -9 },
          {
            yPercent: 9,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              scroller,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      // ── 3. RGB glitch flicker — time-based, fires when section enters ─────────
      function playGlitch(strength = 1) {
        if (!cyan || !red) return;
        const tl = gsap.timeline();
        const s = strength;

        // Hit 1
        tl.fromTo(cyan, { x: -6 * s, opacity: 0.72 * s }, { x: 0, opacity: 0, duration: 0.1 });
        tl.fromTo(red, { x: 6 * s, opacity: 0.72 * s }, { x: 0, opacity: 0, duration: 0.1 }, 0);
        // Brief pause
        tl.to({}, { duration: 0.06 });
        // Hit 2 (softer)
        tl.fromTo(cyan, { x: -4 * s, opacity: 0.5 * s }, { x: 0, opacity: 0, duration: 0.09 });
        tl.fromTo(red, { x: 4 * s, opacity: 0.5 * s }, { x: 0, opacity: 0, duration: 0.09 }, "<");
        // Quick micro-hit 3
        tl.to({}, { duration: 0.04 });
        tl.fromTo(cyan, { x: -2 * s, opacity: 0.3 * s }, { x: 0, opacity: 0, duration: 0.07 });
        tl.fromTo(red, { x: 2 * s, opacity: 0.3 * s }, { x: 0, opacity: 0, duration: 0.07 }, "<");
      }

      ScrollTrigger.create({
        trigger: section,
        scroller,
        start: "top 88%",
        onEnter: () => playGlitch(1),
        onEnterBack: () => playGlitch(0.65),
      });
    }, section);

    // Refresh after setup so Lenis + GSAP are in sync
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 150);

    return () => {
      window.clearTimeout(t);
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [introComplete]);

  // Brief "At AhadStudios..." text section animations
  useEffect(() => {
    if (!introComplete || !briefRef.current) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const brief = briefRef.current;
    const scroller = brief.closest(".showcase-panel-inner") || undefined;

    briefCtxRef.current = gsap.context(() => {
      if (prefersReducedMotion) return;

      const txt = brief.querySelector(".home-about-brief-text");
      const btn = brief.querySelector(".home-about-brief-btn");

      if (txt) {
        gsap.fromTo(
          txt,
          { opacity: 0, y: 50, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: brief,
              scroller,
              start: "top 82%",
              toggleActions: "restart none restart none",
            },
          },
        );
      }
      if (btn) {
        gsap.fromTo(
          btn,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: brief,
              scroller,
              start: "top 78%",
              toggleActions: "restart none restart none",
            },
          },
        );
      }
    }, brief);

    return () => {
      briefCtxRef.current?.revert();
      briefCtxRef.current = null;
    };
  }, [introComplete]);

  return (
    <>
      <section className="home-glitch-reveal" ref={sectionRef} aria-label="Visual showcase">
        <div className="home-glitch-pin">
          <div className="home-glitch-frame" ref={frameRef}>
            <img
              src="/glitch.png"
              alt="AhadStudios glitch visual"
              className="home-glitch-img"
              ref={imgRef}
              draggable="false"
            />
            <img
              src="/glitch.png"
              alt=""
              aria-hidden="true"
              className="home-glitch-rgb-layer home-glitch-rgb-layer--cyan"
              ref={cyanRef}
              draggable="false"
            />
            <img
              src="/glitch.png"
              alt=""
              aria-hidden="true"
              className="home-glitch-rgb-layer home-glitch-rgb-layer--red"
              ref={redRef}
              draggable="false"
            />
          </div>
        </div>
      </section>

      <section className="home-about-brief" ref={briefRef} aria-label="About AhadStudios">
        <div className="home-about-brief-inner">
          <p className="home-about-brief-text">
            At AhadStudios, we transform bold ideas into immersive digital experiences through
            sharp design, clean development, and relentless creativity.
          </p>
          <button type="button" className="home-about-brief-btn">
            More about us
          </button>
        </div>
      </section>
    </>
  );
}
