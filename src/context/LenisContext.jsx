"use client";

import { createContext, useContext } from "react";

const LenisContext = createContext(null);

export function LenisProvider({ value, children }) {
  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}
