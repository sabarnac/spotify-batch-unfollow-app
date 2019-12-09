import { UserInfo } from "./model";
import sendRequest from "./util/sendRequest";
import { getJsonResponse } from "./util/response-parser";

export default async () => getJsonResponse<UserInfo>(await sendRequest(["me"]));
