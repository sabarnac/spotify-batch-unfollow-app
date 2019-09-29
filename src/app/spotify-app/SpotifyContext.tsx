import React from "react"

interface InitialContextType {
  token?: string
  resetToken?: Function
}

export const InitialContext: InitialContextType = {}

const SpotifyContext = React.createContext(InitialContext)

export const SpotifyProvider = SpotifyContext.Provider
export const SpotifyConsumer = SpotifyContext.Consumer
export default SpotifyContext
