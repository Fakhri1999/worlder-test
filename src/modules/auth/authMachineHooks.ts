import { useMachine } from '@xstate/react';
import { signOut } from 'firebase/auth';
import { assign, fromPromise } from 'xstate';

import { firebaseAuth } from '@/libs/firebase';

import { LoginResponse } from './authEntity';
import { useAuthUser } from './authHooks';
import { authMachine } from './authMachine';
import { loginUser, loginWithGoogle, registerUser } from './authServices';

export function useAuthMachine() {
  const { user } = useAuthUser();

  return useMachine(
    authMachine.provide({
      guards: {
        isAuthenticated: () => {
          // Check if user is authenticated via Firebase Auth
          return !!firebaseAuth.currentUser;
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
        loginWithGoogle: fromPromise(async () => {
          const result = await loginWithGoogle();

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
          // Sign out from Firebase Auth (no localStorage cleanup needed)
          signOut(firebaseAuth).catch((error) => {
            console.error('Firebase signout error:', error);
          });

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
            event.type === 'xstate.done.actor.loginWithGoogle' ||
            event.type === 'xstate.done.actor.registerUser'
              ? (event.output as LoginResponse)
              : null;

          if (!response) {
            return {};
          }

          // No localStorage - Firebase Auth handles persistence
          return {
            user: response.user,
            error: null,
          };
        }),
        setInitUser: assign(() => {
          // Use Firebase Auth's current user instead of localStorage

          if (user) {
            // Map Firebase user to your User type
            const newUser = {
              id: user.uid,
              email: user.email || '',
              name: user.displayName || '',
              token: '', // Token not needed when using Firebase Auth directly
            };

            return {
              user: newUser,
            };
          }

          return {};
        }),
      },
    }),
  );
}
