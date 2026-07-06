"use client";

import { useIntroExperience } from "@/components/intro/IntroExperienceProvider";
import Navbar from "@/components/Navbar";
import GlassWidget from "@/components/GlassWidget";
import Cursor from "@/components/Cursor";

export default function SiteChrome() {
  const { introComplete } = useIntroExperience();

  return (
    <div
      className={`site-chrome${introComplete ? " is-visible" : ""}`}
      suppressHydrationWarning
    >
      <Cursor />
      <Navbar />
      <GlassWidget />
    </div>
  );
}
