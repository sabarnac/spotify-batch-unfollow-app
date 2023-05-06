/**
 * Class for describing a fetch error details.
 */
export class FetchError extends Error {
  private _status: number;
  private _body: string;
  private _headers: Headers;

  constructor(status: number, body: string, headers: Headers) {
    super(`Error has occurred performing the request due to error: ${body} [Status Code: ${status}]`);
    this._status = status;
    this._body = body;
    this._headers = headers;
  }

  /**
   * Get the status code of the error response.
   */
  public get status(): number {
    return this._status;
  }

  /**
   * Get the body of the error response.
   */
  public get body(): string {
    return this._body;
  }

  /**
   * Get the headers of the error response.
   * @return {Headers}
   */
  public get headers(): Headers {
    return this._headers;
  }
}

interface CountInfo {
  attemptCount: number;
  maxAttemptCount: number;
}

/**
 * Perform a fetch with a retry mechanism.
 * @param url The URL to fetch.
 * @param requestContext Context information for the request.
 * @param retryableErrorCodes Error codes to retry on.
 *
 * @returns The fetch result.
 * @throws {Error} The error response of the fetch.
 */
const retryFetch = async (
  url: string,
  requestContext?: RequestInit,
  retryableErrorCodes?: number[],
): Promise<Response> =>
  new Promise(async (resolve, reject): Promise<void> => {
    const countInfo: CountInfo = {
      attemptCount: 0,
      maxAttemptCount: 3,
    };

    handleFetchResponse(
      resolve,
      reject,
      await fetch(url, requestContext),
      countInfo,
      url,
      requestContext,
      retryableErrorCodes,
    );
  });

const handleFetchResponse = async (
  resolve: Function,
  reject: Function,
  response: Response,
  countInfo: CountInfo,
  url: string,
  requestContext?: RequestInit,
  retryableErrorCodes?: number[],
) => {
  if (response.ok) {
    resolve(response);
  } else if (
    countInfo.attemptCount < countInfo.maxAttemptCount &&
    isRetryableCode(response.status, retryableErrorCodes)
  ) {
    countInfo.attemptCount++;
    performFetch(resolve, reject, response, countInfo, url, requestContext, retryableErrorCodes);
  } else {
    reject(new FetchError(response.status, (await response.json()).error.message, response.headers));
  }
};

const getNextRetryTime = (response: Response, countInfo: CountInfo) => {
  const nextRetryTime: string = response.headers.get("Retry-After") || "0";
  return Math.max(Math.pow(2, countInfo.attemptCount - 1) * 1000, Number(nextRetryTime));
};

const performFetch = (
  resolve: Function,
  reject: Function,
  priorResponse: Response,
  countInfo: CountInfo,
  url: string,
  requestContext?: RequestInit,
  retryableErrorCodes?: number[],
) => {
  setTimeout(async () => {
    let response: Response = await fetch(url, requestContext);
    handleFetchResponse(resolve, reject, response, countInfo, url, requestContext, retryableErrorCodes);
  }, getNextRetryTime(priorResponse, countInfo));
};

const isRetryableCode = (code: number, retryableErrorCodes?: number[]) =>
  code >= 500 || (retryableErrorCodes && retryableErrorCodes.indexOf(code) >= 0);

export default retryFetch;
