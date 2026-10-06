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

export default function OnboardingPlanOfferScreen({ onContinue, onBack }) {
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

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.bg }]}
      onPress={onContinue}
      activeOpacity={0.98}
    >
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']} pointerEvents="box-none">
        {/* Main plan proposition content */}
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
          {/* Section 1: You don't need more hours */}
          <View style={styles.textSection}>
            <Text style={[styles.mainText, { color: theme.textPrimary }]}>You don't need more hours</Text>
          </View>

          {/* Section 2: Few minutes inquiry */}
          <View style={styles.textSection}>
            <Text style={[styles.mainText, { color: theme.textPrimary }]}>
              Do you have <Text style={[styles.brandAccent, { color: theme.accent }]}>A FEW MINUTES</Text> to work{'\n'}
              toward your <Text style={[styles.brandAccent, { color: theme.accent }]}>GOAL</Text> every day?
            </Text>
          </View>

          {/* Section 3: Let's build a plan */}
          <View style={styles.textSection}>
            <Text style={[styles.mainText, { color: theme.textPrimary }]}>
              Let's build a plan for <Text style={[styles.brandAccent, { color: theme.accent }]}>YOU</Text>
            </Text>
          </View>
        </Animated.View>

        {/* Bottom-right tap to continue */}
        <View style={styles.footerContainer} pointerEvents="none">
          <View style={styles.continueButton}>
            <Text style={[styles.continueText, { color: theme.textPrimary }]}>Tap to continue ➔</Text>
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
  contentContainer: {
    flex: 1,
    paddingTop: 68,
    gap: 32,
  },
  textSection: {
    marginBottom: 8,
  },
  mainText: {
    fontSize: 22,
    fontWeight: '400',
    color: '#0F172A',
    lineHeight: 33,
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
    color: '#0F172A',
    letterSpacing: 0.2,
    opacity: 0.9,
  },
});
