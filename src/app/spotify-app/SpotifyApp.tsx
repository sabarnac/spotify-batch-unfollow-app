import "./SpotifyApp.css";

import { lazy, Suspense, useCallback, useEffect, useMemo } from "react";
import { useOAuth2 } from "@tasoskakour/react-use-oauth2";

import SpotifyConfig from "../../client/spotify/api/config";
import { SPOTIFY_CLIENT_ID } from "../../constants";
import useForceUpdate from "../../util/use-force-update";
import Loading from "../partials/loading/Loading";
import Login from "./login/Login";
import { SpotifyPermissionOptions, SPOTIFY_PERMISSION_OPTIONS_MAP } from "../../client/spotify/model";
import PermissionOptionsStore from "./store/AppContext";
import useLocalStorageState from "use-local-storage-state";

const UserInfo = lazy(() => import("./user/UserInfo"));
const UnfollowArtists = lazy(() => import("./manage/UnfollowFollows"));
const Logout = lazy(() => import("./logout/Logout"));

const enum ERROR_CODES {
  ACCESS_DENIED = "access_denied",
}

const SpotifyApp = (): JSX.Element => {
  const [permissionOptions, setPermissionOptions] = useLocalStorageState<SpotifyPermissionOptions[]>("permissions", {
    defaultValue: ["artists-users"],
  });
  const permissionsOptionsSet = useMemo(() => new Set(permissionOptions), [permissionOptions]);

  const spotifyPermissionScopes = useMemo(
    () => permissionOptions.flatMap((option) => SPOTIFY_PERMISSION_OPTIONS_MAP[option]),
    [permissionOptions],
  );

  const { data, loading, error, getAuth, logout } = useOAuth2({
    authorizeUrl: "https://accounts.spotify.com/authorize",
    scope: spotifyPermissionScopes.join(","),
    clientId: SPOTIFY_CLIENT_ID,
    redirectUri: document.location.href.replace(/\/$/, "") + "/callback",
    responseType: "token",
  });

  const forceUpdate = useForceUpdate();
  SpotifyConfig.resetToken = () => {
    logout();
    forceUpdate();
  };

  useEffect(() => {
    if (!!data?.access_token) {
      SpotifyConfig.userToken = data.access_token;
    } else {
      SpotifyConfig.userToken = undefined;
    }
    forceUpdate();
  }, [data, forceUpdate]);

  const addPermissionOption = useCallback(
    (permissionOption: SpotifyPermissionOptions) =>
      setPermissionOptions((oldPermissionOptions) => [...new Set([...oldPermissionOptions, permissionOption])]),
    [setPermissionOptions],
  );
  const removePermissionOption = useCallback(
    (permissionOption: SpotifyPermissionOptions) =>
      setPermissionOptions((oldPermissionOptions) => [
        ...new Set(oldPermissionOptions.filter((permission) => permission !== permissionOption)),
      ]),
    [setPermissionOptions],
  );

  return loading ? (
    <Loading text="Logging in" />
  ) : error ? (
    <div className="login-error">
      <div className="error">
        {error === ERROR_CODES.ACCESS_DENIED
          ? "Could not log in as access was denied during authorization process"
          : "Could not log in due to an unknown error"}
      </div>
    </div>
  ) : !data?.access_token ? (
    <Login
      onClick={getAuth}
      permissionOptions={permissionOptions}
      addPermissionOption={addPermissionOption}
      removePermissionOption={removePermissionOption}
    />
  ) : (
    <PermissionOptionsStore.Provider value={{ permissions: permissionsOptionsSet, logout }}>
      <Suspense fallback={<Loading />}>
        <UserInfo />
        <Suspense fallback={<Loading />}>
          <UnfollowArtists />
          <Logout />
        </Suspense>
      </Suspense>
    </PermissionOptionsStore.Provider>
  );
};

export default SpotifyApp;
