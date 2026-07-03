"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/helpers";
import { getPanelScroller, prefersReducedMotion } from "@/animations/panelScroll";
import AnimatedButton from "@/components/our-work/AnimatedButton";
import ProjectImageCard from "@/components/our-work/ProjectImageCard";

export default function ProjectCard({ project, index = 0 }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion()) return undefined;

    const scroller = getPanelScroller(card);
    const img = card.querySelector(".our-work-image-card-img");
    const title = card.querySelector(".our-work-project-title");
    const copy = card.querySelector(".our-work-project-copy");
    const link = card.querySelector(".our-work-image-card");
    const media = card.querySelector(".our-work-image-card-media");
    const arrow = card.querySelector(".our-work-project-link .our-work-btn-arrow");
    const fromLeft = index % 2 === 0;

    const ctx = gsap.context(() => {
      gsap.set(img, { scale: 1.18 });
      gsap.set(copy, { y: 32, autoAlpha: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          scroller,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      timeline
        .from(card, {
          x: fromLeft ? -72 : 72,
          autoAlpha: 0,
          duration: 1.05,
          ease: "power4.out",
        })
        .to(img, { scale: 1, duration: 1.2, ease: "power3.out" }, "<0.08")
        .to(copy, { y: 0, autoAlpha: 1, duration: 0.95, ease: "power3.out" }, "-=0.65");
    }, card);

    const onEnter = () => {
      gsap.to(img, { scale: 1.08, duration: 0.65, ease: "power3.out" });
      gsap.to(title, { y: -6, duration: 0.5, ease: "power3.out" });
      gsap.to(link, {
        boxShadow: "0 28px 64px rgba(255,255,255,0.12), 0 0 48px rgba(255,255,255,0.08)",
        duration: 0.5,
      });
      if (arrow) gsap.to(arrow, { x: 6, duration: 0.45, ease: "power3.out" });
    };

    const onLeave = () => {
      gsap.to(img, { scale: 1, duration: 0.55, ease: "power3.out" });
      gsap.to(title, { y: 0, duration: 0.45, ease: "power3.out" });
      gsap.to(link, { boxShadow: "none", duration: 0.45 });
      if (arrow) gsap.to(arrow, { x: 0, duration: 0.4, ease: "power3.out" });
    };

    link?.addEventListener("mouseenter", onEnter);
    link?.addEventListener("mouseleave", onLeave);
    media?.addEventListener("mouseenter", onEnter);
    media?.addEventListener("mouseleave", onLeave);

    return () => {
      ctx.revert();
      link?.removeEventListener("mouseenter", onEnter);
      link?.removeEventListener("mouseleave", onLeave);
      media?.removeEventListener("mouseenter", onEnter);
      media?.removeEventListener("mouseleave", onLeave);
    };
  }, [index]);

  return (
    <article className="our-work-project" data-our-work-item ref={cardRef}>
      <div className="our-work-project-copy">
        <span className="our-work-project-index">{project.id}</span>

        <h3 className="our-work-project-title">
          {project.title}
          <span className="our-work-project-mark" aria-hidden="true">
            *
          </span>
        </h3>

        <p className="our-work-project-categories">
          {project.categories.join(", ")}
        </p>

        <p className="our-work-project-description">{project.description}</p>

        <AnimatedButton
          href={project.href}
          label="View Case Study"
          className="our-work-project-link"
        />

        <dl className="our-work-project-meta">
          <div className="our-work-project-meta-item">
            <dt>YEAR</dt>
            <dd>{project.year}</dd>
          </div>
          <div className="our-work-project-meta-item">
            <dt>ROLE</dt>
            <dd>{project.role}</dd>
          </div>
          <div className="our-work-project-meta-item">
            <dt>AWARD</dt>
            <dd>{project.award}</dd>
          </div>
        </dl>
      </div>

      <ProjectImageCard project={project} />
    </article>
  );
}
