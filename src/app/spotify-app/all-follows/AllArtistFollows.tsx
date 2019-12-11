import "./AllArtistFollows.css";

import React, { useEffect, useState } from "react";

import { useGetAllUserArtistFollows } from "../../../client/spotify";
import { Artist } from "../../../client/spotify/model";
import Loading from "../../partials/loading/Loading";
import ArtistList from "./partials/ArtistList";

interface AllArtistFollowsProps {
  onChange: (selectedArtistIds: Artist[]) => void;
}

export default ({ onChange }: AllArtistFollowsProps): JSX.Element => {
  const [artistsResult, loading, error] = useGetAllUserArtistFollows();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [newArtists, setNewArtists] = useState<Artist[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);

  const changeArtistSelection = (selectedArtist: Artist) => {
    setSelectedArtists(selectedArtists => {
      if (selectedArtists.indexOf(selectedArtist) !== -1) {
        return selectedArtists.filter(artist => artist !== selectedArtist);
      } else {
        return [...selectedArtists, selectedArtist];
      }
    });
  };

  useEffect(() => {
    if (artistsResult.length === 0) {
      return;
    }

    setArtists(artistsResult.flat());
    setNewArtists(artistsResult[artistsResult.length - 1]);
  }, [artistsResult]);

  useEffect(() => {
    setSelectedArtists(selectedArtists =>
      selectedArtists.filter(oldArtist => artists.indexOf(oldArtist) !== -1),
    );
  }, [artists]);

  useEffect(() => {
    setSelectedArtists(selectedArtists => [...selectedArtists, ...newArtists]);
  }, [newArtists]);

  useEffect(() => {
    onChange(selectedArtists);
  }, [selectedArtists, onChange]);

  return (
    <div className="all-artist-follows">
      {error && (
        <div className="error">
          Error retrieving followed artists: {error.message}
        </div>
      )}
      {!error && loading && (
        <div className="warning loading-message">
          Retrieving followed artists
        </div>
      )}
      {!error && loading && artists.length === 0 && <Loading />}
      {!error && artists.length > 0 && (
        <ArtistList
          loadingResults={!error && loading}
          artists={artists}
          selectedArtists={selectedArtists}
          onArtistClick={changeArtistSelection}
        />
      )}
    </div>
  );
};
