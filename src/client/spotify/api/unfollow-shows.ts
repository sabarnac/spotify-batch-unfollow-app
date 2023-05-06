import { Show } from "../model";
import sendRequest from "../util/send-request";

const unfollowShows = async (shows: Show[]) =>
  await sendRequest(
    ["me", "shows"],
    {},
    JSON.stringify({
      ids: shows.map((show: Show): string => show.id),
    }),
    { "Content-Type": "application/json" },
    "DELETE",
  );

export default unfollowShows;
