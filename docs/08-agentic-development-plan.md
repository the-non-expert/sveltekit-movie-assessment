# Agentic Development Plan

## Development Strategy
**Divide and conquer**: Break project into independent modules that can be developed in parallel by different agents or coding sessions.

---

## Phase 1: Foundation & Setup

### Task 1.1: Project Scaffolding
**Agent**: Setup Agent
**Estimated Complexity**: Low

**Deliverables:**
- Initialize SvelteKit project with TypeScript
- Install dependencies: Tailwind v4, Supabase JS client, bcryptjs
- Configure Tailwind (fonts, theme colors)
- Set up folder structure (`lib/`, `routes/`, `components/`, etc.)
- Create `.env` template for IMDB API key and Supabase credentials

**Dependencies:** None

**Completion Criteria:**
- `npm run dev` starts successfully
- Tailwind styles apply
- TypeScript compiles without errors

---

### Task 1.2: Supabase Database Setup
**Agent**: Database Agent
**Estimated Complexity**: Low

**Deliverables:**
- Create Supabase project
- Execute SQL for `users` table
- Execute SQL for `watchlist` table
- Document connection credentials
- Test connection from Node.js

**Dependencies:** None

**Completion Criteria:**
- Tables exist with correct schema
- Can insert/query test data
- Connection string works

---

### Task 1.3: IMDB API Research & Client
**Agent**: API Integration Agent
**Estimated Complexity**: Medium

**Deliverables:**
- Research IMDB API endpoints (RapidAPI IMDB API):
  - `/titles` (popular movies)
  - `/titles/search/{query}` (search)
  - `/titles/{id}` (movie details)
  - `/titles/{id}/credits` (cast/crew)
  - `/titles/utils/genres` (genres list)
- Create `$lib/services/imdb.ts` with typed functions:
  - `fetchPopularMovies(page: number)`
  - `searchMovies(query: string)`
  - `fetchMovieDetails(id: string)`
  - `fetchMovieCredits(id: string)`
  - `fetchGenres()`
- Handle errors and rate limits
- Transform API responses to app types

**Dependencies:** Task 1.1 (project setup)

**Completion Criteria:**
- All functions return correctly typed data
- Error handling implemented
- Test calls work (with API key)

---

## Phase 2: Core Infrastructure

### Task 2.1: TypeScript Types & Interfaces
**Agent**: Type Safety Agent
**Estimated Complexity**: Low

**Deliverables:**
- `$lib/types/movie.ts`: Movie, ImdbMovie, ImdbMovieDetails, Genre
- `$lib/types/user.ts`: User, UserSession, SignupData, LoginData
- `$lib/types/api.ts`: API response types
- `$lib/types/watchlist.ts`: WatchlistItem

**Dependencies:** Task 1.3 (API research)

**Completion Criteria:**
- All types exported
- No TypeScript errors
- Types match API responses

---

### Task 2.2: Svelte Stores
**Agent**: State Management Agent
**Estimated Complexity**: Medium

**Deliverables:**
- `$lib/stores/auth.ts`: Auth store with login/logout/checkSession
- `$lib/stores/watchlist.ts`: Watchlist store with add/remove/load
- `$lib/stores/filters.ts`: Filter store with reset function
- localStorage integration for session persistence

**Dependencies:** Task 2.1 (types)

**Completion Criteria:**
- Stores reactive and functional
- Session persists across refresh
- Auto-logout after 24 hours works

---

### Task 2.3: Supabase Service Layer
**Agent**: Database Agent
**Estimated Complexity**: Medium

**Deliverables:**
- `$lib/services/supabase.ts`: Supabase client initialization
- Auth functions: `createUser()`, `verifyLogin()`, `getUserById()`
- Watchlist functions: `addToWatchlist()`, `removeFromWatchlist()`, `fetchWatchlist()`
- Password hashing utilities (`hashPassword()`, `verifyPassword()`)

**Dependencies:** Task 1.2 (DB setup), Task 2.1 (types)

**Completion Criteria:**
- All CRUD operations work
- Passwords hashed securely
- Error handling implemented

---

## Phase 3: UI Components (Can Run in Parallel)

### Task 3.1: Base UI Components
**Agent**: UI Components Agent
**Estimated Complexity**: Medium

