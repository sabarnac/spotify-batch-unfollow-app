export enum UserTypes {
  USER = "user",
  ARTIST = "artist",
}

export interface UserInfo {
  display_name: string;
  email: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  href: string;
  id: string;
  images: {
    height: number;
    width: number;
    url: string;
  }[];
  type: UserTypes.USER;
  uri: string;
}

export interface Artist {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    height: number;
    width: number;
    url: string;
  }[];
  name: string;
  popularity: number;
  type: UserTypes.ARTIST;
  uri: string;
}

export interface FollowedArtists {
  cursors: {
    after: string;
  };
  href: string;
  items: Artist[];
  limit: number;
  next: string;
  total: number;
}

export interface Follows {
  artists: FollowedArtists;
}
