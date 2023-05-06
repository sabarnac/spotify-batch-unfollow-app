import { FollowedUser } from "../model";
import sendRequest from "../util/send-request";

const unfollowUsers = async (users: FollowedUser[]) =>
  await sendRequest(
    ["me", "following"],
    {
      type: "user",
    },
    JSON.stringify({
      ids: users.map((user: FollowedUser): string => user.id),
    }),
    { "Content-Type": "application/json" },
    "DELETE",
  );

export default unfollowUsers;
