---
name: pulsar
description: >-
  Comprehensive guide, API reference, preset catalog, custom pattern composition, and best practices for Pulsar (react-native-pulsar) — Software Mansion's rich, worklet-compatible cross-platform haptic feedback SDK for React Native.
---

# Pulsar (react-native-pulsar) ⚡

`react-native-pulsar` (Pulsar) is a cross-platform, rich haptic feedback SDK created by Software Mansion. It provides 150+ ready-to-use haptic presets, custom haptic pattern composition, continuous real-time gesture modulation, and platform-adaptive fallback mechanisms. All preset functions and hook methods are worklet-compatible and execute seamlessly on the UI thread alongside `react-native-reanimated`.

---

## Key Features & Capabilities

- **150+ Ready-to-Use Presets**: High-fidelity haptic presets covering UI feedback, game events, celebrations, alerts, and mechanical interactions.
- **Worklet Native Execution**: All preset methods can be invoked directly inside Reanimated worklets (e.g. inside `useAnimatedStyle`, `onUpdate`, `onEnd`).
- **Pattern Composer (`usePatternComposer`)**: Compose custom discrete and continuous haptic vibration sequences.
- **Realtime Composer (`useRealtimeComposer`)**: Live amplitude and frequency modulation driven by continuous gestures (pan, drag, scrub).
- **Adaptive Cross-Platform Haptics (`useAdaptiveHaptics`)**: Platform-specific fallbacks automatically selecting optimal iOS or Android haptic definitions.
- **Global Settings & Mute Control**: App-wide haptic muting via `Settings`.
- **Hardware Support Detection**: Query device capabilities via `HapticSupport`.

---

## Requirements & Installation

### Requirements
- React Native 0.71+
- New Architecture enabled (`newArchEnabled = true`)

### Installation

#### Expo Projects:
```bash
npx expo install react-native-pulsar
npx expo prebuild
```

#### Bare React Native Projects:
```bash
npm install react-native-pulsar react-native-worklets
# or
yarn add react-native-pulsar react-native-worklets
# or
bun add react-native-pulsar react-native-worklets
```

---

## 1. Using Built-in & System Presets (`Presets`)

Pulsar offers built-in cross-platform presets and platform-native system presets.

```tsx
import { Presets } from 'react-native-pulsar';

// Call directly in event handlers or Reanimated worklets:
function handlePress() {
  Presets.bloom(); // Subtle confirmation
}

function handleSuccess() {
  Presets.fanfare(); // Celebratory achievement
}

function handleError() {
  Presets.buzz(); // Critical error rejection
}
```

### Popular Built-in Presets Catalog
- **UI Feedback**: `blip()`, `bloom()`, `chirp()`, `dewdrop()`, `flick()`, `catPaw()`
- **Impacts & Force**: `anvil()`, `boulder()`, `impact()`, `jolt()`, `hammer()`
- **Alerts & Errors**: `alarm()`, `buzz()`, `clamor()`, `knell()`, `glitch()`
- **Rhythmic & Mechanical**: `cameraShutter()`, `keyboardMechanical()`, `keyboardMembrane()`, `heartbeat()`, `coinDrop()`, `combinationLock()`
- **Celebration & Rewards**: `applause()`, `ascent()`, `fanfare()`, `flourish()`, `fizz()`

### Platform System Presets
Access platform-native haptics via `Presets.System`:

```tsx
// iOS Native System Haptics
Presets.System.iOS.impactLight();
Presets.System.iOS.impactMedium();
Presets.System.iOS.impactHeavy();
Presets.System.iOS.selection();
Presets.System.iOS.notificationSuccess();
Presets.System.iOS.notificationWarning();
Presets.System.iOS.notificationError();

// Android Native Primitives
Presets.System.Android.primitiveLowTick();
Presets.System.Android.primitiveClick();
Presets.System.Android.primitiveHeavyClick();
```

---

## 2. Worklet Compatibility with Reanimated & Gesture Handler

All Pulsar presets can be invoked directly inside Reanimated gesture handlers:

