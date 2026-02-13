/**
 * @file eslint.config.ts
 * @brief ESLint 9 flat configuration for TypeScript and Prettier.
 * @details This file defines the root ESLint configuration using the flat config format
 *          introduced in ESLint 9. It configures the TypeScript parser and plugin for
 *          source and test files, applies the recommended TypeScript rules, and appends
 *          eslint-config-prettier so that formatting is left to Prettier. The config is
 *          loaded by ESLint at runtime (via jiti or built-in support when using
 *          eslint.config.ts). Ignores cover build output, dependencies, coverage and
 *          generated docs. All entries are typed using the Linter namespace from the
 *          eslint package for explicit type safety.
 * @author Victor Yeh
 * @date 2026-02-13
 * @copyright MIT License
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 */

import type { Linter } from 'eslint';

/**
 * @interface TypeScriptEslintPlugin
 * @type interface
 * @brief Shape of the @typescript-eslint/eslint-plugin package used for typing the required plugin.
 * @details This interface describes only the subset of the plugin object that this config
 *          uses: the legacy configs.recommended.rules object. The full plugin also provides
 *          rules and metadata for ESLint; we type only the recommended rules so that
 *          tsPlugin.configs.recommended.rules can be spread into the flat config rules
 *          without type assertions. The plugin is loaded via require() because it is a
 *          CommonJS module. configs is readonly because we do not mutate it; recommended
 *          and rules are readonly for the same reason.
 */
interface TypeScriptEslintPlugin {
  /**
   * @var configs
   * @type { readonly recommended: { readonly rules: Linter.RulesRecord } }
   * @brief Legacy config object containing the recommended preset.
   * @details Exposes the plugin's legacy (eslintrc-style) configs. The recommended
   *          property holds the recommended rule preset; its rules field is a
   *          Linter.RulesRecord used in this file by spreading into the flat config
   *          rules. Readonly so the config does not mutate the plugin's internal state.
   */
  readonly configs: { readonly recommended: { readonly rules: Linter.RulesRecord } };
}

/**
 * @var tsPlugin
 * @type TypeScriptEslintPlugin & Record<string, unknown>
 * @brief TypeScript ESLint plugin instance used in the flat config.
 * @details Loaded at runtime via require('@typescript-eslint/eslint-plugin'). Typed as
 *          TypeScriptEslintPlugin so that configs.recommended.rules can be spread into
 *          the typescriptConfig rules. Intersected with Record<string, unknown> so that
 *          the same value can be assigned to plugins['@typescript-eslint'], which
 *          expects a full plugin object (rules, meta, etc.). The plugin enables
 *          TypeScript-aware lint rules and the recommended rule set for this project.
 */
const tsPlugin: TypeScriptEslintPlugin & Record<string, unknown> =
  require('@typescript-eslint/eslint-plugin');

/**
 * @var tsParser
 * @brief TypeScript ESLint parser used to parse .ts source files.
 * @details Loaded at runtime via require('@typescript-eslint/parser'). Assigned to
 *          languageOptions.parser in the TypeScript config block so that ESLint parses
 *          TypeScript syntax and produces an AST that the @typescript-eslint rules
 *          expect. Not given an explicit TypeScript type because the Linter.Parser type
 *          is not part of the public eslint type exports; the value is used only as the
 *          parser option and is not referenced elsewhere.
 */
const tsParser = require('@typescript-eslint/parser');

/**
 * @var prettierConfig
 * @type Linter.Config
 * @brief Prettier compatibility config that disables conflicting ESLint rules.
 * @details Loaded via require('eslint-config-prettier') and typed as Linter.Config so
 *          it can be included in the exported config array. This object contains rule
 *          settings (mostly "off") for rules that duplicate or conflict with Prettier
 *          formatting. It is applied last in the config array so that Prettier wins when
 *          used together with ESLint. The package has no TypeScript declarations; the
 *          type assertion ensures the config array remains fully typed.
 */
const prettierConfig: Linter.Config = require('eslint-config-prettier');

/**
 * @var globals
 * @type Linter.Globals
 * @brief Global variables exposed to the lint environment for TypeScript and test files.
 * @details Defines which globals are available and whether they are read-only or
 *          writable. Includes Node.js globals (console, process, Buffer, __dirname,
 *          __filename, module, require, exports), and Jest globals (describe, it,
 *          expect, beforeAll, afterAll, beforeEach, jest, Jest). All are readonly except
 *          exports, which is writable. This object is passed to languageOptions.globals
 *          in the TypeScript config so that ESLint does not report these as undefined
 *          or disallow their use. Kept in a named constant for clarity and reuse.
 */
const globals: Linter.Globals = {
  console: 'readonly',
  process: 'readonly',
  Buffer: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  module: 'readonly',
  require: 'readonly',
  exports: 'writable',
  Jest: 'readonly',
  jest: 'readonly',
  describe: 'readonly',
  it: 'readonly',
  expect: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
  beforeEach: 'readonly',
};

/**
 * @var typescriptConfig
 * @type Linter.Config
 * @brief Single flat config object that applies TypeScript parsing and recommended rules.
 * @details Targets files in src and test directories with extension .ts, and
 *          jest.config.ts. Sets
 *          languageOptions.parser to tsParser and parserOptions to ecmaVersion 'latest'
 *          and sourceType 'module'. Injects globals so Node and Jest globals are
 *          recognised. Registers the @typescript-eslint plugin and spreads
 *          tsPlugin.configs.recommended.rules into rules so that the TypeScript
 *          recommended rule set is enabled. This block is merged by ESLint with the
 *          ignores and prettierConfig entries to form the full configuration.
 */
const typescriptConfig: Linter.Config = {
  files: ['src/**/*.ts', 'test/**/*.ts', 'jest.config.ts'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    globals,
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
  },
  rules: {
    ...tsPlugin.configs.recommended.rules,
  },
};

/**
 * @var config
 * @type Linter.Config[]
 * @brief Root flat config array exported as the default and used by ESLint.
 * @details The array is the default export of this file. ESLint loads it when running
 *          in the project directory and applies entries in order: first the ignores
 *          (dist, node_modules, coverage, docs), then typescriptConfig for TypeScript
 *          parsing and rules, then prettierConfig to turn off rules that conflict with
 *          Prettier. The result is a single effective configuration for all matched
 *          files. Exporting this array is the standard way to define configuration in
 *          the ESLint 9 flat config format.
 */
const config: Linter.Config[] = [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'docs/**'],
  },
  typescriptConfig,
  prettierConfig,
];

export default config;
