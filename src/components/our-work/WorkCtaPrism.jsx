"use client";

import dynamic from "next/dynamic";

const Prism = dynamic(() => import("@/components/Prism"), {
  ssr: false,
  loading: () => null,
});

export default function WorkCtaPrism() {
  return (
    <Prism
      animationType="rotate3d"
      timeScale={0.18}
      height={10}
      baseWidth={15}
      scale={0.48}
      glow={0.75}
      noise={0.08}
      bloom={0.7}
      colorFrequency={0.85}
      hoverStrength={3}
      inertia={0.01}
      hueShift={0}
      transparent
    />
  );
}
