import retryFetch, { FetchError } from "../../../util/retry-fetch";
import config, { SPOTIFY_API_URL } from "../api/config";

type RequestPathParams = (string | number)[];
type RequestQueryParams = Record<string, string | number | null | undefined>;

const createQueryPath = (queryObj?: RequestQueryParams): string =>
  queryObj
    ? "?" +
      Object.keys(queryObj)
        .filter((queryKey: string) => queryObj[queryKey] !== undefined && queryObj[queryKey] !== null)
        .map((queryKey: string) => `${queryKey}=${queryObj[queryKey]}`)
        .join("&")
    : "";

const createRequestContext = (body?: BodyInit | null, headers?: HeadersInit, method?: string): RequestInit => ({
  headers: {
    Authorization: `Bearer ${config.userToken}`,
    ...headers,
  },
  body,
  method,
});

const sendRequest = async (
  pathParams: RequestPathParams,
  queryParams?: RequestQueryParams,
  body?: BodyInit | null,
  headers?: HeadersInit,
  method?: string,
): Promise<Response> => {
  const requestPath: string = [SPOTIFY_API_URL, ...pathParams].join("/") + "/";

  const queryPath: string = createQueryPath(queryParams);

  return retryFetch(requestPath + queryPath, createRequestContext(body, headers, method), [429]).catch(
    (error: FetchError): Response => {
      if (error.status !== 401) {
        throw error;
      } else {
        config.resetToken();
        throw error;
      }
    },
  );
};
export default sendRequest;
