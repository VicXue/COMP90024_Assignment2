import React from "react";

import AuMap from "./AuMap/AuMap";
import Mental from "./MasPieChart/Mental";
import NonMental from "./MasPieChart/NonMental";
import TwBarChart from "./TwitterBarChart/TwBarChart";

function PageOne() {
  return (
    <div>
      <AuMap />
      {/* <TwBarChart /> */}
      <Mental />
      <NonMental />
    </div>
  );
}

export default PageOne;
