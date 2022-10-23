import axios from 'axios';

import { todo } from '../types';

interface TodoProps {
  text: string;
  id: string;
  setTodos: (newState: todo[] | ((prevState: todo[]) => todo[])) => void
}

function Todo({ text, id, setTodos }: TodoProps) {

  const deleteTodo = async () => {
    try {
      await axios.delete(`/todos/${id}`);
      setTodos((todos) => todos.filter((todo) => todo.id !== id))
    } catch (error) {
      // TODO:
      console.error(error);
    }
  };

  return (
    <div className="group flex max-w-xs space-x-2 sm:max-w-lg md:max-w-2xl">
      <input type="checkbox" name="" id="" />
      <span className="truncate">{text}</span>
      <button
        onClick={deleteTodo}
        className="hidden hover:text-red-500 group-hover:block"
      >
        x
      </button>
    </div>
  );
}

export default Todo;
