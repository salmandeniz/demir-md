import { useEffect } from "react";
import type { FileOperations, ViewMode } from "../types";

export function useKeyboardShortcuts(
  ops: FileOperations,
  setViewMode: (mode: ViewMode) => void,
  setGoToLineOpen?: (open: boolean) => void,
  undo?: () => void,
  redo?: () => void,
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo?.();
        return;
      }

      if (mod && (e.key === "z" || e.key === "y")) {
        e.preventDefault();
        if (e.key === "z") {
          undo?.();
        } else if (e.key === "y") {
          redo?.();
        }
        return;
      }

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
      } else if (e.key.toLowerCase() === "g" && setGoToLineOpen) {
        e.preventDefault();
        setGoToLineOpen(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [ops, setViewMode, setGoToLineOpen, undo, redo]);
}
