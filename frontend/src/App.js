// import logo from './logo.svg';
import PageOne from "./components/PageOne";
import PageTwo from "./components/PageTwo";
import PageZero from "./components/PageZero";
import NavBar from "./components/NavBar/NavBar";

import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<PageZero />} />
        <Route path="/PageOne" element={<PageOne />} />
        <Route path="/PageTwo" element={<PageTwo />} />
        {/* <Route path="/VictoriaMap" element={<VictoriaMap />} />
        <Route path="/AuMap" element={<AuMap />} />
        <Route path="/SUDOLineChart" element={<SUDOLineChart />} />
        <Route path="/TwBarChart" element={<TwBarChart />} />
        <Route path="/Mental" element={<Mental />} />
        <Route path="/NonMental" element={<NonMental />} /> */}
      </Routes>
    </div>
  );
}

export default App;
