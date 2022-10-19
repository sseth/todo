import axios from 'axios';
import React, { useState } from 'react';

interface LoginProps {
  setToken(token: string): void;
}

function Login({ setToken }: LoginProps) {
  const [newUser, setNewUser] = useState(false);
  const [credentials, setCredentials] = useState({
    name: 'test',
    password: 'abcd1234',
  });

  const sendRequest = async () => {
    const route = `/user/${newUser ? 'register' : 'login'}`;
    try {
      const response = await axios.post(route, credentials);
      // TODO: user info
      const data = response.data as { token: string };
      setToken(data.token);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.error(
          e.response
            ? e.response
            : { name: e.name, code: e.code, message: e.message }
        );
      } else {
        console.error(e);
      }

      // TODO: error feedback
    }
  };

  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="mx-auto flex h-full flex-col items-center justify-center space-y-4 pb-80">
      <h1 className="text-2xl font-bold">{newUser ? 'Register' : 'Log In'}</h1>
      <form className="flex flex-col space-y-2">
        <input
          name="name"
          type="email"
          onChange={update}
          placeholder="username"
          value={credentials.name}
          className="rounded border border-gray-400 px-2 py-1
            focus:shadow-xl focus:outline-none"
        />
        <input
          name="password"
          type="password"
          onChange={update}
          placeholder="password"
          value={credentials.password}
          className="rounded border border-gray-400 px-2 py-1 focus:shadow-xl
            focus:outline-none"
        />
      </form>
      <button
        onClick={sendRequest}
        className="rounded border border-gray-400 py-1 px-2 transition-all
          delay-75 ease-out focus:outline-none active:bg-gray-400 active:text-white"
      >
        submit
      </button>
      <p
        onClick={() => setNewUser(!newUser)}
        className="cursor-pointer pt-6 pl-40 text-xs text-gray-500 hover:text-blue-400"
      >
        {newUser ? 'Log in' : 'Register'}
      </p>
    </div>
  );
}

export default Login;
