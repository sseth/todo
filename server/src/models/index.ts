// schema validation? type for ids?

export interface CreateUserRequest {
  name: string;
  password: string;
}

export type LoginRequest = CreateUserRequest;

export interface User {
  id: string;
  name: string;
  password: string;
}

export interface Todo {
  id: string;
  text: string;
  createdBy: string;
  completed: boolean;
}
