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

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    let refreshId;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray(section.querySelectorAll(".about-word"));
      const button = section.querySelector(".home-about-button");

      console.log("[HomeAboutBrief] mounted");
      console.log("[HomeAboutBrief] words found:", words.length);
      console.log("[HomeAboutBrief] button found:", !!button);

      if (!words.length) {
        console.warn("[HomeAboutBrief] No .about-word elements found — text stays visible.");
        return;
      }

      gsap.set(words, { opacity: 0, y: 32, scale: 0.96, filter: "blur(12px)" });
      if (button) gsap.set(button, { opacity: 0, y: 24, scale: 0.96 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 35%",
          scrub: 1,
          markers: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(words, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        stagger: 0.06,
        ease: "power3.out",
      });

      if (button) {
        tl.to(
          button,
          { opacity: 1, y: 0, scale: 1, ease: "power3.out" },
          "-=0.2",
        );
      }

      refreshId = setTimeout(() => {
        ScrollTrigger.refresh();
        console.log("[HomeAboutBrief] ScrollTrigger refreshed");
      }, 150);
    }, section);

    return () => {
      if (refreshId) clearTimeout(refreshId);
      ctx.revert();
    };
  }, []);

  return (
    <section
      className="home-about-brief"
      ref={sectionRef}
      aria-label="About AhadStudios"
    >
      <div className="home-about-inner">
        <h2 className="home-about-title" aria-label={SENTENCE}>
          {WORDS.map((word, wi) => (
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
