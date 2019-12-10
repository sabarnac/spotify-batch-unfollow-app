import React from "react";
import "./Loading.css";
import { ClipLoader } from "react-spinners";

interface LoadingProps {
  text?: string;
}

export default ({ text }: LoadingProps) => (
  <div className="loading">
    <ClipLoader sizeUnit={"rem"} size={3} />
    {text && <div>{text}</div>}
  </div>
);
