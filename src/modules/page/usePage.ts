import { useCallback, useContext } from 'react';

import { SuspenseFallbackContext } from '../../providers/SuspenseFallbackProvider';
import type { FallbackType } from '../../providers/SuspenseFallbackProvider';

export const usePage = () => {
  const { updateFallback } = useContext(SuspenseFallbackContext);

  const onLoad = useCallback(
    (component: FallbackType | undefined) => {
      updateFallback(component === undefined ? null : component);
    },
    [updateFallback],
  );

  return { onLoad };
};
