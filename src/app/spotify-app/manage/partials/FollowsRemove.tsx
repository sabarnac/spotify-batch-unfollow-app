import "./FollowsRemove.css";

import React, { useState } from "react";

import { Follow, FollowType } from "../../../../client/spotify/model";
import UnfollowAll from "../../unfollow-all/UnfollowAll";

interface ArtistsRemoveProps {
  followTypes: FollowType[];
  follows: Follow[];
  restartUnfollow: () => void;
}

const ArtistsRemove = ({ followTypes, follows, restartUnfollow }: ArtistsRemoveProps): JSX.Element => {
  const [allowRestart, setAllowRestart] = useState(false);

  return (
    <div className="artists-remove">
      <UnfollowAll followTypes={followTypes} follows={follows} onComplete={() => setAllowRestart(true)} />
      {allowRestart && (
        <div className="restart-unfollow">
          <button className="info" disabled={!allowRestart} onClick={restartUnfollow}>
            Unfollow more artists
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtistsRemove;
