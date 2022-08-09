import "./Loading.css";

import React from "react";
import { ClipLoader } from "react-spinners";

interface LoadingProps {
  text?: string;
  color?: string;
}

const Loading = ({ text, color = "#d8f3e0" }: LoadingProps) => (
  <div className="loading">
    <ClipLoader size="3rem" color={color} />
    {text && <div>{text}</div>}
  </div>
);

export default Loading;
