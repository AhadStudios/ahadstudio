"use client";

import { useCallback } from "react";
import { HERO_PANEL_ID } from "@/data/sectionNav";
import { useShowcaseNavMenu } from "@/context/ShowcaseNavMenuContext";

export function usePanelNavigate() {
  const { navigateTo } = useShowcaseNavMenu();

  const goToHome = useCallback(() => navigateTo(HERO_PANEL_ID), [navigateTo]);
  const goToWork = useCallback(() => navigateTo("work"), [navigateTo]);
  const goToStack = useCallback(() => navigateTo("stack"), [navigateTo]);
  const goToContact = useCallback(() => navigateTo("contact"), [navigateTo]);

  return {
    navigateTo,
    goToHome,
    goToWork,
    goToStack,
    goToContact,
  };
}
