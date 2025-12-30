import { useCallback, useEffect, useState } from "react";
import Loading from "../app/partials/loading/Loading";

interface UseOauth2PkceProps {
  authorizeUrl: string;
  tokenUrl: string;
  scope: string;
  clientId: string;
  redirectUri: string;
}

interface UseOuath2PkceData {
  accessToken: string;
}

const generateRandomString = (length: number) => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const createCodeTokens = async () => {
  const authState = generateRandomString(64);
  window.localStorage.setItem("authState", authState);

  const codeVerifier = generateRandomString(64);
  const codeChallenge = base64encode(await sha256(codeVerifier));
  window.localStorage.setItem("codeVerifier", codeVerifier);
  return { codeVerifier, codeChallenge, authState };
};

const saveAccessToken = (token: string) => {
  window.localStorage.setItem("accessToken", token);
};

const saveAccessError = (error: string) => {
  window.localStorage.setItem("accessError", error);
};

const getAuthState = () => {
  return window.localStorage.getItem("authState") ?? undefined;
};

const getCodeVerifier = () => {
  return window.localStorage.getItem("codeVerifier") ?? undefined;
};

const getAccessToken = () => {
  return window.localStorage.getItem("accessToken") ?? undefined;
};

const getAccessError = () => {
  return window.localStorage.getItem("accessError") ?? undefined;
};

const clearAuthState = () => {
  window.localStorage.removeItem("authState");
};

const clearCodeVerifier = () => {
  window.localStorage.removeItem("codeVerifier");
};

const clearAccessToken = () => {
  window.localStorage.removeItem("accessToken");
};

const clearAccessError = () => {
  window.localStorage.removeItem("accessError");
};

const clearAll = () => {
  clearAuthState();
  clearCodeVerifier();
  clearAccessToken();
  clearAccessError();
};

const requestAccessToken = async (
  { tokenUrl, redirectUri, clientId }: Omit<Omit<UseOauth2PkceProps, "authorizeUrl">, "scope">,
  code: string,
) => {
  const codeVerifier = getCodeVerifier();

  console.log("Checking code verifier");
  if (!codeVerifier) {
    throw new Error("invalid_code_verifier");
  }

  console.log("Generating request info");
  const url = tokenUrl;
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  };

  console.log("Running request");
  const body = await fetch(url, payload);
  if (!body.ok) {
    const bodyDetails = await body.json();
    console.error(`Request failed due to error: ${body.status}, ${body.statusText}`, bodyDetails);
    throw new Error(bodyDetails.error);
  }

  console.log("Received access token!");
  const response: { access_token: string } = await body.json();
  return response.access_token;
};

const startAuthFlow = async ({ authorizeUrl, scope, clientId, redirectUri }: Omit<UseOauth2PkceProps, "tokenUrl">) => {
  const { codeChallenge, authState } = await createCodeTokens();

  const authUrl = new URL(authorizeUrl);
  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    state: authState,
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
};

export const Oauth2PkceCallback = ({
  tokenUrl,
  redirectUri,
  clientId,
}: Omit<Omit<UseOauth2PkceProps, "authorizeUrl">, "scope">) => {
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      return;
    }

    if (!!getAccessToken() || !!getAccessError()) {
      window.location.href = "/";
      return;
    }

    const redirectUrl = new URL(redirectUri);
    const currentUrl = new URL(window.location.href);
    console.log("Validating callback path checks");
    if (redirectUrl.protocol !== currentUrl.protocol) {
      window.location.href = "/";
      return;
    }
    if (redirectUrl.host !== currentUrl.host) {
      window.location.href = "/";
      return;
    }
    if (redirectUrl.pathname !== currentUrl.pathname) {
      window.location.href = "/";
      return;
    }

    console.log("Validating URL query param checks");
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has("state")) {
      window.location.href = "/";
      return;
    }
    const givenAuthState = urlParams.get("state")!;
    const savedAuthState = getAuthState();
    if (!savedAuthState || givenAuthState !== savedAuthState) {
      console.log(savedAuthState, givenAuthState);
      saveAccessError("invalid_state_token");
      window.location.href = "/";
      return;
    }
    if (urlParams.has("error")) {
      saveAccessError(urlParams.get("error")!);
      window.location.href = "/";
      return;
    }
    if (!urlParams.has("code")) {
      saveAccessError("no_code_found");
      window.location.href = "/";
      return;
    }

    setIsRunning(true);
    console.log("Requesting access code");
    const code = urlParams.get("code")!;
    requestAccessToken({ tokenUrl, redirectUri, clientId }, code)
      .then((accessToken) => {
        clearCodeVerifier();
        clearAuthState();
        clearAccessError();
        saveAccessToken(accessToken);
        window.location.href = "/";
      })
      .catch((err) => {
        if (getAccessToken()) {
          clearCodeVerifier();
          clearAuthState();
          clearAccessError();
          return;
        }
        clearCodeVerifier();
        clearAuthState();
        saveAccessError((err as Error).message);
        window.location.href = "/";
      });
  }, [isRunning, tokenUrl, redirectUri, clientId]);

  return <Loading text="Logging in" />;
};

export const useOauth2Pkce = ({ authorizeUrl, scope, clientId, redirectUri }: Omit<UseOauth2PkceProps, "tokenUrl">) => {
  const [data, setData] = useState<UseOuath2PkceData | undefined>(() => {
    const accessToken = getAccessToken();
    return accessToken ? { accessToken } : undefined;
  });
  const [error, setError] = useState<string | undefined>(() => {
    const error = getAccessError();
    return error ? error : undefined;
  });
  const [loading, setLoading] = useState(() => {
    return !!getCodeVerifier() && !getAccessError() && !getAccessToken();
  });

  const start = useCallback(() => {
    setLoading(true);
    clearAll();
    startAuthFlow({ authorizeUrl, scope, clientId, redirectUri });
  }, [authorizeUrl, scope, clientId, redirectUri]);

  const logout = useCallback(() => {
    clearAll();
    setData(undefined);
    setError(undefined);
    setLoading(false);
  }, []);

  return { data, error, loading, start, logout };
};
