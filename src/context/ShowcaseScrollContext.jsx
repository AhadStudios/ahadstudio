"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { HERO_PANEL_ID } from "@/data/sectionNav";

export const INTERNAL_PANEL_IDS = new Set(["work", "stack", "contact"]);

const ShowcaseScrollContext = createContext({
  scrollY: 0,
  setScrollY: () => {},
  isShowcaseActive: false,
  setIsShowcaseActive: () => {},
  activePanelId: HERO_PANEL_ID,
  setActivePanelId: () => {},
});

export function ShowcaseScrollProvider({ children }) {
  const [scrollY, setScrollY] = useState(0);
  const [isShowcaseActive, setIsShowcaseActive] = useState(false);
  const [activePanelId, setActivePanelId] = useState(HERO_PANEL_ID);

  const value = useMemo(
    () => ({
      scrollY,
      setScrollY,
      isShowcaseActive,
      setIsShowcaseActive,
      activePanelId,
      setActivePanelId,
    }),
    [scrollY, isShowcaseActive, activePanelId],
  );

  return (
    <ShowcaseScrollContext.Provider value={value}>
      {children}
    </ShowcaseScrollContext.Provider>
  );
}

export function useShowcaseScroll() {
  return useContext(ShowcaseScrollContext);
}

export function useIsInternalPanel() {
  const { activePanelId } = useShowcaseScroll();
  return INTERNAL_PANEL_IDS.has(activePanelId);
}
