# Features Breakdown

## Feature 1: Movie Listing

### User Stories
- As a user, I want to see a grid of popular movies when I visit the homepage
- As a user, I want to see movie posters, titles, ratings, and release years

### Technical Implementation
**Components:**
- `MovieGrid.svelte` - Container for movie cards
- `MovieCard.svelte` - Individual movie card

**API Integration:**
- Endpoint: `GET /movie/popular`
- Response: Array of movies with poster_path, title, vote_average, release_date

**Data Flow:**
1. Page load → fetch popular movies
2. Transform API response to app types
3. Pass to MovieGrid component
4. Render cards with lazy-loaded images

**Edge Cases:**
- No poster image → placeholder image
- Long titles → truncate with ellipsis
- API failure → retry or show error state

---

## Feature 2: Search Functionality

### User Stories
- As a user, I want to search for movies by title
- As a user, I want to see search results update as I type

### Technical Implementation
**Components:**
- `SearchBar.svelte` - Input with search icon

**API Integration:**
- Endpoint: `GET /search/movie?query={term}`
- Debounce: 300ms delay

**Data Flow:**
1. User types in search input (binding)
2. Debounced function triggers API call
3. Update movie list with search results
4. Clear search → restore popular movies

**State Management:**
```typescript
let searchQuery = $state('');
let searchResults = $state<Movie[]>([]);

$effect(() => {
  if (searchQuery.length > 2) {
    debouncedSearch(searchQuery);
  } else {
    searchResults = [];
  }
});
```

**Edge Cases:**
- Query < 3 chars → don't search
- No results → "No movies found" message
- Empty query → reset to popular movies

---

## Feature 3: Movie Details

### User Stories
- As a user, I want to click a movie and see full details
- As a user, I want to see the cast, runtime, plot, and genres

### Technical Implementation
**Components:**
- `MovieDetails.svelte` - Details page layout
- `CastList.svelte` - Horizontal scrollable cast

**API Integration:**
- Endpoint: `GET /movie/{id}`
- Endpoint: `GET /movie/{id}/credits`

**Data Flow:**
1. User clicks movie card → navigate to `/movie/[id]`
2. Load function fetches movie + credits
3. Display backdrop, poster, metadata, plot
4. Show cast with profile pictures

**Svelte Concepts:**
- **Async/await**: Load functions
- **Slots**: Reusable hero section component

**Edge Cases:**
- Missing backdrop → use poster
- No cast data → hide cast section
- API error → "Movie not found" page

---

## Feature 4: Watchlist Management

### User Stories
- As a logged-in user, I want to add movies to my watchlist
- As a user, I want to view all my watchlisted movies
- As a user, I want to remove movies from my watchlist

### Technical Implementation
**Components:**
- `WatchlistButton.svelte` - Toggle button (in MovieCard, MovieDetails)
- `WatchlistGrid.svelte` - Watchlist page grid

**Supabase Operations:**
```typescript
// Add to watchlist
async function addToWatchlist(movie: Movie, userId: string) {
  await supabase.from('watchlist').insert({
    user_id: userId,
    movie_id: movie.id,
    movie_title: movie.title,
    movie_poster_path: movie.posterUrl
  });
}

// Remove from watchlist
async function removeFromWatchlist(movieId: number, userId: string) {
  await supabase.from('watchlist').delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);
}

// Fetch watchlist
async function fetchWatchlist(userId: string) {
  const { data } = await supabase.from('watchlist')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });
  return data;
}
```

**State Management:**
- Watchlist store holds Set of movie IDs for quick lookup
- On add/remove: update Supabase + local store

**Svelte Concepts:**
- **Binding**: Button state (in watchlist or not)
- **Stores**: Reactive watchlist state

**Edge Cases:**
- Not logged in → show "Login to add" tooltip
- Duplicate add → prevented by unique constraint
- Network error → retry mechanism

---

## Feature 5: User Login & Signup

### User Stories
- As a new user, I want to create an account with email and password
- As a returning user, I want to log in with my credentials
- As a logged-in user, I want to stay logged in across page refreshes

### Technical Implementation

#### Signup Flow
**Components:**
- `SignupForm.svelte`

**Validation:**
- Email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Password: min 8 chars
- Confirm password match

**Password Hashing:**
```typescript
import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}
```

