<script lang="ts">
  import type { Movie } from '$lib/types/movie';
  import MovieCard from './MovieCard.svelte';
  import Spinner from './ui/Spinner.svelte';
  import { watchlistStore } from '$lib/stores';

  interface Props {
    movies: Movie[];
    loading?: boolean;
  }

  let { movies = [], loading = false }: Props = $props();

  const watchlist = $derived($watchlistStore);
</script>

{#if loading}
  <div class="flex justify-center items-center min-h-[400px]">
    <div class="text-center">
      <Spinner size="lg" />
      <p class="mt-4 text-gray-600">Loading movies...</p>
    </div>
  </div>
{:else if movies.length === 0}
  <div class="flex justify-center items-center min-h-[400px]">
    <div class="text-center">
      <svg
        class="w-16 h-16 mx-auto text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
        />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No movies found</h3>
      <p class="mt-2 text-gray-600">Try adjusting your search or filters</p>
    </div>
  </div>
{:else}
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
  >
    {#each movies as movie (movie.id)}
      <MovieCard {movie} inWatchlist={watchlist.movieIds.has(movie.id)} />
    {/each}
  </div>
{/if}
