import React, { useContext, useState, useEffect } from "react"
import "./UserInfo.css"
import SpotifyContext from "../SpotifyContext"
import { useSpotify } from "../../../client/spotify"
import { UserInfo } from "../../../client/spotify/model"
import { Nullable, ReactState } from "../../../react-app-env"

interface UserInfoProps {
  onLoginCheck: (isLoggedIn: boolean) => void
}

export default (props: UserInfoProps): JSX.Element => {
  const { token, resetToken } = useContext(SpotifyContext)

  const spotifyApi = useSpotify(token, resetToken)
  const [user, setUser]: ReactState<Nullable<UserInfo>> = useState<
    Nullable<UserInfo>
  >(null)
  const [error, setError]: ReactState<Nullable<Error>> = useState<
    Nullable<Error>
  >(null)

  useEffect(() => {
    spotifyApi
      .getCurrentUser()
      .then((user: UserInfo) => {
        setUser(user)
        props.onLoginCheck(true)
      })
      .catch((error: Error) => {
        setError(error)
        props.onLoginCheck(false)
      })
  }, [spotifyApi, props])

  return error ? (
    <div className="user error">Error fetching user info: {error.message}</div>
  ) : user ? (
    <div className="user info">
      Logged in as: <strong>{user.email}</strong>
    </div>
  ) : (
    <div className="user info">Not logged in</div>
  )
}
