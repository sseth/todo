import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

import { NoTokenError } from '../errors/index.js';

const auth: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const authHeaderMissingOrInvalid =
    !authHeader || !authHeader.startsWith('Bearer ');

  if (authHeaderMissingOrInvalid)
    throw new NoTokenError();

  const token = authHeader?.split(' ')[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET as string);
  req.user = payload as { id: string, name: string };
  // TODO: better way to do this^?

  next();
};

export default auth;
