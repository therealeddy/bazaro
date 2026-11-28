import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../../src/app.js';

describe('GET /stores/validate-slug', () => {
  it('accepts a valid slug', async () => {
    const response = await request(app).get('/stores/validate-slug').query({ slug: 'minha-loja' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ slug: 'minha-loja', valid: true, reason: null });
  });

  it('normalizes the slug before validating', async () => {
    const response = await request(app)
      .get('/stores/validate-slug')
      .query({ slug: '  Minha-Loja  ' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ slug: 'minha-loja', valid: true, reason: null });
  });

  it.each(['ab', 'loja!', '-loja', 'loja-'])('rejects %j as invalid format', async (slug) => {
    const response = await request(app).get('/stores/validate-slug').query({ slug });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ valid: false, reason: 'invalid-format' });
  });

  it('rejects a reserved slug', async () => {
    const response = await request(app).get('/stores/validate-slug').query({ slug: 'admin' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ slug: 'admin', valid: false, reason: 'reserved' });
  });

  it('returns 400 when the slug parameter is missing', async () => {
    const response = await request(app).get('/stores/validate-slug');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'The slug query parameter is required' });
  });

  it('returns 400 when the slug parameter is repeated', async () => {
    const response = await request(app).get('/stores/validate-slug?slug=a&slug=b');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'The slug query parameter is required' });
  });
});
