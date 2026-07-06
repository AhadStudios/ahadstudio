"use client";

import { useEffect, useRef } from "react";
import { useShowcaseNavMenu } from "@/context/ShowcaseNavMenuContext";
import { useShowcaseScroll } from "@/context/ShowcaseScrollContext";
import { showcaseNavItems } from "@/data/sectionNav";

const ALL_PAGES = showcaseNavItems; // [Home, Work, Stack, Contact]

function PlusIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path d="M5.5 1V10M1 5.5H10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path d="M1.5 1.5L9.5 9.5M9.5 1.5L1.5 9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function PageDropdownMenu() {
  const { isMenuOpen, toggleMenu, closeMenu, navigateTo } = useShowcaseNavMenu();
  const { activePanelId } = useShowcaseScroll();
  const wrapperRef = useRef(null);

  const currentPage = ALL_PAGES.find((p) => p.id === activePanelId) ?? ALL_PAGES[0];
  const menuItems = ALL_PAGES.filter((p) => p.id !== activePanelId);

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

  const handleSelect = (id) => {
    navigateTo(id);
    closeMenu();
  };

  return (
    <div className="page-dropdown" ref={wrapperRef}>
      <button
        type="button"
        className={`page-dropdown-trigger${isMenuOpen ? " is-open" : ""}`}
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-haspopup="listbox"
        aria-label={`${currentPage.label} — ${isMenuOpen ? "close" : "open"} page menu`}
      >
        <span className="page-dropdown-label">{currentPage.label}</span>
        <span className="page-dropdown-icon">
          {isMenuOpen ? <CloseIcon /> : <PlusIcon />}
        </span>
      </button>

      {isMenuOpen && (
        <div
          className="page-dropdown-menu"
          role="listbox"
          aria-label="Navigate to page"
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected="false"
              className="page-dropdown-item"
              onClick={() => handleSelect(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
