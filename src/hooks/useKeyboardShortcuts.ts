import { useEffect } from "react";
import type { FileOperations, ViewMode } from "../types";

export function useKeyboardShortcuts(ops: FileOperations, setViewMode: (mode: ViewMode) => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      if (e.key === "s" && e.shiftKey) {
        e.preventDefault();
        ops.saveFileAs();
      } else if (e.key === "s") {
        e.preventDefault();
        ops.saveFile();
      } else if (e.key === "o") {
        e.preventDefault();
        ops.openFile();
      } else if (e.key === "n") {
        e.preventDefault();
        ops.newFile();
      } else if (e.key === "1") {
        e.preventDefault();
        setViewMode("editor");
      } else if (e.key === "2") {
        e.preventDefault();
        setViewMode("split");
      } else if (e.key === "3") {
        e.preventDefault();
        setViewMode("preview");
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [ops, setViewMode]);
}
