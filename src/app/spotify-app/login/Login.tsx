import React from "react"
import "./Login.css"
import { getToken } from "react-oauth2-hook"

interface LoginProps {
  onClick: getToken
}

export default ({ onClick }: LoginProps): JSX.Element => (
  <div className="site login">
    <button onClick={onClick}>Login with Spotify</button>
  </div>
)
