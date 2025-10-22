import { createContext, Suspense, useCallback, useState } from 'react';
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

  return (
    <SuspenseFallbackContext.Provider value={{ updateFallback }}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </SuspenseFallbackContext.Provider>
  );
}
export { SuspenseFallbackProvider };
