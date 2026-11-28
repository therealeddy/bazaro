import * as Sentry from '@sentry/react';

import { buildInitOptions, type MonitoringOptions } from './options.js';

export function initMonitoring(options: MonitoringOptions) {
  Sentry.init(buildInitOptions(options));
}

export const reactErrorHandler = Sentry.reactErrorHandler;
