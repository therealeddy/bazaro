import { initMonitoring } from '@bazaro/monitoring/next/client';

initMonitoring({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
});

export { onRouterTransitionStart } from '@bazaro/monitoring/next/client';
