import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

export default function OnboardingConsiderScreen({ onContinue, userName = 'friend' }) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasContinuedRef = useRef(false);
  const onContinueRef = useRef(onContinue);

  useEffect(() => {
    onContinueRef.current = onContinue;
  }, [onContinue]);

  const handleContinue = () => {
    if (hasContinuedRef.current) return;
    hasContinuedRef.current = true;
    if (onContinueRef.current) {
      onContinueRef.current();
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 650,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    // Auto-advance to the next screen after 1.5 seconds (1500ms)
    const timer = setTimeout(() => {
      handleContinue();
    }, 1500);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  const displayName = userName && userName.trim() ? userName.trim() : 'friend';

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.bg }]}
      onPress={handleContinue}
      activeOpacity={0.98}
    >
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']} pointerEvents="box-none">
        {/* Centered Main Copy with Smooth Entrance Animation */}
        <Animated.View
          style={[
            styles.centerWrapper,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <Text style={[styles.lineOne, { color: theme.textPrimary }]}>alright {displayName},</Text>
          <Text style={[styles.lineTwo, { color: theme.textPrimary }]}>consider this ...</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  lineOne: {
    fontSize: 22,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  lineTwo: {
    fontSize: 22,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
});
