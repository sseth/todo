import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Router, RequestHandler } from 'express';

import db from '../db.js';
import { WrongPasswordError, UserNotFoundError } from '../errors/index.js';
import { User, CreateUserRequest } from '../models/index.js';

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
  const result = await db.query(
    'INSERT INTO users(name, password) VALUES ($1, $2) RETURNING id',
    [user.name, hash]
  );

  const id = result.rows[0].id;
  const token = generateToken(id, user.name);

  res
    .status(201)
    .json({ message: `user ${user.name} successfully created`, token });
};

const login: RequestHandler = async (req, res) => {
  const { name, password }: CreateUserRequest = req.body;

  const result = await db.query('SELECT * FROM users WHERE users.name = $1', [
    name,
  ]);
  const user: User = result.rows[0];
  if (!user) throw new UserNotFoundError(name);

  const authenticated = await bcrypt.compare(password, user.password);
  if (!authenticated) throw new WrongPasswordError();

  const token = generateToken(user.id, name);
  res.json({ token });
};

function generateToken(id: string, name: string): string {
  return jwt.sign({ id, name }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
}

router.route('/register').post(createUser);
router.route('/login').post(login);

export default router;
