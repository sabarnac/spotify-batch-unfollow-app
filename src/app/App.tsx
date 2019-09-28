import React from "react"
import "./App.css"
import { useOAuth2Token } from "react-oauth2-hook"
import { SpotifyProvider, InitialContext } from "./SpotifyContext"
import UserInfo from "./user/UserInfo"
import { SPOTIFY_CLIENT_ID } from "../constants"

const App: React.FC = (): JSX.Element => {
  const [token, getToken] = useOAuth2Token({
    authorizeUrl: "https://accounts.spotify.com/authorize",
    scope: ["user-library-read"],
    clientID: SPOTIFY_CLIENT_ID,
    redirectUri: document.location.href.replace(/\/$/, "") + "/callback",
  })

  return !token ? (
    <button onClick={getToken}>Login with Spotify</button>
  ) : (
    <SpotifyProvider value={{ ...InitialContext, token: token }}>
      <UserInfo />
    </SpotifyProvider>
  )
}

export default App
