# Quick Start Guide - NimeNemo UI/UX Overhaul

## Getting Started

This guide will help you quickly understand and use the new design system and components.

## Installation

No additional installation required! All components are already integrated into the project.

## Using the Design System

### 1. Import Components

```jsx
// Import individual components
import { Button } from '@/components/ui';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Toast } from '@/components/ui';

// Or import from specific paths
import Button from '@/components/ui/button/Button';
import FeedbackButton from '@/components/feedback/FeedbackButton';
```

### 2. Use Design Tokens

```jsx
// Import design tokens
import { colors } from '@/design-system/tokens/colors';
import { typography } from '@/design-system/tokens/typography';
import { spacing } from '@/design-system/tokens/spacing';

// Use in your components
const MyComponent = () => (
  <div style={{ color: colors.brand.primary }}>
    Styled with design tokens
  </div>
);
```

### 3. Use Tailwind Classes

The new color system is integrated with Tailwind:

```jsx
<div className="bg-brand-primary text-white">
  Primary brand color
</div>

<div className="bg-surface text-foreground">
  Surface with foreground text
</div>

<button className="bg-success text-success-foreground">
  Success button
</button>
```

## Component Examples

### Button Component

```jsx
import { Button } from '@/components/ui';

// Primary button
<Button variant="primary" size="md">
  Click me
</Button>

// Loading state
<Button variant="primary" loading>
  Loading...
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Icon />
</Button>

// Disabled button
<Button variant="outline" disabled>
  Disabled
</Button>
```

### Card Component

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Anime Title</CardTitle>
    <CardDescription>Episode 12 - Season 1</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Description of the anime episode...</p>
  </CardContent>
  <CardFooter>
    <Button variant="primary">Watch Now</Button>
  </CardFooter>
</Card>
```

### Badge Component

```jsx
import { Badge } from '@/components/ui';

// Status badges
<Badge variant="success">New</Badge>
<Badge variant="warning">Ongoing</Badge>
<Badge variant="error">Ended</Badge>

// Genre tags
<Badge variant="outline" size="sm">Action</Badge>
<Badge variant="outline" size="sm">Adventure</Badge>
```

### Toast Notifications

```jsx
import { Toast } from '@/components/ui';
import { useState } from 'react';

function MyComponent() {
  const [showToast, setShowToast] = useState(false);

  return (
    <>
      <Button onClick={() => setShowToast(true)}>
        Show Notification
      </Button>

      {showToast && (
        <Toast
          variant="success"
          title="Success!"
          description="Episode added to watchlist"
          onClose={() => setShowToast(false)}
          duration={5000}
        />
      )}
    </>
  );
}
```

### Feedback Button

Already integrated in `App.jsx`! It appears as a floating button in the bottom-right corner.

```jsx
import FeedbackButton from '@/components/feedback/FeedbackButton';

// In your layout
<FeedbackButton />
```

## Styling Guidelines

### Colors

Use semantic color names for better maintainability:

```jsx
// ✅ Good
<div className="bg-brand-primary text-white">Primary action</div>
<div className="bg-success text-success-foreground">Success message</div>

// ❌ Avoid
<div className="bg-[#FF6B6B] text-white">Primary action</div>
```

### Spacing

Use the 8px grid system:

```jsx
// ✅ Good - Uses spacing scale
<div className="p-4 gap-2">Content</div>
<div className="mt-8 mb-6">Content</div>

// ❌ Avoid - Arbitrary values
<div className="p-[13px] gap-[7px]">Content</div>
```

### Typography

Use responsive font sizes:

```jsx
// ✅ Good - Responsive
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
  Heading
</h1>

// ✅ Good - Using design tokens
<h1 style={{ fontSize: typography.fontSize.heading.h1 }}>
  Heading
</h1>
```

## Accessibility Best Practices

### 1. Always Include ARIA Labels

```jsx
// ✅ Good
<button aria-label="Close menu" onClick={handleClose}>
  <X />
