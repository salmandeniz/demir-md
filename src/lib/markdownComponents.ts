import type { Components } from "react-markdown";
import { createElement } from "react";

export const markdownComponents: Partial<Components> = {
  a: ({ children, href, ...props }) =>
    createElement(
      "a",
      {
        ...props,
        href,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-blue-600 dark:text-blue-400 hover:underline",
      },
      children,
    ),
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
