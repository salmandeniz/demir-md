import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { ask } from "@tauri-apps/plugin-dialog";
import { useTheme } from "./hooks/useTheme";
import { useMarkdownDocument } from "./hooks/useMarkdownDocument";
import { useFileOperations } from "./hooks/useFileOperations";
import { useRecentFiles } from "./hooks/useRecentFiles";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useViewMode } from "./hooks/useViewMode";
import { useAutoSave, checkForAutoSave, clearAutoSaveFile } from "./hooks/useAutoSave";
import { useZoom } from "./hooks/useZoom";
import { TitleBar } from "./components/TitleBar";
import { Layout, type LayoutRef } from "./components/Layout";
import { StatusBar } from "./components/StatusBar";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { GoToLineDialog } from "./components/GoToLineDialog";
import "./index.css";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { content, filePath, isDirty, fileName, setContent, loadDocument, markClean } =
    useMarkdownDocument();
  const { recentFiles, addRecentFile, clearRecentFiles } = useRecentFiles();
  const [showOutline, setShowOutline] = useState(() => localStorage.getItem("showOutline") === "true");
  const toggleOutline = useCallback(() => {
    setShowOutline((prev) => {
      localStorage.setItem("showOutline", String(!prev));
      return !prev;
    });
  }, []);

  const { viewMode, setViewMode } = useViewMode();
  const [goToLineOpen, setGoToLineOpen] = useState(false);
  const layoutRef = useRef<LayoutRef>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hasRecovered, setHasRecovered] = useState(false);
  const [isRecoveryChecked, setIsRecoveryChecked] = useState(false);

  const { clearAutoSave } = useAutoSave({ content, filePath, isDirty });
  const { zoom } = useZoom();

  const fileOps = useFileOperations({ content, filePath, loadDocument, markClean, addRecentFile });

  const stableFileOps = useMemo(
    () => fileOps,
    [fileOps.newFile, fileOps.openFile, fileOps.saveFile, fileOps.saveFileAs, fileOps.openRecentFile],
  );

  useKeyboardShortcuts(stableFileOps, setViewMode, setGoToLineOpen, () => layoutRef.current?.undo(), () => layoutRef.current?.redo());

  const handleGoToLine = useCallback((lineNumber: number) => {
    layoutRef.current?.goToLine(lineNumber);
  }, []);

  useEffect(() => {
    const title = isDirty ? `${fileName} * - DemirMD` : `${fileName} - DemirMD`;
    getCurrentWindow().setTitle(title);
  }, [fileName, isDirty]);

  const isDirtyRef = useRef(isDirty);
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    const unlisten = getCurrentWindow().onCloseRequested(async (event) => {
      event.preventDefault();
      if (isDirtyRef.current) {
        const confirmed = await ask("You have unsaved changes. Close anyway?", {
          title: "Unsaved Changes",
          kind: "warning",
        });
        if (!confirmed) return;
      }
      await invoke("quit_app");
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  useEffect(() => {
    const unlisten = listen<string>("menu-event", async (event) => {
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
        case "quit":
          if (isDirtyRef.current) {
            const confirmed = await ask("You have unsaved changes. Quit anyway?", {
              title: "Unsaved Changes",
              kind: "warning",
            });
            if (!confirmed) return;
          }
          await invoke("quit_app");
          break;
      }
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, [fileOps]);

  useEffect(() => {
    const window = getCurrentWindow();

    const unlistenDragDrop = window.onDragDropEvent((event) => {
      if (event.payload.type === "over") {
        setIsDragOver(true);
      } else if (event.payload.type === "drop") {
        setIsDragOver(false);
        const paths = event.payload.paths;
        const mdFile = paths.find((p) => p.toLowerCase().endsWith(".md"));
        if (mdFile) {
          fileOps.openRecentFile(mdFile);
        }
      } else if (event.payload.type === "leave") {
        setIsDragOver(false);
      }
    });

    return () => {
      unlistenDragDrop.then((fn) => fn());
    };
  }, [fileOps]);

  useEffect(() => {
    const unlisten = listen<string>("open-file", async (event) => {
      const text = await readTextFile(event.payload);
      loadDocument(text, event.payload);
      addRecentFile(event.payload);
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, [loadDocument, addRecentFile]);

  useEffect(() => {
    if (isRecoveryChecked) return;
    setIsRecoveryChecked(true);

    (async () => {
      const openedPath = await invoke<string | null>("get_opened_file");
      if (openedPath) {
        const text = await readTextFile(openedPath);
        loadDocument(text, openedPath);
        addRecentFile(openedPath);
        return;
      }

      const autoSave = await checkForAutoSave();
      if (autoSave && autoSave.content) {
        loadDocument(autoSave.content, autoSave.filePath);
        setHasRecovered(true);
      }
    })();
  }, []);

  const handleSaveFile = useCallback(async () => {
    await fileOps.saveFile();
    await clearAutoSave();
  }, [fileOps, clearAutoSave]);

  const handleSaveFileAs = useCallback(async () => {
    await fileOps.saveFileAs();
    await clearAutoSave();
  }, [fileOps, clearAutoSave]);

  const handleNewFile = useCallback(async () => {
    await clearAutoSaveFile();
    fileOps.newFile();
  }, [fileOps]);

  const fileOpsWithAutoSave = useMemo(
    () => ({
      ...stableFileOps,
      saveFile: handleSaveFile,
      saveFileAs: handleSaveFileAs,
      newFile: handleNewFile,
    }),
    [stableFileOps, handleSaveFile, handleSaveFileAs, handleNewFile],
  );

  const showWelcome = filePath === null && content === "" && !hasRecovered;
  const lineCount = content.split("\n").length;

  return (
    <div className={`flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${isDragOver ? "ring-4 ring-blue-500 ring-inset" : ""}`}>
      <TitleBar
        fileName={fileName}
        isDirty={isDirty}
        theme={theme}
        onToggleTheme={toggleTheme}
        fileOps={fileOpsWithAutoSave}
        recentFiles={recentFiles}
        onOpenRecent={fileOps.openRecentFile}
        onClearRecent={clearRecentFiles}
        showOutline={showOutline}
        onToggleOutline={toggleOutline}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
      />
      {showWelcome ? (
        <WelcomeScreen
          fileOps={fileOpsWithAutoSave}
          recentFiles={recentFiles}
          onOpenRecent={fileOps.openRecentFile}
        />
      ) : (
        <Layout ref={layoutRef} content={content} onChange={setContent} theme={theme} showOutline={showOutline} viewMode={viewMode} filePath={filePath} />
      )}
      <StatusBar content={content} filePath={filePath} isDirty={isDirty} zoom={zoom} />
      <GoToLineDialog
        isOpen={goToLineOpen}
        onClose={() => setGoToLineOpen(false)}
        onGoToLine={handleGoToLine}
        maxLine={lineCount}
      />
    </div>
  );
}

export default App;
