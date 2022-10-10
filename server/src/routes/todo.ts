import { Router, RequestHandler } from 'express';

import db from '../db.js';
import { auth } from '../middleware/index.js';
import { BadRequestError, NotFoundError } from '../errors/index.js';

const router = Router();
router.use(auth);

const create: RequestHandler = async (req, res) => {
  const { id } = req.user;
  const { text } = req.body;

  if (!text) throw new BadRequestError('Todo text required');

  const result = await db.query(
    'INSERT INTO todos(text, created_by) values ($1, $2) RETURNING *',
    [text, id]
  );

  res.status(201).json({ created: result.rows[0] });
};

const getAll: RequestHandler = async (req, res) => {
  const result = await db.query(
    'SELECT id, text, completed FROM todos WHERE created_by = $1',
    [req.user.id]
  );

  res.json({ count: result.rowCount, todos: result.rows });
};

const getOne: RequestHandler = async (req, res) => {
  const { id } = req.params; // TODO: validate
  const result = await db.query(
    'SELECT id, text, completed FROM todos WHERE id = $1 AND created_by = $2',
    [id, req.user.id]
  );

  if (!result.rows[0]) throw new NotFoundError();

  res.json({ todo: result.rows[0] });
};

const remove: RequestHandler = async (req, res) => {
  const { id } = req.params; // TODO: validate
  const result = await db.query(
    'DELETE FROM todos WHERE id = $1 AND created_by = $2 RETURNING *',
    [id, req.user.id]
  );

  if (!result.rowCount) throw new NotFoundError();

  res.json({ msg: `deleted todo ${id}` });
};

const edit: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!req.body.text || !(typeof req.body.completed === 'boolean'))
    throw new BadRequestError();
  const updates: { text: string; completed: boolean } = req.body;

  const result = await db.query(
    'UPDATE todos SET text = $1, completed = $2' +
      'WHERE id = $3 AND created_by = $4 RETURNING id, text, completed',
    [updates.text, updates.completed, id, req.user.id]
  );

  if (!result.rowCount) throw new NotFoundError();

  res.json({ todo: result.rows[0] });
};

router.route('/').post(create).get(getAll);
router.route('/:id').get(getOne).patch(edit).delete(remove);

export default router;
