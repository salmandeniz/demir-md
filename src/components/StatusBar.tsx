interface StatusBarProps {
  content: string;
  filePath: string | null;
  isDirty: boolean;
}

export function StatusBar({ content, filePath, isDirty }: StatusBarProps) {
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const lineCount = content.split("\n").length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex items-center justify-between px-4 py-1 text-xs border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 select-none">
      <div className="flex items-center gap-4">
        <span>{wordCount} words</span>
        <span>{charCount} chars</span>
        <span>{lineCount} lines</span>
        <span>{readingTimeMinutes} min read</span>
      </div>
      <div className="flex items-center gap-4">
        {isDirty && <span className="text-amber-500">Modified</span>}
        <span className="truncate max-w-xs" title={filePath ?? undefined}>
          {filePath ?? "No file"}
        </span>
      </div>
    </div>
  );
}
