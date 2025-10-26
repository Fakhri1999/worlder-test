import { PageProvider } from '@/providers/PageProvider';
import { MovieDetailContainer } from '@/ui/movie/MovieDetailContainer';

function MovieDetail() {
  return (
    <PageProvider>
      <MovieDetailContainer />
    </PageProvider>
  );
}

export { MovieDetail };
