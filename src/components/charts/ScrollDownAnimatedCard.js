// src/components/charts/ScrollDownAnimatedCard.js
// Reusable component providing a smooth, responsive entrance animation
// Supports scroll-triggered re-animation when visible in viewport

import React, { useEffect, useRef } from "react";
import { Animated, Easing, Platform } from "react-native";

const USE_NATIVE = Platform.OS !== "web";

export default function ScrollDownAnimatedCard({
  children,
  delay = 0,
  duration = 900,
  initialY = -20,
  style,
  isVisible = true,
}) {
  const translateY = useRef(new Animated.Value(isVisible ? 0 : initialY)).current;
  const opacity = useRef(new Animated.Value(isVisible ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: duration,
          delay: delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration,
          delay: delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: duration,
          delay: delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: USE_NATIVE,
        }),
      ]).start();
    } else {
      translateY.stopAnimation();
      opacity.stopAnimation();
      scale.stopAnimation();
      translateY.setValue(initialY);
      opacity.setValue(0);
      scale.setValue(0.98);
    }
  }, [isVisible]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
