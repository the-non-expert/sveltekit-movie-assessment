<script lang="ts">
  import { onMount } from 'svelte';
  import { filterStore } from '$lib/stores';
  import { fetchGenres } from '$lib/services/imdb';
  import type { Genre } from '$lib/types/movie';

  const filters = $derived($filterStore);
  let genres = $state<Genre[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      genres = await fetchGenres();
    } catch (error) {
      console.error('Error loading genres:', error);
    } finally {
      loading = false;
    }
  });

  function toggleGenre(genreId: string) {
    filterStore.toggleGenre(genreId);
  }

  function isSelected(genreId: string): boolean {
    return filters.selectedGenres.includes(genreId);
  }
</script>

<div>
  <h3 class="text-sm font-semibold text-gray-700 mb-3">Genres</h3>
  {#if loading}
    <div class="flex items-center gap-2 text-gray-500">
      <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span class="text-sm">Loading genres...</span>
    </div>
  {:else}
    <div class="flex flex-wrap gap-2">
      {#each genres as genre (genre.id)}
        <button
          onclick={() => toggleGenre(genre.id)}
          class="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 {isSelected(
            genre.id
          )
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
          aria-pressed={isSelected(genre.id)}
        >
          {genre.name}
        </button>
      {/each}
    </div>
  {/if}
</div>
