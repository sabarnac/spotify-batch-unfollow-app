import { Artist } from "../model";
import sendRequest from "../util/send-request";

const unfollowArtists = async (artists: Artist[]) =>
  await sendRequest(
    ["me", "following"],
    {
      type: "artist",
      ids: artists.map((artist: Artist): string => artist.id).join(","),
    },
    null,
    { "Content-Type": "application/json" },
    "DELETE",
  );

export default unfollowArtists;
