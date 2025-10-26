import { useTranslation } from 'react-i18next';
import { matchPI } from 'ts-adt';

import type { APIError } from '@/libs/fetcher';
import type { MovieDetail } from '@/modules/movie/movieEntity';

interface MovieDetailProps {
  movieDetail: MovieDetail | null;
  isLoading: boolean;
  error: APIError | null;
  headerActions?: React.ReactNode;
}

function MovieDetail({
  movieDetail,
  isLoading,
  error,
  headerActions,
}: MovieDetailProps) {
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

      <div className='relative container mx-auto px-4 py-6 sm:py-8 md:py-12'>
        {headerActions}

        {isLoading && (
          <div className='animate-fadeIn'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8'>
              <div className='lg:col-span-1'>
                <div className='w-full aspect-2/3 bg-gray-800/50 rounded-2xl animate-pulse' />
              </div>

              <div className='lg:col-span-2 space-y-4 sm:space-y-6'>
                <div className='space-y-3'>
                  <div className='h-12 bg-gray-800/50 rounded-xl w-3/4 animate-pulse' />
                </div>

                <div className='flex flex-wrap gap-4'>
                  <div className='h-10 w-32 bg-gray-800/50 rounded-xl animate-pulse' />
                  <div className='h-10 w-20 bg-gray-800/50 rounded-xl animate-pulse' />
                  <div className='h-10 w-24 bg-gray-800/50 rounded-xl animate-pulse' />
                  <div className='h-10 w-28 bg-gray-800/50 rounded-xl animate-pulse' />
                </div>

                <div className='space-y-2'>
                  <div className='h-4 w-16 bg-gray-800/50 rounded animate-pulse' />
                  <div className='flex flex-wrap gap-2'>
                    <div className='h-9 w-24 bg-gray-800/50 rounded-xl animate-pulse' />
                    <div className='h-9 w-28 bg-gray-800/50 rounded-xl animate-pulse' />
                    <div className='h-9 w-20 bg-gray-800/50 rounded-xl animate-pulse' />
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='h-4 w-20 bg-gray-800/50 rounded animate-pulse' />
                  <div className='space-y-2'>
                    <div className='h-5 bg-gray-800/50 rounded-xl w-full animate-pulse' />
                    <div className='h-5 bg-gray-800/50 rounded-xl w-full animate-pulse' />
                    <div className='h-5 bg-gray-800/50 rounded-xl w-5/6 animate-pulse' />
                    <div className='h-5 bg-gray-800/50 rounded-xl w-4/5 animate-pulse' />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='h-20 bg-gray-800/50 rounded-xl animate-pulse' />
                  <div className='h-20 bg-gray-800/50 rounded-xl animate-pulse' />
                  <div className='h-20 bg-gray-800/50 rounded-xl animate-pulse' />
                  <div className='h-20 bg-gray-800/50 rounded-xl animate-pulse' />
                </div>

                <div className='space-y-3'>
                  <div className='h-4 w-40 bg-gray-800/50 rounded animate-pulse' />
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    <div className='h-24 bg-gray-800/50 rounded-xl animate-pulse' />
                    <div className='h-24 bg-gray-800/50 rounded-xl animate-pulse' />
                    <div className='h-24 bg-gray-800/50 rounded-xl animate-pulse' />
                  </div>
                </div>
              </div>
            </div>
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

        {movieDetail && !isLoading && (
          <div className='animate-fadeIn'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8'>
              <div className='lg:col-span-1'>
                {movieDetail.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
                    alt={movieDetail.title}
                    className='w-full rounded-2xl shadow-2xl'
                  />
                ) : (
                  <div className='w-full aspect-2/3 bg-gray-800 rounded-2xl flex items-center justify-center'>
                    <span className='text-gray-500 text-base sm:text-xl'>
                      {t('movieDetail.noImage')}
                    </span>
                  </div>
                )}
              </div>

              <div className='lg:col-span-2 space-y-4 sm:space-y-6'>
                <div>
                  <h1 className='text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2'>
                    {movieDetail.title}
                  </h1>
                  {movieDetail.tagline && (
                    <p className='text-base sm:text-lg md:text-xl text-gray-400 italic'>
                      &quot;{movieDetail.tagline}&quot;
                    </p>
                  )}
                </div>

                <div className='flex flex-wrap gap-2 sm:gap-4 items-center'>
                  <div className='flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-white/20'>
                    <svg
                      className='w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0'
                      fill='currentColor'
                      viewBox='0 0 20 20'>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    <span className='text-white font-bold text-sm sm:text-base'>
                      {movieDetail.vote_average.toFixed(1)}
                    </span>
                    <span className='text-gray-400 text-xs sm:text-sm'>
                      ({movieDetail.vote_count} {t('movieDetail.votes')})
                    </span>
                  </div>

                  {movieDetail.release_date && (
                    <div className='bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-white/20'>
                      <span className='text-white font-semibold text-sm sm:text-base'>
                        {new Date(movieDetail.release_date).getFullYear()}
                      </span>
                    </div>
                  )}

                  {movieDetail.runtime && (
                    <div className='bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-white/20'>
                      <span className='text-white font-semibold text-sm sm:text-base'>
                        {Math.floor(movieDetail.runtime / 60)}h{' '}
                        {movieDetail.runtime % 60}m
                      </span>
                    </div>
                  )}

                  <div className='bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-white/20'>
                    <span className='text-white font-semibold text-sm sm:text-base'>
                      {movieDetail.status}
                    </span>
                  </div>
                </div>

                {movieDetail.genres.length > 0 && (
                  <div>
                    <h3 className='text-gray-400 text-xs sm:text-sm font-semibold mb-2'>
                      {t('movieDetail.genres').toUpperCase()}
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {movieDetail.genres.map(
                        (genre: { id: number; name: string }) => (
                          <span
                            key={genre.id}
                            className='px-3 py-1.5 sm:px-4 sm:py-2 bg-linear-to-r from-blue-500/20 to-purple-600/20 text-white rounded-xl border border-blue-500/30 text-xs sm:text-sm font-semibold'>
                            {genre.name}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {movieDetail.overview && (
                  <div>
                    <h3 className='text-gray-400 text-xs sm:text-sm font-semibold mb-2'>
                      {t('movieDetail.overview').toUpperCase()}
                    </h3>
                    <p className='text-white text-sm sm:text-base md:text-lg leading-relaxed'>
                      {movieDetail.overview}
                    </p>
                  </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
                  {movieDetail.budget > 0 && (
                    <div className='bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10'>
                      <h4 className='text-gray-400 text-xs sm:text-sm font-semibold mb-1'>
                        {t('movieDetail.budget')}
                      </h4>
                      <p className='text-white text-lg sm:text-xl font-bold'>
                        ${movieDetail.budget.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {movieDetail.revenue > 0 && (
                    <div className='bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10'>
                      <h4 className='text-gray-400 text-xs sm:text-sm font-semibold mb-1'>
                        {t('movieDetail.revenue')}
                      </h4>
                      <p className='text-white text-lg sm:text-xl font-bold'>
                        ${movieDetail.revenue.toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className='bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10'>
                    <h4 className='text-gray-400 text-xs sm:text-sm font-semibold mb-1'>
                      {t('movieDetail.originalLanguage')}
                    </h4>
                    <p className='text-white text-lg sm:text-xl font-bold uppercase'>
                      {movieDetail.original_language}
                    </p>
                  </div>

                  {movieDetail.original_title !== movieDetail.title && (
                    <div className='bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10'>
                      <h4 className='text-gray-400 text-xs sm:text-sm font-semibold mb-1'>
                        {t('movieDetail.originalTitle')}
                      </h4>
                      <p className='text-white text-base sm:text-lg md:text-xl font-bold break-words'>
                        {movieDetail.original_title}
                      </p>
                    </div>
                  )}
                </div>

                {movieDetail.production_companies.length > 0 && (
                  <div>
                    <h3 className='text-gray-400 text-xs sm:text-sm font-semibold mb-2 sm:mb-3'>
                      {t('movieDetail.productionCompanies').toUpperCase()}
                    </h3>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4'>
                      {movieDetail.production_companies.map(
                        (company: {
                          id: number;
                          name: string;
                          logo_path: string | null;
                        }) => (
                          <div
                            key={company.id}
                            className='bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10 flex flex-col items-center text-center min-h-[100px] justify-center'>
                            {company.logo_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                alt={company.name}
                                className='h-10 sm:h-12 object-contain mb-2'
                              />
                            ) : null}
                            <p className='text-white text-xs sm:text-sm font-semibold break-words'>
                              {company.name}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {movieDetail.homepage && (
                  <a
                    href={movieDetail.homepage}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-block px-4 py-2.5 sm:px-6 sm:py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300'>
                    {t('movieDetail.visitWebsite')}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { MovieDetail };
export type { MovieDetailProps };
