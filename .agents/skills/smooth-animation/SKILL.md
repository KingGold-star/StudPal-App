---
name: smooth-animation
description: >-
  Comprehensive guide, API reference, best practices, and refactoring skill for react-native-ease — a lightweight, declarative React Native animation library powered by iOS Core Animation and Android Animator APIs with zero JS overhead.
---

# Smooth Animation (react-native-ease)

`react-native-ease` is a lightweight, declarative React Native animation library developed by App & Flow. It drives UI animations entirely using native platform APIs (**CAAnimation** on iOS and **ObjectAnimator** / **SpringAnimation** on Android), eliminating JavaScript thread bottleneck, worklets, and custom C++ animation engines.

---

## Core Characteristics & Architectural Goals

- **Zero JS Overhead**: Animations execute off the JS thread on native platform animation engines.
- **Declarative CSS-Transition-like API**: Simple `<EaseView>` component taking `animate` and `transition` props.
- **Interruptible Motion**: Transitioning target values mid-flight smoothly recalculates trajectories without visual jumps.
- **Fabric Only**: Native Architecture built exclusively for React Native's New Architecture (Fabric).
- **Native Framework Integrations**: Direct support for NativeWind (v4+) and Uniwind.

---

## When to Use `react-native-ease` vs `react-native-reanimated`

| Feature / Use Case | `react-native-ease` | `react-native-reanimated` |
| :--- | :---: | :---: |
| **State-driven animations** (opacity, scale, translate, rotate) | ✅ **Ideal** | ✅ |
| **Entrance & exit animations** | ✅ | ✅ |
| **Color & border transitions** | ✅ | ✅ |
| **Zero JS overhead / No worklets** | ✅ | ❌ |
| **Gesture-driven animations** (Pan, Pinch, Swipe) | ❌ | ✅ **Required** |
| **Scroll-driven animations** | ❌ | ✅ **Required** |
| **Layout animations** (width, height auto-layout) | ❌ | ✅ **Required** |
| **Shared Element Transitions** | ❌ | ✅ **Required** |

---

## Installation & Setup

### 1. Core Package Installation

```bash
npm install react-native-ease
# or
yarn add react-native-ease
```

### 2. NativeWind (v4+) Integration

Import the NativeWind adapter once in your application entry point (e.g., `App.tsx` or `_layout.tsx`):

```tsx
import 'react-native-ease/nativewind';
```

This registers `<EaseView>` with NativeWind's `cssInterop` so Tailwind class names are converted seamlessly:

```tsx
<EaseView
  className="flex-1 bg-card rounded-2xl p-4 shadow-lg"
  animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
  transition={{ type: 'spring', damping: 15, stiffness: 120 }}
>
  {children}
</EaseView>
```

### 3. Uniwind Integration

Import `EaseView` directly from the Uniwind module:

```tsx
import { EaseView } from 'react-native-ease/uniwind';
```

---

## Component API Reference: `<EaseView>`

`<EaseView>` inherits all standard React Native `<View>` props (`style`, `children`, `onLayout`, `testID`, etc.) and adds animation-specific properties.

### Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `animate` | `AnimatableProps` | Object containing current target values for animated properties. |
| `initialAnimate` | `AnimatableProps` | Optional starting values for mount/entrance or looping animations. |
| `transition` | `TransitionConfig \| TransitionMap` | Transition physics/timing configuration. |
| `onTransitionEnd` | `(event: { finished: boolean }) => void` | Callback fired when the animation completes or is interrupted. |

### Supported Animatable Properties

- **Transforms**: `translateX`, `translateY`, `scale`, `scaleX`, `scaleY`, `rotate`, `rotateX`, `rotateY`
- **Opacity**: `opacity`
- **Background Color**: `backgroundColor`
- **Borders**: `borderRadius`, `borderWidth`, `borderColor`
- **Shadows**: `shadowOpacity`, `shadowRadius`, `shadowColor`, `shadowOffset`, `elevation`

---

## Transition Configurations

### 1. Timing Animations (`type: 'timing'`)

Fixed-duration transitions using standard or custom cubic bezier easing curves.

```tsx
<EaseView
  animate={{ opacity: isVisible ? 1 : 0, translateY: isVisible ? 0 : 20 }}
  transition={{
    type: 'timing',
    duration: 300,
    easing: 'easeOut',
    delay: 50,
  }}
/>
```

#### Timing Parameters
- `duration`: `number` (default: `300` ms)
- `easing`: `'linear'` | `'easeIn'` | `'easeOut'` | `'easeInOut'` | `[x1, y1, x2, y2]`
- `delay`: `number` (default: `0` ms)
- `loop`: `'repeat'` (restart from beginning) | `'reverse'` (alternate direction)

