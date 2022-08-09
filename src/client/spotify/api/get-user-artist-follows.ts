import { Follows } from "../model";
import { getJsonResponse } from "../util/response-parser";
import sendRequest from "../util/send-request";

const getUserArtistsFollows = async (limit: number, after?: string) =>
  (
    await getJsonResponse<Follows>(
      await sendRequest(["me", "following"], {
        type: "artist",
        limit,
        after,
      }),
    )
  ).artists;

export default getUserArtistsFollows;
