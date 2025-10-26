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
      type: 'FETCH_NOW_PLAYING';
      data: { page: number };
    }
  | {
      type: 'FETCH_TOP_RATED';
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
      type: 'xstate.done.actor.fetchNowPlaying';
      output: GetMoviesResponse;
    }
  | {
      type: 'xstate.error.actor.fetchNowPlaying';
      error?: APIError;
    }
  | {
      type: 'xstate.done.actor.fetchTopRated';
      output: GetMoviesResponse;
    }
  | {
      type: 'xstate.error.actor.fetchTopRated';
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
    fetchNowPlaying: fromPromise<GetMoviesResponse, { page: number }>(() => {
      // Implement in hooks
      return Promise.resolve({} as GetMoviesResponse);
    }),
    fetchTopRated: fromPromise<GetMoviesResponse, { page: number }>(() => {
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
        event.type === 'xstate.done.actor.fetchMovies' ||
        event.type === 'xstate.done.actor.fetchNowPlaying' ||
        event.type === 'xstate.done.actor.fetchTopRated'
          ? event.output
          : null;

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
          event.type === 'xstate.error.actor.fetchNowPlaying' ||
          event.type === 'xstate.error.actor.fetchTopRated' ||
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
  initial: 'Idle',
  context: initContext,
  states: {
    Idle: {
      on: {
        FETCH_MOVIES: 'Fetching Movies',
        FETCH_NOW_PLAYING: 'Fetching Now Playing',
        FETCH_TOP_RATED: 'Fetching Top Rated',
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
    'Fetching Now Playing': {
      tags: 'loading',
      invoke: {
        id: 'fetchNowPlaying',
        src: 'fetchNowPlaying',
        input: ({ context, event }) => {
          if (event.type === 'FETCH_NOW_PLAYING') {
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
    'Fetching Top Rated': {
      tags: 'loading',
      invoke: {
        id: 'fetchTopRated',
        src: 'fetchTopRated',
        input: ({ context, event }) => {
          if (event.type === 'FETCH_TOP_RATED') {
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
