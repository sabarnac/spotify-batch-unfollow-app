import "./SpotifyApp.css";

import { lazy, Suspense, useCallback, useMemo } from "react";

import SpotifyConfig from "../../client/spotify/api/config";
import { SPOTIFY_AUTHORIZE_URL, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URL } from "../../constants";
import Loading from "../partials/loading/Loading";
import Login from "./login/Login";
import { SpotifyPermissionOptions, SPOTIFY_PERMISSION_OPTIONS_MAP } from "../../client/spotify/model";
import PermissionOptionsStore from "./store/AppContext";
import useLocalStorageState from "use-local-storage-state";
import { useOauth2Pkce } from "../../util/use-oauth-pkce";

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
    () => [...new Set(permissionOptions.flatMap((option) => SPOTIFY_PERMISSION_OPTIONS_MAP[option]))],
    [permissionOptions],
  );

  const { data, loading, error, start, logout } = useOauth2Pkce({
    authorizeUrl: SPOTIFY_AUTHORIZE_URL,
    scope: spotifyPermissionScopes.join(" "),
    clientId: SPOTIFY_CLIENT_ID,
    redirectUri: SPOTIFY_REDIRECT_URL,
  });

  SpotifyConfig.resetToken = () => {
    logout();
  };

  SpotifyConfig.userToken = data?.accessToken;

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

  if (error) {
    console.error(`Failed logging in due to error: ${error}`);
  }

  return loading ? (
    <Loading text="Logging in" />
  ) : error ? (
    <>
      <div className="login-error">
        <div className="error">
          {error === ERROR_CODES.ACCESS_DENIED
            ? "Could not log in as access was denied during authorization process"
            : "Could not log in due to an unknown error"}
        </div>
      </div>
      <div className="login-error">
        <div className="warning">Try again below</div>
      </div>
      <Login
        onClick={start}
        permissionOptions={permissionOptions}
        addPermissionOption={addPermissionOption}
        removePermissionOption={removePermissionOption}
      />
    </>
  ) : !data?.accessToken ? (
    <Login
      onClick={start}
      permissionOptions={permissionOptions}
      addPermissionOption={addPermissionOption}
      removePermissionOption={removePermissionOption}
    />
  ) : !SpotifyConfig.userToken ? (
    <Loading text="Logging in" />
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
