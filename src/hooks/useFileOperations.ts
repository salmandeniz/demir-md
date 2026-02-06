import { useCallback } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

interface UseFileOperationsArgs {
  content: string;
  filePath: string | null;
  loadDocument: (text: string, path: string | null) => void;
  markClean: (path?: string) => void;
}

const MD_FILTERS = [
  { name: "Markdown", extensions: ["md", "markdown", "mdx", "txt"] },
];

export function useFileOperations({
  content,
  filePath,
  loadDocument,
  markClean,
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
  }, [loadDocument]);

  const saveFile = useCallback(async () => {
    if (filePath) {
      await writeTextFile(filePath, content);
      markClean();
    } else {
      const path = await save({ filters: MD_FILTERS });
      if (!path) return;
      await writeTextFile(path, content);
      markClean(path);
    }
  }, [content, filePath, markClean]);

  const saveFileAs = useCallback(async () => {
    const path = await save({ filters: MD_FILTERS });
    if (!path) return;
    await writeTextFile(path, content);
    markClean(path);
  }, [content, markClean]);

  return { newFile, openFile, saveFile, saveFileAs };
}
