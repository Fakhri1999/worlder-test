import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { IoClose as CloseIcon } from 'react-icons/io5';
import { MdSearch as SearchIcon } from 'react-icons/md';
import { matchPI } from 'ts-adt';

import type { APIError } from '@/libs/fetcher';
import type { Movie } from '@/modules/movie/movieEntity';
import { MovieCard } from '@/ui/movie/MovieCard';

type MovieCategory = 'popular' | 'now_playing' | 'top_rated' | 'favorites';

type Category = {
  value: MovieCategory;
  label: string;
  gradient: string;
  shadow: string;
  hidden?: boolean;
};

interface MovieListProps {
  movies: Movie[];
  categories: Category[];
  selectedCategory: MovieCategory;
  searchQuery: string;
  searchInput: string;
  currentPage: number;
  totalPage: number;
  mode: 'tmdb' | 'favorites';
  isLoading: boolean;
  error: APIError | null;
  isLoadingFavorites: boolean;
  isLoadingCategories: boolean;
  favoriteIds: Set<number>;
  onCategoryChange: (category: MovieCategory) => void;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  onClearSearch: () => void;
  onPageChange: (page: number) => void;
  onToggleFavorite: (movie: Movie) => void;
  headerActions?: React.ReactNode;
}

function MovieList({
  movies,
  categories,
  selectedCategory,
  searchQuery,
  searchInput,
  currentPage,
  totalPage,
  mode,
  isLoading,
  error,
  favoriteIds,
  isLoadingFavorites,
  isLoadingCategories,
  onCategoryChange,
  onSearchInputChange,
  onSearchSubmit,
  onClearSearch,
  onPageChange,
  onToggleFavorite,
  headerActions,
}: MovieListProps) {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col flex-1 w-full min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden'>
      <div
        className='absolute inset-0 opacity-20'
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className='absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob' />
      <div className='absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000' />
      <div className='absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000' />

      <div className='relative container mx-auto px-4 py-6 sm:py-8 md:py-12'>
        <div className='flex flex-col mb-8 sm:mb-10 md:mb-12 animate-fadeIn'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8'>
            <div className='mb-4 sm:mb-6 md:mb-0'>
              <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 sm:mb-4 tracking-tight animate-slideInLeft'>
                {t('movies.title')}
              </h1>
              <p className='text-gray-300 text-sm sm:text-base md:text-lg flex items-center gap-2 animate-slideInLeft animation-delay-100'>
                <svg
                  className='w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 animate-pulse flex-shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
                {t('movies.subtitle')}
              </p>
            </div>
            <div className='flex items-center gap-3 sm:gap-4'>
              {headerActions}
            </div>
          </div>

          <div className='mb-5 sm:mb-6 animate-slideInUp'>
            <div className='relative max-w-2xl mx-auto'>
              <div className='absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none'>
                <SearchIcon className='w-5 h-5 sm:w-6 sm:h-6 text-gray-400 z-10' />
              </div>
              <input
                type='text'
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchInput.trim()) {
                    onSearchSubmit();
                  }
                }}
                placeholder={t('movies.searchPlaceholder')}
                className='w-full pl-10 pr-10 py-3 sm:pl-12 sm:pr-12 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300'
              />
              {searchInput && (
                <button
                  onClick={onClearSearch}
                  className='absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center cursor-pointer hover:text-white text-gray-400 transition-colors'>
                  <CloseIcon className='w-5 h-5 sm:w-6 sm:h-6' />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className='text-center text-gray-300 text-sm sm:text-base mt-3'>
                {t('movies.searchResultsFor')}{' '}
                <span className='text-white font-semibold'>
                  &quot;{searchQuery}&quot;
                </span>
              </p>
            )}
          </div>

          {!searchQuery && (
            <div className='flex gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide'>
              {isLoadingCategories ? (
                <>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className='px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-white/10 backdrop-blur-sm animate-pulse min-w-[120px] sm:min-w-[132px] h-[40px] sm:h-[48px] flex-shrink-0'
                    />
                  ))}
                </>
              ) : (
                categories.map((category) => (
                  <button
                    key={category.value}
                    type='button'
                    onClick={() => onCategoryChange(category.value)}
                    className={`cursor-pointer px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === category.value
                        ? `bg-linear-to-r ${category.gradient} text-white shadow-lg ${category.shadow}`
                        : 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20'
                    }`}>
                    {category.label}
                  </button>
                ))
              )}
            </div>
          )}

          {isLoading && (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
              {Array.from({ length: 20 }).map((_, index) => (
                <div
                  key={index}
                  className='h-full flex flex-col rounded-2xl overflow-hidden shadow-lg bg-linear-to-br from-gray-900 to-black animate-pulse'>
                  <div className='relative aspect-2/3 bg-gray-800'>
                    <div className='absolute inset-0 flex flex-col justify-between p-4'>
                      <div className='flex items-start justify-between'>
                        <div className='w-14 h-14 rounded-full bg-gray-700/50' />
                        <div className='w-16 h-6 bg-gray-700/50 rounded-full' />
                      </div>
                    </div>
                  </div>

                  <div className='p-4 bg-linear-to-br from-gray-900 to-black min-h-[88px] flex flex-col justify-center space-y-2'>
                    <div className='h-5 bg-gray-700/50 rounded w-4/5' />
                    <div className='h-4 bg-gray-700/50 rounded w-3/5' />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
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
                {t('common.oops')}
              </p>
              <p className='text-gray-300'>
                {matchPI(error)(
                  {
                    FETCH_ERROR: (err) =>
                      t('errors.fetchError', {
                        status: err.status,
                        message: err.message,
                      }),
                    DECODE_ERROR: (err) =>
                      t('errors.decodeError', { message: err.message }),
                    UNKNOWN_ERROR: () => t('errors.unknownError'),
                  },
                  () => t('common.anErrorOccurred'),
                )}
              </p>
            </div>
          )}

          {!isLoading && searchQuery && movies.length === 0 && (
            <div className='bg-linear-to-r from-gray-800/20 to-gray-900/20 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-12 text-center shadow-xl'>
              <div className='w-20 h-20 bg-gray-700/20 rounded-full flex items-center justify-center mx-auto mb-6'>
                <SearchIcon className='w-10 h-10 text-gray-400' />
              </div>
              <p className='text-white font-bold text-2xl mb-3'>
                {t('movies.noMoviesFound')}
              </p>
              <p className='text-gray-300 mb-6'>
                {t('movies.noMoviesMessage')} &quot;
                {searchQuery}&quot;
              </p>
              <button
                onClick={onClearSearch}
                className='px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold'>
                {t('movies.clearSearch')}
              </button>
            </div>
          )}

          {!isLoading && movies && movies.length > 0 && (
            <>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                {movies.map((movie: Movie, index: number) => (
                  <div
                    key={movie.id}
                    className='animate-fadeInUp'
                    style={{ animationDelay: `${index * 10}ms` }}>
                    <MovieCard
                      movie={movie}
                      isFavorite={favoriteIds.has(movie.id)}
                      isLoadingFavorites={isLoadingFavorites}
                      onToggleFavorite={onToggleFavorite}
                    />
                  </div>
                ))}
              </div>

              {mode === 'tmdb' && (
                <div className='flex justify-center items-center gap-2 sm:gap-4 mt-8 sm:mt-12 mb-6 sm:mb-8'>
                  <button
                    type='button'
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={clsx(
                      'group px-3 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-1 sm:gap-2 disabled:hover:bg-white/10 cursor-pointer text-sm sm:text-base',
                      currentPage === 1 && 'cursor-not-allowed',
                    )}>
                    <svg
                      className='w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform'
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
                    <span className='hidden sm:inline'>
                      {t('movies.pagination.previous')}
                    </span>
                  </button>
                  <div className='px-3 py-2 sm:px-6 sm:py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold shadow-lg'>
                    <span className='text-xs sm:text-sm opacity-75'>
                      {t('movies.pagination.page')}
                    </span>{' '}
                    <span className='text-lg sm:text-xl'>{currentPage}</span>{' '}
                    <span className='text-xs sm:text-sm opacity-75'>
                      {t('movies.pagination.of')} {totalPage}
                    </span>
                  </div>
                  <button
                    type='button'
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPage}
                    className={clsx(
                      'group px-3 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-1 sm:gap-2 disabled:hover:bg-white/10 cursor-pointer text-sm sm:text-base',
                      currentPage >= totalPage && 'cursor-not-allowed',
                    )}>
                    <span className='hidden sm:inline'>
                      {t('movies.pagination.next')}
                    </span>
                    <svg
                      className='w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform'
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
  );
}

export { MovieList };
export type { MovieListProps, Category, MovieCategory };
