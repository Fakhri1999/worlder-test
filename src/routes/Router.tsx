import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { PageNotFound } from '@/pages/404';

import { routesUrl } from './routesConfig';

const Index = lazy(() =>
  import('@/pages/Index').then((mod) => ({ default: mod.Index })),
);
const OtherPage = lazy(() =>
  import('@/pages/OtherPage').then((mod) => ({ default: mod.Index })),
);

function Router() {
  return (
    <Routes>
      <Route path={routesUrl.index} element={<Index />} />
      <Route path={routesUrl.other} element={<OtherPage />} />
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  );
}

export { routesUrl, Router };
