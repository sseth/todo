import { Router, RequestHandler } from 'express';

import db from '../db.js';
import { auth } from '../middleware/index.js';

const router = Router();
router.use(auth);

const test: RequestHandler = async (req, res) => {
  const { id } = req.user;
  const { text } = req.body;
  const result = await db.query(
    'INSERT INTO todos(text, created_by) values ($1, $2) RETURNING *',
    [text, id]
  );
  res.status(201).json({ created: result.rows[0] });
};

router.route('/create').post(test);

export default router;
