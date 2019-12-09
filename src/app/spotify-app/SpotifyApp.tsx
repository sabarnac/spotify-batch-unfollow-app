import React, { useEffect } from "react";
import { useOAuth2Token } from "react-oauth2-hook";
import UserInfo from "./user/UserInfo";
import { SPOTIFY_CLIENT_ID } from "../../constants";
import Login from "./login/Login";
import SpotifyConfig from "../../client/spotify/util/config";
import useForceUpdate from "../../util/useForceUpdate";

export default (): JSX.Element => {
  const [token, getToken, setToken] = useOAuth2Token({
    authorizeUrl: "https://accounts.spotify.com/authorize",
    scope: ["user-read-email", "user-follow-read", "user-follow-modify"],
    clientID: SPOTIFY_CLIENT_ID,
    redirectUri: document.location.href.replace(/\/$/, "") + "/callback",
  });
  const forceUpdate = useForceUpdate();
  SpotifyConfig.resetToken = () => setToken("");

  useEffect(() => {
    SpotifyConfig.userToken = !!token ? token : undefined;
    forceUpdate();
  }, [token, forceUpdate]);

  return !SpotifyConfig.userToken ? <Login onClick={getToken} /> : <UserInfo />;
};
