import axios from 'axios';
import { useState } from 'react';

import Login from './components/Login';
import Navbar from './components/Nav';
import Todos from './components/Todos';

axios.defaults.baseURL = 'http://localhost:5000/api';
// TODO: logout if token invalid
// axios.interceptors.response.use();

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const func = (jwt: string) => {
    // if (!jwt) return;
    setToken(jwt);
    localStorage.setItem('token', jwt);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
  };

  return (
    <div className="h-full">
      {token ? (
        <div>
          <Navbar logout={logout} />
          <Todos />
        </div>
      ) : (
        <Login setToken={func} />
      )}
    </div>
  );
}

export default App;
