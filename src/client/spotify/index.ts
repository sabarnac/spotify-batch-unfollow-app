import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import useCall from "../../util/use-call";
import useStreamCall from "../../util/use-stream-call";
import getAllUserArtistFollows from "./api/get-all-user-artist-follows";
import getAllUserShowFollows from "./api/get-all-user-show-follows";
import getCurrentUser from "./api/get-current-user";
import unfollowArtistsChunked from "./api/unfollow-artists-chunked";
import unfollowShowsChunked from "./api/unfollow-shows-chunked";
import unfollowUsersChunked from "./api/unfollow-users-chunked";
import {
  Artist,
  Follow,
  FollowType,
  FollowedUser,
  Show,
  UnfollowChunkedResult,
  getResultTypesForFollowTypes,
} from "./model";

export const useGetCurrentUser = (runNow: boolean = true) => useCall(getCurrentUser, runNow);

const updateAllFollowsList = (
  setAllFollows: Dispatch<SetStateAction<Follow[]>>,
  newFollowsHandler: (...newFollows: Follow[]) => void,
  followsChunked: Follow[][],
) => {
  if (followsChunked.length === 0) {
    return;
  }

  const newFollows = followsChunked[followsChunked.length - 1];
  setAllFollows((follows) => [...follows, ...newFollows]);

  newFollowsHandler(...newFollows);
};

const updateAllErrorsList = (setAllErrors: Dispatch<SetStateAction<Error[]>>, error?: Error) => {
  if (!error) {
    return;
  }

  setAllErrors((errors) => [...errors, error]);
};

export const useGetAllUserArtistFollows = (
  followTypes: FollowType[],
  newFollowsHandler: (...newFollows: Follow[]) => void,
  runNow = true,
) => {
  const [followedArtists, loadingArtists, artistsError] = useStreamCall(
    getAllUserArtistFollows,
    runNow && followTypes.includes("ARTIST"),
    "artist",
  );
  const [followedUsers, loadingUsers, usersError] = useStreamCall(
    getAllUserArtistFollows,
    runNow && followTypes.includes("USER"),
    "user",
  );
  const [followedShows, loadingShows, showsError] = useStreamCall(
    getAllUserShowFollows,
    runNow && followTypes.includes("SHOW"),
  );

  const [allFollows, setAllFollows] = useState<Follow[]>([]);

  useEffect(
    () => updateAllFollowsList(setAllFollows, newFollowsHandler, followedArtists),
    [followedArtists, newFollowsHandler, setAllFollows],
  );
  useEffect(
    () => updateAllFollowsList(setAllFollows, newFollowsHandler, followedUsers),
    [followedUsers, newFollowsHandler, setAllFollows],
  );
  useEffect(
    () => updateAllFollowsList(setAllFollows, newFollowsHandler, followedShows),
    [followedShows, newFollowsHandler, setAllFollows],
  );

  const [allErrors, setAllErrors] = useState<Error[]>([]);

  useEffect(() => updateAllErrorsList(setAllErrors, artistsError), [artistsError, setAllErrors]);
  useEffect(() => updateAllErrorsList(setAllErrors, usersError), [usersError, setAllErrors]);
  useEffect(() => updateAllErrorsList(setAllErrors, showsError), [showsError, setAllErrors]);

  useEffect(() => {
    const resultTypes = getResultTypesForFollowTypes(...followTypes);
    setAllFollows((follows) => follows.filter(({ type }) => resultTypes.includes(type)));
  }, [followTypes, setAllFollows, setAllErrors]);

  return [allFollows, loadingArtists || loadingUsers || loadingShows, allErrors] as [Follow[], boolean, Error[]];
};

const updateAllUnfollowsList = (
  setAllUnfollows: Dispatch<SetStateAction<UnfollowChunkedResult<Follow>[]>>,
  newUnfollowsHandler: (newUnfollows: UnfollowChunkedResult<Follow>) => void,
  unfollowsChunked: UnfollowChunkedResult<Follow>[],
) => {
  if (unfollowsChunked.length === 0) {
    return;
  }

  const newUnfollows = unfollowsChunked[unfollowsChunked.length - 1];
  setAllUnfollows((unfollows) => [...unfollows, newUnfollows]);

  newUnfollowsHandler(newUnfollows);
};

export const useUnfollowFollowsChunked = (
  follows: Follow[],
  newUnfollowsHandler: (newUnfollows: UnfollowChunkedResult<Follow>) => void,
  runNow: boolean = true,
) => {
  const followedArtists = useMemo(
    () => follows.filter((follow): follow is Artist => follow.type === "artist"),
    [follows],
  );
  const followedUsers = useMemo(
    () => follows.filter((follow): follow is FollowedUser => follow.type === "user"),
    [follows],
  );
  const followedShows = useMemo(() => follows.filter((follow): follow is Show => follow.type === "show"), [follows]);

  const [unfollowArtists, loadingArtists, artistsError] = useStreamCall(
    unfollowArtistsChunked,
    runNow,
    followedArtists,
  );
  const [unfollowUsers, loadingUsers, usersError] = useStreamCall(unfollowUsersChunked, runNow, followedUsers);
  const [unfollowShows, loadingShows, showsError] = useStreamCall(unfollowShowsChunked, runNow, followedShows);

  const [allUnfollows, setAllUnfollows] = useState<UnfollowChunkedResult<Follow>[]>([]);

  useEffect(
    () => updateAllUnfollowsList(setAllUnfollows, newUnfollowsHandler, unfollowArtists),
    [unfollowArtists, newUnfollowsHandler, setAllUnfollows],
  );
  useEffect(
    () => updateAllUnfollowsList(setAllUnfollows, newUnfollowsHandler, unfollowUsers),
    [unfollowUsers, newUnfollowsHandler, setAllUnfollows],
  );
  useEffect(
    () => updateAllUnfollowsList(setAllUnfollows, newUnfollowsHandler, unfollowShows),
    [unfollowShows, newUnfollowsHandler, setAllUnfollows],
  );

  const [allErrors, setAllErrors] = useState<Error[]>([]);

  useEffect(() => updateAllErrorsList(setAllErrors, artistsError), [artistsError, setAllErrors]);
  useEffect(() => updateAllErrorsList(setAllErrors, usersError), [usersError, setAllErrors]);
  useEffect(() => updateAllErrorsList(setAllErrors, showsError), [showsError, setAllErrors]);

  return [allUnfollows, loadingArtists || loadingUsers || loadingShows, allErrors] as [
    UnfollowChunkedResult<Follow>[],
    boolean,
    Error[],
  ];
};
