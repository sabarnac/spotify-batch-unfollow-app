import "./UnfollowFollows.css";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { FollowType, Follow, getResultTypesForFollowTypes, PERMISSION_OPTIONS } from "../../../client/spotify/model";
import FollowsRemove from "./partials/FollowsRemove";
import FollowsSelect from "./partials/FollowsSelect";
import AppContext from "../store/AppContext";

// import Loading from "../../partials/loading/Loading";
enum UnfollowView {
  SELECT = "select",
  REMOVE = "remove",
}

const UnfollowFollows = (): JSX.Element => {
  const { permissions } = useContext(AppContext);
  const [followTypes, setFollowTypes] = useState(
    new Set<FollowType>(
      [...permissions]
        .map((permission) => PERMISSION_OPTIONS.find((option) => option.permission === permission)!)
        .map((option) => option?.id),
    ),
  );
  const [view, setView] = useState(UnfollowView.SELECT);
  const [followsToRemove, setFollowsToRemove] = useState(new Set<Follow>());

  const followTypeList = useMemo(() => [...followTypes], [followTypes]);

  useEffect(() => {
    setFollowsToRemove((follows) => {
      [...follows]
        .filter((follow) => !getResultTypesForFollowTypes(...followTypes).includes(follow.type))
        .forEach((follow) => follows.delete(follow));
      return new Set(follows);
    });
  }, [followTypes, setFollowsToRemove]);

  const updateFollowTypes = useCallback(
    (...followTypes: FollowType[]) => {
      setFollowTypes(new Set(followTypes));
    },
    [setFollowTypes],
  );
  const addFollows = useCallback(
    (...followsToAdd: Follow[]) =>
      setFollowsToRemove((follows) => {
        followsToAdd.forEach((follow) => follows.add(follow));
        return new Set(follows);
      }),
    [setFollowsToRemove],
  );
  const removeFollows = useCallback(
    (...followsToRemove: Follow[]) =>
      setFollowsToRemove((follows) => {
        followsToRemove.forEach((follow) => follows.delete(follow));
        return new Set(follows);
      }),
    [setFollowsToRemove],
  );

  return (
    <div className="unfollow-follows">
      {view === UnfollowView.SELECT ? (
        <FollowsSelect
          followTypes={followTypeList}
          setFollowTypes={updateFollowTypes}
          selectedFollows={[...followsToRemove]}
          addFollows={addFollows}
          removeFollows={removeFollows}
          startUnfollow={() => setView(UnfollowView.REMOVE)}
        />
      ) : (
        <FollowsRemove
          followTypes={followTypeList}
          follows={[...followsToRemove]}
          restartUnfollow={() => {
            setFollowsToRemove(new Set());
            setView(UnfollowView.SELECT);
          }}
        />
      )}
    </div>
  );
};

export default UnfollowFollows;
