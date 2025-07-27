import { AlbumFollowsResponse } from "../model";
import { getJsonResponse } from "../util/response-parser";
import sendRequest from "../util/send-request";

const getUserAlbumFollows = async (limit: number, offset?: number) =>
  await getJsonResponse<AlbumFollowsResponse>(
    await sendRequest(["me", "albums"], {
      limit,
      offset,
    }),
  );

export default getUserAlbumFollows;
