<script lang="ts">
  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-gray-900 text-gray-300 py-8 mt-auto">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <svg
          class="w-6 h-6 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"
          />
        </svg>
        <span class="font-semibold text-white">FilmShelf</span>
      </div>

      <div class="text-sm text-center">
        <p>&copy; {currentYear} FilmShelf. All rights reserved.</p>
      </div>

      <div class="text-sm">
        <p>Powered by <a href="https://imdbapi.dev" class="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">IMDB API</a></p>
      </div>
    </div>
  </div>
</footer>
