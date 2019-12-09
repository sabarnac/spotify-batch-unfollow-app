import { FollowedArtists } from "./model";
import getUserArtistFollows from "./getUserArtistFollows";
import { BATCH_SIZE } from "./util/config";

export default async function*() {
  let after = undefined;

  do {
    const results: FollowedArtists = await getUserArtistFollows(
      BATCH_SIZE,
      after,
    );
    yield results.items;

    after = results.cursors.after;
  } while (after !== undefined && after !== null);
}
