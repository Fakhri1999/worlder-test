import { assign, fromPromise, setup } from 'xstate';

import { APIError } from '@/libs/fetcher';

import { LoginResponse, User } from './authEntity';

type AuthContext = {
  name: string;
  email: string;
  password: string;
  user: User | null;
  error: APIError | null;
};

type AuthEvent =
  | {
      type: 'CHECK_AUTHENTICATION';
    }
  | {
      type: 'LOGIN';
      data: { email: string; password: string };
    }
  | {
      type: 'REGISTER';
      data: { name: string; email: string; password: string };
    }
  | {
      type: 'LOGOUT';
    }
  | {
      type: 'SHOW_REGISTER_FORM';
    }
  | {
      type: 'SHOW_LOGIN_FORM';
    }
  | {
      type: 'xstate.done.actor.loginUser';
      output: LoginResponse;
    }
  | {
      type: 'xstate.error.actor.loginUser';
      error?: APIError;
    }
  | {
      type: 'xstate.done.actor.registerUser';
      output: LoginResponse;
    }
  | {
      type: 'xstate.error.actor.registerUser';
      error?: APIError;
    }
  | {
      type: 'xstate.init';
    };

const initContext: AuthContext = {
  name: '',
  email: '',
  password: '',
  user: null,
  error: null,
};

const authMachine = setup({
  types: {
    context: {} as AuthContext,
    events: {} as AuthEvent,
    tags: 'loading' as const,
  },
  actors: {
    loginUser: fromPromise<LoginResponse, { email: string; password: string }>(
      () => {
        // Implement in hooks
        return Promise.resolve({} as LoginResponse);
      },
    ),
    registerUser: fromPromise<
      LoginResponse,
      { name: string; email: string; password: string }
    >(() => {
      // Implement in hooks
      return Promise.resolve({} as LoginResponse);
    }),
  },
  actions: {
    setCredentials: assign(({ event }) => {
      if (event.type === 'LOGIN') {
        return {
          email: event.data.email,
          password: event.data.password,
        };
      }
      if (event.type === 'REGISTER') {
        return {
          name: event.data.name,
          email: event.data.email,
          password: event.data.password,
        };
      }
      return {};
    }),

    setError: assign({
      error: ({ event }) => {
        if (
          event.type === 'xstate.error.actor.loginUser' ||
          event.type === 'xstate.error.actor.registerUser'
        ) {
          return event.error || null;
        }
        return null;
      },
    }),
    clearError: assign({
      error: () => null,
    }),
    // Implement in hooks
    setUser: assign(() => {
      return {};
    }),
    setInitUser: assign(() => {
      return {};
    }),
    clearAuth: assign(() => {
      return {
        name: '',
        email: '',
        password: '',
        user: null,
        error: null,
      };
    }),
  },
  guards: {
    // Implement in hooks
    isAuthenticated: () => {
      return false;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgWWQY0wEsA7MAOgGVMB7AdxKgAIAZaqExgMWoCcBbAMTMA8gHEAkgDkA2gAYAuolAAHarELpC1YkpAAPRAGYA7IbIBWAIzmAbJYAcxm8YBMAFkPOANCACeRhzJnAE5nYzd7c0M3YMsAXzifNCxcAhJyKjoGFjYObn4BCgAJYQB1AH0AJQBRCQoAFWrK8s5hSuw5RSQQVXVNbV0DBBMzK1sHJ1cPbz9EK0sLSNj7F1X7e2sbBKSMHHwiUkoaemImSrB2WHQwHi5eQRq6xsrO3V6NLR1uobcYsntgrI7G5zMYAcFwoYfP4EMZZAsYi5Nm4XOs3JYtokQMk9mlDpkTmcLoQrjc7gVimVyiIJJIWm0Ogo3moPgNvkZgsFFuZgqDzLZTPYobMEOjzGRLIYXMYIZF0dZDNtsbtUgdyKwoOxToxxMQBBBtOQSAA3agAa3IABtcsQAKqwG6vbrvfpfUBDdbilYbDE2WQ82QQ6FGIFkJyGeFAyyxOFRJU41XpMgarVMXUCG48XhkZSW5DoABm9zI1q19sdTOdLNdg0Qv2MZGCLlCQuchmC6xswYQq3Fqxs-NCEWsUUVWIT+yT50u1x4DH1hrIJvN5B4xNJPHLPCdKmrn1rw1MFk2E2c7k8xm7MobwRB0pCTlkYPjKsnh2nJNn88z2dz+aL-BkGuM43FuO49HubLukYR5jHYjhntMl4in69hkLI7YYUsGJuM+46vni5AAIK7GAxCaHg+aQEIYjCLa9TgS6+7sggMYWDYLhWO4IKGPYvzdhsZAxJynJuDYJiuNKCRYsQ1AQHAugToRzJ9Mx0EIAAtF2IoaeKIn6QZnJjjsKRvhkxzZBqeT3CprJuvoiCSg2EQeGChignYsjSt2Vhcq4sR2JyjicpiJm4mqRxZNqH4buSfC2TWLEcW4FhPhsMrNg4qLdslQQDgGNjrOELgvqZhHJmwqY6vZTFQQ5CC5eYaWWBlyzZSKEZ9u2thWOijjNqFyplRFMVfqcCVqfVKJXkeMqFU4NhuLI6wuINSkRSRWBkRRVEQBNdVDJY-pmMVDgDg4USuN2hiGAsLjdeJkS3RsQrSXEQA */
  id: 'authMachine',
  initial: 'Waiting for Authentication Check',
  context: initContext,
  states: {
    'Waiting for Authentication Check': {
      on: {
        CHECK_AUTHENTICATION: 'Check Authentication',
      },
    },
    'Check Authentication': {
      always: [
        {
          actions: 'setInitUser',
          guard: 'isAuthenticated',
          target: 'Authenticated',
        },
        {
          target: 'Showing Login Form',
        },
      ],
    },
    'Showing Login Form': {
      initial: 'Idle',
      states: {
        Idle: {
          on: {
            LOGIN: {
              target: '#authMachine.Showing Login Form.Logging In',
              actions: 'setCredentials',
            },
            SHOW_REGISTER_FORM: {
              target: '#authMachine.Showing Register Form',
              actions: 'clearError',
            },
          },
        },
        'Logging In': {
          tags: 'loading',
          invoke: {
            id: 'loginUser',
            src: 'loginUser',
            input: ({ context }) => ({
              email: context.email,
              password: context.password,
            }),
            onDone: {
              target: '#authMachine.Authenticated',
              actions: 'setUser',
            },
            onError: {
              target: '#authMachine.Showing Login Form.Idle',
              actions: 'setError',
            },
          },
        },
      },
    },
    'Showing Register Form': {
      initial: 'Idle',
      states: {
        Idle: {
          on: {
            REGISTER: {
              target: 'Registering',
              actions: 'setCredentials',
            },
            SHOW_LOGIN_FORM: {
              target: '#authMachine.Showing Login Form',
              actions: 'clearError',
            },
          },
        },
        Registering: {
          tags: 'loading',
          invoke: {
            id: 'registerUser',
            src: 'registerUser',
            input: ({ context }) => ({
              name: context.name,
              email: context.email,
              password: context.password,
            }),
            onDone: {
              target: '#authMachine.Authenticated',
              actions: 'setUser',
            },
            onError: {
              target: '#authMachine.Showing Register Form',
              actions: 'setError',
            },
          },
        },
      },
    },

    Authenticated: {
      on: {
        LOGOUT: {
          target: '#authMachine.Showing Login Form',
          actions: 'clearAuth',
        },
      },
    },
  },
});

export { authMachine };
