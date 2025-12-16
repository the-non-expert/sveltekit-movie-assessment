# SvelteKit Project with TypeScript & Tailwind CSS v4

A production-ready SvelteKit application scaffolded with Svelte 5, TypeScript (strict mode), and Tailwind CSS v4 using the Vite plugin.

## Technology Stack

- **SvelteKit**: 2.15.5
- **Svelte**: 5.21.0
- **TypeScript**: 5.7.2 (strict mode enabled)
- **Tailwind CSS**: 4.0.0 (with Vite plugin)
- **Vite**: 6.0.7
- **Supabase JS**: 2.47.10
- **bcryptjs**: 2.4.3

## Project Structure

```
/Users/ayushj/Desktop/Coding_Assessment_EC/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── ui/          # Reusable UI components
│   │   ├── stores/          # Svelte stores for state management
│   │   ├── services/        # API services and business logic
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions and helpers
│   │   └── index.ts         # Library exports
│   ├── routes/
│   │   ├── +layout.svelte   # Root layout with CSS import
│   │   └── +page.svelte     # Homepage with demo content
│   ├── app.css              # Tailwind directives and custom theme
│   └── app.d.ts             # TypeScript ambient declarations
├── static/                  # Static assets
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment variables template
├── svelte.config.js         # SvelteKit configuration
├── vite.config.ts           # Vite configuration with Tailwind plugin
├── tsconfig.json            # TypeScript configuration (strict mode)
└── package.json             # Project dependencies
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your actual values:

```bash
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Tailwind CSS v4 Configuration

This project uses Tailwind CSS v4 with the Vite plugin for optimal performance. The configuration includes:

### Google Fonts
- **Bebas Neue**: Headings and display text
- **Outfit**: Body text (weights: 100, 200, 300, 400, 600, 800, 900)

### Custom Theme (Dark Cinema)
Custom CSS variables defined in `/Users/ayushj/Desktop/Coding_Assessment_EC/src/app.css`:

```css
--color-primary: #e50914         /* Netflix red */
--color-secondary: #f5f5f1       /* Off-white */
--color-background: #141414      /* Dark background */
--color-surface: #1f1f1f         /* Card/surface background */
--color-text-primary: #ffffff    /* Primary text */
--color-text-secondary: #b3b3b3  /* Secondary text */
--color-accent: #ff0000          /* Accent red */
--color-hover: #c11119           /* Hover state */
--color-border: #2a2a2a          /* Border color */
```

### Font Families
```css
--font-family-bebas: 'Bebas Neue', sans-serif
--font-family-outfit: 'Outfit', sans-serif
```

Use them in your components:
```html
<h1 class="font-bebas text-4xl">Heading</h1>
<p class="font-outfit text-base">Body text</p>
```

## Development Commands

### Start Development Server
```bash
npm run dev
```
Opens at `http://localhost:5173` by default.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Type Checking
```bash
npm run check
```

### Type Checking (Watch Mode)
```bash
npm run check:watch
```

## Getting Started

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Add your API keys and credentials

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173` to see the demo page

## Next Steps

### Add a Supabase Client
Create `/Users/ayushj/Desktop/Coding_Assessment_EC/src/lib/services/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
```

### Create Type Definitions
Define your data models in `/Users/ayushj/Desktop/Coding_Assessment_EC/src/lib/types/`:

```typescript
// models.ts
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}
```

### Build UI Components
Create reusable components in `/Users/ayushj/Desktop/Coding_Assessment_EC/src/lib/components/ui/`:

```svelte
<!-- Button.svelte -->
<script lang="ts">
  export let variant: 'primary' | 'secondary' = 'primary';
</script>

<button
  class={variant === 'primary'
    ? 'bg-[var(--color-primary)] hover:bg-[var(--color-hover)]'
    : 'border-2 border-[var(--color-border)]'}
  class="px-6 py-3 rounded-md font-outfit transition-colors"
>
  <slot />
</button>
```

### Add State Management
Create stores in `/Users/ayushj/Desktop/Coding_Assessment_EC/src/lib/stores/`:

```typescript
// user.svelte.ts
import { writable } from 'svelte/store';
import type { User } from '$lib/types';

export const user = writable<User | null>(null);
```

## TypeScript Configuration

This project uses strict TypeScript with the following settings:
- `strict: true` - Maximum type safety
- `esModuleInterop: true` - Better module compatibility
- `forceConsistentCasingInFileNames: true` - File naming consistency
- `skipLibCheck: true` - Faster builds
- `moduleResolution: bundler` - Optimized for bundlers

## Tailwind CSS v4 Features

Tailwind v4 introduces several improvements:
- **Vite Plugin**: Native integration with Vite for faster builds
- **CSS-first Configuration**: Theme customization via CSS variables
- **Better Performance**: Optimized for modern build tools
- **Enhanced DX**: Improved developer experience

## Notes

- The project uses Svelte 5's new syntax and features
- All paths use absolute file paths as specified
- Environment variables are prefixed with `VITE_` for client-side access
- The demo page showcases the custom theme and fonts

## Learn More

- [SvelteKit Documentation](https://kit.svelte.dev)
- [Svelte 5 Documentation](https://svelte.dev)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
- [Supabase Documentation](https://supabase.com/docs)

## License

This project is open source and available under the MIT License.
