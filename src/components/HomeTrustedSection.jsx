"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/helpers";
import { useIntroExperience } from "@/components/intro/IntroExperienceProvider";

function ArrowBtn() {
  return (
    <span className="trusted-arrow" aria-hidden="true">
      <svg
        width="13"
        height="13"
        viewBox="0 0 13 13"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2.5 10.5L10.5 2.5M10.5 2.5H4.5M10.5 2.5V8.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function HomeTrustedSection() {
  const { introComplete } = useIntroExperience();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    if (!introComplete || !sectionRef.current) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const scroller =
      sectionRef.current.closest(".showcase-panel-inner") || undefined;

    ctxRef.current = gsap.context(() => {
      if (prefersReducedMotion) return;

      // Header reveal
      const headerEl = headerRef.current;
      if (headerEl) {
        gsap.fromTo(
          Array.from(headerEl.children),
          { opacity: 0, y: 36, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.13,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerEl,
              scroller,
              start: "top 88%",
              toggleActions: "restart none restart none",
            },
          },
        );
      }

      // Cards stagger reveal
      const gridEl = gridRef.current;
      if (gridEl) {
        const cards = gridEl.querySelectorAll(".trusted-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.96, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.85,
            stagger: 0.09,
            ease: "expo.out",
            scrollTrigger: {
              trigger: gridEl,
              scroller,
              start: "top 85%",
              toggleActions: "restart none restart none",
            },
          },
        );

        // Subtle parallax inside image cards
        const imgEls = gridEl.querySelectorAll(
          ".trusted-card-image .trusted-card-img",
        );
        imgEls.forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest(".trusted-card"),
                scroller,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      }
    }, sectionRef.current);

    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [introComplete]);

  return (
    <section
      className="home-trusted"
      ref={sectionRef}
      aria-label="Trusted by industry leaders"
    >
      <div className="home-trusted-inner">
        {/* Section header */}
        <div className="home-trusted-header" ref={headerRef}>
          <h2 className="home-trusted-title">Trusted by industry leaders</h2>
          <button type="button" className="home-trusted-cta">
            Work with us
          </button>
        </div>

        {/* Bento grid */}
        <div className="home-trusted-grid" ref={gridRef}>
          {/* Left col — rectangular image */}
          <div className="trusted-card trusted-card-image trusted-card--img1">
            <img
              src="/glitch.png"
              alt="AhadStudios project visual"
              className="trusted-card-img"
              draggable="false"
            />
          </div>

          {/* Left col — circle image */}
          <div className="trusted-card trusted-card-image trusted-card--img2">
            <img
              src="/glitch.png"
              alt="AhadStudios visual"
              className="trusted-card-img"
              draggable="false"
            />
          </div>

          {/* Left col — stat card */}
          <div className="trusted-card trusted-card--stat">
            <span className="trusted-stat-big">Top 1%</span>
            <span className="trusted-stat-mid">
              Digital Experience
              <br />
              &amp; Product Studios
            </span>
            <span className="trusted-stat-sub">5.0 Rated On Trustpilot</span>
          </div>

          {/* Center — large quote card */}
          <div className="trusted-card trusted-card-large trusted-card--quote">
            <span className="trusted-quote-mark">&ldquo;</span>
            <p className="trusted-quote-text">
              AhadStudios&rsquo; design and development work is sharp, fast,
              and built with real attention to detail.
            </p>
            <div className="trusted-quote-author">
              <span className="trusted-author-name">Alex Chen</span>
              <span className="trusted-author-role">Founder, Nextura</span>
            </div>
            <div className="trusted-card-footer">
              <span className="trusted-brand-label">nextura</span>
              <ArrowBtn />
            </div>
          </div>

          {/* Right col — metric 1 */}
          <div className="trusted-card trusted-card-metric trusted-card--m1">
            <div>
              <span className="trusted-metric-value">3x Faster</span>
              <span className="trusted-metric-label">Time to Market Launch</span>
            </div>
            <div className="trusted-card-footer">
              <span className="trusted-brand-label">novahq</span>
              <ArrowBtn />
            </div>
          </div>

          {/* Right col — metric 2 */}
          <div className="trusted-card trusted-card-metric trusted-card--m2">
            <div>
              <span className="trusted-metric-value">+280%</span>
              <span className="trusted-metric-label">
                Increase in Engagement
              </span>
            </div>
            <div className="trusted-card-footer">
              <span className="trusted-brand-label">arclight</span>
              <ArrowBtn />
            </div>
          </div>

          {/* Bottom wide — case study */}
          <div className="trusted-card trusted-card--wide">
            <p className="trusted-wide-text">
              We helped Meridian rebrand and launch their new platform,
              resulting in 12M+ users within the first quarter.
            </p>
            <div className="trusted-card-footer">
              <span className="trusted-brand-label">Meridian</span>
              <ArrowBtn />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
