import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // console.error(JSON.stringify(err, ["message", "arguments", "type", "name"]));
  const error = {
    status: err.statusCode || 500,
    message: err.message || 'Something went wrong',
  };
  // 403 if err.message === "Not allowed by CORS"
  // TODO: handle JsonWebTokenError and TokenExpiredError
  res.status(error.status).json({ error: error.message });
};

export default errorHandler;
