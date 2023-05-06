import arrayChunk from "../../../util/array-chunk";
import { Show, UnfollowChunkedFailureResult, UnfollowChunkedSuccessResult } from "../model";
import { BATCH_SIZE } from "./config";
import unfollowShows from "./unfollow-shows";

const unfollowShowsChunked = async function* (shows: Show[]) {
  for (const chunkedShows of arrayChunk(shows, BATCH_SIZE)) {
    try {
      await unfollowShows(chunkedShows);
      yield {
        succeeded: chunkedShows,
      } as UnfollowChunkedSuccessResult<Show>;
    } catch (error) {
      yield {
        failed: chunkedShows,
        error: error,
      } as UnfollowChunkedFailureResult<Show>;
    }
  }
};

export default unfollowShowsChunked;
