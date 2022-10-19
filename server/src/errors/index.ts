export class CustomError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 500;
  }
}

export class BadRequestError extends CustomError {
  constructor(msg?: string) {
    super(msg || 'bad request');
    this.statusCode = 400;
  }
}

export class NoTokenError extends CustomError {
  constructor(msg?: string) {
    super(msg || 'authentication failed: token not provided');
    this.statusCode = 401;
  }
}

export class WrongPasswordError extends CustomError {
  constructor(msg?: string) {
    super(msg || 'incorrect password');
    this.statusCode = 401;
  }
}

export class UserNotFoundError extends CustomError {
  constructor(name?: string) {
    const msg = `user ${name ? `'${name}' ` : ''}not found`;
    super(msg);
    this.statusCode = 401;
  }
}

export class Forbidden extends CustomError {
  constructor(msg?: string) {
    super(msg || 'forbidden');
    this.statusCode = 403;
  }
}

export class NotFoundError extends CustomError {
  constructor(msg?: string) {
    super(msg || 'not found');
    this.statusCode = 404;
  }
}
