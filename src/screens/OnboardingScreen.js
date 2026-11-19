import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  StatusBar,
  Animated,
  Platform,
  Dimensions,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

const { width, height } = Dimensions.get('window');
const heyGraphic = require('../../assets/images/hey_3d_graphic.png');

export default function OnboardingScreen({ onContinue }) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Horizontal swipe gesture detection
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -40 || gestureState.vx < -0.3) {
          onContinue && onContinue();
        }
      },
    })
  ).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 45,
        friction: 7.5,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    // Gentle floating breathing loop
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1800,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    floatLoop.start();

    return () => {
      floatLoop.stop();
    };
  }, [fadeAnim, scaleAnim, floatAnim]);

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.bg }]}
      onPress={onContinue}
      activeOpacity={0.98}
      {...panResponder.panHandlers}
    >
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      {/* Background Vector Glow Layer (Absolute, non-intrusive) */}
      <View style={styles.ambientBg} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient
              id="topLeftGlow"
              cx="15%"
              cy="15%"
              r="60%"
              fx="15%"
              fy="15%"
            >
              <Stop offset="0%" stopColor="#4378FF" stopOpacity={isDark ? "0.20" : "0.25"} />
              <Stop offset="50%" stopColor="#6C9BFF" stopOpacity={isDark ? "0.08" : "0.10"} />
              <Stop offset="100%" stopColor={theme.bg} stopOpacity="0" />
            </RadialGradient>

            <RadialGradient
              id="bottomRightGlow"
              cx="85%"
              cy="85%"
              r="60%"
              fx="85%"
              fy="85%"
            >
              <Stop offset="0%" stopColor="#3B71FE" stopOpacity={isDark ? "0.22" : "0.28"} />
              <Stop offset="50%" stopColor="#6E9DFF" stopOpacity={isDark ? "0.09" : "0.12"} />
              <Stop offset="100%" stopColor={theme.bg} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <Rect x="0" y="0" width="100%" height="100%" fill={theme.bg} />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#topLeftGlow)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bottomRightGlow)" />
        </Svg>
      </View>

      {/* Main Safe Content Structure */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        {/* Top spacer to balance layout */}
        <View style={styles.topSpacer} />

        {/* Central 3D Hey Graphic Element */}
        <View style={styles.centerContainer} pointerEvents="none">
          {/* Dynamic Ground Contact Shadow (Floor anchored, breathes smoothly with float) */}
          <Animated.View
            style={[
              styles.groundShadowWrapper,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    scaleX: floatAnim.interpolate({
                      inputRange: [-8, 0],
                      outputRange: [0.93, 1],
                    }),
                  },
                  {
                    scaleY: floatAnim.interpolate({
                      inputRange: [-8, 0],
                      outputRange: [0.86, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Svg width={graphicSize * 0.72} height={graphicSize * 0.16} viewBox="0 0 240 44">
              <Defs>
                <RadialGradient id="heyGroundShadow" cx="50%" cy="50%" r="50%">
                  <Stop
                    offset="0%"
                    stopColor={isDark ? '#000000' : '#0F172A'}
                    stopOpacity={isDark ? '0.70' : '0.18'}
                  />
                  <Stop
                    offset="45%"
                    stopColor={isDark ? '#050D1F' : '#334155'}
                    stopOpacity={isDark ? '0.35' : '0.08'}
                  />
                  <Stop
                    offset="75%"
                    stopColor={isDark ? '#1E3A8A' : '#64748B'}
                    stopOpacity={isDark ? '0.12' : '0.02'}
                  />
                  <Stop
                    offset="100%"
                    stopColor={theme.bg}
                    stopOpacity="0"
                  />
                </RadialGradient>
              </Defs>
              <Rect x="0" y="0" width="240" height="44" fill="url(#heyGroundShadow)" />
            </Svg>
          </Animated.View>

          {/* Floating 3D Logo */}
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: floatAnim },
                ],
              },
            ]}
          >
            <Image
              source={heyGraphic}
              style={styles.heyImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Bottom Controls: Tap to Continue Prompt */}
        <Animated.View
          style={[
            styles.bottomContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.swipePromptRow}>
            <Text style={[styles.swipeText, { color: isDark ? '#60A5FA' : theme.accent }]}>Tap to continue</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </Pressable>
  );
}

const graphicSize = Math.min(width * 0.82, height * 0.42, 340);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  ambientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  topSpacer: {
    height: 20,
    width: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  groundShadowWrapper: {
    position: 'absolute',
    top: '50%',
    marginTop: graphicSize * 0.28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  imageWrapper: {
    width: graphicSize,
    height: graphicSize,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  heyImage: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 24 : 20,
  },
  swipePromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  swipeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1200C6',
    letterSpacing: -0.2,
  },
});
