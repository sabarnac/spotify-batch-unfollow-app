import "./ArtistsSelect.css";

import React from "react";

import AllArtistFollows from "../../all-follows/AllArtistFollows";
import { Artist } from "../../../../client/spotify/model";
import classNames from "classnames";

interface ArtistsSelectProps {
  selectedArtists: Artist[];
  addArtists: (...artists: Artist[]) => void;
  removeArtists: (...artists: Artist[]) => void;
  startUnfollow: () => void;
}

export default ({
  selectedArtists,
  addArtists,
  removeArtists,
  startUnfollow,
}: ArtistsSelectProps): JSX.Element => (
  <div className="artists-select">
    <AllArtistFollows
      selectedArtists={selectedArtists}
      addArtistsForRemoval={addArtists}
      removeArtistsForRemoval={removeArtists}
    />
    <div className="start-unfollow">
      <button
        className={classNames("error", {
          disabled: selectedArtists.length === 0,
        })}
        disabled={selectedArtists.length === 0}
        onClick={startUnfollow}
      >
        Unfollow {selectedArtists.length} artists
      </button>
    </div>
  </div>
);
