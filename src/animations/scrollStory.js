import { gsap, ScrollTrigger } from "@/animations/helpers";
import { initializeGsapFoundation } from "@/animations/helpers";

const STORY_DEFAULTS = {
  ease: "power3.out",
  duration: 1,
};

function setupHeroStory() {
  const hero = document.querySelector("#hero");
  if (!hero) return;

  gsap.to(".hero-ribbon", {
    y: -42,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.to(".hero-copy", {
    y: -28,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

function setupTrustedBrandsStory() {
  const section = document.querySelector(".trusted-brands");
  if (!section) return;

  gsap.fromTo(
    ".trusted-brands-inner",
    { y: 56, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 1.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
        toggleActions: "restart none restart none",
        invalidateOnRefresh: true,
      },
    },
  );
}

function setupProductDesignerHeaderStory() {
  const section = document.querySelector(".services-showcase");
  if (!section) return;

  const header = section.querySelector(".services-showcase-header");
  const title = section.querySelector(".services-showcase-title");
  const introItems = section.querySelectorAll(
    ".services-showcase-intro-text, .services-showcase-cta",
  );

  if (!header || !title) return;

  const timeline = gsap.timeline({
    defaults: STORY_DEFAULTS,
    scrollTrigger: {
      trigger: header,
      start: "top 82%",
      toggleActions: "restart none restart none",
      invalidateOnRefresh: true,
    },
  });

  timeline
    .fromTo(title, { y: 48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" })
    .fromTo(
      introItems,
      { y: 32, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: "power3.out" },
      "-=0.55",
    );
}

function setupStickerBoardStory() {
  const panel = document.querySelector(".services-showcase-panel");
  if (!panel || panel.closest(".work-page")) return;

  gsap.fromTo(
    panel,
    {
      y: 20,
      autoAlpha: 0,
      filter: "blur(8px)",
    },
    {
      y: 0,
      autoAlpha: 1,
      filter: "blur(0px)",
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: panel,
        start: "top 88%",
        toggleActions: "restart none restart none",
        invalidateOnRefresh: true,
      },
    },
  );
}

function setupPrismStory() {
  const section = document.querySelector(".prism-section:not(.prism-section--animated)");
  if (!section) return;

  const left = section.querySelector(".prism-section-copy--left");
  const right = section.querySelector(".prism-section-copy--right");
  const canvas = section.querySelector(".prism-section-canvas");

  gsap.set([left, right], { y: 32, autoAlpha: 0 });
  gsap.set(canvas, { scale: 1, transformOrigin: "50% 50%" });

  const timeline = gsap.timeline({
    defaults: STORY_DEFAULTS,
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=125%",
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  timeline
    .to([left, right], { y: 0, autoAlpha: 1, duration: 0.28, ease: "power3.out" })
    .to(left, { x: -42, ease: "none", duration: 1 }, 0.18)
    .to(right, { x: 42, ease: "none", duration: 1 }, 0.18)
    .to(canvas, { scale: 1.045, ease: "none", duration: 1 }, 0);
}

function setupHeroVideoStory() {
  const hero = document.querySelector("#hero");
  const video = document.querySelector("#hero-video-slot video");
  if (!hero || !video) return;

  gsap.fromTo(
    video,
    { autoAlpha: 1 },
    {
      autoAlpha: 0.15,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    },
  );
}

function setupContactPageStory() {
  const section = document.querySelector(".contact-page");
  if (!section) return;

  const title = section.querySelector(".contact-page-title");
  const lead = section.querySelector(".contact-page-lead");
  const features = section.querySelectorAll(".contact-page-feature");
  const card = section.querySelector(".contact-page-form-card");

  const timeline = gsap.timeline({
    defaults: STORY_DEFAULTS,
    scrollTrigger: {
      trigger: section,
      start: "top 78%",
      toggleActions: "restart none restart none",
      invalidateOnRefresh: true,
    },
  });

  if (title) {
    timeline.fromTo(title, { y: 48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out" });
  }
  if (lead) {
    timeline.fromTo(lead, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=0.55");
  }
  if (features.length) {
    timeline.fromTo(
      features,
      { y: 32, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.95, stagger: 0.12, ease: "power3.out" },
      "-=0.45",
    );
  }
  if (card) {
    timeline.fromTo(card, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=0.55");
  }
}

function setupSimpleReveals() {
  const reveal = (selector, trigger, start = "top 85%") => {
    const targets = document.querySelectorAll(selector);
    if (!targets.length) return;

    gsap.fromTo(
      targets,
      { y: 36, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger,
          start,
          toggleActions: "restart none restart none",
          invalidateOnRefresh: true,
        },
      },
    );
  };

  reveal(".trusted-brands-inner", ".trusted-brands");
  reveal(
    ".services-showcase-title, .services-showcase-intro-text, .services-showcase-cta",
    ".services-showcase-header",
    "top 80%",
  );
  reveal(".services-showcase-panel", ".services-showcase-panel", "top 88%");
  reveal(
    ".prism-section-copy",
    ".prism-section",
    "top 80%",
  );
  reveal(
    ".contact-page-title, .contact-page-lead, .contact-page-feature, .contact-page-form-card",
    ".contact-page",
    "top 82%",
  );
}

export function initScrollStory() {
  initializeGsapFoundation();

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    setupSimpleReveals();
    return;
  }

  const media = gsap.matchMedia();

  media.add("(min-width: 901px)", () => {
    setupHeroStory();
    setupHeroVideoStory();
    setupTrustedBrandsStory();
    setupProductDesignerHeaderStory();
    setupStickerBoardStory();
    setupPrismStory();
    setupContactPageStory();
  });

  media.add("(max-width: 900px)", () => {
    setupHeroStory();
    setupHeroVideoStory();
    setupSimpleReveals();
  });
}

export function refreshScrollStory() {
  ScrollTrigger.refresh();
}
