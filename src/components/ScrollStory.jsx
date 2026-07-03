"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/animations/helpers";
import { initScrollStory, refreshScrollStory } from "@/animations/scrollStory";
import { useIntroExperience } from "@/components/intro/IntroExperienceProvider";

export default function ScrollStory() {
  const { introComplete } = useIntroExperience();

  useEffect(() => {
    if (!introComplete) return undefined;

    const context = gsap.context(() => {
      initScrollStory();
    });

    const handleResize = () => refreshScrollStory();

    window.addEventListener("resize", handleResize);
    const refreshTimer = window.setTimeout(() => refreshScrollStory(), 500);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("resize", handleResize);
      context.revert();
    };
  }, [introComplete]);

  useEffect(() => {
    if (!introComplete) return undefined;

    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => window.clearTimeout(timer);
  }, [introComplete]);

  return null;
}
