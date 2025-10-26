import { useMachine } from '@xstate/react';
import { fromPromise } from 'xstate';

import { firebaseAuth } from '@/libs/firebase';

import { getFavorites } from './movieFavoritesServices';
import { movieMachine } from './movieMachine';
import {
  getMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
} from './movieServices';

export function useMovieMachine() {
  return useMachine(
    movieMachine.provide({
      actors: {
        fetchMovies: fromPromise(async ({ input }) => {
          const result = await getMovies({ page: input.page });
          return result;
        }),
        fetchNowPlaying: fromPromise(async ({ input }) => {
          const result = await getNowPlayingMovies(input.page);
          return result;
        }),
        fetchTopRated: fromPromise(async ({ input }) => {
          const result = await getTopRatedMovies(input.page);
          return result;
        }),
        fetchFavorites: fromPromise(async () => {
          const userId = firebaseAuth.currentUser?.uid;
          if (!userId) {
            return [];
          }

          const favorites = await getFavorites(userId);
          return favorites;
        }),
      },
    }),
  );
}
