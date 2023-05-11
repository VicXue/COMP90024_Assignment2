import React from "react";

import VictoriaMap from "./VictoriaMap/VictoriaMap";
import AuMap from "./AuMap/AuMap";
import SUDOLineChart from "./SUDOLineChart/LineChart";
import Mental from "./MasPieChart/Mental";
import NonMental from "./MasPieChart/NonMental";
import TwBarChart from "./TwitterBarChart/TwBarChart";

function PageTwo() {
  return (
    <div>
      <SUDOLineChart />
      <VictoriaMap />
    </div>
  );
}

export default PageTwo;
