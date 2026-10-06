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

export default function OnboardingValueScreen({ onContinue }) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.bg }]}
      onPress={onContinue}
      activeOpacity={0.98}
    >
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']} pointerEvents="box-none">
        {/* Content Section with Smooth Fade & Subtle Lift */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          {/* Main Statement Block */}
          <View style={styles.topTextBlock}>
            <Text style={[styles.mainText, { color: theme.textPrimary }]}>
              StudPal helps you achieve{'\n'}
              your <Text style={[styles.brandAccent, { color: theme.accent }]}>DESIRE</Text> ?
            </Text>
          </View>

          {/* Simple Everyday Rule Block */}
          <View style={styles.bottomTextBlock}>
            <Text style={[styles.mainText, { color: theme.textPrimary }]}>
              It’s <Text style={[styles.brandAccent, { color: theme.accent }]}>SIMPLE</Text>{'\n'}
              Everyday{'\n'}
              you <Text style={[styles.brandAccent, { color: theme.accent }]}>READ</Text> to open your apps
            </Text>
          </View>
        </Animated.View>

        {/* Bottom-right 'tap to continue ➔' indicator */}
        <View style={styles.footerContainer} pointerEvents="none">
          <View style={styles.continueButton}>
            <Text style={[styles.continueText, { color: theme.textSecondary }]}>Tap to continue ➔</Text>
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
    paddingHorizontal: 30,
    paddingVertical: 24,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 70,
  },
  topTextBlock: {
    marginBottom: 46,
  },
  bottomTextBlock: {
    marginBottom: 24,
  },
  mainText: {
    fontSize: 23,
    fontWeight: '400',
    color: '#111827',
    lineHeight: 35,
    letterSpacing: -0.3,
  },
  brandAccent: {
    color: '#1200C6',
    fontWeight: '800',
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
    opacity: 0.9,
  },
});
