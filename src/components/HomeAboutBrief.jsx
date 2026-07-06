"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/helpers";

const SENTENCE =
  "At AhadStudios, we transform bold ideas into immersive digital experiences through sharp design, clean development, and relentless creativity.";

const WORDS = SENTENCE.split(" ");

export default function HomeAboutBrief() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Use the same custom scroller every other home section uses
    const scroller = section.closest(".showcase-panel-inner") || undefined;

    const words = gsap.utils.toArray(section.querySelectorAll(".about-word"));
    const btn = section.querySelector(".home-about-button");

    // ── Diagnostics ──────────────────────────────────────────────────────────
    console.log("[HomeAboutBrief] mounted");
    console.log("[HomeAboutBrief] words found:", words.length);
    console.log("[HomeAboutBrief] button found:", !!btn);
    console.log("[HomeAboutBrief] scroller:", scroller ? scroller.className : "window");

    if (!words.length) {
      console.warn("[HomeAboutBrief] No .about-word spans found — aborting animation setup");
      return;
    }

    const ctx = gsap.context(() => {
      // Hide words via GSAP (text stays visible if JS ever fails — no CSS opacity:0)
      gsap.set(words, { opacity: 0, y: 32, filter: "blur(12px)", scale: 0.96 });
      if (btn) gsap.set(btn, { opacity: 0, y: 24, scale: 0.96 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1,
          markers: false,
          invalidateOnRefresh: true,
        },
      });

      // ── Stage 1: Word reveal ─────────────────────────────────────────────
      tl.to(words, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        stagger: 0.06,
        ease: "power3.out",
        duration: 1,
      });

      if (btn) {
        tl.to(
          btn,
          { opacity: 1, y: 0, scale: 1, ease: "power3.out", duration: 0.5 },
          "-=0.2",
        );
      }

      // ── Stage 2: Hold ────────────────────────────────────────────────────
      tl.to({}, { duration: 0.4 });

      // ── Stage 3: Scatter words as particles ──────────────────────────────
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const scatterX = isMobile ? 140 : 180;
      const scatterY = isMobile ? 120 : 160;

      tl.to(words, {
        x: () => gsap.utils.random(-scatterX, scatterX),
        y: () => gsap.utils.random(-scatterY, scatterY),
        rotation: () => gsap.utils.random(-18, 18),
        opacity: 0,
        filter: "blur(12px)",
        stagger: { amount: 0.45, from: "random" },
        ease: "power4.inOut",
        duration: 1,
      });

      if (btn) {
        tl.to(
          btn,
          { opacity: 0, y: 30, filter: "blur(8px)", ease: "power3.inOut", duration: 0.45 },
          "-=0.5",
        );
      }

      // Give Lenis + layout time to settle before computing scroll positions
      const refreshId = window.setTimeout(() => {
        ScrollTrigger.refresh();
        console.log("[HomeAboutBrief] ScrollTrigger refreshed");
      }, 400);

      console.log("[HomeAboutBrief] ScrollTrigger setup complete");

      // Store the timeout so we can cancel it on cleanup
      ctx._cleanupTimeout = refreshId;
    }, section);

    return () => {
      if (ctx._cleanupTimeout) window.clearTimeout(ctx._cleanupTimeout);
      ctx.revert();
    };
  }, []); // Run once after mount

  return (
    <section
      className="home-about-brief"
      ref={sectionRef}
      aria-label="About AhadStudios"
    >
      <div className="home-about-inner">
        {/* aria-label on h2 gives screen readers the full sentence */}
        <h2 className="home-about-title" aria-label={SENTENCE}>
          {WORDS.map((word, wi) => (
            // Each word is one animated unit; GSAP targets .about-word
            <span key={wi} className="about-word" aria-hidden="true">
              {word}
              <span className="about-space">&nbsp;</span>
            </span>
          ))}
        </h2>

        <button type="button" className="home-about-button">
          More about us
        </button>
      </div>
    </section>
  );
}
