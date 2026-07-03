"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/animations/helpers";
import { showcaseNavItems } from "@/data/sectionNav";

function NavButton({ item, isActive, disabled, onSelect }) {
  return (
    <button
      type="button"
      className={`showcase-nav-btn showcase-nav-btn--floating${
        isActive ? " is-active" : ""
      }`}
      aria-current={isActive ? "true" : undefined}
      aria-label={item.label}
      disabled={disabled}
      onClick={() => onSelect(item.id)}
    >
      <span className="showcase-nav-btn-glow" aria-hidden="true" />
      <span className="showcase-nav-btn-icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="showcase-nav-btn-label">{item.label}</span>
    </button>
  );
}

export default function ShowcaseNav({
  menuOpen,
  activeId,
  disabled,
  onSelect,
  onCloseMenu,
}) {
  const menuRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !menuOpen) return undefined;

    const buttons = menu.querySelectorAll(".showcase-nav-btn--floating");
    gsap.killTweensOf([menu, buttons]);
    gsap.fromTo(
      menu,
      { autoAlpha: 0, y: -6 },
      { autoAlpha: 1, y: 0, duration: 0.32, ease: "power3.out" },
    );
    gsap.fromTo(
      buttons,
      { autoAlpha: 0, y: -4 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.28,
        stagger: 0.04,
        ease: "power3.out",
        delay: 0.04,
      },
    );

    return () => {
      gsap.killTweensOf([menu, buttons]);
    };
  }, [menuOpen]);

  if (!menuOpen || !mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        className="showcase-section-menu-backdrop"
        aria-label="Close section menu"
        tabIndex={-1}
        onClick={onCloseMenu}
      />

      <nav
        ref={menuRef}
        className="showcase-section-menu is-open"
        aria-label="Section menu"
      >
        <div className="showcase-section-menu-track">
          {showcaseNavItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              disabled={disabled}
              onSelect={onSelect}
            />
          ))}
        </div>
      </nav>
    </>,
    document.body,
  );
}
