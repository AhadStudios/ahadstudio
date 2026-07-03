"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/helpers";

export default function HeroScrollIndicator({ visible = true }) {
  const rootRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return undefined;

    gsap.set(root, { autoAlpha: 0 });

    const bounce = gsap.to(inner, {
      y: 8,
      duration: 1.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      bounce.kill();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    gsap.to(root, {
      autoAlpha: visible ? 1 : 0,
      duration: 0.45,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [visible]);

  return (
    <div className="hero-scroll-indicator" ref={rootRef} aria-hidden={!visible}>
      <div className="hero-scroll-indicator-inner" ref={innerRef}>
        <div className="hero-scroll-indicator-mouse">
          <span className="hero-scroll-indicator-wheel" />
          <span className="hero-scroll-indicator-lines">
            <span />
            <span />
            <span />
          </span>
        </div>
        <span className="hero-scroll-indicator-arrow" aria-hidden="true" />
        <span className="hero-scroll-indicator-label">Scroll Down</span>
      </div>
    </div>
  );
}
