import useCall from "../../util/use-call";
import useStreamCall from "../../util/use-stream-call";
import getAllUserArtistFollows from "./api/get-all-user-artist-follows";
import getCurrentUser from "./api/get-current-user";
import getUserArtistFollows from "./api/get-user-artist-follows";
import unfollowArtists from "./api/unfollow-artists";
import unfollowArtistsChunked from "./api/unfollow-artists-chunked";
import { Artist } from "./model";

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
