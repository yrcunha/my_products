import globals from "globals";
import pluginJs from "@eslint/js";
import pluginTs from "typescript-eslint";
import eslintPluginNoSecrets from "eslint-plugin-no-secrets";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: { globals: globals.node },
    plugins: { "no-secrets": eslintPluginNoSecrets },
    rules: {
      "no-secrets/no-secrets": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
        },
      ],
    },
  },
  pluginJs.configs.recommended,
  ...pluginTs.configs.recommended,
];
