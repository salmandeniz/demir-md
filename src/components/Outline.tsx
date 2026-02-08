import { useEffect, useMemo, useState } from "react";
import { parseHeadings } from "../lib/parseHeadings";

interface OutlineProps {
  content: string;
  onNavigate: (lineNumber: number) => void;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

const INDENT: Record<number, string> = {
  1: "pl-2",
  2: "pl-4",
  3: "pl-6",
  4: "pl-8",
  5: "pl-10",
  6: "pl-12",
};

export function Outline({ content, onNavigate, previewRef }: OutlineProps) {
  const headings = useMemo(() => parseHeadings(content), [content]);
  const [activeHeading, setActiveHeading] = useState<number | null>(null);

  useEffect(() => {
    if (!previewRef?.current || headings.length === 0) return;

    const preview = previewRef.current;
    const headingElements = preview.querySelectorAll("h1,h2,h3,h4,h5,h6");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(headingElements).indexOf(entry.target as Element);
            if (index !== -1 && headings[index]) {
              setActiveHeading(headings[index].lineNumber);
            }
          }
        });
      },
      {
        root: preview,
        threshold: 0,
        rootMargin: "-10% 0px -80% 0px",
      }
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [previewRef, headings]);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      {headings.length === 0 ? (
        <div className="px-3 py-4 text-sm text-gray-400 dark:text-gray-500">
          No headings
        </div>
      ) : (
        <nav className="py-1">
          {headings.map((heading, index) => {
            const isActive = activeHeading === heading.lineNumber;
            return (
              <button
                key={`${heading.lineNumber}-${index}`}
                onClick={() => onNavigate(heading.lineNumber)}
                className={`w-full text-left py-1.5 pr-3 text-sm truncate hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 border-l-2 ${INDENT[heading.level]} ${
                  isActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-transparent"
                } ${
                  heading.level === 1 && !isActive
                    ? "font-semibold text-gray-800 dark:text-gray-200"
                    : heading.level === 2 && !isActive
                      ? "font-medium text-gray-700 dark:text-gray-300"
                      : !isActive
                        ? "text-gray-600 dark:text-gray-400"
                        : ""
                }`}
                title={`Line ${heading.lineNumber}`}
              >
                {heading.text}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
