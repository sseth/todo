// TODO add user schema

declare namespace Express {
  interface Request {
    user: {
      id: string;
      name: string;
    };
  }
}
