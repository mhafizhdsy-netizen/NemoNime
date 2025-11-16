# New Color Palette Reference

## Quick Color Reference

### Brand Colors
```css
Primary (Pink):     #E91E63  →  rgb(233, 30, 99)
Secondary (Cyan):   #00BCD4  →  rgb(0, 188, 212)
Accent (Amber):     #FFC107  →  rgb(255, 193, 7)
Tertiary (Purple):  #9C27B0  →  rgb(156, 39, 176)
```

### Semantic Colors
```css
Success (Green):    #4CAF50  →  rgb(76, 175, 80)
Warning (Orange):   #FF9800  →  rgb(255, 152, 0)
Error (Red):        #F44336  →  rgb(244, 67, 54)
Info (Blue):        #2196F3  →  rgb(33, 150, 243)
```

### Dark Theme
```css
Background Primary:   #0A0A0F  →  hsl(246, 40%, 4%)
Background Secondary: #121218  →  hsl(246, 25%, 7%)
Background Tertiary:  #1A1A24  →  hsl(246, 20%, 14%)
Background Elevated:  #232330  →  hsl(246, 20%, 14%)
```

### Light Theme
```css
Background Primary:   #FAFAFA  →  hsl(0, 0%, 98%)
Background Secondary: #F5F5F7  →  hsl(0, 0%, 96%)
Background Tertiary:  #EEEEEE  →  hsl(0, 0%, 93%)
Background Elevated:  #FFFFFF  →  hsl(0, 0%, 100%)
```

## Gradient Definitions

### Primary Gradient (Pink to Purple)
```css
background: linear-gradient(135deg, #E91E63 0%, #9C27B0 100%);
```

### Secondary Gradient (Cyan to Blue)
```css
background: linear-gradient(135deg, #00BCD4 0%, #2196F3 100%);
```

### Accent Gradient (Amber to Orange)
```css
background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
```

### Glow Gradient (Multi-color)
```css
background: linear-gradient(135deg, #E91E63 0%, #00BCD4 50%, #9C27B0 100%);
```

## Border Radius Standards

### Component Sizes
```css
Buttons:        rounded-xl  (0.75rem / 12px)
Cards:          rounded-xl  (0.75rem / 12px)
Badges:         rounded-xl  (0.75rem / 12px)
Small Items:    rounded-lg  (0.5rem / 8px)
Avatars:        rounded-full (50%)
```

## Usage Examples

### Button with Primary Color
```jsx
<button className="bg-brand-primary hover:bg-[#C2185B] text-white rounded-xl px-4 py-2">
  Click Me
</button>
```

### Card with Glow Effect
```jsx
<div className="rounded-xl bg-card border border-white/5 hover:shadow-[0_0_30px_rgba(233,30,99,0.4)]">
  Card Content
</div>
```

### Badge with Secondary Color
```jsx
<span className="bg-brand-secondary text-white rounded-xl px-3 py-1 text-sm">
  Badge
</span>
```

## Color Psychology

- **Pink (#E91E63)**: Energy, passion, excitement - perfect for primary actions
- **Cyan (#00BCD4)**: Trust, clarity, communication - ideal for secondary elements
- **Amber (#FFC107)**: Optimism, warmth, attention - great for highlights
- **Purple (#9C27B0)**: Creativity, luxury, imagination - excellent for special features
- **Green (#4CAF50)**: Success, growth, harmony - positive feedback
- **Orange (#FF9800)**: Caution, enthusiasm, creativity - warnings
- **Red (#F44336)**: Urgency, importance, error - critical alerts
- **Blue (#2196F3)**: Information, stability, trust - informational messages

## Accessibility Notes

All color combinations have been chosen to meet WCAG 2.1 AA standards:
- Text on primary colors: White text ensures 4.5:1 contrast ratio
- Dark theme backgrounds: Sufficient contrast for readability
- Light theme backgrounds: Clear distinction between elements
- Focus states: High contrast borders for keyboard navigation
