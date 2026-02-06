import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { markdownComponents } from "../lib/markdownComponents";

interface PreviewProps {
  content: string;
}

export function Preview({ content }: PreviewProps) {
  const plugins = useMemo(() => [remarkGfm], []);
  const rehypePlugins = useMemo(() => [rehypeHighlight], []);

  return (
    <div className="preview-content p-6 bg-white dark:bg-gray-900">
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={plugins}
          rehypePlugins={rehypePlugins}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
