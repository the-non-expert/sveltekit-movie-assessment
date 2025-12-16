# Success Criteria & Checklist

## Assessment Criteria Alignment

### 1. Correctness ✅
**Criteria:** Project functions correctly and meets all requirements.

**Checklist:**
- [ ] Movie listing displays on homepage
- [ ] Search returns relevant results
- [ ] Movie details page shows full information
- [ ] Watchlist add/remove works correctly
- [ ] User signup creates account in Supabase
- [ ] User login validates credentials
- [ ] Session persists across page refresh
- [ ] Auto-logout after 24 hours
- [ ] Filters (genre, year, rating) apply correctly
- [ ] Multiple filters combine (AND logic)
- [ ] All API calls handle errors gracefully
- [ ] Protected routes redirect unauthorized users

---

### 2. Organization ✅
**Criteria:** Well-organized code structure and readability.

**Checklist:**
- [ ] Folder structure follows SvelteKit conventions
- [ ] Components are modular and reusable
- [ ] Services separated into `lib/services/`
- [ ] Types centralized in `lib/types/`
- [ ] Stores in `lib/stores/`
- [ ] Consistent naming conventions (camelCase, PascalCase)
- [ ] No code duplication
- [ ] Clear separation of concerns (UI vs logic vs data)
- [ ] TypeScript strict mode enabled
- [ ] ESLint/Prettier configured (optional but recommended)

---

### 3. Documentation ✅
**Criteria:** Thoroughly documented project, including code comments and README.

**Checklist:**
- [ ] `README.md` includes:
  - [ ] Project description
  - [ ] Tech stack list
  - [ ] Setup instructions (clone, install, env vars)
  - [ ] How to obtain TMDb API key
  - [ ] How to set up Supabase
  - [ ] How to run locally
  - [ ] Features list
- [ ] Code comments for:
  - [ ] Complex filter logic
  - [ ] Password hashing
  - [ ] Session validation
  - [ ] TMDb API transformations
- [ ] Supabase schema documented (SQL files or README section)
- [ ] Environment variables template (`.env.example`)

---

### 4. Creativity ✅
**Criteria:** Creative approaches appreciated (not required).

**Ideas to Showcase:**
- [ ] Unique dark theme color palette
- [ ] Smooth animations (card hover, page transitions)
- [ ] Easter eggs (e.g., Konami code for surprise)
- [ ] Advanced filters (rating range slider, decade buttons)
- [ ] Skeleton loading states (shimmer effect)
- [ ] Infinite scroll instead of pagination
- [ ] Movie backdrop parallax on details page
- [ ] Genre-based color coding
- [ ] "Trending" or "Top Rated" tabs

---

### 5. Use of Svelte Concepts ✅
**Criteria:** Utilize Store, Binding, Async/await, and slot correctly and efficiently.

#### **Stores**
- [ ] Auth store manages user session
- [ ] Watchlist store manages watchlist state
- [ ] Filter store manages filter state
- [ ] Stores use `$state` runes (Svelte 5)
- [ ] Derived stores used (e.g., `filteredMovies`)
- [ ] Store methods (login, logout, add, remove) implemented
- [ ] localStorage integration for persistence

#### **Binding**
- [ ] Form inputs use `bind:value`
- [ ] Filter controls bind to filter store
- [ ] Checkbox/toggle bindings for genre selection
- [ ] Two-way binding for search query

#### **Async/Await**
- [ ] TMDb API calls use async/await
- [ ] Supabase queries use async/await
- [ ] Loading states shown during async operations
- [ ] Error handling with try/catch
- [ ] `+page.ts` load functions use async

#### **Slots**
- [ ] Modal component uses `<slot />` for content
- [ ] Card component uses slot for custom content
- [ ] Layout component uses `<slot />` for pages
- [ ] Reusable button component with slot for icons

---

### 6. Use of TMDb API ✅
**Criteria:** Utilize the TMDb API correctly and efficiently.

**Checklist:**
- [ ] API key stored in environment variable
- [ ] Base URL configured (`https://api.themoviedb.org/3`)
- [ ] Image base URL used for posters (`https://image.tmdb.org/t/p/w500`)
- [ ] Endpoints used:
  - [ ] `/movie/popular`
  - [ ] `/search/movie`
  - [ ] `/movie/{id}`
  - [ ] `/movie/{id}/credits`
  - [ ] `/genre/movie/list`
- [ ] API responses typed (TypeScript interfaces)
- [ ] Error handling for failed requests
- [ ] Rate limiting considered (debounce search)
- [ ] Image URLs constructed correctly (poster_path → full URL)

---

### 7. Login and Signup ✅
**Criteria:** Implement login and signup correctly and efficiently.

