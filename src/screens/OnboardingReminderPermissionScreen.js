import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

// Inject 60fps/120fps GPU Hardware-Accelerated Smooth CSS Keyframe for Web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'studpal-bell-swing-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes studpalBellSmoothSwing {
        0% {
          transform: rotate(0deg);
        }
        25% {
          transform: rotate(12deg);
        }
        75% {
          transform: rotate(-12deg);
        }
        100% {
          transform: rotate(0deg);
        }
      }
      .studpal-bell-swing {
        transform-origin: 50% 18% !important;
        animation: studpalBellSmoothSwing 2.6s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite !important;
        will-change: transform !important;
        backface-visibility: hidden !important;
        -webkit-font-smoothing: subpixel-antialiased !important;
      }
    `;
    document.head.appendChild(style);
  }
}

function RealisticRingingBell({ size = 180, swingAnim }) {
  // Ultra-smooth 16-point sinusoidal harmonic curve for Native (iOS/Android)
  const bellRotation = swingAnim.interpolate({
    inputRange: [
      0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375,
      0.5, 0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375, 1,
    ],
    outputRange: [
      '0deg', '4.6deg', '8.5deg', '11.1deg', '12deg', '11.1deg', '8.5deg', '4.6deg',
      '0deg', '-4.6deg', '-8.5deg', '-11.1deg', '-12deg', '-11.1deg', '-8.5deg', '-4.6deg', '0deg',
    ],
  });

  const isWeb = Platform.OS === 'web';

  const bellContent = (
    <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      <Defs>
        {/* Main 3D Bell Gradient */}
        <LinearGradient id="bellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#3B82F6" />
          <Stop offset="50%" stopColor="#1E40AF" />
          <Stop offset="100%" stopColor="#1200C6" />
        </LinearGradient>

        {/* Highlight Sheen */}
        <LinearGradient id="highlightGrad" x1="0%" y1="0%" x2="100%" y2="50%">
          <Stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </LinearGradient>

        {/* Badge Gradient */}
        <LinearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#60A5FA" />
          <Stop offset="100%" stopColor="#1D4ED8" />
        </LinearGradient>
      </Defs>

      {/* Clapper / Bottom Hemisphere */}
      <Path
        d="M 68 116 C 68 126 73 134 80 134 C 87 134 92 126 92 116 Z"
        fill="#1200C6"
      />

      {/* Main Bell Body */}
      <Path
        d="M 80 28 
           C 60 28 48 44 46 72 
           C 44 94 34 102 24 108 
           C 20 110 24 116 32 116 
           L 128 116 
           C 136 116 140 110 136 108 
           C 126 102 116 94 114 72 
           C 112 44 100 28 80 28 Z"
        fill="url(#bellGrad)"
      />

      {/* Bell Highlight Sheen */}
      <Path
        d="M 80 32 
           C 64 32 54 46 52 72 
           C 50 90 42 98 35 106 
           L 80 106 
           L 80 32 Z"
        fill="url(#highlightGrad)"
      />

      {/* Notification Dot / Badge */}
      <Circle cx="114" cy="38" r="16" fill="#FFFFFF" />
      <Circle cx="114" cy="38" r="12" fill="url(#badgeGrad)" />
      <Circle cx="114" cy="38" r="5" fill="#FFFFFF" />
    </Svg>
  );

  if (isWeb) {
    return (
      <View
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="studpal-bell-swing" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {bellContent}
        </div>
      </View>
    );
  }

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [
            { translateY: -size * 0.32 },
            { rotate: bellRotation },
            { translateY: size * 0.32 },
          ],
        }}
      >
        {bellContent}
      </Animated.View>
    </View>
  );
}

export default function OnboardingReminderPermissionScreen({
  onContinue,
  onSkip,
  onBack,
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const swingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance Fade
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    // 2. Single Continuous Linear Loop (No JS sequence hitching)
    const swingAnimation = Animated.loop(
      Animated.timing(swingAnim, {
        toValue: 1,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    swingAnimation.start();

    return () => {
      swingAnimation.stop();
    };
  }, [fadeAnim, swingAnim]);

  const handleEnable = () => {
    if (onContinue) {
      onContinue(true);
    }
  };

  const handleNotNow = () => {
    if (onSkip) {
      onSkip();
    } else if (onContinue) {
      onContinue(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {/* Heading Block */}
          <View style={styles.headerBlock}>
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>
              want StudPal to remind you{'\n'}
              <Text style={[styles.boldTitlePart, { color: theme.textPrimary }]}>when it's time to study?</Text>
            </Text>

            <Text style={[styles.subtextNote, { color: theme.textSecondary }]}>
              We'll use your study schedule to{'\n'}send helpful reminders.
            </Text>
          </View>

          {/* Center Smooth Realistic Swinging Bell */}
          <View style={styles.graphicContainer}>
            <RealisticRingingBell size={180} swingAnim={swingAnim} />
          </View>

          {/* Bottom Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleEnable}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>turn on reminders</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerBlock: {
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 0,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#0F172A',
    lineHeight: 33,
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 12,
  },
  boldTitlePart: {
    fontWeight: '800',
    color: '#0F172A',
  },
  subtextNote: {
    fontSize: 15.5,
    fontWeight: '400',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  graphicContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 4,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#1200C6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