**Deliverables:**
- `$lib/components/ui/Button.svelte`: Primary, secondary, outline variants
- `$lib/components/ui/Input.svelte`: Text, email, password inputs
- `$lib/components/ui/Card.svelte`: Reusable card container
- `$lib/components/ui/Modal.svelte`: Modal dialog with slot
- `$lib/components/ui/Spinner.svelte`: Loading spinner

**Dependencies:** Task 1.1 (setup)

**Completion Criteria:**
- Components styled per design guidelines
- Props and slots work correctly
- Accessible (ARIA labels, keyboard nav)

---

### Task 3.2: Movie Components
**Agent**: Movie UI Agent
**Estimated Complexity**: Medium

**Deliverables:**
- `$lib/components/MovieCard.svelte`: Movie card with poster, title, rating, watchlist button
- `$lib/components/MovieGrid.svelte`: Responsive grid container
- `$lib/components/MovieDetails.svelte`: Full movie details layout
- `$lib/components/CastList.svelte`: Horizontal scrollable cast

**Dependencies:** Task 2.1 (types), Task 3.1 (base UI)

**Completion Criteria:**
- Components render with mock data
- Hover effects work
- Responsive design

---

### Task 3.3: Search & Filter Components
**Agent**: Search & Filter Agent
**Estimated Complexity**: Medium

**Deliverables:**
- `$lib/components/SearchBar.svelte`: Search input with debounce
- `$lib/components/FilterPanel.svelte`: Container for all filters
- `$lib/components/GenreFilter.svelte`: Multi-select genre chips
- `$lib/components/YearFilter.svelte`: Year range selector
- `$lib/components/RatingFilter.svelte`: Rating slider

**Dependencies:** Task 2.2 (stores), Task 3.1 (base UI)

**Completion Criteria:**
- Filters bind to store
- Filter logic applies correctly
- Reset button works

---

### Task 3.4: Layout & Navigation
**Agent**: Layout Agent
**Estimated Complexity**: Low

**Deliverables:**
- `$lib/components/Header.svelte`: Logo, search, nav links, user menu
- `$lib/components/Footer.svelte`: Optional footer
- `/routes/+layout.svelte`: Root layout with header, slot, session init

**Dependencies:** Task 2.2 (stores), Task 3.1 (base UI)

**Completion Criteria:**
- Header visible on all pages
- Navigation links work
- Session initializes on mount

---

## Phase 4: Pages & Routing (Can Run in Parallel)

### Task 4.1: Home Page
**Agent**: Home Page Agent
**Estimated Complexity**: Medium

**Deliverables:**
- `/routes/+page.svelte`: Movie grid, search, filter panel
- `/routes/+page.ts`: Load popular movies and genres
- Integration of MovieGrid, SearchBar, FilterPanel
- Pagination or "Load More" button

**Dependencies:** Task 1.3 (API), Task 2.2 (stores), Task 3.2 (movie UI), Task 3.3 (search/filter)

**Completion Criteria:**
- Movies display on load
- Search updates results
- Filters work correctly
- Loading states show

---

### Task 4.2: Movie Details Page
**Agent**: Details Page Agent
**Estimated Complexity**: Medium

**Deliverables:**
- `/routes/movie/[id]/+page.svelte`: Movie details layout
- `/routes/movie/[id]/+page.ts`: Load movie + credits
- Watchlist add/remove button
- Error handling for invalid IDs

**Dependencies:** Task 1.3 (API), Task 2.2 (stores), Task 3.2 (movie UI)

**Completion Criteria:**
- Movie details load correctly
- Cast displays
- Watchlist toggle works
- Back navigation works

---

### Task 4.3: Login & Signup Pages
**Agent**: Auth Pages Agent
**Estimated Complexity**: Medium

**Deliverables:**
- `/routes/login/+page.svelte`: Login form
- `/routes/signup/+page.svelte`: Signup form
- Form validation (client-side)
- Error messages for invalid inputs
- Redirect to home on success

**Dependencies:** Task 2.2 (stores), Task 2.3 (Supabase service), Task 3.1 (base UI)

**Completion Criteria:**
- Forms submit correctly
- Validation works
- Sessions created on login
- Redirects work

---

