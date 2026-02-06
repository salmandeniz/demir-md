import { ThemeToggle } from "./ThemeToggle";
import type { Theme, FileOperations } from "../types";

interface TitleBarProps {
  fileName: string;
  isDirty: boolean;
  theme: Theme;
  onToggleTheme: () => void;
  fileOps: FileOperations;
}

export function TitleBar({
  fileName,
  isDirty,
  theme,
  onToggleTheme,
  fileOps,
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

      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>
  );
}
