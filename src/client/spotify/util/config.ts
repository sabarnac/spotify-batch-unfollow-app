export const SPOTIFY_API_URL: string = "https://api.spotify.com/v1";
export const BATCH_SIZE: number = 1;

export default new (class {
  public userToken: string | undefined = undefined;
  public resetToken: () => void = () => {};
})();
