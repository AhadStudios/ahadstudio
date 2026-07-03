"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const NavMenuContext = createContext(null);

export function useNavMenu() {
  const context = useContext(NavMenuContext);
  if (!context) {
    throw new Error("useNavMenu must be used within NavMenuProvider");
  }
  return context;
}

export default function NavMenuProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  const value = useMemo(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );

  return (
    <NavMenuContext.Provider value={value}>
      {children}
    </NavMenuContext.Provider>
  );
}
