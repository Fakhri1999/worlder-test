import { useMachine } from '@xstate/react';
import { assign, fromPromise } from 'xstate';

import { LoginResponse } from './authEntity';
import { authMachine } from './authMachine';
import { loginUser, registerUser } from './authServices';

export function useAuthMachine() {
  return useMachine(
    authMachine.provide({
      guards: {
        isAuthenticated: () => {
          const token = localStorage.getItem('auth_token');
          const userData = localStorage.getItem('user_data');

          return !!(token && userData);
        },
      },
      actors: {
        loginUser: fromPromise(async ({ input }) => {
          const result = await loginUser({
            email: input.email,
            password: input.password,
          });

          return result;
        }),
        registerUser: fromPromise(async ({ input }) => {
          const result = await registerUser({
            name: input.name,
            email: input.email,
            password: input.password,
          });

          return result;
        }),
      },
      actions: {
        clearAuth: assign(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');

          return {
            name: '',
            email: '',
            password: '',
            user: null,
            error: null,
          };
        }),
        setUser: assign(({ event }) => {
          const response =
            event.type === 'xstate.done.actor.loginUser' ||
            event.type === 'xstate.done.actor.registerUser'
              ? (event.output as LoginResponse)
              : null;

          if (!response) {
            return {};
          }

          localStorage.setItem('auth_token', response.user.token);
          localStorage.setItem('user_data', JSON.stringify(response.user));

          return {
            user: response.user,
            error: null,
          };
        }),
        setInitUser: assign(() => {
          const token = localStorage.getItem('auth_token');
          const userData = localStorage.getItem('user_data');

          if (token && userData) {
            return {
              user: JSON.parse(userData),
            };
          }

          return {};
        }),
      },
    }),
  );
}
