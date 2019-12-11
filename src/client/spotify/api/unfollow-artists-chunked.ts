import arrayChunk from "../../../util/array-chunk";
import { Artist } from "../model";
import { BATCH_SIZE } from "../util/config";
import unfollowArtists from "./unfollow-artists";

export default async function*(artists: Artist[]) {
  for (const chunkedArtists of arrayChunk(artists, BATCH_SIZE)) {
    try {
      unfollowArtists(chunkedArtists);
      yield {
        failedArtists: [],
      };
    } catch (error) {
      yield {
        failedArtists: chunkedArtists,
        error,
      };
    }
  }
}
