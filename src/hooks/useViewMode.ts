import { useState, useCallback } from "react";
import type { ViewMode } from "../types";

export function useViewMode() {
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const stored = localStorage.getItem("viewMode");
    if (stored === "editor" || stored === "split" || stored === "preview") return stored;
    return "split";
  });

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem("viewMode", mode);
  }, []);

  return { viewMode, setViewMode };
}
