import { config } from "@workspace/eslint-config/base";

/** @type {import('eslint').Linter.Config} */
export default [
  ...config,
  {
    ignores: ["node_modules", "dist", ".turbo"],
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "no-console": "warn",
    },
  },
];
