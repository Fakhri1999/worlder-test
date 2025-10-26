import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

import { endLoading, startLoading } from '@/libs/nprogress';
import { usePage } from '@/modules/page/usePage';
import { LanguageSwitcherContainer } from '@/ui/LanguageSwitcherContainer';

type Props = {
  children: ReactNode;
};

function PageProvider({ children }: Props) {
  const { onLoad } = usePage();

  const render = useMemo(() => {
    return (
      <div className='relative flex flex-col min-h-screen'>
        {/* Language Switcher - Absolute positioned */}
        <div className='absolute top-4 right-4 md:top-8 md:right-8 z-10 animate-slideInRight'>
          <LanguageSwitcherContainer />
        </div>
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
