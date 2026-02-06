import { Allotment } from "allotment";
import { Editor } from "./Editor";
import { Preview } from "./Preview";
import type { Theme } from "../types";

interface LayoutProps {
  content: string;
  onChange: (value: string) => void;
  theme: Theme;
}

export function Layout({ content, onChange, theme }: LayoutProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <Allotment defaultSizes={[50, 50]}>
        <Allotment.Pane minSize={200}>
          <Editor content={content} onChange={onChange} theme={theme} />
        </Allotment.Pane>
        <Allotment.Pane minSize={200}>
          <Preview content={content} />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
