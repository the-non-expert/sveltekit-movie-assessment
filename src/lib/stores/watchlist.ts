import { writable } from 'svelte/store';
import type { WatchlistItem } from '$lib/types/watchlist';
import type { Movie } from '$lib/types/movie';
import {
  fetchWatchlist,
  addToWatchlist as addToWatchlistDb,
  removeFromWatchlist as removeFromWatchlistDb
} from '$lib/services/supabase';

interface WatchlistState {
  items: WatchlistItem[];
  movieIds: Set<string>;
  loading: boolean;
}

/**
 * Create the watchlist store with methods for managing user's watchlist
 */
function createWatchlistStore() {
  const { subscribe, set, update } = writable<WatchlistState>({
    items: [],
    movieIds: new Set(),
    loading: false
  });

  return {
    subscribe,

    /**
     * Load watchlist from database for a user
     */
    load: async (userId: string) => {
      update((state) => ({ ...state, loading: true }));

      try {
        const items = await fetchWatchlist(userId);
        const movieIds = new Set(items.map((item) => item.movieId));

        set({
          items,
          movieIds,
          loading: false
        });
      } catch (error) {
        console.error('Error loading watchlist:', error);
        set({
          items: [],
          movieIds: new Set(),
          loading: false
        });
      }
    },

    /**
     * Add a movie to the watchlist
     */
    add: async (movie: Movie, userId: string): Promise<boolean> => {
      try {
        const item = await addToWatchlistDb(movie, userId);

        update((state) => {
          const newMovieIds = new Set(state.movieIds);
          newMovieIds.add(item.movieId);

          return {
            items: [item, ...state.items],
            movieIds: newMovieIds,
            loading: false
          };
        });

        return true;
      } catch (error) {
        console.error('Error adding to watchlist:', error);
        return false;
      }
    },

    /**
     * Remove a movie from the watchlist
     */
    remove: async (movieId: string, userId: string): Promise<boolean> => {
      try {
        const success = await removeFromWatchlistDb(movieId, userId);

        if (success) {
          update((state) => {
            const newMovieIds = new Set(state.movieIds);
            newMovieIds.delete(movieId);

            return {
              items: state.items.filter((item) => item.movieId !== movieId),
              movieIds: newMovieIds,
              loading: false
            };
          });
        }

        return success;
      } catch (error) {
        console.error('Error removing from watchlist:', error);
        return false;
      }
    },

    /**
     * Check if a movie is in the watchlist
     */
    isInWatchlist: (movieId: string): boolean => {
      let isIn = false;

      update((state) => {
        isIn = state.movieIds.has(movieId);
        return state;
      });

      return isIn;
    },

    /**
     * Clear the watchlist (useful on logout)
     */
    clear: () => {
      set({
        items: [],
        movieIds: new Set(),
        loading: false
      });
    }
  };
}

export const watchlistStore = createWatchlistStore();
