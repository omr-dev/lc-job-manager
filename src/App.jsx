import axios from "axios";

import { useEffect, useState } from "react";
import "./App.scss";

function App() {
  const BASE_API_URL =
    import.meta.env.VITE_BASE_API_URL || "http://localhost:3001"; 
  const [jobSources, setJobSources] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState(""); //TODO:Is it secure?
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    (async () => {
      await axios
        .post(
          BASE_API_URL + "/maintain-login",
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          stayAsloggedIn(response.data.user);

          getJobSources();
        })
        .catch((err) => {
          console.error(28, err);
          //logout();
        });
    })();
  }, []);

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
        login(response.data);
      })
      .catch((err) => {
        console.error(err);
        setLoginMessage("bad login");
      });
  }
  function login(response) {
    setCurrentUser(response.user);
    setIsUserLoggedIn(true);
    setLoginMessage("");
    localStorage.setItem("token", response.token);
  }
  function stayAsloggedIn(user) {
    setCurrentUser(user);
    setIsUserLoggedIn(true);
  }
  function logout() {
    setCurrentUser({});
    setIsUserLoggedIn(false);
    localStorage.setItem("token", "");
  }

  return (
    <div className="App">
      <h1>LC Job Manager</h1>
      {isUserLoggedIn ? (
        <>
          <button onClick={logout}>Logout</button>
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
