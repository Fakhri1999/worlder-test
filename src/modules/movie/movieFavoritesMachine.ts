import { assign, fromPromise, setup } from 'xstate';

import { APIError } from '@/libs/fetcher';

import type { Movie } from './movieEntity';

type FavoritesContext = {
  favoriteIds: Set<number>;
  isInitialized: boolean;
  error: APIError | null;
};

type FavoritesEvent =
  | {
      type: 'LOAD_FAVORITES';
    }
  | {
      type: 'SKIP_FAVORITES';
    }
  | {
      type: 'ADD_FAVORITE';
      data: { movie: Movie };
    }
  | {
      type: 'REMOVE_FAVORITE';
      data: { movieId: number };
    }
  | {
      type: 'xstate.done.actor.loadFavorites';
      output: Set<number>;
    }
  | {
      type: 'xstate.error.actor.loadFavorites';
      error?: APIError;
    }
  | {
      type: 'xstate.done.actor.addFavorite';
      output: { movieId: number };
    }
  | {
      type: 'xstate.error.actor.addFavorite';
      error?: APIError;
    }
  | {
      type: 'xstate.done.actor.removeFavorite';
      output: { movieId: number };
    }
  | {
      type: 'xstate.error.actor.removeFavorite';
      error?: APIError;
    };

const initContext: FavoritesContext = {
  favoriteIds: new Set(),
  isInitialized: false,
  error: null,
};

const favoritesMachine = setup({
  types: {
    context: {} as FavoritesContext,
    events: {} as FavoritesEvent,
    tags: 'loading' as const,
  },
  actors: {
    loadFavorites: fromPromise<Set<number>>(() => {
      // Implement in hooks
      return Promise.resolve(new Set());
    }),
    addFavorite: fromPromise<{ movieId: number }, { movie: Movie }>(() => {
      // Implement in hooks
      return Promise.resolve({} as { movieId: number });
    }),
    removeFavorite: fromPromise<{ movieId: number }, { movieId: number }>(
      () => {
        // Implement in hooks
        return Promise.resolve({} as { movieId: number });
      },
    ),
  },
  actions: {
    setFavoriteIds: assign(({ event }) => {
      const favoriteIds =
        event.type === 'xstate.done.actor.loadFavorites'
          ? event.output
          : new Set<number>();

      return {
        favoriteIds,
        isInitialized: true,
        error: null,
      };
    }),
    markInitialized: assign({
      isInitialized: true,
    }),
    addFavoriteId: assign(({ event, context }) => {
      if (event.type === 'xstate.done.actor.addFavorite') {
        const movieId = event.output.movieId;
        const newFavoriteIds = new Set(context.favoriteIds);
        newFavoriteIds.add(movieId);

        return {
          favoriteIds: newFavoriteIds,
          error: null,
        };
      }
      return {};
    }),
    removeFavoriteId: assign(({ event, context }) => {
      if (event.type === 'xstate.done.actor.removeFavorite') {
        const movieId = event.output.movieId;
        const newFavoriteIds = new Set(context.favoriteIds);
        newFavoriteIds.delete(movieId);

        return {
          favoriteIds: newFavoriteIds,
          error: null,
        };
      }
      return {};
    }),
    setError: assign(({ event }) => {
      if (
        event.type === 'xstate.error.actor.loadFavorites' ||
        event.type === 'xstate.error.actor.addFavorite' ||
        event.type === 'xstate.error.actor.removeFavorite'
      ) {
        return {
          error: event.error || null,
          // Set initialized to true even on error, so we don't show spinner forever
          isInitialized: event.type === 'xstate.error.actor.loadFavorites' ? true : undefined,
        };
      }
      return { error: null };
    }),
  },
}).createMachine({
  id: 'favoritesMachine',
  initial: 'Idle',
  context: initContext,
  states: {
    Idle: {
      on: {
        LOAD_FAVORITES: 'Loading Favorites',
        SKIP_FAVORITES: {
          actions: 'markInitialized',
        },
        ADD_FAVORITE: 'Adding Favorite',
        REMOVE_FAVORITE: 'Removing Favorite',
      },
    },
    'Loading Favorites': {
      tags: 'loading',
      invoke: {
        id: 'loadFavorites',
        src: 'loadFavorites',
        onDone: {
          target: 'Idle',
          actions: 'setFavoriteIds',
        },
        onError: {
          target: 'Idle',
          actions: 'setError',
        },
      },
    },
    'Adding Favorite': {
      invoke: {
        id: 'addFavorite',
        src: 'addFavorite',
        input: ({ event }) => {
          if (event.type === 'ADD_FAVORITE') {
            return { movie: event.data.movie };
          }
          return { movie: {} as Movie };
        },
        onDone: {
          target: 'Idle',
          actions: 'addFavoriteId',
        },
        onError: {
          target: 'Idle',
          actions: 'setError',
        },
      },
    },
    'Removing Favorite': {
      invoke: {
        id: 'removeFavorite',
        src: 'removeFavorite',
        input: ({ event }) => {
          if (event.type === 'REMOVE_FAVORITE') {
            return { movieId: event.data.movieId };
          }
          return { movieId: 0 };
        },
        onDone: {
          target: 'Idle',
          actions: 'removeFavoriteId',
        },
        onError: {
          target: 'Idle',
          actions: 'setError',
        },
      },
    },
  },
});

export { favoritesMachine };
