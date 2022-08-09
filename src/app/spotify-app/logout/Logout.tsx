import "./Logout.css";

import React from "react";

import SpotifyConfig from "../../../client/spotify/api/config";

const logoutFromApp = () => {
  SpotifyConfig.resetToken();
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload();
};

const Logout = (): JSX.Element => (
  <div className="logout">
    <button className="warning" onClick={logoutFromApp}>
      Logout
    </button>
  </div>
);

export default Logout;
