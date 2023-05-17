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
      </Routes>
    </div>
  );
}

export default App;
