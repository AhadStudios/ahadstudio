"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Cursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    // Only enable on devices with a fine pointer (no touch screens)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    let visible = false;

    const xTo = gsap.quickTo(dot, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e) => {
      if (!visible) {
        visible = true;
        gsap.set(dot, { x: e.clientX, y: e.clientY });
        gsap.to(dot, { autoAlpha: 1, duration: 0.3 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onLeave = () => {
      visible = false;
      gsap.to(dot, { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={dotRef} className="cursor" aria-hidden="true">
      <span className="cursor-inner" />
    </div>
  );
}
