// import logo from './logo.svg';
import NavBar from "./components/NavBar/NavBar";
import VictoriaMap from "./components/VictoriaMap/VictoriaMap";
import AuMap from "./components/AuMap/AuMap";
import SUDOLineChart from "./components/SUDOLineChart/LineChart";
import Mental from "./components/MasPieChart/Mental";
import NonMental from "./components/MasPieChart/NonMental";
import TwBarChart from "./components/TwitterBarChart/TwBarChart";

import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

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
      <NavBar />
      <Routes>
        <Route path="/" element={<VictoriaMap />} />
        <Route path="/AuMap" element={<AuMap />} />
        <Route path="/SUDOLineChart" element={<SUDOLineChart />} />
        <Route path="/TwBarChart" element={<TwBarChart />} />
        <Route path="/Mental" element={<Mental />} />
        <Route path="/NonMental" element={<NonMental />} />
      </Routes>
    </div>
  );
}

export default App;
