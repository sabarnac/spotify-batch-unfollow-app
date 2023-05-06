import "./FollowInfo.css";

import classNames from "classnames";
import React from "react";

import { Follow, RESULTS_TYPE_NAME_SINGULAR_CAP } from "../../../client/spotify/model";
import DefaultImage from "./default.png";
import SpotifyLogo from "./spotify-logo.png";

export type FollowStatus = "selected" | "succeeded" | "failed";

interface FollowProps {
  follow: Follow;
  description?: string;
  status?: FollowStatus;
  onClick?: () => void;
}

const FollowInfo = ({ follow, status, onClick, description }: FollowProps): JSX.Element => (
  <div
    className={classNames("follow", status, { clickable: !!onClick })}
    onClick={(e) => {
      if (
        (e.target as any).classList.contains("follow-link") ||
        (e.target as any).classList.contains("spotify-link-logo")
      ) {
        return;
      }
      return onClick?.();
    }}
  >
    <div className="avatar">
      <img src={follow.images[0]?.url ?? DefaultImage} alt={`${follow.name} Avatar`} />
    </div>
    <h3 className="name">{follow.name}</h3>
    <div className="type">{RESULTS_TYPE_NAME_SINGULAR_CAP[follow.type]}</div>
    <a className="follow-link" href={follow.external_urls.spotify} target="_blank" rel="noopener noreferrer">
      View on <img className="spotify-link-logo" src={SpotifyLogo} alt="Spotify Logo" />
    </a>
    {description && <div className="description">{description}</div>}
  </div>
);

export default FollowInfo;
