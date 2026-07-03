"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { gsap, ScrollTrigger } from "@/animations/helpers";
import AnimatedButton from "@/components/our-work/AnimatedButton";
import MagneticCtaButton from "@/components/our-work/MagneticCtaButton";
import OurWorkFooterPrism from "@/components/our-work/OurWorkFooterPrism";
import WorkCtaPrism from "@/components/our-work/WorkCtaPrism";
import ProjectCard from "@/components/our-work/ProjectCard";

export default function OurWork({ variant = "full" }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const listRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return undefined;

    const inWorkPage = Boolean(section.closest(".work-page"));
    const scroller = section.closest(".showcase-panel-inner");

    const ctx = gsap.context(() => {
      const scrollTriggerBase = inWorkPage
        ? { scroller: scroller || undefined }
        : {};

      if (variant !== "footer" && variant !== "work-cta" && variant !== "list" && headerRef.current) {
        gsap.from(headerRef.current.querySelector(".our-work-title"), {
          clipPath: "inset(100% 0% 0% 0%)",
          y: 24,
          duration: 1.15,
          ease: "power4.out",
          ...(inWorkPage
            ? {
                scrollTrigger: {
                  trigger: headerRef.current,
                  start: "top 88%",
                  toggleActions: "play none none reverse",
                  ...scrollTriggerBase,
                },
              }
            : {
                scrollTrigger: {
                  trigger: section,
                  start: "top 78%",
                  toggleActions: "play none none reverse",
                },
              }),
        });

        gsap.from(headerRef.current.querySelectorAll(".our-work-intro, .animated-button"), {
          y: 28,
          autoAlpha: 0,
          duration: 0.95,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.18,
          ...(inWorkPage
            ? {
                scrollTrigger: {
                  trigger: headerRef.current,
                  start: "top 88%",
                  toggleActions: "play none none reverse",
                  ...scrollTriggerBase,
                },
              }
            : {
                scrollTrigger: {
                  trigger: section,
                  start: "top 78%",
                  toggleActions: "play none none reverse",
                },
              }),
        });
      }

      if (variant !== "list" && variant !== "projects" && footerRef.current) {
        const footerItems = footerRef.current.querySelectorAll(
          "[data-our-work-footer-item]",
        );

        gsap.fromTo(
          footerItems,
          { y: 32, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.95,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
              toggleActions: "restart none restart none",
              invalidateOnRefresh: true,
              ...scrollTriggerBase,
            },
          },
        );
      }
    }, section);

    if (inWorkPage) {
      window.setTimeout(() => ScrollTrigger.refresh(), 200);
    }

    return () => ctx.revert();
  }, [variant]);

  if (variant === "list") {
    return (
      <div className="our-work our-work--list-only" ref={sectionRef}>
        <div className="our-work-list" ref={listRef}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "projects") {
    return (
      <section
        className="section-wrapper our-work our-work--projects-only"
        ref={sectionRef}
        aria-labelledby="our-work-heading"
      >
        <div className="our-work-inner">
          <header className="our-work-header" ref={headerRef}>
            <h2 id="our-work-heading" className="our-work-title">
              OUR WORK
            </h2>
            <p className="our-work-intro">
              A selection of digital experiences we&apos;ve crafted for
              forward-thinking brands and startups across the globe.
            </p>
            <AnimatedButton href="#work" label="View All Projects" />
          </header>

          <div className="our-work-list" ref={listRef}>
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "work-cta") {
    return (
      <footer className="our-work our-work--work-cta" ref={sectionRef}>
        <div className="our-work-inner our-work-inner--work-cta" ref={footerRef}>
          <div className="work-page-cta-content">
            <div className="work-page-cta-copy" data-our-work-footer-item>
              <h3 className="work-page-cta-title">
                Let&apos;s Build Something Memorable.
              </h3>
            </div>

            <div className="work-page-cta-actions" data-our-work-footer-item>
              <Link
                href="/contact"
                className="work-page-cta-link work-page-cta-link--primary"
              >
                Book A Call
              </Link>
              <MagneticCtaButton href="/contact" label="Start A Project" />
            </div>
          </div>
        </div>

        <div className="work-page-cta-prism" aria-hidden="true">
          <span className="work-page-cta-prism-glow" />
          <WorkCtaPrism />
        </div>
      </footer>
    );
  }

  if (variant === "footer") {
    return (
      <footer className="our-work our-work--footer-only" ref={sectionRef}>
        <div className="our-work-inner our-work-inner--footer">
          <div className="our-work-footer" ref={footerRef}>
            <div className="our-work-footer-copy" data-our-work-footer-item>
              <h3 className="our-work-footer-title">HAVE A PROJECT IN MIND?</h3>
              <p className="our-work-footer-text">
                Let&apos;s create something extraordinary together.
              </p>
            </div>

            <div data-our-work-footer-item>
              <MagneticCtaButton href="/contact" label="Start A Project" />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <section
      id="work-legacy"
      className="section-wrapper our-work"
      ref={sectionRef}
      aria-labelledby="our-work-heading"
    >
      <div className="our-work-inner">
        <header className="our-work-header" ref={headerRef}>
          <h2 id="our-work-heading" className="our-work-title">
            OUR WORK
          </h2>
          <p className="our-work-intro">
            A selection of digital experiences we&apos;ve crafted for
            forward-thinking brands and startups across the globe.
          </p>
          <AnimatedButton href="#work" label="View All Projects" />
        </header>

        <div className="our-work-list" ref={listRef}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <footer className="our-work-footer" ref={footerRef}>
          <div className="our-work-footer-copy" data-our-work-footer-item>
            <h3 className="our-work-footer-title">HAVE A PROJECT IN MIND?</h3>
            <p className="our-work-footer-text">
              Let&apos;s create something extraordinary together.
            </p>
          </div>

          <div data-our-work-footer-item>
            <MagneticCtaButton href="/contact" label="Start A Project" />
          </div>

          <div className="our-work-footer-prism" aria-hidden="true">
            <OurWorkFooterPrism />
          </div>
        </footer>
      </div>
    </section>
  );
}
