import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { matchPI } from 'ts-adt';

import { useAuthUser } from '@/modules/auth/authHooks';
import type { Movie } from '@/modules/movie/movieEntity';
import { useFavoritesMachine } from '@/modules/movie/movieFavoritesMachineHooks';
import { useMovieMachine } from '@/modules/movie/movieMachineHooks';
import { PageProvider } from '@/providers/PageProvider';
import { routesUrl } from '@/routes/routesConfig';
import { MovieCard } from '@/ui/movie/MovieCard';

type MovieCategory = 'popular' | 'now_playing' | 'top_rated' | 'favorites';

type CategoryConfig = {
  value: MovieCategory;
  label: string;
  emoji: string;
  gradient: string;
  shadow: string;
  requiresAuth?: boolean;
};

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    value: 'popular',
    label: 'Popular',
    emoji: '🔥',
    gradient: 'from-blue-500 to-purple-600',
    shadow: 'shadow-blue-500/50',
  },
  {
    value: 'now_playing',
    label: 'Now Playing',
    emoji: '🎬',
    gradient: 'from-pink-500 to-rose-600',
    shadow: 'shadow-pink-500/50',
  },
  {
    value: 'top_rated',
    label: 'Top Rated',
    emoji: '⭐',
    gradient: 'from-yellow-500 to-orange-600',
    shadow: 'shadow-yellow-500/50',
  },
  {
    value: 'favorites',
    label: 'Favorites',
    emoji: '❤️',
    gradient: 'from-red-500 to-pink-600',
    shadow: 'shadow-red-500/50',
    requiresAuth: true,
  },
];

