import "./AllArtistFollows.css"

import React, { useEffect, useState } from "react"

import { useGetAllUserArtistFollows } from "../../../client/spotify"
import { Artist } from "../../../client/spotify/model"
import Loading from "../../partials/loading/Loading"
import ArtistList from "./partials/ArtistList"

interface AllArtistFollowsProps {
  selectedArtists: Artist[]
  addArtistsForRemoval: (...artists: Artist[]) => void
  removeArtistsForRemoval: (...artists: Artist[]) => void
}

export default ({
  selectedArtists,
  addArtistsForRemoval,
  removeArtistsForRemoval,
}: AllArtistFollowsProps): JSX.Element => {
  const [artistsResult, loading, error] = useGetAllUserArtistFollows()
  const [artists, setArtists] = useState<Artist[]>([])

  const addArtistToRemovalList = (artist: Artist) => {
    addArtistsForRemoval(artist)
  }
  const removeArtistFromRemovalList = (artist: Artist) => {
    removeArtistsForRemoval(artist)
  }

  useEffect(() => {
    if (artistsResult.length === 0) {
      return
    }

    const newArtists = artistsResult[artistsResult.length - 1]

    setArtists(artists => [...artists, ...newArtists])

    addArtistsForRemoval(...newArtists)
  }, [addArtistsForRemoval, artistsResult])

  return (
    <div className="all-artist-follows">
      {error && (
        <div className="error loading-message">
          Error retrieving followed artists: {error.message}
        </div>
      )}
      {!error && loading && (
        <div className="warning loading-message">
          Retrieving followed artists
        </div>
      )}
      {!error && loading && artists.length === 0 && <Loading />}
      {!error && !loading && artists.length === 0 && (
        <div className="error loading-message">No followed artists found</div>
      )}
      {!error && artists.length > 0 && (
        <ArtistList
          loadingResults={!error && loading}
          artists={artists}
          selectedArtists={selectedArtists}
          addArtist={addArtistToRemovalList}
          removeArtist={removeArtistFromRemovalList}
        />
      )}
    </div>
  )
}
