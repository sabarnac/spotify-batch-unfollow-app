import { Artist } from "../model";
import sendRequest from "../util/send-request";

export default async (artists: Artist[]) => {
  sendRequest(
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
};
