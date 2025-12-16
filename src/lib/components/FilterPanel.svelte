<script lang="ts">
  import { filterStore } from '$lib/stores';
  import GenreFilter from './GenreFilter.svelte';
  import YearFilter from './YearFilter.svelte';
  import RatingFilter from './RatingFilter.svelte';
  import Button from './ui/Button.svelte';

  let showFilters = $state(true);

  function toggleFilters() {
    showFilters = !showFilters;
  }

  function resetFilters() {
    filterStore.reset();
  }
</script>

<div class="bg-white rounded-lg shadow-md p-4 md:p-6">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
      Filters
    </h2>
    <div class="flex items-center gap-2">
      <Button variant="outline" onclick={resetFilters} class="text-sm">Reset</Button>
      <button
        onclick={toggleFilters}
        class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={showFilters ? 'Hide filters' : 'Show filters'}
        aria-expanded={showFilters}
      >
        <svg
          class="w-5 h-5 transform transition-transform {showFilters ? 'rotate-180' : ''}"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  </div>

  {#if showFilters}
    <div class="space-y-6">
      <GenreFilter />
      <div class="border-t border-gray-200 pt-6">
        <YearFilter />
      </div>
      <div class="border-t border-gray-200 pt-6">
        <RatingFilter />
      </div>
    </div>
  {/if}
</div>
