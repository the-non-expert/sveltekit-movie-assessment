<script lang="ts">
  interface Props {
    onSearch: (query: string) => void;
    placeholder?: string;
  }

  let { onSearch, placeholder = 'Search movies...' }: Props = $props();

  let searchQuery = $state('');
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
  }

  function clearSearch() {
    searchQuery = '';
    onSearch('');
  }
</script>

<div class="relative w-full max-w-2xl">
  <div class="relative">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg
        class="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <input
      type="text"
      value={searchQuery}
      oninput={handleInput}
      {placeholder}
      class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      aria-label="Search movies"
    />
    {#if searchQuery}
      <button
        onclick={clearSearch}
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Clear search"
      >
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    {/if}
  </div>
</div>
