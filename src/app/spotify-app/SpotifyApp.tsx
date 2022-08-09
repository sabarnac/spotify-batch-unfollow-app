import React, { lazy, Suspense, useEffect } from "react";
import { useOAuth2Token } from "react-oauth2-hook";

import SpotifyConfig from "../../client/spotify/api/config";
import { SPOTIFY_CLIENT_ID } from "../../constants";
import useForceUpdate from "../../util/use-force-update";
import Loading from "../partials/loading/Loading";
import Login from "./login/Login";

const UserInfo = lazy(() => import("./user/UserInfo"));
const UnfollowArtists = lazy(() => import("./manage/UnfollowArtists"));

const SpotifyApp = (): JSX.Element => {
  const [token, getToken, setToken] = useOAuth2Token({
    authorizeUrl: "https://accounts.spotify.com/authorize",
    scope: ["user-follow-read", "user-follow-modify"],
    clientID: SPOTIFY_CLIENT_ID,
    redirectUri: document.location.href.replace(/\/$/, "") + "/callback",
  });
  const forceUpdate = useForceUpdate();
  SpotifyConfig.resetToken = () => setToken("");

  useEffect(() => {
    SpotifyConfig.userToken = !!token ? token : undefined;
    forceUpdate();
  }, [token, forceUpdate]);

  return !token ? (
    <Login onClick={getToken} />
  ) : (
    <Suspense fallback={<Loading />}>
      <UserInfo />
      <Suspense fallback={<Loading />}>
        <UnfollowArtists />
      </Suspense>
    </Suspense>
  );
};

export default SpotifyApp;
