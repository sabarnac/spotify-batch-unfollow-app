import React, { useState } from "react";
import "./ArtistList.css";
import ListLegend from "./ListLegend";
import { Artist } from "../../../../client/spotify/model";
import ArtistInfo from "../../artist/ArtistInfo";

interface ArtistListProps {
  artists: Artist[][];
  selectedArtists: Set<string>;
  onArtistClick: (id: string) => void;
}

export default ({
  artists,
  selectedArtists,
  onArtistClick,
}: ArtistListProps): JSX.Element => {
  const [pageIndex, setPageIndex] = useState(0);

  return (
    <>
      <h2 className="list-title">Select Artists To Unfollow</h2>
      <ListLegend />
      <div className="list">
        {artists[pageIndex].map(artist => (
          <ArtistInfo
            key={artist.id}
            isSelected={selectedArtists.has(artist.id)}
            artist={artist}
            onClick={() => onArtistClick(artist.id)}
          />
        ))}
      </div>
      <div className="pagination">
        <button
          className="previous"
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          Previous
        </button>
        <button
          className="next"
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={pageIndex === artists.length - 1}
        >
          Next
        </button>
      </div>
    </>
  );
};
