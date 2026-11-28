import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { initMonitoring, reactErrorHandler } from '@bazaro/monitoring/react';

import { App } from './App';

initMonitoring({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
  release: import.meta.env.VITE_SENTRY_RELEASE,
});

createRoot(document.getElementById('root')!, {
  onUncaughtError: reactErrorHandler(),
}).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
