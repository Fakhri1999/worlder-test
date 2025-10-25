import { get, ref, remove, set } from 'firebase/database';

import { APIError } from '@/libs/fetcher';
import { firebaseDatabase } from '@/libs/firebase';

import type { FavoriteMovie, Movie } from './movieEntity';

export async function addFavorite(userId: string, movie: Movie): Promise<void> {
  try {
    const favoriteMovie: FavoriteMovie = {
      ...movie,
      addedAt: Date.now(),
    };

    const favoriteRef = ref(
      firebaseDatabase,
      `users/${userId}/favorites/${movie.id}`,
    );
    await set(favoriteRef, favoriteMovie);
  } catch (error: unknown) {
    console.error('[addFavorite] error:', error);
    const firebaseError = error as { code?: string; message?: string };
    let errorMessage = 'Failed to add favorite';

    if (firebaseError.code === 'PERMISSION_DENIED') {
      errorMessage = 'Permission denied. Please check Firebase Database rules.';
    } else if (firebaseError.message) {
      errorMessage = firebaseError.message;
    }

    const err: APIError = {
      _type: 'UNKNOWN_ERROR',
      message: errorMessage,
      error,
    };
    throw err;
  }
}

export async function removeFavorite(
  userId: string,
  movieId: number,
): Promise<void> {
  try {
    const favoriteRef = ref(
      firebaseDatabase,
      `users/${userId}/favorites/${movieId}`,
    );
    await remove(favoriteRef);
  } catch (error: unknown) {
    console.error('[removeFavorite] error:', error);
    const firebaseError = error as { code?: string; message?: string };
    let errorMessage = 'Failed to remove favorite';

    if (firebaseError.code === 'PERMISSION_DENIED') {
      errorMessage = 'Permission denied. Please check Firebase Database rules.';
    } else if (firebaseError.message) {
      errorMessage = firebaseError.message;
    }

    const err: APIError = {
      _type: 'UNKNOWN_ERROR',
      message: errorMessage,
      error,
    };
    throw err;
  }
}

export async function getFavorites(userId: string): Promise<FavoriteMovie[]> {
  try {
    const favoritesRef = ref(firebaseDatabase, `users/${userId}/favorites`);

    const snapshot = await get(favoritesRef);

    if (!snapshot.exists()) {
      return [];
    }

    const favoritesData = snapshot.val();
    const favorites: FavoriteMovie[] = Object.values(favoritesData);

    // Sort by addedAt descending (most recent first)
    return favorites.sort((a, b) => b.addedAt - a.addedAt);
  } catch (error: unknown) {
    console.error('[getFavorites] error:', error);
    console.error('error in getFavorites', error);
    const firebaseError = error as { code?: string; message?: string };
    let errorMessage = 'Failed to get favorites';

    if (firebaseError.code === 'PERMISSION_DENIED') {
      errorMessage = 'Permission denied. Please check Firebase Database rules.';
    } else if (firebaseError.message) {
      errorMessage = firebaseError.message;
    }

    const err: APIError = {
      _type: 'UNKNOWN_ERROR',
      message: errorMessage,
      error,
    };
    throw err;
  }
}

export async function isFavorite(
  userId: string,
  movieId: number,
): Promise<boolean> {
  try {
    const favoriteRef = ref(
      firebaseDatabase,
      `users/${userId}/favorites/${movieId}`,
    );
    const snapshot = await get(favoriteRef);
    return snapshot.exists();
  } catch (error: unknown) {
    console.error('[isFavorite] error:', error);
    const firebaseError = error as { code?: string; message?: string };
    let errorMessage = 'Failed to check favorite status';

    if (firebaseError.code === 'PERMISSION_DENIED') {
      errorMessage = 'Permission denied. Please check Firebase Database rules.';
    } else if (firebaseError.message) {
      errorMessage = firebaseError.message;
    }

    const err: APIError = {
      _type: 'UNKNOWN_ERROR',
      message: errorMessage,
      error,
    };
    throw err;
  }
}
