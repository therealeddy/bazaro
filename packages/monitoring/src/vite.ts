import { sentryVitePlugin } from '@sentry/vite-plugin';

import { SENTRY_ORG } from './options.js';

export function sourceMapsPlugin({
  project,
  release,
}: {
  project: string;
  release?: string;
}): ReturnType<typeof sentryVitePlugin> {
  return sentryVitePlugin({
    org: SENTRY_ORG,
    project,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    disable: !process.env.SENTRY_AUTH_TOKEN,
    telemetry: false,
    release: { name: release },
    sourcemaps: { filesToDeleteAfterUpload: ['./dist/**/*.map'] },
  });
}
