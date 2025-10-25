import { z } from 'zod';

export type GetMoviesRequest = {
  page?: number;
  sort_by?:
    | 'original_title.asc'
    | 'original_title.desc'
    | 'popularity.asc'
    | 'popularity.desc'
    | 'revenue.asc'
    | 'revenue.desc'
    | 'primary_release_date.asc'
    | 'title.asc'
    | 'title.desc'
    | 'primary_release_date.desc'
    | 'vote_average.asc'
    | 'vote_average.desc'
    | 'vote_count.asc'
    | 'vote_count.desc';
};

export const MovieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const GetMoviesResponseSchema = z.object({
  page: z.number(),
  results: z.array(MovieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const ProductionCompanySchema = z.object({
  id: z.number(),
  logo_path: z.string().nullable(),
  name: z.string(),
  origin_country: z.string(),
});

export const ProductionCountrySchema = z.object({
  iso_3166_1: z.string(),
  name: z.string(),
});

export const SpokenLanguageSchema = z.object({
  english_name: z.string(),
  iso_639_1: z.string(),
  name: z.string(),
});

export const MovieDetailSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  belongs_to_collection: z
    .object({
      id: z.number(),
      name: z.string(),
      poster_path: z.string().nullable(),
      backdrop_path: z.string().nullable(),
    })
    .nullable(),
  budget: z.number(),
  genres: z.array(GenreSchema),
  homepage: z.string().nullable(),
  id: z.number(),
  imdb_id: z.string().nullable(),
  origin_country: z.array(z.string()),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  production_companies: z.array(ProductionCompanySchema),
  production_countries: z.array(ProductionCountrySchema),
  release_date: z.string(),
  revenue: z.number(),
  runtime: z.number().nullable(),
  spoken_languages: z.array(SpokenLanguageSchema),
  status: z.string(),
  tagline: z.string().nullable(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

// Favorite Movie Schema (extends Movie with addedAt timestamp)
export const FavoriteMovieSchema = MovieSchema.extend({
  addedAt: z.number(),
});

// Inferred Types from Schemas
export type Movie = z.infer<typeof MovieSchema>;
export type GetMoviesResponse = z.infer<typeof GetMoviesResponseSchema>;
export type MovieDetail = z.infer<typeof MovieDetailSchema>;
export type FavoriteMovie = z.infer<typeof FavoriteMovieSchema>;
