import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { MovieCard } from './MovieCard';
import { mockMovie } from '@/test/mocks/movie.mock';
import userEvent from '@testing-library/user-event';

describe('MovieCard', () => {
  const mockOnToggleFavorite = vi.fn();

  const defaultProps = {
    movie: mockMovie,
    isFavorite: false,
    isLoadingFavorites: false,
    onToggleFavorite: mockOnToggleFavorite,
  };

  it('renders movie information correctly', () => {
    render(<MovieCard {...defaultProps} />);

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('displays movie poster with correct alt text', () => {
    render(<MovieCard {...defaultProps} />);

    const poster = screen.getByRole('img', { name: /test movie/i });
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute(
      'src',
      expect.stringContaining('/test-poster.jpg'),
    );
  });

  it('shows favorite button with heart icon', () => {
    render(<MovieCard {...defaultProps} />);

    const favoriteButton = screen.getByRole('button', {
      name: 'Add to favorites',
    });
    expect(favoriteButton).toBeInTheDocument();
  });

  it('calls onToggleFavorite when favorite button is clicked', async () => {
    const user = userEvent.setup();
    render(<MovieCard {...defaultProps} />);

    const favoriteButton = screen.getByRole('button', {
      name: 'Add to favorites',
    });
    await user.click(favoriteButton);

    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockOnToggleFavorite).toHaveBeenCalledWith(mockMovie);
  });

  it('shows filled heart when movie is favorited', () => {
    render(<MovieCard {...defaultProps} isFavorite={true} />);

    const favoriteButton = screen.getByRole('button', {
      name: 'Remove from favorites',
    });
    expect(favoriteButton).toBeInTheDocument();

    // Check if the heart icon has filled state
    const heartIcon = favoriteButton.querySelector('svg');
    expect(heartIcon).toHaveAttribute('fill', '#EF4444');
  });

  it('disables favorite button when loading favorites', () => {
    render(<MovieCard {...defaultProps} isLoadingFavorites={true} />);

    const favoriteButton = screen.getByRole('button', {
      name: 'Add to favorites',
    });
    expect(favoriteButton).toBeDisabled();
  });

  it('displays correct year from release date', () => {
    const movieWithDate = {
      ...mockMovie,
      release_date: '2023-05-15',
    };

    render(<MovieCard {...defaultProps} movie={movieWithDate} />);

    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('formats vote average to one decimal place', () => {
    const movieWithRating = {
      ...mockMovie,
      vote_average: 7.654,
    };

    render(<MovieCard {...defaultProps} movie={movieWithRating} />);

    expect(screen.getByText('7.7')).toBeInTheDocument();
  });

  it('handles missing poster path', () => {
    const movieWithoutPoster = {
      ...mockMovie,
      poster_path: null,
    };

    render(<MovieCard {...defaultProps} movie={movieWithoutPoster} />);

    // Should still render the card
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });
});
