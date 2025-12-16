<script lang="ts">
  import type { Movie } from '$lib/types/movie';
  import { authStore, watchlistStore } from '$lib/stores';
  import { goto } from '$app/navigation';

  interface Props {
    movie: Movie;
    inWatchlist?: boolean;
  }

  let { movie, inWatchlist = false }: Props = $props();

  const auth = $derived($authStore);
  let isInWatchlist = $state(false);
  let isTogglingWatchlist = $state(false);

  $effect(() => {
    isInWatchlist = inWatchlist;
  });

  async function toggleWatchlist(event: MouseEvent) {
    event.stopPropagation();

    if (!auth.isAuthenticated || !auth.user) {
      goto('/login');
      return;
    }

    isTogglingWatchlist = true;

    try {
      if (isInWatchlist) {
        const success = await watchlistStore.remove(movie.id, auth.user.id);
        if (success) {
          isInWatchlist = false;
        }
      } else {
        const success = await watchlistStore.add(movie, auth.user.id);
        if (success) {
          isInWatchlist = true;
        }
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      isTogglingWatchlist = false;
    }
  }

  function navigateToDetails() {
    goto(`/movie/${movie.id}`);
  }

  function renderStars(rating: number) {
    const stars = Math.round(rating / 2);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  }
</script>

<div
  class="group relative bg-gray-900 rounded-lg shadow-xl border border-gray-800 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500/50"
  onclick={navigateToDetails}
  role="button"
  tabindex="0"
  onkeydown={(e) => e.key === 'Enter' && navigateToDetails()}
>
  <div class="relative aspect-[2/3] overflow-hidden bg-gray-800">
    <img
      src={movie.posterUrl}
      alt={movie.title}
      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      loading="lazy"
    />
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    ></div>
  </div>

  <div class="p-4">
    <h3 class="font-semibold text-lg text-white truncate" title={movie.title}>
      {movie.title}
    </h3>
    <div class="flex items-center justify-between mt-2">
      <span class="text-sm text-gray-400">{movie.releaseYear}</span>
      <div class="flex items-center gap-1">
        <span class="text-yellow-500 text-sm" aria-label="Rating">
          {renderStars(movie.rating)}
        </span>
        <span class="text-sm text-gray-300 font-medium">{movie.rating.toFixed(1)}</span>
      </div>
    </div>
  </div>

  <button
    onclick={toggleWatchlist}
    disabled={isTogglingWatchlist}
    class="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
  >
    {#if isTogglingWatchlist}
      <svg class="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    {:else}
      <svg
        class="w-5 h-5 {isInWatchlist ? 'text-red-500 fill-current' : 'text-gray-600'}"
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
    {/if}
  </button>
</div>
