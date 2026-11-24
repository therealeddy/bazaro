import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

import base from './base.js';

export default defineConfig([
  base,
  reactHooks.configs.flat.recommended,
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // only applies to the old pages/ router; we use the App Router
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
]);
