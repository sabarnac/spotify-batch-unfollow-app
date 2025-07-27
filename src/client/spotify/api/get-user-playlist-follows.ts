import { PlaylistFollowsResponse, UserInfo } from "../model";
import { getJsonResponse } from "../util/response-parser";
import sendRequest from "../util/send-request";

const getUserPlaylistFollows = async (user: UserInfo, limit: number, offset?: number) =>
  await getJsonResponse<PlaylistFollowsResponse>(
    await sendRequest(["users", user.id, "playlists"], {
      limit,
      offset,
    }),
  );

export default getUserPlaylistFollows;
