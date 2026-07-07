"use client";

import { usePanelNavigate } from "@/hooks/usePanelNavigate";

export default function PanelNavLink({
  panelId,
  className = "",
  children,
  ...props
}) {
  const { navigateTo } = usePanelNavigate();

  return (
    <button
      type="button"
      className={className}
      onClick={() => navigateTo(panelId)}
      {...props}
    >
      {children}
    </button>
  );
}
