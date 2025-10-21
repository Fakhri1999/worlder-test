import { createContext, Suspense, useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type FallbackType = NonNullable<ReactNode> | null;

export type SuspenseFallbackContextType = {
  updateFallback: (fallback: FallbackType) => void;
};

export const SuspenseFallbackContext =
  createContext<SuspenseFallbackContextType>({
    updateFallback: () => {},
  });

type Props = {
  children: ReactNode;
};

function SuspenseFallbackProvider({ children }: Props) {
  const [fallback, setFallback] = useState<FallbackType>(null);

  const updateFallback = useCallback((newFallback: FallbackType) => {
    setFallback(() => newFallback);
  }, []);

  const renderChildren = useMemo(() => {
    return children;
  }, [children]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <SuspenseFallbackContext.Provider value={{ updateFallback }}>
      <Suspense fallback={fallback}>{renderChildren}</Suspense>
    </SuspenseFallbackContext.Provider>
  );
}
export { SuspenseFallbackProvider };
