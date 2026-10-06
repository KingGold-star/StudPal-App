import { useRef } from 'react';
import { PanResponder } from 'react-native';

/**
 * Custom hook for detecting intentional vertical swipe gestures (Swipe Up / Swipe Down)
 * on input composer areas without interfering with normal taps, typing, or button clicks.
 *
 * @param {Object} options
 * @param {Function} options.onSwipeUp - Callback when user swipes upward deliberately
 * @param {Function} options.onSwipeDown - Callback when user swipes downward deliberately
 * @param {number} [options.activeOffsetY=48] - Min vertical offset threshold
 * @param {number} [options.failOffsetX=32] - Max horizontal offset tolerance
 * @param {number} [options.minTranslationY=48] - Min vertical translation required to trigger swipe
 */
export function useSwipeFocusGesture({
  onSwipeUp,
  onSwipeDown,
  activeOffsetY = 48,
  failOffsetX = 32,
  minTranslationY = 48,
}) {
  const panResponder = useRef(
    PanResponder.create({
      // Allow taps to fall through to child buttons/inputs on touch down
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,

      // Only claim gesture if user performs a distinct vertical drag
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        // Reject if movement is too small or primarily horizontal
        if (absDy < 12 || absDx > failOffsetX || absDx > absDy * 0.8) {
          return false;
        }

        return absDy >= 16;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDy < 12 || absDx > failOffsetX || absDx > absDy * 0.8) {
          return false;
        }

        return absDy >= 16;
      },

      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const absDx = Math.abs(dx);

        // Check horizontal boundary threshold
        if (absDx > failOffsetX) {
          return;
        }

        if (dy <= -minTranslationY) {
          onSwipeUp?.();
        } else if (dy >= minTranslationY) {
          onSwipeDown?.();
        }
      },
      onPanResponderTerminate: () => {},
    })
  ).current;

  return panResponder;
}
