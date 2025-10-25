import { assign, fromPromise, setup } from 'xstate';

import { APIError } from '@/libs/fetcher';

import { FavoriteMovie, GetMoviesResponse, Movie } from './movieEntity';

type MovieContext = {
  currentPage: number;
  totalPage: number;
  movies: Movie[];
  error: APIError | null;
  mode: 'tmdb' | 'favorites';
};

type MovieEvent =
  | {
      type: 'FETCH_MOVIES';
      data: { page: number };
    }
  | {
      type: 'FETCH_FAVORITES';
    }
  | {
      type: 'xstate.done.actor.fetchMovies';
      output: GetMoviesResponse;
    }
  | {
      type: 'xstate.error.actor.fetchMovies';
      error?: APIError;
    }
  | {
      type: 'xstate.done.actor.fetchFavorites';
      output: FavoriteMovie[];
    }
  | {
      type: 'xstate.error.actor.fetchFavorites';
      error?: APIError;
    };

const initContext: MovieContext = {
  currentPage: 1,
  totalPage: 0,
  movies: [],
  error: null,
  mode: 'tmdb',
};

const movieMachine = setup({
  types: {
    context: {} as MovieContext,
    events: {} as MovieEvent,
    tags: 'loading',
  },
  actors: {
    fetchMovies: fromPromise<GetMoviesResponse, { page: number }>(() => {
      // Implement in hooks
      return Promise.resolve({} as GetMoviesResponse);
    }),
    fetchFavorites: fromPromise<FavoriteMovie[]>(() => {
      // Implement in hooks
      return Promise.resolve([]);
    }),
  },
  actions: {
    updateMoviesData: assign(({ event }) => {
      const response =
        event.type === 'xstate.done.actor.fetchMovies' ? event.output : null;

      if (!response) {
        return {};
      }

      return {
        movies: response.results,
        totalPage: response.total_pages,
        currentPage: response.page,
        mode: 'tmdb' as const,
        error: null,
      };
    }),
    updateFavoritesData: assign(({ event }) => {
      const favorites =
        event.type === 'xstate.done.actor.fetchFavorites' ? event.output : [];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const movies: Movie[] = favorites.map(({ addedAt, ...movie }) => movie);

      return {
        movies,
        totalPage: 1,
        currentPage: 1,
        mode: 'favorites' as const,
        error: null,
      };
    }),
    setError: assign({
      error: ({ event }) => {
        if (
          event.type === 'xstate.error.actor.fetchMovies' ||
          event.type === 'xstate.error.actor.fetchFavorites'
        ) {
          return event.error || null;
        }
        return null;
      },
    }),
  },
}).createMachine({
  id: 'movieMachine',
  initial: 'Fetching Movies',
  context: initContext,
  states: {
    Idle: {
      on: {
        FETCH_MOVIES: 'Fetching Movies',
        FETCH_FAVORITES: 'Fetching Favorites',
      },
    },
    'Fetching Movies': {
      tags: 'loading',
      invoke: {
        id: 'fetchMovies',
        src: 'fetchMovies',
        input: ({ context, event }) => {
          if (event.type === 'FETCH_MOVIES') {
            return { page: event.data.page };
          }
          return { page: context.currentPage };
        },
        onDone: {
          target: 'Idle',
          actions: 'updateMoviesData',
        },
        onError: {
          target: 'Idle',
          actions: 'setError',
        },
      },
    },
    'Fetching Favorites': {
      tags: 'loading',
      invoke: {
        id: 'fetchFavorites',
        src: 'fetchFavorites',
        onDone: {
          target: 'Idle',
          actions: 'updateFavoritesData',
        },
        onError: {
          target: 'Idle',
          actions: 'setError',
        },
      },
    },
  },
});

export { movieMachine };
