import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL } from '@/config/tmdb';
import { fetcher } from '@/libs/fetcher';

import type { GetMoviesRequest, GetMoviesResponse } from './movieEntity';
import { GetMoviesResponseSchema } from './movieEntity';

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
