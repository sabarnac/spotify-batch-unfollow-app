import "./ListLegend.css";

import React from "react";

const ListLegend = (): JSX.Element => (
  <div className="list-legend">
    <div className="item normal">
      <div className="color"></div>
      <div className="text">Not Selected</div>
    </div>
    <div className="item selected">
      <div className="color"></div>
      <div className="text">Selected</div>
    </div>
  </div>
);

export default ListLegend;
