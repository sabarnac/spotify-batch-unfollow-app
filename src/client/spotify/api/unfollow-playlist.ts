import { Playlist } from "../model";
import sendRequest from "../util/send-request";

const unfollowPlaylist = async (playlist: Playlist) =>
  await sendRequest(
    ["playlists", playlist.id, "followers"],
    undefined,
    null,
    { "Content-Type": "application/json" },
    "DELETE",
  );

export default unfollowPlaylist;
