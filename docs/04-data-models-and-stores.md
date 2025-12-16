# Data Models & Stores

## Supabase Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  favourite_movie_genre VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Watchlist Table
```sql
CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  movie_title VARCHAR(500),
  movie_poster_path VARCHAR(500),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

CREATE INDEX idx_watchlist_user ON watchlist(user_id);
```

**Design Notes:**
- `user_id` + `movie_id` unique constraint prevents duplicates
- Store `movie_title` and `poster_path` for offline display (denormalization)
- `movie_id` is TMDb's integer ID
- Cascade delete removes watchlist items if user deleted

## TypeScript Interfaces

### Movie Types
```typescript
// TMDb API response (simplified)
interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

interface TmdbMovieDetails extends TmdbMovie {
  runtime: number;
  genres: { id: number; name: string }[];
  credits?: {
    cast: { name: string; character: string; profile_path: string }[];
  };
}

interface TmdbGenre {
  id: number;
  name: string;
}

// App-level movie type
interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  releaseYear: number;
  genres: string[];
  runtime?: number;
  cast?: string[];
}
```

### User Types
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  favouriteGenre?: string;
}

interface UserSession {
  user: User;
  expiresAt: number; // Unix timestamp
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  favouriteGenre?: string;
}

interface LoginData {
  email: string;
  password: string;
}
```

### Watchlist Types
```typescript
interface WatchlistItem {
  id: string;
  userId: string;
  movieId: number;
  movieTitle: string;
  posterPath: string;
  addedAt: string;
}
```

## Svelte Stores Design

### Auth Store (`$lib/stores/auth.ts`)
```typescript
import { writable } from 'svelte/store';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  expiresAt: number | null;
}

// Exported store with methods
export const authStore = createAuthStore();

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    isAuthenticated: false,
    expiresAt: null
  });

  return {
    subscribe,
    login: (user: User, expiresAt: number) => { /* ... */ },
    logout: () => { /* ... */ },
    checkSession: () => { /* ... */ },
    init: () => { /* load from localStorage */ }
  };
}
```

### Watchlist Store (`$lib/stores/watchlist.ts`)
```typescript
interface WatchlistState {
  items: WatchlistItem[];
  movieIds: Set<number>; // For quick lookup
  loading: boolean;
}

export const watchlistStore = createWatchlistStore();

function createWatchlistStore() {
  const { subscribe, set, update } = writable<WatchlistState>({
    items: [],
    movieIds: new Set(),
    loading: false
  });

  return {
    subscribe,
    load: async (userId: string) => { /* fetch from Supabase */ },
    add: async (movie: Movie, userId: string) => { /* insert + update */ },
    remove: async (movieId: number, userId: string) => { /* delete + update */ },
    isInWatchlist: (movieId: number) => { /* check movieIds set */ }
  };
}
```

### Filter Store (`$lib/stores/filters.ts`)
```typescript
interface FilterState {
  selectedGenres: number[];
  yearRange: [number, number]; // e.g., [1980, 2024]
  minRating: number; // 0-10
}

export const filterStore = writable<FilterState>({
  selectedGenres: [],
  yearRange: [1900, new Date().getFullYear()],
  minRating: 0
});

export function resetFilters() {
  filterStore.set({
    selectedGenres: [],
    yearRange: [1900, new Date().getFullYear()],
    minRating: 0
  });
}
```

## Store Persistence

### localStorage Keys
```typescript
const STORAGE_KEYS = {
  SESSION: 'movie_app_session',
  THEME: 'movie_app_theme' // Future use
};
```

### Session Storage Format
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "favouriteGenre": "Action"
  },
  "expiresAt": 1735689600000
}
```

### Hydration Strategy
On app initialization (`+layout.svelte` or root component):
1. Read from localStorage
2. Validate expiry
3. If valid, populate auth store
4. Load user's watchlist from Supabase
5. If expired, clear localStorage and logout
