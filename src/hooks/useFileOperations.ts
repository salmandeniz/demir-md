import { useCallback } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
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
    const selected = await open({
      multiple: false,
      filters: MD_FILTERS,
    });
    if (!selected) return;
    const path = typeof selected === "string" ? selected : selected;
    const text = await readTextFile(path);
    loadDocument(text, path);
    addRecentFile(path);
  }, [loadDocument, addRecentFile]);

  const saveFile = useCallback(async () => {
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
  }, [content, filePath, markClean, addRecentFile]);

  const saveFileAs = useCallback(async () => {
    const path = await save({ filters: MD_FILTERS });
    if (!path) return;
    await writeTextFile(path, content);
    markClean(path);
    addRecentFile(path);
  }, [content, markClean, addRecentFile]);

  const openRecentFile = useCallback(async (path: string) => {
    const text = await readTextFile(path);
    loadDocument(text, path);
    addRecentFile(path);
  }, [loadDocument, addRecentFile]);

  return { newFile, openFile, saveFile, saveFileAs, openRecentFile };
}
