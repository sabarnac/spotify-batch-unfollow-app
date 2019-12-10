import React from "react";
import "./Artist.css";
import { Artist } from "../../../client/spotify/model";
import classNames from "classnames";

interface ArtistProps {
  artist: Artist;
  isSelected: boolean;
  onClick: () => void;
}

export default ({ artist, isSelected, onClick }: ArtistProps): JSX.Element => (
  <div
    className={classNames("artist", { selected: isSelected })}
    onClick={onClick}
  >
    <div className="avatar">
      <img src={artist.images[0].url} alt={`Artist ${artist.name}`} />
    </div>
    <h3 className="name">{artist.name}</h3>
  </div>
);
