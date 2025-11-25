# Scrollbar Customization Guide

## Current Implementation

The `.neon-scrollbar` class provides a custom-styled scrollbar with neon gradient colors and opacity effects.

### Features
- **Subtle opacity**: Default 40% opacity for a clean, non-intrusive look
- **Hover effect**: Increases to 80% opacity on hover for better visibility
- **Smooth transitions**: 0.2s ease transition between states
- **Cross-browser support**: Works on Chrome, Safari, Edge, and Firefox
- **Neon gradient**: Purple to cyan gradient matching the app theme

## Default Styling

```css
/* Webkit browsers (Chrome, Safari, Edge) */
- Width: 8px
- Track: Semi-transparent white (3% opacity)
- Thumb: Neon gradient (40% opacity)
- Thumb hover: Neon gradient (80% opacity)

/* Firefox */
- Width: thin
- Colors: Neon purple with semi-transparent track
```

## Customization Options

### Option 1: Adjust Opacity Levels

Edit `/client/global.css`:

```css
/* More subtle (30% default, 60% hover) */
.neon-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    hsl(var(--neon-purple) / 0.3),
    hsl(var(--neon-cyan) / 0.3)
  );
}

.neon-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    hsl(var(--neon-purple) / 0.6),
    hsl(var(--neon-cyan) / 0.6)
  );
}
```

```css
/* More visible (60% default, 100% hover) */
.neon-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    hsl(var(--neon-purple) / 0.6),
    hsl(var(--neon-cyan) / 0.6)
  );
}

.neon-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    hsl(var(--neon-purple)),
    hsl(var(--neon-cyan))
  );
}
```

### Option 2: Change Scrollbar Width

```css
.neon-scrollbar::-webkit-scrollbar {
  width: 6px;  /* Thinner */
  height: 6px;
}

/* or */

.neon-scrollbar::-webkit-scrollbar {
  width: 12px;  /* Thicker */
  height: 12px;
}
```

### Option 3: Different Color Scheme

```css
/* Single color (purple only) */
.neon-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--neon-purple) / 0.4);
}

.neon-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--neon-purple) / 0.8);
}
```

```css
/* Custom gradient direction */
.neon-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(
    45deg,  /* Diagonal gradient */
    hsl(var(--neon-pink) / 0.4),
    hsl(var(--neon-cyan) / 0.4)
  );
}
```

### Option 4: Visible Track Background

```css
/* More visible track */
.neon-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.08);  /* Increased from 0.03 */
  border-radius: 9999px;
}
```

```css
/* Darker track */
.neon-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 9999px;
}
```

### Option 5: Add Active State

```css
/* Visual feedback when scrolling */
.neon-scrollbar::-webkit-scrollbar-thumb:active {
  background: linear-gradient(
    180deg,
    hsl(var(--neon-purple)),
    hsl(var(--neon-cyan))
  );
  box-shadow: 0 0 10px hsl(var(--neon-cyan) / 0.5);
}
```

## Recommended Presets

### Minimal (Very Subtle)
```css
thumb: 0.3 opacity
hover: 0.5 opacity
width: 6px
```

### Balanced (Current Default)
```css
thumb: 0.4 opacity
hover: 0.8 opacity
width: 8px
```

### Prominent (High Visibility)
```css
thumb: 0.6 opacity
hover: 1.0 opacity
width: 10px
```

### Bold (Maximum Visibility)
```css
thumb: 0.8 opacity
hover: 1.0 opacity
width: 12px
track: visible background
```

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Webkit styling |
| Safari | ✅ Full | Webkit styling |
| Edge | ✅ Full | Webkit styling |
| Firefox | ✅ Good | Limited to scrollbar-width and scrollbar-color |
| Mobile Safari | ⚠️ Partial | Scrollbar hidden by default (iOS behavior) |
| Mobile Chrome | ⚠️ Partial | Scrollbar appears only while scrolling |

## Tips

1. **Test both states**: Always check default and hover states
2. **Check contrast**: Ensure scrollbar is visible against your background
3. **Mobile consideration**: Mobile browsers often hide scrollbars
4. **Accessibility**: Don't rely only on scrollbar for scroll indication
5. **Performance**: Keep transitions simple for smooth performance

## Current Values

```css
Default opacity: 40% (0.4)
Hover opacity: 80% (0.8)
Width: 8px
Track opacity: 3% (0.03)
Transition: 0.2s ease
```

These values provide a good balance between visibility and aesthetic appeal while maintaining the neon theme.

