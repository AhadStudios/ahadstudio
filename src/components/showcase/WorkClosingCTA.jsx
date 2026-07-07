"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/helpers";
import { getPanelScroller, prefersReducedMotion } from "@/animations/panelScroll";
import PanelNavLink from "@/components/PanelNavLink";
import MagneticCtaButton from "@/components/our-work/MagneticCtaButton";
import WorkCtaPrism from "@/components/our-work/WorkCtaPrism";

export default function WorkClosingCTA() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return undefined;

    const scroller = getPanelScroller(section);

    const ctx = gsap.context(() => {
      const reveals = section.querySelectorAll("[data-work-cta-reveal]");
      gsap.from(reveals, {
        y: 32,
        autoAlpha: 0,
        duration: 0.88,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });

      const visual = section.querySelector(".work-closing-cta-visual");
      if (visual) {
        gsap.from(visual, {
          scale: 0.94,
          autoAlpha: 0,
          filter: "blur(10px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, section);

    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <footer
      className="work-closing-cta"
      ref={sectionRef}
      aria-labelledby="work-closing-cta-heading"
    >
      <div className="work-closing-cta-inner">
        <div className="work-closing-cta-grid">
          <div className="work-closing-cta-copy">
            <p className="work-closing-cta-eyebrow" data-work-cta-reveal>
              Build with AhadStudios
            </p>

            <h2
              id="work-closing-cta-heading"
              className="work-closing-cta-title"
              data-work-cta-reveal
            >
              Let&apos;s Build Something That Actually Stands Out.
            </h2>

            <p className="work-closing-cta-text" data-work-cta-reveal>
              I design and develop websites, SaaS products, and digital experiences
              that are fast, modern, and built to leave a lasting impression.
            </p>

            <div className="work-closing-cta-actions" data-work-cta-reveal>
              <PanelNavLink
                panelId="contact"
                className="work-closing-cta-btn work-closing-cta-btn--ghost"
              >
                Book A Call
              </PanelNavLink>
              <MagneticCtaButton panelId="contact" label="Start A Project" />
            </div>
          </div>

          <div className="work-closing-cta-visual" aria-hidden="true">
            <div className="work-closing-cta-visual-prism">
              <WorkCtaPrism />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
