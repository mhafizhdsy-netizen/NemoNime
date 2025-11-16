# New Components Usage Guide

## Quick Reference for New UI Components

This guide shows you how to use the newly created and updated components in your NimeNemo application.

---

## 1. AnimeCard Component (NEW)

### Basic Usage

```jsx
import { AnimeCard } from '@/components/ui';

function MyComponent() {
  const anime = {
    id: 'anime-123',
    title: 'Attack on Titan',
    japanese_title: '進撃の巨人',
    poster: 'https://example.com/poster.jpg',
    description: 'Epic anime about...',
    tvInfo: {
      sub: 87,
      dub: 75,
      showType: 'TV',
      duration: '24m',
      rating: '18+'
    },
    releaseDate: '2013'
  };

  return <AnimeCard item={anime} path="watch" />;
}
```

### In a Grid Layout

```jsx
function AnimeGrid({ animes }) {
  return (
    <div className="grid grid-cols-6 max-[1400px]:grid-cols-4 max-[758px]:grid-cols-3 gap-4">
      {animes.map(anime => (
        <AnimeCard 
          key={anime.id}
          item={anime}
          path="watch"
          className="custom-class"
        />
      ))}
    </div>
  );
}
```

### Features
- ✨ 3D tilt effect based on mouse position
- ✨ Animated glow with brand colors
- ✨ Shine effect on hover
- ✨ Smooth play button animation
- ✨ Info badges slide-up effect
- ✨ Responsive and accessible

---

## 2. Simplified Card Component (UPDATED)

### Before (Old Way - No Longer Needed)

```jsx
// ❌ Old complex way
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### After (New Simple Way)

```jsx
// ✅ New simple way
import { Card } from '@/components/ui';

// Basic card
<Card>
  <h3>Title</h3>
  <p>Description</p>
  <p>Content here</p>
  <button>Action</button>
</Card>

// Card with 3D hover effect
<Card hover3d>
  <h3>Title</h3>
  <p>Content</p>
</Card>

// Card with custom styling
<Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500">
  <h3>Custom Card</h3>
</Card>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hover3d` | boolean | `false` | Enable 3D hover effect |
| `className` | string | `''` | Additional CSS classes |
| `children` | ReactNode | - | Card content |

---

## 3. Modern Banner Component (AUTO-UPDATED)

The Banner component is automatically used by the Spotlight carousel. It now features:

### New Visual Features
- ✨ Animated spotlight badge with star icon
- ✨ Gradient text title
- ✨ Glassmorphism info tags
- ✨ Modern quality and episode badges
- ✨ Gradient buttons with shine effect
- ✨ Parallax image effect
- ✨ Animated glow overlay

### No Code Changes Needed!

The Banner component is used internally by the Spotlight component. Your existing code will automatically use the new design:

```jsx
// Your existing code works as-is!
<Spotlight spotlights={homeInfo.spotlights} />
```

---

## 4. Replacing Old CategoryCard with AnimeCard

### Option 1: Keep Using CategoryCard (Recommended)

The existing `CategoryCard` component still works perfectly. No changes needed!

```jsx
<CategoryCard
  label="Latest Episode"
  data={animes}
  path="recently-updated"
  limit={12}
/>
```

### Option 2: Use AnimeCard Directly (For Custom Layouts)

If you want to create a custom layout with the new 3D effects:

```jsx
import { AnimeCard } from '@/components/ui';

