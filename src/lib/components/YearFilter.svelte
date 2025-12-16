<script lang="ts">
  import { filterStore } from '$lib/stores';

  const filters = $derived($filterStore);
  const currentYear = new Date().getFullYear();

  let minYear = $state(1900);
  let maxYear = $state(currentYear);

  $effect(() => {
    minYear = filters.yearRange[0];
    maxYear = filters.yearRange[1];
  });

  function updateYearRange() {
    filterStore.setYearRange([minYear, maxYear]);
  }
</script>

<div>
  <h3 class="text-sm font-semibold text-gray-300 mb-3">Release Year</h3>
  <div class="space-y-4">
    <div class="flex items-center gap-4">
      <div class="flex-1">
        <label for="min-year" class="block text-xs text-gray-400 mb-1">From</label>
        <input
          id="min-year"
          type="number"
          bind:value={minYear}
          min="1900"
          max={maxYear}
          onchange={updateYearRange}
          class="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex-1">
        <label for="max-year" class="block text-xs text-gray-400 mb-1">To</label>
        <input
          id="max-year"
          type="number"
          bind:value={maxYear}
          min={minYear}
          max={currentYear}
          onchange={updateYearRange}
          class="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    <div class="text-xs text-gray-400 text-center">
      {minYear} - {maxYear}
    </div>
  </div>
</div>
