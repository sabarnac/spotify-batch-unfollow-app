import "./FollowList.css";

import { useEffect, useState } from "react";

import { RESULTS_TYPE_NAME_LC, Follow, FollowType, getFollowTypeText } from "../../../../client/spotify/model";
import Loading from "../../../partials/loading/Loading";
import FollowInfo from "../../follow/FollowInfo";
import FollowListOptions, { ViewSize } from "../../list-options/FollowListOptions";
import ListLegend from "./ListLegend";

interface FollowListProps {
  loading: boolean;
  followTypes: FollowType[];
  follows: Follow[];
  selectedFollows: Follow[];
  setFollowTypes: (...type: FollowType[]) => void;
  addFollow: (followToAdd: Follow) => void;
  removeFollow: (followToRemove: Follow) => void;
}

const FollowList = ({
  loading,
  followTypes,
  follows,
  selectedFollows,
  setFollowTypes,
  addFollow,
  removeFollow,
}: FollowListProps): JSX.Element => {
  const [viewSize, setViewSize] = useState(ViewSize.TEN);
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
          <FollowListOptions
            {...{ followTypes, setFollowTypes, viewSize, setViewSize, filterString, setFilterString }}
          />
        </div>
        <div className="results-view">
          <h2 className="list-title">Select {getFollowTypeText(RESULTS_TYPE_NAME_LC, ...followTypes)} to unfollow</h2>
          <ListLegend />
          {loading && (
            <>
              <div className="warning loading-message">
                Retrieving followed {getFollowTypeText(RESULTS_TYPE_NAME_LC, ...followTypes)}
              </div>
              <Loading />
            </>
          )}
          <div className="artist-list">
            {!loading && follows.length === 0 && (
              <div className="error loading-message">
                No followed {getFollowTypeText(RESULTS_TYPE_NAME_LC, ...followTypes)} found
              </div>
            )}
            {follows
              .filter((follow) => filterStringLc === "" || follow.name.toLowerCase().includes(filterStringLc))
              .slice(pageIndex * viewSize, (pageIndex + 1) * viewSize)
              .map((follow) => {
                const isSelected = selectedFollows.indexOf(follow) !== -1;
                return (
                  <FollowInfo
                    key={follow.id}
                    status={isSelected ? "selected" : undefined}
                    follow={follow}
                    onClick={() => (isSelected ? removeFollow(follow) : addFollow(follow))}
                  />
                );
              })}
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
