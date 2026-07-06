"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIntroExperience } from "@/components/intro/IntroExperienceProvider";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    question: "What makes AhadStudios different from other studios?",
    answer:
      "AhadStudios blends sharp design, clean development, and creative execution to build digital experiences that feel premium, fast, and memorable.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Timelines depend on the scope, but most focused landing pages take 1–2 weeks, while larger websites, dashboards, and web apps can take 3–6+ weeks.",
  },
  {
    question: "Do you work with startups or established brands?",
    answer:
      "Yes. AhadStudios works with founders, startups, agencies, and growing businesses that need strong digital design and development.",
  },
  {
    question: "Can you help with ongoing design and development needs?",
    answer:
      "Absolutely. AhadStudios can support ongoing improvements, new features, UI updates, landing pages, performance fixes, and long-term product development.",
  },
];

function openAnswer(wrap) {
  if (!wrap) return;

  const inner = wrap.querySelector(".faq-answer-inner");
  gsap.killTweensOf([wrap, inner].filter(Boolean));

  gsap.set(wrap, { height: "auto", opacity: 0 });
  const targetHeight = wrap.offsetHeight;
  gsap.set(wrap, { height: 0, opacity: 0 });

  gsap.to(wrap, {
    height: targetHeight,
    opacity: 1,
    duration: 0.35,
    ease: "power3.out",
    onComplete: () => {
      gsap.set(wrap, { height: "auto" });
    },
  });

  if (inner) {
    gsap.fromTo(inner, { y: -8 }, { y: 0, duration: 0.35, ease: "power3.out" });
  }
}

function closeAnswer(wrap) {
  if (!wrap) return;

  const inner = wrap.querySelector(".faq-answer-inner");
  gsap.killTweensOf([wrap, inner].filter(Boolean));

  const currentHeight = wrap.offsetHeight;
  gsap.set(wrap, { height: currentHeight });

  gsap.to(wrap, {
    height: 0,
    opacity: 0,
    duration: 0.25,
    ease: "power2.inOut",
  });

  if (inner) {
    gsap.to(inner, { y: -8, duration: 0.25, ease: "power2.inOut" });
  }
}

export default function HomeFAQ() {
  const { introComplete } = useIntroExperience();
  const [activeIndex, setActiveIndex] = useState(null);
  const sectionRef = useRef(null);
  const answerRefs = useRef([]);
  const isMobileRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const mobileMq = window.matchMedia("(max-width: 768px)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      isMobileRef.current = mobileMq.matches;
      reducedMotionRef.current = motionMq.matches;
    };

    sync();
    mobileMq.addEventListener("change", sync);
    motionMq.addEventListener("change", sync);

    return () => {
      mobileMq.removeEventListener("change", sync);
      motionMq.removeEventListener("change", sync);
    };
  }, []);

  useLayoutEffect(() => {
    if (!introComplete || !sectionRef.current) return undefined;
    if (reducedMotionRef.current) return undefined;

    const section = sectionRef.current;
    const titleLines = gsap.utils.toArray(section.querySelectorAll(".faq-title-line"));
    const items = gsap.utils.toArray(section.querySelectorAll(".faq-item"));

    if (!titleLines.length || !items.length) return undefined;

    gsap.set(titleLines, {
      opacity: 0,
      y: 36,
      clipPath: "inset(100% 0% 0% 0%)",
    });

    gsap.set(items, {
      opacity: 0,
      y: 44,
      scale: 0.98,
    });

    const entranceTargets = [...titleLines, ...items];
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
            start: "top 84%",
            end: "top 42%",
            scrub: 0.65,
            markers: false,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          titleLines,
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            stagger: 0.14,
            duration: 1,
            ease: "power3.out",
          },
          0,
        );

        tl.to(
          items,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.95,
            ease: "power3.out",
          },
          0.22,
        );
      }, section);

      refreshId = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    }, 300);

    return () => {
      window.clearTimeout(setupTimer);
      window.clearTimeout(refreshId);
      ctx?.revert();
      gsap.set(entranceTargets, { clearProps: "all" });
    };
  }, [introComplete]);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      answerRefs.current.forEach((wrap) => {
        if (!wrap) return;
        gsap.set(wrap, { height: 0, opacity: 0 });
        const inner = wrap.querySelector(".faq-answer-inner");
        if (inner) gsap.set(inner, { y: -8 });
      });
      return;
    }

    answerRefs.current.forEach((wrap, index) => {
      if (!wrap) return;

      const isOpen = activeIndex === index;

      if (reducedMotionRef.current) {
        gsap.killTweensOf(wrap);
        gsap.set(wrap, {
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        });
        const inner = wrap.querySelector(".faq-answer-inner");
        if (inner) gsap.set(inner, { y: isOpen ? 0 : -8 });
        return;
      }

      if (isOpen) {
        openAnswer(wrap);
      } else {
        closeAnswer(wrap);
      }
    });
  }, [activeIndex]);

  const handleClick = useCallback((index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleMouseEnter = useCallback((index) => {
    if (isMobileRef.current) return;
    setActiveIndex(index);
  }, []);

  const handleListMouseLeave = useCallback(() => {
    if (isMobileRef.current) return;
    setActiveIndex(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="home-faq"
      aria-label="Frequently Asked Questions"
    >
      <div className="home-faq-inner">
        <h2 className="home-faq-title">
          <span className="faq-title-line">Frequently Asked</span>
          <span className="faq-title-line">Questions</span>
        </h2>

        <div className="home-faq-list" onMouseLeave={handleListMouseLeave}>
          {FAQS.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={faq.question}
                className={`faq-item${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => handleMouseEnter(index)}
              >
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => handleClick(index)}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? "×" : "+"}
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className="faq-answer-wrap"
                  ref={(node) => {
                    answerRefs.current[index] = node;
                  }}
                  role="region"
                  aria-hidden={!isOpen}
                >
                  <div className="faq-answer-inner">
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