#### **Signup**
- [ ] Form fields: name, email, password, confirm password, favourite genre
- [ ] Email validation (regex)
- [ ] Password strength check (min 8 chars)
- [ ] Confirm password matches
- [ ] Email uniqueness check (Supabase query)
- [ ] Password hashed before storage (bcrypt)
- [ ] User inserted into Supabase `users` table
- [ ] Auto-login after signup
- [ ] Error messages for validation failures

#### **Login**
- [ ] Form fields: email, password
- [ ] Credentials verified against Supabase
- [ ] Password hash comparison (bcrypt.compare)
- [ ] Session created on success
- [ ] Session stored in localStorage + auth store
- [ ] Redirect to home page
- [ ] Error message for invalid credentials

#### **Session Management**
- [ ] Session object: `{ user, expiresAt }`
- [ ] Expiry set to 24 hours from login
- [ ] Session validated on app load
- [ ] Auto-logout timer set
- [ ] localStorage cleared on logout
- [ ] Protected routes check `isAuthenticated`

---

### 8. Use of Filters ✅
**Criteria:** Implement filtering options accurately and efficiently.

**Checklist:**
- [ ] Genre filter: Multi-select, updates filter store
- [ ] Year filter: Range or dropdown, binds to store
- [ ] Rating filter: Slider (0-10), binds to store
- [ ] Filters apply client-side (no API calls)
- [ ] Filter logic combines all active filters (AND)
- [ ] Reset button clears all filters
- [ ] Filtered results update reactively
- [ ] Empty state when no matches
- [ ] Filter UI accessible (keyboard nav, labels)

---

## Feature Completion Checklist

### Core Features
- [ ] **Feature 1:** Movie listing displays popular movies
- [ ] **Feature 2:** Search bar filters movies by title
- [ ] **Feature 3:** Movie details page shows full info + cast
- [ ] **Feature 4:** Watchlist add/remove persists in Supabase
- [ ] **Feature 5:** Login and signup work with session persistence
- [ ] **Feature 6:** Filters (genre, year, rating) apply correctly

### User Flows
- [ ] New user can sign up → auto-login → browse movies
- [ ] User can search for a movie → view details
- [ ] User can add movie to watchlist → view watchlist page
- [ ] User can filter by genre + year + rating simultaneously
- [ ] User can log out → log back in → watchlist persists
- [ ] Session expires after 24 hours → auto-logout

---

## Technical Debt & Nice-to-Haves

### Must Fix Before Submission
- [ ] No console errors or warnings
- [ ] All TypeScript errors resolved
- [ ] No hardcoded API keys (use env vars)
- [ ] All images have alt text
- [ ] Mobile responsive (test on phone)

### Nice-to-Haves (Time Permitting)
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] CI/CD pipeline
- [ ] SEO meta tags
- [ ] Open Graph images
- [ ] PWA capabilities (offline mode)
- [ ] Watchlist export (CSV/JSON)
- [ ] Movie recommendations based on favourite genre
- [ ] "Watched" vs "To Watch" separation in watchlist

---

## Final Pre-Submission Checklist

### Code Quality
- [ ] Run `npm run build` → no errors
- [ ] Run `npm run check` → TypeScript valid
- [ ] Code formatted (Prettier)
- [ ] No unused imports or variables
- [ ] Comments added for complex logic

### Documentation
- [ ] README complete and accurate
- [ ] `.env.example` provided
- [ ] SQL schema documented
- [ ] Inline code comments where needed

### Testing
- [ ] Test all features in production build
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile (iOS/Android)
- [ ] Test edge cases (no results, API errors, expired session)

### Design
- [ ] Dark theme consistent across all pages
- [ ] Typography uses Bebas Neue + Outfit
- [ ] Responsive breakpoints work
- [ ] Hover states smooth
- [ ] Accessibility checked (keyboard nav, screen reader)

---

## Grading Rubric (Self-Assessment)

| Criteria | Weight | Self-Score (1-10) | Notes |
|----------|--------|-------------------|-------|
| Correctness | 30% | ___ | All features work? |
| Organization | 20% | ___ | Code clean and modular? |
| Documentation | 15% | ___ | README and comments? |
| Creativity | 10% | ___ | Unique touches? |
| Svelte Concepts | 10% | ___ | Stores, binding, async, slots? |
| TMDb API | 5% | ___ | API used correctly? |
| Login/Signup | 5% | ___ | Auth works? |
| Filters | 5% | ___ | Filters accurate? |

**Total:** ___/100

---

## Post-Submission

### Portfolio Presentation
- [ ] Deploy to Vercel/Netlify
- [ ] Create demo video (2-3 min walkthrough)
- [ ] Add to portfolio website
- [ ] Write blog post about technical challenges

### Follow-Up Improvements
- [ ] Refactor based on feedback
- [ ] Add advanced features (recommendations, reviews)
- [ ] Optimize performance (image CDN, caching)
- [ ] Add analytics (track popular searches)
