import { EditorView } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import type { Extension } from "@codemirror/state";

const lightTheme = EditorView.theme({
  "&": {
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },
  ".cm-gutters": {
    backgroundColor: "#f9fafb",
    color: "#9ca3af",
    borderRight: "1px solid #e5e7eb",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#f3f4f6",
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#1f2937",
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "#bfdbfe",
  },
  ".cm-activeLine": {
    backgroundColor: "#f9fafb",
  },
});

export function getEditorTheme(theme: "light" | "dark"): Extension {
  return theme === "dark" ? oneDark : lightTheme;
}
