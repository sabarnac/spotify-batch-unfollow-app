import { useEffect, useState } from "react";

import { FetchError } from "./retry-fetch";

interface Generator<A extends any[], T, TReturn = any, TNext = unknown> {
  (...args: A): AsyncGenerator<T, TReturn, TNext>;
}

type UseCallResult<R> = [R[], boolean, Error | undefined];

const useStreamCall = <A extends any[], R>(
  apiCall: Generator<A, R>,
  runNow: boolean,
  ...apiArguments: A
): UseCallResult<R> => {
  const [result, setResult] = useState<R[]>([]);
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!runNow) {
      return;
    }

    setLoading(true);
    setResult([]);
    setError(undefined);

    let abort: boolean = false;
    (async () => {
      try {
        for await (const newResult of apiCall(...apiArguments)) {
          if (abort === false) {
            setResult((oldResult) => [...oldResult, newResult]);
          }
        }
        if (abort === false) {
          setLoading(false);
        }
      } catch (error) {
        const errorObj = error as FetchError;
        if (errorObj.name !== "AbortError" && abort === false) {
          setError(errorObj);
          setLoading(false);
        }
      }
    })();

    return () => {
      abort = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiCall, runNow, ...apiArguments]);

  return [result, loading, error];
};

export default useStreamCall;
