import "./UnfollowAll.css";

import { useCallback, useEffect, useState } from "react";

import { useUnfollowFollowsChunked } from "../../../client/spotify";
import {
  RESULTS_TYPE_NAME_LC,
  Follow,
  FollowType,
  getFollowTypeText,
  UnfollowChunkedResult,
  isChunkedSuccessResult,
} from "../../../client/spotify/model";
import { FollowStatus } from "../follow/FollowInfo";
import FollowList from "./partials/FollowList";
import { FetchError } from "../../../util/retry-fetch";

interface UnfollowAllProps {
  followTypes: FollowType[];
  follows: Follow[];
  onComplete: () => void;
}

type FollowWithError = { follow: Follow; error: FetchError };

const getInProgressFollow = (follow: Follow) => ({
  follow,
  status: "selected" as FollowStatus,
});
const getSucceededFollow = (follow: Follow) => ({
  follow,
  status: "succeeded" as FollowStatus,
});
const getFailedFollow = (follow: FollowWithError) => ({
  ...follow,
  status: "failed" as FollowStatus,
});

const UnfollowAll = ({ followTypes, follows, onComplete }: UnfollowAllProps) => {
  const [failedFollows, setFailedFollows] = useState<FollowWithError[]>([]);
  const [succeededFollows, setSucceededFollows] = useState<Follow[]>([]);

  const newUnfollowsHandler = useCallback(
    (newUnfollows: UnfollowChunkedResult<Follow>) => {
      if (isChunkedSuccessResult(newUnfollows)) {
        setSucceededFollows((succeededFollows) => [...succeededFollows, ...newUnfollows.succeeded]);
      } else {
        setFailedFollows((failedFollows) => [
          ...failedFollows,
          ...newUnfollows.failed.map((follow) => ({ follow, error: newUnfollows.error })),
        ]);
      }
    },
    [setSucceededFollows, setFailedFollows],
  );

  const [resultsChunked, loading, errors] = useUnfollowFollowsChunked(follows, newUnfollowsHandler);

  useEffect(() => {
    const totalAttemptedFollows = failedFollows.length + succeededFollows.length;
    if (errors.length === 0 && !loading && !!resultsChunked && totalAttemptedFollows === follows.length) {
      onComplete();
    }
  }, [errors, loading, resultsChunked, onComplete, failedFollows, succeededFollows, follows]);

  return (
    <div className="unfollow-all-list">
      <FollowList
        followTypes={followTypes}
        follows={[
          ...failedFollows.map(getFailedFollow),
          ...follows
            .filter((Follow) => !failedFollows.find((failedFollow) => failedFollow.follow.id === Follow.id))
            .filter((Follow) => succeededFollows.indexOf(Follow) === -1)
            .map(getInProgressFollow),
          ...succeededFollows.map(getSucceededFollow),
        ]}
        unfollowing={errors.length === 0 && loading}
        completed={errors.length === 0 && !loading && !!resultsChunked}
        header={
          <>
            {errors.length > 0 && (
              <div className="error loading-message">
                Error unfollowing {getFollowTypeText(RESULTS_TYPE_NAME_LC, ...followTypes)}:
                <ul>
                  {errors.map((error, i) => (
                    <li key={i}>{error.message}</li>
                  ))}
                </ul>
              </div>
            )}
            {errors.length === 0 && loading && (
              <div className="warning loading-message">
                Unfollowing {getFollowTypeText(RESULTS_TYPE_NAME_LC, ...followTypes)}
              </div>
            )}
            {errors.length === 0 && !loading && resultsChunked.length > 0 && failedFollows.length === 0 && (
              <div className="success loading-message">
                Unfollowed all {getFollowTypeText(RESULTS_TYPE_NAME_LC, ...followTypes)}!
              </div>
            )}
            {errors.length === 0 && !loading && resultsChunked.length > 0 && failedFollows.length > 0 && (
              <div className="error loading-message">
                Could not unfollow some {getFollowTypeText(RESULTS_TYPE_NAME_LC, ...followTypes)}! Failed{" "}
                {getFollowTypeText(RESULTS_TYPE_NAME_LC, ...followTypes)} listed below
              </div>
            )}
          </>
        }
      />
    </div>
  );
};

export default UnfollowAll;
