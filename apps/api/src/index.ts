import express from 'express';

import { environment, setupErrorHandler } from '@bazaro/monitoring/node';
import { APP_NAME } from '@bazaro/shared';

const app = express();
const port = Number(process.env.PORT ?? 3333);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: `${APP_NAME} API` });
});

if (environment !== 'production') {
  app.get('/debug-sentry', () => {
    throw new Error('Sentry test error from the API');
  });
}

setupErrorHandler(app);

app.listen(port, () => {
  console.log(`${APP_NAME} API running on http://localhost:${port}`);
});
