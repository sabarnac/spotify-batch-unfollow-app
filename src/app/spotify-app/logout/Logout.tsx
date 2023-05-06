import "./Logout.css";

import React, { useContext } from "react";

import AppContext from "../store/AppContext";

const Logout = (): JSX.Element => {
  const { logout } = useContext(AppContext);

  return (
    <div className="logout">
      <button className="warning" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
