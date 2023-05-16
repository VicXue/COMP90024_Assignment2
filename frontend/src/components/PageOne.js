import React from "react";

import AuMap from "./AuMap/AuMap";
import Mental from "./MasPieChart/Mental";
import NonMental from "./MasPieChart/NonMental";

function PageOne() {
  return (
    <div className="page-one-container">
      <div className="page-one-left">
        <AuMap />
      </div>
      <div className="page-one-right">
        <Mental />
        <NonMental />
      </div>
    </div>
  );
}

export default PageOne;
