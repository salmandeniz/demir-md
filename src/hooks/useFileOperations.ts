import { useCallback } from "react";
import { open, save, message } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

interface UseFileOperationsArgs {
  content: string;
  filePath: string | null;
  loadDocument: (text: string, path: string | null) => void;
  markClean: (path?: string) => void;
  addRecentFile: (path: string) => void;
}

const MD_FILTERS = [
  { name: "Markdown", extensions: ["md", "markdown", "mdx", "txt"] },
];

export function useFileOperations({
  content,
  filePath,
  loadDocument,
  markClean,
  addRecentFile,
}: UseFileOperationsArgs) {
  const newFile = useCallback(() => {
    loadDocument("", null);
  }, [loadDocument]);

  const openFile = useCallback(async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: MD_FILTERS,
      });
      if (!selected) return;
      const path = typeof selected === "string" ? selected : selected;
      const text = await readTextFile(path);
      loadDocument(text, path);
      addRecentFile(path);
    } catch (err) {
      await message(`Failed to open file: ${err}`, { title: "Error", kind: "error" });
    }
  }, [loadDocument, addRecentFile]);

  const saveFile = useCallback(async () => {
    try {
      if (filePath) {
        await writeTextFile(filePath, content);
        markClean();
        addRecentFile(filePath);
      } else {
        const path = await save({ filters: MD_FILTERS });
        if (!path) return;
        await writeTextFile(path, content);
        markClean(path);
        addRecentFile(path);
      }
    } catch (err) {
      await message(`Failed to save file: ${err}`, { title: "Error", kind: "error" });
    }
  }, [content, filePath, markClean, addRecentFile]);

  const saveFileAs = useCallback(async () => {
    try {
      const path = await save({ filters: MD_FILTERS });
      if (!path) return;
      await writeTextFile(path, content);
      markClean(path);
      addRecentFile(path);
    } catch (err) {
      await message(`Failed to save file: ${err}`, { title: "Error", kind: "error" });
    }
  }, [content, markClean, addRecentFile]);

  const openRecentFile = useCallback(async (path: string) => {
    try {
      const text = await readTextFile(path);
      loadDocument(text, path);
      addRecentFile(path);
    } catch (err) {
      await message(`Failed to open file: ${err}`, { title: "Error", kind: "error" });
    }
  }, [loadDocument, addRecentFile]);

  return { newFile, openFile, saveFile, saveFileAs, openRecentFile };
}
