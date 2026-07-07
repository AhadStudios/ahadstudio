"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIntroExperience } from "@/components/intro/IntroExperienceProvider";
import { usePanelNavigate } from "@/hooks/usePanelNavigate";

gsap.registerPlugin(ScrollTrigger);

const TEXT =
  "At AhadStudios, we transform bold ideas into immersive digital experiences through sharp design, clean development, and relentless creativity.";

const WORDS = TEXT.split(" ");

export default function HomeAboutBrief() {
  const { introComplete } = useIntroExperience();
  const { goToContact } = usePanelNavigate();
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (!introComplete || !sectionRef.current) return undefined;

    const section = sectionRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;

    const words = gsap.utils.toArray(section.querySelectorAll(".about-word"));
    const button = section.querySelector(".home-about-button");
    if (!words.length) return undefined;

    gsap.set(words, {
      opacity: 0,
      y: 24,
      scale: 0.96,
      filter: "blur(10px)",
    });

    if (button) {
      gsap.set(button, {
        opacity: 0,
        y: 18,
        scale: 0.96,
        filter: "blur(8px)",
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
            start: "top 78%",
            end: "center 42%",
            scrub: 1,
            markers: false,
            invalidateOnRefresh: true,
          },
        });

        tl.to(words, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          stagger: 0.045,
          ease: "power3.out",
          duration: 1,
        });

        if (button) {
          tl.to(
            button,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              ease: "power3.out",
              duration: 0.35,
            },
            "-=0.15",
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
      ctx?.revert();
      gsap.set([...words, button].filter(Boolean), { clearProps: "all" });
    };
  }, [introComplete]);

  return (
    <section
      ref={sectionRef}
      className="home-about-brief home-about-brief-after-trusted"
      aria-label="About AhadStudios"
    >
      <div className="home-about-inner">
        <h2 className="home-about-title" aria-label={TEXT}>
          {WORDS.map((word, index) => (
            <span key={index} className="about-word">
              {word}
              <span className="about-space">&nbsp;</span>
            </span>
          ))}
        </h2>

        <button type="button" className="home-about-button" onClick={goToContact}>
          More about us
        </button>
      </div>
    </section>
  );
}
