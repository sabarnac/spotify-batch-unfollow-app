import "./Loading.css";

import React from "react";
import { ClipLoader } from "react-spinners";

interface LoadingProps {
  text?: string;
  color?: string;
}

export default ({ text, color = "#d8f3e0" }: LoadingProps) => (
  <div className="loading">
    <ClipLoader sizeUnit={"rem"} size={3} color={color} />
    {text && <div>{text}</div>}
  </div>
);
