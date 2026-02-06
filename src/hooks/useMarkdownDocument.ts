import { useState, useCallback } from "react";

export function useMarkdownDocument() {
  const [content, setContentState] = useState("");
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const setContent = useCallback(
    (newContent: string) => {
      setContentState(newContent);
      setIsDirty(true);
    },
    [],
  );

  const loadDocument = useCallback((text: string, path: string | null) => {
    setContentState(text);
    setFilePath(path);
    setIsDirty(false);
  }, []);

  const markClean = useCallback((path?: string) => {
    setIsDirty(false);
    if (path !== undefined) {
      setFilePath(path);
    }
  }, []);

  const fileName = filePath ? filePath.split("/").pop() ?? "Untitled" : "Untitled";

  return {
    content,
    filePath,
    isDirty,
    fileName,
    setContent,
    loadDocument,
    markClean,
  };
}
