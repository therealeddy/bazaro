import * as Sentry from '@sentry/nextjs';

import { buildInitOptions, type MonitoringOptions } from '../options.js';

export function initMonitoring(options: MonitoringOptions) {
  Sentry.init(buildInitOptions(options));
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
