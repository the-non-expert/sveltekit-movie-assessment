import { writable } from 'svelte/store';

interface FilterState {
  selectedGenres: string[];
  yearRange: [number, number];
  minRating: number;
}

const currentYear = new Date().getFullYear();

const defaultFilterState: FilterState = {
  selectedGenres: [],
  yearRange: [1900, currentYear],
  minRating: 0
};

/**
 * Create the filter store for managing movie filters
 */
function createFilterStore() {
  const { subscribe, set, update } = writable<FilterState>(defaultFilterState);

  return {
    subscribe,

    /**
     * Set selected genres
     */
    setGenres: (genres: string[]) => {
      update((state) => ({
        ...state,
        selectedGenres: genres
      }));
    },

    /**
     * Toggle a genre filter
     */
    toggleGenre: (genre: string) => {
      update((state) => {
        const selectedGenres = state.selectedGenres.includes(genre)
          ? state.selectedGenres.filter((g) => g !== genre)
          : [...state.selectedGenres, genre];

        return {
          ...state,
          selectedGenres
        };
      });
    },

    /**
     * Set year range filter
     */
    setYearRange: (yearRange: [number, number]) => {
      update((state) => ({
        ...state,
        yearRange
      }));
    },

    /**
     * Set minimum rating filter
     */
    setMinRating: (minRating: number) => {
      update((state) => ({
        ...state,
        minRating
      }));
    },

    /**
     * Reset all filters to default values
     */
    reset: () => {
      set({
        selectedGenres: [],
        yearRange: [1900, currentYear],
        minRating: 0
      });
    }
  };
}

export const filterStore = createFilterStore();
