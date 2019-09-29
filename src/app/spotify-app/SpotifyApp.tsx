import React, { useState } from "react"
import { useOAuth2Token } from "react-oauth2-hook"
import { SpotifyProvider, InitialContext } from "./SpotifyContext"
import UserInfo from "./user/UserInfo"
import { SPOTIFY_CLIENT_ID } from "../../constants"
import Login from "./login/Login"
import { ReactState } from "../../react-app-env"

export default (): JSX.Element => {
  const [token, getToken, setToken] = useOAuth2Token({
    authorizeUrl: "https://accounts.spotify.com/authorize",
    scope: ["user-read-email", "user-follow-read", "user-follow-modify"],
    clientID: SPOTIFY_CLIENT_ID,
    redirectUri: document.location.href.replace(/\/$/, "") + "/callback",
  })

  const [isLoggedIn, setIsLoggedIn]: ReactState<boolean> = useState<boolean>(
    false,
  )

  return !token ? (
    <Login onClick={getToken} />
  ) : (
    <SpotifyProvider
      value={{
        ...InitialContext,
        token: token,
        resetToken: () => setToken(""),
      }}
    >
      <UserInfo onLoginCheck={setIsLoggedIn} />
    </SpotifyProvider>
  )
}
