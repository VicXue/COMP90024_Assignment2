// import logo from './logo.svg';
import Navbar from "./components/NavBar/NavBar";
import VictoriaMap from "./components/VictoriaMap/VictoriaMap";
import AuMap from "./components/AuMap/AuMap";
import SUDOLineChart from "./components/SUDOLineChart/LineChart";
import TwBarChart from "./components/TwitterBarChart/TwBarChart";

import React, { useEffect, useState } from "react";

import "./App.css";

function App() {
  // This is how you would retrieve data from our backend, keep this as refrence

  // const fetchData = () => {
  //   fetch(`http://${process.env.REACT_APP_BACKEND_API_HOST}:8080/api/v1/example/fetchdocs`)
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(data => {
  //       setOrders(data)
  //     })
  // }

  // useEffect(() => {
  //   fetchData()
  // }, [])

  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //     <div>
    //       {orders}
    //     </div>
    //   </header>
    // </div>

    <div>
      <AuMap />
      {/* <VictoriaMap /> */}
      {/* <SUDOLineChart /> */}
      {/* <TwBarChart /> */}
    </div>
  );
}

export default App;
