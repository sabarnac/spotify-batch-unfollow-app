// App Models

import { FetchError } from "../../util/retry-fetch";

export type SpotifyPermissionOptions = "artists-users" | "shows";

export const SPOTIFY_PERMISSION_OPTIONS_MAP: Record<SpotifyPermissionOptions, string[]> = {
  "artists-users": ["user-follow-read", "user-follow-modify"],
  shows: ["user-library-read", "user-library-modify"],
};

export type ResultTypes = "user" | "artist" | "show";

export interface UserInfo {
  id: string;
  display_name: string;
  type: "user";
}

export interface FollowedUser extends UserInfo {
  external_urls: {
    spotify: string;
  };
  images: {
    height: number;
    width: number;
    url: string;
  }[];
  name: string;
  type: "user";
}

export interface Artist {
  external_urls: {
    spotify: string;
  };
  id: string;
  images: {
    height: number;
    width: number;
    url: string;
  }[];
  name: string;
  type: "artist";
}

export interface Show {
  external_urls: {
    spotify: string;
  };
  id: string;
  images: {
    height: number;
    width: number;
    url: string;
  }[];
  name: string;
  type: "show";
}

export type Follow = FollowedUser | Artist | Show;

export type FollowType = "ARTIST" | "USER" | "SHOW";

export const FOLLOW_TYPE_RESULT_TYPE_MAP: Record<FollowType, ResultTypes> = {
  ARTIST: "artist",
  USER: "user",
  SHOW: "show",
};

export const getResultTypesForFollowTypes = (...followTypes: FollowType[]) =>
  [...followTypes.values()].map((type) => FOLLOW_TYPE_RESULT_TYPE_MAP[type]);

export const RESULTS_TYPE_NAME_LC: Record<ResultTypes, string> = {
  user: "users",
  artist: "artists",
  show: "shows (podcasts)",
};

export const RESULTS_TYPE_NAME_CAP: Record<ResultTypes, string> = {
  user: "Users",
  artist: "Artists",
  show: "Shows (Podcasts)",
};

export const getFollowTypeText = (dict: Record<ResultTypes, string>, ...followTypes: FollowType[]) =>
  getResultTypesForFollowTypes(...followTypes)
    .map((type) => dict[type])
    .join(", ");

export const PERMISSION_OPTIONS: { label: string; id: FollowType; permission: SpotifyPermissionOptions }[] = [
  { label: getFollowTypeText(RESULTS_TYPE_NAME_CAP, "ARTIST"), id: "ARTIST", permission: "artists-users" },
  { label: getFollowTypeText(RESULTS_TYPE_NAME_CAP, "SHOW"), id: "SHOW", permission: "shows" },
];

export type UnfollowChunkedSuccessResult<T> = {
  succeeded: T[];
};

export type UnfollowChunkedFailureResult<T> = { failed: T[]; error: FetchError };

export type UnfollowChunkedResult<T> = UnfollowChunkedSuccessResult<T> | UnfollowChunkedFailureResult<T>;

export const isChunkedSuccessResult = function <T>(
  result: UnfollowChunkedResult<T>,
): result is UnfollowChunkedSuccessResult<T> {
  return "succeeded" in result;
};

export const isChunkedFailureResult = function <T>(
  result: UnfollowChunkedResult<T>,
): result is UnfollowChunkedFailureResult<T> {
  return !isChunkedSuccessResult(result);
};

// Spotify API Models

export interface FollowedArtistsList {
  cursors: {
    after: string;
  };
  href: string;
  items: Artist[];
  limit: number;
  next: string;
  total: number;
}

export interface FollowedUsersList {
  cursors: {
    after: string;
  };
  href: string;
  items: UserInfo[];
  limit: number;
  next: string;
  total: number;
}

export interface UserFollowsResponse {
  artists: FollowedArtistsList;
  users: FollowedUsersList;
}

export interface FollowedShowsList {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: { added_at: string; show: Show }[];
}

export type ShowFollowsResponse = FollowedShowsList;
