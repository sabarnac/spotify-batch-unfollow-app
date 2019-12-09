import { Follows } from "./model";
import { getJsonResponse } from "./util/response-parser";
import sendRequest from "./util/sendRequest";

export default async (limit: number, after?: string) =>
  (
    await getJsonResponse<Follows>(
      await sendRequest(["me", "following"], {
        type: "artist",
        limit,
        after,
      }),
    )
  ).artists;
