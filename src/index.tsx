import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Loading from "./app/partials/loading/Loading";

const App = lazy(() => import("./app/App"));

ReactDOM.render(
  <Suspense fallback={<Loading />}>
    <App />
  </Suspense>,
  document.getElementById("root"),
);
