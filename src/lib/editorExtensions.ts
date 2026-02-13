import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { bracketMatching } from "@codemirror/language";
import { history, defaultKeymap, historyKeymap } from "@codemirror/commands";
import { search, searchKeymap } from "@codemirror/search";
import { keymap } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import { writeFile, mkdir } from "@tauri-apps/plugin-fs";
import { message } from "@tauri-apps/plugin-dialog";

const MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
};

export function imagePasteHandler(filePath: string | null): Extension {
  return EditorView.domEventHandlers({
    paste(event, view) {
      const files = event.clipboardData?.files;
      if (!files || files.length === 0) return false;

      const imageFile = Array.from(files).find((f) => f.type in MIME_TO_EXT);
      if (!imageFile) return false;

      event.preventDefault();

      if (!filePath) {
        message("Save the file first to paste images.", { title: "Image Paste", kind: "info" });
        return true;
      }

      const dirSep = filePath.includes("\\") ? "\\" : "/";
      const lastSep = filePath.lastIndexOf(dirSep);
      const dir = filePath.substring(0, lastSep);
      const baseName = filePath.substring(lastSep + 1).replace(/\.[^.]+$/, "");
      const assetsDir = `${dir}${dirSep}${baseName}_assets`;
      const ext = MIME_TO_EXT[imageFile.type];
      const fileName = `image-${Date.now()}.${ext}`;
      const imagePath = `${assetsDir}${dirSep}${fileName}`;
      const relativePath = `./${baseName}_assets/${fileName}`;

      imageFile.arrayBuffer().then(async (buffer) => {
        try {
          await mkdir(assetsDir, { recursive: true });
          await writeFile(imagePath, new Uint8Array(buffer));
          const insert = `![](${relativePath})`;
          view.dispatch(view.state.replaceSelection(insert));
        } catch (err) {
          message(`Failed to save image: ${err}`, { title: "Image Paste Error", kind: "error" });
        }
      });

      return true;
    },
  });
}

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
