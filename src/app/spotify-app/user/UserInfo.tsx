import React from "react";
import "./UserInfo.css";
import { useGetCurrentUser } from "../../../client/spotify";

export default (): JSX.Element => {
  const [user, loading, error] = useGetCurrentUser();

  return error ? (
    <div className="user error">
      Error retrieving user info: {error.message}
    </div>
  ) : loading ? (
    <div className="user error">Retrieving user info</div>
  ) : user ? (
    <div className="user info">
      Logged in as: <strong>{user.email}</strong>
    </div>
  ) : (
    <div className="user info">Not logged in</div>
  );
};
