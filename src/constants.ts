export const SPOTIFY_AUTH_DOMAIN: string = "accounts.spotify.com";
export const SPOTIFY_CLIENT_ID: string = process.env.REACT_APP_CLIENT_ID || "";
export const SPOTIFY_AUTHORIZE_URL: string = `https://${SPOTIFY_AUTH_DOMAIN}/authorize`;
export const SPOTIFY_TOKEN_URL: string = `https://${SPOTIFY_AUTH_DOMAIN}/api/token`;
export const SPOTIFY_REDIRECT_URL: string = new URL(document.location.href).origin + "/callback";
