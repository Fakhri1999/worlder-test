import { describe, expect, it } from 'vitest';

import { mockMovieDetail } from '@/test/mocks/movie.mock';
import { render, screen } from '@/test/test-utils';

import { MovieDetail } from './MovieDetail';

describe('MovieDetail', () => {
  const defaultProps = {
    movieDetail: mockMovieDetail,
    isLoading: false,
    error: null,
  };

  it('renders movie title and tagline', () => {
    render(<MovieDetail {...defaultProps} />);

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText(/"Test tagline"/)).toBeInTheDocument();
  });

  it('displays movie poster with correct alt text', () => {
    render(<MovieDetail {...defaultProps} />);

    const poster = screen.getByRole('img', { name: /test movie/i });
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute(
      'src',
      expect.stringContaining('/test-poster.jpg'),
    );
  });

  it('shows rating information', () => {
    render(<MovieDetail {...defaultProps} />);

    expect(screen.getByText('8.5')).toBeInTheDocument();
    expect(screen.getByText(/1000/)).toBeInTheDocument();
  });

  it('displays release year', () => {
    render(<MovieDetail {...defaultProps} />);

    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('shows runtime in hours and minutes', () => {
    render(<MovieDetail {...defaultProps} />);

    expect(screen.getByText(/2h 0m/)).toBeInTheDocument();
  });

  it('displays movie status', () => {
    render(<MovieDetail {...defaultProps} />);

    expect(screen.getByText('Released')).toBeInTheDocument();
  });

  it('renders all genres', () => {
    render(<MovieDetail {...defaultProps} />);

    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Adventure')).toBeInTheDocument();
  });

  it('shows overview text', () => {
    render(<MovieDetail {...defaultProps} />);

    expect(
      screen.getByText('This is a test movie overview'),
    ).toBeInTheDocument();
  });

  it('displays budget when greater than 0', () => {
    render(<MovieDetail {...defaultProps} />);

    expect(screen.getByText(/budget/i)).toBeInTheDocument();
    expect(screen.getByText('$100,000,000')).toBeInTheDocument();
  });

  it('displays revenue when greater than 0', () => {
    render(<MovieDetail {...defaultProps} />);

    expect(screen.getByText(/revenue/i)).toBeInTheDocument();
    expect(screen.getByText('$500,000,000')).toBeInTheDocument();
  });

  it('shows original language', () => {
    render(<MovieDetail {...defaultProps} />);

    expect(screen.getByText('Original Language')).toBeInTheDocument();
    // The component displays the language code with uppercase CSS class
    const languageElement = screen
      .getByText('Original Language')
      .parentElement?.querySelector('p.uppercase');
    expect(languageElement).toBeInTheDocument();
    expect(languageElement).toHaveTextContent('en');
  });

  it('displays original title when different from title', () => {
    render(<MovieDetail {...defaultProps} />);

    expect(screen.getByText('Original Title')).toBeInTheDocument();
    expect(screen.getByText('Test Movie Original')).toBeInTheDocument();
  });

  it('renders production companies', () => {
    render(<MovieDetail {...defaultProps} />);

    // The component displays the heading in uppercase
    expect(screen.getByText('PRODUCTION COMPANIES')).toBeInTheDocument();
    expect(screen.getByText('Test Studios')).toBeInTheDocument();
  });

  it('shows homepage link when available', () => {
    render(<MovieDetail {...defaultProps} />);

    const link = screen.getByRole('link', { name: 'Visit Official Website' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://test-movie.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('displays loading skeleton when isLoading is true', () => {
    render(
      <MovieDetail {...defaultProps} isLoading={true} movieDetail={null} />,
    );

    // Should show skeleton loaders
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows error message when error is present', () => {
    const error = {
      _type: 'FETCH_ERROR' as const,
      status: 404,
      message: 'Not found',
    };

    render(<MovieDetail {...defaultProps} error={error} movieDetail={null} />);

    expect(screen.getByText(/oops/i)).toBeInTheDocument();
  });

  it('renders header actions when provided', () => {
    render(
      <MovieDetail
        {...defaultProps}
        headerActions={<button>Back to Movies</button>}
      />,
    );

    expect(screen.getByText('Back to Movies')).toBeInTheDocument();
  });

  it('shows no image placeholder when poster_path is null', () => {
    const movieWithoutPoster = {
      ...mockMovieDetail,
      poster_path: null,
    };

    render(<MovieDetail {...defaultProps} movieDetail={movieWithoutPoster} />);

    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  it('does not show budget section when budget is 0', () => {
    const movieWithoutBudget = {
      ...mockMovieDetail,
      budget: 0,
    };

    render(<MovieDetail {...defaultProps} movieDetail={movieWithoutBudget} />);

    expect(screen.queryByText(/budget/i)).not.toBeInTheDocument();
  });

  it('does not show revenue section when revenue is 0', () => {
    const movieWithoutRevenue = {
      ...mockMovieDetail,
      revenue: 0,
    };

    render(<MovieDetail {...defaultProps} movieDetail={movieWithoutRevenue} />);

    expect(screen.queryByText(/revenue/i)).not.toBeInTheDocument();
  });

  it('does not show homepage link when not available', () => {
    const movieWithoutHomepage = {
      ...mockMovieDetail,
      homepage: null,
    };

    render(
      <MovieDetail {...defaultProps} movieDetail={movieWithoutHomepage} />,
    );

    expect(
      screen.queryByRole('link', { name: /visit website/i }),
    ).not.toBeInTheDocument();
  });
});
