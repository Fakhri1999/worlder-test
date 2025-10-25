import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { matchPI } from 'ts-adt';

import { useMovieDetailMachine } from '@/modules/movie/movieDetailMachineHooks';
import { PageProvider } from '@/providers/PageProvider';
import { routesUrl } from '@/routes/routesConfig';

function MovieDetail() {
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

  const movie = state.context.movieDetail;
  const isLoading = state.matches('Fetching Movie Detail');
  const error = state.context.error;

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

        <div className='relative container mx-auto px-4 py-8 md:py-12'>
          {/* Back Button */}
          <Link to={routesUrl.movies} className='inline-block mb-8'>
            <button
              type='button'
              className='group px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2 shadow-lg hover:shadow-xl'>
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
              Back to Movies
            </button>
          </Link>

          {/* Loading State */}
          {isLoading && (
            <div className='animate-fadeIn'>
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Poster Skeleton */}
                <div className='lg:col-span-1'>
                  <div className='w-full aspect-2/3 bg-gray-800/50 rounded-2xl animate-pulse' />
                </div>

                {/* Details Skeleton */}
                <div className='lg:col-span-2 space-y-6'>
                  {/* Title Skeleton */}
                  <div className='space-y-3'>
                    <div className='h-12 bg-gray-800/50 rounded-xl w-3/4 animate-pulse' />
                  </div>

                  {/* Meta Info Skeleton */}
                  <div className='flex flex-wrap gap-4'>
                    <div className='h-10 w-32 bg-gray-800/50 rounded-xl animate-pulse' />
                    <div className='h-10 w-20 bg-gray-800/50 rounded-xl animate-pulse' />
                    <div className='h-10 w-24 bg-gray-800/50 rounded-xl animate-pulse' />
                    <div className='h-10 w-28 bg-gray-800/50 rounded-xl animate-pulse' />
                  </div>

                  {/* Genres Skeleton */}
                  <div className='space-y-2'>
                    <div className='h-4 w-16 bg-gray-800/50 rounded animate-pulse' />
                    <div className='flex flex-wrap gap-2'>
                      <div className='h-9 w-24 bg-gray-800/50 rounded-xl animate-pulse' />
                      <div className='h-9 w-28 bg-gray-800/50 rounded-xl animate-pulse' />
                      <div className='h-9 w-20 bg-gray-800/50 rounded-xl animate-pulse' />
                    </div>
                  </div>

                  {/* Overview Skeleton */}
                  <div className='space-y-2'>
                    <div className='h-4 w-20 bg-gray-800/50 rounded animate-pulse' />
                    <div className='space-y-2'>
                      <div className='h-5 bg-gray-800/50 rounded-xl w-full animate-pulse' />
                      <div className='h-5 bg-gray-800/50 rounded-xl w-full animate-pulse' />
                      <div className='h-5 bg-gray-800/50 rounded-xl w-5/6 animate-pulse' />
                      <div className='h-5 bg-gray-800/50 rounded-xl w-4/5 animate-pulse' />
                    </div>
                  </div>

                  {/* Additional Info Skeleton */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='h-20 bg-gray-800/50 rounded-xl animate-pulse' />
                    <div className='h-20 bg-gray-800/50 rounded-xl animate-pulse' />
                    <div className='h-20 bg-gray-800/50 rounded-xl animate-pulse' />
                    <div className='h-20 bg-gray-800/50 rounded-xl animate-pulse' />
                  </div>

                  {/* Production Companies Skeleton */}
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

          {/* Error State */}
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
                Oops! Something went wrong
              </p>
              <p className='text-gray-300'>
                {matchPI(error)(
                  {
                    FETCH_ERROR: (err) => `Error ${err.status}: ${err.message}`,
                    DECODE_ERROR: (err) => `Data Decode Error: ${err.message}`,
                    UNKNOWN_ERROR: () => `An unknown error occurred.`,
                  },
                  () => 'An error occurred',
                )}
              </p>
            </div>
          )}

          {/* Movie Detail Content */}
          {movie && !isLoading && (
            <div className='animate-fadeIn'>
              {/* Movie Info Grid */}
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Poster Column */}
                <div className='lg:col-span-1'>
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className='w-full rounded-2xl shadow-2xl'
                    />
                  ) : (
                    <div className='w-full aspect-2/3 bg-gray-800 rounded-2xl flex items-center justify-center'>
                      <span className='text-gray-500 text-xl'>No Image</span>
                    </div>
                  )}
                </div>

                {/* Details Column */}
                <div className='lg:col-span-2 space-y-6'>
                  {/* Title and Tagline */}
                  <div>
                    <h1 className='text-5xl font-black text-white mb-2'>
                      {movie.title}
                    </h1>
                    {movie.tagline && (
                      <p className='text-xl text-gray-400 italic'>
                        &quot;{movie.tagline}&quot;
                      </p>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className='flex flex-wrap gap-4 items-center'>
                    {/* Rating */}
                    <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20'>
                      <svg
                        className='w-5 h-5 text-yellow-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'>
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                      <span className='text-white font-bold'>
                        {movie.vote_average.toFixed(1)}
                      </span>
                      <span className='text-gray-400 text-sm'>
                        ({movie.vote_count} votes)
                      </span>
                    </div>

                    {/* Release Date */}
                    {movie.release_date && (
                      <div className='bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20'>
                        <span className='text-white font-semibold'>
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                      </div>
                    )}

                    {/* Runtime */}
                    {movie.runtime && (
                      <div className='bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20'>
                        <span className='text-white font-semibold'>
                          {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}
                          m
                        </span>
                      </div>
                    )}

                    {/* Status */}
                    <div className='bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20'>
                      <span className='text-white font-semibold'>
                        {movie.status}
                      </span>
                    </div>
                  </div>

                  {/* Genres */}
                  {movie.genres.length > 0 && (
                    <div>
                      <h3 className='text-gray-400 text-sm font-semibold mb-2'>
                        GENRES
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {movie.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className='px-4 py-2 bg-linear-to-r from-blue-500/20 to-purple-600/20 text-white rounded-xl border border-blue-500/30 text-sm font-semibold'>
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Overview */}
                  {movie.overview && (
                    <div>
                      <h3 className='text-gray-400 text-sm font-semibold mb-2'>
                        OVERVIEW
                      </h3>
                      <p className='text-white text-lg leading-relaxed'>
                        {movie.overview}
                      </p>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Budget */}
                    {movie.budget > 0 && (
                      <div className='bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10'>
                        <h4 className='text-gray-400 text-sm font-semibold mb-1'>
                          Budget
                        </h4>
                        <p className='text-white text-xl font-bold'>
                          ${movie.budget.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Revenue */}
                    {movie.revenue > 0 && (
                      <div className='bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10'>
                        <h4 className='text-gray-400 text-sm font-semibold mb-1'>
                          Revenue
                        </h4>
                        <p className='text-white text-xl font-bold'>
                          ${movie.revenue.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Original Language */}
                    <div className='bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10'>
                      <h4 className='text-gray-400 text-sm font-semibold mb-1'>
                        Original Language
                      </h4>
                      <p className='text-white text-xl font-bold uppercase'>
                        {movie.original_language}
                      </p>
                    </div>

                    {/* Original Title */}
                    {movie.original_title !== movie.title && (
                      <div className='bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10'>
                        <h4 className='text-gray-400 text-sm font-semibold mb-1'>
                          Original Title
                        </h4>
                        <p className='text-white text-xl font-bold'>
                          {movie.original_title}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Production Companies */}
                  {movie.production_companies.length > 0 && (
                    <div>
                      <h3 className='text-gray-400 text-sm font-semibold mb-3'>
                        PRODUCTION COMPANIES
                      </h3>
                      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                        {movie.production_companies.map((company) => (
                          <div
                            key={company.id}
                            className='bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex flex-col items-center text-center'>
                            {company.logo_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                alt={company.name}
                                className='h-12 object-contain mb-2'
                              />
                            ) : null}
                            <p className='text-white text-sm font-semibold'>
                              {company.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Homepage Link */}
                  {movie.homepage && (
                    <a
                      href={movie.homepage}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-block px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300'>
                      Visit Official Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageProvider>
  );
}

export { MovieDetail };
