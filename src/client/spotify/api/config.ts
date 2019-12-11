export const SPOTIFY_API_URL: string = "https://api.spotify.com/v1";
export const BATCH_SIZE: number = 50;

export default new (class {
  public userToken: string | undefined = undefined;
  public resetToken: () => void = () => {};
})();
