import { useState, useRef, useEffect } from "react";
import type { RecentFile } from "../types";

interface RecentFilesMenuProps {
  recentFiles: RecentFile[];
  onOpenRecent: (path: string) => void;
  onClearRecent: () => void;
}

export function RecentFilesMenu({
  recentFiles,
  onOpenRecent,
  onClearRecent,
}: RecentFilesMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        Recent
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1">
          {recentFiles.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
              No recent files
            </div>
          ) : (
            <>
              {recentFiles.map((file) => (
                <button
                  key={file.path}
                  onClick={() => {
                    onOpenRecent(file.path);
                    setIsOpen(false);
                  }}
                  title={file.path}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 truncate transition-colors duration-150"
                >
                  {file.name}
                </button>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
              <button
                onClick={() => {
                  onClearRecent();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                Clear Recent
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
