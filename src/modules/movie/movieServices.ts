import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL } from '@/config/tmdb';
import { fetcher } from '@/libs/fetcher';

import type {
  GetMoviesRequest,
  GetMoviesResponse,
  MovieDetail,
} from './movieEntity';
import { GetMoviesResponseSchema, MovieDetailSchema } from './movieEntity';

export async function getMovies(
  request?: GetMoviesRequest,
): Promise<GetMoviesResponse> {
  const params: GetMoviesRequest = {
    page: 1,
    sort_by: 'popularity.desc',
  };

  if (request?.page) {
    params.page = request.page;
  }

  if (request?.sort_by) {
    params.sort_by = request.sort_by;
  }

  return fetcher(
    {
      url: `${TMDB_BASE_URL}/discover/movie`,
      params,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    },
    GetMoviesResponseSchema,
  );
}

export async function getNowPlayingMovies(
  page: number = 1,
): Promise<GetMoviesResponse> {
  return fetcher(
    {
      url: `${TMDB_BASE_URL}/movie/now_playing`,
      params: { page },
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    },
    GetMoviesResponseSchema,
  );
}

export async function getTopRatedMovies(
  page: number = 1,
): Promise<GetMoviesResponse> {
  return fetcher(
    {
      url: `${TMDB_BASE_URL}/movie/top_rated`,
      params: { page },
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    },
    GetMoviesResponseSchema,
  );
}

export async function searchMovies(
  query: string,
  page: number = 1,
): Promise<GetMoviesResponse> {
  return fetcher(
    {
      url: `${TMDB_BASE_URL}/search/movie`,
      params: { query, page },
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    },
    GetMoviesResponseSchema,
  );
}

export async function getMovieDetail(movieId: number): Promise<MovieDetail> {
  return fetcher(
    {
      url: `${TMDB_BASE_URL}/movie/${movieId}?append_to_response=videos`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    },
    MovieDetailSchema,
  );
}
