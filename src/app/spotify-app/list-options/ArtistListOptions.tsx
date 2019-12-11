import React from "react";
import "./ArtistListOptions.css";
import Select from "../../partials/select/Select";
import Input from "../../partials/input/Input";
import { isNullOrUndefined } from "util";

export enum ArtistViewSize {
  FIFTY = 50,
  TWENTY_FIVE = 25,
  TEN = 10,
}

const VIEW_OPTIONS = [
  { label: ArtistViewSize.TEN, id: ArtistViewSize.TEN },
  { label: ArtistViewSize.TWENTY_FIVE, id: ArtistViewSize.TWENTY_FIVE },
  { label: ArtistViewSize.FIFTY, id: ArtistViewSize.FIFTY },
];

interface ArtistListProps {
  viewSize?: ArtistViewSize;
  setViewSize?: (size: ArtistViewSize) => void;
  filterString?: string;
  setFilterString?: (filterString: string) => void;
}

export default ({
  viewSize,
  setViewSize,
  filterString,
  setFilterString,
}: ArtistListProps): JSX.Element => (
  <div className="artist-list-options">
    <h2>View Options</h2>
    {!isNullOrUndefined(filterString) && setFilterString && (
      <div className="filter-option">
        <label>Search Artists:</label>
        <Input value={filterString} onChange={setFilterString} />
      </div>
    )}
    {!isNullOrUndefined(viewSize) && setViewSize && (
      <div className="view-option">
        <label>Artists Per Page:</label>
        <Select
          value={viewSize}
          onChange={setViewSize}
          options={VIEW_OPTIONS}
        />
      </div>
    )}
    <button
      className="warning"
      onClick={() => {
        setFilterString?.("");
        setViewSize?.(ArtistViewSize.TEN);
      }}
    >
      Reset
    </button>
  </div>
);
