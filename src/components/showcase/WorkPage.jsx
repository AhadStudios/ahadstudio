"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/helpers";
import ProjectsSlider from "@/components/ProjectsSlider";
import TrustedBrands from "@/components/TrustedBrands";
import Features from "@/components/Features";
import PrismSection from "@/components/PrismSection";
import OurWork from "@/components/OurWork";
import WorkClosingCTA from "@/components/showcase/WorkClosingCTA";
import { getPanelScroller, prefersReducedMotion } from "@/animations/panelScroll";

const showBrands = false;

export default function WorkPage({ isActive = false }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isActive || prefersReducedMotion()) return undefined;

    const scroller = getPanelScroller(root);

    const ctx = gsap.context(() => {
      const hero = root.querySelector(".work-page-hero");
      if (hero) {
        const eyebrow = hero.querySelector(".work-page-hero-eyebrow");
        const title = hero.querySelector(".work-page-hero-title");
        const copy = hero.querySelector(".work-page-hero-copy");
        const stats = hero.querySelectorAll(".work-page-hero-stat");

        gsap.set([eyebrow, title, copy], { autoAlpha: 0 });
        gsap.set(eyebrow, { letterSpacing: "0.45em", y: 12 });
        gsap.set(title, { scale: 1.2, filter: "blur(8px)" });
        gsap.set(copy, { x: -36 });
        gsap.set(stats, { y: 28, autoAlpha: 0 });

        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            scroller,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        });

        heroTimeline
          .to(eyebrow, {
            autoAlpha: 1,
            y: 0,
            letterSpacing: "0.28em",
            duration: 0.9,
            ease: "power3.out",
          })
          .to(
            title,
            {
              autoAlpha: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.1,
              ease: "power4.out",
            },
            "-=0.45",
          )
          .to(copy, { autoAlpha: 1, x: 0, duration: 0.95, ease: "power3.out" }, "-=0.55")
          .to(
            stats,
            { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.1, ease: "power3.out" },
            "-=0.45",
          );
      }

      root.querySelectorAll("[data-work-reveal]").forEach((section, index) => {
        gsap.from(section, {
          x: index % 2 === 0 ? -56 : 56,
          autoAlpha: 0,
          duration: 0.95,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      const trustedBrands = root.querySelector(".trusted-brands");
      if (trustedBrands) {
        gsap.from(trustedBrands.querySelector(".trusted-brands-inner"), {
          scale: 0.94,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: trustedBrands,
            scroller,
            start: "top 84%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    const timer = window.setTimeout(refresh, 300);
    const timer2 = window.setTimeout(refresh, 900);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(timer2);
      ctx.revert();
    };
  }, [isActive]);

  return (
    <div
      id="work"
      className="work-page showcase-view showcase-view--scrollable"
      ref={rootRef}
    >
      <header className="work-page-hero">
        <p className="work-page-hero-eyebrow">Portfolio</p>
        <h1 className="work-page-hero-title">WORK</h1>
        <p className="work-page-hero-copy">
          Selected projects,
          <br />
          creative direction,
          <br />
          digital products,
          <br />
          and creative experiments.
        </p>

        <div className="work-page-hero-stats" aria-label="Experience highlights">
          <div className="work-page-hero-stat">
            <span className="work-page-hero-stat-value">20+</span>
            <span className="work-page-hero-stat-label">Projects</span>
          </div>
          <div className="work-page-hero-stat">
            <span className="work-page-hero-stat-value">5+</span>
            <span className="work-page-hero-stat-label">Years</span>
          </div>
          <div className="work-page-hero-stat">
            <span className="work-page-hero-stat-value">Full Stack</span>
            <span className="work-page-hero-stat-label">Developer</span>
          </div>
        </div>
      </header>

      <section
        className="work-page-section work-page-section--slider"
        aria-label="Projects slider"
      >
        <ProjectsSlider />
      </section>

      {showBrands ? (
        <section
          className="work-page-section work-page-section--logos"
          data-work-reveal
          aria-label="Trusted brands"
        >
          <TrustedBrands />
        </section>
      ) : null}

      <section
        className="work-page-section work-page-section--designer"
        data-work-reveal
        aria-label="Product Designer"
      >
        <Features variant="designer" part="intro" />
      </section>

      <section
        className="work-page-section work-page-section--stickers"
        aria-label="Sticker board"
      >
        <Features variant="designer" part="stickers" isActive={isActive} />
      </section>

      <section
        className="work-page-section work-page-section--prism"
        aria-label="Prism"
      >
        <PrismSection animateOnScroll isActive={isActive} />
      </section>

      <section
        className="work-page-section work-page-section--our-work"
        aria-label="Our work"
      >
        <OurWork variant="projects" />
      </section>

      <section
        className="work-page-section work-page-section--cta"
        data-work-reveal
        aria-label="Contact"
      >
        <WorkClosingCTA />
      </section>
    </div>
  );
}
