/// <reference types="node" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { sourceMapsPlugin } from '@bazaro/monitoring/vite';

export default defineConfig({
  build: { sourcemap: 'hidden' },
  plugins: [
    react(),
    sourceMapsPlugin({ project: 'bazaro-dashboard', release: process.env.VITE_SENTRY_RELEASE }),
  ],
  server: { port: 5173 },
});
