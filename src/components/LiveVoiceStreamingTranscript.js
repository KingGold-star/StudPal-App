import React, { useState, useEffect, useRef, memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Animated,
  Easing,
  Platform,
} from 'react-native';

// ── Micro Sound Waveform Indicator ──────────────────────────────────────────
const LiveAudioWave = ({ color = '#38BDF8' }) => {
  const bar1 = useRef(new Animated.Value(0.3)).current;
  const bar2 = useRef(new Animated.Value(0.6)).current;
  const bar3 = useRef(new Animated.Value(0.4)).current;
  const bar4 = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const createAnim = (val, duration, min, max) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: max,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: min,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const a1 = createAnim(bar1, 260, 0.25, 1.0);
    const a2 = createAnim(bar2, 320, 0.35, 0.95);
    const a3 = createAnim(bar3, 240, 0.2, 1.0);
    const a4 = createAnim(bar4, 360, 0.3, 0.9);

    a1.start();
    a2.start();
    a3.start();
    a4.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
      a4.stop();
    };
  }, [bar1, bar2, bar3, bar4]);

  return (
    <View style={styles.audioWaveContainer}>
      {[bar1, bar2, bar3, bar4].map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.audioWaveBar,
            {
              backgroundColor: color,
              transform: [{ scaleY: anim }],
            },
          ]}
        />
      ))}
    </View>
  );
};

// ── Bouncing Dots for Thinking State ─────────────────────────────────────────
const BouncingThinkingDots = ({ color = '#F59E0B' }) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -4,
            duration: 220,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 220,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(260 - delay),
        ])
      );
    };

    const a1 = animateDot(dot1, 0);
    const a2 = animateDot(dot2, 110);
    const a3 = animateDot(dot3, 220);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.bouncingDotsContainer}>
      {[dot1, dot2, dot3].map((dot, idx) => (
        <Animated.View
          key={idx}
          style={[
            styles.bouncingDot,
            {
              backgroundColor: color,
              transform: [{ translateY: dot }],
            },
          ]}
        />
      ))}
    </View>
  );
};

// ── Soft Breathing Pulse Dot for Listening State ─────────────────────────────
const BreathingPulseDot = ({ color = '#10B981' }) => {
  const pulse = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.0,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        styles.breathingDot,
        {
          backgroundColor: color,
          opacity: pulse,
          transform: [{ scale: pulse }],
        },
      ]}
    />
  );
};

// ── Main Streaming Transcript Component ─────────────────────────────────────
const LiveVoiceStreamingTranscript = ({
  userTranscript = '',
  aiTranscript = '',
  state = 'listening', // 'listening' | 'thinking' | 'speaking' | 'muted'
  isDark = true,
  accentColor = '#2D62FF',
  isMuted = false,
}) => {
  const scrollRef = useRef(null);
  // Smooth cross-fade animation when switching speaker / modes
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const prevModeRef = useRef('');

  // Determine active speaker mode
  const currentMode = aiTranscript
    ? 'ai'
    : state === 'thinking'
    ? 'thinking'
    : userTranscript
    ? 'user'
    : isMuted
    ? 'muted'
    : 'listening';

  // Trigger snappy crossfade on mode change
  useEffect(() => {
    if (prevModeRef.current !== currentMode) {
      prevModeRef.current = currentMode;
      fadeAnim.setValue(0.7);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [currentMode, fadeAnim]);

  // Auto-scroll whenever AI or user transcript updates
  useEffect(() => {
    if (aiTranscript || userTranscript) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [aiTranscript, userTranscript]);

  // Color scheme definitions
  const badgeColor =
    currentMode === 'ai'
      ? '#38BDF8'
      : currentMode === 'thinking'
      ? '#F59E0B'
      : currentMode === 'user'
      ? '#A855F7'
      : currentMode === 'muted'
      ? '#EF4444'
      : '#10B981';

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark
            ? 'rgba(15, 23, 42, 0.5)'
            : 'rgba(241, 245, 249, 0.7)',
          borderWidth: 0,
          borderColor: 'transparent',
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0.4, 1],
                outputRange: [5, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* ── Top Status Header Pill ── */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: isDark
                ? `${badgeColor}18`
                : `${badgeColor}12`,
            },
          ]}
        >
          {currentMode === 'ai' && <LiveAudioWave color={badgeColor} />}
          {currentMode === 'thinking' && <BouncingThinkingDots color={badgeColor} />}
          {currentMode === 'user' && <BreathingPulseDot color={badgeColor} />}
          {currentMode === 'listening' && <BreathingPulseDot color={badgeColor} />}
          {currentMode === 'muted' && <View style={[styles.mutedStaticDot, { backgroundColor: badgeColor }]} />}

          <Text style={[styles.statusPillText, { color: badgeColor }]}>
            {currentMode === 'ai'
              ? 'BRANCO'
              : currentMode === 'thinking'
              ? 'THINKING'
              : currentMode === 'user'
              ? 'YOU'
              : currentMode === 'muted'
              ? 'MUTED'
              : 'LISTENING'}
          </Text>
        </View>
      </View>

      {/* ── Subtitle / Transcript Scroll View ── */}
      <ScrollView
        ref={scrollRef}
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentMode === 'ai' ? (
          <Text
            style={[
              styles.transcriptText,
              { color: isDark ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            {aiTranscript}
          </Text>
        ) : currentMode === 'thinking' ? (
          <View style={styles.thinkingContainer}>
            {userTranscript ? (
              <Text
                style={[
                  styles.userQueryPreviewText,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
                numberOfLines={2}
              >
                “{userTranscript}”
              </Text>
            ) : null}
            <Text
              style={[
                styles.transcriptText,
                { color: isDark ? '#E2E8F0' : '#334155', fontStyle: 'italic' },
              ]}
            >
              Branco is thinking...
            </Text>
          </View>
        ) : currentMode === 'user' ? (
          <Text
            style={[
              styles.transcriptText,
              { color: isDark ? '#F1F5F9' : '#1E293B' },
            ]}
          >
            “{userTranscript}”
            <Text style={{ color: '#A855F7', fontWeight: '700' }}> ●</Text>
          </Text>
        ) : currentMode === 'muted' ? (
          <Text
            style={[
              styles.transcriptPlaceholder,
              { color: isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            Microphone is muted — tap the mic icon to speak
          </Text>
        ) : (
          <Text
            style={[
              styles.transcriptPlaceholder,
              { color: isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            Go ahead, I'm listening...
          </Text>
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '92%',
    alignSelf: 'center',
    minHeight: 84,
    maxHeight: 140,
    borderRadius: 22,
    borderWidth: 0,
    borderColor: 'transparent',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    marginBottom: 16,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 6,
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  transcriptText: {
    fontSize: 15.5,
    lineHeight: 23,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  transcriptPlaceholder: {
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: '400',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  thinkingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  userQueryPreviewText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '400',
  },

  // Micro wave indicator
  audioWaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,
    height: 12,
  },
  audioWaveBar: {
    width: 2.5,
    height: 10,
    borderRadius: 2,
  },

  // Bouncing dots
  bouncingDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 10,
  },
  bouncingDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
  },

  // Breathing pulse dot
  breathingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  mutedStaticDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default memo(LiveVoiceStreamingTranscript);
