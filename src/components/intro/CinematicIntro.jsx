"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations/helpers";
import { useIntroExperience } from "@/components/intro/IntroExperienceProvider";

const LOG_PREFIX = "[intro]";

const COPY = {
  idea: "YOUR IDEA",
  craft: "MY CRAFT",
};

function logStep(message) {
  console.log(`${LOG_PREFIX} ${message}`);
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function tweenTo(target, vars) {
  return new Promise((resolve) => {
    gsap.to(target, {
      ...vars,
      onComplete: resolve,
      onInterrupt: resolve,
    });
  });
}

/** Wait for React commit + paint after setState (replaces flushSync). */
function waitForPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

export default function CinematicIntro() {
  const overlayRef = useRef(null);
  const portalRef = useRef(null);
  const videoRef = useRef(null);
  const lineRef = useRef(null);
  const completeIntroRef = useRef(null);
  const finishedRef = useRef(false);
  const sequenceIdRef = useRef(0);
  const [activeLine, setActiveLine] = useState(null);
  const { introComplete, completeIntro } = useIntroExperience();

  useEffect(() => {
    completeIntroRef.current = completeIntro;
  }, [completeIntro]);

  useEffect(() => {
    if (introComplete) return undefined;

    const overlay = overlayRef.current;
    const portal = portalRef.current;
    const video = videoRef.current;

    if (!overlay || !portal || !video) {
      logStep("ABORT — overlay refs missing on mount");
      document.documentElement.classList.remove("is-intro-active");
      completeIntroRef.current();
      return undefined;
    }

    const sequenceId = ++sequenceIdRef.current;
    let disposed = false;

    const isActive = () => sequenceId === sequenceIdRef.current && !disposed;

    const releaseIntroLock = () => {
      document.documentElement.classList.remove("is-intro-active");
      logStep("intro lock released — site-main visible");
    };

    const finishIntro = () => {
      if (!isActive() || finishedRef.current) return;
      finishedRef.current = true;

      logStep("Intro Complete");
      releaseIntroLock();

      try {
        handoffVideo(video, 0);
        gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
        completeIntroRef.current();
      } catch (error) {
        console.error(`${LOG_PREFIX} finishIntro failed`, error);
        gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
        completeIntroRef.current();
      }
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      releaseIntroLock();
      handoffVideo(video, 0);
      gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
      completeIntroRef.current();
      return undefined;
    }

    logStep("Intro Start");
    document.documentElement.classList.add("is-intro-active");
    video.pause();
    video.load();

    const line = lineRef.current;
    if (line) {
      gsap.set(line, { autoAlpha: 0 });
    }
    gsap.set(portal, {
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      scale: 0.08,
      autoAlpha: 0,
      borderRadius: "24px",
      transformOrigin: "50% 50%",
    });

    const showLine = async (lineKey) => {
      if (!isActive()) return;

      setActiveLine(lineKey);
      await waitForPaint();

      const el = lineRef.current;
      if (!el) {
        logStep(`ABORT — line ref missing for ${lineKey}`);
        return;
      }

      gsap.killTweensOf(el);
      gsap.set(el, { autoAlpha: 0 });

      logStep(lineKey === "idea" ? "Show Your Idea" : "Show My Craft");

      await tweenTo(el, {
        autoAlpha: 1,
        duration: 0.85,
        ease: "power2.out",
      });
      if (!isActive()) return;

      await delay(1000);
      if (!isActive()) return;

      await tweenTo(el, {
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.in",
      });
      if (!isActive()) return;

      setActiveLine(null);
      await waitForPaint();
    };

    const waitForVideo = () =>
      new Promise((resolve) => {
        if (video.readyState >= 2) {
          resolve();
          return;
        }

        const done = () => {
          window.clearTimeout(timer);
          video.removeEventListener("canplay", done);
          video.removeEventListener("error", onError);
          resolve();
        };

        const onError = () => {
          console.error(`${LOG_PREFIX} VIDEO ERROR — failed to load /loop1.mp4`);
          done();
        };

        const timer = window.setTimeout(done, 6000);
        video.addEventListener("canplay", done, { once: true });
        video.addEventListener("error", onError, { once: true });
      });

    const runVideoExpansion = async () => {
      if (!isActive()) return;

      await waitForVideo();
      if (!isActive()) return;

      logStep("VIDEO LOADED");
      logStep("STEP 3 START — revealing video");

      video.play().catch((error) => {
        console.warn(`${LOG_PREFIX} video.play() blocked`, error);
      });

      logStep("VIDEO PLAYING");

      await tweenTo(portal, {
        autoAlpha: 1,
        scale: 0.16,
        duration: 0.7,
        ease: "power2.inOut",
      });
      if (!isActive()) return;

      await tweenTo(portal, {
        scale: 1,
        borderRadius: "0px",
        duration: 2.1,
        ease: "power3.inOut",
      });
      if (!isActive()) return;

      logStep("STEP 3 COMPLETE");
      finishIntro();
    };

    const runSequence = async () => {
      try {
        await showLine("idea");
        if (!isActive()) return;
        logStep("STEP 1 COMPLETE");

        await showLine("craft");
        if (!isActive()) return;
        logStep("STEP 2 COMPLETE");

        await delay(150);
        await runVideoExpansion();
      } catch (error) {
        console.error(`${LOG_PREFIX} sequence error`, error);
        if (isActive()) finishIntro();
      }
    };

    runSequence();

    return () => {
      disposed = true;
      gsap.killTweensOf([portal, lineRef.current].filter(Boolean));
    };
  }, [introComplete]);

  if (introComplete) return null;

  return (
    <div className="cinematic-intro" ref={overlayRef} aria-hidden={introComplete}>
      <div className="cinematic-intro-backdrop" />

      <div className="cinematic-intro-stage">
        <div className="cinematic-intro-portal" ref={portalRef}>
          <video
            ref={videoRef}
            className="cinematic-intro-video"
            src="/loop1.mp4"
            muted
            playsInline
            preload="auto"
            loop
          />
          <div className="cinematic-intro-portal-vignette" aria-hidden="true" />
        </div>

        <div className="cinematic-intro-copy">
          <p
            ref={lineRef}
            className="cinematic-intro-line cinematic-intro-line--solo"
          >
            {activeLine ? COPY[activeLine] : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

function handoffVideo(video, attempt = 0) {
  const slot = document.getElementById("hero-video-slot");

  if (!slot || !video) {
    if (attempt < 20) {
      window.setTimeout(() => handoffVideo(video, attempt + 1), 100);
    }
    return;
  }

  if (video.parentElement !== slot) {
    video.className = "hero-cinematic-video";
    video.setAttribute("aria-hidden", "true");
    slot.appendChild(video);
  }

  gsap.set(video, { clearProps: "all" });
  video.className = "hero-cinematic-video";
  video.style.position = "absolute";
  video.style.inset = "0";
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "cover";
  video.style.borderRadius = "0";
  video.play().catch((error) => {
    console.warn(`${LOG_PREFIX} handoff video.play() blocked`, error);
  });

  logStep("VIDEO HANDED OFF TO HERO");
  logStep("Hero Mount");
}
