import type { FileOperations, RecentFile } from "../types";

interface WelcomeScreenProps {
  fileOps: FileOperations;
  recentFiles: RecentFile[];
  onOpenRecent: (path: string) => void;
}

export function WelcomeScreen({ fileOps, recentFiles, onOpenRecent }: WelcomeScreenProps) {
  return (
    <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center max-w-md px-8">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            DemirMD
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            A lightweight markdown editor
          </p>
        </div>

        <div className="space-y-2 mb-8">
          <button
            onClick={fileOps.newFile}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 text-left"
          >
            <span className="flex items-center gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-500 dark:text-gray-400"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">New File</span>
            </span>
            <kbd className="px-2 py-0.5 text-xs rounded bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
              ⌘N
            </kbd>
          </button>

          <button
            onClick={fileOps.openFile}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 text-left"
          >
            <span className="flex items-center gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-500 dark:text-gray-400"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17,8 12,3 7,8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Open File</span>
            </span>
            <kbd className="px-2 py-0.5 text-xs rounded bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
              ⌘O
            </kbd>
          </button>
        </div>

        {recentFiles.length > 0 && (
          <div className="text-left">
            <h2 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-1">
              Recently Opened
            </h2>
            <div className="space-y-1">
              {recentFiles.slice(0, 5).map((file) => (
                <button
                  key={file.path}
                  onClick={() => onOpenRecent(file.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-150 truncate"
                  title={file.path}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="shrink-0"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
