import { UserFollowsResponse } from "../model";
import { getJsonResponse } from "../util/response-parser";
import sendRequest from "../util/send-request";

const getUserArtistsFollows = async (type: "artist" | "user", limit: number, after?: string) => {
  const results = await getJsonResponse<UserFollowsResponse>(
    await sendRequest(["me", "following"], {
      type,
      limit,
      after,
    }),
  );
  return type === "artist" ? results.artists : results.users;
};

export default getUserArtistsFollows;
