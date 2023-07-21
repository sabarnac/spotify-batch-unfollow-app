import "./Login.css";

import { SpotifyPermissionOptions } from "../../../client/spotify/model";
import Checkbox from "../../partials/checkbox/Checkbox";

interface LoginProps {
  onClick: () => void;
  permissionOptions: SpotifyPermissionOptions[];
  addPermissionOption: (permissionOption: SpotifyPermissionOptions) => void;
  removePermissionOption: (permissionOption: SpotifyPermissionOptions) => void;
}

const Login = ({
  permissionOptions,
  addPermissionOption,
  removePermissionOption,
  onClick,
}: LoginProps): JSX.Element => (
  <div className="login">
    <div>
      <h3>Permissions to allow</h3>
      <div className="permission-options">
        <div className="unfollow-artists-users">
          <label>
            <Checkbox
              checked={permissionOptions.includes("artists-users")}
              disabled={
                permissionOptions.includes("artists-users") &&
                permissionOptions.length === 1 &&
                !permissionOptions.includes("read-saved-tracks-episodes")
              }
              onChange={(isChecked) =>
                isChecked ? addPermissionOption("artists-users") : removePermissionOption("artists-users")
              }
            />
            <span>Read/Modify Followed Artists/Users</span>
          </label>
        </div>
        <div className="unfollow-shows">
          <label>
            <Checkbox
              checked={permissionOptions.includes("shows")}
              disabled={
                permissionOptions.includes("shows") &&
                permissionOptions.length === 1 &&
                !permissionOptions.includes("read-saved-tracks-episodes")
              }
              onChange={(isChecked) => (isChecked ? addPermissionOption("shows") : removePermissionOption("shows"))}
            />
            <span>Read/Modify Followed Shows (Podcasts)</span>
          </label>
        </div>
        <div className="read-saved-tracks">
          <label>
            <Checkbox
              checked={permissionOptions.includes("read-saved-tracks-episodes") || permissionOptions.includes("shows")}
              disabled={permissionOptions.includes("shows")}
              onChange={(isChecked) =>
                isChecked
                  ? addPermissionOption("read-saved-tracks-episodes")
                  : removePermissionOption("read-saved-tracks-episodes")
              }
            />
            <span>Read Saved Tracks (Used For Filtering)</span>
          </label>
        </div>
      </div>
    </div>
    <button className="success" onClick={onClick}>
      Login with Spotify
    </button>
  </div>
);

export default Login;
