import arrayChunk from "../../../util/array-chunk";
import { FollowedUser, UnfollowChunkedFailureResult, UnfollowChunkedSuccessResult } from "../model";
import { BATCH_SIZE } from "./config";
import unfollowUsers from "./unfollow-users";

const unfollowUsersChunked = async function* (users: FollowedUser[]) {
  for (const chunkedUsers of arrayChunk(users, BATCH_SIZE)) {
    try {
      await unfollowUsers(chunkedUsers);
      yield {
        succeeded: chunkedUsers,
      } as UnfollowChunkedSuccessResult<FollowedUser>;
    } catch (error) {
      yield {
        failed: chunkedUsers,
        error: error,
      } as UnfollowChunkedFailureResult<FollowedUser>;
    }
  }
};

export default unfollowUsersChunked;
