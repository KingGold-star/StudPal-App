---
name: gesture-handler
description: >-
  Comprehensive guide, API reference, gesture composition patterns, and best practices for React Native Gesture Handler (react-native-gesture-handler) — native-driven 60fps touch and gesture management for React Native.
---

# React Native Gesture Handler (`react-native-gesture-handler`) 🖐️

`react-native-gesture-handler` (RNGH) is Software Mansion's industry-standard native gesture management library for React Native. It replaces React Native's legacy JavaScript-based Gesture Responder System with native platform gesture recognizers (`UIGestureRecognizer` on iOS, `GestureRecognizer` / Android MotionEvents).

When combined with `react-native-reanimated`, gestures run directly on the UI thread with zero JS bridge latency at 60/120fps.

---

## Architecture & Fundamental Concepts

1. **Native Thread Execution**: Touch tracking is performed at the OS level on the UI thread.
2. **`<GestureHandlerRootView>` Requirement**: Must wrap the root of the app component tree to register native touch listeners.
3. **`<GestureDetector>`**: The core component that attaches declarative `Gesture` definitions to children views.
4. **Declarative Gestures API**: Gestures are built using chainable factory methods (`Gesture.Pan()`, `Gesture.Tap()`, `Gesture.Pinch()`, `Gesture.Rotation()`, etc.).
5. **Worklet Compatibility**: Gesture callbacks (`onStart`, `onUpdate`, `onEnd`, `onFinalize`) run as Reanimated UI thread worklets.

---

## Installation & Setup

### Package Installation

#### Expo Projects:
```bash
npx expo install react-native-gesture-handler
```

#### Bare React Native Projects:
```bash
npm install react-native-gesture-handler react-native-reanimated react-native-worklets
# or
yarn add react-native-gesture-handler react-native-reanimated react-native-worklets
# or
bun add react-native-gesture-handler react-native-reanimated react-native-worklets
```

### App Root Wrapping

Wrap your entry point (`App.tsx` or `_layout.tsx`) with `GestureHandlerRootView`:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainNavigator />
    </GestureHandlerRootView>
  );
}
```

---

## Core Gestures API Reference

### 1. `Gesture.Pan()` — Dragging & Panning

Tracks continuous drag touches with translation and velocity:

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

export function DraggableBox() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      'worklet';
    })
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      'worklet';
      // Snap back or decay animation
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </GestureDetector>
  );
}
```

#### Key `Pan` Event Properties
- `translationX`, `translationY`: Displacement from gesture origin.
- `velocityX`, `velocityY`: Instantaneous pan velocity.
- `x`, `y`: Touch position relative to element bounds.
- `absoluteX`, `absoluteY`: Screen-space touch position.

---

### 2. `Gesture.Tap()` — Single & Multi Taps

Recognizes discrete taps or double-taps:

```tsx
const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .maxDuration(250)
  .onEnd(() => {
    'worklet';
    console.log('Double tapped!');
  });
```

---

### 3. `Gesture.Pinch()` — Pinch to Zoom

Tracks two-finger pinch scale and focal center:

```tsx
const scale = useSharedValue(1);

const pinch = Gesture.Pinch()
  .onUpdate((event) => {
    'worklet';
    scale.value = event.scale;
  });
```

#### Key `Pinch` Event Properties
- `scale`: Pinch scale factor relative to start (1.0 = unchanged).
- `focalX`, `focalY`: Focal center point of pinch.
- `velocity`: Pinch scale velocity.

---

### 4. `Gesture.Rotation()` — Two-finger Rotation

Tracks rotation angle:

```tsx
const rotation = useSharedValue(0);

const rotate = Gesture.Rotation()
  .onUpdate((event) => {
    'worklet';
    rotation.value = event.rotation; // Angle in radians
  });
```

---

### 5. `Gesture.LongPress()` — Press & Hold

Triggers when touch is held down beyond a duration threshold:

```tsx
const longPress = Gesture.LongPress()
  .minDuration(500) // 500ms hold
  .onEnd((event, success) => {
    'worklet';
    if (success) console.log('Long press completed');
  });
```

---

### 6. `Gesture.Fling()` — Fast Swipe

Detects quick directional flings:

```tsx
import { Directions } from 'react-native-gesture-handler';

const flingRight = Gesture.Fling()
  .direction(Directions.RIGHT)
  .onEnd(() => {
    'worklet';
    console.log('Swiped right!');
  });
```

---

## Gesture Composition & Relations

RNGH provides powerful composition APIs to combine multiple gestures.

### 1. `Gesture.Race(...)` (Competing Gestures)
Only the first gesture to activate wins; all other gestures are cancelled.

```tsx
const raceGesture = Gesture.Race(panGesture, tapGesture);
```

### 2. `Gesture.Simultaneous(...)` (Simultaneous Gestures)
Allows gestures to operate concurrently (e.g., Pinch + Rotate + Pan image viewer):

```tsx
const transformGesture = Gesture.Simultaneous(pan, pinch, rotation);

return (
  <GestureDetector gesture={transformGesture}>
    <Animated.Image style={animatedStyle} source={imageUri} />
  </GestureDetector>
);
```

### 3. `Gesture.Exclusive(...)` (Exclusive Priority)
Defines fallback hierarchy (e.g. Double Tap takes precedence over Single Tap):

```tsx
const singleTap = Gesture.Tap().onEnd(() => console.log('Single tap'));
const doubleTap = Gesture.Tap().numberOfTaps(2).onEnd(() => console.log('Double tap'));

// Double tap is evaluated first; single tap only fires if double tap fails
const exclusiveTap = Gesture.Exclusive(doubleTap, singleTap);
```

### 4. Direct Relation Methods
- `simultaneousWith(otherGesture)`: Run simultaneously with another gesture instance.
- `requireToFail(otherGesture)`: Wait for `otherGesture` to fail before activating.
- `blocksExternalGesture(otherGesture)`: Block external gesture recognizers.

---

## Native Components & Touchables

RNGH includes native-backed implementations of React Native controls to prevent gesture conflicts inside scroll containers:

- `<ScrollView>` & `<FlatList>` from `react-native-gesture-handler`
- `<Pressable>` & `<TouchableHighlight>` / `<TouchableOpacity>`
- `<TextInput>`
- `<ReanimatedSwipeable>`: Swipe-to-delete / swipe-action list item wrapper.
- `<ReanimatedDrawerLayout>`: Native side drawer navigator container.

---

## Unit Testing with Jest

Setup test mocks in `jest.setup.js`:

```js
import 'react-native-gesture-handler/jestSetup';
```

Fire gesture events in tests using `fireGestureHandler`:
```tsx
import { fireGestureHandler, State } from 'react-native-gesture-handler/jest-utils';

test('triggers pan gesture handler', () => {
  const component = render(<DraggableBox />);
  fireGestureHandler(getByGestureTestId('pan-gesture'), [
    { state: State.BEGAN, translationX: 0 },
    { state: State.ACTIVE, translationX: 100 },
    { state: State.END, translationX: 100 },
  ]);
});
```
