import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

import { useAuthUser } from '@/modules/auth/authHooks';
import type { Movie } from '@/modules/movie/movieEntity';
import { useFavoritesMachine } from '@/modules/movie/movieFavoritesMachineHooks';
import { useMovieMachine } from '@/modules/movie/movieMachineHooks';
import { routesUrl } from '@/routes/routesConfig';
import { MovieList } from '@/ui/movie/MovieList';
import type { Category } from '@/ui/movie/MovieList';

type MovieCategory = 'popular' | 'now_playing' | 'top_rated' | 'favorites';

function MovieListContainer() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get category from URL query params, default to 'popular'
  const urlCategory = searchParams.get('category') as MovieCategory | null;
  const validCategories: MovieCategory[] = [
    'popular',
    'now_playing',
    'top_rated',
    'favorites',
  ];
  const initialCategory: MovieCategory =
    urlCategory && validCategories.includes(urlCategory)
      ? urlCategory
      : 'popular';

  const [selectedCategory, setSelectedCategory] =
    useState<MovieCategory>(initialCategory);
  const [searchInput, setSearchInput] = useState('');
  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  const [movieState, movieSend] = useMovieMachine();
  const [favoritesState, favoritesSend] = useFavoritesMachine();
  const { user, isAuthReady } = useAuthUser();

  // Track if initial fetch has been triggered
  const initialFetchDone = useRef(false);

  // Build categories with translated labels
  const categories = useMemo(() => {
    const arr: Category[] = [
      {
        value: 'popular',
        label: `🔥 ${t('movies.categories.popular')}`,
        gradient: 'from-blue-500 to-purple-600',
        shadow: 'shadow-blue-500/50',
      },
      {
        value: 'now_playing',
        label: `🎬 ${t('movies.categories.nowPlaying')}`,
        gradient: 'from-pink-500 to-rose-600',
        shadow: 'shadow-pink-500/50',
      },
      {
        value: 'top_rated',
        label: `⭐ ${t('movies.categories.topRated')}`,
        gradient: 'from-yellow-500 to-orange-600',
        shadow: 'shadow-yellow-500/50',
      },
      {
        value: 'favorites',
        label: `❤️ ${t('movies.categories.favorites')}`,
        gradient: 'from-red-500 to-pink-600',
        shadow: 'shadow-red-500/50',
        hidden: user?.uid == null,
      },
    ];

    return arr.filter((cat) => !cat.hidden);
  }, [t, user]);

  // Load favorites on mount
  useEffect(() => {
    if (!isAuthReady) {
      // Wait for auth to initialize
      return;
    }

    if (!user?.uid) {
      // Auth is ready but no user logged in - mark as initialized
      favoritesSend({ type: 'SKIP_FAVORITES' });
      return;
    }

    favoritesSend({ type: 'LOAD_FAVORITES' });
  }, [favoritesSend, user?.uid, isAuthReady]);

  // Fetch initial data from URL on mount (only once)
  useEffect(() => {
    if (initialFetchDone.current) return;

    // Check if there's a search query in URL
    const urlSearch = searchParams.get('search');
    const urlPage = searchParams.get('page');
    const page = urlPage ? parseInt(urlPage, 10) : 1;

    if (urlSearch) {
      // Initialize with search
      setSearchInput(urlSearch);
      movieSend({
        type: 'SEARCH_MOVIES',
        data: { query: urlSearch, page },
      });
    } else if (selectedCategory === 'favorites') {
      movieSend({ type: 'FETCH_FAVORITES' });
    } else if (selectedCategory === 'now_playing') {
      movieSend({ type: 'FETCH_NOW_PLAYING', data: { page: 1 } });
    } else if (selectedCategory === 'top_rated') {
      movieSend({ type: 'FETCH_TOP_RATED', data: { page: 1 } });
    } else {
      movieSend({ type: 'FETCH_MOVIES', data: { page: 1 } });
    }

    initialFetchDone.current = true;
  }, [selectedCategory, movieSend, searchParams]);

  const handleCategoryChange = (newCategory: MovieCategory) => {
    setSelectedCategory(newCategory);
    // Update URL query params
    setSearchParams({ category: newCategory });

    if (newCategory === 'favorites') {
      movieSend({ type: 'FETCH_FAVORITES' });
    } else if (newCategory === 'now_playing') {
      movieSend({ type: 'FETCH_NOW_PLAYING', data: { page: 1 } });
    } else if (newCategory === 'top_rated') {
      movieSend({ type: 'FETCH_TOP_RATED', data: { page: 1 } });
    } else {
      movieSend({ type: 'FETCH_MOVIES', data: { page: 1 } });
    }
  };

  const handleToggleFavorite = (movie: Movie) => {
    if (!user?.uid) {
      alert(t('movies.pleaseLogin'));
      return;
    }

    const isFavorite = favoritesState.context.favoriteIds.has(movie.id);

    if (isFavorite) {
      favoritesSend({
        type: 'REMOVE_FAVORITE',
        data: { movieId: movie.id },
      });
    } else {
      favoritesSend({
        type: 'ADD_FAVORITE',
        data: { movie },
      });
    }
  };

  const handlePageChange = (page: number) => {
    // If in search mode, paginate search results
    if (movieState.context.searchQuery) {
      movieSend({
        type: 'SEARCH_MOVIES',
        data: { query: movieState.context.searchQuery, page },
      });
      setSearchParams({
        search: movieState.context.searchQuery,
        page: String(page),
      });
      return;
    }

    // Otherwise, paginate category results
    if (selectedCategory === 'now_playing') {
      movieSend({ type: 'FETCH_NOW_PLAYING', data: { page } });
    } else if (selectedCategory === 'top_rated') {
      movieSend({ type: 'FETCH_TOP_RATED', data: { page } });
    } else {
      movieSend({ type: 'FETCH_MOVIES', data: { page } });
    }
  };

  const handleSearch = useCallback(
    (query: string, page: number = 1) => {
      if (!query.trim()) {
        return;
      }

      movieSend({ type: 'SEARCH_MOVIES', data: { query: query.trim(), page } });
      setSearchParams({ search: query.trim(), page: String(page) });
    },
    [movieSend, setSearchParams],
  );

  const handleSearchInput = useCallback(
    (value: string) => {
      setSearchInput(value);

      // Clear previous timer
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }

      // If input is empty, clear search immediately
      if (!value.trim()) {
        handleClearSearch();
        return;
      }

      // Debounce search by 500ms
      searchDebounceTimer.current = setTimeout(() => {
        handleSearch(value);
      }, 500);
    },
    [handleSearch],
  );

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    movieSend({ type: 'CLEAR_SEARCH' });

    // Clear debounce timer
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    // Restore category view
    setSearchParams({ category: selectedCategory });

    // Fetch the current category
    if (selectedCategory === 'favorites') {
      movieSend({ type: 'FETCH_FAVORITES' });
    } else if (selectedCategory === 'now_playing') {
      movieSend({ type: 'FETCH_NOW_PLAYING', data: { page: 1 } });
    } else if (selectedCategory === 'top_rated') {
      movieSend({ type: 'FETCH_TOP_RATED', data: { page: 1 } });
    } else {
      movieSend({ type: 'FETCH_MOVIES', data: { page: 1 } });
    }
  }, [selectedCategory, movieSend, setSearchParams]);

  return (
    <MovieList
      movies={movieState.context.movies}
      categories={categories}
      selectedCategory={selectedCategory}
      searchQuery={movieState.context.searchQuery || ''}
      searchInput={searchInput}
      currentPage={movieState.context.currentPage}
      totalPage={movieState.context.totalPage}
      mode={movieState.context.mode}
      error={movieState.context.error}
      favoriteIds={favoritesState.context.favoriteIds}
      isLoadingCategories={!isAuthReady}
      isLoading={movieState.hasTag('loading')}
      isLoadingFavorites={
        !favoritesState.context.isInitialized ||
        favoritesState.matches('Loading Favorites')
      }
      onCategoryChange={handleCategoryChange}
      onSearchInputChange={handleSearchInput}
      onSearchSubmit={() => handleSearch(searchInput)}
      onClearSearch={handleClearSearch}
      onPageChange={handlePageChange}
      onToggleFavorite={handleToggleFavorite}
      headerActions={
        <Link to={routesUrl.index}>
          <button
            type='button'
            className='cursor-pointer group px-6 py-2 bg-app-card/50 backdrop-blur-sm text-app-primary rounded-xl hover:bg-app-card/60 transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2 shadow-lg hover:shadow-xl animate-slideInRight'>
            <svg
              className='w-5 h-5 transform group-hover:-translate-x-1 transition-transform'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            {t('common.backToHome')}
          </button>
        </Link>
      }
    />
  );
}

export { MovieListContainer };
