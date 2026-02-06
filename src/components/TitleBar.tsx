import { ThemeToggle } from "./ThemeToggle";
import { RecentFilesMenu } from "./RecentFilesMenu";
import { ViewModeToggle } from "./ViewModeToggle";
import type { Theme, ViewMode, FileOperations, RecentFile } from "../types";

interface TitleBarProps {
  fileName: string;
  isDirty: boolean;
  theme: Theme;
  onToggleTheme: () => void;
  fileOps: FileOperations;
  recentFiles: RecentFile[];
  onOpenRecent: (path: string) => void;
  onClearRecent: () => void;
  showOutline: boolean;
  onToggleOutline: () => void;
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
}

export function TitleBar({
  fileName,
  isDirty,
  theme,
  onToggleTheme,
  fileOps,
  recentFiles,
  onOpenRecent,
  onClearRecent,
  showOutline,
  onToggleOutline,
  viewMode,
  onSetViewMode,
}: TitleBarProps) {
  const displayName = isDirty ? `${fileName} *` : fileName;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 select-none">
      <div className="flex items-center gap-2">
        <button
          onClick={fileOps.newFile}
          className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title="New File (Cmd+N)"
        >
          New
        </button>
        <button
          onClick={fileOps.openFile}
          className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title="Open File (Cmd+O)"
        >
          Open
        </button>
        <RecentFilesMenu
          recentFiles={recentFiles}
          onOpenRecent={onOpenRecent}
          onClearRecent={onClearRecent}
        />
        <button
          onClick={fileOps.saveFile}
          className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title="Save (Cmd+S)"
        >
          Save
        </button>
        <button
          onClick={fileOps.saveFileAs}
          className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title="Save As (Cmd+Shift+S)"
        >
          Save As
        </button>
      </div>

      <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate max-w-md">
        {displayName}
      </span>

      <div className="flex items-center gap-2">
        <ViewModeToggle viewMode={viewMode} onSetViewMode={onSetViewMode} />
        <button
          onClick={onToggleOutline}
          className={`p-1.5 rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            showOutline
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          title="Toggle Outline"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="3.5" cy="4.5" r="1" fill="currentColor" stroke="none" />
            <line x1="7" y1="4.5" x2="15" y2="4.5" />
            <circle cx="3.5" cy="9" r="1" fill="currentColor" stroke="none" />
            <line x1="7" y1="9" x2="15" y2="9" />
            <circle cx="3.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
            <line x1="7" y1="13.5" x2="15" y2="13.5" />
          </svg>
        </button>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </div>
  );
}
