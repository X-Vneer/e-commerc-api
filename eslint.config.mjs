import antfu from "@antfu/eslint-config"
import vitest from "@vitest/eslint-plugin"
import prettierConfig from "eslint-config-prettier"

export default antfu(
  {
    type: "app",
    typescript: true,
    formatters: {
      prettier: true,
    },
  },
  {
    rules: {
      ...prettierConfig.rules,
      "antfu/if-newline": "off",
      "ts/no-redeclare": "off",
      "node/file-extension-in-import": ["error", "always"],
      "ts/consistent-type-definitions": ["error", "type"],
      "no-console": ["warn"],
      "antfu/no-top-level-await": ["off"],
      "node/prefer-global/process": ["off"],
      "node/no-process-env": ["error"],
      // Ensure prettier doesn't disable import sorting - set after spreading prettierConfig
      "sort-imports": "off",
      "perfectionist/sort-imports": [
        "error",
        {
          tsconfigRootDir: ".",
        },
      ],
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md"],
        },
      ],
      "test/prefer-lowercase-title": ["off"],
      "ts/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "unused-imports/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      ...vitest.configs.recommended.rules,
      "@typescript-eslint/unbound-method": "off",
    },
  },
  {
    ignores: ["src/generated/**"],
  }
)
