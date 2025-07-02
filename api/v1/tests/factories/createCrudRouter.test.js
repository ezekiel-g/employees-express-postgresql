import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  jest,
} from '@jest/globals';
import request from 'supertest';
import express from 'express';
import createCrudRouter from '../../factories/createCrudRouter.js';
import { createPool, closePool } from '../../db/db.js';
import handleDbError from '../../util/handleDbError.js';
import { formatInsert, formatUpdate } from '../../util/queryHelper.js';

jest.mock('../../db/db.js');
jest.mock('../../util/handleDbError.js');
jest.mock('../../util/queryHelper.js');

describe('createCrudRouter', () => {
  let app;
  let pool;

  beforeAll(() => {
    pool = { query: jest.fn() };

    createPool.mockReturnValue(pool);

    app = express();
    app.use(express.json());
    app.use('/api/v1/users', createCrudRouter(pool, 'users'));

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => jest.clearAllMocks());

  afterAll(async () => {
    await closePool(pool);
    console.error.mockRestore();
  });

  it('returns 200 and all rows on GET /', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Al' }] });

    const response = await request(app).get('/api/v1/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'Al' }]);
  });

  it('returns 200 and specific row on GET /:id', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Al' }] });

    const response = await request(app).get('/api/v1/users/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'Al' }]);
  });

  it('returns 404 if no row found on GET /:id', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get('/api/v1/users/9999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual([]);
  });

  it('returns 201 and new row on POST /', async () => {
    formatInsert.mockReturnValue([['name'], ['Al'], '$1']);

    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Al' }] });

    const response = await request(app)
      .post('/api/v1/users')
      .send({ name: 'Al' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual([{ id: 1, name: 'Al' }]);
  });

  it('returns 200 and updated row on PATCH /:id', async () => {
    formatUpdate.mockReturnValue([['name'], 'name = $1', ['Al']]);

    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Al' }] });

    const response = await request(app)
      .patch('/api/v1/users/1')
      .send({ name: 'Al' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'Al' }]);
  });

  it('returns 404 if no row found on PATCH /:id', async () => {
    formatUpdate.mockReturnValue([['name'], 'name = $1', ['Nobody', '9999']]);

    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .patch('/api/v1/users/9999')
      .send({ name: 'Nobody' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual([]);
  });

  it('returns 200 and deletes row on DELETE /:id', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 1 });

    const response = await request(app).delete('/api/v1/users/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('returns 404 if no row found on DELETE /:id', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const response = await request(app).delete('/api/v1/users/9999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual([]);
  });

  it('calls handleDbError on GET / failure', async () => {
    const error = new Error();

    pool.query.mockRejectedValueOnce(error);

    handleDbError.mockImplementation(
      (response) => response .status(500).json(['error']),
    );

    await request(app).get('/api/v1/users');

    expect(handleDbError).toHaveBeenCalledWith(expect.any(Object), error);
  });
});
