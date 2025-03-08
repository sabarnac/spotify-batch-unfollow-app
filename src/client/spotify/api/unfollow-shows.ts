import { Show } from "../model";
import sendRequest from "../util/send-request";

const unfollowShows = async (shows: Show[]) =>
  await sendRequest(
    ["me", "shows"],
    {
      ids: shows.map((show: Show): string => show.id).join(","),
    },
    null,
    { "Content-Type": "application/json" },
    "DELETE",
  );

export default unfollowShows;
