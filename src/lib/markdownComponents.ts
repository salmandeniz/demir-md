import type { Components } from "react-markdown";
import { createElement } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";

export const markdownComponents: Partial<Components> = {
  a: ({ children, href, ...props }) => {
    const handleClick = (e: React.MouseEvent) => {
      if (href?.startsWith("http://") || href?.startsWith("https://")) {
        e.preventDefault();
        openUrl(href).catch(() => {});
      }
    };

    return createElement(
      "a",
      {
        ...props,
        href,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-blue-600 dark:text-blue-400 hover:underline",
        onClick: handleClick,
      },
      children,
    );
  },
  table: ({ children, ...props }) =>
    createElement(
      "div",
      { className: "overflow-x-auto" },
      createElement(
        "table",
        { ...props, className: "min-w-full" },
        children,
      ),
    ),
  img: ({ src, alt, ...props }) =>
    createElement("img", {
      ...props,
      src,
      alt,
      className: "max-w-full h-auto rounded",
      loading: "lazy",
    }),
};
