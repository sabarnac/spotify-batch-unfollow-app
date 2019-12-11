import "./UnfollowArtists.css";

import React, { useState } from "react";

// import Loading from "../../partials/loading/Loading";
import ArtistsSelect from "./partials/ArtistsSelect";
import { Artist } from "../../../client/spotify/model";
import UnfollowAll from "../unfollow-all/UnfollowAll";

enum UnfollowArtistsView {
  ARTIST_SELECT = "artist-select",
  ARTIST_REMOVE = "artist-remove",
}

export default (): JSX.Element => {
  const [view, setView] = useState(UnfollowArtistsView.ARTIST_SELECT);
  const [artistsToRemove, setArtistsToRemove] = useState<Artist[]>([]);

  return (
    <div className="unfollow-artists">
      {view === UnfollowArtistsView.ARTIST_SELECT ? (
        <ArtistsSelect
          artistCount={artistsToRemove.length}
          onChange={setArtistsToRemove}
          startUnfollow={() => setView(UnfollowArtistsView.ARTIST_REMOVE)}
        />
      ) : (
        <UnfollowAll artists={artistsToRemove} />
      )}
    </div>
  );
};
