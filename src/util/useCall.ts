import { useState, useEffect } from "react";

interface Function<A extends any[], R> {
  (...args: A): Promise<R>;
}

type UseCallResult<R> = [R | undefined, boolean, Error | undefined];

export default <A extends any[], R>(
  apiCall: Function<A, R>,
  runNow: boolean,
  ...apiArguments: A
): UseCallResult<R> => {
  const [result, setResult] = useState<R>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!runNow) {
      return;
    }

    setLoading(true);
    setResult(undefined);
    setError(undefined);

    let abort: boolean = false;
    (async () => {
      try {
        const callResult = await apiCall(...apiArguments);
        if (abort === false) {
          setResult(callResult);
          setLoading(false);
        }
      } catch (error) {
        if (error.name !== "AbortError" && abort === false) {
          setError(error);
          setLoading(false);
        }
      }
    })();

    return () => {
      setLoading(false);
      abort = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiCall, runNow, ...apiArguments]);

  return [result, loading, error];
};
