import { withSentryConfig } from '@sentry/nextjs/config';
import type { NextConfig } from 'next';

import { SENTRY_ORG } from '../options.js';

export function withMonitoring(nextConfig: NextConfig, { project }: { project: string }) {
  return withSentryConfig(nextConfig, {
    org: SENTRY_ORG,
    project,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,
    telemetry: false,
    sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
  });
}