### Task 4.4: Watchlist Page
**Agent**: Watchlist Page Agent
**Estimated Complexity**: Medium

**Deliverables:**
- `/routes/watchlist/+page.svelte`: Watchlist grid
- `/routes/watchlist/+page.ts`: Load user's watchlist
- Route protection (redirect if not logged in)
- Remove from watchlist button
- Empty state message

**Dependencies:** Task 2.2 (stores), Task 2.3 (Supabase service), Task 3.2 (movie UI)

**Completion Criteria:**
- Watchlist displays user's movies
- Remove button works
- Protected route redirects
- Empty state shows

---

## Phase 5: Integration & Refinement

### Task 5.1: End-to-End Testing
**Agent**: QA Agent
**Estimated Complexity**: High

**Deliverables:**
- Test all user flows:
  - Signup → Login → Browse → Search → Filter → Add to Watchlist → View Details → Logout
- Test edge cases: Invalid login, expired session, API failures, missing images
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness testing

**Dependencies:** All Phase 4 tasks

**Completion Criteria:**
- All flows work without errors
- Edge cases handled gracefully
- Responsive on mobile

---

### Task 5.2: Documentation
**Agent**: Documentation Agent
**Estimated Complexity**: Medium

**Deliverables:**
- `README.md`: Setup instructions, features, tech stack
- Code comments for complex logic
- API integration guide (how to get IMDB API key)
- Supabase setup guide
- Environment variables documentation

**Dependencies:** All previous tasks

**Completion Criteria:**
- README comprehensive
- New developer can set up project
- Code is well-commented

---

### Task 5.3: Final Polish
**Agent**: Polish Agent
**Estimated Complexity**: Low

**Deliverables:**
- Fix any UI inconsistencies
- Optimize performance (lazy loading, memoization)
- Add loading skeletons
- Ensure all animations smooth
- Accessibility audit (keyboard nav, screen readers)

**Dependencies:** Task 5.1 (testing)

**Completion Criteria:**
- No visual bugs
- Smooth performance
- Accessible to all users

---

## Task Assignment Strategy

### Parallel Development Tracks

**Track A: Backend/Data**
- Task 1.2 (DB setup)
- Task 2.3 (Supabase service)
- Task 1.3 (IMDB API)

**Track B: State & Types**
- Task 2.1 (Types)
- Task 2.2 (Stores)

**Track C: UI Components**
- Task 3.1 (Base UI)
- Task 3.2 (Movie UI)
- Task 3.3 (Search/Filter)
- Task 3.4 (Layout)

**Track D: Pages**
(After Track A, B, C complete)
- Task 4.1, 4.2, 4.3, 4.4 (can run in parallel)

**Track E: Final**
(After Track D)
- Task 5.1, 5.2, 5.3 (sequential)

---

## Agent Skill Requirements

| Agent Type | Required Skills | Tasks |
|------------|----------------|-------|
| Setup Agent | SvelteKit, Tailwind, npm | 1.1 |
| Database Agent | SQL, Supabase | 1.2, 2.3 |
| API Integration Agent | REST APIs, TypeScript | 1.3 |
| Type Safety Agent | TypeScript | 2.1 |
| State Management Agent | Svelte stores, reactivity | 2.2 |
| UI Components Agent | Svelte, CSS, Tailwind | 3.1, 3.2, 3.3, 3.4 |
| Page Development Agent | SvelteKit routing, forms | 4.1, 4.2, 4.3, 4.4 |
| QA Agent | Testing, debugging | 5.1 |
| Documentation Agent | Writing, clarity | 5.2 |
| Polish Agent | UI/UX, performance | 5.3 |

---

## Success Metrics per Phase

**Phase 1:** Project runs, DB connected, API researched
**Phase 2:** Types defined, stores reactive, Supabase queries work
**Phase 3:** All UI components render correctly
**Phase 4:** All pages functional, routing works
**Phase 5:** Fully tested, documented, polished

---

## Estimated Timeline (Sequential)
- Phase 1: 2-3 hours
- Phase 2: 3-4 hours
- Phase 3: 4-5 hours
- Phase 4: 5-6 hours
- Phase 5: 2-3 hours

**Total: ~20 hours** (can be halved with parallel agent execution)
