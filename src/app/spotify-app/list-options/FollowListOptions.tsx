import "./FollowListOptions.css";

import React, { useContext } from "react";

import Input from "../../partials/input/Input";
import Select from "../../partials/select/Select";
import { FollowType, PERMISSION_OPTIONS } from "../../../client/spotify/model";
import { isNullOrUndefined } from "../../../util";
import AppContext from "../store/AppContext";
import Checkbox from "../../partials/checkbox/Checkbox";

export enum ViewSize {
  FIFTY = 50,
  TWENTY_FIVE = 25,
  TEN = 10,
}

const VIEW_OPTIONS = [
  { label: ViewSize.TEN, id: ViewSize.TEN },
  { label: ViewSize.TWENTY_FIVE, id: ViewSize.TWENTY_FIVE },
  { label: ViewSize.FIFTY, id: ViewSize.FIFTY },
];

interface FollowListOptionsProps {
  followTypes: FollowType[];
  setFollowTypes?: (...type: FollowType[]) => void;
  viewSize: ViewSize;
  setViewSize: (size: ViewSize) => void;
  filterString?: string;
  setFilterString?: (filterString: string) => void;
}

const FollowListOptions = ({
  followTypes,
  setFollowTypes,
  viewSize,
  setViewSize,
  filterString,
  setFilterString,
}: FollowListOptionsProps): JSX.Element => {
  const { permissions } = useContext(AppContext);

  return (
    <div className="follow-list-options">
      <h2>Options</h2>
      <div className="type-option">
        {PERMISSION_OPTIONS.filter(({ permission }) => permissions.has(permission)).map((option) => (
          <label key={option.id}>
            <Checkbox
              checked={followTypes.includes(option.id)}
              disabled={followTypes.includes(option.id) && followTypes.length === 1}
              onChange={(isChecked) =>
                isChecked
                  ? setFollowTypes?.(...new Set([...followTypes, option.id]))
                  : setFollowTypes?.(...new Set(followTypes.filter((type) => type !== option.id)))
              }
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <hr />
      {!isNullOrUndefined(filterString) && !isNullOrUndefined(setFilterString) ? (
        <div className="filter-option">
          <label>Search:</label>
          <Input value={filterString} onChange={setFilterString} />
        </div>
      ) : null}
      <div className="view-option">
        <label>Results per page:</label>
        <Select value={viewSize} onChange={setViewSize} options={VIEW_OPTIONS} />
      </div>
      <button
        className="warning"
        onClick={() => {
          setFilterString?.("");
          setViewSize(ViewSize.TEN);
        }}
      >
        Reset
      </button>
    </div>
  );
};

export default FollowListOptions;
