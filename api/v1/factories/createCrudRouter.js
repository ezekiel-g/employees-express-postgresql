import express from 'express';
import handleDbError from '../util/handleDbError.js';
import { formatInsert, formatUpdate } from '../util/queryHelper.js';

const createCrudRouter = (pool, tableName) => {
  const router = express.Router();

  router.get('/', async (request, response) => {
    try {
      const sqlResult = await pool.query(`SELECT * FROM ${tableName};`);

      return response.status(200).json(sqlResult.rows);
    } catch (error) {
      return handleDbError(response, error);
    }
  });

  router.get('/:id', async (request, response) => {
    try {
      const sqlResult = await pool.query(
        `SELECT * FROM ${tableName} WHERE id = $1;`,
        [request.params.id],
      );

      if (sqlResult.rows.length === 0) return response.status(404).json([]);

      return response.status(200).json(sqlResult.rows);
    } catch (error) {
      return handleDbError(response, error);
    }
  });

  router.post('/', async (request, response) => {
    const [columnNames, queryParams, placeholders] = formatInsert(request.body);

    try {
      const sqlResult = await pool.query(
        `INSERT INTO ${tableName} (${columnNames.join(', ')})
        VALUES (${placeholders})
        RETURNING *;`,
        queryParams,
      );

      return response.status(201).json(sqlResult.rows);
    } catch (error) {
      return handleDbError(response, error, columnNames);
    }
  });

  router.patch('/:id', async (request, response) => {
    const [columnNames, setClause, queryParams] = formatUpdate(
      request.body,
      request.params.id,
    );

    try {
      const sqlResult = await pool.query(
        `UPDATE ${tableName}
        SET ${setClause}
        WHERE id = $${queryParams.length}
        RETURNING *;`,
        queryParams,
      );

      if (sqlResult.rows.length === 0) return response.status(404).json([]);

      return response.status(200).json(sqlResult.rows);
    } catch (error) {
      return handleDbError(response, error, columnNames);
    }
  });

  router.delete('/:id', async (request, response) => {
    try {
      const sqlResult = await pool.query(
        `DELETE FROM ${tableName} WHERE id = $1;`,
        [request.params.id],
      );

      if (sqlResult.rowCount === 0) return response.status(404).json([]);

      return response.status(200).json([]);
    } catch (error) {
      return handleDbError(response, error);
    }
  });

  return router;
};

export default createCrudRouter;
