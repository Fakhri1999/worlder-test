import { useMachine } from '@xstate/react';
import { fromPromise } from 'xstate';

import { movieDetailMachine } from './movieDetailMachine';
import { getMovieDetail } from './movieServices';

export function useMovieDetailMachine() {
  return useMachine(
    movieDetailMachine.provide({
      actors: {
        fetchMovieDetail: fromPromise(async ({ input }) => {
          const result = await getMovieDetail(input.movieId);
          return result;
        }),
      },
    }),
  );
}
