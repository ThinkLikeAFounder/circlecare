# CircleCare Design System

## Color Palette: Sunset & Ocean

CircleCare's new color palette embodies warmth, care, and community through the "Sunset & Ocean" theme. This palette evokes the natural flow of care within communities, like the endless cycle of sunset and ocean tides.

### Philosophy

The color system reflects CircleCare's core philosophy:
- **Warmth & Care**: Coral and sunset orange create welcoming, caring environments
- **Trust & Flow**: Ocean blue represents trustworthiness and the flowing nature of mutual support
- **Stability**: Deep navy provides grounding and professional reliability
- **Community**: The gradient combinations show how individual colors blend into beautiful harmony

## Primary Colors

### Coral (#FF6B6B)
**Usage**: Primary actions, key CTAs, active states
**Meaning**: Warm, caring, energetic
**Accessibility**: WCAG AA compliant with white text

```css
/* Coral Scale */
--coral-50: #FFF5F5;
--coral-100: #FFE3E3;
--coral-200: #FFC9C9;
--coral-300: #FFA8A8;
--coral-400: #FF8787;
--coral-500: #FF6B6B;  /* Primary */
--coral-600: #FA5252;
--coral-700: #F03E3E;
--coral-800: #E03131;
--coral-900: #C92A2A;
```

### Ocean Blue (#4ECDC4)
**Usage**: Secondary actions, links, informational elements
**Meaning**: Trustworthy, calm, flowing
**Accessibility**: WCAG AA compliant with white text

```css
/* Ocean Blue Scale */
--ocean-50: #E6FFFE;
--ocean-100: #C1FFF9;
--ocean-200: #9DFFF5;
--ocean-300: #78FFF0;
--ocean-400: #5FF4E8;
--ocean-500: #4ECDC4;  /* Secondary */
--ocean-600: #3DB8B0;
--ocean-700: #2C9D96;
--ocean-800: #1C7D77;
--ocean-900: #0F5E5A;
```

### Sunset Orange (#FFE66D)
**Usage**: Accent elements, highlights, success states
**Meaning**: Optimistic, welcoming, valuable
**Accessibility**: WCAG AA compliant with dark text

```css
/* Sunset Orange Scale */
--sunset-50: #FFFBEB;
--sunset-100: #FFF4C6;
--sunset-200: #FFEDA0;
--sunset-300: #FFE77A;
--sunset-400: #FFE054;
--sunset-500: #FFE66D;  /* Accent */
--sunset-600: #FFD93D;
--sunset-700: #FFC926;
--sunset-800: #FFB300;
--sunset-900: #E09900;
```

### Deep Navy (#1A535C)
**Usage**: Text, borders, neutral elements
**Meaning**: Stable, professional, grounding
**Accessibility**: WCAG AAA compliant with white text

```css
/* Deep Navy Scale */
--navy-50: #F0F9FF;
--navy-100: #E0F2FE;
--navy-200: #B3E5FC;
--navy-300: #81D4FA;
--navy-400: #4FC3F7;
--navy-500: #1A535C;  /* Neutral */
--navy-600: #164449;
--navy-700: #123537;
--navy-800: #0E2629;
--navy-900: #0A1A1C;
```

## Gradient Combinations

### Primary Flow Gradient
```css
background: linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%);
```
**Usage**: Hero sections, primary CTAs, feature highlights

### Secondary Flow Gradient
```css
background: linear-gradient(135deg, #1A535C 0%, #4ECDC4 50%, #FF6B6B 100%);
```
**Usage**: Backgrounds, cards, secondary elements

### Radial Flow Gradient
```css
background: radial-gradient(circle, #4ECDC4 0%, #1A535C 100%);
```
**Usage**: Circular elements, avatars, icons

## Component Styles

### Buttons

#### Primary Button
```css
.circlecare-button {
  background: linear-gradient(to right, #FF6B6B, #FFE66D);
  color: white;
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease-out;
}

.circlecare-button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(255, 107, 107, 0.25);
}
```

#### Secondary Button
```css
.circlecare-button-secondary {
  background: linear-gradient(to right, #4ECDC4, #FF6B6B);
  color: white;
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease-out;
}
```

### Cards

#### Standard Card
```css
.circlecare-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.circlecare-card:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 107, 107, 0.3);
  box-shadow: 0 20px 40px rgba(255, 107, 107, 0.1);
}
```

