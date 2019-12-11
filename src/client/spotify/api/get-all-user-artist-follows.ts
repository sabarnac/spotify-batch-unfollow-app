import { FollowedArtists } from "../model";
import { BATCH_SIZE } from "./config";
import getUserArtistFollows from "./get-user-artist-follows";

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