```tsx
import { Presets } from 'react-native-pulsar';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

function HapticButton() {
  const tap = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      Presets.flick(); // Worklet-safe haptic on tap start
    })
    .onEnd(() => {
      'worklet';
      Presets.bloom(); // Worklet-safe haptic on tap completion
    });

  return (
    <GestureDetector gesture={tap}>
      <View style={styles.button} />
    </GestureDetector>
  );
}
```

---

## 3. Custom Pattern Composing (`usePatternComposer`)

Compose custom haptic waveforms combining discrete taps and continuous frequency/amplitude curves.

```tsx
import { usePatternComposer, type Pattern } from 'react-native-pulsar';

const CUSTOM_RUMBLE_PATTERN: Pattern = {
  // Discrete transient impacts
  discretePattern: [
    { time: 0, amplitude: 1.0, frequency: 0.8 },
    { time: 120, amplitude: 0.6, frequency: 0.4 },
  ],
  // Continuous wave modulation
  continuousPattern: {
    amplitude: [
      { time: 0, value: 0 },
      { time: 250, value: 1.0 },
      { time: 500, value: 0 },
    ],
    frequency: [
      { time: 0, value: 0.2 },
      { time: 500, value: 0.9 },
    ],
  },
};

export function CustomHapticComponent() {
  const { play, stop, isParsed } = usePatternComposer(CUSTOM_RUMBLE_PATTERN);

  return (
    <Button title="Play Waveform" onPress={() => play()} />
  );
}
```

---

## 4. Realtime Gesture Haptics (`useRealtimeComposer`)

Dynamically modulate amplitude and frequency based on user touch position, velocity, or drag displacement:

```tsx
import { useRealtimeComposer } from 'react-native-pulsar';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export function DraggableScrubber() {
  const realtime = useRealtimeComposer();

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      // Calculate normalized intensity based on pan velocity
      const amplitude = Math.min(Math.abs(event.velocityY) / 1500, 1.0);
      const frequency = Math.min(Math.abs(event.velocityX) / 1500, 1.0);

      // Dynamically update active haptic stream
      realtime.set(amplitude, frequency);
    })
    .onEnd(() => {
      'worklet';
      realtime.stop(); // Stop haptics when gesture releases
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={styles.scrubber} />
    </GestureDetector>
  );
}
```

---

## 5. Adaptive Cross-Platform Haptics (`useAdaptiveHaptics`)

Automatically select the native iOS or Android preset while maintaining fallback behavior:

```tsx
import { useAdaptiveHaptics, Presets } from 'react-native-pulsar';

const ADAPTIVE_SUCCESS = {
  ios: Presets.System.iOS.notificationSuccess,
  android: {
    discretePattern: [
      { time: 0, amplitude: 0.8, frequency: 0.5 },
      { time: 80, amplitude: 1.0, frequency: 0.7 },
    ],
  },
};

export function SuccessFeedback() {
  const { play } = useAdaptiveHaptics(ADAPTIVE_SUCCESS);

  return <Button title="Trigger Cross-Platform Success" onPress={play} />;
}
```

---

## 6. Global Mute & Hardware Capabilities

### Global Mute (`Settings`)
Mute all haptic output across the app (e.g., respecting user settings in low-battery or silent mode):

```tsx
import { Settings } from 'react-native-pulsar';

// Mute all haptics app-wide
Settings.setGlobalMute(true);

// Unmute haptics
Settings.setGlobalMute(false);
```

### Hardware Support Inspection (`HapticSupport`)
Check if the host device supports advanced haptics:

```tsx
import { HapticSupport } from 'react-native-pulsar';

async function checkHaptics() {
  const info = await HapticSupport.getSupportInfo();
  console.log('Supports Haptics:', info.isSupported);
  console.log('Supports Continuous Haptics:', info.supportsContinuousHaptics);
  console.log('Supports Custom Patterns:', info.supportsCustomPatterns);
}
```

---

## 7. Unit Testing with Jest

Import Pulsar's official Jest mock in your `jest.setup.js`:

```js
// jest.setup.js
import 'react-native-pulsar/jest';
```

In your test files:
```tsx
import { Presets } from 'react-native-pulsar';

test('fires haptic preset on button click', () => {
  fireEvent.press(screen.getByText('Submit'));
  expect(Presets.bloom).toHaveBeenCalled();
});
```
