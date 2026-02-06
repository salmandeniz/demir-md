import type { ViewMode } from "../types";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
}

const modes: { value: ViewMode; label: string; shortcut: string }[] = [
  { value: "editor", label: "Editor", shortcut: "Cmd+1" },
  { value: "split", label: "Split", shortcut: "Cmd+2" },
  { value: "preview", label: "Preview", shortcut: "Cmd+3" },
];

export function ViewModeToggle({ viewMode, onSetViewMode }: ViewModeToggleProps) {
  return (
    <div className="flex items-center rounded-md border border-gray-200 dark:border-gray-600 overflow-hidden">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onSetViewMode(mode.value)}
          className={`px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            viewMode === mode.value
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          title={`${mode.value === "split" ? "Split View" : `${mode.label} Only`} (${mode.shortcut})`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
