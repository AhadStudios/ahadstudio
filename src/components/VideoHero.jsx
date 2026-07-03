"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, initializeGsapFoundation } from "@/animations/helpers";
import { useIntroExperience } from "@/components/intro/IntroExperienceProvider";
import { HERO_STORY_STEPS } from "@/data/heroStorySteps";
import HeroScrollIndicator from "@/components/HeroScrollIndicator";

const STORY_STEP = 1;
const STORY_FADE = 0.2;

const HIDDEN_STEP = {
  autoAlpha: 0,
  y: 40,
  scale: 0.96,
  filter: "blur(10px)",
};

const VISIBLE_STEP = {
  autoAlpha: 1,
  y: 0,
  scale: 1,
  filter: "blur(0px)",
};

const EXIT_STEP = {
  autoAlpha: 0,
  y: -28,
  scale: 1,
  filter: "blur(8px)",
};

function buildHeroStoryTimeline(steps, root, pin, scroller, onProgress) {
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root,
      scroller: scroller || undefined,
      start: "top top",
      end: () => `+=${Math.round(window.innerHeight * steps.length)}`,
      pin,
      pinSpacing: true,
      pinType: scroller ? "transform" : "fixed",
      scrub: 0.55,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (typeof onProgress === "function") {
          onProgress(self.progress);
        }
      },
    },
  });

  steps.forEach((step, index) => {
    const segmentStart = index * STORY_STEP;
    const fadeOutAt = segmentStart + STORY_STEP - STORY_FADE;

    if (index === 0) {
      if (steps.length > 1) {
        timeline.to(step, { ...EXIT_STEP, duration: STORY_FADE }, fadeOutAt);
      }
      return;
    }

    timeline.fromTo(
      step,
      HIDDEN_STEP,
      { ...VISIBLE_STEP, duration: STORY_FADE },
      segmentStart,
    );

    if (index < steps.length - 1) {
      timeline.to(step, { ...EXIT_STEP, duration: STORY_FADE }, fadeOutAt);
    }
  });

  return timeline;
}

export default function VideoHero() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const chromeRanRef = useRef(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const { introComplete } = useIntroExperience();

  useEffect(() => {
    if (!introComplete || !rootRef.current || chromeRanRef.current) return undefined;

    chromeRanRef.current = true;
    const siteChrome = document.querySelector(".site-chrome");
    if (siteChrome) {
      siteChrome.style.visibility = "visible";
    }

    const navbar = document.querySelector(".navbar--hero");

    if (navbar) gsap.set(navbar, { autoAlpha: 0, y: -18 });

    const chromeTimeline = gsap.timeline({ delay: 0.2, defaults: { ease: "power3.out" } });
    if (navbar) {
      chromeTimeline.to(navbar, { autoAlpha: 1, y: 0, duration: 0.9 });
    }

    return () => {
      chromeTimeline.kill();
    };
  }, [introComplete]);

  useEffect(() => {
    if (!introComplete || !rootRef.current || !pinRef.current) return undefined;

    let ctx;
    let refreshTimer;
    let refreshTimer2;

    try {
      initializeGsapFoundation();

      const root = rootRef.current;
      const pin = pinRef.current;
      const scroller = root.closest(".showcase-panel-inner");
      const steps = gsap.utils.toArray(root.querySelectorAll("[data-story-step]"));
      const video = root.querySelector("#hero-video-slot video");

      console.log("[hero-story] init", {
        stepCount: steps.length,
        storySteps: HERO_STORY_STEPS.length,
        hasScroller: Boolean(scroller),
        hasVideo: Boolean(video),
      });

      if (!Array.isArray(steps) || steps.length === 0) {
        console.warn("[hero-story] no story steps found — skipping scroll timeline");
        return undefined;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(steps, { autoAlpha: 0 });
        gsap.set(steps[0], VISIBLE_STEP);
        setShowScrollHint(false);
        return undefined;
      }

      ctx = gsap.context(() => {
        gsap.set(steps, {
          ...HIDDEN_STEP,
          transformOrigin: "50% 50%",
        });
        gsap.set(steps[0], VISIBLE_STEP);

        if (video) {
          gsap.set(video, {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 0,
            scale: 1.06,
            transformOrigin: "50% 50%",
          });
          gsap.to(video, {
            scale: 1.02,
            duration: 16,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }

        buildHeroStoryTimeline(steps, root, pin, scroller, (progress) => {
          setShowScrollHint(progress < 0.02);
        });
      }, root);

      const refresh = () => ScrollTrigger.refresh();
      refreshTimer = window.setTimeout(refresh, 200);
      refreshTimer2 = window.setTimeout(refresh, 900);
    } catch (error) {
      console.error("[hero-story] scroll story setup failed", error);

      const fallbackSteps = rootRef.current?.querySelectorAll("[data-story-step]");
      if (fallbackSteps?.length) {
        gsap.set(fallbackSteps, { autoAlpha: 0 });
        gsap.set(fallbackSteps[0], VISIBLE_STEP);
      }
      setShowScrollHint(false);
    }

    return () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      if (refreshTimer2) window.clearTimeout(refreshTimer2);
      ctx?.revert();
    };
  }, [introComplete]);

  return (
    <section
      id="hero"
      className="section-wrapper video-hero"
      aria-label="Hero"
      ref={rootRef}
    >
      <div className="video-hero-pin" ref={pinRef}>
        <div id="hero-video-slot" className="hero-video-slot" aria-hidden="true" />

        <div className="video-hero-story" aria-live="polite">
          {HERO_STORY_STEPS.map((step) => (
            <div
              key={step.id}
              className={`video-hero-story-step video-hero-story-step--${step.id}`}
              data-story-step
            >
              <div className="video-hero-story-content">
                {step.lines.map((line) => (
                  <span key={line} className="video-hero-story-line">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <HeroScrollIndicator visible={showScrollHint && introComplete} />
      </div>
    </section>
  );
}
