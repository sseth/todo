export interface todo {
  id: string;
  text: string;
  completed: boolean;
}

export type getTodosResponse = { count: number; todos: todo[] };
