import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { matchPI } from 'ts-adt';

import type { Movie } from '@/modules/movie/movieEntity';
import { useMovieMachine } from '@/modules/movie/movieMachineHooks';
import { PageProvider } from '@/providers/PageProvider';
import { routesUrl } from '@/routes/routesConfig';
import { MovieCard } from '@/ui/movie/MovieCard';

type MovieCategory = 'popular' | 'now_playing' | 'top_rated';

function Index() {
  const [category, setCategory] = useState<MovieCategory>('popular');

  const [state, send] = useMovieMachine();
  console.log('error', state.context.error);
  const handleCategoryChange = (newCategory: MovieCategory) => {
    // TODO: implement fetch other categories
    setCategory(newCategory);
    send({
      type: 'FETCH_MOVIES',
      data: {
        page: 1,
      },
    });
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
              <button
                type='button'
                onClick={() => handleCategoryChange('popular')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  category === 'popular'
                    ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20'
                }`}>
                🔥 Popular
              </button>
              <button
                type='button'
                onClick={() => handleCategoryChange('now_playing')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  category === 'now_playing'
                    ? 'bg-linear-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/50'
                    : 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20'
                }`}>
                🎬 Now Playing
              </button>
              <button
                type='button'
                onClick={() => handleCategoryChange('top_rated')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  category === 'top_rated'
                    ? 'bg-linear-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/50'
                    : 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20'
                }`}>
                ⭐ Top Rated
              </button>
            </div>

            {state.matches('Fetching Movies') && (
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
            {state.context?.error && (
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
                  {matchPI(state.context.error)(
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
            {state.matches('Idle') && state.context.movies && (
              <>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                  {state.context.movies.map((movie: Movie, index: number) => (
                    <div
                      key={movie.id}
                      className='animate-fadeInUp'
                      style={{ animationDelay: `${index * 10}ms` }}>
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className='flex justify-center items-center gap-4 mt-12 mb-8'>
                  <button
                    type='button'
                    onClick={() =>
                      send({
                        type: 'FETCH_MOVIES',
                        data: {
                          page: Math.max(1, state.context.currentPage - 1),
                        },
                      })
                    }
                    disabled={state.context.currentPage === 1}
                    className={clsx(
                      'group px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2 disabled:hover:bg-white/10 cursor-pointer',
                      state.context.currentPage === 1 && 'cursor-not-allowed',
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
                    <span className='text-xl'>{state.context.currentPage}</span>{' '}
                    <span className='text-sm opacity-75'>
                      of {state.context.totalPage}
                    </span>
                  </div>
                  <button
                    type='button'
                    onClick={() =>
                      send({
                        type: 'FETCH_MOVIES',
                        data: { page: state.context.currentPage + 1 },
                      })
                    }
                    disabled={
                      state.context.currentPage >= state.context.totalPage
                    }
                    className={clsx(
                      'group px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2 disabled:hover:bg-white/10 cursor-pointer',
                      state.context.currentPage >= state.context.totalPage &&
                        'cursor-not-allowed',
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
              </>
            )}
          </div>
        </div>
      </div>
    </PageProvider>
  );
}

export { Index };
