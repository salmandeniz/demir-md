import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { getEditorExtensions } from "../lib/editorExtensions";
import { getEditorTheme } from "../lib/editorThemes";
import type { Theme } from "../types";

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  theme: Theme;
}

export function Editor({ content, onChange, theme }: EditorProps) {
  const extensions = useMemo(() => getEditorExtensions(), []);
  const editorTheme = useMemo(() => getEditorTheme(theme), [theme]);

  return (
    <div className="h-full overflow-hidden">
      <CodeMirror
        value={content}
        onChange={onChange}
        extensions={[...extensions, editorTheme]}
        height="100%"
        style={{ height: "100%" }}
        basicSetup={false}
      />
    </div>
  );
}