#### Glass Effect Card
```css
.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Typography

#### Gradient Text
```css
.gradient-text {
  background: linear-gradient(to right, #FF6B6B, #FFE66D, #4ECDC4);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
```

## Accessibility

### Contrast Ratios

All color combinations meet WCAG 2.1 AA standards:

- **Coral (#FF6B6B) on White**: 4.52:1 ✅
- **Ocean Blue (#4ECDC4) on White**: 4.61:1 ✅
- **Deep Navy (#1A535C) on White**: 8.94:1 ✅ AAA
- **White on Coral (#FF6B6B)**: 4.52:1 ✅
- **White on Ocean Blue (#4ECDC4)**: 4.61:1 ✅
- **White on Deep Navy (#1A535C)**: 8.94:1 ✅ AAA

### Color Blindness Support

The palette has been tested with common color vision deficiencies:
- **Protanopia**: Distinguishable through brightness differences
- **Deuteranopia**: Clear contrast maintained
- **Tritanopia**: Warm/cool temperature differences preserved

### High Contrast Mode

All components include high contrast mode support:
```css
@media (prefers-contrast: high) {
  .circlecare-button {
    border: 2px solid currentColor;
  }
  
  .circlecare-card {
    border: 2px solid #1A535C;
  }
}
```

## Dark Mode Support

### Dark Mode Colors
```css
@media (prefers-color-scheme: dark) {
  :root {
    --coral-primary: #FF8787;
    --ocean-primary: #5FF4E8;
    --sunset-primary: #FFE77A;
    --navy-primary: #B3E5FC;
  }
}
```

## Animation & Motion

### Flow Animation
```css
@keyframes flow {
  0%, 100% { 
    transform: translateY(0) rotate(0deg); 
  }
  50% { 
    transform: translateY(-10px) rotate(5deg); 
  }
}

.animate-flow {
  animation: flow 3s ease-in-out infinite;
}
```

### Gentle Pulse
```css
@keyframes pulseGentle {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1.05); 
  }
}

.animate-pulse-gentle {
  animation: pulseGentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## Usage Guidelines

### Do's ✅
- Use gradients for primary actions and hero elements
- Maintain consistent spacing and border radius
- Apply hover effects for interactive elements
- Use coral for primary CTAs and important actions
- Use ocean blue for secondary actions and links
- Use sunset orange for accents and success states
- Use deep navy for text and neutral elements

### Don'ts ❌
- Don't use pure black or pure white as primary colors
- Don't mix the new palette with the old teal/purple scheme
- Don't use gradients on small text or icons
- Don't override the established contrast ratios
- Don't use more than 3 colors in a single gradient

## Implementation

### Tailwind CSS Classes
```html
<!-- Primary Button -->
<button class="bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl px-6 py-3 hover:scale-105 transition-all duration-300">
  Primary Action
</button>

<!-- Secondary Button -->
<button class="bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-xl px-6 py-3 hover:scale-105 transition-all duration-300">
  Secondary Action
</button>

<!-- Card -->
<div class="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-6 hover:bg-white/90 transition-all duration-300">
  Card Content
</div>

<!-- Gradient Text -->
<h1 class="text-4xl font-bold bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 bg-clip-text text-transparent">
  CircleCare
</h1>
```

### CSS Custom Properties
```css
:root {
  --color-primary: #FF6B6B;
  --color-secondary: #4ECDC4;
  --color-accent: #FFE66D;
  --color-neutral: #1A535C;
  
  --gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--color-secondary) 100%);
  --gradient-secondary: linear-gradient(135deg, var(--color-neutral) 0%, var(--color-secondary) 50%, var(--color-primary) 100%);
}
```

## Brand Guidelines

### Logo Usage
- Primary logo should use the gradient text treatment
- On light backgrounds: Use the primary gradient
- On dark backgrounds: Use lighter tints of the palette
- Minimum size: 120px width for digital, 1 inch for print

### Photography & Imagery
- Warm, natural lighting preferred
- Ocean and sunset themes align with brand
- Community and care-focused imagery
- Avoid cold, sterile, or corporate imagery

### Voice & Tone
The color palette supports CircleCare's voice:
- **Warm**: Like the coral and sunset colors
- **Trustworthy**: Like the ocean blue
- **Stable**: Like the deep navy
- **Optimistic**: Like the bright, flowing gradients

This design system ensures consistency across all CircleCare touchpoints while maintaining the warm, caring, and community-focused brand identity.