import { useState, useCallback, useEffect } from "react";
import type { RecentFile } from "../types";

const STORAGE_KEY = "recentFiles";
const MAX_RECENT = 10;

function loadFromStorage(): RecentFile[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export function useRecentFiles() {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentFiles));
  }, [recentFiles]);

  const addRecentFile = useCallback((path: string) => {
    setRecentFiles((prev) => {
      const name = path.split("/").pop() ?? path;
      const filtered = prev.filter((f) => f.path !== path);
      return [{ path, name, openedAt: Date.now() }, ...filtered].slice(0, MAX_RECENT);
    });
  }, []);

  const clearRecentFiles = useCallback(() => {
    setRecentFiles([]);
  }, []);

  return { recentFiles, addRecentFile, clearRecentFiles };
}
