---
name: pressto
description: >-
  Comprehensive guide, API reference, configuration patterns, and best practices for pressto — a high-performance React Native animated pressables library powered by Reanimated and Gesture Handler for UI thread (60fps) touch feedback.
---

# Pressto 🔥

`pressto` is a lightweight, high-performance React Native pressable component library created by Enzo Manuel Mangano. It is built on top of `react-native-gesture-handler` (`BaseButton`) and `react-native-reanimated` to replace `TouchableOpacity`, `TouchableHighlight`, and standard `Pressable` with main-thread, 60fps animated touchables.

---

## Key Characteristics & Benefits

- **UI Thread Animations**: Executes press feedback animations off the JS thread for 60fps responsiveness even during heavy JS execution.
- **Pre-built Components**: Ready-to-use `PressableScale` and `PressableOpacity` components.
- **Custom Pressable HOC**: `createAnimatedPressable` for creating custom animated pressables with worklets.
- **Global & Local Configuration**: Centralized `PressablesConfig` provider for uniform animation physics, default props, global haptics, and analytics.
- **State Awareness**: Worklets and render props receive `isPressed`, `isToggled`, and `isSelected` state flags.

---

## Installation & Setup

### Package Installation

```bash
bun add pressto react-native-reanimated react-native-gesture-handler react-native-worklets
# or
npm install pressto react-native-reanimated react-native-gesture-handler react-native-worklets
# or
yarn add pressto react-native-reanimated react-native-gesture-handler react-native-worklets
```

Ensure `react-native-gesture-handler` is wrapped at the root of your application (`GestureHandlerRootView`).

---

## Basic Components

### 1. `PressableScale`

Scales down smoothly when pressed.

```tsx
import { PressableScale } from 'pressto';
import { Text } from 'react-native';

export function ScaleButton() {
  return (
    <PressableScale
      onPress={() => console.log('Button pressed')}
      config={{ minScale: 0.95 }}
    >
      <Text>Scale Animation</Text>
    </PressableScale>
  );
}
```

### 2. `PressableOpacity`

Fades out smoothly when pressed.

```tsx
import { PressableOpacity } from 'pressto';
import { Text } from 'react-native';

export function OpacityButton() {
  return (
    <PressableOpacity
      onPress={() => console.log('Button pressed')}
      config={{ activeOpacity: 0.7 }}
    >
      <Text>Opacity Animation</Text>
    </PressableOpacity>
  );
}
```

Both components inherit all standard `Pressable` and `BaseButton` props (`onPress`, `onPressIn`, `onPressOut`, `onLongPress`, `style`, `enabled`, `disabled`, `testID`, `accessibilityLabel`).

---

## Custom Animations (`createAnimatedPressable`)

You can create custom animated pressables by passing a worklet function to `createAnimatedPressable`.

```tsx
import { createAnimatedPressable } from 'pressto';

const PressableRotate = createAnimatedPressable((progress, options) => {
  'worklet';
  return {
    transform: [{ rotate: `${progress * 45}deg` }],
  };
});

// Usage
<PressableRotate onPress={() => console.log('Rotated')}>
  <Text>Rotate Me</Text>
</PressableRotate>
```

### Worklet Parameters

1. `progress`: Number between `0` (idle) and `1` (pressed).
2. `options`: Object containing:
   - `isPressed`: `boolean`
   - `isToggled`: `boolean` (toggles state on each press)
   - `isSelected`: `boolean` (whether it's the active item in a selection group)
   - `metadata`: `TMetadata` (custom data passed via `metadata` prop or `PressablesConfig`)
   - `config`: `PressableConfig`
   - `withAnimation`: Helper function `(value) => withAnimation(value)` applying the configured timing/spring parameters.

> **CRITICAL REQUIREMENT**: The `'worklet';` directive **MUST** be placed at the very top line inside your animation function. Without `'worklet';`, Reanimated will fail to run the function on the UI thread.

---

## Render Props (Child Animations)

Instead of static JSX children, pass a function as `children` to animate child elements or text dynamically:

```tsx
<PressableScale onPress={handlePress}>
  {({ progress, isPressed, isToggled, withAnimation }) => (
    <AnimatedText style={{ opacity: isPressed.value ? 0.6 : 1 }}>
      {isToggled.value ? 'Selected' : 'Select Me'}
    </AnimatedText>
  )}
</PressableScale>
```

Render prop callback receives:
- `progress`: `SharedValue<number>` (0 to 1)
- `isPressed`: `SharedValue<boolean>`
- `isToggled`: `SharedValue<boolean>`
- `isSelected`: `SharedValue<boolean>`
- `withAnimation`: `<T>(value: T) => T` helper.

---

## Global App Configuration (`PressablesConfig`)

Wrap your app or screen hierarchy with `<PressablesConfig>` to enforce consistent animation physics and global behaviors:

```tsx
import { PressablesConfig, PressableScale, PressableOpacity } from 'pressto';

export function AppProvider({ children }) {
  return (
    <PressablesConfig
      animationType="spring"
      animationConfig={{ damping: 25, stiffness: 180 }}
      config={{
        minScale: 0.94,
        activeOpacity: 0.65,
      }}
      defaultProps={{
        rippleColor: 'transparent', // Disable Android default ripple globally if desired
      }}
      globalHandlers={{
        onPress: (options) => {
          // Trigger global haptics or analytics logging on every pressable interaction!
          console.log('Global press triggered on:', options.metadata?.name);
        },
      }}
    >
      {children}
    </PressablesConfig>
  );
}
```

### Overriding Config Per Component

Single pressable components can override default config values via their local `config` prop:

```tsx
{/* Inherits spring physics and global haptics, but overrides activeOpacity */}
<PressableOpacity config={{ activeOpacity: 0.4 }} />

{/* Overrides minScale only */}
<PressableScale config={{ minScale: 0.88 }} />
```

---

## Migration Guide (Replacing `TouchableOpacity` / `Pressable`)

### Before (`TouchableOpacity`):
```tsx
import { TouchableOpacity, Text } from 'react-native';

<TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.btn}>
  <Text style={styles.txt}>Click Me</Text>
</TouchableOpacity>
```

### After (`pressto`):
```tsx
import { PressableOpacity } from 'pressto';
import { Text } from 'react-native';

<PressableOpacity onPress={handlePress} config={{ activeOpacity: 0.7 }} style={styles.btn}>
  <Text style={styles.txt}>Click Me</Text>
</PressableOpacity>
```

---

## Best Practices & Tips

1. **Use `PressableScale` for Buttons & Cards**: Physical press feel works best with subtle scaling (`minScale: 0.96` to `0.92`).
2. **Use `PressableOpacity` for Text Links & Icons**: Fading feedback feels natural for inline links or navigation icons.
3. **Always Add `'worklet';`**: ESLint plugin `eslint-plugin-pressto` can be installed to automatically enforce missing `'worklet';` directives in `createAnimatedPressable`.
