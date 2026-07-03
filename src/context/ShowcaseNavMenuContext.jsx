"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ShowcaseNavMenuContext = createContext({
  isMenuOpen: false,
  toggleMenu: () => {},
  closeMenu: () => {},
});

export function ShowcaseNavMenuProvider({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
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
    () => ({ isMenuOpen, toggleMenu, closeMenu }),
    [isMenuOpen, toggleMenu, closeMenu],
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
