import { useMachine } from '@xstate/react';
import { fromPromise } from 'xstate';

import { movieMachine } from './movieMachine';
import { getMovies } from './movieServices';

export function useMovieMachine() {
  return useMachine(
    movieMachine.provide({
      actors: {
        fetchMovies: fromPromise(async ({ input }) => {
          const result = await getMovies({ page: input.page });

          return result;
        }),
      },
    }),
  );
}
