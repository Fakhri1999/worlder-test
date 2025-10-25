import { useMachine } from '@xstate/react';
import { fromPromise } from 'xstate';

import { firebaseAuth } from '@/libs/firebase';

import { favoritesMachine } from './movieFavoritesMachine';
import { addFavorite, getFavorites, removeFavorite } from './movieFavoritesServices';

export function useFavoritesMachine() {
  return useMachine(
    favoritesMachine.provide({
      actors: {
        loadFavorites: fromPromise(async () => {
          const userId = firebaseAuth.currentUser?.uid;
          if (!userId) {
            return new Set<number>();
          }

          const favorites = await getFavorites(userId);
          const favoriteIds = new Set(favorites.map((fav) => fav.id));
          return favoriteIds;
        }),
        addFavorite: fromPromise(async ({ input }) => {
          const userId = firebaseAuth.currentUser?.uid;
          if (!userId) {
            throw new Error('User not authenticated');
          }

          await addFavorite(userId, input.movie);
          return { movieId: input.movie.id };
        }),
        removeFavorite: fromPromise(async ({ input }) => {
          const userId = firebaseAuth.currentUser?.uid;
          if (!userId) {
            throw new Error('User not authenticated');
          }

          await removeFavorite(userId, input.movieId);
          return { movieId: input.movieId };
        }),
      },
    }),
  );
}
