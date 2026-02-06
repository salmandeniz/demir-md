export interface MarkdownDocument {
  content: string;
  filePath: string | null;
  isDirty: boolean;
}

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface RecentFile {
  path: string;
  name: string;
  openedAt: number;
}

export interface FileOperations {
  newFile: () => void;
  openFile: () => Promise<void>;
  saveFile: () => Promise<void>;
  saveFileAs: () => Promise<void>;
  openRecentFile: (path: string) => Promise<void>;
}
