import React, { useState, useEffect } from "react";
import "./ArtistList.css";
import ListLegend from "./ListLegend";
import { Artist } from "../../../../client/spotify/model";
import ArtistInfo, { ArtistStatus } from "../../artist/ArtistInfo";
import ArtistListOptions, {
  ArtistViewSize,
} from "../../list-options/ArtistListOptions";
import Loading from "../../../partials/loading/Loading";

interface ArtistListProps {
  artists: Artist[];
  selectedArtists: Artist[];
  loadingResults: boolean;
  addArtist: (artistToAdd: Artist) => void;
  removeArtist: (artistToRemove: Artist) => void;
}

export default ({
  artists,
  selectedArtists,
  loadingResults,
  addArtist,
  removeArtist,
}: ArtistListProps): JSX.Element => {
  const [viewSize, setViewSize] = useState(ArtistViewSize.TEN);
  const [filterString, setFilterString] = useState("");
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [viewSize, filterString]);

  const filterStringLc = filterString.toLowerCase();

  return (
    <div className="all-follows-list">
      <div className="results-table">
        <div className="results-table-options">
          <ArtistListOptions
            {...{ viewSize, setViewSize, filterString, setFilterString }}
          />
        </div>
        <div className="results-view">
          <h2 className="list-title">Select artists to unfollow</h2>
          <ListLegend />
          <div className="artist-list">
            {artists
              .filter(
                artist =>
                  filterStringLc === "" ||
                  artist.name.toLowerCase().includes(filterStringLc),
              )
              .slice(pageIndex * viewSize, (pageIndex + 1) * viewSize)
              .map(artist => {
                const isSelected = selectedArtists.indexOf(artist) !== -1;
                return (
                  <ArtistInfo
                    key={artist.id}
                    status={isSelected ? ArtistStatus.SELECTED : undefined}
                    artist={artist}
                    onClick={() =>
                      isSelected ? removeArtist(artist) : addArtist(artist)
                    }
                  />
                );
              })}
          </div>
          {loadingResults && <Loading />}
          <div className="pagination">
            <button
              className="previous"
              onClick={() => setPageIndex(pageIndex => pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              Previous
            </button>
            <button
              className="next"
              onClick={() => setPageIndex(pageIndex => pageIndex + 1)}
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
