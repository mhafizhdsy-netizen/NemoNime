# Testing 3D Tilt Effect

## How to Test the 3D Tilt Effect

### Method 1: Use in Existing Pages

The `AnimeCard` component can be used anywhere you display anime. Simply import and use it:

```jsx
import { AnimeCard } from '@/components/ui';

function TestPage() {
  const testAnime = {
    id: 'test-anime',
    title: 'Test Anime Title',
    japanese_title: 'テストアニメ',
    poster: 'https://via.placeholder.com/300x420',
    description: 'This is a test anime description',
    tvInfo: {
      sub: 24,
      dub: 12,
      showType: 'TV',
      duration: '24m',
      rating: 'PG-13'
    },
    releaseDate: '2024'
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">3D Tilt Effect Test</h1>
      <div className="grid grid-cols-4 gap-6">
        <AnimeCard item={testAnime} path="watch" />
        <AnimeCard item={testAnime} path="watch" />
        <AnimeCard item={testAnime} path="watch" />
        <AnimeCard item={testAnime} path="watch" />
      </div>
    </div>
  );
}
```

### Method 2: Test in Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Run this code to test the transform:

```javascript
// Find an anime card
const card = document.querySelector('.anime-card-3d');

// Test the transform
card.style.transform = 'perspective(1000px) rotateX(10deg) rotateY(10deg) scale(1.05)';

// Reset after 2 seconds
setTimeout(() => {
  card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
}, 2000);
```

### Method 3: Check CSS is Applied

1. Open Developer Tools (F12)
2. Inspect an anime card element
3. Check the Computed styles
4. Look for these properties:
   - `transform-style: preserve-3d`
   - `perspective: 1000px`
   - `will-change: transform`

### Expected Behavior

When you hover over an anime card and move your mouse:

1. **Card tilts** based on mouse position
2. **Rotates on X-axis** (up/down movement)
3. **Rotates on Y-axis** (left/right movement)
4. **Scales up slightly** (1.05x)
5. **Smooth transition** when mouse leaves

### Visual Indicators

You should see:
- ✅ Card tilts as you move mouse
- ✅ Play button appears with animation
- ✅ Glow effect around the card
- ✅ Info badges slide up
- ✅ Smooth return to normal when mouse leaves

### Troubleshooting

#### Issue: Card doesn't tilt

**Check 1: Parent container**
```jsx
// Make sure parent doesn't have overflow: hidden
<div className="overflow-visible"> {/* Not overflow-hidden */}
  <AnimeCard item={anime} />
</div>
```

**Check 2: CSS is loaded**
```javascript
// In browser console
const card = document.querySelector('.anime-card-3d');
console.log(window.getComputedStyle(card).transformStyle);
// Should output: "preserve-3d"
```

**Check 3: JavaScript is running**
```javascript
// In browser console
const card = document.querySelector('.anime-card-3d');
card.addEventListener('mousemove', (e) => {
  console.log('Mouse move detected!', e.clientX, e.clientY);
});
// Move mouse over card, should see console logs
```

#### Issue: Tilt is too subtle

Increase the rotation angles in `AnimeCard.jsx`:

```javascript
// Change from:
const rotateX = ((y - centerY) / centerY) * -10;
const rotateY = ((x - centerX) / centerX) * 10;

// To (more dramatic):
const rotateX = ((y - centerY) / centerY) * -15;
const rotateY = ((x - centerX) / centerX) * 15;
```

#### Issue: Tilt is too dramatic

Decrease the rotation angles:

```javascript
// Change to (more subtle):
const rotateX = ((y - centerY) / centerY) * -5;
const rotateY = ((x - centerX) / centerX) * 5;
```

#### Issue: Performance is choppy

Add this to reduce animation complexity:

```css
.anime-card-3d {
  will-change: transform;
  transform: translateZ(0); /* Force GPU acceleration */
}
```

### Browser Compatibility

The 3D effect works in:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Not supported in:
- ❌ Internet Explorer 11

### Mobile Behavior

On mobile devices:
- Touch events don't trigger tilt (no mouse position)
- Hover effects still work on tap
- Reduced animation complexity for performance

### Performance Tips

1. **Limit number of cards**: Don't render 100+ cards at once
2. **Use virtualization**: For long lists, use react-window or similar
3. **Disable on low-end devices**: Check performance and disable if needed

```javascript
// Disable 3D on low-end devices
const isLowEndDevice = navigator.hardwareConcurrency < 4;

<AnimeCard 
  item={anime} 
  className={isLowEndDevice ? 'no-3d' : ''}
/>
```

### Debug Mode

Add this to see the transform values in real-time:

```jsx
function AnimeCard({ item, path = '', className }) {
  const cardRef = useRef(null);
  const [debug, setDebug] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setDebug({ x, y, rotateX, rotateY });
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  return (
    <div>
      {/* Debug info */}
      <div className="text-xs text-gray-400 mb-2">
        X: {debug.x.toFixed(0)} Y: {debug.y.toFixed(0)} 
        RotX: {debug.rotateX.toFixed(1)}° RotY: {debug.rotateY.toFixed(1)}°
      </div>
      
      <div ref={cardRef} onMouseMove={handleMouseMove}>
        {/* Card content */}
      </div>
    </div>
  );
}
```

### Success Criteria

The 3D tilt effect is working correctly if:

1. ✅ Card tilts smoothly as mouse moves
2. ✅ Rotation follows mouse position accurately
3. ✅ Card returns to normal when mouse leaves
4. ✅ No jank or stuttering
5. ✅ Works on all supported browsers
6. ✅ Performance stays at 60fps

### Next Steps

If the effect is working:
1. Adjust rotation angles to your preference
2. Customize the scale factor
3. Modify transition timing
4. Add more visual effects

If the effect is NOT working:
1. Check browser console for errors
2. Verify CSS is loaded
3. Inspect element to see computed styles
4. Test with the debug mode above
5. Check parent container doesn't block the effect

---

**Need more help?** Check the AnimeCard.jsx and AnimeCard.css files for the complete implementation.
