import { UserInfo } from "../model";
import { getJsonResponse } from "../util/response-parser";
import sendRequest from "../util/send-request";

export default async () => getJsonResponse<UserInfo>(await sendRequest(["me"]));
