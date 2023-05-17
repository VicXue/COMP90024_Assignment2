import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <header>
      <h3 className="team-name">COMP90024 CCC Team 3</h3>
      <div className="display-options">
        <Link className="option" to={"/"}>
          Overview
        </Link>
        <Link className="option" to={"/PageOne"}>
          Social Media Data Analysis
        </Link>
        <Link className="option" to={"/PageTwo"}>
          Official Data Analysis
        </Link>
        {/* <Link className="option" to={"/VictoriaMap"}>
          VictoriaMap
        </Link>
        <Link className="option" to={"/AuMap"}>
          AuMap
        </Link>
        <Link className="option" to={"/SUDOLineChart"}>
          SUDOLineChart
        </Link>
        <Link className="option" to={"/TwBarChart"}>
          TwBarChart
        </Link>
        <Link className="option" to={"/Mental"}>
          Mental
        </Link>
        <Link className="option" to={"/NonMental"}>
          NonMental
        </Link> */}
      </div>
    </header>
  );
}

export default NavBar;
