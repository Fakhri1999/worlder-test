const routesUrl = {
  index: '/',
  movies: '/movies',
  movieDetail: (id: number | string) => `/movies/${id}`,
};

export { routesUrl };
