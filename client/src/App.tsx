import axios from 'axios';
import { useState, useEffect } from 'react';

import Todo from './components/Todo';
import Navbar from './components/Nav';
import Login from './components/Login';
import AddTodo from './components/AddTodo';
import Completed from "./components/Completed";
import { todo, getTodosResponse } from './types';

axios.defaults.baseURL = 'http://localhost:5000/api';
// TODO: logout if token invalid
// axios.interceptors.response.use();

function App() {
  // console.log('rendering app');

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [todos, setTodos] = useState([] as todo[]);

  const _setToken = (jwt: string) => {
    // if (!jwt) return;
    setToken(jwt);
    localStorage.setItem('token', jwt);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
  };

  const getTodos = async () => {
    console.log('fetching todos');

    try {
      const res = await axios('/todos');
      const data = res.data as getTodosResponse;
      setTodos(data.todos);
    } catch (error) {
      // TODO:
      console.error(error);
    }
  };

  useEffect(() => {
    if (!token) return;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    void getTodos();
  }, [token]);

  // const todoElements = useCallback(
  //   () =>
  //     todos.map((todo) => (
  //       <Todo
  //         key={todo.id}
  //         id={todo.id}
  //         text={todo.text}
  //         completed={todo.completed}
  //         setTodos={setTodos}
  //       />
  //     )),
  //   [todos]
  // );

  const getTodoElement = (todo: todo) => (
    <Todo
      key={todo.id}
      id={todo.id}
      text={todo.text}
      done={todo.completed}
      setTodos={setTodos}
    />
  );

  const todoElements = todos
    .filter((todo) => !todo.completed)
    .map(getTodoElement);

  const completedTodos = todos
    .filter((todo) => todo.completed)
    .map(getTodoElement);

  const stuff = (
    <>
      <Navbar logout={logout} />
      <div className="container mx-auto flex flex-col items-center p-8">
        <AddTodo setTodos={setTodos} />
        <div
          className="container mt-8 flex max-w-[900px] flex-col justify-center
            space-y-4 px-2 md:px-20"
        >
          {todoElements}
        </div>
        <Completed todos={completedTodos} />
      </div>
    </>
  );

  return (
    <div className="h-full">
      {token ? stuff : <Login setToken={_setToken} />}
    </div>
  );
}

export default App;
