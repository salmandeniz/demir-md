import { useEffect, useMemo } from "react";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useTheme } from "./hooks/useTheme";
import { useMarkdownDocument } from "./hooks/useMarkdownDocument";
import { useFileOperations } from "./hooks/useFileOperations";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { TitleBar } from "./components/TitleBar";
import { Layout } from "./components/Layout";
import { StatusBar } from "./components/StatusBar";
import "./index.css";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { content, filePath, isDirty, fileName, setContent, loadDocument, markClean } =
    useMarkdownDocument();

  const fileOps = useFileOperations({ content, filePath, loadDocument, markClean });

  const stableFileOps = useMemo(
    () => fileOps,
    [fileOps.newFile, fileOps.openFile, fileOps.saveFile, fileOps.saveFileAs],
  );

  useKeyboardShortcuts(stableFileOps);

  useEffect(() => {
    const title = isDirty ? `${fileName} * - Markdown Reader` : `${fileName} - Markdown Reader`;
    getCurrentWindow().setTitle(title);
  }, [fileName, isDirty]);

  useEffect(() => {
    const unlisten = listen<string>("menu-event", (event) => {
      switch (event.payload) {
        case "new":
          fileOps.newFile();
          break;
        case "open":
          fileOps.openFile();
          break;
        case "save":
          fileOps.saveFile();
          break;
        case "save_as":
          fileOps.saveFileAs();
          break;
      }
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, [fileOps]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <TitleBar
        fileName={fileName}
        isDirty={isDirty}
        theme={theme}
        onToggleTheme={toggleTheme}
        fileOps={stableFileOps}
      />
      <Layout content={content} onChange={setContent} theme={theme} />
      <StatusBar content={content} filePath={filePath} isDirty={isDirty} />
    </div>
  );
}

export default App;
