import * as Sentry from '@sentry/node';

import { buildInitOptions } from './options.js';

export const environment =
  process.env.SENTRY_ENVIRONMENT ?? process.env.RAILWAY_ENVIRONMENT_NAME ?? 'local';

export function initMonitoring() {
  Sentry.init(
    buildInitOptions({
      dsn: process.env.SENTRY_DSN,
      environment,
      release: process.env.SENTRY_RELEASE,
    }),
  );
}

export const setupErrorHandler = Sentry.setupExpressErrorHandler;
