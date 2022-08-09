import { useCallback, useState } from "react";

const useForceupdate = () => {
  const [, setState] = useState(true);

  return useCallback(() => setState((oldState) => !oldState), []);
};

export default useForceupdate;
