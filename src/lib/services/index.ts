// Export all service layer functions

// IMDB API service
export {
  fetchPopularMovies,
  searchMovies,
  fetchMovieDetails,
  fetchMovieCredits,
  fetchGenres
} from './imdb';

// Supabase service
export {
  supabase,
  createUser,
  verifyLogin,
  getUserById,
  addToWatchlist,
  removeFromWatchlist,
  fetchWatchlist
} from './supabase';
