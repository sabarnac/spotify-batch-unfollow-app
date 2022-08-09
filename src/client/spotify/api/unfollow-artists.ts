import { Artist } from "../model";
import sendRequest from "../util/send-request";

const unfollowArtists = async (artists: Artist[]) =>
  await sendRequest(
    ["me", "following"],
    {
      type: "artist",
    },
    JSON.stringify({
      ids: artists.map((artist: Artist): string => artist.id),
    }),
    { "Content-Type": "application/json" },
    "DELETE",
  );

export default unfollowArtists;
