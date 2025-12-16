import type { Movie, Genre, ImdbApiTitle, ImdbApiCreditsResponse } from '$lib/types/movie';

const IMDB_BASE_URL = 'https://api.imdbapi.dev';

/**
 * Transform IMDB API title to app Movie type
 */
function transformImdbTitle(title: ImdbApiTitle): Movie {
  return {
    id: title.id,
    title: title.primaryTitle || title.originalTitle || 'Unknown Title',
    overview: title.plot || 'No overview available',
    posterUrl: title.primaryImage?.url || '/placeholder-poster.jpg',
    backdropUrl: title.primaryImage?.url || '/placeholder-backdrop.jpg',
    rating: title.rating?.aggregateRating || 0,
    releaseYear: title.startYear || 0,
    genres: title.genres || [],
    runtime: title.runtimeSeconds ? Math.floor(title.runtimeSeconds / 60) : undefined
  };
}

/**
 * Fetch popular/trending movies
 * @param pageToken - Pagination token (optional)
 */
export async function fetchPopularMovies(pageToken?: string): Promise<Movie[]> {
  try {
    const params = new URLSearchParams({
      types: 'MOVIE',
      sortBy: 'SORT_BY_POPULARITY',
      sortOrder: 'ASC',
      ...(pageToken && { pageToken })
    });

    const response = await fetch(`${IMDB_BASE_URL}/titles?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`IMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.titles || !Array.isArray(data.titles)) {
      return [];
    }

    return data.titles.map(transformImdbTitle);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
}

/**
 * Search movies by query
 * @param query - Search term
 */
export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      query: query,
      limit: '20'
    });

    const response = await fetch(`${IMDB_BASE_URL}/search/titles?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`IMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map(transformImdbTitle);
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}

/**
 * Fetch detailed information for a specific movie
 * @param id - IMDB movie ID (e.g., "tt1234567")
 */
export async function fetchMovieDetails(id: string): Promise<Movie> {
  try {
    const response = await fetch(`${IMDB_BASE_URL}/titles/${id}`);

    if (!response.ok) {
      throw new Error(`IMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data) {
      throw new Error('Movie not found');
    }

    return transformImdbTitle(data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

/**
 * Fetch cast and crew for a specific movie
 * @param id - IMDB movie ID
 */
export async function fetchMovieCredits(id: string): Promise<Movie['cast']> {
  try {
    const response = await fetch(`${IMDB_BASE_URL}/titles/${id}/credits`);

    if (!response.ok) {
      throw new Error(`IMDB API error: ${response.statusText}`);
    }

    const data: ImdbApiCreditsResponse = await response.json();

    if (!data.credits?.edges) {
      return [];
    }

    // Filter to get only actors and limit to top 15
    return data.credits.edges
      .filter((edge) => edge.node.category?.text === 'Actor' || edge.node.category?.text === 'Actress')
      .slice(0, 15)
      .map((edge) => ({
        name: edge.node.name?.nameText?.text || 'Unknown',
        character: edge.node.characters?.[0]?.name || 'Unknown Role',
        profileUrl: edge.node.name?.primaryImage?.url
      }));
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    return [];
  }
}

/**
 * Fetch list of available genres
 * Returns a predefined list of common IMDB genres
 */
export async function fetchGenres(): Promise<Genre[]> {
  const genres: Genre[] = [
    { id: 'Action', name: 'Action' },
    { id: 'Adventure', name: 'Adventure' },
    { id: 'Animation', name: 'Animation' },
    { id: 'Comedy', name: 'Comedy' },
    { id: 'Crime', name: 'Crime' },
    { id: 'Documentary', name: 'Documentary' },
    { id: 'Drama', name: 'Drama' },
    { id: 'Family', name: 'Family' },
    { id: 'Fantasy', name: 'Fantasy' },
    { id: 'History', name: 'History' },
    { id: 'Horror', name: 'Horror' },
    { id: 'Music', name: 'Music' },
    { id: 'Mystery', name: 'Mystery' },
    { id: 'Romance', name: 'Romance' },
    { id: 'Sci-Fi', name: 'Science Fiction' },
    { id: 'Thriller', name: 'Thriller' },
    { id: 'War', name: 'War' },
    { id: 'Western', name: 'Western' }
  ];

  return genres;
}
