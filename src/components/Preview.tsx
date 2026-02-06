import { useMemo, forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { markdownComponents } from "../lib/markdownComponents";
import { useDebounce } from "../hooks/useDebounce";

interface PreviewProps {
  content: string;
}

export const Preview = forwardRef<HTMLDivElement, PreviewProps>(
  function Preview({ content }, ref) {
    const debouncedContent = useDebounce(content, 200);
    const plugins = useMemo(() => [remarkGfm], []);
    const rehypePlugins = useMemo(() => [rehypeHighlight], []);

    return (
      <div ref={ref} className="preview-content p-6 bg-white dark:bg-gray-900">
        <article className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={plugins}
            rehypePlugins={rehypePlugins}
            components={markdownComponents}
          >
            {debouncedContent}
          </ReactMarkdown>
        </article>
      </div>
    );
  },
);
