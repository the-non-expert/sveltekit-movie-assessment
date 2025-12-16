<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import FilterPanel from '$lib/components/FilterPanel.svelte';
  import MovieGrid from '$lib/components/MovieGrid.svelte';
  import { filterStore } from '$lib/stores';
  import { fetchPopularMovies, searchMovies } from '$lib/services/imdb';
  import type { Movie } from '$lib/types/movie';

  const MOVIES_PER_PAGE = 30;

  let movies = $state<Movie[]>([]);
  let filteredMovies = $state<Movie[]>([]);
  let paginatedMovies = $state<Movie[]>([]);
  let loading = $state(true);
  let currentPage = $state(1);
  let totalPages = $state(1);

  const filters = $derived($filterStore);

  // Apply filters and pagination reactively
  $effect(() => {
    // First apply filters
    const filtered = applyFilters(movies, filters);
    filteredMovies = filtered;

    // Calculate total pages
    const pages = Math.ceil(filtered.length / MOVIES_PER_PAGE);
    totalPages = pages;

    // Ensure current page is valid
    if (currentPage > pages && pages > 0) {
      currentPage = 1;
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
    const endIndex = startIndex + MOVIES_PER_PAGE;
    paginatedMovies = filtered.slice(startIndex, endIndex);
  });

  function applyFilters(movieList: Movie[], currentFilters: typeof filters) {
    return movieList.filter((movie) => {
      // Genre filter
      if (
        currentFilters.selectedGenres.length > 0 &&
        !currentFilters.selectedGenres.some((genre) => movie.genres.includes(genre))
      ) {
        return false;
      }

      // Year filter
      if (
        movie.releaseYear < currentFilters.yearRange[0] ||
        movie.releaseYear > currentFilters.yearRange[1]
      ) {
        return false;
      }

      // Rating filter
      if (movie.rating < currentFilters.minRating) {
        return false;
      }

      return true;
    });
  }

  async function loadMovies(query?: string) {
    loading = true;
    currentPage = 1; // Reset to first page on new search
    try {
      if (query && query.length >= 2) {
        movies = await searchMovies(query);
      } else {
        movies = await fetchPopularMovies();
      }
    } catch (error) {
      console.error('Error loading movies:', error);
      movies = [];
    } finally {
      loading = false;
    }
  }

  function goToPage(pageNumber: number) {
    currentPage = pageNumber;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function nextPage() {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }

  function previousPage() {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }

  // Watch for URL search parameter changes
  $effect(() => {
    const searchQuery = $page.url.searchParams.get('search') || '';
    loadMovies(searchQuery);
  });

  onMount(() => {
    // Initial load handled by $effect above
  });
</script>

<div class="min-h-screen bg-gray-950">
  <div class="container mx-auto px-4 py-8">
    <!-- Main Content: Filter Panel + Movie Grid -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Filter Panel (Sidebar on desktop, top on mobile) -->
      <aside class="lg:w-64 flex-shrink-0">
        <FilterPanel />
      </aside>

      <!-- Movie Grid and Pagination -->
      <main class="flex-1">
        <MovieGrid movies={paginatedMovies} {loading} />

        <!-- Pagination Controls -->
        {#if !loading && filteredMovies.length > 0}
          <div class="mt-8 flex flex-col items-center gap-4">
            <!-- Page Info -->
            <div class="text-gray-400 text-sm">
              Showing {(currentPage - 1) * MOVIES_PER_PAGE + 1} - {Math.min(
                currentPage * MOVIES_PER_PAGE,
                filteredMovies.length
              )} of {filteredMovies.length} movies
            </div>

            <!-- Pagination Buttons -->
            <div class="flex items-center gap-2">
              <!-- Previous Button -->
              <button
                onclick={previousPage}
                disabled={currentPage === 1}
                class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <!-- Page Numbers -->
              <div class="flex gap-2">
                {#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum}
                  {#if totalPages <= 7 || pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)}
                    <button
                      onclick={() => goToPage(pageNum)}
                      class="px-4 py-2 rounded-lg transition-colors {currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-white hover:bg-gray-700'}"
                    >
                      {pageNum}
                    </button>
                  {:else if pageNum === currentPage - 2 || pageNum === currentPage + 2}
                    <span class="px-2 py-2 text-gray-500">...</span>
                  {/if}
                {/each}
              </div>

              <!-- Next Button -->
              <button
                onclick={nextPage}
                disabled={currentPage === totalPages}
                class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        {/if}
      </main>
    </div>
  </div>
</div>
