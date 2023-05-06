import "./FollowsSelect.css";

import classNames from "classnames";
import React from "react";

import { RESULTS_TYPE_NAME_LC, Follow, FollowType, getFollowTypeText } from "../../../../client/spotify/model";
import AllFollows from "../../all-follows/AllFollows";

interface FollowsSelectProps {
  followTypes: FollowType[];
  selectedFollows: Follow[];
  setFollowTypes: (...types: FollowType[]) => void;
  addFollows: (...follows: Follow[]) => void;
  removeFollows: (...follows: Follow[]) => void;
  startUnfollow: () => void;
}

const FollowsSelect = ({
  followTypes,
  setFollowTypes,
  selectedFollows,
  addFollows,
  removeFollows,
  startUnfollow,
}: FollowsSelectProps): JSX.Element => (
  <div className="follows-select">
    <AllFollows
      followTypes={followTypes}
      setFollowTypes={setFollowTypes}
      selectedFollows={selectedFollows}
      addFollowsForRemoval={addFollows}
      removeFollowsFromRemoval={removeFollows}
    />
    <div className="start-unfollow">
      <button
        className={classNames("error", {
          disabled: selectedFollows.length === 0,
        })}
        disabled={selectedFollows.length === 0}
        onClick={startUnfollow}
      >
        Unfollow {selectedFollows.length} {getFollowTypeText(RESULTS_TYPE_NAME_LC, ...followTypes)}
      </button>
    </div>
  </div>
);

export default FollowsSelect;
