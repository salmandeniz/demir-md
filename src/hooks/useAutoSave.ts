import { useEffect, useRef, useCallback } from "react";
import { writeTextFile, readTextFile, remove, exists, mkdir } from "@tauri-apps/plugin-fs";
import { appDataDir, join } from "@tauri-apps/api/path";

const AUTOSAVE_FILE = "autosave.md";
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

interface UseAutoSaveArgs {
  content: string;
  filePath: string | null;
  isDirty: boolean;
}

export function useAutoSave({ content, filePath, isDirty }: UseAutoSaveArgs) {
  const contentRef = useRef(content);
  const filePathRef = useRef(filePath);
  const isDirtyRef = useRef(isDirty);

  useEffect(() => {
    contentRef.current = content;
    filePathRef.current = filePath;
    isDirtyRef.current = isDirty;
  }, [content, filePath, isDirty]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isDirtyRef.current && contentRef.current) {
        try {
          const appData = await appDataDir();
          if (!(await exists(appData))) {
            await mkdir(appData, { recursive: true });
          }
          const autoSavePath = await join(appData, AUTOSAVE_FILE);
          const data = JSON.stringify({
            content: contentRef.current,
            filePath: filePathRef.current,
            timestamp: Date.now(),
          });
          await writeTextFile(autoSavePath, data);
        } catch {
          // Silently fail - auto-save is best effort
        }
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const clearAutoSave = useCallback(async () => {
    try {
      const appData = await appDataDir();
      const autoSavePath = await join(appData, AUTOSAVE_FILE);
      if (await exists(autoSavePath)) {
        await remove(autoSavePath);
      }
    } catch {
      // Silently fail
    }
  }, []);

  return { clearAutoSave };
}

export async function checkForAutoSave(): Promise<{ content: string; filePath: string | null } | null> {
  try {
    const appData = await appDataDir();
    const autoSavePath = await join(appData, AUTOSAVE_FILE);

    if (!(await exists(autoSavePath))) {
      return null;
    }

    const data = await readTextFile(autoSavePath);
    const parsed = JSON.parse(data);

    return {
      content: parsed.content,
      filePath: parsed.filePath,
    };
  } catch {
    return null;
  }
}

export async function clearAutoSaveFile(): Promise<void> {
  try {
    const appData = await appDataDir();
    const autoSavePath = await join(appData, AUTOSAVE_FILE);
    if (await exists(autoSavePath)) {
      await remove(autoSavePath);
    }
  } catch {
    // Silently fail
  }
}
