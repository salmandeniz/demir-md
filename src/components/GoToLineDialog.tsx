import { useEffect, useRef, useState } from "react";

interface GoToLineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLine: (lineNumber: number) => void;
  maxLine: number;
}

export function GoToLineDialog({ isOpen, onClose, onGoToLine, maxLine }: GoToLineDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lineNumber = parseInt(inputValue, 10);
    if (!isNaN(lineNumber) && lineNumber >= 1 && lineNumber <= maxLine) {
      onGoToLine(lineNumber);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-72">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Go to Line
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="number"
              min={1}
              max={maxLine}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`1-${maxLine}`}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputValue || parseInt(inputValue, 10) < 1 || parseInt(inputValue, 10) > maxLine}
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Go
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            Press Enter to jump, Esc to cancel
          </p>
        </form>
      </div>
    </div>
  );
}
