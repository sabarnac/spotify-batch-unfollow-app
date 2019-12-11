import "./AllArtistFollows.css";

import React, { useEffect, useState } from "react";

import { useGetAllUserArtistFollows } from "../../../client/spotify";
import { Artist } from "../../../client/spotify/model";
import arrayChunk from "../../../util/array-chunk";
import Loading from "../../partials/loading/Loading";
import ArtistList from "./partials/ArtistList";

const PAGE_SIZE = 15;

export default (): JSX.Element => {
  const [artistsResult, loading, error] = useGetAllUserArtistFollows();
  const [artists, setArtists] = useState<Artist[][]>([]);
  const [newArtists, setNewArtists] = useState<Artist[]>([]);
  const [selectedArtists, setSelectedArtists] = useState(new Set<string>());

  const changeArtistSelection = (artistId: string) => {
    setSelectedArtists(oldSelectedArtists => {
      if (oldSelectedArtists.has(artistId)) {
        return new Set(
          Array.from(oldSelectedArtists.values()).filter(id => id !== artistId),
        );
      } else {
        return new Set([...Array.from(oldSelectedArtists.values()), artistId]);
      }
    });
  };

  useEffect(() => {
    if (!artistsResult || artistsResult.length === 0) {
      return;
    }

    setArtists(arrayChunk(artistsResult.flat(), PAGE_SIZE));
    setNewArtists(artistsResult[artistsResult.length - 1]);
  }, [artistsResult]);

  useEffect(() => {
    setSelectedArtists(oldSelectedArtists => {
      const currentArtistIds = new Set(artists.flat().map(artist => artist.id));
      return new Set(
        Array.from(oldSelectedArtists.values()).filter(id =>
          currentArtistIds.has(id),
        ),
      );
    });
  }, [artists]);

  useEffect(() => {
    setSelectedArtists(
      oldSelectedArtists =>
        new Set([
          ...Array.from(oldSelectedArtists.values()),
          ...newArtists.map(artist => artist.id),
        ]),
    );
  }, [newArtists]);

  return (
    <div className="all-artist-follows">
      {error && (
        <div className="error">
          Error retrieving user artists follows: {error.message}
        </div>
      )}
      {!error && loading && (
        <div className="warning">Retrieving followed artists</div>
      )}
      {!error && artists.length > 0 && (
        <ArtistList
          artists={artists}
          selectedArtists={selectedArtists}
          onArtistClick={changeArtistSelection}
        />
      )}
      {!error && loading && <Loading />}
    </div>
  );
};
