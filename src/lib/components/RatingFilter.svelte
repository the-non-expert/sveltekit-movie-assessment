<script lang="ts">
  import { filterStore } from '$lib/stores';

  const filters = $derived($filterStore);
  let minRating = $state(0);

  $effect(() => {
    minRating = filters.minRating;
  });

  function updateRating() {
    filterStore.setMinRating(minRating);
  }
</script>

<div>
  <h3 class="text-sm font-semibold text-gray-700 mb-3">Minimum Rating</h3>
  <div class="space-y-3">
    <div class="flex items-center gap-4">
      <input
        type="range"
        bind:value={minRating}
        min="0"
        max="10"
        step="0.5"
        onchange={updateRating}
        oninput={updateRating}
        class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        aria-label="Minimum rating slider"
      />
      <div
        class="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-semibold min-w-[60px] justify-center"
      >
        <span>{minRating.toFixed(1)}</span>
        <span class="text-yellow-400">★</span>
      </div>
    </div>
    <div class="flex justify-between text-xs text-gray-500">
      <span>0</span>
      <span>5</span>
      <span>10</span>
    </div>
  </div>
</div>

<style>
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: #2563eb;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .slider::-webkit-slider-thumb:hover {
    background: #1d4ed8;
  }

  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #2563eb;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .slider::-moz-range-thumb:hover {
    background: #1d4ed8;
  }
</style>
