<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore, watchlistStore } from '$lib/stores';
  import MovieGrid from '$lib/components/MovieGrid.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import type { Movie } from '$lib/types/movie';

  const auth = $derived($authStore);
  const watchlist = $derived($watchlistStore);

  let movies = $state<Movie[]>([]);

  // Convert watchlist items to Movie objects for the MovieGrid
  $effect(() => {
    movies = watchlist.items.map((item) => ({
      id: item.movieId,
      title: item.movieTitle,
      posterUrl: item.posterPath,
      backdropUrl: item.posterPath,
      overview: '',
      rating: 0,
      releaseYear: 0,
      genres: []
    }));
  });

  function handleGoHome() {
    goto('/');
  }

  function handleGoToLogin() {
    goto('/login');
  }

  onMount(async () => {
    // Check if user is authenticated
    if (!auth.isAuthenticated || !auth.user) {
      // Redirect to login page
      goto('/login');
      return;
    }

    // Load user's watchlist
    await watchlistStore.load(auth.user.id);
  });
</script>

<svelte:head>
  <title>My Watchlist - Movie App</title>
</svelte:head>

<div class="min-h-screen bg-gray-950">
  <div class="container mx-auto px-4 py-8">
    {#if !auth.isAuthenticated}
      <!-- Not authenticated - Show message (while redirecting) -->
      <div class="flex flex-col justify-center items-center min-h-[70vh]">
        <div class="text-center max-w-md">
          <svg
            class="w-20 h-20 mx-auto text-blue-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 class="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p class="text-gray-400 mb-6">Please login to view your watchlist</p>
          <Button onclick={handleGoToLogin}>Go to Login</Button>
        </div>
      </div>
    {:else}
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold text-white mb-2">My Watchlist</h1>
            <p class="text-gray-400">
              {watchlist.items.length}
              {watchlist.items.length === 1 ? 'movie' : 'movies'} saved
            </p>
          </div>
          <Button variant="outline" onclick={handleGoHome}>
            <span class="flex items-center gap-2">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Browse Movies
            </span>
          </Button>
        </div>
      </div>

      <!-- Watchlist Content -->
      {#if watchlist.loading}
        <MovieGrid movies={[]} loading={true} />
      {:else if movies.length === 0}
        <div class="flex flex-col justify-center items-center min-h-[50vh]">
          <div class="text-center max-w-md">
            <svg
              class="w-20 h-20 mx-auto text-gray-600 mb-4"
              fill="none"
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
            <h3 class="text-2xl font-bold text-white mb-2">Your watchlist is empty</h3>
            <p class="text-gray-400 mb-6">
              Start adding movies to keep track of what you want to watch
            </p>
            <Button onclick={handleGoHome}>Discover Movies</Button>
          </div>
        </div>
      {:else}
        <MovieGrid {movies} loading={false} />
      {/if}
    {/if}
  </div>
</div>
