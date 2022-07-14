import axios from "axios";

import { useEffect, useState } from "react";
import "./App.scss";

function App() {
  const BASE_API_URL =
    import.meta.env.VITE_BASE_API_URL || "http://localhost:3001";
  const [jobSources, setJobSources] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    if (isUserLoggedIn) {
      getJobSources();
    }
  }, [isUserLoggedIn]);
  async function getJobSources() {
    setJobSources((await axios.get(BASE_API_URL + "/job-sources")).data);
  }

  async function handleLogin(e) {
    e.preventDefault();
    const _currentUser = (await axios.post(BASE_API_URL + "/login")).data;
    login(_currentUser);
  }
  function login(user) {
    setCurrentUser(user);
    setIsUserLoggedIn(true);
  }

  return (
    <div className="App">
      <h1>LC Job Manager</h1>
      {isUserLoggedIn ? (
        <>
          <p>There are {jobSources.length} jobs.</p>
          <ul>
            {jobSources.map((source, ind) => {
              return (
                <li key={ind}>
                  <a href={source.url}>{source.name}</a>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            handleLogin(e);
          }}
        >
          <button>Login</button>
        </form>
      )}
    </div>
  );
}

export default App;
