import React from "react";

import VictoriaMap from "./VictoriaMap/VictoriaMap";
import SUDOLineChart from "./SUDOLineChart/LineChart";


function PageTwo() {
  return (
    <div className="page-two-container">
      <VictoriaMap />
      <SUDOLineChart />
    </div>
  );
}

export default PageTwo;
