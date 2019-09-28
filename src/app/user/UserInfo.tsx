import React, { useContext, useState } from "react"
import SpotifyContext from "../SpotifyContext"

export default (): JSX.Element => {
  const { spotifyApiUrl, token } = useContext(SpotifyContext)

  const [user, setUser] = useState({})
  const [error, setError] = useState(null)

  React.useEffect(() => {
    fetch(`${spotifyApiUrl}/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => setError(error))
  }, [token, spotifyApiUrl])

  return error ? (
    <div>{error}</div>
  ) : user ? (
    <div>{JSON.stringify(user)}</div>
  ) : (
    <div>Not logged in.</div>
  )
}
