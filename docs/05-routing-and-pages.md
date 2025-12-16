# Routing & Pages Structure

## Route Hierarchy

```
/                      → Home (movie listing)
/login                 → Login page
/signup                → Signup page
/movie/[id]            → Movie details
/watchlist             → User's watchlist (protected)
```

## Page Specifications

### 1. Home Page (`/routes/+page.svelte`)

**Purpose**: Movie discovery homepage

**Layout:**
- Header with logo, search bar, navigation links
- Filter panel (sidebar or top bar)
- Movie grid (responsive: 2-3-4 columns)
- Pagination or "Load More" button

**Data Loading:**
```typescript
// +page.ts or +page.server.ts
export async function load() {
  // Fetch popular movies from TMDb
  const movies = await fetchPopularMovies();
  const genres = await fetchGenres();
  return { movies, genres };
}
```

**Features:**
- Real-time search (debounced)
- Client-side filtering by genre/year/rating
- Lazy load movie posters
- Loading skeleton UI

---

### 2. Login Page (`/routes/login/+page.svelte`)

**Purpose**: User authentication

**Form Fields:**
- Email (type="email", required)
- Password (type="password", required)
- Submit button
- Link to signup page

**Validation:**
- Client-side: email format, password length
- Server-side: check Supabase for matching email + password hash

**Flow:**
1. User submits form
2. Hash password and query Supabase
3. If match: create session, redirect to home
4. If fail: show error message

**Error States:**
- "Invalid email or password"
- "Please fill all fields"

---

### 3. Signup Page (`/routes/signup/+page.svelte`)

**Purpose**: New user registration

**Form Fields:**
- Name (text, required)
- Email (email, required, unique)
- Password (password, required, min 8 chars)
- Confirm Password (password, must match)
- Favourite Movie Genre (select dropdown, optional)

**Validation:**
- Email uniqueness check (query Supabase)
- Password strength (min 8 chars, optional: 1 number, 1 special char)
- Passwords match

**Flow:**
1. User submits form
2. Validate inputs
3. Hash password (bcrypt or Web Crypto API)
4. Insert into Supabase `users` table
5. Auto-login and redirect to home

**Error States:**
- "Email already exists"
- "Passwords do not match"
- "Password too weak"

---

### 4. Movie Details Page (`/routes/movie/[id]/+page.svelte`)

**Purpose**: Full movie information

**Data Loading:**
```typescript
export async function load({ params }) {
  const movieId = params.id;
  const movie = await fetchMovieDetails(movieId);
  const credits = await fetchMovieCredits(movieId);
  return { movie, credits };
}
```

**Layout:**
- Backdrop image (hero section)
- Poster thumbnail
- Title, year, runtime, rating
- Plot/overview
- Genres (badges)
- Cast list (horizontal scroll or grid)
- "Add to Watchlist" / "Remove from Watchlist" button

**Interactions:**
- Watchlist toggle (requires auth, show login prompt if not logged in)
- Back navigation

---

### 5. Watchlist Page (`/routes/watchlist/+page.svelte`)

**Purpose**: User's saved movies

**Protection:**
- Check `authStore.isAuthenticated`
- If false, redirect to `/login`

**Data Loading:**
```typescript
export async function load() {
  const userId = authStore.user?.id;
  if (!userId) return { watchlist: [] };

  const watchlist = await fetchWatchlist(userId);
  return { watchlist };
}
```

**Layout:**
- Grid of watchlisted movies (similar to home page)
- Remove button on each card
- Empty state: "Your watchlist is empty"

**Features:**
- Remove from watchlist (update Supabase + store)
- Click to view movie details

---

## Shared Layout (`/routes/+layout.svelte`)

**Purpose**: App-wide wrapper

**Components:**
- Header/Navigation
  - Logo
  - Search bar
  - Links: Home, Watchlist, Login/Logout
  - User name display (if logged in)
- Footer (optional)

**Initialization:**
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  import { watchlistStore } from '$lib/stores/watchlist';

  onMount(() => {
    authStore.init(); // Load session from localStorage
    if (authStore.user) {
      watchlistStore.load(authStore.user.id);
    }
  });
</script>

<Header />
<main>
  <slot />
</main>
```

---

## Route Guards

### Client-Side Protection
```typescript
// In watchlist +page.svelte
import { goto } from '$app/navigation';
import { authStore } from '$lib/stores/auth';

$effect(() => {
  if (!$authStore.isAuthenticated) {
    goto('/login');
  }
});
```

### Server-Side Protection (Optional Enhancement)
```typescript
// +page.server.ts for watchlist
export async function load({ cookies }) {
  const session = cookies.get('session');
  if (!session) {
    throw redirect(302, '/login');
  }
  // ...
}
```

---

## Navigation Flow

```
User lands on / (home)
  ↓
Clicks "Sign Up" → /signup
  ↓
Creates account → Auto-login → Redirect to /
  ↓
Searches for movie → Results on /
  ↓
Clicks movie card → /movie/123
  ↓
Clicks "Add to Watchlist" → Updates Supabase + store
  ↓
Navigates to Watchlist → /watchlist
  ↓
Views saved movies
```
