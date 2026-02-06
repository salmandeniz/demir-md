import { useMemo, forwardRef } from "react";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { getEditorExtensions, imagePasteHandler } from "../lib/editorExtensions";
import { getEditorTheme } from "../lib/editorThemes";
import type { Theme } from "../types";

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  theme: Theme;
  filePath: string | null;
}

export const Editor = forwardRef<ReactCodeMirrorRef, EditorProps>(
  function Editor({ content, onChange, theme, filePath }, ref) {
    const extensions = useMemo(() => getEditorExtensions(), []);
    const pasteHandler = useMemo(() => imagePasteHandler(filePath), [filePath]);
    const editorTheme = useMemo(() => getEditorTheme(theme), [theme]);

    return (
      <div className="h-full overflow-hidden">
        <CodeMirror
          ref={ref}
          value={content}
          onChange={onChange}
          extensions={[...extensions, pasteHandler, editorTheme]}
          height="100%"
          style={{ height: "100%" }}
          basicSetup={false}
        />
      </div>
    );
  },
);
