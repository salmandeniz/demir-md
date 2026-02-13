import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { Allotment } from "allotment";
import { EditorView } from "@codemirror/view";
import { undo as cmUndo, redo as cmRedo } from "@codemirror/commands";
import { EditorSelection } from "@codemirror/state";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { Editor } from "./Editor";
import { Preview } from "./Preview";
import { Outline } from "./Outline";
import { PreviewSearchBar } from "./PreviewSearchBar";
import { parseHeadings } from "../lib/parseHeadings";
import { usePreviewSearch } from "../hooks/usePreviewSearch";
import type { Theme, ViewMode } from "../types";

export interface LayoutRef {
  goToLine: (lineNumber: number) => void;
  undo: () => void;
  redo: () => void;
}

interface LayoutProps {
  content: string;
  onChange: (value: string) => void;
  theme: Theme;
  showOutline: boolean;
  viewMode: ViewMode;
  filePath: string | null;
}

export const Layout = forwardRef<LayoutRef, LayoutProps>(
  function Layout({ content, onChange, theme, showOutline, viewMode, filePath }, ref) {
    const editorRef = useRef<ReactCodeMirrorRef>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const [previewSearchOpen, setPreviewSearchOpen] = useState(false);
    const [previewSearchQuery, setPreviewSearchQuery] = useState("");

    const { currentMatch, totalMatches, goToNext, goToPrev } = usePreviewSearch(
      previewRef,
      previewSearchQuery,
      previewSearchOpen,
    );

    const closePreviewSearch = useCallback(() => {
      setPreviewSearchOpen(false);
      setPreviewSearchQuery("");
    }, []);

    const goToLine = useCallback((lineNumber: number) => {
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
          elements[headingIndex]?.scrollIntoView({ 
            behavior: "smooth",
            block: "start" 
          });
        }
      }
    }, [content]);

    const undo = useCallback(() => {
      const view = editorRef.current?.view;
      if (view) {
        cmUndo(view);
        view.focus();
      }
    }, []);

    const redo = useCallback(() => {
      const view = editorRef.current?.view;
      if (view) {
        cmRedo(view);
        view.focus();
      }
    }, []);

    useImperativeHandle(ref, () => ({
      goToLine,
      undo,
      redo,
    }), [goToLine, undo, redo]);

    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "f" && viewMode === "preview") {
          e.preventDefault();
          setPreviewSearchOpen(true);
        }
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, [viewMode]);

    useEffect(() => {
      if (viewMode !== "preview" && previewSearchOpen) {
        closePreviewSearch();
      }
    }, [viewMode, previewSearchOpen, closePreviewSearch]);

    const handleNavigate = useCallback((lineNumber: number) => {
      goToLine(lineNumber);
    }, [goToLine]);

    const editorVisible = viewMode !== "preview";
    const previewVisible = viewMode !== "editor";

    return (
      <div className="flex-1 overflow-hidden">
        <Allotment>
          <Allotment.Pane minSize={200} visible={editorVisible}>
            <Editor ref={editorRef} content={content} onChange={onChange} theme={theme} filePath={filePath} />
          </Allotment.Pane>
          <Allotment.Pane minSize={200} visible={previewVisible}>
            <div className="h-full flex flex-col">
              {previewSearchOpen && (
                <PreviewSearchBar
                  query={previewSearchQuery}
                  onChange={setPreviewSearchQuery}
                  onClose={closePreviewSearch}
                  currentMatch={currentMatch}
                  totalMatches={totalMatches}
                  onPrev={goToPrev}
                  onNext={goToNext}
                />
              )}
              <div className="flex-1 overflow-hidden">
                <Preview ref={previewRef} content={content} />
              </div>
            </div>
          </Allotment.Pane>
          <Allotment.Pane minSize={120} preferredSize={200} visible={showOutline}>
            <Outline content={content} onNavigate={handleNavigate} previewRef={previewRef} />
          </Allotment.Pane>
        </Allotment>
      </div>
    );
  }
);
