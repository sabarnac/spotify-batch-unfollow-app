import React, { useState, useEffect } from "react";
import "./UnfollowAll.css";
import ArtistList, { ArtistWithError } from "./partials/ArtistList";
import { Artist } from "../../../client/spotify/model";
import { useUnfollowArtistsChunked } from "../../../client/spotify";
import { ArtistStatus } from "../artist/ArtistInfo";

interface UnfollowAllProps {
  artists: Artist[];
}

const getInProgressArtist = (artist: Artist) => ({
  ...artist,
  status: ArtistStatus.SELECTED,
});
const getSucceededArtist = (artist: Artist) => ({
  ...artist,
  status: ArtistStatus.SUCCEEEDED,
});
const getFailedArtist = (artist: ArtistWithError) => ({
  ...artist,
  status: ArtistStatus.FAILED,
});

export default ({ artists }: UnfollowAllProps) => {
  const [resultsChunked, loading, error] = useUnfollowArtistsChunked(artists);
  const [failedArtists, setFailedArtists] = useState<ArtistWithError[]>([]);
  const [succeededArtists, setSucceededArtists] = useState<Artist[]>([]);

  useEffect(() => {
    setFailedArtists(
      resultsChunked
        .map(results =>
          results.failedArtists.map(artist => ({
            ...artist,
            error: results.error,
          })),
        )
        .flat(),
    );
    setSucceededArtists(
      resultsChunked.map(results => results.succeededArtists).flat(),
    );
  }, [resultsChunked]);

  return (
    <div className="unfollow-all-list">
      {error && (
        <div className="error">Error unfollowing artists: {error.message}</div>
      )}
      {!error && loading && (
        <div className="warning loading-message">Unfollowing artists</div>
      )}
      {!error && !loading && !!resultsChunked && failedArtists.length === 0 && (
        <div className="success loading-message">Unfollowed all artists!</div>
      )}
      {!error && !loading && !!resultsChunked && failedArtists.length > 0 && (
        <div className="error loading-message">
          Could not unfollow some artists! Failed artists listed below
        </div>
      )}
      <ArtistList
        artists={[
          ...artists
            .filter(
              artist =>
                !failedArtists.find(
                  failedArtist => failedArtist.id === artist.id,
                ),
            )
            .filter(artist => succeededArtists.indexOf(artist) === -1)
            .map(getInProgressArtist),
          ...failedArtists.map(getFailedArtist),
          ...succeededArtists.map(getSucceededArtist),
        ]}
        unfollowing={!error && loading}
        completed={!error && !loading && !!resultsChunked}
      />
    </div>
  );
};
