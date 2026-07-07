"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIntroExperience } from "@/components/intro/IntroExperienceProvider";
import { usePanelNavigate } from "@/hooks/usePanelNavigate";

gsap.registerPlugin(ScrollTrigger);

const WORDS = [
  "THANKS",
  "FOR",
  "EXPLORING",
  "MY",
  "WORK",
  "LET\u2019S",
  "BUILD",
  "SOMETHING",
  "ICONIC",
];

const WORD_FROM = {
  opacity: 0,
  y: 70,
  rotateX: 18,
  scale: 0.92,
  filter: "blur(18px)",
  letterSpacing: "0.02em",
};

const WORD_IN = {
  opacity: 1,
  y: 0,
  rotateX: 0,
  scale: 1,
  filter: "blur(0px)",
  letterSpacing: "-0.06em",
  duration: 1.1,
  ease: "power4.out",
};

const WORD_OUT = {
  opacity: 0,
  y: -70,
  rotateX: -18,
  scale: 1.03,
  filter: "blur(18px)",
  letterSpacing: "-0.1em",
  duration: 0.95,
  ease: "expo.out",
};

function padIndex(value) {
  return String(value).padStart(2, "0");
}

export default function HomeFinalThanks() {
  const { introComplete } = useIntroExperience();
  const { goToContact } = usePanelNavigate();
  const sectionRef = useRef(null);
  const closingRef = useRef(null);
  const progressCurrentRef = useRef(null);
  const portalGlowRef = useRef(null);
  const scanBeamRef = useRef(null);
  const progressWrapRef = useRef(null);

  const handleMagneticMove = useCallback((event) => {
    const btn = event.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.14,
      y: y * 0.14,
      duration: 0.35,
      ease: "power2.out",
    });
  }, []);

  const handleMagneticLeave = useCallback((event) => {
    gsap.to(event.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: "power3.out",
    });
  }, []);

  useLayoutEffect(() => {
    if (!introComplete || !sectionRef.current) return undefined;

    const section = sectionRef.current;
    const closing = closingRef.current;
    const portalGlow = portalGlowRef.current;
    const scanBeam = scanBeamRef.current;
    const progressCurrent = progressCurrentRef.current;
    const progressWrap = progressWrapRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wordEls = gsap.utils.toArray(section.querySelectorAll(".final-word"));
    const closingParts = closing
      ? gsap.utils.toArray(closing.querySelectorAll(".final-closing-part"))
      : [];
    const wordStage = section.querySelector(".final-word-stage");

    if (!wordEls.length) return undefined;

    if (reducedMotion) {
      if (wordStage) gsap.set(wordStage, { display: "none" });
      if (progressWrap) gsap.set(progressWrap, { display: "none" });
      if (closing) {
        gsap.set(closing, { autoAlpha: 1, visibility: "visible" });
        gsap.set(closingParts, { clearProps: "all" });
      }
      return undefined;
    }

    gsap.set(wordEls, WORD_FROM);
    if (portalGlow) {
      gsap.set(portalGlow, { opacity: 0, scale: 0.88 });
    }
    if (scanBeam) {
      gsap.set(scanBeam, { x: "-110%", opacity: 0 });
    }
    if (progressCurrent) {
      progressCurrent.textContent = padIndex(1);
    }
    if (closing) {
      gsap.set(closing, { autoAlpha: 0, visibility: "hidden" });
      gsap.set(closingParts, {
        opacity: 0,
        y: 44,
        scale: 0.96,
        filter: "blur(14px)",
      });
    }

    let refreshId;
    let setupTimer;
    let ctx;

    setupTimer = window.setTimeout(() => {
      const scroller = section.closest(".showcase-panel-inner");
      if (!scroller) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top top",
            end: "+=5200",
            scrub: 1.15,
            pin: true,
            pinType: "transform",
            anticipatePin: 1,
            markers: false,
            invalidateOnRefresh: true,
          },
        });

        wordEls.forEach((word, index) => {
          tl.call(() => {
            if (progressCurrent) {
              progressCurrent.textContent = padIndex(index + 1);
            }
          });

          if (scanBeam) {
            tl.set(scanBeam, { x: "-110%", opacity: 0 });
            tl.to(
              scanBeam,
              {
                opacity: 0.45,
                duration: 0.25,
                ease: "power2.out",
              },
              "<",
            );
            tl.to(
              scanBeam,
              {
                x: "110%",
                duration: 1.05,
                ease: "power2.inOut",
              },
              "<0.05",
            );
          }

          if (portalGlow) {
            tl.to(
              portalGlow,
              {
                opacity: 0.52,
                scale: 1,
                duration: 0.55,
                ease: "power3.out",
              },
              "<",
            );
          }

          tl.to(word, WORD_IN, "<0.1");

          if (portalGlow) {
            tl.to(
              portalGlow,
              {
                opacity: 0.28,
                duration: 0.45,
                ease: "power2.inOut",
              },
              "+=0.15",
            );
          }

          tl.to(word, { duration: 0.4 });

          tl.to(word, WORD_OUT);

          if (scanBeam) {
            tl.to(
              scanBeam,
              {
                opacity: 0,
                duration: 0.2,
                ease: "power2.in",
              },
              "<0.4",
            );
          }
        });

        if (progressWrap) {
          tl.to(
            progressWrap,
            {
              opacity: 0,
              y: 8,
              duration: 0.35,
              ease: "power2.in",
            },
            "+=0.05",
          );
        }

        if (portalGlow) {
          tl.to(
            portalGlow,
            {
              opacity: 0.22,
              scale: 1.35,
              duration: 1.1,
              ease: "power3.out",
            },
            "-=0.2",
          );
        }

        if (closing) {
          tl.set(closing, { visibility: "visible" });
          tl.to(
            closing,
            {
              autoAlpha: 1,
              duration: 0.7,
              ease: "power3.out",
            },
            "-=0.5",
          );

          if (closingParts.length) {
            tl.to(
              closingParts,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                stagger: 0.08,
                duration: 0.95,
                ease: "power3.out",
              },
              "-=0.45",
            );
          }
        }
      }, section);

      refreshId = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    }, 300);

    return () => {
      window.clearTimeout(setupTimer);
      window.clearTimeout(refreshId);
      ctx?.revert();
      gsap.set(wordEls, { clearProps: "all" });
      if (wordStage) gsap.set(wordStage, { clearProps: "display" });
      if (portalGlow) gsap.set(portalGlow, { clearProps: "all" });
      if (scanBeam) gsap.set(scanBeam, { clearProps: "all" });
      if (progressWrap) gsap.set(progressWrap, { clearProps: "all" });
      if (closing) gsap.set(closing, { clearProps: "all" });
      if (closingParts.length) gsap.set(closingParts, { clearProps: "all" });
    };
  }, [introComplete]);

  return (
    <section
      ref={sectionRef}
      className="home-final-thanks"
      aria-label="Thank you"
    >
      <div className="final-thanks-bg" aria-hidden="true">
        <div className="final-thanks-grain" />
        <div ref={portalGlowRef} className="final-portal-glow" />
        <div ref={scanBeamRef} className="final-scan-beam" />
      </div>

      <div className="final-word-stage" aria-hidden="true">
        {WORDS.map((word, index) => (
          <span className="final-word" key={`${word}-${index}`}>
            <span className="final-word-text" data-text={word}>
              {word}
            </span>
          </span>
        ))}
      </div>

      <div ref={progressWrapRef} className="final-progress" aria-hidden="true">
        <span ref={progressCurrentRef} className="final-progress-current">
          01
        </span>
        <span className="final-progress-sep">/</span>
        <span className="final-progress-total">{padIndex(WORDS.length)}</span>
      </div>

      <div ref={closingRef} className="final-closing">
        <p className="final-eyebrow final-closing-part">AHADSTUDIOS&reg;</p>
        <h2 className="final-heading final-closing-part">
          Thanks for exploring my work.
        </h2>
        <p className="final-subtext final-closing-part">
          If the vision connects, let&rsquo;s turn your idea into a premium
          digital experience.
        </p>
        <div className="final-actions final-closing-part">
          <button
            type="button"
            className="final-btn final-btn-primary"
            onClick={goToContact}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
          >
            Start a Project
          </button>
          <button
            type="button"
            className="final-btn final-btn-secondary"
            onClick={goToContact}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
          >
            Contact Me
          </button>
        </div>
      </div>
    </section>
  );
}
