import { useState, useCallback } from "react";

export default () => {
  const [, setState] = useState(true);

  return useCallback(() => setState(oldState => !oldState), []);
};
