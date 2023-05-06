import { isNullOrUndefined } from "../../../util";
import { FollowedShowsList } from "../model";
import { BATCH_SIZE } from "./config";
import getUserShowFollows from "./get-user-show-follows";

const getAllUserShowFollows = async function* () {
  let offset = undefined;

  do {
    const results: FollowedShowsList = await getUserShowFollows(BATCH_SIZE, offset);
    yield results.items.map(({ show }) => show);

    offset = results.offset + results.limit;
    if (offset >= results.total) {
      offset = undefined;
    }
  } while (!isNullOrUndefined(offset));
};

export default getAllUserShowFollows;
