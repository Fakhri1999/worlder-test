import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { PageNotFound } from '@/pages/404';

import { routesUrl } from './routesConfig';

const Index = lazy(() =>
  import('@/pages/Index').then((mod) => ({ default: mod.Index })),
);
const MoviesPage = lazy(() =>
  import('@/pages/Movies').then((mod) => ({ default: mod.Index })),
);
const MovieDetailPage = lazy(() =>
  import('@/pages/MovieDetail').then((mod) => ({ default: mod.MovieDetail })),
);

function Router() {
  return (
    <Routes>
      <Route path={routesUrl.index} element={<Index />} />
      <Route path={routesUrl.movies} element={<MoviesPage />} />
      <Route path='/movies/:id' element={<MovieDetailPage />} />
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  );
}

export { routesUrl, Router };
