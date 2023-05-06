import { isNullOrUndefined } from "../../../util";
import { Artist, FollowedArtistsList, FollowedUser, FollowedUsersList, UserInfo } from "../model";
import { BATCH_SIZE } from "./config";
import getUserArtistFollows from "./get-user-artist-follows";

const isUserInfo = (item: Artist | UserInfo): item is UserInfo => item.type === "user";

const getAllUserArtistFollows = async function* (type: "artist" | "user") {
  let after = undefined;

  do {
    const results: FollowedArtistsList | FollowedUsersList = await getUserArtistFollows(type, BATCH_SIZE, after);

    yield results.items.map((item) =>
      !isUserInfo(item) ? item : ({ ...item, name: item.display_name } as FollowedUser),
    );

    after = results.cursors.after;
  } while (!isNullOrUndefined(after));
};

export default getAllUserArtistFollows;
