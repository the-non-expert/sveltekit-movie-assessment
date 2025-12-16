# Architecture & Technical Design

## Application Architecture

### Folder Structure
```
src/
├── lib/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base UI (Button, Input, Card)
│   │   ├── MovieCard.svelte
│   │   ├── MovieGrid.svelte
│   │   ├── SearchBar.svelte
│   │   ├── FilterPanel.svelte
│   │   └── Header.svelte
│   ├── stores/          # Svelte stores
│   │   ├── auth.ts      # User session store
│   │   ├── watchlist.ts # Watchlist state
│   │   └── filters.ts   # Filter state
│   ├── services/        # API & DB services
│   │   ├── tmdb.ts      # TMDb API client
│   │   └── supabase.ts  # Supabase client
│   ├── types/           # TypeScript interfaces
│   │   ├── movie.ts
│   │   ├── user.ts
│   │   └── api.ts
│   └── utils/           # Helper functions
│       ├── auth.ts      # Password hashing, session validation
│       └── filters.ts   # Client-side filter logic
├── routes/
│   ├── +layout.svelte   # Root layout with header
│   ├── +page.svelte     # Home (movie listing)
│   ├── login/
│   │   └── +page.svelte
│   ├── signup/
│   │   └── +page.svelte
│   ├── movie/
│   │   └── [id]/
│   │       └── +page.svelte
│   └── watchlist/
│       └── +page.svelte
└── app.css              # Tailwind imports + global styles
```

## Tech Stack Details

### SvelteKit (Svelte 5)
- **Runes**: `$state`, `$derived`, `$effect` for reactivity
- **Page/Layout system**: File-based routing
- **Load functions**: Server-side data fetching where needed
- **Form actions**: Server actions for auth (optional enhancement)

### Tailwind CSS v4
- Dark theme via `dark:` variants or root CSS variables
- Custom color palette (dark grays, accent colors)
- Responsive design (mobile-first)

### TypeScript
- Strict mode enabled
- Interface definitions for all API responses
- Type-safe store implementations

### Supabase
- **Database only** (no Supabase Auth)
- PostgreSQL tables
- Direct SQL queries via Supabase JS client
- Row-level security disabled (custom auth)

## Data Flow

### Authentication Flow
1. User submits signup form
2. Hash password (bcrypt/scrypt via Web Crypto API or library)
3. Insert into Supabase `users` table
4. On login: verify email + hashed password
5. Create session object: `{ userId, email, expiresAt }`
6. Store in localStorage + Svelte store
7. On page load: validate session expiry, auto-logout if expired

### Movie Data Flow
1. Component calls TMDb service function
2. Service fetches from TMDb API (fetch with API key)
3. Transform response to typed interfaces
4. Return to component, update state
5. Render in UI with loading/error states

### Watchlist Flow
1. User clicks "Add to Watchlist"
2. Check if user authenticated (from auth store)
3. Insert into Supabase `watchlist` table (user_id, movie_id)
4. Update local watchlist store
5. Sync watchlist on app load from Supabase

## State Management Strategy

### Auth Store (`$lib/stores/auth.ts`)
```typescript
{
  user: { id, email, name, favouriteGenre } | null,
  isAuthenticated: boolean,
  expiresAt: number
}
```

### Watchlist Store (`$lib/stores/watchlist.ts`)
```typescript
{
  movieIds: Set<number>,
  loading: boolean
}
```

### Filter Store (`$lib/stores/filters.ts`)
```typescript
{
  genres: number[],
  yearRange: [number, number],
  minRating: number
}
```

## Security Considerations
- **Password hashing**: Never store plaintext (use bcrypt or Web Crypto API)
- **SQL injection**: Use parameterized queries (Supabase handles this)
- **XSS prevention**: Svelte auto-escapes (avoid `{@html}`)
- **Session hijacking**: Validate expiry on every protected route
