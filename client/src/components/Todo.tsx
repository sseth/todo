import axios from 'axios';
import debounce from 'lodash.debounce';
import React, { useCallback, useState } from 'react';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { todo } from '../types';

interface TodoProps {
  id: string;
  text: string;
  done: boolean;
  setTodos: (newState: todo[] | ((prevState: todo[]) => todo[])) => void;
}

// const debounce = (fn: (...args: any[]) => void, timeout = 300) => {
//   console.log('in debounce');
//   let timer: NodeJS.Timeout;
//   return (...args: unknown[]) => {
//     console.log(args);
//     console.log('clearing timer');
//     clearTimeout(timer);
//     timer = setTimeout(() => { fn(args) }, timeout);
//     console.log('running debounced function in', timeout);
//   };
// };

function Todo({ text, id, done, setTodos }: TodoProps) {
  // console.log('rendering todo', id);

  const [todoText, setTodoText] = useState(text);
  const [completed, setCompleted] = useState(done);

  const editTodo = async (text: string) => {
    try {
      // console.log('sending request:', text);
      await axios.patch(`/todos/${id}`, { key: 'text', value: text });
    } catch (error) {
      // TODO:
      console.error(error);
    }
  };

  const debouncedEdit = useCallback(debounce(editTodo, 1500), []);

  const update = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
    await debouncedEdit(e.target.value);
  };

  const deleteTodo = async () => {
    try {
      await axios.delete(`/todos/${id}`);
      setTodos((todos) => todos.filter((todo) => todo.id !== id));
    } catch (error) {
      // TODO:
      console.error(error);
    }
  };

  const toggleCompleted = async () => {
    try {
      await axios.patch(`/todos/${id}`, {
        key: 'completed',
        value: !completed,
      });
      setCompleted((prev) => !prev);

      const res = await axios('/todos');
      const updatedTodos = (res.data as { todos: todo[] }).todos;
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
        onChange={toggleCompleted}
        className="peer ml-2 h-6 w-6 self-center"
        // h-2 w-2 appearance-none self-center border checked:bg-green-500"
      />
      <input
        type="text"
        value={todoText}
        onChange={update}
        className="truncate pl-2 focus:outline-none group-hover:mr-8
        peer-checked:text-gray-400 peer-checked:line-through"
      />
      <button
        onClick={deleteTodo}
        className="absolute right-5 bg-white text-gray-400 opacity-0 hover:text-red-500 
          group-hover:opacity-100 group-hover:transition group-hover:duration-200"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}

export default Todo;
