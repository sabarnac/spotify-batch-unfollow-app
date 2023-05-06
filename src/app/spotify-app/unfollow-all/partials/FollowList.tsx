import "./FollowList.css";

import { useEffect, useState } from "react";

import { Follow, FollowType } from "../../../../client/spotify/model";
import Loading from "../../../partials/loading/Loading";
import FollowInfo, { FollowStatus } from "../../follow/FollowInfo";
import FollowListOptions, { ViewSize } from "../../list-options/FollowListOptions";
import { FetchError } from "../../../../util/retry-fetch";

interface FollowWithStatus {
  follow: Follow;
  status: FollowStatus;
}

interface FollowWithError extends FollowWithStatus {
  status: "failed";
  error: FetchError;
}

const isFollowWithError = (follow: FollowWithStatus | FollowWithError): follow is FollowWithError =>
  follow.status === "failed";

interface FollowListProps {
  followTypes: FollowType[];
  follows: FollowWithStatus[] | FollowWithError[];
  unfollowing: boolean;
  completed: boolean;
  header: JSX.Element;
}

const FollowList = ({ followTypes, follows, unfollowing, completed, header }: FollowListProps): JSX.Element => {
  const [viewSize, setViewSize] = useState(ViewSize.TEN);
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

  const failedFollows = follows.filter((follow) => follow.status === "failed");

  const followsToShow = completed && failedFollows.length > 0 ? failedFollows : follows;

  return (
    <div className="unfollow-follows-list">
      <div className="results-table">
        <div className="results-table-options">
          <FollowListOptions {...{ followTypes, viewSize, setViewSize }} />
        </div>
        <div className="results-view">
          {header}
          {unfollowing && <Loading />}
          <div className="follow-list">
            {followsToShow.slice(pageIndex * viewSize, (pageIndex + 1) * viewSize).map((details) => (
              <FollowInfo
                key={details.follow.id}
                status={details.status}
                follow={details.follow}
                description={
                  isFollowWithError(details) ? `Could not unfollow. Error: ${details.error.message}` : undefined
                }
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
              disabled={(pageIndex + 1) * viewSize >= follows.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowList;
