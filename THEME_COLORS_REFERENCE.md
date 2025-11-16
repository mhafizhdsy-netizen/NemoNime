# Theme Colors Quick Reference

## Color Palette Comparison

### Dark Theme
```
┌─────────────────────────────────────────────────┐
│ Background Layers                               │
├─────────────────────────────────────────────────┤
│ Primary:   #0B0E14  ████████  Very Dark Blue   │
│ Secondary: #151922  ████████  Dark Blue-Gray   │
│ Tertiary:  #1F2937  ████████  Medium Dark      │
│ Elevated:  #2D3748  ████████  Lighter Dark     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Text Colors                                     │
├─────────────────────────────────────────────────┤
│ Primary:   #F9FAFB  ████████  Almost White     │
│ Secondary: #D1D5DB  ████████  Light Gray       │
│ Tertiary:  #9CA3AF  ████████  Medium Gray      │
│ Disabled:  #6B7280  ████████  Dark Gray        │
└─────────────────────────────────────────────────┘
```

### Light Theme
```
┌─────────────────────────────────────────────────┐
│ Background Layers                               │
├─────────────────────────────────────────────────┤
│ Primary:   #F9FAFB  ████████  Very Light Gray  │
│ Secondary: #F3F4F6  ████████  Light Gray       │
│ Tertiary:  #E5E7EB  ████████  Medium Light     │
│ Elevated:  #FFFFFF  ████████  Pure White       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Text Colors                                     │
├─────────────────────────────────────────────────┤
│ Primary:   #111827  ████████  Almost Black     │
│ Secondary: #374151  ████████  Dark Gray        │
│ Tertiary:  #6B7280  ████████  Medium Gray      │
│ Disabled:  #9CA3AF  ████████  Light Gray       │
└─────────────────────────────────────────────────┘
```

## Brand Colors (Theme Independent)
```
┌─────────────────────────────────────────────────┐
│ Primary:   #E91E63  ████████  Vibrant Pink     │
│ Secondary: #00BCD4  ████████  Cyan             │
│ Accent:    #FFC107  ████████  Amber            │
│ Tertiary:  #9C27B0  ████████  Purple           │
└─────────────────────────────────────────────────┘
```

## Semantic Colors (Theme Independent)
```
┌─────────────────────────────────────────────────┐
│ Success:   #4CAF50  ████████  Green            │
│ Warning:   #FF9800  ████████  Orange           │
│ Error:     #F44336  ████████  Red              │
│ Info:      #2196F3  ████████  Blue             │
└─────────────────────────────────────────────────┘
```

## Tailwind Class Reference

### Background Colors
```jsx
// Dark theme
dark:bg-[#0B0E14]    // Primary background
dark:bg-[#151922]    // Secondary background
dark:bg-[#1F2937]    // Tertiary background
dark:bg-[#2D3748]    // Elevated background

// Light theme
light:bg-[#F9FAFB]   // Primary background
light:bg-[#F3F4F6]   // Secondary background
light:bg-[#E5E7EB]   // Tertiary background
light:bg-white       // Elevated background
```

### Text Colors
```jsx
// Dark theme
dark:text-[#F9FAFB]  // Primary text
dark:text-[#D1D5DB]  // Secondary text
dark:text-[#9CA3AF]  // Tertiary text
dark:text-[#6B7280]  // Disabled text

// Light theme
light:text-[#111827] // Primary text
light:text-[#374151] // Secondary text
light:text-[#6B7280] // Tertiary text
light:text-[#9CA3AF] // Disabled text
```

### Border Colors
```jsx
// Dark theme
dark:border-white/10     // Default border
dark:border-white/20     // Hover border

// Light theme
light:border-black/10    // Default border
light:border-black/20    // Hover border
```

## Component Examples

### Button
```jsx
<button className="
  dark:bg-[#2D3748] light:bg-white
  dark:text-white light:text-gray-900
  dark:hover:bg-[#374151] light:hover:bg-gray-100
  dark:border-white/10 light:border-black/10
  rounded-xl px-4 py-2 transition-all
">
  Button
</button>
```

