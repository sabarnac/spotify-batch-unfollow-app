import "./ArtistList.css";

import React, { useEffect, useState } from "react";

import { Artist } from "../../../../client/spotify/model";
import Loading from "../../../partials/loading/Loading";
import ArtistInfo, { ArtistStatus } from "../../artist/ArtistInfo";
import ArtistListOptions, { ArtistViewSize } from "../../list-options/ArtistListOptions";

interface ArtistWithStatus extends Artist {
  status: ArtistStatus;
}

export interface ArtistWithError extends Artist {
  error?: Error;
}

interface ArtistListProps {
  artists: (ArtistWithStatus & ArtistWithError)[];
  unfollowing: boolean;
  completed: boolean;
  header: JSX.Element;
}

const ArtistList = ({ artists, unfollowing, completed, header }: ArtistListProps): JSX.Element => {
  const [viewSize, setViewSize] = useState(ArtistViewSize.TEN);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [viewSize]);

  useEffect(() => {
    if (!completed) {
      return;
    }

    setPageIndex(0);
  }, [completed]);

  const failedArtists = artists.filter((artist) => artist.status === ArtistStatus.FAILED);

  const artistsToShow = completed && failedArtists.length > 0 ? failedArtists : artists;

  return (
    <div className="unfollow-artists-list">
      <div className="results-table">
        <div className="results-table-options">
          <ArtistListOptions {...{ viewSize, setViewSize }} />
        </div>
        <div className="results-view">
          {header}
          {unfollowing && <Loading />}
          <div className="artist-list">
            {artistsToShow.slice(pageIndex * viewSize, (pageIndex + 1) * viewSize).map((artist) => (
              <ArtistInfo
                key={artist.id}
                status={artist.status}
                artist={artist}
                description={artist.error ? `Could not unfollow. Error: ${artist.error.message}` : undefined}
              />
            ))}
          </div>
          <div className="pagination">
            <button
              className="previous"
              onClick={() => setPageIndex((pageIndex) => pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              Previous
            </button>
            <button
              className="next"
              onClick={() => setPageIndex((pageIndex) => pageIndex + 1)}
              disabled={(pageIndex + 1) * viewSize >= artists.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistList;
