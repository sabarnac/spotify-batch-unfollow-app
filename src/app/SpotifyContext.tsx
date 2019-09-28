import React from "react"

interface InitialContextType {
  spotifyApiUrl: string
  token?: string
}

export const InitialContext: InitialContextType = {
  spotifyApiUrl: "https://api.spotify.com/v1",
}

const SpotifyContext = React.createContext(InitialContext)

export const SpotifyProvider = SpotifyContext.Provider
export const SpotifyConsumer = SpotifyContext.Consumer
export default SpotifyContext
