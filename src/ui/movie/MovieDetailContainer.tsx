import { logEvent } from 'firebase/analytics';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { firebaseAnalytics } from '@/libs/firebase';
import { useMovieDetailMachine } from '@/modules/movie/movieDetailMachineHooks';
import { routesUrl } from '@/routes/routesConfig';
import { MovieDetail } from '@/ui/movie/MovieDetail';

function MovieDetailContainer() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [state, send] = useMovieDetailMachine();

  useEffect(() => {
    if (id) {
      send({
        type: 'FETCH_MOVIE_DETAIL',
        data: { movieId: Number(id) },
      });
    }
  }, [id, send]);

  const movieDetail = state.context.movieDetail;
  const isLoading = state.matches('Fetching Movie Detail');
  const error = state.context.error;

  useEffect(() => {
    if (movieDetail) {
      console.log('logging view_item event for movie:', movieDetail.title);
      logEvent(firebaseAnalytics, 'view_item', {
        item_id: movieDetail.id,
        item_name: movieDetail.title,
      });
    }
  }, [movieDetail]);

  return (
    <MovieDetail
      movieDetail={movieDetail}
      isLoading={isLoading}
      error={error}
      headerActions={
        <Link to={routesUrl.movies} className='inline-block mb-8'>
          <button
            type='button'
            className='group px-6 py-3 bg-app-card/50 backdrop-blur-sm text-app-primary rounded-xl hover:bg-app-card/60 transition-all duration-300 border border-app-card/20 hover:border-white/40 flex items-center gap-2 shadow-lg hover:shadow-xl'>
            <svg
              className='w-5 h-5 transform group-hover:-translate-x-1 transition-transform'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            {t('movieDetail.backToMovies')}
          </button>
        </Link>
      }
    />
  );
}

export { MovieDetailContainer };
