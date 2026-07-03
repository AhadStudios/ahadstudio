"use client";

import dynamic from "next/dynamic";

const Prism = dynamic(() => import("@/components/Prism"), {
  ssr: false,
  loading: () => null,
});

export default function OurWorkFooterPrism() {
  return (
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
  );
}
