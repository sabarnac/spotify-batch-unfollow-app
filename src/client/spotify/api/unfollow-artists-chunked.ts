import arrayChunk from "../../../util/array-chunk";
import { Artist, UnfollowChunkedFailureResult, UnfollowChunkedSuccessResult } from "../model";
import { BATCH_SIZE } from "./config";
import unfollowArtists from "./unfollow-artists";

const unfollowArtistsChunked = async function* (artists: Artist[]) {
  for (const chunkedArtists of arrayChunk(artists, BATCH_SIZE)) {
    try {
      await unfollowArtists(chunkedArtists);
      yield {
        succeeded: chunkedArtists,
      } as UnfollowChunkedSuccessResult<Artist>;
    } catch (error) {
      yield {
        failed: chunkedArtists,
        error: error,
      } as UnfollowChunkedFailureResult<Artist>;
    }
  }
};

export default unfollowArtistsChunked;
