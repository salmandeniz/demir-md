import { useMemo } from "react";
import { parseHeadings } from "../lib/parseHeadings";

interface OutlineProps {
  content: string;
  onNavigate: (lineNumber: number) => void;
}

const INDENT: Record<number, string> = {
  1: "pl-2",
  2: "pl-4",
  3: "pl-6",
  4: "pl-8",
  5: "pl-10",
  6: "pl-12",
};

export function Outline({ content, onNavigate }: OutlineProps) {
  const headings = useMemo(() => parseHeadings(content), [content]);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      {headings.length === 0 ? (
        <div className="px-3 py-4 text-sm text-gray-400 dark:text-gray-500">
          No headings
        </div>
      ) : (
        <nav className="py-1">
          {headings.map((heading, index) => (
            <button
              key={`${heading.lineNumber}-${index}`}
              onClick={() => onNavigate(heading.lineNumber)}
              className={`w-full text-left py-1.5 pr-3 text-sm truncate hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 ${INDENT[heading.level]} ${
                heading.level === 1
                  ? "font-semibold text-gray-800 dark:text-gray-200"
                  : heading.level === 2
                    ? "font-medium text-gray-700 dark:text-gray-300"
                    : "text-gray-600 dark:text-gray-400"
              }`}
              title={`Line ${heading.lineNumber}`}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
