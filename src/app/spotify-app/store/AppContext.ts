import { createContext } from "react";
import { SpotifyPermissionOptions } from "../../../client/spotify/model";

export interface AppContextDetails {
  permissions: Set<SpotifyPermissionOptions>;
  logout: () => void;
}

const AppContext = createContext<AppContextDetails>({
  permissions: new Set(),
  logout: () => {},
});

export default AppContext;
