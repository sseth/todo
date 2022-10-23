// import axios from 'axios';
// import React, { useState, useEffect, KeyboardEvent } from 'react';

import Todo from './Todo';
import { todo } from '../types';

interface TodoListProps {
  todos: todo[];
  setTodos: (newState: todo[] | ((prevState: todo[]) => todo[])) => void
}

function TodoList({ todos, setTodos }: TodoListProps) {

  const todoElements = todos.map((todo) => (
      <Todo key={todo.id} id={todo.id} text={todo.text} setTodos={setTodos} />
    )
  );

  return (
    <div className="mt-10">{todoElements}</div>
  );
}

export default TodoList;
