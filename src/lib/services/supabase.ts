import { createClient } from '@supabase/supabase-js';
import type { User, SignupData, LoginData } from '$lib/types/user';
import type { WatchlistItem } from '$lib/types/watchlist';
import type { Movie } from '$lib/types/movie';
import { hashPassword, verifyPassword } from '$lib/utils/auth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==================== AUTH FUNCTIONS ====================

/**
 * Create a new user in the database
 * @param signupData - User signup information
 * @returns Created user object
 */
export async function createUser(signupData: SignupData): Promise<User> {
  try {
    // Hash the password
    const passwordHash = await hashPassword(signupData.password);

    // Insert user into database
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: signupData.name,
        email: signupData.email,
        password_hash: passwordHash,
        favourite_movie_genre: signupData.favouriteGenre
      })
      .select('id, name, email, favourite_movie_genre')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Failed to create user');
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      favouriteGenre: data.favourite_movie_genre
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Verify user login credentials
 * @param loginData - Login credentials
 * @returns User object if credentials are valid, null otherwise
 */
export async function verifyLogin(loginData: LoginData): Promise<User | null> {
  try {
    // Fetch user by email
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, password_hash, favourite_movie_genre')
      .eq('email', loginData.email)
      .single();

    if (error || !data) {
      return null;
    }

    // Verify password
    const isPasswordValid = await verifyPassword(loginData.password, data.password_hash);

    if (!isPasswordValid) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      favouriteGenre: data.favourite_movie_genre
    };
  } catch (error) {
    console.error('Error verifying login:', error);
    return null;
  }
}

/**
 * Get user by ID
 * @param userId - User UUID
 * @returns User object or null if not found
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, favourite_movie_genre')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      favouriteGenre: data.favourite_movie_genre
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// ==================== WATCHLIST FUNCTIONS ====================

/**
 * Add a movie to user's watchlist
 * @param movie - Movie to add
 * @param userId - User UUID
 * @returns Created watchlist item
 */
export async function addToWatchlist(movie: Movie, userId: string): Promise<WatchlistItem> {
  try {
    const { data, error } = await supabase
      .from('watchlist')
      .insert({
        user_id: userId,
        movie_id: movie.id,
        movie_title: movie.title,
        movie_poster_path: movie.posterUrl
      })
      .select('id, user_id, movie_id, movie_title, movie_poster_path, added_at')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Failed to add movie to watchlist');
    }

    return {
      id: data.id,
      userId: data.user_id,
      movieId: data.movie_id,
      movieTitle: data.movie_title,
      posterPath: data.movie_poster_path,
      addedAt: data.added_at
    };
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
}

/**
 * Remove a movie from user's watchlist
 * @param movieId - Movie ID
 * @param userId - User UUID
 * @returns True if successful
 */
export async function removeFromWatchlist(movieId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('movie_id', movieId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
}

/**
 * Fetch all watchlist items for a user
 * @param userId - User UUID
 * @returns Array of watchlist items
 */
export async function fetchWatchlist(userId: string): Promise<WatchlistItem[]> {
  try {
    const { data, error } = await supabase
      .from('watchlist')
      .select('id, user_id, movie_id, movie_title, movie_poster_path, added_at')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      userId: item.user_id,
      movieId: item.movie_id,
      movieTitle: item.movie_title,
      posterPath: item.movie_poster_path,
      addedAt: item.added_at
    }));
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return [];
  }
}
