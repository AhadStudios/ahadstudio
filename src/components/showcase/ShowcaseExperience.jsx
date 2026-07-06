"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/animations/helpers";
import { bindPanelScrollerProxy } from "@/animations/panelScroll";
import { HERO_PANEL_ID, showcasePanels } from "@/data/sectionNav";
import { useIntroExperience } from "@/components/intro/IntroExperienceProvider";
import { useShowcaseScroll } from "@/context/ShowcaseScrollContext";
import { useShowcaseNavMenu } from "@/context/ShowcaseNavMenuContext";
import { useLenis } from "@/context/LenisContext";
import VideoHero from "@/components/VideoHero";
import ToolsStack from "@/components/tools-stack/ToolsStack";
import ContactPage from "@/components/contact/ContactPage";
import WorkPage from "@/components/showcase/WorkPage";

const SCROLLABLE_PANELS = new Set(["hero", "work", "stack", "contact"]);

const ALL_PANEL_IDS = [HERO_PANEL_ID, ...showcasePanels.map((p) => p.id)];

function PanelContent({ panelId, isActive }) {
  switch (panelId) {
    case HERO_PANEL_ID:
      return (
        <div className="showcase-view showcase-view--scrollable showcase-view--hero">
          <VideoHero />
        </div>
      );
    case "work":
      return <WorkPage isActive={isActive} />;
    case "stack":
      return (
        <div className="showcase-view showcase-view--scrollable">
          <ToolsStack />
        </div>
      );
    case "contact":
      return (
        <div className="showcase-view showcase-view--scrollable">
          <ContactPage />
        </div>
      );
    default:
      return null;
  }
}

