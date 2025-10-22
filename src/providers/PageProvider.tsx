import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

import { endLoading, startLoading } from '@/libs/nprogress';
import { usePage } from '@/modules/page/usePage';
import { Footer } from '@/ui/common/Footer';
import { Header } from '@/ui/common/Header';

type Props = {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
};

function PageProvider({ children, showHeader = true, showFooter = true }: Props) {
  const { onLoad } = usePage();

  const render = useMemo(() => {
    return (
      <div className='flex flex-col min-h-screen bg-[#FCFCFC]'>
        {showHeader && <Header />}
        {children}
        {showFooter && <Footer />}
      </div>
    );
  }, [children, showHeader, showFooter]);

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
