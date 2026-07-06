"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const ShowcaseNavMenuContext = createContext({
  isMenuOpen: false,
  toggleMenu: () => {},
  closeMenu: () => {},
  navigateTo: () => {},
  registerNavigateTo: () => {},
});

export function ShowcaseNavMenuProvider({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigateToRef = useRef(() => {});

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const registerNavigateTo = useCallback((fn) => {
    navigateToRef.current = fn;
  }, []);

  const navigateTo = useCallback((panelId) => {
    navigateToRef.current(panelId);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen, closeMenu]);

  const value = useMemo(
    () => ({ isMenuOpen, toggleMenu, closeMenu, navigateTo, registerNavigateTo }),
    [isMenuOpen, toggleMenu, closeMenu, navigateTo, registerNavigateTo],
  );

  return (
    <ShowcaseNavMenuContext.Provider value={value}>
      {children}
    </ShowcaseNavMenuContext.Provider>
  );
}

export function useShowcaseNavMenu() {
  return useContext(ShowcaseNavMenuContext);
}
