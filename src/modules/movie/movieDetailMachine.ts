import { assign, fromPromise, setup } from 'xstate';

import { APIError } from '@/libs/fetcher';

import { MovieDetail } from './movieEntity';

type MovieDetailContext = {
  movieDetail: MovieDetail | null;
  error: APIError | null;
};

type MovieDetailEvent =
  | {
      type: 'FETCH_MOVIE_DETAIL';
      data: { movieId: number };
    }
  | {
      type: 'xstate.done.actor.fetchMovieDetail';
      output: MovieDetail;
    }
  | {
      type: 'xstate.error.actor.fetchMovieDetail';
      error?: APIError;
    };

const initContext: MovieDetailContext = {
  movieDetail: null,
  error: null,
};

const movieDetailMachine = setup({
  types: {
    context: {} as MovieDetailContext,
    events: {} as MovieDetailEvent,
    tags: 'loading' as const,
  },
  actors: {
    fetchMovieDetail: fromPromise<MovieDetail, { movieId: number }>(() => {
      // Implement in hooks
      return Promise.resolve({} as MovieDetail);
    }),
  },
  actions: {
    setMovieDetail: assign(({ event }) => {
      const response =
        event.type === 'xstate.done.actor.fetchMovieDetail'
          ? event.output
          : null;

      if (!response) {
        return {};
      }

      return {
        movieDetail: response,
        error: null,
      };
    }),
    setError: assign({
      error: ({ event }) => {
        if (event.type === 'xstate.error.actor.fetchMovieDetail') {
          return event.error || null;
        }
        return null;
      },
    }),
  },
}).createMachine({
  id: 'movieDetailMachine',
  initial: 'Idle',
  context: initContext,
  states: {
    Idle: {
      on: {
        FETCH_MOVIE_DETAIL: 'Fetching Movie Detail',
      },
    },
    'Fetching Movie Detail': {
      tags: 'loading',
      invoke: {
        id: 'fetchMovieDetail',
        src: 'fetchMovieDetail',
        input: ({ event }) => {
          if (event.type === 'FETCH_MOVIE_DETAIL') {
            return { movieId: event.data.movieId };
          }
          return { movieId: 0 };
        },
        onDone: {
          target: 'Idle',
          actions: 'setMovieDetail',
        },
        onError: {
          target: 'Idle',
          actions: 'setError',
        },
      },
    },
  },
});

export { movieDetailMachine };
