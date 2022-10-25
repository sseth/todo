import axios from 'axios';
// import { useState } from 'react';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { todo } from '../types';

interface TodoProps {
  id: string;
  text: string;
  completed: boolean;
  setTodos: (newState: todo[] | ((prevState: todo[]) => todo[])) => void;
}

function Todo({ text, id, completed, setTodos }: TodoProps) {
  const deleteTodo = async () => {
    try {
      await axios.delete(`/todos/${id}`);
      setTodos((todos) => todos.filter((todo) => todo.id !== id));
    } catch (error) {
      // TODO:
      console.error(error);
    }
  };

  const completeTodo = async () => {
    try {
      await axios.patch(`/todos/${id}`, { text, completed: !completed });
      const res = await axios('/todos');
      const updatedTodos = (res.data as { todos: todo[]; count: number }).todos;
      setTodos(updatedTodos);
    } catch (error) {
      // TODO:
      console.error(error);
    }
  };

  // className="group relative my-3 flex max-w-xs space-x-2 rounded border px-2 py-4 text-lg
  // focus:border-red-500 sm:max-w-lg md:max-w-2xl"

  return (
    <div className="group relative flex space-x-2 rounded border px-2 py-4 text-lg">
      <input
        type="checkbox"
        name="completed"
        checked={completed}
        onChange={completeTodo}
        className="peer ml-2 h-6 w-6 self-center"
        // h-2 w-2 appearance-none self-center border checked:bg-green-500"
      />
      <span
        className="truncate pl-2 group-hover:mr-8
        peer-checked:text-gray-400 peer-checked:line-through"
      >
        {text}
      </span>
      <button
        onClick={deleteTodo}
        className="absolute right-3 bg-white opacity-0 hover:text-red-500 
          group-hover:opacity-100 group-hover:transition group-hover:duration-200"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}

export default Todo;