**Supabase Insert:**
```typescript
const { data, error } = await supabase.from('users').insert({
  name,
  email,
  password_hash: await hashPassword(password),
  favourite_movie_genre: favouriteGenre
}).select().single();
```

#### Login Flow
**Components:**
- `LoginForm.svelte`

**Verification:**
```typescript
async function verifyLogin(email: string, password: string) {
  const { data: user } = await supabase.from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password_hash);
  return isValid ? user : null;
}
```

#### Session Management
**Create Session:**
```typescript
function createSession(user: User) {
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  const session = { user, expiresAt };

  localStorage.setItem('movie_app_session', JSON.stringify(session));
  authStore.login(user, expiresAt);
}
```

**Check Session Validity:**
```typescript
function checkSession() {
  const stored = localStorage.getItem('movie_app_session');
  if (!stored) return false;

  const session = JSON.parse(stored);
  if (Date.now() > session.expiresAt) {
    authStore.logout();
    localStorage.removeItem('movie_app_session');
    return false;
  }

  authStore.login(session.user, session.expiresAt);
  return true;
}
```

**Auto-Logout:**
```typescript
// In +layout.svelte
let logoutTimer: ReturnType<typeof setTimeout>;

$effect(() => {
  if ($authStore.expiresAt) {
    const timeUntilExpiry = $authStore.expiresAt - Date.now();
    logoutTimer = setTimeout(() => {
      authStore.logout();
    }, timeUntilExpiry);
  }

  return () => clearTimeout(logoutTimer);
});
```

**Svelte Concepts:**
- **Binding**: Form inputs two-way binding
- **Stores**: Auth state
- **Async/await**: Supabase queries

---

## Feature 6: Filter Movies

### User Stories
- As a user, I want to filter movies by genre
- As a user, I want to filter by release year
- As a user, I want to filter by minimum rating
- As a user, I want to combine multiple filters

### Technical Implementation

**Components:**
- `FilterPanel.svelte` - Contains all filter controls
- `GenreFilter.svelte` - Multi-select genre chips
- `YearFilter.svelte` - Range slider or dropdown
- `RatingFilter.svelte` - Slider (0-10)

**Filter Logic (Client-Side):**
```typescript
function applyFilters(movies: Movie[], filters: FilterState): Movie[] {
  return movies.filter(movie => {
    // Genre filter
    if (filters.selectedGenres.length > 0) {
      const hasGenre = filters.selectedGenres.some(genreId =>
        movie.genre_ids.includes(genreId)
      );
      if (!hasGenre) return false;
    }

    // Year filter
    const year = new Date(movie.release_date).getFullYear();
    if (year < filters.yearRange[0] || year > filters.yearRange[1]) {
      return false;
    }

    // Rating filter
    if (movie.vote_average < filters.minRating) {
      return false;
    }

    return true;
  });
}
```

**State Management:**
```typescript
import { derived } from 'svelte/store';
import { filterStore } from '$lib/stores/filters';

const filteredMovies = derived(
  [moviesStore, filterStore],
  ([$movies, $filters]) => applyFilters($movies, $filters)
);
```

**UI Components:**

**Genre Filter:**
- Fetch genres from TMDb: `GET /genre/movie/list`
- Display as chips/tags
- Multi-select (toggle on click)

**Year Filter:**
- Range slider: 1900 - current year
- Or dropdown: Decades (1980s, 1990s, 2000s, 2010s, 2020s)

**Rating Filter:**
- Slider: 0-10 (step 0.5)
- Display: "Rating: 7.0+"

**Reset Filters:**
- Button to clear all filters

**Svelte Concepts:**
- **Binding**: Two-way bind filter controls to store
- **Derived Stores**: Auto-update filtered movies

**Edge Cases:**
- No movies match filters → "No movies found" message
- Filters too restrictive → suggest resetting
- URL params (optional): Persist filters in query params

---

## Cross-Feature Integration

### Movie Card Component
- Used in: Home, Search Results, Watchlist
- Props: `movie`, `showWatchlistButton`
- Emits: Click → navigate to details
- Watchlist button: Show heart icon (filled if in watchlist)

### Header Component
- Slot for page-specific content
- Always visible: Logo, search, nav links
- Conditional: User name (if logged in), Logout button

### Loading States
- Skeleton cards while fetching
- Spinner for async operations
- Disable buttons during API calls

### Error Handling
- Toast notifications for errors
- Retry buttons for failed API calls
- Graceful degradation (missing images, etc.)
