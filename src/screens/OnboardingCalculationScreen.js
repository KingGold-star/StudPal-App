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

// Goal reference definitions to resolve goal IDs to human-readable names
const GOAL_LOOKUP = {
  exam: 'pass your exams',
  grades: 'improve your grades',
  college: 'prepare for university',
  learn: 'learn a new subject',
  habits: 'build daily study habits',
  waec: 'pass your exams',
  jamb: 'prepare for university',
};

export default function OnboardingCalculationScreen({
  onContinue,
  onBack,
  userName = 'Alex',
  phoneTime = '4–5 hours',
  targetData = { label: 'In 3 months', days: 90 },
  goal = null,
}) {
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

  // 1. User Name formatting
  const displayName = userName && typeof userName === 'string' && userName.trim()
    ? userName.trim()
    : 'Friend';

  // 2. Dynamic Calendar Days Calculation
  const calculateDaysUntilTarget = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!targetData) return 90;

    // A. Concrete Date object or ISO date string
    if (targetData.date) {
      const targetDate = new Date(targetData.date);
      const diffTime = targetDate.getTime() - today.getTime();
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    const label = typeof targetData === 'string'
      ? targetData
      : targetData.label || '';

    const lower = label.toLowerCase();

    // B. Relative period calculations using calendar dates
    if (lower.includes('1 month')) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      const diffTime = targetDate.getTime() - today.getTime();
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    if (lower.includes('3 month')) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
      const diffTime = targetDate.getTime() - today.getTime();
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    if (lower.includes('6 month')) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
      const diffTime = targetDate.getTime() - today.getTime();
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    if (lower.includes('year')) {
      const targetDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
      const diffTime = targetDate.getTime() - today.getTime();
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    if (lower.includes('exam')) {
      if (typeof targetData.days === 'number') return Math.max(0, targetData.days);
      return 60;
    }

    if (typeof targetData.days === 'number') {
      return Math.max(0, targetData.days);
    }

    return 90;
  };

  // 3. Dynamic Daily Phone Hours Parsing
  const parseDailyPhoneHours = () => {
    if (typeof phoneTime === 'number') return phoneTime;
    if (!phoneTime) return 4.5;

    const str = String(phoneTime).toLowerCase().trim();

    if (str.includes('less than 2') || str.includes('1–2') || str.includes('1-2')) return 1.5;
    if (str.includes('2–3') || str.includes('2-3')) return 2.5;
    if (str.includes('3–4') || str.includes('3-4')) return 3.5;
    if (str.includes('4–5') || str.includes('4-5')) return 4.5;
    if (str.includes('5–6') || str.includes('5-6')) return 5.5;
    if (str.includes('6+') || str.includes('6+ hours')) return 6.0;

    const match = str.match(/(\d+(\.\d+)?)/);
    if (match) return parseFloat(match[1]);

    return 4.5;
  };

  const daysUntilTarget = calculateDaysUntilTarget();
  const dailyPhoneHours = parseDailyPhoneHours();

  // 4. Total Phone Hours calculation with rounding
  const totalPhoneHours = Math.round(dailyPhoneHours * daysUntilTarget);
  const totalPhoneHoursFormatted = totalPhoneHours.toLocaleString();

  // Format daily hours string (e.g. 5 hours or 4.5 hours or 5.5 hours)
  const formattedDailyHours = Number.isInteger(dailyPhoneHours)
    ? `${dailyPhoneHours} hours`
    : `${dailyPhoneHours} hours`;

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.bg }]}
      onPress={onContinue}
      activeOpacity={0.98}
    >
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']} pointerEvents="box-none">
        {/* Main calculation narrative */}
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
          {/* Section 1: Target Days */}
          <View style={styles.textSection}>
            <Text style={[styles.mainText, { color: theme.textPrimary }]}>
              {displayName}, you have about{' '}
              <Text style={[styles.brandAccent, { color: theme.accent }]}>{daysUntilTarget} DAYS</Text> until your target
            </Text>
          </View>

          {/* Section 2: Daily Phone Time */}
          <View style={styles.textSection}>
            <Text style={[styles.mainText, { color: theme.textPrimary }]}>
              At <Text style={[styles.brandAccent, { color: theme.accent }]}>{formattedDailyHours.toUpperCase()}</Text> of phone time every day
            </Text>
          </View>

          {/* Section 3: Total Accumulated Hours */}
          <View style={styles.textSection}>
            <Text style={[styles.mainText, { color: theme.textPrimary }]}>
              That's <Text style={[styles.brandAccent, { color: theme.accent }]}>{totalPhoneHoursFormatted} HOURS</Text> between now and then
            </Text>
          </View>

          {/* Section 4: Goal Competition Statement */}
          <View style={styles.textSection}>
            <Text style={[styles.mainText, { color: theme.textPrimary }]}>
              And your <Text style={[styles.brandAccent, { color: theme.accent }]}>GOAL</Text> is competing for the same time
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
    paddingTop: 64,
    gap: 32,
  },
  textSection: {
    marginBottom: 6,
  },
  mainText: {
    fontSize: 22,
    fontWeight: '400',
    color: '#0F172A',
    lineHeight: 34,
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
