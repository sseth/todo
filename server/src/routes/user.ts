import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Router, Request, Response } from 'express';

import db from '../db.js';
import { WrongPasswordError, UserNotFoundError } from '../errors/index.js';
import { User, CreateUserRequest } from '../models/index.js';

const router = Router();

// TODO: request schema validation
const createUser = async (req: Request, res: Response) => {
  const user = req.body as CreateUserRequest;

  const hash = await bcrypt.hash(user.password, 8);
  // TODO: test for errors
  const result = await db.query(
    'INSERT INTO users(name, password) VALUES ($1, $2) RETURNING id',
    [user.name, hash]
  );

  // better way to do this?
  const id = (result.rows[0] as { id: string }).id;
  const token = generateToken(id, user.name);

  res
    .status(201)
    .json({ message: `user ${user.name} successfully created`, token });
};

const login = async (req: Request, res: Response) => {
  const { name, password } = req.body as CreateUserRequest;

  const result = await db.query('SELECT * FROM users WHERE users.name = $1', [
    name,
  ]);
  const user = result.rows[0] as User;
  if (!user) throw new UserNotFoundError(name);

  const authenticated = await bcrypt.compare(password, user.password);
  if (!authenticated) throw new WrongPasswordError();

  const token = generateToken(user.id, name);
  // TODO: return user info
  res.json({ token });
};

function generateToken(id: string, name: string) {
  return jwt.sign({ id, name }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
}

// generate token with delay - TODO: remove
// function generateToken(id: string, name: string) {
//   return new Promise<string>((resolve, reject) => {
//     setTimeout(() => {
//       const token = jwt.sign({ id, name }, process.env.JWT_SECRET as string, {
//         expiresIn: '30d',
//       });
//       resolve(token);
//     }, 5000);
//   });
// }

router.route('/register').post(createUser);
router.route('/login').post(login);

export default router;
