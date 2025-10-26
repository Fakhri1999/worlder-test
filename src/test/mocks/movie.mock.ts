import type { Movie, MovieDetail } from '@/modules/movie/movieEntity';

export const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'This is a test movie overview',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2024-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [28, 12],
  adult: false,
  original_language: 'en',
  original_title: 'Test Movie Original',
  popularity: 150.0,
  video: false,
};

export const mockMovieDetail: MovieDetail = {
  id: 1,
  title: 'Test Movie',
  original_title: 'Test Movie Original',
  original_language: 'en',
  overview: 'This is a test movie overview',
  tagline: 'Test tagline',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2024-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  runtime: 120,
  budget: 100000000,
  revenue: 500000000,
  status: 'Released',
  homepage: 'https://test-movie.com',
  adult: false,
  imdb_id: 'tt1234567',
  belongs_to_collection: null,
  popularity: 150.0,
  video: false,
  origin_country: ['US'],
  genres: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
  ],
  production_companies: [
    {
      id: 1,
      name: 'Test Studios',
      logo_path: '/test-logo.png',
      origin_country: 'US',
    },
  ],
  production_countries: [
    {
      iso_3166_1: 'US',
      name: 'United States of America',
    },
  ],
  spoken_languages: [
    {
      english_name: 'English',
      iso_639_1: 'en',
      name: 'English',
    },
  ],
  videos: {
    results: [
      {
        id: 'test-video-1',
        iso_3166_1: 'US',
        iso_639_1: 'en',
        key: 'dQw4w9WgXcQ',
        name: 'Official Trailer',
        official: true,
        published_at: new Date('2024-01-01'),
        site: 'YouTube',
        size: 1080,
        type: 'Trailer',
      },
    ],
  },
};

export const mockMovies: Movie[] = [
  mockMovie,
  {
    ...mockMovie,
    id: 2,
    title: 'Test Movie 2',
  },
  {
    ...mockMovie,
    id: 3,
    title: 'Test Movie 3',
  },
];
