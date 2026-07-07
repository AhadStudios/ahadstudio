"use client";

import PanelNavLink from "@/components/PanelNavLink";
import { useEffect, useRef } from "react";
import { Draggable, gsap, ScrollTrigger } from "@/animations/helpers";
import { getPanelScroller, prefersReducedMotion } from "@/animations/panelScroll";

const sourceImages = [
  "card2.jpg",
  "card2.jpg",
  "card2.jpg",
  "card2.jpg", "card2.jpg", "card2.jpg", "card2.jpg",
  "card2.jpg", "card2.jpg", "card2.jpg", "card2.jpg",
  "card2.jpg", "card2.jpg", "card2.jpg", "card2.jpg",

];

const aspectRatios = [
  "4 / 3",
  "3 / 4",
  "16 / 10",
  "5 / 4",
  "4 / 5",
  "3 / 2",
  "1 / 1",
];

const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);
const seeded = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const MAX_CARD_WIDTH = 280;
const MIN_CARD_WIDTH = 120;

const ribbonImages = [...sourceImages, ...sourceImages];

export default function ProjectsSlider() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const stageRef = useRef(null);
  const scrollDepthRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const copyItems = section.querySelectorAll("[data-work-slider-reveal]");
      gsap.set(copyItems, { y: 40, autoAlpha: 0 });

      const scroller = getPanelScroller(section);
      const inWorkPage = Boolean(section.closest(".work-page"));

      if (inWorkPage) {
        gsap.to(copyItems, {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });

        ScrollTrigger.create({
          trigger: section,
          scroller,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            scrollDepthRef.current = self.progress;
          },
        });
      } else {
        gsap.to(copyItems, {
          y: 0,
          autoAlpha: 1,
          duration: 1.05,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const viewport = viewportRef.current;
      const cardEls = Array.from(viewport.querySelectorAll(".hero-card"));
      const count = cardEls.length;

      const sizeJitter = cardEls.map((_, i) => 0.92 + seeded(i) * 0.13);
      const rotJitter = cardEls.map((_, i) => (seeded(i + 40) - 0.5) * 4);
      const yJitter = cardEls.map((_, i) => (seeded(i + 80) - 0.5) * 0.035);

      let W = 0;
      let H = 0;
      let base = 200;
      let slot = 80;
      let total = 0;
      let half = 0;
      const baseX = new Array(count).fill(0);

      const measure = () => {
        W = viewport.clientWidth;
        H = viewport.clientHeight;
        base = W < 640 ? 150 : W < 900 ? 185 : 215;
        slot = base * 0.38;
        total = count * slot;
        half = (total - W) / 2;
        for (let i = 0; i < count; i += 1) {
          baseX[i] = i * slot;
          const w = Math.min(MAX_CARD_WIDTH, Math.max(MIN_CARD_WIDTH, base * sizeJitter[i]));
          cardEls[i].style.width = `${w.toFixed(1)}px`;
          cardEls[i].style.aspectRatio = aspectRatios[i % aspectRatios.length];
        }
      };

      let offset = 0;
      let velocity = 0;
      const autoDrift = -0.32;
      let dragging = false;
      let dragLastX = 0;
      let dragLastTime = performance.now();
      const dragConfig = { factor: 0.25 };

      const renderCard = (el, i) => {
        const rawX = baseX[i] + offset;
        const wrapped = ((rawX % total) + total) % total;
        const sx = wrapped - half;
        const width = Math.min(
          MAX_CARD_WIDTH,
          Math.max(MIN_CARD_WIDTH, base * sizeJitter[i]),
        );

        if (sx < -width || sx > W + width) {
          if (el.style.opacity !== "0") el.style.opacity = "0";
          return;
        }

        const cp = clamp01(sx / W);
        const depthBoost = scrollDepthRef.current * 0.12;
        const y =
          (0.05 + 0.62 * Math.pow(cp, 1.4) + yJitter[i] + depthBoost) * H;

        if (sx < W * 0.42 && y > H * 0.24) {
          if (el.style.opacity !== "0") el.style.opacity = "0";
          return;
        }

        const rot = -4 + cp * 8 + rotJitter[i];
        const z = 100 + Math.round(sx);
        const scale = 1 + cp * 0.06 * scrollDepthRef.current;

        el.style.opacity = "1";
        el.style.zIndex = `${z}`;
        el.style.transform =
          `translate3d(${sx.toFixed(1)}px, ${y.toFixed(1)}px, 0) ` +
          `translate(-50%, -50%) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      };

      const renderAll = () => {
        for (let i = 0; i < count; i += 1) renderCard(cardEls[i], i);
      };

      const tick = () => {
        if (!dragging) {
          offset += autoDrift + velocity;
          velocity *= 0.935;
          if (Math.abs(velocity) < 0.01) velocity = 0;
        }
        renderAll();
      };

      measure();
      renderAll();
      gsap.ticker.add(tick);

      const draggable = Draggable.create(viewport, {
        type: "x",
        inertia: false,
        allowContextMenu: true,
        cursor: "grab",
        activeCursor: "grabbing",
        onPress() {
          dragging = true;
          gsap.killTweensOf(dragConfig);
          dragConfig.factor = 0.16;
          gsap.to(dragConfig, { factor: 1, duration: 0.3, ease: "power2.out" });
          dragLastX = this.x;
          dragLastTime = performance.now();
        },
        onDrag() {
          const now = performance.now();
          const dx = this.x - dragLastX;
          const dt = Math.max(now - dragLastTime, 1);
          offset += dx * dragConfig.factor;
          velocity = (dx / dt) * 16;
          dragLastX = this.x;
          dragLastTime = now;
          gsap.set(this.target, { x: 0 });
        },
        onRelease() {
          dragging = false;
          velocity = gsap.utils.clamp(-28, 28, velocity * 1.35);
          gsap.set(this.target, { x: 0 });
        },
      })[0];

      const onWheel = (e) => {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        e.preventDefault();
        offset -= e.deltaX;
        velocity = gsap.utils.clamp(-28, 28, -e.deltaX * 0.45);
      };
      viewport.addEventListener("wheel", onWheel, { passive: false });

      const onResize = () => {
        measure();
        renderAll();
      };
      window.addEventListener("resize", onResize);

      cardEls.forEach((card) => {
        const img = card.querySelector(".hero-card-image");
        const onEnter = () => {
          gsap.to(img, { scale: 1.08, duration: 0.5, ease: "power3.out" });
          gsap.to(card, {
            boxShadow: "0 24px 48px rgba(255,255,255,0.12)",
            duration: 0.45,
          });
        };
        const onLeave = () => {
          gsap.to(img, { scale: 1, duration: 0.45, ease: "power3.out" });
          gsap.to(card, { boxShadow: "none", duration: 0.4 });
        };
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
      });

      return () => {
        gsap.ticker.remove(tick);
        draggable.kill();
        viewport.removeEventListener("wheel", onWheel);
        window.removeEventListener("resize", onResize);
        cardEls.forEach((card) => {
          card.replaceWith(card.cloneNode(true));
        });
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="section-wrapper hero" ref={sectionRef}>
      <div className="section-inner">
        <div className="hero-ribbon" ref={viewportRef} aria-hidden="true">
          <div className="hero-stage" ref={stageRef}>
            {ribbonImages.map((fileName, index) => (
              <article className="hero-card" key={`${fileName}-${index}`}>
                <img
                  src={`/hero-cards/${fileName}`}
                  alt=""
                  className="hero-card-image"
                  draggable="false"
                />
              </article>
            ))}
          </div>
        </div>

        <div className="hero-copy">
          <span className="hero-status" data-work-slider-reveal>Currently Open</span>
          <h1 className="hero-title" data-work-slider-reveal>
            <span className="hero-title-accent">P</span>remium design expertise
            <br />
            backed by bandwidth that
            <br />
            doesn&apos;t break.
          </h1>
          <p className="hero-subtitle" data-work-slider-reveal>
            Your dedicated design team for brand, web, email, and everything
            that touches design. One flat fee, unlimited requests, managed
            through Slack and Notion. No hiring. No freelancer roulette.
          </p>
          <div className="hero-cta-block" data-work-slider-reveal>
            <div className="hero-cta-row">
              <PanelNavLink panelId="contact" className="book-a-call">
                Book A Call
              </PanelNavLink>
              <span className="spinner" aria-hidden="true">
                <span className="spinner-dot" />
                <span className="spinner-dot" />
                <span className="spinner-dot" />
                <span className="spinner-dot" />
                <span className="spinner-dot" />
                <span className="spinner-dot" />
                <span className="spinner-dot" />
                <span className="spinner-dot" />
              </span>
            </div>
            <span className="book-a-call-line" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
