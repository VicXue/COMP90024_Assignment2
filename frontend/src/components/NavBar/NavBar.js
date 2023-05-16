import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <header>
      <div className="team-name">COMP90024 CCC Team 3</div>
      <div className="display-options">
        <Link className="option" to={"/"}>
          Page Zero
        </Link>
        <Link className="option" to={"/PageOne"}>
          Page One
        </Link>
        <Link className="option" to={"/PageTwo"}>
          Page Two
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