export default function ShowcaseExperience() {
  const { introComplete } = useIntroExperience();
  const lenis = useLenis();
  const { setScrollY, setIsShowcaseActive, setActivePanelId } = useShowcaseScroll();
  const shellRef = useRef(null);
  const panelRefs = useRef({});
  const panelLenisRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const activeIdRef = useRef(HERO_PANEL_ID);
  const hasNavigatedRef = useRef(false);
  const { closeMenu, registerNavigateTo } = useShowcaseNavMenu();

  const [activeId, setActiveId] = useState(HERO_PANEL_ID);
  const [loadedPanels, setLoadedPanels] = useState(() => new Set([HERO_PANEL_ID]));
  const [isReady, setIsReady] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    activeIdRef.current = activeId;
    if (introComplete) {
      setActivePanelId(activeId);
    }
  }, [activeId, introComplete, setActivePanelId]);

  useEffect(() => {
    if (!introComplete) {
      setIsShowcaseActive(false);
      setScrollY(0);
      setActivePanelId(HERO_PANEL_ID);
      return undefined;
    }

    document.documentElement.classList.add("is-showcase-mode");
    setIsShowcaseActive(true);
    setActivePanelId(activeIdRef.current);
    // Lock document scroll; panel-level Lenis handles scrollable sections.
    lenis?.stop();

    return () => {
      document.documentElement.classList.remove("is-showcase-mode");
      setIsShowcaseActive(false);
      setScrollY(0);
      setActivePanelId(HERO_PANEL_ID);
      lenis?.start();
    };
  }, [introComplete, lenis, setIsShowcaseActive, setScrollY, setActivePanelId]);

  useEffect(() => {
    if (!introComplete) return undefined;

    panelLenisRef.current?.destroy();
    panelLenisRef.current = null;

    if (!SCROLLABLE_PANELS.has(activeId)) return undefined;

    const panel = panelRefs.current[activeId];
    const wrapper = panel?.querySelector(".showcase-panel-inner");
    const content = wrapper?.firstElementChild;

    if (!wrapper || !content) return undefined;

    let panelLenis;
    let releaseScrollerProxy = () => {};

    try {
      panelLenis = new Lenis({
        wrapper,
        content,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      panelLenisRef.current = panelLenis;
      panelLenis.on("scroll", ScrollTrigger.update);
      panelLenis.on("scroll", () => {
        setScrollY(panelLenis.scroll);
      });
      setScrollY(panelLenis.scroll);

      releaseScrollerProxy = bindPanelScrollerProxy(wrapper, panelLenis, content);
    } catch (error) {
      console.error("[showcase] panel Lenis / scrollerProxy setup failed", error);
      panelLenisRef.current = null;
      return undefined;
    }

    const update = (time) => {
      panelLenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);

    return () => {
      window.clearTimeout(refreshTimer);
      releaseScrollerProxy();
      gsap.ticker.remove(update);
      panelLenis.destroy();
      if (panelLenisRef.current === panelLenis) {
        panelLenisRef.current = null;
      }
    };
  }, [activeId, introComplete, loadedPanels, setScrollY]);

  const collapseToHamburger = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
  }, []);

  useEffect(() => {
    if (!shellRef.current) return undefined;

    ALL_PANEL_IDS.forEach((panelId) => {
      const node = panelRefs.current[panelId];
      if (!node) return;

      if (panelId === HERO_PANEL_ID) {
        gsap.set(node, {
          autoAlpha: 1,
          filter: "blur(0px)",
          scale: 1,
          y: 0,
          pointerEvents: "auto",
        });
      } else {
        gsap.set(node, {
          autoAlpha: 0,
          filter: "blur(10px)",
          scale: 0.98,
          y: 40,
          pointerEvents: "none",
        });
      }
    });

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!introComplete) return undefined;

    const navbar = document.querySelector(".navbar--hero");
    if (!navbar) return undefined;

    gsap.set(navbar, { autoAlpha: 0, y: -14 });

    const timeline = gsap.timeline({ delay: 0.2, defaults: { ease: "power3.out" } });
    timeline.to(navbar, { autoAlpha: 1, y: 0, duration: 0.9 });

    return () => {
      timeline.kill();
    };
  }, [introComplete]);

  const restoreHomeNavigation = useCallback(() => {
    closeMenu();
    hasNavigatedRef.current = false;
  }, [closeMenu]);

  const switchPanel = useCallback(
    (nextId) => {
      if (!isReady || isAnimatingRef.current || nextId === activeIdRef.current) {
        return;
      }

      const isReturningHome = nextId === HERO_PANEL_ID;

      if (!isReturningHome) {
        collapseToHamburger();
      } else {
        restoreHomeNavigation();
      }

      closeMenu();
      setLoadedPanels((prev) => {
        if (prev.has(nextId)) return prev;
        const next = new Set(prev);
        next.add(nextId);
        return next;
      });

      const currentNode = panelRefs.current[activeIdRef.current];
      const nextNode = panelRefs.current[nextId];
      if (!currentNode || !nextNode) return;

      isAnimatingRef.current = true;
      setIsAnimating(true);
      setActiveId(nextId);

      const outDuration = 0.5;
      const inDuration = 0.9;

      const timeline = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          if (currentInner) gsap.set(currentInner, { clearProps: "y" });
          if (nextInner) gsap.set(nextInner, { clearProps: "y" });

          isAnimatingRef.current = false;
          setIsAnimating(false);
          gsap.set(currentNode, { pointerEvents: "none" });
          gsap.set(nextNode, { pointerEvents: "auto" });

          if (isReturningHome) {
            const video = document.querySelector(".hero-cinematic-video");
            video?.play().catch(() => {});
          }

          window.setTimeout(() => ScrollTrigger.refresh(), 100);
        },
      });

      const currentInner = currentNode.querySelector(".showcase-panel-inner");
      const nextInner = nextNode.querySelector(".showcase-panel-inner");

      timeline
        .to(currentNode, {
          autoAlpha: 0.72,
          filter: "blur(4px)",
          duration: 0.22,
          ease: "power2.out",
        })
        .to(
          currentNode,
          {
            autoAlpha: 0,
            filter: "blur(10px)",
            scale: 0.985,
            y: -36,
            duration: outDuration,
          },
          "-=0.04",
        );

      if (currentInner) {
        timeline.to(
          currentInner,
          { y: -48, duration: outDuration, ease: "power3.in" },
          "<",
        );
      }

      timeline.set(
        nextNode,
        {
          autoAlpha: 0,
          filter: "blur(14px)",
          scale: 0.975,
          y: 56,
          pointerEvents: "none",
        },
        "<0.06",
      );

      if (nextInner) {
        timeline.fromTo(
          nextInner,
          { y: 72 },
          { y: 0, duration: inDuration, ease: "power3.out" },
          "<",
        );
      }

      timeline.to(
        nextNode,
        {
          autoAlpha: 1,
          filter: "blur(0px)",
          scale: 1,
          y: 0,
          duration: inDuration,
          ease: "power3.out",
        },
        "<",
      );

      if (nextInner && SCROLLABLE_PANELS.has(nextId)) {
        gsap.set(nextInner, { scrollTop: 0 });
        timeline.to(
          nextInner,
          { scrollTo: { y: 0 }, duration: 1, ease: "power3.inOut" },
          "<0.15",
        );
      }
    },
    [collapseToHamburger, closeMenu, isReady, restoreHomeNavigation],
  );

  const handleNavSelect = useCallback(
    (nextId) => {
      closeMenu();
      switchPanel(nextId);
    },
    [closeMenu, switchPanel],
  );

  useEffect(() => {
    registerNavigateTo(handleNavSelect);
    return () => registerNavigateTo(() => {});
  }, [handleNavSelect, registerNavigateTo]);

  return (
    <div
      className={`showcase-experience showcase-experience--hamburger${
        introComplete ? " is-ready" : " is-behind-intro"
      }`}
      ref={shellRef}
    >

      <div className="showcase-stage">
        {ALL_PANEL_IDS.map((panelId) => (
          <div
            key={panelId}
            id={`showcase-panel-${panelId}`}
            ref={(node) => {
              panelRefs.current[panelId] = node;
            }}
            className={`showcase-panel${
              SCROLLABLE_PANELS.has(panelId) ? " showcase-panel--scrollable" : ""
            }`}
            aria-hidden={activeId !== panelId}
          >
            <div className="showcase-panel-inner">
              {loadedPanels.has(panelId) ? (
                <PanelContent panelId={panelId} isActive={activeId === panelId} />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
