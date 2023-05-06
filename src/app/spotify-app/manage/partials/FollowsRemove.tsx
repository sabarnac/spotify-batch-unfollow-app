import "./FollowsRemove.css";

import { useState } from "react";

import { FOLLOW_TYPE_RESULT_TYPE_MAP, Follow, FollowType, getFollowTypeText } from "../../../../client/spotify/model";
import UnfollowAll from "../../unfollow-all/UnfollowAll";
import { RESULTS_TYPE_NAME_LC } from "../../../../client/spotify/model";

interface ArtistsRemoveProps {
  followTypes: FollowType[];
  follows: Follow[];
  restartUnfollow: () => void;
}

const ArtistsRemove = ({ followTypes, follows, restartUnfollow }: ArtistsRemoveProps): JSX.Element => {
  const [allowRestart, setAllowRestart] = useState(false);

  return (
    <div className="follows-remove">
      <UnfollowAll followTypes={followTypes} follows={follows} onComplete={() => setAllowRestart(true)} />
      {allowRestart && (
        <div className="restart-unfollow">
          <button className="info" disabled={!allowRestart} onClick={restartUnfollow}>
            Unfollow more {getFollowTypeText(RESULTS_TYPE_NAME_LC, ...followTypes)}
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtistsRemove;
