import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * Next.js 16 removed `next lint`; we run ESLint 9 flat config directly.
 * Several react-hooks compiler-style rules flag common Next/React patterns;
 * keep them as warnings until components are refactored incrementally.
 */
const lakeViewOverrides = [
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "react/no-unescaped-entities": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      "import/no-anonymous-default-export": "off",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/set-state-in-render": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
    },
  },
];

/** @type {import("eslint").Linter.Config[]} */
export default [...coreWebVitals, ...typescript, ...lakeViewOverrides];
