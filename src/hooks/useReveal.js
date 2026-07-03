"use client";

import { useEffect } from "react";
import { gsap } from "@/animations/helpers";

export default function useReveal(scopeRef, selector = "[data-reveal]") {
  useEffect(() => {
    if (!scopeRef?.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(selector, { y: 32, autoAlpha: 0 });

      gsap.to(selector, {
        y: 0,
        autoAlpha: 1,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.08,
      });
    }, scopeRef);

    return () => ctx.revert();
  }, [scopeRef, selector]);
}
