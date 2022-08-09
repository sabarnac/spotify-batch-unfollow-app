import "./UnfollowArtists.css";

import React, { useCallback, useState } from "react";

import { Artist } from "../../../client/spotify/model";
import ArtistsRemove from "./partials/ArtistsRemove";
import ArtistsSelect from "./partials/ArtistsSelect";

// import Loading from "../../partials/loading/Loading";
enum UnfollowArtistsView {
  ARTIST_SELECT = "artist-select",
  ARTIST_REMOVE = "artist-remove",
}

const UnfollowArtists = (): JSX.Element => {
  const [view, setView] = useState(UnfollowArtistsView.ARTIST_SELECT);
  const [artistsToRemove, setArtistsToRemove] = useState(new Set<Artist>());

  const addArtists = useCallback(
    (...artistsToAdd: Artist[]) =>
      setArtistsToRemove((artists) => {
        artistsToAdd.forEach((artist) => artists.add(artist));
        return new Set(artists);
      }),
    [],
  );
  const removeArtists = useCallback(
    (...artistsToRemove: Artist[]) =>
      setArtistsToRemove((artists) => {
        artistsToRemove.forEach((artist) => artists.delete(artist));
        return new Set(artists);
      }),
    [],
  );

  return (
    <div className="unfollow-artists">
      {view === UnfollowArtistsView.ARTIST_SELECT ? (
        <ArtistsSelect
          selectedArtists={Array.from(artistsToRemove.values())}
          addArtists={addArtists}
          removeArtists={removeArtists}
          startUnfollow={() => setView(UnfollowArtistsView.ARTIST_REMOVE)}
        />
      ) : (
        <ArtistsRemove
          artists={Array.from(artistsToRemove.values())}
          restartUnfollow={() => {
            setArtistsToRemove(new Set());
            setView(UnfollowArtistsView.ARTIST_SELECT);
          }}
        />
      )}
    </div>
  );
};

export default UnfollowArtists;
