import arrayChunk from "../../../util/array-chunk";
import { Artist } from "../model";
import { BATCH_SIZE } from "./config";
import unfollowArtists from "./unfollow-artists";

export default async function*(artists: Artist[]) {
  for (const chunkedArtists of arrayChunk(artists, BATCH_SIZE)) {
    try {
      await unfollowArtists(chunkedArtists);
      yield {
        failedArtists: [] as Artist[],
        succeededArtists: chunkedArtists,
      };
    } catch (error) {
      yield {
        failedArtists: chunkedArtists,
        succeededArtists: [] as Artist[],
        error,
      };
    }
  }
}
