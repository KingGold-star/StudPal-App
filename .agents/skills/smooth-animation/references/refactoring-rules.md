# Refactoring Rules for react-native-ease

This document outlines the classification logic and code mapping rules for automated or manual migration from `react-native-reanimated` / React Native `Animated` to `react-native-ease`.

---

## 1. Classification Rules (Decision Tree)

Evaluate components containing animation code using the following strict priority order:

1. **Gesture API Detection**:
   - `Gesture.Pan()`, `Gesture.Pinch()`, `Gesture.Rotation()`, `useAnimatedGestureHandler()`
   - **Result**: NOT Migratable (Reason: "Gesture-driven animation requires Reanimated worklets").

2. **Scroll Event Handler Detection**:
   - `useAnimatedScrollHandler()`, `Animated.event()` attached to `onScroll`
   - **Result**: NOT Migratable (Reason: "Scroll-driven animation requires continuous worklet event coupling").

3. **Shared Element Transitions**:
   - `sharedTransitionTag`
   - **Result**: NOT Migratable (Reason: "Shared element transitions not supported").

4. **Worklets / Native UI Execution**:
   - `runOnUI()`, `'worklet';` directive
   - **Result**: NOT Migratable (Reason: "Requires worklet runtime engine").

5. **Animation Sequencing**:
   - `withSequence()`
   - **Result**: NOT Migratable (Reason: "Animation sequencing not supported").

6. **Complex Delay Wrapping**:
   - `withDelay()` wrapping `withSequence()` or nested `withDelay()`
   - **Result**: NOT Migratable (Reason: "Complex delay/sequencing combinations not supported").
   - *Exception*: Single `withDelay(ms, withTiming(...))` or `withDelay(ms, withSpring(...))` is **Migratable** -> map `delay: ms` on transition config.

7. **Layout Animations**:
   - `layout={...}`, `entering={...}` layout transitions affecting `width`/`height`/`flex`
   - **Result**: NOT Migratable (Reason: "Layout property animations not supported by native platform Animators").

8. **Unsupported Property Check**:
   - Properties outside: `opacity`, `translateX`, `translateY`, `scale`, `scaleX`, `scaleY`, `rotate`, `rotateX`, `rotateY`, `borderRadius`, `backgroundColor`, `borderWidth`, `borderColor`, `shadowOpacity`, `shadowRadius`, `shadowColor`, `shadowOffset`, `elevation`
   - **Result**: NOT Migratable (Reason: "Animates unsupported property").

9. **State-Driven Timing / Spring Animations**:
   - Driven by React state / props with supported properties.
   - **Result**: MIGRATABLE.

---

## 2. API Pattern Equivalence Table

| Reanimated / Animated Pattern | `react-native-ease` Equivalent |
| :--- | :--- |
| `useSharedValue(v)` + `useAnimatedStyle(() => ({ opacity: val.value }))` | `<EaseView animate={{ opacity: val }} />` |
| `withTiming(target, { duration, easing })` | `transition={{ type: 'timing', duration, easing }}` |
| `withSpring(target, { damping, stiffness, mass })` | `transition={{ type: 'spring', damping, stiffness, mass }}` |
| `withDelay(ms, animation)` | Add `delay: ms` to `transition` config |
| `entering={FadeIn}` | `initialAnimate={{ opacity: 0 }}` + `animate={{ opacity: 1 }}` |
| `entering={FadeInDown}` | `initialAnimate={{ opacity: 0, translateY: 50 }}` + `animate={{ opacity: 1, translateY: 0 }}` |
| `entering={SlideInRight}` | `initialAnimate={{ translateX: 300 }}` + `animate={{ translateX: 0 }}` |
| `entering={ZoomIn}` | `initialAnimate={{ scale: 0 }}` + `animate={{ scale: 1 }}` |
| `withRepeat(anim, -1, false)` | `transition={{ type: 'timing', loop: 'repeat' }}` |
| `withRepeat(anim, -1, true)` | `transition={{ type: 'timing', loop: 'reverse' }}` |

---

## 3. Easing Mapping

| Reanimated / Web Easing | `react-native-ease` Easing |
| :--- | :--- |
| `Easing.linear` | `'linear'` |
| `Easing.ease` / `Easing.inOut(Easing.ease)` | `'easeInOut'` |
| `Easing.in(Easing.ease)` | `'easeIn'` |
| `Easing.out(Easing.ease)` | `'easeOut'` |
| `Easing.bezier(x1, y1, x2, y2)` | `[x1, y1, x2, y2]` |
