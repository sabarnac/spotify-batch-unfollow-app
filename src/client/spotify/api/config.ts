export const SPOTIFY_API_URL: string = "https://api.spotify.com/v1";
export const BATCH_SIZE: number = 50;

const SpotifyConfig = new (class {
  public userToken: string | undefined = undefined;
  public resetToken: () => void = () => {};
})();

export default SpotifyConfig;
