import "./AllFollows.css";

import React from "react";

import { useGetAllUserArtistFollows } from "../../../client/spotify";
import { RESULTS_TYPE_NAME_LC, Follow, FollowType, getFollowTypeText } from "../../../client/spotify/model";
import Loading from "../../partials/loading/Loading";
import FollowList from "./partials/FollowList";

interface AllFollowsProps {
  followTypes: FollowType[];
  selectedFollows: Follow[];
  setFollowTypes: (...types: FollowType[]) => void;
  addFollowsForRemoval: (...follows: Follow[]) => void;
  removeFollowsFromRemoval: (...follows: Follow[]) => void;
}

const AllFollows = ({
  followTypes,
  setFollowTypes,
  selectedFollows,
  addFollowsForRemoval,
  removeFollowsFromRemoval,
}: AllFollowsProps): JSX.Element => {
  const [follows, loading, errors] = useGetAllUserArtistFollows(followTypes, addFollowsForRemoval);

  const addFollowToRemovalList = (follow: Follow) => {
    addFollowsForRemoval(follow);
  };
  const removeFollowFromRemovalList = (follow: Follow) => {
    removeFollowsFromRemoval(follow);
  };

  return (
    <div className="all-follows">
      {errors.length > 0 && (
        <div className="error loading-message">
          Error retrieving followed {getFollowTypeText(RESULTS_TYPE_NAME_LC, ...followTypes)}:
          <ul>
            {errors.map((error, i) => (
              <li key={i}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}
      {errors.length === 0 && loading && (
        <div className="warning loading-message">
          Retrieving followed {getFollowTypeText(RESULTS_TYPE_NAME_LC, ...followTypes)}
        </div>
      )}
      {errors.length === 0 && loading && follows.length === 0 && <Loading />}
      {errors.length === 0 && (
        <FollowList
          followTypes={followTypes}
          setFollowTypes={setFollowTypes}
          loadingResults={errors.length === 0 && loading}
          follows={follows}
          selectedFollows={selectedFollows}
          addFollow={addFollowToRemovalList}
          removeFollow={removeFollowFromRemovalList}
        />
      )}
    </div>
  );
};

export default AllFollows;