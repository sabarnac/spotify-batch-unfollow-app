import { isNullOrUndefined } from "../../../util";
import { FollowedAlbumsList } from "../model";
import { BATCH_SIZE } from "./config";
import getUserAlbumFollows from "./get-user-album-follows";
const getAllUserAlbumFollows = async function* () {
  let offset = undefined;

  do {
    const results: FollowedAlbumsList = await getUserAlbumFollows(BATCH_SIZE, offset);
    yield results.items.map(({ album }) => album);

    offset = results.offset + results.limit;
    if (offset >= results.total) {
      offset = undefined;
    }
  } while (!isNullOrUndefined(offset));
};

export default getAllUserAlbumFollows;
