import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 650,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

  const displayName = userName && userName.trim() ? userName.trim() : 'friend';

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.bg }]}
      onPress={onContinue}
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

        {/* Subtle Bottom 'tap to continue ➔' indicator */}
        <View style={styles.footerContainer} pointerEvents="none">
          <View style={styles.continueButton}>
            <Text style={[styles.continueText, { color: theme.textPrimary }]}>tap to continue ➔</Text>
          </View>
        </View>
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
