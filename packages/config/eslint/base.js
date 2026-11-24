import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['**/dist/', '**/.next/', '**/.turbo/', '**/next-env.d.ts', 'planning/']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // side effect imports (ex.: import './globals.css')
            ['^\\u0000'],
            // node built-ins and external packages
            ['^node:', '^@?\\w'],
            // monorepo packages
            ['^@bazaro/'],
            // local files
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  // must stay last: turns off rules that conflict with Prettier
  prettier,
]);
