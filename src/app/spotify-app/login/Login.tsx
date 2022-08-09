import "./Login.css";

import React from "react";
import { getToken } from "react-oauth2-hook";

interface LoginProps {
  onClick: getToken;
}

const Login = ({ onClick }: LoginProps): JSX.Element => (
  <div className="login">
    <button className="success" onClick={onClick}>
      Login with Spotify
    </button>
  </div>
);

export default Login;
