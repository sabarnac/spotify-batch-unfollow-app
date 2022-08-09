import { UserInfo } from "../model";
import { getJsonResponse } from "../util/response-parser";
import sendRequest from "../util/send-request";

const getCurrentUser = async () => getJsonResponse<UserInfo>(await sendRequest(["me"]));

export default getCurrentUser;