function Index() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get category from URL query params, default to 'popular'
  const urlCategory = searchParams.get('category') as MovieCategory | null;
  const validCategories: MovieCategory[] = [
    'popular',
    'now_playing',
    'top_rated',
    'favorites',
  ];
  const initialCategory: MovieCategory =
    urlCategory && validCategories.includes(urlCategory)
      ? urlCategory
      : 'popular';

  const [category, setCategory] = useState<MovieCategory>(initialCategory);

  const [movieState, movieSend] = useMovieMachine();
  const [favoritesState, favoritesSend] = useFavoritesMachine();
  const { user, isAuthReady } = useAuthUser();

  // Track if initial fetch has been triggered
  const initialFetchDone = useRef(false);

  // Filter categories based on authentication
  const visibleCategories = useMemo(
    () => CATEGORY_CONFIGS.filter((config) => !config.requiresAuth || user?.uid),
    [user?.uid],
  );

  // Load favorites on mount
  useEffect(() => {
    if (!isAuthReady) {
      // Wait for auth to initialize
      return;
    }

    if (!user?.uid) {
      // Auth is ready but no user logged in - mark as initialized
      favoritesSend({ type: 'SKIP_FAVORITES' });
      return;
    }

    favoritesSend({ type: 'LOAD_FAVORITES' });
  }, [favoritesSend, user?.uid, isAuthReady]);

  // Fetch initial category from URL on mount (only once)
  useEffect(() => {
    if (initialFetchDone.current) return;

    if (category === 'favorites') {
      movieSend({ type: 'FETCH_FAVORITES' });
    } else if (category === 'now_playing') {
      movieSend({ type: 'FETCH_NOW_PLAYING', data: { page: 1 } });
    } else if (category === 'top_rated') {
      movieSend({ type: 'FETCH_TOP_RATED', data: { page: 1 } });
    } else {
      movieSend({ type: 'FETCH_MOVIES', data: { page: 1 } });
    }

    initialFetchDone.current = true;
  }, [category, movieSend]);

  const handleCategoryChange = (newCategory: MovieCategory) => {
    setCategory(newCategory);
    // Update URL query params
    setSearchParams({ category: newCategory });

    if (newCategory === 'favorites') {
      movieSend({ type: 'FETCH_FAVORITES' });
    } else if (newCategory === 'now_playing') {
      movieSend({ type: 'FETCH_NOW_PLAYING', data: { page: 1 } });
    } else if (newCategory === 'top_rated') {
      movieSend({ type: 'FETCH_TOP_RATED', data: { page: 1 } });
    } else {
      movieSend({ type: 'FETCH_MOVIES', data: { page: 1 } });
    }
  };

  const handleToggleFavorite = (movie: Movie) => {
    if (!user?.uid) {
      alert('Please login first to favorite movies');
      return;
    }

    const isFavorite = favoritesState.context.favoriteIds.has(movie.id);

    if (isFavorite) {
      favoritesSend({
        type: 'REMOVE_FAVORITE',
        data: { movieId: movie.id },
      });
    } else {
      favoritesSend({
        type: 'ADD_FAVORITE',
        data: { movie },
      });
    }
  };

  const handlePageChange = (page: number) => {
    if (category === 'now_playing') {
      movieSend({ type: 'FETCH_NOW_PLAYING', data: { page } });
    } else if (category === 'top_rated') {
      movieSend({ type: 'FETCH_TOP_RATED', data: { page } });
    } else {
      movieSend({ type: 'FETCH_MOVIES', data: { page } });
    }
  };

  return (
    <PageProvider>
      <div className='flex flex-col flex-1 w-full min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden'>
        {/* Animated Background Elements */}
        <div
          className='absolute inset-0 opacity-20'
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Floating Orbs */}
        <div className='absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob' />
        <div className='absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000' />
        <div className='absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000' />

        <div className='relative container mx-auto px-4 py-8 md:py-12'>
          {/* Header */}
          <div className='flex flex-col mb-12 animate-fadeIn'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8'>
              <div className='mb-6 md:mb-0'>
                <h1 className='text-6xl md:text-7xl font-black bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 tracking-tight animate-slideInLeft'>
                  Movies
                </h1>
                <p className='text-gray-300 text-lg flex items-center gap-2 animate-slideInLeft animation-delay-100'>
                  <svg
                    className='w-5 h-5 text-yellow-400 animate-pulse'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                  Discover amazing movies from around the world
                </p>
              </div>
              <Link to={routesUrl.index}>
                <button
                  type='button'
                  className='group px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2 shadow-lg hover:shadow-xl animate-slideInRight'>
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
                  Back to Home
                </button>
              </Link>
            </div>

            {/* Category Tabs */}
            <div className='flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide'>
              {visibleCategories.map((config) => (
                <button
                  key={config.value}
                  type='button'
                  onClick={() => handleCategoryChange(config.value)}
                  className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    category === config.value
                      ? `bg-linear-to-r ${config.gradient} text-white shadow-lg ${config.shadow}`
                      : 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20'
                  }`}>
                  {config.emoji} {config.label}
                </button>
              ))}
            </div>

            {movieState.hasTag('loading') && (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                {Array.from({ length: 20 }).map((_, index) => (
                  <div
                    key={index}
                    className='h-full flex flex-col rounded-2xl overflow-hidden shadow-lg bg-linear-to-br from-gray-900 to-black animate-pulse'>
                    {/* Image Skeleton */}
                    <div className='relative aspect-2/3 bg-gray-800'>
                      {/* Top Section Placeholders */}
                      <div className='absolute inset-0 flex flex-col justify-between p-4'>
                        <div className='flex items-start justify-between'>
                          {/* Rating Circle Skeleton */}
                          <div className='w-14 h-14 rounded-full bg-gray-700/50' />
                          {/* Year Badge Skeleton */}
                          <div className='w-16 h-6 bg-gray-700/50 rounded-full' />
                        </div>
                      </div>
                    </div>

                    {/* Title Section Skeleton */}
                    <div className='p-4 bg-linear-to-br from-gray-900 to-black min-h-[88px] flex flex-col justify-center space-y-2'>
                      <div className='h-5 bg-gray-700/50 rounded w-4/5' />
                      <div className='h-4 bg-gray-700/50 rounded w-3/5' />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {movieState.context?.error && (
              <div className='bg-linear-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl p-8 text-center shadow-xl'>
                <div className='w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-red-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <p className='text-white font-bold text-xl mb-2'>
                  Oops! Something went wrong
                </p>
                <p className='text-gray-300'>
                  {matchPI(movieState.context.error)(
                    {
                      FETCH_ERROR: (err) =>
                        `Error ${err.status}: ${err.message}`,
                      DECODE_ERROR: (err) =>
                        `Data Decode Error: ${err.message}`,
                      UNKNOWN_ERROR: () => `An unknown error occurred.`,
                    },
                    () => 'An error occurred',
                  )}
                </p>
              </div>
            )}

            {/* Movies Grid */}
            {movieState.matches('Idle') && movieState.context.movies && (
              <>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                  {movieState.context.movies.map(
                    (movie: Movie, index: number) => (
                      <div
                        key={movie.id}
                        className='animate-fadeInUp'
                        style={{ animationDelay: `${index * 10}ms` }}>
                        <MovieCard
                          movie={movie}
                          isFavorite={favoritesState.context.favoriteIds.has(
                            movie.id,
                          )}
                          isLoadingFavorites={
                            !favoritesState.context.isInitialized ||
                            favoritesState.matches('Loading Favorites')
                          }
                          onToggleFavorite={handleToggleFavorite}
                        />
                      </div>
                    ),
                  )}
                </div>

                {/* Pagination - Only show for TMDB results, not favorites */}
                {movieState.context.mode === 'tmdb' && (
                  <div className='flex justify-center items-center gap-4 mt-12 mb-8'>
                    <button
                      type='button'
                      onClick={() =>
                        handlePageChange(
                          Math.max(1, movieState.context.currentPage - 1),
                        )
                      }
                      disabled={movieState.context.currentPage === 1}
                      className={clsx(
                        'group px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2 disabled:hover:bg-white/10 cursor-pointer',
                        movieState.context.currentPage === 1 &&
                          'cursor-not-allowed',
                      )}>
                      <svg
                        className='w-5 h-5 transform group-hover:-translate-x-1 transition-transform'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 19l-7-7 7-7'
                        />
                      </svg>
                      Previous
                    </button>
                    <div className='px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold shadow-lg'>
                      <span className='text-sm opacity-75'>Page</span>{' '}
                      <span className='text-xl'>
                        {movieState.context.currentPage}
                      </span>{' '}
                      <span className='text-sm opacity-75'>
                        of {movieState.context.totalPage}
                      </span>
                    </div>
                    <button
                      type='button'
                      onClick={() =>
                        handlePageChange(movieState.context.currentPage + 1)
                      }
                      disabled={
                        movieState.context.currentPage >=
                        movieState.context.totalPage
                      }
                      className={clsx(
                        'group px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2 disabled:hover:bg-white/10 cursor-pointer',
                        movieState.context.currentPage >=
                          movieState.context.totalPage && 'cursor-not-allowed',
                      )}>
                      Next
                      <svg
                        className='w-5 h-5 transform group-hover:translate-x-1 transition-transform'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageProvider>
  );
}

export { Index };
