import { isNullOrUndefined } from "../../../util";
import { FollowedShowsList } from "../model";
import { BATCH_SIZE } from "./config";
import getUserShowFollows from "./get-user-show-follows";

const getAllUserShowFollows = async function* () {
  let next = undefined;

  do {
    const results: FollowedShowsList = await getUserShowFollows(BATCH_SIZE, next);
    yield results.items.map(({ show }) => show);

    next = results.next;
  } while (!isNullOrUndefined(next));
};

export default getAllUserShowFollows;
