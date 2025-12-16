<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';
  import { createUser } from '$lib/services/supabase';
  import { fetchGenres } from '$lib/services/imdb';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import type { Genre } from '$lib/types/movie';

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let favouriteGenre = $state('');
  let error = $state('');
  let loading = $state(false);
  let genres = $state<Genre[]>([]);

  const auth = $derived($authStore);

  // If already authenticated, redirect to home
  $effect(() => {
    if (auth.isAuthenticated && auth.user) {
      goto('/');
    }
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();
    error = '';

    // Validation
    if (!name || !email || !password) {
      error = 'Please fill in all required fields';
      return;
    }

    if (!email.includes('@')) {
      error = 'Please enter a valid email address';
      return;
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters long';
      return;
    }

    loading = true;

    try {
      const user = await createUser({
        name,
        email,
        password,
        favouriteGenre: favouriteGenre || undefined
      });

      // Signup successful - login the user
      authStore.login(user);

      // Redirect to home page
      goto('/');
    } catch (err) {
      console.error('Signup error:', err);
      if (err instanceof Error) {
        error = err.message.includes('duplicate')
          ? 'An account with this email already exists'
          : err.message;
      } else {
        error = 'An error occurred during signup. Please try again.';
      }
      loading = false;
    }
  }

  function handleLoginClick() {
    goto('/login');
  }

  onMount(async () => {
    // Load available genres
    try {
      genres = await fetchGenres();
    } catch (err) {
      console.error('Error loading genres:', err);
    }
  });
</script>

<svelte:head>
  <title>Sign Up - Movie App</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
  <div class="w-full max-w-md mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-white mb-2">Create Account</h1>
      <p class="text-gray-400">Join us to start building your watchlist</p>
    </div>

    <!-- Signup Form -->
    <div class="bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-8">
      <form onsubmit={handleSubmit} class="space-y-6">
        <!-- Name Input -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
            Full Name <span class="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="name"
            placeholder="John Doe"
            bind:value={name}
            required={true}
          />
        </div>

        <!-- Email Input -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
            Email Address <span class="text-red-500">*</span>
          </label>
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            bind:value={email}
            required={true}
          />
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            Password <span class="text-red-500">*</span>
          </label>
          <Input
            type="password"
            name="password"
            placeholder="At least 6 characters"
            bind:value={password}
            required={true}
          />
        </div>

        <!-- Favorite Genre Select -->
        <div>
          <label for="genre" class="block text-sm font-medium text-gray-300 mb-2">
            Favorite Genre <span class="text-gray-500 text-xs">(Optional)</span>
          </label>
          <select
            id="genre"
            bind:value={favouriteGenre}
            class="w-full px-4 py-2 rounded-lg border border-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
          >
            <option value="">Select a genre...</option>
            {#each genres as genre}
              <option value={genre.id}>{genre.name}</option>
            {/each}
          </select>
        </div>

        <!-- Error Message -->
        {#if error}
          <div class="bg-red-900/30 border border-red-500 rounded-lg p-3">
            <p class="text-red-400 text-sm">{error}</p>
          </div>
        {/if}

        <!-- Submit Button -->
        <Button type="submit" variant="primary" disabled={loading} class="w-full">
          {#if loading}
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating account...
            </span>
          {:else}
            Sign Up
          {/if}
        </Button>
      </form>

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-gray-400">
          Already have an account?
          <button
            type="button"
            onclick={handleLoginClick}
            class="text-blue-500 hover:text-blue-400 font-medium transition-colors ml-1"
          >
            Login
          </button>
        </p>
      </div>
    </div>

    <!-- Back to Home -->
    <div class="mt-6 text-center">
      <a href="/" class="text-gray-400 hover:text-gray-300 transition-colors text-sm">
        ← Back to Home
      </a>
    </div>
  </div>
</div>
