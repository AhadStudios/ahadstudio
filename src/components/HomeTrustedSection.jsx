"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIntroExperience } from "@/components/intro/IntroExperienceProvider";

gsap.registerPlugin(ScrollTrigger);

const CARD_BASE = {
  opacity: 0,
  y: 38,
  scale: 0.97,
  filter: "blur(10px)",
};

function getCardInitialState(card) {
  if (
    card.classList.contains("trusted-card--m1") ||
    card.classList.contains("trusted-card--m2")
  ) {
    return { ...CARD_BASE, x: 28, rotation: 1.5 };
  }
  if (
    card.classList.contains("trusted-card--img1") ||
    card.classList.contains("trusted-card--img2") ||
    card.classList.contains("trusted-card--stat")
  ) {
    return { ...CARD_BASE, x: -28, rotation: -1.5 };
  }
  return { ...CARD_BASE };
}

function setFinalStats(m1El, m2El, topEl) {
  if (m1El) m1El.textContent = "3x Faster";
  if (m2El) m2El.textContent = "+280%";
  if (topEl) topEl.textContent = "Top 1%";
}

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
  const gridRef = useRef(null);
  const m1ValueRef = useRef(null);
  const m2ValueRef = useRef(null);
  const topStatRef = useRef(null);

  const handleGridMove = useCallback((event) => {
    const grid = gridRef.current;
    if (!grid || window.matchMedia("(max-width: 900px)").matches) return;

    const rect = grid.getBoundingClientRect();
    const mx = ((event.clientX - rect.left) / rect.width) * 100;
    const my = ((event.clientY - rect.top) / rect.height) * 100;
    grid.style.setProperty("--mx", `${mx}%`);
    grid.style.setProperty("--my", `${my}%`);
  }, []);

  const handleGridLeave = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    grid.style.setProperty("--mx", "50%");
    grid.style.setProperty("--my", "50%");
  }, []);

  useLayoutEffect(() => {
    if (!introComplete || !sectionRef.current) return undefined;

    const section = sectionRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;

    const title = section.querySelector(".home-trusted-title");
    const cta = section.querySelector(".home-trusted-cta");
    const cards = gsap.utils.toArray(section.querySelectorAll(".trusted-card"));
    const imageCards = gsap.utils.toArray(section.querySelectorAll(".trusted-card-image"));
    const images = gsap.utils.toArray(
      section.querySelectorAll(".trusted-card-image .trusted-card-img"),
    );

    const quoteParts = gsap.utils.toArray(
      section.querySelectorAll(
        ".trusted-quote-mark, .trusted-quote-text, .trusted-quote-author, .trusted-card--quote .trusted-card-footer",
      ),
    );

    const wideParts = gsap.utils.toArray(
      section.querySelectorAll(
        ".trusted-card--wide .trusted-wide-text, .trusted-card--wide .trusted-card-footer",
      ),
    );

    const statExtras = gsap.utils.toArray(
      section.querySelectorAll(
        ".trusted-card--stat .trusted-stat-mid, .trusted-card--stat .trusted-stat-sub",
      ),
    );

    const m1Value = m1ValueRef.current;
    const m2Value = m2ValueRef.current;
    const topStat = topStatRef.current;

    if (!title || !cards.length) return undefined;

    gsap.set(title, { opacity: 0, y: 28, filter: "blur(8px)" });
    if (cta) gsap.set(cta, { opacity: 0, y: 14, scale: 0.96 });

    cards.forEach((card) => {
      gsap.set(card, getCardInitialState(card));
    });

    imageCards.forEach((card) => {
      const isCircle = card.classList.contains("trusted-card--img2");
      gsap.set(card, {
        clipPath: isCircle
          ? "inset(18% 18% 18% 18% round 999px)"
          : "inset(18% 18% 18% 18% round 28px)",
      });
    });

    if (images.length) {
      gsap.set(images, {
        scale: 1.08,
        filter: "blur(6px) saturate(1.2)",
      });
    }

    const innerReveal = [...quoteParts, ...wideParts, ...statExtras];
    if (innerReveal.length) {
      gsap.set(innerReveal, { opacity: 0, y: 18, filter: "blur(6px)" });
    }

    if (m1Value) m1Value.textContent = "0x Faster";
    if (m2Value) m2Value.textContent = "+0%";
    if (topStat) topStat.textContent = "Top 0%";

    const animatedTargets = [
      title,
      cta,
      ...cards,
      ...imageCards,
      ...images,
      ...innerReveal,
    ].filter(Boolean);

    let refreshId;
    let setupTimer;
    let ctx;

    setupTimer = window.setTimeout(() => {
      const scroller = section.closest(".showcase-panel-inner");
      if (!scroller) return;

      ctx = gsap.context(() => {
        const m1Counter = { v: 0 };
        const m2Counter = { v: 0 };
        const topCounter = { v: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top 88%",
            end: "top 18%",
            scrub: 0.75,
            markers: false,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress >= 0.85) {
                section.classList.add("is-anim-ready");
                setFinalStats(m1Value, m2Value, topStat);
              } else {
                section.classList.remove("is-anim-ready");
              }
            },
          },
        });

        tl.to(
          title,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power3.out",
            duration: 0.12,
          },
          0,
        );

        if (cta) {
          tl.to(
            cta,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: "power3.out",
              duration: 0.1,
            },
            0.08,
          );
        }

        tl.to(
          cards,
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            filter: "blur(0px)",
            stagger: 0.06,
            ease: "power3.out",
            duration: 0.55,
          },
          0.12,
        );

        if (imageCards.length) {
          tl.to(
            imageCards,
            {
              clipPath: (i, el) =>
                el.classList.contains("trusted-card--img2")
                  ? "inset(0% 0% 0% 0% round 999px)"
                  : "inset(0% 0% 0% 0% round 28px)",
              ease: "power3.out",
              duration: 0.35,
              stagger: 0.04,
            },
            0.2,
          );
        }

        if (images.length) {
          tl.to(
            images,
            {
              scale: 1,
              filter: "blur(0px) saturate(1.05)",
              ease: "power3.out",
              duration: 0.35,
              stagger: 0.04,
            },
            0.2,
          );
        }

        if (innerReveal.length) {
          tl.to(
            innerReveal,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              stagger: 0.03,
              ease: "power3.out",
              duration: 0.3,
            },
            0.28,
          );
        }

        if (m1Value) {
          tl.to(
            m1Counter,
            {
              v: 3,
              duration: 0.3,
              ease: "power2.out",
              onUpdate: () => {
                m1Value.textContent = `${Math.round(m1Counter.v)}x Faster`;
              },
              onComplete: () => {
                m1Value.textContent = "3x Faster";
              },
            },
            0.35,
          );
        }

        if (m2Value) {
          tl.to(
            m2Counter,
            {
              v: 280,
              duration: 0.3,
              ease: "power2.out",
              onUpdate: () => {
                m2Value.textContent = `+${Math.round(m2Counter.v)}%`;
              },
              onComplete: () => {
                m2Value.textContent = "+280%";
              },
            },
            0.35,
          );
        }

        if (topStat) {
          tl.to(
            topCounter,
            {
              v: 1,
              duration: 0.25,
              ease: "power2.out",
              onUpdate: () => {
                topStat.textContent = `Top ${Math.round(topCounter.v)}%`;
              },
              onComplete: () => {
                topStat.textContent = "Top 1%";
              },
            },
            0.35,
          );
        }
      }, section);

      refreshId = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    }, 300);

    return () => {
      window.clearTimeout(setupTimer);
      window.clearTimeout(refreshId);
      section.classList.remove("is-anim-ready");
      ctx?.revert();
      gsap.set(animatedTargets, { clearProps: "all" });
      setFinalStats(m1Value, m2Value, topStat);
    };
  }, [introComplete]);

  return (
    <section
      className="home-trusted"
      ref={sectionRef}
      aria-label="Trusted by industry leaders"
    >
      <div className="home-trusted-inner">
        <div className="home-trusted-header">
          <h2 className="home-trusted-title">Trusted by industry leaders</h2>
          <button type="button" className="home-trusted-cta">
            Work with us
          </button>
        </div>

        <div
          className="home-trusted-grid"
          ref={gridRef}
          onMouseMove={handleGridMove}
          onMouseLeave={handleGridLeave}
        >
          <div className="trusted-card trusted-card-image trusted-card--img1">
            <img
              src="/glitch.png"
              alt="AhadStudios project visual"
              className="trusted-card-img"
              draggable="false"
            />
          </div>

          <div className="trusted-card trusted-card-image trusted-card--img2">
            <img
              src="/glitch.png"
              alt="AhadStudios visual"
              className="trusted-card-img"
              draggable="false"
            />
          </div>

          <div className="trusted-card trusted-card--stat">
            <span className="trusted-stat-big" ref={topStatRef}>
              Top 1%
            </span>
            <span className="trusted-stat-mid">
              Digital Experience
              <br />
              &amp; Product Studios
            </span>
            <span className="trusted-stat-sub">5.0 Rated On Trustpilot</span>
          </div>

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

          <div className="trusted-card trusted-card-metric trusted-card--m1">
            <div>
              <span className="trusted-metric-value" ref={m1ValueRef}>
                3x Faster
              </span>
              <span className="trusted-metric-label">Time to Market Launch</span>
            </div>
            <div className="trusted-card-footer">
              <span className="trusted-brand-label">novahq</span>
              <ArrowBtn />
            </div>
          </div>

          <div className="trusted-card trusted-card-metric trusted-card--m2">
            <div>
              <span className="trusted-metric-value" ref={m2ValueRef}>
                +280%
              </span>
              <span className="trusted-metric-label">
                Increase in Engagement
              </span>
            </div>
            <div className="trusted-card-footer">
              <span className="trusted-brand-label">arclight</span>
              <ArrowBtn />
            </div>
          </div>

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
