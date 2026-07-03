"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger } from "@/animations/helpers";

const Prism = dynamic(() => import("@/components/Prism"), {
  ssr: false,
  loading: () => null,
});

export default function PrismSection({
  leftCopy = "You Bring Light",
  rightCopy = "We Shape It",
  showCanvas = true,
  showCopy = true,
  animateOnScroll = false,
  isActive = true,
}) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!animateOnScroll || !isActive || !showCanvas || !showCopy) {
      return undefined;
    }

    const section = sectionRef.current;
    if (!section) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return undefined;

    const scroller = section.closest(".showcase-panel-inner");
    const left = section.querySelector(".prism-section-copy--left");
    const right = section.querySelector(".prism-section-copy--right");
    const canvas = section.querySelector(".prism-section-canvas");
    const glow = section.querySelector(".prism-section-glow");


    if (!left || !right || !canvas) return undefined;
    
    const ctx = gsap.context(() => {
      gsap.set([left, right], {
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: 1,
        transformOrigin: "50% 50%",
      });
      gsap.set(canvas, {
        scale: 1,
        rotationY: 0,
        transformOrigin: "50% 50%",
        transformPerspective: 900,
        filter: "brightness(0.92) saturate(0.98)",
      });
      if (glow) {
        gsap.set(glow, {
          autoAlpha: 0.42,
          scale: 0.96,
          transformOrigin: "50% 50%",
        });
      }

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          scroller: scroller || undefined,
          start: "top top",
          end: "+=125%",
          pin: true,
          pinType: scroller ? "transform" : "fixed",
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(
          left,
          {
            x: -88,
            y: -24,
            scale: 1.14,
            autoAlpha: 0.35,
            duration: 1,
          },
          0,
        )
        .to(
          right,
          {
            x: 88,
            y: 24,
            scale: 1.14,
            autoAlpha: 0.35,
            duration: 1,
          },
          0,
        )
        .to(
          canvas,
          {
            rotationY: 28,
            scale: 1.08,
            filter: "brightness(1.22) saturate(1.18)",
            duration: 1,
          },
          0,
        )
        .to(
          glow,
          {
            autoAlpha: 1,
            scale: 1.22,
            duration: 1,
          },
          0,
        );
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    const refreshTimer = window.setTimeout(refresh, 200);
    const refreshTimer2 = window.setTimeout(refresh, 700);

    return () => {
      window.clearTimeout(refreshTimer);
      window.clearTimeout(refreshTimer2);
      ctx.revert();
    };
  }, [animateOnScroll, isActive, showCanvas, showCopy]);

  return (
    <section
      ref={sectionRef}
      id="light"
      className={`prism-section${
        !showCanvas ? " prism-section--copy-only" : ""
      }${!showCopy ? " prism-section--canvas-only" : ""}${
        animateOnScroll ? " prism-section--animated" : ""
      }`}
      aria-label="Prism showcase"
    >
      {showCanvas ? ( 
        <>
          <div className="prism-section-glow" aria-hidden="true" />
          <div className="prism-section-canvas">
            <Prism
              animationType="rotate3d"
              timeScale={0.2}
              height={10}
              baseWidth={15}
              scale={0.5}
              glow={0.9}
              noise={0.1}
              bloom={0.8}
              colorFrequency={0.9}
              hoverStrength={5}
              inertia={0.01}
              hueShift={0}
              transparent
              suspendWhenOffscreen
            />
          </div>
        </>
      ) : null}

      {showCopy ? (
        <div className="prism-section-content">
          <p className="prism-section-copy prism-section-copy--left">
            You
            <br />
            Bring
            <br />
            Light
          </p>
          <div className="prism-section-center" aria-hidden="true" />
          <p className="prism-section-copy prism-section-copy--right">
            We
            <br />
            Shape
            <br />
            It
          </p>
        </div>
      ) : null}
    </section>
  );
}
