import { ShowFollowsResponse } from "../model";
import { getJsonResponse } from "../util/response-parser";
import sendRequest from "../util/send-request";

const getUserShowFollows = async (limit: number, offset?: number) =>
  await getJsonResponse<ShowFollowsResponse>(
    await sendRequest(["me", "shows"], {
      limit,
      offset,
    }),
  );

export default getUserShowFollows;
