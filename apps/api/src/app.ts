import express from 'express';

import { environment, setupErrorHandler } from '@bazaro/monitoring/node';
import { APP_NAME } from '@bazaro/shared';

import { storesRouter } from './routes/stores.js';

export const app = express();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: `${APP_NAME} API` });
});

app.use('/stores', storesRouter);

if (environment !== 'production') {
  app.get('/debug-sentry', () => {
    throw new Error('Sentry test error from the API');
  });
}

setupErrorHandler(app);
