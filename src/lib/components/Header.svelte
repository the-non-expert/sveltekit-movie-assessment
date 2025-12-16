<script lang="ts">
  import { authStore } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import SearchBar from './SearchBar.svelte';
  import Button from './ui/Button.svelte';

  const auth = $derived($authStore);
  let showMobileMenu = $state(false);
  let showUserMenu = $state(false);

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }

  function toggleUserMenu() {
    showUserMenu = !showUserMenu;
  }

  function handleLogout() {
    authStore.logout();
    showUserMenu = false;
    goto('/');
  }

  function handleSearch(query: string) {
    if (query.trim()) {
      goto(`/?search=${encodeURIComponent(query)}`);
    } else {
      goto('/');
    }
  }

  function navigateTo(path: string) {
    goto(path);
    showMobileMenu = false;
  }

  function isActivePath(path: string): boolean {
    return $page.url.pathname === path;
  }
</script>

<header class="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo/Brand -->
      <div class="flex items-center">
        <button
          onclick={() => navigateTo('/')}
          class="flex items-center gap-3 text-2xl font-bold text-white hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
          style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; letter-spacing: -0.02em;"
        >
          <svg
            class="w-8 h-8 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"
            />
          </svg>
          FilmShelf
        </button>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-6 flex-1 justify-center px-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center gap-4">
        <button
          onclick={() => navigateTo('/')}
          class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 {isActivePath(
            '/'
          )
            ? 'text-blue-400 bg-gray-800'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'}"
        >
          Home
        </button>

        {#if auth.isAuthenticated}
          <button
            onclick={() => navigateTo('/watchlist')}
            class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 {isActivePath(
              '/watchlist'
            )
              ? 'text-blue-400 bg-gray-800'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'}"
          >
            Watchlist
          </button>

          <!-- User Menu -->
          <div class="relative">
            <button
              onclick={toggleUserMenu}
              class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div
                class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold"
              >
                {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span class="font-medium text-gray-300">{auth.user?.name || 'User'}</span>
              <svg
                class="w-4 h-4 text-gray-400 transform transition-transform {showUserMenu
                  ? 'rotate-180'
                  : ''}"
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

            {#if showUserMenu}
              <div
                class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-1 border border-gray-700"
              >
                <button
                  onclick={handleLogout}
                  class="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <Button variant="outline" onclick={() => navigateTo('/login')}>Login</Button>
          <Button variant="primary" onclick={() => navigateTo('/signup')}>Sign Up</Button>
        {/if}
      </div>

      <!-- Mobile Menu Button -->
      <button
        onclick={toggleMobileMenu}
        class="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Toggle mobile menu"
        aria-expanded={showMobileMenu}
      >
        <svg
          class="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {#if showMobileMenu}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          {:else}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          {/if}
        </svg>
      </button>
    </div>

    <!-- Mobile Search Bar -->
    <div class="md:hidden pb-4">
      <SearchBar onSearch={handleSearch} />
    </div>

    <!-- Mobile Menu -->
    {#if showMobileMenu}
      <div class="md:hidden border-t border-gray-800 py-4 space-y-2">
        <button
          onclick={() => navigateTo('/')}
          class="block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors {isActivePath(
            '/'
          )
            ? 'text-blue-400 bg-gray-800'
            : 'text-gray-300 hover:bg-gray-800'}"
        >
          Home
        </button>

        {#if auth.isAuthenticated}
          <button
            onclick={() => navigateTo('/watchlist')}
            class="block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors {isActivePath(
              '/watchlist'
            )
              ? 'text-blue-400 bg-gray-800'
              : 'text-gray-300 hover:bg-gray-800'}"
          >
            Watchlist
          </button>

          <div class="border-t border-gray-800 pt-2 mt-2">
            <div class="px-4 py-2 text-sm text-gray-400">
              Signed in as <span class="font-semibold text-white">{auth.user?.name}</span>
            </div>
            <button
              onclick={handleLogout}
              class="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        {:else}
          <div class="border-t border-gray-800 pt-2 mt-2 space-y-2">
            <Button
              variant="outline"
              onclick={() => navigateTo('/login')}
              class="w-full justify-center">Login</Button
            >
            <Button
              variant="primary"
              onclick={() => navigateTo('/signup')}
              class="w-full justify-center">Sign Up</Button
            >
          </div>
        {/if}
      </div>
    {/if}
  </nav>
</header>
