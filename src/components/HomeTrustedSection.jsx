"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIntroExperience } from "@/components/intro/IntroExperienceProvider";

gsap.registerPlugin(ScrollTrigger);

const QUOTE_CHUNKS = [
  "AhadStudios\u2019 design and development work",
  " is sharp, fast,",
  " and built with real attention to detail.",
];

function getCardInitialState(card) {
  const base = {
    opacity: 0,
    y: 42,
    scale: 0.965,
    filter: "blur(12px)",
    transformOrigin: "center center",
  };

  if (card.classList.contains("trusted-card--quote")) {
    return { ...base, y: 55, scale: 0.96 };
  }
  if (
    card.classList.contains("trusted-card--m1") ||
    card.classList.contains("trusted-card--m2")
  ) {
    return { ...base, x: 70, y: 42, rotation: 2 };
  }
  if (card.classList.contains("trusted-card--wide")) {
    return { ...base, y: 65, scale: 0.97 };
  }
  if (
    card.classList.contains("trusted-card--img1") ||
    card.classList.contains("trusted-card--img2") ||
    card.classList.contains("trusted-card--stat")
  ) {
    return { ...base, x: -70, y: 42, rotation: -2 };
  }
  return base;
}

function setFinalStats(m1El, m2El, topEl) {
  if (m1El) m1El.textContent = "3x Faster";
  if (m2El) m2El.textContent = "+280%";
  if (topEl) topEl.textContent = "Top 1%";
}

