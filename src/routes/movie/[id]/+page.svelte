<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import MovieDetails from '$lib/components/MovieDetails.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Spinner from '$lib/components/ui/Spinner.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { fetchMovieDetails, fetchMovieCredits } from '$lib/services/imdb';
  import type { Movie } from '$lib/types/movie';

  let movie = $state<Movie | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  const movieId = $derived($page.params.id);

  async function loadMovieData() {
    if (!movieId) {
      error = 'No movie ID provided';
      loading = false;
      return;
    }

    loading = true;
    error = null;

    try {
      // Fetch movie details and credits in parallel
      const [movieData, credits] = await Promise.all([
        fetchMovieDetails(movieId),
        fetchMovieCredits(movieId)
      ]);

      // Combine movie data with credits
      movie = {
        ...movieData,
        cast: credits
      };
    } catch (err) {
      console.error('Error loading movie:', err);
      error = err instanceof Error ? err.message : 'Failed to load movie details';
      movie = null;
    } finally {
      loading = false;
    }
  }

  function handleBack() {
    goto('/');
  }

  onMount(() => {
    loadMovieData();
  });

  // Reload movie if ID changes
  $effect(() => {
    if (movieId) {
      loadMovieData();
    }
  });
</script>

{#if movie}
  <SEO
    title="{movie.title} ({movie.releaseYear}) - FilmShelf"
    description="{movie.overview || `Watch ${movie.title} (${movie.releaseYear}). Rating: ${movie.rating}/10. ${movie.genres.join(', ')}.`}"
    image={movie.posterUrl}
    url="https://filmshelf-ayush.netlify.app/movie/{movieId}"
    type="article"
    keywords="{movie.title}, {movie.genres.join(', ')}, movie, film, {movie.releaseYear}"
  />
{:else}
  <SEO
    title="Loading Movie - FilmShelf"
    description="Discover and track your favorite movies with FilmShelf"
  />
{/if}

<div class="min-h-screen bg-gray-950">
  {#if loading}
    <div class="flex flex-col justify-center items-center min-h-[70vh]">
      <Spinner size="lg" />
      <p class="mt-4 text-gray-400 text-lg">Loading movie details...</p>
    </div>
  {:else if error}
    <div class="flex flex-col justify-center items-center min-h-[70vh] px-4">
      <div class="text-center max-w-md">
        <svg
          class="w-20 h-20 mx-auto text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 class="text-2xl font-bold text-white mb-2">Error Loading Movie</h2>
        <p class="text-gray-400 mb-6">{error}</p>
        <Button onclick={handleBack}>Back to Home</Button>
      </div>
    </div>
  {:else if movie}
    <div class="pb-12">
      <div class="container mx-auto px-4 py-6">
        <Button variant="outline" onclick={handleBack} class="mb-6">
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </span>
        </Button>
      </div>

      <MovieDetails {movie} />
    </div>
  {/if}
</div>
