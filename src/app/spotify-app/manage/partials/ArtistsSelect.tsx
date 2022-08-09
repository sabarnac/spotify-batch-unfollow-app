import "./ArtistsSelect.css";

import classNames from "classnames";
import React from "react";

import { Artist } from "../../../../client/spotify/model";
import AllArtistFollows from "../../all-follows/AllArtistFollows";

interface ArtistsSelectProps {
  selectedArtists: Artist[];
  addArtists: (...artists: Artist[]) => void;
  removeArtists: (...artists: Artist[]) => void;
  startUnfollow: () => void;
}

const ArtistsSelect = ({
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

export default ArtistsSelect;
