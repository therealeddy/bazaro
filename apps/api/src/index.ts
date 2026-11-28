import { APP_NAME } from '@bazaro/shared';

import { app } from './app.js';

const port = Number(process.env.PORT ?? 3333);

app.listen(port, () => {
  console.log(`${APP_NAME} API running on http://localhost:${port}`);
});
