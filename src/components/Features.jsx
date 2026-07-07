"use client";

import { useLayoutEffect, useRef } from "react";
import { devStickers } from "@/data/devStickers";
import { showcasePeople } from "@/data/serviceLabels";
import { getShowcaseDefault } from "@/data/showcaseDefaults";
import { Draggable, gsap } from "@/animations/helpers";

const STICKER_DIMENSIONS = {
  xs: { width: 48, height: 48 },
  sm: { width: 72, height: 72 },
  md: { width: 96, height: 96 },
  lg: { width: 132, height: 72 },
};

function applyDefaultTransform(dragNode, floatNode, defaults) {
  gsap.killTweensOf([dragNode, floatNode]);

  gsap.set(dragNode, {
    x: 0,
    y: 0,
    left: `${defaults.x}%`,
    top: `${defaults.y}%`,
    xPercent: defaults.xPercent ?? -50,
    yPercent: defaults.yPercent ?? -50,
  });

  gsap.set(floatNode, {
    x: 0,
    y: 0,
    rotation: defaults.rotation ?? 0,
    scale: defaults.scale ?? 1,
  });
}

function getDefaultStyle(defaults) {
  return {
    left: `${defaults.x}%`,
    top: `${defaults.y}%`,
  };
}

export default function Features({ variant = "full", part = "full", isActive = true }) {
  const stageRef = useRef(null);
  const dragRefs = useRef([]);
  const floatRefs = useRef([]);
  const peopleDragRefs = useRef([]);
  const peopleFloatRefs = useRef([]);

  const showIntro = part === "full" || part === "intro";
  const showStickers = part === "full" || part === "stickers";
  const stickersOnly = part === "stickers";
  const boardPeople = stickersOnly
    ? showcasePeople.filter(
        (person) => person.id === "person-center" || person.id === "person-lower",
      )
    : showcasePeople;

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || !showStickers || !isActive) return undefined;

    const peopleOnBoard = stickersOnly
      ? showcasePeople.filter(
          (person) => person.id === "person-center" || person.id === "person-lower",
        )
      : showcasePeople;

    const draggables = [];
    const idleTweens = [];
    const hoverCleanups = [];

    const attachStickerLife = (floatNode, dragNode, defaults, seed = 0) => {
      const baseScale = defaults.scale ?? 1;
      const baseRotation = defaults.rotation ?? 0;

      idleTweens.push(
        gsap.to(floatNode, {
          y: `+=${6 + (seed % 3) * 2}`,
          x: `+=${seed % 2 === 0 ? 4 : -4}`,
          rotation: baseRotation + (seed % 2 === 0 ? 5 : -5),
          duration: 2.8 + seed * 0.15,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        }),
      );

      const onEnter = () => {
        gsap.to(floatNode, {
          y: -14,
          scale: baseScale * 1.12,
          rotation: baseRotation + (seed % 2 === 0 ? 8 : -8),
          duration: 0.35,
          ease: "back.out(2.2)",
        });
        dragNode.classList.add("is-sticker-hover");
      };

      const onLeave = () => {
        gsap.to(floatNode, {
          scale: baseScale,
          rotation: baseRotation,
          duration: 0.55,
          ease: "elastic.out(1, 0.55)",
        });
        dragNode.classList.remove("is-sticker-hover");
      };

      dragNode.addEventListener("mouseenter", onEnter);
      dragNode.addEventListener("mouseleave", onLeave);

      return () => {
        dragNode.removeEventListener("mouseenter", onEnter);
        dragNode.removeEventListener("mouseleave", onLeave);
      };
    };

    const resetAllToDefaults = () => {
      devStickers.forEach((sticker, index) => {
        const dragNode = dragRefs.current[index];
        const floatNode = floatRefs.current[index];
        const defaults = getShowcaseDefault(sticker.id);
        if (!dragNode || !floatNode) return;

        applyDefaultTransform(dragNode, floatNode, defaults);
        draggables[index]?.update();
      });

      peopleOnBoard.forEach((person, index) => {
        const dragNode = peopleDragRefs.current[index];
        const floatNode = peopleFloatRefs.current[index];
        const defaults = getShowcaseDefault(person.id);
        if (!dragNode || !floatNode) return;

        applyDefaultTransform(dragNode, floatNode, defaults);
        const draggableIndex = devStickers.length + index;
        draggables[draggableIndex]?.update();
      });
    };

    devStickers.forEach((sticker, index) => {
      const dragNode = dragRefs.current[index];
      const floatNode = floatRefs.current[index];
      if (!dragNode || !floatNode) return;

      const defaults = getShowcaseDefault(sticker.id);
      const baseScale = defaults.scale ?? 1;

      applyDefaultTransform(dragNode, floatNode, defaults);

      const draggable = Draggable.create(dragNode, {
        type: "x,y",
        bounds: stage,
        inertia: true,
        edgeResistance: 0.82,
        throwResistance: 2800,
        onPress() {
          dragNode.classList.add("is-dragging");
          gsap.to(floatNode, {
            scale: baseScale * 1.14,
            rotation: (defaults.rotation ?? 0) + 6,
            duration: 0.18,
            ease: "power2.out",
          });
        },
        onRelease() {
          dragNode.classList.remove("is-dragging");
          gsap.to(floatNode, {
            scale: baseScale,
            rotation: defaults.rotation ?? 0,
            duration: 0.55,
            ease: "elastic.out(1, 0.6)",
          });
        },
      })[0];

      draggables.push(draggable);
      hoverCleanups.push(attachStickerLife(floatNode, dragNode, defaults, index));
    });

    peopleOnBoard.forEach((person, index) => {
      const dragNode = peopleDragRefs.current[index];
      const floatNode = peopleFloatRefs.current[index];
      if (!dragNode || !floatNode) return;

      const defaults = getShowcaseDefault(person.id);
      const baseScale = defaults.scale ?? 1;

      applyDefaultTransform(dragNode, floatNode, defaults);

      const draggable = Draggable.create(dragNode, {
        type: "x,y",
        bounds: stage,
        inertia: true,
        edgeResistance: 0.82,
        throwResistance: 2800,
        onPress() {
          dragNode.classList.add("is-dragging");
          gsap.to(floatNode, {
            scale: baseScale * 1.1,
            duration: 0.18,
            ease: "power2.out",
          });
        },
        onRelease() {
          dragNode.classList.remove("is-dragging");
          gsap.to(floatNode, {
            scale: baseScale,
            duration: 0.5,
            ease: "elastic.out(1, 0.55)",
          });
        },
      })[0];

      draggables.push(draggable);
      hoverCleanups.push(
        attachStickerLife(floatNode, dragNode, defaults, devStickers.length + index),
      );
    });

    const settleDefaults = () => {
      resetAllToDefaults();
    };

    settleDefaults();
    const rafId = requestAnimationFrame(settleDefaults);

    const handlePageShow = (event) => {
      if (event.persisted) {
        settleDefaults();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pageshow", handlePageShow);
      idleTweens.forEach((tween) => tween.kill());
      hoverCleanups.forEach((cleanup) => cleanup());
      draggables.forEach((instance) => instance.kill());
    };
  }, [isActive, showStickers, stickersOnly]);

  const isDesignerOnly = variant === "designer";

  return (
    <section
      id={stickersOnly ? "sticker-board" : "designer"}
      className={`section-wrapper services-showcase${
        isDesignerOnly && showIntro ? " services-showcase--designer-view" : ""
      }${stickersOnly ? " services-showcase--stickers-only" : ""}`}
      aria-label="Services showcase"
    >
      <div className="services-showcase-inner">
        {showIntro ? (
        <header className="services-showcase-header">
          <h2 className="services-showcase-title">Product Designer</h2>

          <div className="services-showcase-intro-row">
            <p className="services-showcase-intro-text services-showcase-intro-text--left">
              I&apos;m currently orchestrating experiences at Hero Digital for a
              leading tech company that rhymes with Snapple, headquartered in
              Cupertino, California.
            </p>
            <p className="services-showcase-intro-text services-showcase-intro-text--center">
              I&apos;m a passionate designer with many years of experience who
              uses research, data, and thoughtful design to create delightful
              products that scale.
            </p>
            <PanelNavLink panelId="contact" className="services-showcase-cta">
              Get in touch →
            </PanelNavLink>
          </div>
        </header>
        ) : null}

        {showStickers ? (
        <div id="creative-lab" className="services-showcase-panel">
          <div ref={stageRef} className="services-showcase-stage">
            {boardPeople.map((person, index) => {
              const defaults = getShowcaseDefault(person.id);

              return (
                <div
                  key={person.id}
                  ref={(node) => {
                    peopleDragRefs.current[index] = node;
                  }}
                  className="showcase-person-draggable"
                  data-story-person={person.id === "person-center" ? "center" : undefined}
                  style={{ zIndex: person.zIndex, ...getDefaultStyle(defaults) }}
                >
                  <div
                    ref={(node) => {
                      peopleFloatRefs.current[index] = node;
                    }}
                    className={`showcase-person-float showcase-person-float--${person.size}`}
                  >
                    <img
                      src={person.src}
                      alt=""
                      className="showcase-person-img"
                      draggable="false"
                    />
                  </div>
                </div>
              );
            })}

            {devStickers.map((sticker, index) => {
              const dimensions = STICKER_DIMENSIONS[sticker.size] ?? STICKER_DIMENSIONS.md;
              const defaults = getShowcaseDefault(sticker.id);

              return (
                <div
                  key={sticker.id}
                  ref={(node) => {
                    dragRefs.current[index] = node;
                  }}
                  className="dev-sticker-draggable"
                  style={getDefaultStyle(defaults)}
                >
                  <div
                    ref={(node) => {
                      floatRefs.current[index] = node;
                    }}
                    className={`dev-sticker-float dev-sticker-float--${sticker.size}`}
                  >
                    <img
                      src={sticker.src}
                      alt={sticker.alt}
                      className="dev-sticker-img"
                      width={dimensions.width}
                      height={dimensions.height}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        ) : null}
      </div>
    </section>
  );
}
