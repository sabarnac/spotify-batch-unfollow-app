import { Album } from "../model";
import sendRequest from "../util/send-request";

const unfollowAlbums = async (albums: Album[]) =>
  await sendRequest(
    ["me", "albums"],
    {
      ids: albums.map((album: Album): string => album.id).join(","),
    },
    null,
    { "Content-Type": "application/json" },
    "DELETE",
  );

export default unfollowAlbums;
