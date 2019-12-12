import "./ArtistsSelect.css";

import React from "react";

import AllArtistFollows from "../../all-follows/AllArtistFollows";
import { Artist } from "../../../../client/spotify/model";
import classNames from "classnames";

interface ArtistsSelectProps {
  artistCount: number;
  onChange: (selectedArtistIds: Artist[]) => void;
  startUnfollow: () => void;
}

export default ({
  artistCount,
  onChange,
  startUnfollow,
}: ArtistsSelectProps): JSX.Element => (
  <div className="artists-select">
    <AllArtistFollows onChange={onChange} />
    <div className="start-unfollow">
      <button
        className={classNames("error", { disabled: artistCount === 0 })}
        disabled={artistCount === 0}
        onClick={startUnfollow}
      >
        Unfollow {artistCount} Artists
      </button>
    </div>
  </div>
);
