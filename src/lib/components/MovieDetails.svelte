<script lang="ts">
  import type { Movie } from '$lib/types/movie';
  import { authStore, watchlistStore } from '$lib/stores';
  import CastList from './CastList.svelte';
  import Button from './ui/Button.svelte';

  interface Props {
    movie: Movie;
  }

  let { movie }: Props = $props();

  const auth = $derived($authStore);
  const watchlist = $derived($watchlistStore);

  let isInWatchlist = $derived(watchlist.movieIds.has(movie.id));
  let isTogglingWatchlist = $state(false);

  async function toggleWatchlist() {
    if (!auth.isAuthenticated || !auth.user) {
      alert('Please login to add movies to your watchlist');
      return;
    }

    isTogglingWatchlist = true;

    try {
      if (isInWatchlist) {
        await watchlistStore.remove(movie.id, auth.user.id);
      } else {
        await watchlistStore.add(movie, auth.user.id);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      isTogglingWatchlist = false;
    }
  }

  function renderStars(rating: number) {
    const stars = Math.round(rating / 2);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  }

  function formatRuntime(minutes?: number) {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }
</script>

<div class="relative">
  <!-- Backdrop Image -->
  {#if movie.backdropUrl}
    <div class="relative h-[50vh] md:h-[60vh] overflow-hidden">
      <img
        src={movie.backdropUrl}
        alt={movie.title}
        class="w-full h-full object-cover"
        loading="eager"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"
      ></div>
    </div>
  {/if}

  <!-- Content -->
  <div class="relative {movie.backdropUrl ? '-mt-32' : ''} px-4 md:px-8 lg:px-16">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Poster -->
        <div class="flex-shrink-0 w-full md:w-64">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            class="w-full rounded-lg shadow-2xl"
            loading="eager"
          />
        </div>

        <!-- Details -->
        <div class="flex-1 text-white">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

          <div class="flex flex-wrap items-center gap-4 mb-6">
            <div class="flex items-center gap-2">
              <span class="text-yellow-500 text-xl">{renderStars(movie.rating)}</span>
              <span class="text-lg font-semibold">{movie.rating.toFixed(1)}/10</span>
            </div>
            <span class="text-gray-300">{movie.releaseYear}</span>
            {#if movie.runtime}
              <span class="text-gray-300">{formatRuntime(movie.runtime)}</span>
            {/if}
          </div>

          {#if movie.genres && movie.genres.length > 0}
            <div class="flex flex-wrap gap-2 mb-6">
              {#each movie.genres as genre}
                <span class="px-3 py-1 bg-blue-600/80 rounded-full text-sm">{genre}</span>
              {/each}
            </div>
          {/if}

          <div class="mb-6">
            <Button
              variant={isInWatchlist ? 'secondary' : 'primary'}
              onclick={toggleWatchlist}
              disabled={isTogglingWatchlist}
            >
              {#if isTogglingWatchlist}
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              {:else}
                <span class="flex items-center gap-2">
                  <svg
                    class="w-5 h-5"
                    fill={isInWatchlist ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </span>
              {/if}
            </Button>
          </div>

          <div class="mb-8">
            <h2 class="text-2xl font-semibold mb-3">Overview</h2>
            <p class="text-gray-300 leading-relaxed">{movie.overview}</p>
          </div>

          {#if movie.cast && movie.cast.length > 0}
            <div>
              <h2 class="text-2xl font-semibold mb-4">Cast</h2>
              <CastList cast={movie.cast} />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
