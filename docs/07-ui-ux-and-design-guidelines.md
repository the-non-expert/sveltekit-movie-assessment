# UI/UX & Design Guidelines

## Design Philosophy
**Cinema-grade dark theme** with bold typography and high contrast to evoke the movie-watching experience.

---

## Color Palette

### Dark Theme Base
```css
/* Background layers */
--bg-primary: #0a0a0a;      /* Pure dark base */
--bg-secondary: #141414;    /* Elevated surfaces (cards) */
--bg-tertiary: #1f1f1f;     /* Hover states, panels */

/* Text */
--text-primary: #ffffff;    /* Headings, high emphasis */
--text-secondary: #a1a1a1;  /* Body text, descriptions */
--text-tertiary: #6b6b6b;   /* Captions, metadata */

/* Accent (cinematic red/gold) */
--accent-primary: #dc2626;  /* CTAs, watchlist hearts */
--accent-hover: #b91c1c;    /* Hover state */
--accent-gold: #fbbf24;     /* Star ratings, premium elements */

/* Borders & dividers */
--border-subtle: #262626;
--border-emphasis: #404040;
```

### Semantic Colors
```css
--success: #10b981;
--error: #ef4444;
--warning: #f59e0b;
--info: #3b82f6;
```

---

## Typography

### Font Stack
**Primary Font (Headings, Titles):** [**Bebas Neue**](https://fonts.google.com/specimen/Bebas+Neue)
- Bold, condensed, movie poster aesthetic
- Use for: H1, H2, movie titles, section headers
- Weight: 400 (only available weight)

**Secondary Font (Body, UI):** [**Outfit**](https://fonts.google.com/specimen/Outfit)
- Variable font (100-900 weights)
- Geometric sans-serif, modern, highly readable
- Use for: Body text, buttons, form labels, metadata

### Type Scale (Extreme Contrast)
```css
/* Display */
--text-9xl: 8rem;    /* Hero titles (Bebas Neue 400) */
--text-6xl: 4rem;    /* Page titles (Bebas Neue 400) */
--text-4xl: 2.5rem;  /* Section headers (Bebas Neue 400) */

/* Body */
--text-lg: 1.125rem; /* Body large (Outfit 300) */
--text-base: 1rem;   /* Body text (Outfit 300) */
--text-sm: 0.875rem; /* Captions (Outfit 300) */
--text-xs: 0.75rem;  /* Metadata (Outfit 200) */
```

### Usage Examples
```css
/* Movie title on card */
h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Body text */
p {
  font-family: 'Outfit', sans-serif;
  font-weight: 300;
  line-height: 1.6;
}

/* Buttons */
button {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  letter-spacing: 0.025em;
}
```

### Font Loading (Tailwind CSS)
```css
/* app.css */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@100;200;300;400;600;800;900&display=swap');
```

---

## Component Designs

### Movie Card
**Layout:**
- Aspect ratio: 2:3 (poster ratio)
- Hover effect: Scale(1.05) + backdrop blur overlay
- Overlay: Title, year, rating star

**Specs:**
```
[Poster Image - lazy loaded]
  ↓ (on hover)
[Dark gradient overlay]
[Title - Bebas Neue, white]
[Year • Rating ⭐ - Outfit 300, gray]
[Watchlist Heart Icon - top-right corner]
```

**Tailwind Example:**
```html
<div class="group relative overflow-hidden rounded-lg transition-transform hover:scale-105">
  <img src={posterUrl} alt={title} class="aspect-[2/3] object-cover" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
    <div class="absolute bottom-4 left-4">
      <h3 class="font-bebas text-2xl uppercase tracking-wide">{title}</h3>
      <p class="font-outfit text-sm text-gray-400">{year} • ⭐ {rating}</p>
    </div>
  </div>
  <button class="absolute top-2 right-2">❤️</button>
</div>
```

### Header/Navigation
**Layout:**
- Fixed top, backdrop blur
- Logo (left), Search (center), Nav links (right)

**Specs:**
```
[Logo - Bebas Neue 2xl] | [SearchBar] | [Home • Watchlist • Login/Logout]
```

**Styling:**
- Background: `bg-black/80 backdrop-blur-md`
- Border bottom: `border-b border-gray-800`

### Search Bar
**Design:**
- Rounded pill shape
- Icon (magnifying glass) left
- Placeholder: "Search movies..."

**States:**
- Default: Gray border
- Focus: Accent border + ring
- Active search: Show "X" clear button

### Filter Panel
**Layout:**
- Sidebar (desktop) or collapsible top panel (mobile)
- Sections: Genre, Year, Rating
- Reset button at bottom

**Genre Filter:**
- Chips/badges for each genre
- Toggle select (active = accent color fill)

**Year Filter:**
- Dual-range slider or decade buttons

**Rating Filter:**
- Single slider (0-10)
- Display value above thumb

### Buttons
**Primary (CTA):**
```css
bg-red-600 hover:bg-red-700 text-white font-outfit font-semibold
px-6 py-3 rounded-lg transition-colors
```

**Secondary:**
```css
bg-gray-800 hover:bg-gray-700 text-white
```

**Outline:**
```css
border border-gray-700 hover:border-gray-500 text-gray-300
```

### Forms (Login/Signup)
**Layout:**
- Centered card (max-w-md)
- Title: Bebas Neue 4xl
- Input fields: Stacked, full-width
- Submit button: Full-width primary

**Input Styling:**
```css
bg-gray-900 border border-gray-700 focus:border-red-600 focus:ring-2 focus:ring-red-600/20
text-white placeholder-gray-500
px-4 py-3 rounded-lg
```

### Movie Details Page
**Hero Section:**
- Full-width backdrop image (darkened overlay)
- Poster thumbnail (left), metadata (right)
- Title: Bebas Neue 6xl
- Tagline, runtime, genres

**Cast Section:**
- Horizontal scroll
- Circular profile images
- Name below (Outfit 300)

---

## Layout & Spacing

### Grid System
**Movie Grid:**
- Desktop: 4 columns (gap-6)
- Tablet: 3 columns (gap-4)
- Mobile: 2 columns (gap-3)

**Padding:**
- Page container: `px-4 md:px-8 lg:px-16`
- Section spacing: `py-12 md:py-16`

### Responsive Breakpoints
```
sm: 640px   (mobile landscape)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
```

---

## Interactions & Animations

### Hover Effects
- Movie cards: Scale + opacity overlay
- Buttons: Background color shift
- Links: Underline slide-in

### Transitions
```css
transition-all duration-300 ease-out
```

### Loading States
- Skeleton cards: Animated gradient shimmer
- Spinners: Rotating accent color ring

---

## Accessibility

### Contrast
- All text meets WCAG AA standards (4.5:1 for normal, 3:1 for large)
- Focus rings: Visible, accent color

### Keyboard Navigation
- All interactive elements focusable
- Skip to main content link
- Modal traps focus

### Screen Readers
- Alt text for all images
- ARIA labels for icon buttons
- Semantic HTML (nav, main, section)

---

## Tailwind Config Customization

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif']
      },
      colors: {
        primary: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c'
        },
        gold: '#fbbf24',
        dark: {
          100: '#1f1f1f',
          200: '#141414',
          300: '#0a0a0a'
        }
      }
    }
  }
};
```

---

## Design Mockup References (Conceptual)

### Home Page
```
┌─────────────────────────────────────────────┐
│ [Logo]    [Search Bar]    [Home|Watchlist|⚙️] │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ 🎬  │ │ 🎬  │ │ 🎬  │ │ 🎬  │ [Filter] │
│  └─────┘ └─────┘ └─────┘ └─────┘  Panel   │
│                                             │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ 🎬  │ │ 🎬  │ │ 🎬  │ │ 🎬  │          │
│  └─────┘ └─────┘ └─────┘ └─────┘          │
└─────────────────────────────────────────────┘
```

### Movie Details
```
┌─────────────────────────────────────────────┐
│       [Backdrop Image with Dark Overlay]    │
│  ┌──────┐                                   │
│  │Poster│  MOVIE TITLE (Bebas Neue 6xl)     │
│  │      │  ⭐ 8.5 • 2h 30m • Action, Drama   │
│  └──────┘  [+ Watchlist]                    │
├─────────────────────────────────────────────┤
│  Plot: Lorem ipsum dolor sit amet...        │
│                                             │
│  Cast: [👤] [👤] [👤] [👤] →                │
└─────────────────────────────────────────────┘
```

---

## Visual Hierarchy

1. **High Emphasis**: Movie titles, CTAs, ratings (white, large, bold)
2. **Medium Emphasis**: Body text, form labels (light gray, regular)
3. **Low Emphasis**: Metadata, timestamps (dark gray, small)

**Color Usage:**
- Red accent: Sparingly for primary actions only
- Gold: Ratings, premium indicators
- White: Critical content
- Grays: Everything else
