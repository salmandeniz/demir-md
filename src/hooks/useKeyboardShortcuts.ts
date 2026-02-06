import { useEffect } from "react";
import type { FileOperations } from "../types";

export function useKeyboardShortcuts(ops: FileOperations) {
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
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [ops]);
}
