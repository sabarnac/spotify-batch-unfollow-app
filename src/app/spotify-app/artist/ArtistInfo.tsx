import "./ArtistInfo.css";

import classNames from "classnames";
import React from "react";

import { Artist } from "../../../client/spotify/model";
import DefaultImage from "./default.png";

export enum ArtistStatus {
  SELECTED = "selected",
  SUCCEEEDED = "succeeded",
  FAILED = "failed",
}

interface ArtistProps {
  artist: Artist;
  description?: string;
  status?: ArtistStatus;
  onClick?: () => void;
}

const ArtistInfo = ({ artist, status, onClick, description }: ArtistProps): JSX.Element => (
  <div className={classNames("artist", status, { clickable: !!onClick })} onClick={onClick}>
    <div className="avatar">
      <img src={artist.images[0]?.url ?? DefaultImage} alt={`Artist ${artist.name}`} />
    </div>
    <h3 className="name">{artist.name}</h3>
    {description && <div className="description">{description}</div>}
  </div>
);

export default ArtistInfo;
