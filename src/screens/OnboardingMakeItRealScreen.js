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

export default function OnboardingMakeItRealScreen({ onContinue, onBack }) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 550,
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
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Centered Main Statement */}
          <View style={styles.centerSection}>
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>
              then let's{'\n'}make it real.
            </Text>

            <Text style={[styles.subtextNote, { color: theme.textSecondary }]}>
              your plan is ready. now we{'\n'}turn it into progress.
            </Text>
          </View>

          {/* Bottom Footer Button */}
          <TouchableOpacity
            style={styles.footerButton}
            onPress={onContinue}
            activeOpacity={0.7}
          >
            <Text style={[styles.footerButtonText, { color: theme.textPrimary }]}>tap to continue ➔</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: -30, // Visual center compensation
  },
  titleText: {
    fontSize: 44,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 50,
    textAlign: 'center',
    letterSpacing: -1.4,
    marginBottom: 16,
  },
  subtextNote: {
    fontSize: 18,
    fontWeight: '400',
    color: '#1E293B',
    lineHeight: 26,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  footerButton: {
    alignSelf: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.1,
  },
});
