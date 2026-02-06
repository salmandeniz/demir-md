import { useCallback, useRef } from "react";
import { Allotment } from "allotment";
import { EditorView } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { Editor } from "./Editor";
import { Preview } from "./Preview";
import { Outline } from "./Outline";
import { parseHeadings } from "../lib/parseHeadings";
import type { Theme } from "../types";

interface LayoutProps {
  content: string;
  onChange: (value: string) => void;
  theme: Theme;
  showOutline: boolean;
}

export function Layout({ content, onChange, theme, showOutline }: LayoutProps) {
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleNavigate = useCallback((lineNumber: number) => {
    const view = editorRef.current?.view;
    if (view) {
      const line = view.state.doc.line(lineNumber);
      view.dispatch({
        selection: EditorSelection.single(line.from),
        effects: EditorView.scrollIntoView(line.from, { y: "start" }),
      });
      view.focus();
    }

    if (previewRef.current) {
      const headings = parseHeadings(content);
      const headingIndex = headings.findIndex((h) => h.lineNumber === lineNumber);
      if (headingIndex >= 0) {
        const elements = previewRef.current.querySelectorAll("h1,h2,h3,h4,h5,h6");
        elements[headingIndex]?.scrollIntoView({ block: "start" });
      }
    }
  }, [content]);

  return (
    <div className="flex-1 overflow-hidden">
      <Allotment>
        <Allotment.Pane minSize={200}>
          <Editor ref={editorRef} content={content} onChange={onChange} theme={theme} />
        </Allotment.Pane>
        <Allotment.Pane minSize={200}>
          <Preview ref={previewRef} content={content} />
        </Allotment.Pane>
        <Allotment.Pane minSize={120} preferredSize={200} visible={showOutline}>
          <Outline content={content} onNavigate={handleNavigate} />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
