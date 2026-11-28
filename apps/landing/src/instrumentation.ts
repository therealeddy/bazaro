import { initMonitoring } from '@bazaro/monitoring/next/server';

export function register() {
  initMonitoring({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
  });
}

export { onRequestError } from '@bazaro/monitoring/next/server';
