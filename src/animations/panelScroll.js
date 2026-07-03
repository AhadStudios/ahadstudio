"use client";

import { ScrollTrigger } from "@/lib/gsap";

export function getPanelScroller(element) {
  return element?.closest(".showcase-panel-inner") || undefined;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function bindPanelScrollerProxy(wrapper, lenis, content) {
  if (!wrapper || !lenis) return () => {};

  try {
    ScrollTrigger.scrollerProxy(wrapper, {
      scrollTop(value) {
        if (arguments.length) {
          if (typeof lenis.scrollTo === "function") {
            lenis.scrollTo(value, { immediate: true });
          }
        }
        return lenis.scroll ?? 0;
      },
      scrollHeight() {
        return content?.scrollHeight ?? wrapper.scrollHeight;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: wrapper.clientWidth,
          height: wrapper.clientHeight,
        };
      },
      pinType: "transform",
    });
  } catch (error) {
    console.error("[panel-scroll] scrollerProxy setup failed", error);
    return () => {};
  }

  const onRefresh = () => {
    try {
      if (typeof lenis.resize === "function") {
        lenis.resize();
      }
    } catch (error) {
      console.warn("[panel-scroll] lenis.resize failed during refresh", error);
    }
  };

  ScrollTrigger.addEventListener("refresh", onRefresh);

  return () => {
    try {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      ScrollTrigger.scrollerProxy(wrapper);
    } catch (error) {
      console.warn("[panel-scroll] scrollerProxy cleanup failed", error);
    }
  };
}
