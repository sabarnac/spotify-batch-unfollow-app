// App Models

import { FetchError } from "../../util/retry-fetch";

export type SpotifyPermissionOptions =
  | "artists-users"
  | "read-saved-tracks-episodes"
  | "shows"
  | "playlists"
  | "albums";

export const SPOTIFY_PERMISSION_OPTIONS_MAP: Record<SpotifyPermissionOptions, string[]> = {
  "artists-users": ["user-follow-read", "user-follow-modify"],
  "read-saved-tracks-episodes": ["user-library-read"],
  shows: ["user-library-read", "user-library-modify"],
  albums: ["user-library-read", "user-library-modify"],
  playlists: ["playlist-read-private", "playlist-modify-public", "playlist-modify-private"],
};

export type ResultTypes = "user" | "artist" | "show" | "album" | "playlist";

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

export interface Album {
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
  type: "album";
}

export interface Playlist {
  external_urls: {
    spotify: string;
  };
  id: string;
  owner: {
    id: string;
  };
  images: {
    height: number;
    width: number;
    url: string;
  }[];
  name: string;
  type: "playlist";
}

export type Follow = FollowedUser | Artist | Show | Album | Playlist;

export type FollowType = "ARTIST" | "USER" | "SHOW" | "ALBUM" | "PLAYLIST";

export const FOLLOW_TYPE_RESULT_TYPE_MAP: Record<FollowType, ResultTypes> = {
  ARTIST: "artist",
  USER: "user",
  SHOW: "show",
  ALBUM: "album",
  PLAYLIST: "playlist",
};

export const getResultTypesForFollowTypes = (...followTypes: FollowType[]) =>
  [...followTypes.values()].map((type) => FOLLOW_TYPE_RESULT_TYPE_MAP[type]);

export const RESULTS_TYPE_NAME_LC: Record<ResultTypes, string> = {
  user: "users",
  artist: "artists",
  show: "shows",
  album: "albums",
  playlist: "playlists",
};

export const RESULTS_TYPE_NAME_CAP: Record<ResultTypes, string> = {
  user: "Users",
  artist: "Artists",
  show: "Shows",
  album: "Albums",
  playlist: "Playlists",
};

export const RESULTS_TYPE_NAME_SINGULAR_CAP: Record<ResultTypes, string> = {
  user: "User",
  artist: "Artist",
  show: "Show",
  album: "Album",
  playlist: "Playlist",
};

export const getFollowTypeText = (dict: Record<ResultTypes, string>, ...followTypes: FollowType[]) =>
  getResultTypesForFollowTypes(...followTypes.sort())
    .map((type) => dict[type])
    .join(", ");

export const PERMISSION_OPTIONS: { label: string; id: FollowType; permission: SpotifyPermissionOptions }[] = [
  { label: getFollowTypeText(RESULTS_TYPE_NAME_CAP, "ARTIST"), id: "ARTIST", permission: "artists-users" },
  { label: getFollowTypeText(RESULTS_TYPE_NAME_CAP, "SHOW"), id: "SHOW", permission: "shows" },
  { label: getFollowTypeText(RESULTS_TYPE_NAME_CAP, "ALBUM"), id: "ALBUM", permission: "albums" },
  { label: getFollowTypeText(RESULTS_TYPE_NAME_CAP, "PLAYLIST"), id: "PLAYLIST", permission: "playlists" },
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

export interface FollowedAlbumsList {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: { added_at: string; album: Album }[];
}

export type AlbumFollowsResponse = FollowedAlbumsList;

export interface FollowedPlaylistsList {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: Playlist[];
}

export type PlaylistFollowsResponse = FollowedPlaylistsList;
