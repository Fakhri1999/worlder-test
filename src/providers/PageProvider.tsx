import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

import { endLoading, startLoading } from '@/libs/nprogress';
import { usePage } from '@/modules/page/usePage';

type Props = {
  children: ReactNode;
};

function PageProvider({ children }: Props) {
  const { onLoad } = usePage();

  const render = useMemo(() => {
    return (
      <div className='flex flex-col min-h-screen bg-[#FCFCFC]'>
        {children}
      </div>
    );
  }, [children]);

  useEffect(() => {
    onLoad(render);
  }, [onLoad, render]);

  useEffect(() => {
    endLoading();
    return () => startLoading();
  }, []);

  return render;
}

export { PageProvider };
