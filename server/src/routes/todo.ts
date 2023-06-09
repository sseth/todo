import { Router, Response, Request } from 'express';

import db from '../db.js';
import { Todo } from '../models/index.js';
import { auth } from '../middleware/index.js';
import { BadRequestError, NotFoundError } from '../errors/index.js';

const router = Router();
router.use(auth);

const create = async (req: Request, res: Response) => {
  const { id } = req.user;
  const { text } = req.body as { text: string };

  if (!text) throw new BadRequestError('Todo text required');

  const result = await db.query(
    'INSERT INTO todos(text, created_by) values ($1, $2) RETURNING *',
    [text, id]
  );

  res.status(201).json({ created: result.rows[0] as Todo });
};

const getAll = async (req: Request, res: Response) => {
  const result = await db.query(
    'SELECT id, text, completed FROM todos WHERE created_by = $1 ORDER BY created',
    [req.user.id]
  );

  res.json({ count: result.rowCount, todos: result.rows });
};

const getOne = async (req: Request, res: Response) => {
  const { id } = req.params; // TODO: validate
  const result = await db.query(
    'SELECT id, text, completed FROM todos WHERE id = $1 AND created_by = $2',
    [id, req.user.id]
  );

  if (!result.rows[0]) throw new NotFoundError();

  res.json({ todo: result.rows[0] as Todo });
};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params; // TODO: validate
  const result = await db.query(
    'DELETE FROM todos WHERE id = $1 AND created_by = $2 RETURNING *',
    [id, req.user.id]
  );

  if (!result.rowCount) throw new NotFoundError();

  res.json({ msg: `deleted todo ${id}` });
};

const edit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const update = req.body as {
    key: 'text' | 'completed';
    value: string | boolean;
  };

  const result = await db.query(
    `UPDATE todos SET ${update.key} = $1 ` +
      'WHERE id = $2 AND created_by = $3 ' +
      'RETURNING id, text, completed',
    [update.value, id, req.user.id]
  );

  if (!result.rowCount) throw new NotFoundError();

  res.json({ todo: result.rows[0] as Todo });
};

router.route('/').post(create).get(getAll);

router.route('/test').get(async (req, res) => {
  const x = await db.query('SELECT created FROM todos');
  // console.log(x.rows[0].created)
  res.json({ data: x.rows });
});

router.route('/:id').get(getOne).patch(edit).delete(remove);

export default router;
