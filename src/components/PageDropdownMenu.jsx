"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/animations/helpers";
import { useShowcaseNavMenu } from "@/context/ShowcaseNavMenuContext";
import { useShowcaseScroll } from "@/context/ShowcaseScrollContext";
import { showcaseNavItems } from "@/data/sectionNav";

const ALL_PAGES = showcaseNavItems; // Home, Work, Stack, Contact

export default function PageDropdownMenu() {
  const { isMenuOpen, toggleMenu, closeMenu, navigateTo } = useShowcaseNavMenu();
  const { activePanelId } = useShowcaseScroll();

  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const iconRef = useRef(null);
  const tlRef = useRef(null);
  const itemsRef = useRef([]);

  const currentPage = ALL_PAGES.find((p) => p.id === activePanelId) ?? ALL_PAGES[0];
  const menuItems = ALL_PAGES.filter((p) => p.id !== activePanelId);

  // Set initial hidden state synchronously before first paint
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const icon = iconRef.current;
    if (panel) gsap.set(panel, { display: "none", opacity: 0, y: -12, scale: 0.95 });
    if (icon) gsap.set(icon, { rotation: 0 });
  }, []);

  // Drive open/close animations from isMenuOpen state
  useEffect(() => {
    const panel = panelRef.current;
    const icon = iconRef.current;
    if (!panel || !icon) return;

    if (tlRef.current) tlRef.current.kill();

    if (isMenuOpen) {
      gsap.set(panel, { display: "block" });

      const tl = gsap.timeline();
      tl.fromTo(
        panel,
        { opacity: 0, y: -12, scale: 0.95, clipPath: "inset(0 0 100% 0 round 24px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0 0 0% 0 round 24px)",
          duration: 0.48,
          ease: "expo.out",
        },
      );

      const items = itemsRef.current.filter(Boolean);
      if (items.length) {
        tl.fromTo(
          items,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.055, ease: "power3.out" },
          "-=0.26",
        );
      }

      gsap.to(icon, { rotation: 45, duration: 0.42, ease: "expo.out" });
      tlRef.current = tl;
    } else {
      const isVisible = window.getComputedStyle(panel).display !== "none";
      if (!isVisible) return;

      const tl = gsap.timeline({
        onComplete: () => gsap.set(panel, { display: "none" }),
      });
      tl.to(panel, {
        opacity: 0,
        y: -8,
        scale: 0.96,
        clipPath: "inset(0 0 100% 0 round 24px)",
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(icon, { rotation: 0, duration: 0.3, ease: "power2.in" });
      tlRef.current = tl;
    }
  }, [isMenuOpen]);

  // Click-outside to close
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const onPointerDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isMenuOpen, closeMenu]);

  // Kill timeline on unmount
  useEffect(() => () => { tlRef.current?.kill(); }, []);

  const handleSelect = useCallback(
    (id) => {
      navigateTo(id);
      closeMenu();
    },
    [navigateTo, closeMenu],
  );

  return (
    <div className="page-dropdown" ref={wrapperRef}>
      {/* Trigger capsule */}
      <button
        type="button"
        className={`page-dropdown-trigger${isMenuOpen ? " is-open" : ""}`}
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-haspopup="listbox"
        aria-label={`${currentPage.label} — ${isMenuOpen ? "close" : "open"} navigation`}
      >
        <span className="page-dropdown-label">{currentPage.label}</span>
        <span className="page-dropdown-icon-btn" ref={iconRef} aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M5 1V9M1 5H9"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown panel — always mounted, GSAP controls visibility */}
      <div
        ref={panelRef}
        className="page-dropdown-menu"
        role="listbox"
        aria-label="Navigate to page"
        aria-hidden={!isMenuOpen}
      >
        {menuItems.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => { itemsRef.current[i] = el; }}
            type="button"
            role="option"
            aria-selected="false"
            className="page-dropdown-item"
            tabIndex={isMenuOpen ? 0 : -1}
            onClick={() => handleSelect(item.id)}
          >
            <span className="page-dropdown-item-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
