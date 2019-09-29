import { useState, Dispatch, useEffect } from "react"
import { UserInfo, Follows, FollowedArtists, Artist } from "./model"
import { RequestQueryParams } from "../../react-app-env"
import retryFetch, { FetchError } from "../../util/retry-fetch"
import arrayChunk from "../../util/array-chunk"

/**
 * Class for communicating with Spotify API.
 */
class SpotifyApi {
  private static readonly SPOTIFY_API_URL: string = "https://api.spotify.com/v1"
  private static readonly BATCH_SIZE: number = 1

  private userToken: string
  private resetToken: Function

  public constructor(userToken?: string, resetToken?: Function) {
    this.userToken = userToken || ""
    this.resetToken = resetToken || (() => {})
  }

  /**
   * Get the current user details.
   *
   * @returns The user information.
   */
  public getCurrentUser = (): Promise<UserInfo> =>
    this.sendRequest<UserInfo>(["me"]).then(
      (response: Response): Promise<UserInfo> => response.json(),
    )

  /**
   * Get all the followed artists of the current user.
   *
   * @returns The list of all followed artists.
   */
  public getAllUserArtistFollows = async (): Promise<Artist[]> => {
    let after = undefined
    const followedArtists: Artist[] = []

    do {
      const results: FollowedArtists = await this.getUserArtistFollows(
        SpotifyApi.BATCH_SIZE,
        after,
      )
      followedArtists.push(...results.items)
      after = results.cursors.after
    } while (after !== undefined && after !== null)

    return followedArtists
  }

  /**
   * Get the followed artists of the current user.
   *
   * @param limit The limit of results to return.
   * @param after Position in the followed artists list to start the search from. Used in cases of pagination.
   *
   * @returns A cursor-paginated response of the list of followed artists.
   */
  public getUserArtistFollows = (
    limit: number,
    after?: string,
  ): Promise<FollowedArtists> => {
    const queryParams: RequestQueryParams = {
      type: "artist",
      limit: limit,
      after: after,
    }

    return this.sendRequest<Follows>(["me", "following"], queryParams)
      .then((response: Response): Promise<Follows> => response.json())
      .then((follows: Follows): FollowedArtists => follows.artists)
  }

  /**
   * Unfollow provided followed artists of the current user.
   */
  public unfollowArtistsChunked = async (
    artists: Artist[],
  ): Promise<Artist[]> => {
    const failedArtists: Artist[] = []
    const chunkedArtists: Artist[][] = arrayChunk(
      artists,
      SpotifyApi.BATCH_SIZE,
    )

    for (let i = 0; i < chunkedArtists.length; i++) {
      try {
        await this.unfollowArtists(chunkedArtists[i])
      } catch (e) {
        failedArtists.push(...chunkedArtists[i])
      }
    }

    return failedArtists
  }

  /**
   * Unfollow provided followed artists of the current user.
   */
  public unfollowArtists = (artists: Artist[]): void => {
    const queryParams: RequestQueryParams = {
      type: "artist",
    }
    const body: string = JSON.stringify({
      ids: artists.map((artist: Artist): string => artist.id),
    })
    const headers: HeadersInit = { "Content-Type": "application/json" }

    this.sendRequest<void>(
      ["me", "following"],
      queryParams,
      body,
      headers,
      "DELETE",
    )
  }

  private sendRequest = async <T>(
    pathParam: string[],
    queryObj?: RequestQueryParams,
    body?: BodyInit | null,
    headers?: HeadersInit,
    method?: string,
  ): Promise<Response> => {
    const requestPath: string =
      [SpotifyApi.SPOTIFY_API_URL, ...pathParam].join("/") + "/"

    const queryPath: string = this.createQueryPath(queryObj)

    return retryFetch(
      requestPath + queryPath,
      this.createRequestContext(body, headers, method),
      [429],
    ).catch(
      (error: FetchError): Response => {
        if (error.status !== 401) {
          throw error
        } else {
          this.resetToken()
          throw error
        }
      },
    )
  }

  private createQueryPath = (queryObj?: RequestQueryParams): string =>
    queryObj
      ? "?" +
        Object.keys(queryObj)
          .filter(
            (queryKey: string) =>
              queryObj[queryKey] !== undefined && queryObj[queryKey] !== null,
          )
          .map((queryKey: string) => `${queryKey}=${queryObj[queryKey]}`)
          .join("&")
      : ""

  private createRequestContext = (
    body?: BodyInit | null,
    headers?: HeadersInit,
    method?: string,
  ): RequestInit => ({
    headers: {
      Authorization: `Bearer ${this.userToken}`,
      ...headers,
    },
    body,
    method,
  })
}

/**
 * Returns an instance of the Spotify API initialized with the logged in user.
 * @param userToken The logged in user token.
 */
export const useSpotify = (
  userToken?: string,
  resetToken?: Function,
): SpotifyApi => {
  const [spotifyApi, setSpotifyApi]: [
    SpotifyApi,
    Dispatch<SpotifyApi>,
  ] = useState(new SpotifyApi(userToken, resetToken))

  useEffect(() => {
    setSpotifyApi(new SpotifyApi(userToken, resetToken))
  }, [userToken, resetToken])

  return spotifyApi
}
