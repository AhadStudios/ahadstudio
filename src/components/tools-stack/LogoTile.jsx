"use client";

import { useLayoutEffect, useRef } from "react";
import { createFloatingTween, gsap } from "@/animations/helpers";

export default function LogoTile({ logo, layout, index }) {
  const tileRef = useRef(null);
  const floatRef = useRef(null);

  useLayoutEffect(() => {
    const tile = tileRef.current;
    const floatNode = floatRef.current;
    if (!tile || !floatNode) return undefined;

    gsap.set(tile, {
      rotation: layout.rotate,
      transformPerspective: 600,
    });

    const tween = createFloatingTween(floatNode, {
      y: -10 - (index % 3) * 3,
      x: 5 + (index % 2) * 4,
      duration: 3.8 + index * 0.35,
      delay: index * 0.12,
    });

    const onEnter = () => {
      gsap.to(tile, {
        y: -6,
        rotateX: -6,
        rotateY: 12,
        rotation: layout.rotate + 8,
        scale: 1.08,
        boxShadow: `0 18px 48px ${logo.glow}, 0 0 0 1px rgba(255,255,255,0.12)`,
        duration: 0.45,
        ease: "power3.out",
      });
    };

    const onLeave = () => {
      gsap.to(tile, {
        y: 0,
        rotateX: 0,
        rotateY: 0,
        rotation: layout.rotate,
        scale: 1,
        boxShadow: `0 10px 28px rgba(0,0,0,0.35), 0 0 24px ${logo.glow}`,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    tile.addEventListener("mouseenter", onEnter);
    tile.addEventListener("mouseleave", onLeave);

    return () => {
      tween.kill();
      tile.removeEventListener("mouseenter", onEnter);
      tile.removeEventListener("mouseleave", onLeave);
    };
  }, [index, layout.rotate, logo.glow]);

  return (
    <div
      className="tools-stack-logo-slot"
      style={{
        top: layout.top,
        left: layout.left,
        zIndex: layout.z,
      }}
    >
      <div
        ref={floatRef}
        className="tools-stack-logo-float"
        style={{ "--logo-glow": logo.glow }}
      >
        <div
          ref={tileRef}
          className="tools-stack-logo-tile"
          style={{
            boxShadow: `0 10px 28px rgba(0,0,0,0.35), 0 0 24px ${logo.glow}`,
          }}
          data-tooltip={logo.name}
        >
          <img src={logo.src} alt={logo.name} loading="lazy" draggable={false} />
        </div>
      </div>
    </div>
  );
}
