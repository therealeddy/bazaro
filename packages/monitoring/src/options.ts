export const SENTRY_ORG = 'therealeddy';

export interface MonitoringOptions {
  dsn?: string;
  environment?: string;
  release?: string;
}

export function buildInitOptions({ dsn, environment, release }: MonitoringOptions) {
  return {
    dsn,
    enabled: Boolean(dsn),
    environment: environment ?? 'local',
    ...(release && { release }),
  };
}
