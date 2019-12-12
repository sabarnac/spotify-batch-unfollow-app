import "./ArtistsRemove.css";

import React, { useState } from "react";

import { Artist } from "../../../../client/spotify/model";
import UnfollowAll from "../../unfollow-all/UnfollowAll";

interface ArtistsRemoveProps {
  artists: Artist[];
  restartUnfollow: () => void;
}

export default ({
  artists,
  restartUnfollow,
}: ArtistsRemoveProps): JSX.Element => {
  const [allowRestart, setAllowRestart] = useState(false);

  return (
    <div className="artists-remove">
      <UnfollowAll
        artists={artists}
        onComplete={() => setAllowRestart(true)}
      />
      {allowRestart && (
        <div className="restart-unfollow">
          <button
            className="info"
            disabled={!allowRestart}
            onClick={restartUnfollow}
          >
            Unfollow more artists
          </button>
        </div>
      )}
    </div>
  );
};
