import { Router } from 'express';

const RESERVED_SLUGS = new Set(['www', 'app', 'api', 'dev', 'admin']);

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/;

export const storesRouter = Router();

storesRouter.get('/validate-slug', (req, res) => {
  const slug = (req.query.slug as string).trim().toLowerCase();

  const reason = !SLUG_PATTERN.test(slug)
    ? 'invalid-format'
    : RESERVED_SLUGS.has(slug)
      ? 'reserved'
      : null;

  res.json({ slug, valid: reason === null, reason });
});
