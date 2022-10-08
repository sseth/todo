import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Router, RequestHandler } from 'express';

import db from '../db.js';
import { User, CreateUserRequest, LoginRequest } from '../models/index.js';

const router = Router();

router.route('/test').get(async (req, res) => {
  const x = await db.query('SELECT * FROM todos WHERE created_by = $1', [
    req.user.id,
  ]);
  res.json({ data: x.rows });
});
// TODO: request schema validation
const createUser: RequestHandler = async (req, res) => {
  const user: CreateUserRequest = req.body;

  const hash = await bcrypt.hash(user.password, 8);
  // TODO: test for errors
  await db.query('INSERT INTO users(name, password) VALUES ($1, $2)', [
    user.name,
    hash,
  ]);

  res.status(201).json({ message: `User ${user.name} successfully created` });
};

const login: RequestHandler = async (req, res) => {
  const { name, password }: LoginRequest = req.body;

  // check if user exists (sql IF EXISTS?) else send 401 wrong username
  const result = await db.query('SELECT * FROM users WHERE users.name = $1', [
    name,
  ]);
  const user: User = result.rows[0];
  const authenticated = await bcrypt.compare(password, user.password);

  if (!authenticated) res.status(401).json({ message: 'Incorrect password' });

  const token = jwt.sign(
    { id: user.id, name: user.name },
    process.env.JWT_SECRET as string,
    { expiresIn: '30d' }
  ); // TODO: handle token expiry on frontend
  res.json({ token });
};

router.route('/register').post(createUser);
router.route('/login').post(login);

export default router;
