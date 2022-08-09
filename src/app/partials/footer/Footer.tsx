import "./Footer.css";

import React from "react";

const Footer = (): JSX.Element => (
  <div className="site footer">
    <div className="item">
      <a href="https://github.com/sabarnac/spotify-batch-unfollow-app" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </div>
    <div className="item">
      <a href="https://github.com/sabarnac/spotify-batch-unfollow-app/issues" target="_blank" rel="noopener noreferrer">
        Report Issue
      </a>
    </div>
  </div>
);

export default Footer;
