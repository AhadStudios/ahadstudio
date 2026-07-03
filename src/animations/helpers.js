"use client";

import { gsap, ScrollTrigger, Draggable } from "@/lib/gsap";

let gsapFoundationReady = false;

export function initializeGsapFoundation() {
  if (typeof window === "undefined" || gsapFoundationReady) {
    return;
  }

  gsapFoundationReady = true;
  gsap.config({ nullTargetWarn: false });
}

export function createFloatingTween(target, options = {}) {
  const {
    y = -18,
    x = 8,
    duration = 4,
    ease = "sine.inOut",
    delay = 0,
  } = options;

  return gsap.to(target, {
    y,
    x,
    duration,
    delay,
    yoyo: true,
    repeat: -1,
    ease,
  });
}

export { gsap, ScrollTrigger, Draggable };
