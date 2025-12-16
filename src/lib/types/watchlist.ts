export interface WatchlistItem {
  id: string;
  userId: string;
  movieId: string; // IMDB movie ID (e.g., "tt1234567")
  movieTitle: string;
  posterPath: string;
  addedAt: string;
}
