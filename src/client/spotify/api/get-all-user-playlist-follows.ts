import { isNullOrUndefined } from "../../../util";
import { FollowedPlaylistsList } from "../model";
import { BATCH_SIZE } from "./config";
import getCurrentUser from "./get-current-user";
import getUserPlaylistFollows from "./get-user-playlist-follows";
const getAllUserPlaylistFollows = async function* () {
  const currentUser = await getCurrentUser();
  let offset = undefined;

  do {
    const results: FollowedPlaylistsList = await getUserPlaylistFollows(currentUser, BATCH_SIZE, offset);
    yield results.items.filter(({ owner: { id: playlistOwnerId } }) => playlistOwnerId !== currentUser.id);
    // yield results.items;

    offset = results.offset + results.limit;
    if (offset >= results.total) {
      offset = undefined;
    }
  } while (!isNullOrUndefined(offset));
};

export default getAllUserPlaylistFollows;