#### Custom Cubic Bezier Easing
Pass a 4-number tuple `[x1, y1, x2, y2]` matching CSS `cubic-bezier()`:
- `x1`, `x2` must be bounded between `0` and `1`.
- `y1`, `y2` can extend outside `[0, 1]` to create overshoot/bounce effects.

```tsx
// Material Design Standard Easing
easing: [0.4, 0.0, 0.2, 1.0]

// Overshoot / Springy Easing Curve
easing: [0.68, -0.55, 0.265, 1.55]
```

### 2. Spring Animations (`type: 'spring'`)

Physics-based spring model providing organic, natural motion for interactive elements.

```tsx
<EaseView
  animate={{ scale: isPressed ? 0.95 : 1, translateY: isOpen ? 0 : 100 }}
  transition={{
    type: 'spring',
    damping: 15,
    stiffness: 120,
    mass: 1,
    velocity: 0,
  }}
/>
```

#### Spring Parameters
- `damping`: `number` (default: `15`) — Resistance/friction. Higher values reduce bounce.
- `stiffness`: `number` (default: `120`) — Spring constant. Higher values increase speed.
- `mass`: `number` (default: `1`) — Object mass. Higher values add inertia/momentum.
- `velocity`: `number` (default: `0`) — Initial velocity in property units/sec (native platforms only).
- `delay`: `number` (default: `0` ms)

#### Recommended Spring Presets
```tsx
// Snappy (No overshoot)
const SNAPPY_SPRING = { type: 'spring', damping: 20, stiffness: 300, mass: 1 };

// Gentle Bounce (Standard UI feedback)
const GENTLE_SPRING = { type: 'spring', damping: 12, stiffness: 120, mass: 1 };

// Bouncy (Playful interactions)
const BOUNCY_SPRING = { type: 'spring', damping: 8, stiffness: 200, mass: 1 };

// Heavy / Slow (Modals, Drawer reveals)
const HEAVY_SPRING = { type: 'spring', damping: 20, stiffness: 60, mass: 2 };
```

### 3. Immediate / Disabled Animations (`type: 'none'`)

Instantly updates properties without animation (useful for accessibility / reduced motion preferences).

```tsx
<EaseView
  animate={{ opacity: isVisible ? 1 : 0 }}
  transition={{ type: 'none' }}
/>
```

---

## Per-Property Transition Mapping (`TransitionMap`)

When different properties require unique transition profiles (e.g., spring for scale, timing for opacity):

```tsx
<EaseView
  animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.8 }}
  transition={{
    opacity: { type: 'timing', duration: 200, easing: 'easeOut' },
    transform: { type: 'spring', damping: 12, stiffness: 150 },
    default: { type: 'timing', duration: 300 },
  }}
/>
```

Available category keys in `TransitionMap`:
- `opacity`
- `transform` (`translateX`, `translateY`, `scale`, `rotate`)
- `backgroundColor`
- `borderRadius`
- `border` (`borderWidth`, `borderColor`)
- `shadow` (`shadowOpacity`, `shadowRadius`, `shadowColor`, `elevation`)
- `default` (fallback config)

---

## Code Refactoring & Migration Guide

Use this procedure when refactoring existing `Reanimated` or `Animated` components to `react-native-ease`:

### Step-by-Step Refactoring Protocol

1. **Audit Component Eligibility**:
   - Verify the animation is state-driven (not gesture or scroll driven).
   - Ensure target properties are supported (`opacity`, `transform`, `backgroundColor`, `borderRadius`, `border`, `shadow`).
2. **Remove Boilerplate**:
   - Remove `useSharedValue`, `useAnimatedStyle`, `withTiming`, `withSpring`, `runOnJS`.
   - Remove `<Animated.View>` wrappers.
3. **Insert `<EaseView>`**:
   - Convert `useAnimatedStyle` outputs into declarative `animate={{ ... }}` objects driven directly by React `useState` or `props`.
   - Configure `transition` prop using timing or spring parameters.

### Migration Examples

#### Before (`react-native-reanimated`):
```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function Card({ expanded }: { expanded: boolean }) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSpring(expanded ? 1.05 : 1, { damping: 15, stiffness: 120 });
  }, [expanded]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.card, animatedStyle]} />;
}
```

#### After (`react-native-ease`):
```tsx
import { EaseView } from 'react-native-ease';

function Card({ expanded }: { expanded: boolean }) {
  return (
    <EaseView
      style={styles.card}
      animate={{ scale: expanded ? 1.05 : 1 }}
      transition={{ type: 'spring', damping: 15, stiffness: 120 }}
    />
  );
}
```

---

## Troubleshooting & Best Practices

- **Fabric Requirement**: Ensure React Native New Architecture (`newArchEnabled=true`) is active.
- **Layout Animations**: Do not attempt to animate `width`, `height`, `flex`, or `margin` using `EaseView`. Use transform scales or Reanimated layout animations for structural layout changes.
- **Entrance Animations**: Use `initialAnimate` alongside `animate` for mount transitions.
