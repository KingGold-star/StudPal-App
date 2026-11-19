// src/components/BrancoTypingBubble.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image, Platform } from 'react-native';

const USE_NATIVE = Platform.OS !== 'web';

// Research-specific thinking phrases (active only when genuine multi-source web research is in flight)
export const RESEARCH_PHRASES = [
  'Searching public sources',
  'Researching multiple sources',
  'Reading and extracting webpage content',
  'Synthesizing findings across sources',
  'Verifying citations',
];

// General reasoning phrases (never shown for simple casual greetings or help requests)
export const THINKING_PHRASES = [
  'Thinking',
  'Reasoning step-by-step',
];

const DEFAULT_PHRASE = 'Thinking';

/**
 * BrancoTypingBubble
 * Renders an animated typing/thinking indicator showing Branco's circular avatar
 * alongside an intelligent pill bubble with three bouncing, staggered dots.
 * Displays clean "Thinking..." by default. Only displays research status when
 * actual live research is actively in flight.
 */
export default function BrancoTypingBubble({ isDark = true, statusText = null }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(1)).current;

  // Animate text fade when status changes
  useEffect(() => {
    Animated.sequence([
      Animated.timing(textFadeAnim, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: USE_NATIVE,
      }),
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: USE_NATIVE,
      }),
    ]).start();
  }, [statusText]);

  useEffect(() => {
    // Smooth fade in on appear
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: USE_NATIVE,
    }).start();

    // Staggered bounce sequence for the 3 dots
    const createBounceAnimation = (dotAnim, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dotAnim, {
            toValue: -5,
            duration: 240,
            useNativeDriver: USE_NATIVE,
          }),
          Animated.timing(dotAnim, {
            toValue: 0,
            duration: 240,
            useNativeDriver: USE_NATIVE,
          }),
          Animated.delay(Math.max(0, 480 - delay)),
        ])
      );
    };

    const anim1 = createBounceAnimation(dot1, 0);
    const anim2 = createBounceAnimation(dot2, 160);
    const anim3 = createBounceAnimation(dot3, 320);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const dotColor = isDark ? '#94A3B8' : '#64748B';
  const textColor = isDark ? '#CBD5E1' : '#475569';
  const bubbleBg = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E6E9EE';

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* ── Animated Thinking Pill ── */}
      <View style={[styles.bubblePill, { backgroundColor: bubbleBg }]}>
        <Animated.Text style={[styles.thinkingText, { color: textColor, opacity: textFadeAnim }]}>
          {statusText || DEFAULT_PHRASE}
        </Animated.Text>
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: dotColor,
              transform: [{ translateY: dot1 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: dotColor,
              transform: [{ translateY: dot2 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: dotColor,
              transform: [{ translateY: dot3 }],
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    marginHorizontal: 4,
  },
  avatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  bubblePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 5,
    alignSelf: 'flex-start',
  },
  thinkingText: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 2,
    letterSpacing: 0.2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