</button>

// ❌ Avoid
<button onClick={handleClose}>
  <X />
</button>
```

### 2. Use Semantic HTML

```jsx
// ✅ Good
<nav role="navigation" aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

// ❌ Avoid
<div className="nav">
  <div><a href="/home">Home</a></div>
</div>
```

### 3. Ensure Keyboard Navigation

```jsx
// ✅ Good
<button 
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
>
  Click me
</button>
```

### 4. Provide Focus Indicators

All components have built-in focus indicators. Don't remove them:

```jsx
// ✅ Good - Uses default focus styles
<Button>Click me</Button>

// ❌ Avoid
<button className="focus:outline-none">Click me</button>
```

## Common Patterns

### Loading States

```jsx
import { Skeleton } from '@/components/ui';

function AnimeCard({ loading, data }) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  return <div>{/* Actual content */}</div>;
}
```

### Error States

```jsx
import Error from '@/components/error/Error';

function MyPage() {
  const { data, error } = useFetch();

  if (error) {
    return <Error error={error.status === 404 ? "404" : "500"} />;
  }

  return <div>{/* Content */}</div>;
}
```

### Form Validation

```jsx
function MyForm() {
  const [errors, setErrors] = useState({});

  return (
    <form>
      <input
        className={errors.email ? 'border-error' : 'border-input'}
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? 'email-error' : undefined}
      />
      {errors.email && (
        <p id="email-error" className="text-error text-sm mt-1">
          {errors.email}
        </p>
      )}
    </form>
  );
}
```

## Responsive Design

### Mobile-First Approach

```jsx
// ✅ Good - Mobile first
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Column 1</div>
  <div className="w-full md:w-1/2">Column 2</div>
</div>

// ❌ Avoid - Desktop first
<div className="flex flex-row md:flex-col">
  {/* Content */}
</div>
```

### Breakpoints

```jsx
// Tailwind breakpoints
sm: 640px   // Small devices
md: 768px   // Medium devices
lg: 1024px  // Large devices
xl: 1280px  // Extra large devices
2xl: 1536px // 2X Extra large devices

// Custom breakpoints (defined in tailwind.config.js)
custom-md: 600px
custom-xl: 1200px
ultra-wide: 1660px
```

## Performance Tips

### 1. Lazy Load Components

```jsx
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function MyPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 2. Optimize Images

```jsx
// Use lazy loading
<img 
  src="/anime-poster.jpg" 
  alt="Anime title"
  loading="lazy"
  className="w-full h-auto"
/>

// Use responsive images
<picture>
  <source srcSet="/anime-poster.webp" type="image/webp" />
  <img src="/anime-poster.jpg" alt="Anime title" />
</picture>
```

### 3. Memoize Expensive Computations

```jsx
import { useMemo } from 'react';

function AnimeList({ animes, filter }) {
  const filteredAnimes = useMemo(() => {
    return animes.filter(anime => anime.genre === filter);
  }, [animes, filter]);

  return <div>{/* Render filtered animes */}</div>;
}
```

## Testing

### Component Testing

```jsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('button is disabled when loading', () => {
  render(<Button loading>Click me</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
});
```

### Accessibility Testing

```jsx
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

test('component has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Troubleshooting

### Issue: Colors not showing correctly
**Solution:** Make sure you're using the `dark` class on the root element or body tag.

### Issue: Components not importing
**Solution:** Check the import path. Use `@/components/ui` for UI components.

### Issue: Tailwind classes not working
**Solution:** Ensure the file is included in `tailwind.config.js` content array.

### Issue: Focus indicators not visible
**Solution:** Don't use `focus:outline-none` without providing an alternative focus indicator.

## Resources

- [Design System README](./src/design-system/README.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [UI/UX Overhaul Plan](./UI_UX_OVERHAUL_PLAN.md)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Need Help?

Use the feedback button in the bottom-right corner of the application to report issues or request features!
