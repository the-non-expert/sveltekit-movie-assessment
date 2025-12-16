# Requirements Breakdown

## Functional Requirements

### 1. Movie Listing
- Display grid/list/carousel of movies from TMDb API
- Show: poster, title, rating, year
- Pagination or infinite scroll
- Loading states

### 2. Search Functionality
- Real-time search input
- Query TMDb search endpoint
- Display search results
- Clear search functionality

### 3. Movie Details Page
- Full movie information (plot, cast, runtime, release date, genres)
- High-quality poster/backdrop
- Watchlist add/remove button
- Already Watched Button
- Back navigation

### 4. Watchlist Management
- Add movies to watchlist (stored in Supabase)
- Remove from watchlist
- View all watchlisted movies
- Persist across sessions per user

### 5. User Authentication
**Signup:**
- Fields: name, email, password, favourite movie genre
- Email validation
- Password strength requirements (min 8 chars, at least one capital alphabet)
- Store in Supabase `users` table
- Perfect and subtle validation system dislpaying errors in light red subtly.

**Login:**
- Email + password validation
- Check against Supabase
- Create session (24-hour expiry)
- Store session in localStorage + Svelte store

**Session Management:**
- Auto logout after 24 hours
- Persist across page refresh
- Protected routes (watchlist requires auth)

### 6. Filtering
**Client-side filters:**
- Genre (multi-select)
- Year (range or dropdown)
- Rating (min threshold slider)
- Combine multiple filters
- Reset filters

## Technical Requirements

### Svelte Concepts Usage
- **Stores**: User session, watchlist state, already watched, filter state
- **Binding**: Form inputs, filter controls
- **Async/Await**: TMDb API calls, Supabase queries
- **Slots**: Reusable layout components, modal dialogs

### Code Quality
- TypeScript strict mode
- Component modularity
- Consistent naming conventions
- Error handling for API failures
- Loading/empty states

### Documentation
- README with setup instructions
- Code comments for complex logic
- API integration guide
- Supabase schema documentation
