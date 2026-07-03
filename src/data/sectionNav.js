export const HERO_PANEL_ID = "hero";

export const homeNavItem = { id: HERO_PANEL_ID, label: "Home", icon: "⌂" };

export const showcasePanels = [
  { id: "work", label: "Work", icon: "□" },
  { id: "stack", label: "Stack", icon: "⬡" },
  { id: "contact", label: "Contact", icon: "○" },
];

export const showcaseNavItems = [homeNavItem, ...showcasePanels];
