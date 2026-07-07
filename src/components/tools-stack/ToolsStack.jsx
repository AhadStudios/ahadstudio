"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { stackCategories } from "@/data/stackCategories";
import { gsap } from "@/animations/helpers";
import { prefersReducedMotion } from "@/animations/panelScroll";
import AnimatedButton from "@/components/our-work/AnimatedButton";
import FilterTabs from "@/components/tools-stack/FilterTabs";
import TechStackCard from "@/components/tools-stack/TechStackCard";

export default function ToolsStack() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [displayFilter, setDisplayFilter] = useState("all");
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const visibleCategories = useMemo(() => {
    if (displayFilter === "all") return stackCategories;
    return stackCategories.filter((category) => category.id === displayFilter);
  }, [displayFilter]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const inShowcase = Boolean(section.closest(".showcase-experience"));
      const revealConfig = inShowcase
        ? { delay: 0.25 }
        : {
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          };

      if (headerRef.current) {
        gsap.from(headerRef.current.querySelector(".tools-stack-title-line"), {
          x: -48,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power4.out",
          ...revealConfig,
        });

        gsap.from(headerRef.current.querySelectorAll(".tools-stack-intro, .tools-stack-explore"), {
          y: 24,
          autoAlpha: 0,
          duration: 0.85,
          stagger: 0.1,
          delay: 0.2,
          ease: "power3.out",
          ...revealConfig,
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleFilterChange = (nextFilter) => {
    if (nextFilter === activeFilter || isAnimatingRef.current) return;

    const cards = cardsRef.current;
    if (!cards || prefersReducedMotion()) {
      setActiveFilter(nextFilter);
      setDisplayFilter(nextFilter);
      return;
    }

    isAnimatingRef.current = true;
    setActiveFilter(nextFilter);

    const outgoing = cards.querySelectorAll(".tools-stack-card-wrap");

    gsap.to(outgoing, {
      y: -24,
      autoAlpha: 0,
      scale: 0.94,
      rotationX: 8,
      duration: 0.32,
      stagger: 0.04,
      ease: "power2.in",
      onComplete: () => {
        setDisplayFilter(nextFilter);

        requestAnimationFrame(() => {
          const incoming = cards.querySelectorAll(".tools-stack-card-wrap");
          gsap.fromTo(
            incoming,
            { y: 32, autoAlpha: 0, scale: 0.96, rotationX: -10 },
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              rotationX: 0,
              duration: 0.55,
              stagger: 0.06,
              ease: "power3.out",
              onComplete: () => {
                isAnimatingRef.current = false;
              },
            },
          );
        });
      },
    });
  };

  return (
    <section
      id="tools"
      className="section-wrapper tools-stack"
      ref={sectionRef}
      aria-labelledby="tools-stack-heading"
    >
      <div className="tools-stack-inner">
        <header className="tools-stack-header" ref={headerRef}>
          <div className="tools-stack-header-copy">
            <h2 id="tools-stack-heading" className="tools-stack-title">
              <span className="tools-stack-title-line">
                <span className="tools-stack-title-dot" aria-hidden="true" />
                TOOLS
              </span>
              <span className="tools-stack-title-line">I USE</span>
            </h2>
            <p className="tools-stack-intro">
              A carefully selected stack of technologies I use to build scalable,
              fast and modern digital experiences.
            </p>
          </div>

          <AnimatedButton
            panelId="stack"
            label="Explore Stack"
            className="tools-stack-explore"
          />
        </header>

        <FilterTabs activeFilter={activeFilter} onChange={handleFilterChange} />

        <div className="tools-stack-cards" ref={cardsRef}>
          {visibleCategories.map((category) => (
            <div key={category.id} className="tools-stack-card-wrap">
              <TechStackCard category={category} />
            </div>
          ))}
        </div>

        <footer className="tools-stack-footer">
          <p className="tools-stack-footer-note">
            <span className="tools-stack-footer-dot" aria-hidden="true" />
            Always learning. Always building.
          </p>
          <AnimatedButton panelId="contact" label="Let's Build Something Great" />
        </footer>
      </div>
    </section>
  );
}
