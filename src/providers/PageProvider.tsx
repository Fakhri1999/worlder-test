import { Flex } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

import { endLoading, startLoading } from '@/libs/nprogress';
import { usePage } from '@/modules/page/usePage';
import { Footer } from '@/ui/common/Footer';
import { Header } from '@/ui/common/Header';

type Props = {
  children: ReactNode;
};

function PageProvider({ children }: Props) {
  const { onLoad } = usePage();

  const render = useMemo(() => {
    return (
      <Flex flexDir='column' minH='100vh' bgColor='#FCFCFC'>
        <Header />
        {children}
        <Footer />
      </Flex>
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