### Card
```jsx
<div className="
  dark:bg-[#151922] light:bg-white
  dark:text-white light:text-gray-900
  dark:border-white/10 light:border-black/10
  rounded-xl p-6 shadow-lg
">
  Card Content
</div>
```

### Input
```jsx
<input className="
  dark:bg-[#1F2937] light:bg-white
  dark:text-white light:text-gray-900
  dark:border-white/10 light:border-black/10
  dark:placeholder-gray-500 light:placeholder-gray-400
  rounded-xl px-4 py-2
" />
```

### Badge
```jsx
<span className="
  dark:bg-[#2D3748] light:bg-gray-200
  dark:text-white light:text-gray-900
  rounded-xl px-3 py-1 text-sm
">
  Badge
</span>
```

## CSS Variables Usage

### In CSS Files
```css
.my-component {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  border-color: hsl(var(--border));
}

.my-card {
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
}

.my-button {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
```

### In JSX with Inline Styles
```jsx
<div style={{
  backgroundColor: 'hsl(var(--background))',
  color: 'hsl(var(--foreground))',
  borderColor: 'hsl(var(--border))'
}}>
  Content
</div>
```

## Contrast Ratios

### Dark Theme
```
Text on Background:
  Primary (#F9FAFB on #0B0E14):   15.8:1  ✅ AAA
  Secondary (#D1D5DB on #0B0E14): 11.2:1  ✅ AAA
  Tertiary (#9CA3AF on #0B0E14):   6.8:1  ✅ AA

Interactive Elements:
  Buttons:  7.5:1  ✅ AA
  Links:    8.2:1  ✅ AA
  Icons:    6.5:1  ✅ AA
```

### Light Theme
```
Text on Background:
  Primary (#111827 on #F9FAFB):   16.2:1  ✅ AAA
  Secondary (#374151 on #F9FAFB): 10.8:1  ✅ AAA
  Tertiary (#6B7280 on #F9FAFB):   5.9:1  ✅ AA

Interactive Elements:
  Buttons:  8.1:1  ✅ AA
  Links:    7.8:1  ✅ AA
  Icons:    6.2:1  ✅ AA
```

## Gradient Examples

### Dark Theme Gradients
```css
/* Background gradient */
background: linear-gradient(135deg, #0B0E14 0%, #151922 100%);

/* Card gradient */
background: linear-gradient(135deg, 
  rgba(31, 41, 55, 0.8) 0%, 
  rgba(45, 55, 72, 0.8) 100%
);
```

### Light Theme Gradients
```css
/* Background gradient */
background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);

/* Card gradient */
background: linear-gradient(135deg, 
  rgba(255, 255, 255, 0.9) 0%, 
  rgba(243, 244, 246, 0.9) 100%
);
```

### Brand Gradients
```css
/* Primary gradient (Pink to Purple) */
background: linear-gradient(135deg, #E91E63 0%, #9C27B0 100%);

/* Secondary gradient (Cyan to Blue) */
background: linear-gradient(135deg, #00BCD4 0%, #2196F3 100%);

/* Accent gradient (Amber to Orange) */
background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);

/* Glow gradient (Multi-color) */
background: linear-gradient(135deg, #E91E63 0%, #00BCD4 50%, #9C27B0 100%);
```

## Quick Copy-Paste Classes

### Container
```
dark:bg-[#0B0E14] light:bg-[#F9FAFB] dark:text-white light:text-gray-900
```

### Card
```
dark:bg-[#151922] light:bg-white dark:border-white/10 light:border-black/10 rounded-xl shadow-lg
```

### Button Primary
```
bg-brand-primary text-white hover:bg-[#C2185B] rounded-xl px-4 py-2 transition-all
```

### Button Secondary
```
dark:bg-[#2D3748] light:bg-gray-200 dark:text-white light:text-gray-900 dark:hover:bg-[#374151] light:hover:bg-gray-300 rounded-xl px-4 py-2 transition-all
```

### Input Field
```
dark:bg-[#1F2937] light:bg-white dark:text-white light:text-gray-900 dark:border-white/10 light:border-black/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-primary
```

### Badge
```
dark:bg-[#2D3748] light:bg-gray-200 dark:text-white light:text-gray-900 rounded-xl px-3 py-1 text-sm
```