function CustomAnimeGrid({ animes }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Latest Episodes</h2>
      <div className="grid grid-cols-6 gap-4">
        {animes.map(anime => (
          <AnimeCard 
            key={anime.id}
            item={anime}
            path="watch"
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 5. Component Comparison

### When to Use Each Component

#### Use `AnimeCard` when:
- ✅ You want 3D hover effects
- ✅ Building custom anime grids
- ✅ Need maximum visual impact
- ✅ Creating featured sections

#### Use `CategoryCard` when:
- ✅ You need the full category layout (title + grid + view more)
- ✅ Want consistent styling with existing pages
- ✅ Need the built-in responsive behavior
- ✅ Don't need custom layouts

#### Use `Card` when:
- ✅ Building general UI components
- ✅ Need a simple container
- ✅ Want optional 3D effects
- ✅ Creating custom layouts

---

## 6. Styling Examples

### Custom AnimeCard Styling

```jsx
// Add custom wrapper styling
<AnimeCard 
  item={anime}
  path="watch"
  className="transform hover:scale-105 transition-transform"
/>

// Wrap in custom container
<div className="relative group">
  <AnimeCard item={anime} path="watch" />
  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
    <Badge variant="success">New</Badge>
  </div>
</div>
```

### Custom Card Styling

```jsx
// Gradient background
<Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
  <h3>Gradient Card</h3>
</Card>

// With 3D effect and custom padding
<Card hover3d className="p-8">
  <h3>3D Card</h3>
</Card>

// Transparent with border
<Card className="bg-transparent border-2 border-brand-primary">
  <h3>Bordered Card</h3>
</Card>
```

---

## 7. Animation Control

### Disable Animations for Accessibility

The components automatically respect the user's motion preferences:

```css
/* Automatically applied */
@media (prefers-reduced-motion: reduce) {
  /* All animations are disabled */
}
```

### Custom Animation Timing

You can override animation timing with CSS:

```css
.my-custom-card .anime-card-3d {
  transition-duration: 0.5s; /* Slower */
}

.my-fast-card .anime-card-3d {
  transition-duration: 0.2s; /* Faster */
}
```

---

## 8. Responsive Behavior

### AnimeCard Responsive Grid

```jsx
<div className="
  grid 
  grid-cols-2        /* 2 columns on mobile */
  sm:grid-cols-3     /* 3 columns on small screens */
  md:grid-cols-4     /* 4 columns on medium screens */
  lg:grid-cols-5     /* 5 columns on large screens */
  xl:grid-cols-6     /* 6 columns on extra large screens */
  gap-4
">
  {animes.map(anime => (
    <AnimeCard key={anime.id} item={anime} path="watch" />
  ))}
</div>
```

### Card Responsive Padding

```jsx
<Card className="
  p-4              /* 16px padding on mobile */
  md:p-6           /* 24px padding on medium screens */
  lg:p-8           /* 32px padding on large screens */
">
  <h3>Responsive Card</h3>
</Card>
```

---

## 9. Common Patterns

### Featured Anime Section

```jsx
function FeaturedAnime({ animes }) {
  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold mb-6">Featured Anime</h2>
      <div className="grid grid-cols-4 gap-6">
        {animes.slice(0, 4).map(anime => (
          <AnimeCard 
            key={anime.id}
            item={anime}
            path="watch"
          />
        ))}
      </div>
    </section>
  );
}
```

### Info Card with 3D Effect

```jsx
function StatsCard({ title, value, icon }) {
  return (
    <Card hover3d className="p-6 text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-gray-400">{title}</p>
    </Card>
  );
}
```

### Anime Grid with Loading State

```jsx
function AnimeGridWithLoading({ animes, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      {animes.map(anime => (
        <AnimeCard key={anime.id} item={anime} path="watch" />
      ))}
    </div>
  );
}
```

---

## 10. Performance Tips

### Optimize Large Lists

```jsx
import { memo } from 'react';

// Memoize AnimeCard to prevent unnecessary re-renders
const MemoizedAnimeCard = memo(AnimeCard);

function LargeAnimeList({ animes }) {
  return (
    <div className="grid grid-cols-6 gap-4">
      {animes.map(anime => (
        <MemoizedAnimeCard 
          key={anime.id}
          item={anime}
          path="watch"
        />
      ))}
    </div>
  );
}
```

### Lazy Load Images

```jsx
// AnimeCard already uses loading="lazy"
// But you can add intersection observer for more control

import { useInView } from 'react-intersection-observer';

function LazyAnimeCard({ item, path }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div ref={ref}>
      {inView && <AnimeCard item={item} path={path} />}
    </div>
  );
}
```

---

## 11. Troubleshooting

### Issue: 3D effect not working

**Solution:** Make sure the parent container doesn't have `overflow: hidden`

```jsx
// ❌ Bad
<div className="overflow-hidden">
  <AnimeCard item={anime} />
</div>

// ✅ Good
<div className="overflow-visible">
  <AnimeCard item={anime} />
</div>
```

### Issue: Animations are choppy

**Solution:** Reduce the number of animated elements or use `will-change`

```css
.anime-card-3d {
  will-change: transform;
}
```

### Issue: Cards not responsive

**Solution:** Use responsive grid classes

```jsx
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
  {/* Cards */}
</div>
```

---

## 12. Migration Guide

### Migrating from Old Card Component

```jsx
// Before
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// After
<Card>
  <h3 className="text-2xl font-semibold mb-4">Title</h3>
  <div>Content</div>
</Card>
```

### Adding 3D Effects to Existing Cards

```jsx
// Before
<Card className="p-6">
  <h3>Title</h3>
</Card>

// After (just add hover3d prop)
<Card hover3d className="p-6">
  <h3>Title</h3>
</Card>
```

---

## Summary

### New Components
- ✅ `AnimeCard` - 3D hover anime card
- ✅ Simplified `Card` - Single component, no sub-components
- ✅ Modern `Banner` - Auto-updated with new design

### Key Features
- 🎨 3D hover effects
- ✨ Smooth animations
- 🎭 Glassmorphism design
- 🌈 Gradient effects
- ♿ Fully accessible
- 📱 Responsive
- ⚡ Performant

### Quick Start
```jsx
import { AnimeCard, Card } from '@/components/ui';

// Use AnimeCard for anime grids
<AnimeCard item={anime} path="watch" />

// Use Card for general UI
<Card hover3d>Content</Card>
```

---

**Need Help?** Check the component files for more examples and documentation!
