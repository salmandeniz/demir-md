import { useState, useEffect, useCallback, type RefObject } from "react";

function findTextRanges(root: HTMLElement, query: string): Range[] {
  if (!query) return [];
  const ranges: Range[] = [];
  const lowerQuery = query.toLowerCase();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    const text = node.textContent?.toLowerCase() ?? "";
    let start = 0;
    while (true) {
      const index = text.indexOf(lowerQuery, start);
      if (index === -1) break;
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + query.length);
      ranges.push(range);
      start = index + 1;
    }
  }
  return ranges;
}

export function usePreviewSearch(
  previewRef: RefObject<HTMLDivElement | null>,
  query: string,
  isOpen: boolean,
) {
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [ranges, setRanges] = useState<Range[]>([]);

  useEffect(() => {
    if (!isOpen || !query || !previewRef.current) {
      CSS.highlights.delete("preview-search");
      CSS.highlights.delete("preview-search-current");
      setRanges([]);
      setTotalMatches(0);
      setCurrentMatch(0);
      return;
    }

    const found = findTextRanges(previewRef.current, query);
    setRanges(found);
    setTotalMatches(found.length);
    setCurrentMatch(found.length > 0 ? 1 : 0);

    if (found.length > 0) {
      CSS.highlights.set("preview-search", new Highlight(...found));
      CSS.highlights.set("preview-search-current", new Highlight(found[0]));
      found[0].startContainer.parentElement?.scrollIntoView({ block: "center" });
    } else {
      CSS.highlights.delete("preview-search");
      CSS.highlights.delete("preview-search-current");
    }
  }, [query, isOpen, previewRef]);

  useEffect(() => {
    if (!isOpen) {
      CSS.highlights.delete("preview-search");
      CSS.highlights.delete("preview-search-current");
    }
  }, [isOpen]);

  const goToNext = useCallback(() => {
    if (ranges.length === 0) return;
    const next = currentMatch >= ranges.length ? 1 : currentMatch + 1;
    setCurrentMatch(next);
    CSS.highlights.set("preview-search-current", new Highlight(ranges[next - 1]));
    ranges[next - 1].startContainer.parentElement?.scrollIntoView({ block: "center" });
  }, [ranges, currentMatch]);

  const goToPrev = useCallback(() => {
    if (ranges.length === 0) return;
    const prev = currentMatch <= 1 ? ranges.length : currentMatch - 1;
    setCurrentMatch(prev);
    CSS.highlights.set("preview-search-current", new Highlight(ranges[prev - 1]));
    ranges[prev - 1].startContainer.parentElement?.scrollIntoView({ block: "center" });
  }, [ranges, currentMatch]);

  return { currentMatch, totalMatches, goToNext, goToPrev };
}
