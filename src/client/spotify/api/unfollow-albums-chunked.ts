import arrayChunk from "../../../util/array-chunk";
import { Album, UnfollowChunkedFailureResult, UnfollowChunkedSuccessResult } from "../model";
import { BATCH_SIZE } from "./config";
import unfollowAlbums from "./unfollow-albums";

const unfollowAlbumsChunked = async function* (albums: Album[]) {
  for (const chunkedAlbums of arrayChunk(albums, BATCH_SIZE)) {
    try {
      await unfollowAlbums(chunkedAlbums);
      yield {
        succeeded: chunkedAlbums,
      } as UnfollowChunkedSuccessResult<Album>;
    } catch (error) {
      yield {
        failed: chunkedAlbums,
        error: error,
      } as UnfollowChunkedFailureResult<Album>;
    }
  }
};

export default unfollowAlbumsChunked;
