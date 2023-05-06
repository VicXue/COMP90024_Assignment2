// import logo from './logo.svg';
// import Home from "./components/GoogleMap/GoogleMap";
import Map from "./components/Map/Map";
import LineChart from "./components/Line/Line";
import React, { useEffect, useState } from "react";

import "./App.css";

import JSONData from "./foo/foo.json";

function App() {
  // This is how you would retrieve data from our backend, keep this as refrence
  const [orders, setOrders] = useState([]);

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

  useEffect(() => {
    const placeNameList = [];

    for (let j = 0; j < JSONData.length; j++) {
      let tempPlaceName = JSONData[j].place_full_name;
      placeNameList.push(tempPlaceName);
    }

    setOrders(placeNameList);
  }, []);

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
      {/* <Home orders={orders} /> */}
      {/* <Map /> */}
      <LineChart />
    </div>
  );
}

export default App;
