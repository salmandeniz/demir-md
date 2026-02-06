import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { bracketMatching } from "@codemirror/language";
import { history, defaultKeymap, historyKeymap } from "@codemirror/commands";
import { search, searchKeymap } from "@codemirror/search";
import { keymap } from "@codemirror/view";
import type { Extension } from "@codemirror/state";

export function getEditorExtensions(): Extension[] {
  return [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    lineNumbers(),
    highlightActiveLine(),
    bracketMatching(),
    history(),
    EditorView.lineWrapping,
    search(),
    keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
  ];
}
