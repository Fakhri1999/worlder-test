import { assign, fromPromise, setup } from 'xstate';

import { APIError } from '@/libs/fetcher';

import { GetMoviesResponse, Movie } from './movieEntity';

type MovieContext = {
  currentPage: number;
  totalPage: number;
  movies: Movie[];
  error: APIError | null;
};

type MovieEvent =
  | {
      type: 'FETCH_MOVIES';
      data: { page: number };
    }
  | {
      type: 'xstate.done.actor.fetchMovies';
      output: GetMoviesResponse;
    }
  | {
      type: 'xstate.error.actor.fetchMovies';
      error?: APIError;
    };

const initContext: MovieContext = {
  currentPage: 1,
  totalPage: 0,
  movies: [],
  error: null,
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
      };
    }),
    setError: assign({
      error: ({ event }) => {
        if (event.type === 'xstate.error.actor.fetchMovies') {
          return event.error || null;
        }
        return null;
      },
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFsD2A3AlmAsgQwGMALTAOzADoBJCAGzAGIAxAUQBUBhACQH0cB5AGpUWAZQDaABgC6iUAAdUsTABdMqUnJAAPRAGYArACYKADiOmAjJYMA2SQHYjDgCyWANCACeiKxQOSgYFWBjYOAJzhAL5RnmhYuIQk5BRMYCrEZFAABDgY2LAMEBqUZOioANaUAGbpxHkJsFKySCCKymoaWroIei4meobhLi4OehHhfXqePghGRgYULgZ61saWEZajejFx+YmZKWkZyTkNBQxgAE5XqFcU8rR4KtV3yBS1J+dwzVrtqupNK0en0BkMRmMJlMZohLHoTEFAttLJJbEYXDFYiBSKgIHAtPFsPhDmA-koAV1gYgALS2GEIWkURHM5kOXYgQkHZKUGj0MkdQHdRAGNxLBy2OxGWwuWxbOneRDDCiWBZIozWWzixzsznE7mpOqnXL7eCtf6dIGgHr9ekqhwUcLikVohySFHizFRIA */
  id: 'movieMachine',
  initial: 'Fetching Movies',
  context: initContext,
  states: {
    Idle: {
      on: {
        FETCH_MOVIES: 'Fetching Movies',
      },
    },
    'Fetching Movies': {
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
  },
});

export { movieMachine };
