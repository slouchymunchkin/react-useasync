import React from "react";
import logo from "../logo.svg";
import useAsync from "./useasync";

const doubleAsync = (n: number) => {
  return new Promise<number>((resolve) => {
    setTimeout(() => resolve(n * 2), 3000);
  });
};

function App() {
  const [value, { isDone, isError, isIdle, isLoading }, _doubleAsync] = useAsync(doubleAsync);

  const n = Math.ceil(Math.random() * 10);
  console.log(isDone, isError, isIdle, isLoading);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>

        {isLoading ? <div>loading</div> : value && <div>The new value is {value}</div>}
        <hr />
        <button onClick={() => _doubleAsync(n)}>Click here to calculate {n} * 2</button>
      </header>
    </div>
  );
}

export default App;
