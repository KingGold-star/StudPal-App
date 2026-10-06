// src/components/charts/ScrollDownAnimatedCard.js
// Reusable component providing a smooth, slow, one-time scrolldown entrance animation

import React, { useEffect, useRef } from "react";
import { Animated, Easing, Platform } from "react-native";

const USE_NATIVE = Platform.OS !== "web";

export default function ScrollDownAnimatedCard({
  children,
  delay = 0,
  duration = 1400,
  initialY = -35,
  style,
}) {
  const translateY = useRef(new Animated.Value(initialY)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.98)).current;
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

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
  }, []);

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
