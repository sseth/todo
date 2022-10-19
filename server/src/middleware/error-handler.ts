// import { ErrorRequestHandler } from 'express';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors';

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // eslint-disable-next-line
  console.error(JSON.stringify(err, ['message', 'arguments', 'type', 'name']));
  const name = err.name;
  const error = {
    status: err.statusCode || 500,
    message: err.message || 'Something went wrong',
  };

  // 403 if err.message === "Not allowed by CORS"

  // TODO: handle token expiry on frontend
  if (name === 'JsonWebTokenError' || name === 'TokenExpiredError')
    error.status = 401;

  if (
    error.message ===
    'duplicate key value violates unique constraint "users_name_key"'
  ) {
    error.status = 409;
    error.message = 'username not available';
  }

  if (error.message.startsWith('invalid input syntax for type uuid'))
    error.message = 'invalid id';

  res.status(error.status).json({ error: error.message });
  next();
};

export default errorHandler;
