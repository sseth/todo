import axios from 'axios';
import React, { useState, KeyboardEvent } from 'react';

import { todo } from '../types';

interface props {
  setTodos: (newState: todo[] | ((prevState: todo[]) => todo[])) => void
}

function AddTodo({ setTodos }: props) {
  const [newTodo, setNewTodo] = useState('');

  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value.slice(0, 255));
  };

  const addNewTodo = async () => {
    try {
      const res = await axios.post('/todos', { text: newTodo });
      const data = res.data as { created: todo };
      setTodos((prevState) => ([ ...prevState, data.created ]));
      setNewTodo('');
    } catch (error) {
      // TODO:
      // handle text.length > 255
      console.error(error);
    }
  };

  const enterAdd = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') await addNewTodo();
  };

  return (
    <div className="flex w-full items-center justify-center space-x-2">
      <input
        type="text"
        value={newTodo}
        onChange={update}
        onKeyDown={enterAdd}
        placeholder="type stuff here"
        className="w-full rounded-md border bg-gray-100 px-4 py-2 text-lg
            focus:bg-white focus:outline-none"
      />
      <button onClick={addNewTodo} className="rounded-lg border p-2">
        Add
      </button>
    </div>
  );
}

export default AddTodo;
