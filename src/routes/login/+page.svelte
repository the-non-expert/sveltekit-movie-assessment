<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';
  import { verifyLogin } from '$lib/services/supabase';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import SEO from '$lib/components/SEO.svelte';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

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
    if (!email || !password) {
      error = 'Please fill in all fields';
      return;
    }

    if (!email.includes('@')) {
      error = 'Please enter a valid email address';
      return;
    }

    loading = true;

    try {
      const user = await verifyLogin({ email, password });

      if (!user) {
        error = 'Invalid email or password';
        loading = false;
        return;
      }

      // Login successful
      authStore.login(user);

      // Redirect to home page
      goto('/');
    } catch (err) {
      console.error('Login error:', err);
      error = 'An error occurred during login. Please try again.';
      loading = false;
    }
  }

  function handleSignupClick() {
    goto('/signup');
  }
</script>

<SEO
  title="Login - FilmShelf"
  description="Login to your FilmShelf account to access your personal watchlist and movie recommendations."
  url="https://filmshelf-ayush.netlify.app/login"
  keywords="login, sign in, movie account, user login"
/>

<div class="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
  <div class="w-full max-w-md mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-white mb-2">Welcome Back</h1>
      <p class="text-gray-400">Login to access your watchlist</p>
    </div>

    <!-- Login Form -->
    <div class="bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-8">
      <form onsubmit={handleSubmit} class="space-y-6">
        <!-- Email Input -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
            Email Address
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
            Password
          </label>
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            bind:value={password}
            required={true}
          />
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
              Logging in...
            </span>
          {:else}
            Login
          {/if}
        </Button>
      </form>

      <!-- Signup Link -->
      <div class="mt-6 text-center">
        <p class="text-gray-400">
          Don't have an account?
          <button
            type="button"
            onclick={handleSignupClick}
            class="text-blue-500 hover:text-blue-400 font-medium transition-colors ml-1"
          >
            Sign up
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
