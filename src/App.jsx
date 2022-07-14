import axios from "axios";
import { useEffect, useState } from "react";
import "./App.scss";

function App() {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001/job-sources";
  const [jobSources, setJobSources] = useState([]);

  useEffect(() => {
    (async () => {
      setJobSources((await axios.get(API_URL)).data);
    })();
  }, []);
  return (
    <div className="App">
      <h1>LC Job Manager</h1>
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
    </div>
  );
}

export default App;
