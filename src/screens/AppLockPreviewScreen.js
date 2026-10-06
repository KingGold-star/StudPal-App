import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

const snapchatLogo = require('../../assets/images/snapchat_logo.png');

// --- Precise App Icons Matching the Reference Design ---

function InstagramIcon({ size = 72 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 72 72">
      <Defs>
        <LinearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#FFD600" />
          <Stop offset="25%" stopColor="#FF7A00" />
          <Stop offset="50%" stopColor="#FF0069" />
          <Stop offset="75%" stopColor="#D300C5" />
          <Stop offset="100%" stopColor="#7638FA" />
        </LinearGradient>
      </Defs>
      <Rect width="72" height="72" rx="18" fill="url(#igGradient)" />
      <Rect x="16" y="16" width="40" height="40" rx="11" fill="none" stroke="#FFFFFF" strokeWidth="3.8" />
      <Circle cx="36" cy="36" r="9.5" fill="none" stroke="#FFFFFF" strokeWidth="3.8" />
      <Circle cx="47.5" cy="24.5" r="2.6" fill="#FFFFFF" />
    </Svg>
  );
}

function TikTokIcon({ size = 72 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 72 72">
      <Rect width="72" height="72" rx="18" fill="#000000" />
      {/* Cyan shadow */}
      <Path
        d="M47 28.2c-3.2-.4-6-2.1-7.4-4.8v15.2a11.2 11.2 0 1 1-11.2-11.2c.6 0 1.2 0 1.8.2v6.2a5.4 5.4 0 1 0 3.6 5.1V14.5h5.8a10.8 10.8 0 0 0 7.4 6.8v6.9z"
        fill="#25F4EE"
        transform="translate(-1.2, -1.2)"
      />
      {/* Red shadow */}
      <Path
        d="M47 28.2c-3.2-.4-6-2.1-7.4-4.8v15.2a11.2 11.2 0 1 1-11.2-11.2c.6 0 1.2 0 1.8.2v6.2a5.4 5.4 0 1 0 3.6 5.1V14.5h5.8a10.8 10.8 0 0 0 7.4 6.8v6.9z"
        fill="#FE2C55"
        transform="translate(1.2, 1.2)"
      />
      {/* White main */}
      <Path
        d="M47 28.2c-3.2-.4-6-2.1-7.4-4.8v15.2a11.2 11.2 0 1 1-11.2-11.2c.6 0 1.2 0 1.8.2v6.2a5.4 5.4 0 1 0 3.6 5.1V14.5h5.8a10.8 10.8 0 0 0 7.4 6.8v6.9z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

function SnapchatIcon({ size = 72 }) {
  return (
    <Image
      source={snapchatLogo}
      style={{
        width: size,
        height: size,
        borderRadius: 18,
      }}
      resizeMode="cover"
    />
  );
}

function XIcon({ size = 72 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 72 72">
      <Rect width="72" height="72" rx="18" fill="#000000" />
      <Path
        d="M45.5 22h5.1L39.4 34.8 52.6 52H42.3L34.2 41.5 25 52H19.9l11.9-13.6L19 22h10.6l7.3 9.6L45.5 22zm-1.8 27h2.8L28.8 24.8h-3L43.7 49z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

// --- Padlock Badge Overlay for Blocked State ---
function PadlockOverlay({ size = 26 }) {
  return (
    <View style={styles.padlockBadge}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="9.5" width="16" height="11.5" rx="3" fill="#FFFFFF" />
        <Path
          d="M7 9.5V6a5 5 0 0 1 10 0v3.5"
          stroke="#FFFFFF"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <Circle cx="12" cy="15.2" r="1.6" fill="#0F172A" />
      </Svg>
    </View>
  );
}

export default function AppLockPreviewScreen({ onContinue }) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  // Header text fade-in and lift animation
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const continueFadeAnim = useRef(new Animated.Value(0)).current;

  // Staggered stack drop animation drivers (Left to Right: Instagram, TikTok, Snapchat, X)
  const dropAnim0 = useRef(new Animated.Value(0)).current;
  const dropAnim1 = useRef(new Animated.Value(0)).current;
  const dropAnim2 = useRef(new Animated.Value(0)).current;
  const dropAnim3 = useRef(new Animated.Value(0)).current;

  // State: isBlocked starts false (unlocked), then after drop locks to true (blocked)
  const [isBlocked, setIsBlocked] = useState(false);
  // Screen is not skippable until after the unlock sequence finishes
  const [canContinue, setCanContinue] = useState(false);

  // Lock/Unlock state transition animation driver
  const animTransition = useRef(new Animated.Value(1)).current;

  // Screen mount: Header fades in with lift & App icons perform stack drop from left to right
  useEffect(() => {
    Animated.parallel([
      // 1. Smooth Fade In for Header Text
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: Platform.OS !== 'web',
      }),
      // 2. Sequential stack drop from left to right with spring bounce
      Animated.stagger(120, [
        Animated.spring(dropAnim0, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(dropAnim1, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(dropAnim2, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(dropAnim3, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    ]).start();
  }, []);

  // Automatic lock and unlock repeating cycle:
  // 1. Initial entrance: starts unlocked, stack drops in
  // 2. At 1.2s: Locks to Blocked state (~50% opacity + padlocks) for 3s
  // 3. At 4.2s: Unlocks back to Open state
  // 4. At 4.7s (first unlock complete): Enables tap-to-continue
  // 5. Loops continuously: stays unlocked for ~2.5s, locks for 3s, unlocks, and repeats
  useEffect(() => {
    let isMounted = true;
    let timerId = null;

    const runCycle = (isInitial = false) => {
      const delayBeforeLock = isInitial ? 1200 : 2500;

      timerId = setTimeout(() => {
        if (!isMounted) return;
        setIsBlocked(true); // Lock

        timerId = setTimeout(() => {
          if (!isMounted) return;
          setIsBlocked(false); // Unlock

          if (isInitial) {
            timerId = setTimeout(() => {
              if (!isMounted) return;
              setCanContinue(true); // Enable skipping after first unlock
              runCycle(false); // Begin repeating cycle
            }, 500);
          } else {
            runCycle(false); // Continue repeating cycle
          }
        }, 3000); // Locked duration (3 seconds)
      }, delayBeforeLock);
    };

    runCycle(true);

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    if (canContinue) {
      Animated.timing(continueFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [canContinue]);

  useEffect(() => {
    Animated.timing(animTransition, {
      toValue: isBlocked ? 0 : 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [isBlocked]);

  // Drop transformation helper for each icon
  const getDropStyle = (anim) => ({
    opacity: anim.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [0, 0.85, 1],
    }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-64, 0],
        }),
      },
      {
        scale: anim.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [0.7, 1.06, 1.0],
        }),
      },
    ],
  });

  // Interpolated animated styles: 50% (0.5) opacity when blocked, 100% (1.0) when unlocked
  const iconOpacity = animTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.0],
  });

  const iconScale = animTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.0],
  });

  const lockOpacity = animTransition.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.2, 0],
  });

  const lockScale = animTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.4],
  });

  const handlePress = () => {
    if (canContinue && onContinue) {
      onContinue();
    }
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.bg }]}
      onPress={handlePress}
      disabled={!canContinue}
      activeOpacity={canContinue ? 0.98 : 1}
    >
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']} pointerEvents="box-none">
        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Header Text Area with Smooth Fade-in & Subtle Lift */}
          <Animated.View
            style={[
              styles.headerTextArea,
              {
                opacity: headerFadeAnim,
                transform: [
                  {
                    translateY: headerFadeAnim.interpolate({
                       inputRange: [0, 1],
                       outputRange: [16, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.headline, { color: theme.textPrimary }]}>
              it’s <Text style={[styles.accentText, { color: theme.accent }]}>simple.</Text> when you{'\n'}study, we block your{'\n'}distractions
            </Text>
          </Animated.View>

          {/* Horizontal App Icons Row with Left-to-Right Stack Drop */}
          <View style={styles.iconsRowContainer}>
            <View style={styles.iconsRow}>
              {/* 1. Instagram (Drops 1st) */}
              <Animated.View style={[styles.appIconWrapper, getDropStyle(dropAnim0)]}>
                <Animated.View style={{ opacity: iconOpacity, transform: [{ scale: iconScale }] }}>
                  <InstagramIcon size={68} />
                </Animated.View>
                <Animated.View
                  style={[
                    styles.lockPositioner,
                    { opacity: lockOpacity, transform: [{ scale: lockScale }] },
                  ]}
                  pointerEvents="none"
                >
                  <PadlockOverlay size={26} />
                </Animated.View>
              </Animated.View>

              {/* 2. TikTok (Drops 2nd) */}
              <Animated.View style={[styles.appIconWrapper, getDropStyle(dropAnim1)]}>
                <Animated.View style={{ opacity: iconOpacity, transform: [{ scale: iconScale }] }}>
                  <TikTokIcon size={68} />
                </Animated.View>
                <Animated.View
                  style={[
                    styles.lockPositioner,
                    { opacity: lockOpacity, transform: [{ scale: lockScale }] },
                  ]}
                  pointerEvents="none"
                >
                  <PadlockOverlay size={26} />
                </Animated.View>
              </Animated.View>

              {/* 3. Snapchat (Drops 3rd) */}
              <Animated.View style={[styles.appIconWrapper, getDropStyle(dropAnim2)]}>
                <Animated.View style={{ opacity: iconOpacity, transform: [{ scale: iconScale }] }}>
                  <SnapchatIcon size={68} />
                </Animated.View>
                <Animated.View
                  style={[
                    styles.lockPositioner,
                    { opacity: lockOpacity, transform: [{ scale: lockScale }] },
                  ]}
                  pointerEvents="none"
                >
                  <PadlockOverlay size={26} />
                </Animated.View>
              </Animated.View>

              {/* 4. X (Drops 4th) */}
              <Animated.View style={[styles.appIconWrapper, getDropStyle(dropAnim3)]}>
                <Animated.View style={{ opacity: iconOpacity, transform: [{ scale: iconScale }] }}>
                  <XIcon size={68} />
                </Animated.View>
                <Animated.View
                  style={[
                    styles.lockPositioner,
                    { opacity: lockOpacity, transform: [{ scale: lockScale }] },
                  ]}
                  pointerEvents="none"
                >
                  <PadlockOverlay size={26} />
                </Animated.View>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* Bottom-right 'tap to continue ➔' indicator */}
        <Animated.View
          style={[
            styles.footerContainer,
            {
              opacity: continueFadeAnim,
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.continueButton}>
            <Text style={[styles.continueText, { color: theme.textPrimary }]}>tap to continue ➔</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  contentSection: {
    marginTop: 20,
    flex: 1,
  },
  headerTextArea: {
    marginBottom: 32,
    paddingHorizontal: 2,
  },
  headline: {
    fontSize: 31,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 40,
    letterSpacing: -0.8,
    textAlign: 'left',
  },
  accentText: {
    color: '#1200C6', // Brand Blue Accent
    fontWeight: '900',
  },
  iconsRowContainer: {
    paddingVertical: 12,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  appIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockPositioner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  padlockBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
  footerContainer: {
    alignItems: 'flex-end',
    paddingBottom: 12,
    paddingRight: 4,
  },
  continueButton: {
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  continueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: 0.2,
    opacity: 0.85,
  },
});
