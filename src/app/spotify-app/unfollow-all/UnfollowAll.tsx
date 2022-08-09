import "./UnfollowAll.css";

import React, { useEffect, useState } from "react";

import { useUnfollowArtistsChunked } from "../../../client/spotify";
import { Artist } from "../../../client/spotify/model";
import { ArtistStatus } from "../artist/ArtistInfo";
import ArtistList, { ArtistWithError } from "./partials/ArtistList";

interface UnfollowAllProps {
  artists: Artist[];
  onComplete: () => void;
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

const UnfollowAll = ({ artists, onComplete }: UnfollowAllProps) => {
  const [resultsChunked, loading, error] = useUnfollowArtistsChunked(artists);
  const [failedArtists, setFailedArtists] = useState<ArtistWithError[]>([]);
  const [succeededArtists, setSucceededArtists] = useState<Artist[]>([]);

  useEffect(() => {
    setFailedArtists(
      resultsChunked
        .map((results) =>
          results.failedArtists.map((artist) => ({
            ...artist,
            error: results.error,
          })),
        )
        .flat(),
    );
    setSucceededArtists(resultsChunked.map((results) => results.succeededArtists).flat());
  }, [resultsChunked]);

  useEffect(() => {
    const totalAttemptedArtists = failedArtists.length + succeededArtists.length;
    if (!error && !loading && !!resultsChunked && totalAttemptedArtists === artists.length) {
      onComplete();
    }
  }, [error, loading, resultsChunked, onComplete, failedArtists, succeededArtists, artists]);
  return (
    <div className="unfollow-all-list">
      <ArtistList
        artists={[
          ...artists
            .filter((artist) => !failedArtists.find((failedArtist) => failedArtist.id === artist.id))
            .filter((artist) => succeededArtists.indexOf(artist) === -1)
            .map(getInProgressArtist),
          ...failedArtists.map(getFailedArtist),
          ...succeededArtists.map(getSucceededArtist),
        ]}
        unfollowing={!error && loading}
        completed={!error && !loading && !!resultsChunked}
        header={
          <>
            {error && <div className="error loading-message">Error unfollowing artists: {error.message}</div>}
            {!error && loading && <div className="warning loading-message">Unfollowing artists</div>}
            {!error && !loading && resultsChunked.length > 0 && failedArtists.length === 0 && (
              <div className="success loading-message">Unfollowed all artists!</div>
            )}
            {!error && !loading && resultsChunked.length > 0 && failedArtists.length > 0 && (
              <div className="error loading-message">Could not unfollow some artists! Failed artists listed below</div>
            )}
          </>
        }
      />
    </div>
  );
};

export default UnfollowAll;