function CardScan() {
  return <span className="trusted-card-scan" aria-hidden="true" />;
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

  const handleCardEnter = useCallback((event) => {
    const section = sectionRef.current;
    const card = event.currentTarget;
    if (
      !section?.classList.contains("is-anim-ready") ||
      window.matchMedia("(max-width: 900px)").matches
    ) {
      return;
    }

    gsap.to(card, {
      y: -6,
      duration: 0.32,
      ease: "power3.out",
    });
  }, []);

  const handleCardMove = useCallback((event) => {
    const section = sectionRef.current;
    const card = event.currentTarget;
    if (
      !section?.classList.contains("is-anim-ready") ||
      window.matchMedia("(max-width: 900px)").matches
    ) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotationY: px * 2,
      rotationX: -py * 2,
      duration: 0.45,
      ease: "power2.out",
      transformPerspective: 900,
    });
  }, []);

  const handleCardLeave = useCallback((event) => {
    const card = event.currentTarget;
    gsap.to(card, {
      y: 0,
      rotationY: 0,
      rotationX: 0,
      duration: 0.5,
      ease: "power3.out",
    });
  }, []);

  useLayoutEffect(() => {
    if (!introComplete || !sectionRef.current) return undefined;

    const section = sectionRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;

    const title = section.querySelector(".home-trusted-title");
    const cta = section.querySelector(".home-trusted-cta");
    const cards = gsap.utils.toArray(section.querySelectorAll(".trusted-card"));
    const scans = gsap.utils.toArray(section.querySelectorAll(".trusted-card-scan"));
    const imageCards = gsap.utils.toArray(section.querySelectorAll(".trusted-card-image"));
    const images = gsap.utils.toArray(
      section.querySelectorAll(".trusted-card-image .trusted-card-img"),
    );

    const quoteMark = section.querySelector(".trusted-quote-mark");
    const quoteChunks = gsap.utils.toArray(section.querySelectorAll(".trusted-quote-chunk"));
    const quoteAuthor = section.querySelector(".trusted-quote-author");
    const quoteBrand = section.querySelector(".trusted-card--quote .trusted-brand-label");
    const quoteArrow = section.querySelector(".trusted-card--quote .trusted-arrow");

    const wideText = section.querySelector(".trusted-wide-text");
    const wideFooter = section.querySelector(".trusted-card--wide .trusted-card-footer");
    const statExtras = gsap.utils.toArray(
      section.querySelectorAll(
        ".trusted-card--stat .trusted-stat-mid, .trusted-card--stat .trusted-stat-sub",
      ),
    );

    const m1Value = m1ValueRef.current;
    const m2Value = m2ValueRef.current;
    const topStat = topStatRef.current;

    if (!title || !cards.length) return undefined;

    gsap.set(title, {
      opacity: 0,
      y: 38,
      filter: "blur(12px)",
      letterSpacing: "0.02em",
    });

    if (cta) {
      gsap.set(cta, {
        opacity: 0,
        y: 18,
        scale: 0.92,
        filter: "blur(8px)",
      });
    }

    cards.forEach((card) => {
      gsap.set(card, getCardInitialState(card));
    });

    scans.forEach((scan) => {
      gsap.set(scan, { x: "-110%", opacity: 0 });
    });

    imageCards.forEach((card) => {
      const isCircle = card.classList.contains("trusted-card--img2");
      gsap.set(card, {
        clipPath: isCircle
          ? "inset(16% 16% 16% 16% round 999px)"
          : "inset(16% 16% 16% 16% round 28px)",
      });
    });

    if (images.length) {
      gsap.set(images, {
        scale: 1.1,
        yPercent: -6,
        filter: "blur(6px) saturate(1.25)",
      });
    }

    const quoteParts = [quoteMark, ...quoteChunks, quoteAuthor, quoteBrand, quoteArrow].filter(
      Boolean,
    );
    const wideParts = [wideText, wideFooter].filter(Boolean);
    const innerReveal = [...quoteParts, ...wideParts, ...statExtras];

    if (innerReveal.length) {
      gsap.set(innerReveal, { opacity: 0, y: 16, filter: "blur(8px)" });
    }

    if (quoteMark) {
      gsap.set(quoteMark, { opacity: 0, scale: 0.88, y: 10, filter: "blur(6px)" });
    }

    if (quoteArrow) {
      gsap.set(quoteArrow, { opacity: 0, scale: 0.82, y: 8 });
    }

    if (m1Value) m1Value.textContent = "0x Faster";
    if (m2Value) m2Value.textContent = "+0%";
    if (topStat) topStat.textContent = "Top 0%";

    const animatedTargets = [
      title,
      cta,
      ...cards,
      ...scans,
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
            start: "top 82%",
            end: "top 12%",
            scrub: 1.25,
            markers: false,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress >= 0.88) {
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
            letterSpacing: "-0.025em",
            ease: "power3.out",
            duration: 0.2,
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
              filter: "blur(0px)",
              ease: "power3.out",
              duration: 0.16,
            },
            0.1,
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
            stagger: 0.085,
            ease: "expo.out",
            duration: 0.85,
          },
          0.18,
        );

        cards.forEach((card, index) => {
          const scan = card.querySelector(".trusted-card-scan");
          if (!scan) return;

          const at = 0.18 + index * 0.085;

          tl.to(
            scan,
            {
              x: "110%",
              opacity: 0.85,
              ease: "power2.inOut",
              duration: 0.55,
            },
            at,
          );

          tl.to(
            scan,
            {
              opacity: 0,
              duration: 0.18,
              ease: "power2.out",
            },
            at + 0.42,
          );
        });

        if (imageCards.length) {
          tl.to(
            imageCards,
            {
              clipPath: (i, el) =>
                el.classList.contains("trusted-card--img2")
                  ? "inset(0% 0% 0% 0% round 999px)"
                  : "inset(0% 0% 0% 0% round 28px)",
              ease: "power3.out",
              duration: 0.55,
              stagger: 0.06,
            },
            0.3,
          );
        }

        if (images.length) {
          tl.to(
            images,
            {
              scale: 1,
              yPercent: 4,
              filter: "blur(0px) saturate(1.08)",
              ease: "power3.out",
              duration: 0.55,
              stagger: 0.06,
            },
            0.32,
          );

          tl.to(
            images,
            {
              yPercent: 6,
              ease: "none",
              duration: 0.35,
            },
            0.62,
          );
        }

        if (quoteMark) {
          tl.to(
            quoteMark,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
              ease: "power3.out",
              duration: 0.22,
            },
            0.46,
          );
        }

        if (quoteChunks.length) {
          tl.to(
            quoteChunks,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              stagger: 0.06,
              ease: "power3.out",
              duration: 0.38,
            },
            0.5,
          );
        }

        if (quoteAuthor) {
          tl.to(
            quoteAuthor,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              ease: "power3.out",
              duration: 0.24,
            },
            0.58,
          );
        }

        if (quoteBrand) {
          tl.to(
            quoteBrand,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              ease: "power3.out",
              duration: 0.2,
            },
            0.62,
          );
        }

        if (quoteArrow) {
          tl.to(
            quoteArrow,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              ease: "back.out(1.4)",
              duration: 0.22,
            },
            0.66,
          );
        }

        if (wideParts.length) {
          tl.to(
            wideParts,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              stagger: 0.05,
              ease: "power3.out",
              duration: 0.3,
            },
            0.52,
          );
        }

        if (statExtras.length) {
          tl.to(
            statExtras,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              stagger: 0.05,
              ease: "power3.out",
              duration: 0.28,
            },
            0.54,
          );
        }

        if (m1Value) {
          tl.to(
            m1Counter,
            {
              v: 3,
              duration: 0.34,
              ease: "power2.out",
              onUpdate: () => {
                m1Value.textContent = `${Math.round(m1Counter.v)}x Faster`;
              },
              onComplete: () => {
                m1Value.textContent = "3x Faster";
              },
            },
            0.58,
          );
        }

        if (m2Value) {
          tl.to(
            m2Counter,
            {
              v: 280,
              duration: 0.34,
              ease: "power2.out",
              onUpdate: () => {
                m2Value.textContent = `+${Math.round(m2Counter.v)}%`;
              },
              onComplete: () => {
                m2Value.textContent = "+280%";
              },
            },
            0.6,
          );
        }

        if (topStat) {
          tl.to(
            topCounter,
            {
              v: 1,
              duration: 0.3,
              ease: "power2.out",
              onUpdate: () => {
                topStat.textContent = `Top ${Math.round(topCounter.v)}%`;
              },
              onComplete: () => {
                topStat.textContent = "Top 1%";
              },
            },
            0.58,
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
      cards.forEach((card) => {
        gsap.set(card, { rotationX: 0, rotationY: 0 });
      });
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
          <div
            className="trusted-card trusted-card-image trusted-card--img1"
            onMouseEnter={handleCardEnter}
            onMouseMove={handleCardMove}
            onMouseLeave={handleCardLeave}
          >
            <CardScan />
            <img
              src="/glitch.png"
              alt="AhadStudios project visual"
              className="trusted-card-img"
              draggable="false"
            />
          </div>

          <div
            className="trusted-card trusted-card-image trusted-card--img2"
            onMouseEnter={handleCardEnter}
            onMouseMove={handleCardMove}
            onMouseLeave={handleCardLeave}
          >
            <CardScan />
            <img
              src="/glitch.png"
              alt="AhadStudios visual"
              className="trusted-card-img"
              draggable="false"
            />
          </div>

          <div
            className="trusted-card trusted-card--stat"
            onMouseEnter={handleCardEnter}
            onMouseMove={handleCardMove}
            onMouseLeave={handleCardLeave}
          >
            <CardScan />
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

          <div
            className="trusted-card trusted-card-large trusted-card--quote"
            onMouseEnter={handleCardEnter}
            onMouseMove={handleCardMove}
            onMouseLeave={handleCardLeave}
          >
            <CardScan />
            <span className="trusted-quote-mark">&ldquo;</span>
            <p className="trusted-quote-text">
              {QUOTE_CHUNKS.map((chunk) => (
                <span key={chunk} className="trusted-quote-chunk">
                  {chunk}
                </span>
              ))}
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

          <div
            className="trusted-card trusted-card-metric trusted-card--m1"
            onMouseEnter={handleCardEnter}
            onMouseMove={handleCardMove}
            onMouseLeave={handleCardLeave}
          >
            <CardScan />
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

          <div
            className="trusted-card trusted-card-metric trusted-card--m2"
            onMouseEnter={handleCardEnter}
            onMouseMove={handleCardMove}
            onMouseLeave={handleCardLeave}
          >
            <CardScan />
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

          <div
            className="trusted-card trusted-card--wide"
            onMouseEnter={handleCardEnter}
            onMouseMove={handleCardMove}
            onMouseLeave={handleCardLeave}
          >
            <CardScan />
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
