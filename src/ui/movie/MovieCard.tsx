import { useState } from 'react';

import { TMDB_BASE_IMAGE_URL } from '@/config/tmdb';
import type { Movie } from '@/modules/movie/movieEntity';

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const posterUrl = movie.poster_path
    ? `${TMDB_BASE_IMAGE_URL}/${movie.poster_path}`
    : 'https://placehold.co/300x450/png?text=No+Image&font=roboto';
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';

  const ratingPercentage = (movie.vote_average / 10) * 100;

  return (
    <div
      className='group relative h-full flex flex-col rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-linear-to-br from-gray-900 to-black'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Main Image */}
      <div className='relative aspect-2/3 bg-linear-to-br from-gray-900 to-black overflow-hidden'>
        <img
          src={posterUrl}
          alt={movie.title}
          className='w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-sm'
          loading='lazy'
        />

        {/* Dark Gradient Overlay */}
        <div className='absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent' />

        {/* Content Overlay */}
        <div className='absolute inset-0 flex flex-col justify-between p-4'>
          {/* Top Section */}
          <div className='flex items-start justify-between'>
            {/* Circular Rating */}
            <div className='relative w-14 h-14'>
              <svg className='w-14 h-14 transform -rotate-90'>
                <circle
                  cx='28'
                  cy='28'
                  r='24'
                  stroke='rgba(255,255,255,0.1)'
                  strokeWidth='3'
                  fill='none'
                />
                <circle
                  cx='28'
                  cy='28'
                  r='24'
                  stroke='url(#gradient)'
                  strokeWidth='3'
                  fill='none'
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 24 * (1 - ratingPercentage / 100)
                  }`}
                  strokeLinecap='round'
                  className='transition-all duration-500'
                />
                <defs>
                  <linearGradient
                    id='gradient'
                    x1='0%'
                    y1='0%'
                    x2='100%'
                    y2='0%'>
                    <stop
                      offset='0%'
                      style={{ stopColor: '#8B5CF6', stopOpacity: 1 }}
                    />
                    <stop
                      offset='100%'
                      style={{ stopColor: '#EC4899', stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
              </svg>
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Year Badge */}
            <div className='px-3 py-1 bg-black/60 backdrop-blur-md rounded-full'>
              <span className='text-white text-xs font-semibold'>
                {releaseYear}
              </span>
            </div>
          </div>

          {/* Hover Info */}
          <div
            className={`transition-all duration-500 space-y-3 ${
              isHovered
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}>
            {/* Stats */}
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-1.5'>
                <svg
                  className='w-4 h-4 text-yellow-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
                <span className='text-white text-sm font-medium'>
                  {movie.vote_count.toLocaleString()}
                </span>
              </div>
              <div className='h-1 w-1 rounded-full bg-white/40' />
              <span className='text-white/80 text-sm uppercase font-semibold tracking-wider'>
                {movie.original_language}
              </span>
            </div>

            {/* Overview */}
            <p className='text-white/90 text-sm line-clamp-3 leading-relaxed'>
              {movie.overview}
            </p>

            {/* Play Button */}
            <button
              type='button'
              className='w-full py-2.5 bg-white/90 hover:bg-white text-black font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z' />
              </svg>
              Watch Trailer
            </button>
          </div>
        </div>

        {/* Shine Effect */}
        <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none' />
      </div>

      {/* Title Section - Outside Image */}
      <div className='p-4 bg-linear-to-br from-gray-900 to-black min-h-[60px] flex flex-col justify-center'>
        <h3 className='text-white font-bold text-lg leading-tight line-clamp-2'>
          {movie.title}
        </h3>
        {movie.original_title !== movie.title && (
          <p className='text-gray-400 text-xs mt-1 line-clamp-1 italic'>
            {movie.original_title}
          </p>
        )}
      </div>
    </div>
  );
}

export { MovieCard };
