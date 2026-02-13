import { useState, useEffect, useCallback } from "react";

const MIN_ZOOM = 50;
const MAX_ZOOM = 200;
const ZOOM_STEP = 10;

export function useZoom() {
  const [zoom, setZoom] = useState(() => {
    const stored = localStorage.getItem("zoom");
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (parsed >= MIN_ZOOM && parsed <= MAX_ZOOM) return parsed;
    }
    return 100;
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${zoom}%`;
    localStorage.setItem("zoom", String(zoom));
  }, [zoom]);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(100);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        zoomIn();
      } else if (e.key === "-") {
        e.preventDefault();
        zoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zoomIn, zoomOut, resetZoom]);

  return { zoom, zoomIn, zoomOut, resetZoom };
}
