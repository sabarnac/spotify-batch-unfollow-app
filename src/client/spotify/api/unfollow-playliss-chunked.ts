import { Playlist, UnfollowChunkedFailureResult, UnfollowChunkedSuccessResult } from "../model";
import unfollowPlaylist from "./unfollow-playlist";

const unfollowPlaylistsChunked = async function* (playlists: Playlist[]) {
  for (const playlist of playlists) {
    try {
      await unfollowPlaylist(playlist);
      yield {
        succeeded: [playlist],
      } as UnfollowChunkedSuccessResult<Playlist>;
    } catch (error) {
      yield {
        failed: [playlist],
        error: error,
      } as UnfollowChunkedFailureResult<Playlist>;
    }
  }
};

export default unfollowPlaylistsChunked;
