import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react"

function App() {
  const [orders, setOrders] = useState([])

  const fetchData = () => {
    fetch(`http://${process.env.REACT_APP_BACKEND_API_HOST}:8080/api/v1/example/fetchdocs`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setOrders(data)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>
          {orders}
        </div>
      </header>
    </div>
  );
}

export default App;
