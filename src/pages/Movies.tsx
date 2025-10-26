import { PageProvider } from '@/providers/PageProvider';
import { MovieListContainer } from '@/ui/movie/MovieListContainer';

function Index() {
  return (
    <PageProvider>
      <MovieListContainer />
    </PageProvider>
  );
}

export { Index };
