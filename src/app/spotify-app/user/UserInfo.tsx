import "./UserInfo.css";

import React from "react";

import { useGetCurrentUser } from "../../../client/spotify";

const UserInfo = (): JSX.Element => {
  const [user, loading, error] = useGetCurrentUser();

  return (
    <div className="user">
      {error ? (
        <div className="error">Error retrieving user info: {error.message}</div>
      ) : loading ? (
        <div className="warning">Retrieving user info</div>
      ) : user ? (
        <div className="info">
          Logged in as: <strong>{user.id}</strong>
        </div>
      ) : (
        <div className="error">Not logged in</div>
      )}
    </div>
  );
};

export default UserInfo;
