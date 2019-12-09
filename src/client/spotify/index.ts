import useCall from "../../util/useCall";
import getCurrentUser from "./getCurrentUser";
import getUserArtistFollows from "./getUserArtistFollows";
import getAllUserArtistFollows from "./getAllUserArtistFollows";
import useStreamCall from "../../util/useStreamCall";
import unfollowArtists from "./unfollowArtists";
import { Artist } from "./model";
import unfollowArtistsChunked from "./unfollowArtistsChunked";

export const useGetCurrentUser = (runNow: boolean = true) => {
  return useCall(getCurrentUser, runNow);
};

export const useGetUserArtistFollows = (
  limit: number = 50,
  runNow: boolean = true,
) => {
  return useCall(getUserArtistFollows, runNow, limit);
};

export const useGetAllUserArtistFollows = (runNow: boolean = true) => {
  return useStreamCall(getAllUserArtistFollows, runNow);
};

export const useUnfollowArtists = (
  artists: Artist[],
  runNow: boolean = true,
) => {
  return useCall(unfollowArtists, runNow, artists);
};

export const useUnfollowArtistsChunked = (
  artists: Artist[],
  runNow: boolean = true,
) => {
  return useStreamCall(unfollowArtistsChunked, runNow, artists);
};
