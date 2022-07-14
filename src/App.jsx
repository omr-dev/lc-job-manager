import axios from "axios";

import { useEffect, useState } from "react";
import "./App.scss";

function App() {
  const BASE_API_URL =
    import.meta.env.VITE_BASE_API_URL || "http://localhost:3001";//TODO:change env file to remote
  const [jobSources, setJobSources] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState(""); //TODO:Is it secure?
  const [loginMessage, setLoginMessage] = useState("");

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

    await axios
      .post(BASE_API_URL + "/login", {
        username: inputUsername,
        password: inputPassword,
      })
      .then((response) => {
        login(response);
      })
      .catch((err) => {
        console.error(err);
        setLoginMessage("bad login");
      });
  }
  function login(user) {
    setCurrentUser(user);
    setIsUserLoggedIn(true);
    setLoginMessage("");
  }

  return (
    <div className="App">
      <h1>LC Job Manager</h1>
      {isUserLoggedIn ? (
        <>
          <p>
            {jobSources.length > 0
              ? `There are ${jobSources.length} jobs.`
              : `Loading`}
          </p>
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
          <div className="row">
            <label htmlFor="username">Username:</label>
            <input
              name="username"
              type="text"
              value={inputUsername}
              onChange={(e) => {
                setInputUsername(e.target.value);
              }}
            />
          </div>
          <div className="row">
            <label htmlFor="password">Password:</label>
            <input
              name="password"
              type="password"
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value);
              }}
            />
          </div>
          <div className="row">
            <button>Login</button>
          </div>
          <p>{loginMessage}</p>
        </form>
      )}
    </div>
  );
}

export default App;
