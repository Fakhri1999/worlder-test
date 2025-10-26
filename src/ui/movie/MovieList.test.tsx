import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { mockMovies } from '@/test/mocks/movie.mock';
import { render, screen } from '@/test/test-utils';

import { MovieList } from './MovieList';

describe('MovieList', () => {
  const mockOnCategoryChange = vi.fn();
  const mockOnSearchInputChange = vi.fn();
  const mockOnSearchSubmit = vi.fn();
  const mockOnClearSearch = vi.fn();
  const mockOnPageChange = vi.fn();
  const mockOnToggleFavorite = vi.fn();

  const defaultProps = {
    movies: mockMovies,
    categories: [
      {
        value: 'popular' as const,
        label: 'Popular',
        gradient: 'from-blue-500 to-purple-600',
        shadow: 'shadow-blue-500/50',
      },
      {
        value: 'top_rated' as const,
        label: 'Top Rated',
        gradient: 'from-yellow-500 to-orange-600',
        shadow: 'shadow-yellow-500/50',
      },
    ],
    selectedCategory: 'popular' as const,
    searchQuery: '',
    searchInput: '',
    currentPage: 1,
    totalPage: 5,
    mode: 'tmdb' as const,
    isLoading: false,
    error: null,
    favoriteIds: new Set<number>(),
    isLoadingFavorites: false,
    isLoadingCategories: false,
    onCategoryChange: mockOnCategoryChange,
    onSearchInputChange: mockOnSearchInputChange,
    onSearchSubmit: mockOnSearchSubmit,
    onClearSearch: mockOnClearSearch,
    onPageChange: mockOnPageChange,
    onToggleFavorite: mockOnToggleFavorite,
  };

  it('renders movies grid when not loading', () => {
    render(<MovieList {...defaultProps} />);

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 3')).toBeInTheDocument();
  });

  it('displays loading skeleton when isLoading is true', () => {
    render(<MovieList {...defaultProps} isLoading={true} movies={[]} />);

    // Should show skeleton loaders instead of movies
    const skeletons = screen.getAllByRole('generic');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders category tabs', () => {
    render(<MovieList {...defaultProps} />);

    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.getByText('Top Rated')).toBeInTheDocument();
  });

  it('calls onCategoryChange when category tab is clicked', async () => {
    const user = userEvent.setup();
    render(<MovieList {...defaultProps} />);

    const topRatedButton = screen.getByText('Top Rated');
    await user.click(topRatedButton);

    expect(mockOnCategoryChange).toHaveBeenCalledWith('top_rated');
  });

  it('renders search input', () => {
    render(<MovieList {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('calls onSearchInputChange when typing in search box', async () => {
    const user = userEvent.setup();
    render(<MovieList {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'Inception');

    expect(mockOnSearchInputChange).toHaveBeenCalled();
  });

  it('calls onSearchSubmit when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<MovieList {...defaultProps} searchInput='Inception' />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, '{Enter}');

    expect(mockOnSearchSubmit).toHaveBeenCalled();
  });

  it('shows clear search button when search input has value', () => {
    render(<MovieList {...defaultProps} searchInput='test' />);

    // Clear button is a button with IoClose icon, find it by the presence of the button
    const buttons = screen.getAllByRole('button');
    const clearButton = buttons.find(
      (btn) => btn.querySelector('svg') && btn.className.includes('absolute'),
    );
    expect(clearButton).toBeInTheDocument();
  });

  it('calls onClearSearch when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<MovieList {...defaultProps} searchInput='test' />);

    // Clear button is a button with IoClose icon
    const buttons = screen.getAllByRole('button');
    const clearButton = buttons.find(
      (btn) => btn.querySelector('svg') && btn.className.includes('absolute'),
    );
    await user.click(clearButton!);

    expect(mockOnClearSearch).toHaveBeenCalled();
  });

  it('displays search results message when searchQuery is present', () => {
    render(<MovieList {...defaultProps} searchQuery='Inception' />);

    expect(screen.getByText('Search results for:')).toBeInTheDocument();
    expect(screen.getByText(/"Inception"/)).toBeInTheDocument();
  });

  it('renders pagination for tmdb mode', () => {
    render(<MovieList {...defaultProps} mode='tmdb' />);

    expect(screen.getByText('Page')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    // The 'of' text is part of "of 5" string with a space
    expect(screen.getByText(/of\s+5/)).toBeInTheDocument();
  });

  it('does not render pagination for favorites mode', () => {
    render(<MovieList {...defaultProps} mode='favorites' />);

    expect(screen.queryByText(/previous/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/next/i)).not.toBeInTheDocument();
  });

  it('calls onPageChange when pagination buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<MovieList {...defaultProps} currentPage={2} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('disables previous button on first page', () => {
    render(<MovieList {...defaultProps} currentPage={1} />);

    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<MovieList {...defaultProps} currentPage={5} totalPage={5} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('displays error message when error is present', () => {
    const error = {
      _type: 'FETCH_ERROR' as const,
      status: 404,
      message: 'Not found',
    };

    render(<MovieList {...defaultProps} error={error} />);

    expect(screen.getByText(/oops/i)).toBeInTheDocument();
  });

  it('shows empty state when no movies found with search', () => {
    render(
      <MovieList
        {...defaultProps}
        movies={[]}
        searchQuery='nonexistent'
        isLoading={false}
      />,
    );

    expect(screen.getByText('No movies found')).toBeInTheDocument();
  });

  it('renders header actions when provided', () => {
    render(
      <MovieList
        {...defaultProps}
        headerActions={<button>Back to Home</button>}
      />,
    );

    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  it('shows category loading skeleton when isLoadingCategories is true', () => {
    render(<MovieList {...defaultProps} isLoadingCategories={true} />);

    // Should show skeleton buttons for categories
    const categorySkeletons = document.querySelectorAll('.animate-pulse');
    expect(categorySkeletons.length).toBeGreaterThan(0);
  });
});
