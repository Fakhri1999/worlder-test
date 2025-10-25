import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { APIError } from '@/libs/fetcher';
import { firebaseAuth } from '@/libs/firebase';

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from './authEntity';

export async function loginUser(request: LoginRequest): Promise<LoginResponse> {
  try {
    // Sign in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      request.email,
      request.password,
    );

    const user = userCredential.user;

    // Get Firebase access token
    const token = await user.getIdToken();

    return {
      success: true,
      user: {
        id: user.uid,
        email: user.email || request.email,
        name: user.displayName || user.email?.split('@')[0] || 'User',
        token: token,
      },
    };
  } catch (error: unknown) {
    console.error('[loginUser] error:', error);
    const firebaseError = error as { code?: string; message?: string };
    let errorMessage = 'Authentication failed. Please try again.';

    // Handle specific Firebase authentication errors
    switch (firebaseError.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        errorMessage =
          'Invalid email or password. Please check your credentials.';
        break;

      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format.';
        break;

      case 'auth/user-disabled':
        errorMessage =
          'This account has been disabled. Please contact support.';
        break;

      case 'auth/too-many-requests':
        errorMessage =
          'Too many failed login attempts. Please try again later or reset your password.';
        break;

      case 'auth/network-request-failed':
        errorMessage =
          'Network error. Please check your internet connection and try again.';
        break;

      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password authentication is not enabled.';
        break;

      case 'auth/configuration-not-found':
      case 'auth/internal-error':
        errorMessage = 'Authentication service error. Please try again later.';
        break;

      default:
        // Use Firebase's error message if available, otherwise use generic message
        if (firebaseError.message) {
          // Remove "Firebase: " prefix from error message if present
          errorMessage = firebaseError.message.replace(/^Firebase:\s*/i, '');
        }
        break;
    }

    const err: APIError = {
      _type: 'AUTH_ERROR',
      message: errorMessage,
      error,
    };
    throw err;
  }
}

export async function registerUser(
  request: RegisterRequest,
): Promise<LoginResponse> {
  try {
    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      request.email,
      request.password,
    );

    const user = userCredential.user;

    // Update user profile with display name if provided
    if (request.name) {
      await updateProfile(user, {
        displayName: request.name,
      });
    }

    // Get Firebase Access token
    const token = await user.getIdToken();

    return {
      success: true,
      user: {
        id: user.uid,
        email: user.email || request.email,
        name: request.name || user.email?.split('@')[0] || 'User',
        token: token,
      },
    };
  } catch (error: unknown) {
    console.error('[registerUser] error:', error);
    const firebaseError = error as { code?: string; message?: string };
    let errorMessage = 'Registration failed. Please try again.';

    // Handle specific Firebase registration errors
    switch (firebaseError.code) {
      case 'auth/email-already-in-use':
        errorMessage =
          'This email is already registered. Please login instead or use a different email.';
        break;

      case 'auth/weak-password':
        errorMessage =
          'Password is too weak. Please use at least 6 characters with a mix of letters and numbers.';
        break;

      case 'auth/invalid-email':
        errorMessage =
          'Invalid email address format. Please enter a valid email.';
        break;

      case 'auth/operation-not-allowed':
        errorMessage =
          'Email/password registration is not enabled. Please contact support.';
        break;

      case 'auth/too-many-requests':
        errorMessage =
          'Too many registration attempts. Please try again later.';
        break;

      case 'auth/network-request-failed':
        errorMessage =
          'Network error. Please check your internet connection and try again.';
        break;

      case 'auth/invalid-password':
        errorMessage =
          'Invalid password. Password must be at least 6 characters long.';
        break;

      case 'auth/configuration-not-found':
      case 'auth/internal-error':
        errorMessage = 'Registration service error. Please try again later.';
        break;

      case 'auth/admin-restricted-operation':
        errorMessage =
          'Registration is currently restricted. Please contact support.';
        break;

      default:
        // Use Firebase's error message if available, otherwise use generic message
        if (firebaseError.message) {
          // Remove "Firebase: " prefix from error message if present
          errorMessage = firebaseError.message.replace(/^Firebase:\s*/i, '');
        }
        break;
    }

    const err: APIError = {
      _type: 'AUTH_ERROR',
      message: errorMessage,
      error,
    };
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    // Sign out from Firebase
    await signOut(firebaseAuth);

    // Clear any stored authentication data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  } catch (error: unknown) {
    console.error('[logoutUser] error:', error);
    const firebaseError = error as { message?: string };
    throw new Error(
      firebaseError.message || 'Logout failed. Please try again.',
    );
  }
}
