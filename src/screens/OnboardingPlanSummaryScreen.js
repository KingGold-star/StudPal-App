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

export default function OnboardingPlanSummaryScreen({
  onContinue,
  onBack,
  userName = 'Alex',
  targetData = { label: 'In 3 months', days: 90 },
  focusSubject = null,
  subjects = ['Mathematics'],
  confidence = 'I understand the basics',
  dailyStudyTime = '1–2 hours',
  studyTimeOfDay = 'morning',
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

  // 2. Real Calendar Days Calculation
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

  const daysCount = calculateDaysUntilTarget();
  const daysFormatted = `${daysCount} ${daysCount === 1 ? 'day' : 'days'}`;

  // 3. Dynamic Subject Confidence Line
  const evaluatedSubject = focusSubject ||
    (Array.isArray(subjects) && subjects.length > 0 ? subjects[0] : 'mathematics');
  const formattedSubject = evaluatedSubject.toLowerCase().trim();

  const getSubjectConfidenceSentence = () => {
    const capitalizedSubject = evaluatedSubject.charAt(0).toUpperCase() + evaluatedSubject.slice(1);
    const conf = (confidence || '').toLowerCase();
    if (conf.includes('struggle')) {
      return `${capitalizedSubject} needs the most attention`;
    }
    if (conf.includes('basics')) {
      return `${capitalizedSubject} needs attention on the basics`;
    }
    if (conf.includes('getting there')) {
      return `You’re getting there in ${capitalizedSubject}`;
    }
    if (conf.includes('very confident')) {
      return `You’re very confident in ${capitalizedSubject}`;
    }
    if (conf.includes('confident')) {
      return `You’re already confident in ${capitalizedSubject}`;
    }
    return `${capitalizedSubject} needs the most attention`;
  };

  const confidenceSentence = getSubjectConfidenceSentence();

  // 4. Daily study commitment formatting (available study time, not phone hours)
  const formatDailyTime = (timeStr) => {
    if (!timeStr) return '1.5 hours';
    const str = String(timeStr).trim();
    if (str === '15–30 min' || str === '15-30 min') return '25 minutes';
    if (str === '30–60 min' || str === '30-60 min') return '45 minutes';
    if (str === '1–2 hours' || str === '1-2 hours') return '1.5 hours';
    if (str === '2–3 hours' || str === '2-3 hours') return '2.5 hours';
    if (str === '3+ hours' || str === '3+ hours') return '3 hours';
    return str;
  };

  const formattedDailyTime = formatDailyTime(dailyStudyTime);

  // 5. Preferred study time
  const isItChanges = (studyTimeOfDay || '').toLowerCase().includes('changes');

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.bg }]}
      onPress={onContinue}
      activeOpacity={0.98}
    >
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']} pointerEvents="box-none">
        {/* Dynamic Plan Summary Narrative */}
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
          {/* 1. Days to goal */}
          <View style={styles.textSection}>
            <Text style={[styles.mainText, { color: theme.textPrimary }]}>
              {displayName}, you have <Text style={[styles.brandAccent, { color: theme.accent }]}>{daysFormatted.toUpperCase()}</Text> to work toward your goal
            </Text>
          </View>

          {/* 2. Focus subject & confidence statement */}
          <View style={styles.textSection}>
            <Text style={[styles.mainText, { color: theme.textPrimary }]}>
              {confidenceSentence}
            </Text>
          </View>

          {/* 3. Daily study commitment */}
          <View style={styles.textSection}>
            <Text style={[styles.mainText, { color: theme.textPrimary }]}>
              You can realistically give StudPal <Text style={[styles.brandAccent, { color: theme.accent }]}>{formattedDailyTime.toUpperCase()}</Text> a day.
            </Text>
          </View>

          {/* 4. Time of day preference */}
          <View style={styles.textSection}>
            {isItChanges ? (
              <Text style={[styles.mainText, { color: theme.textPrimary }]}>
                Your study time can <Text style={[styles.brandAccent, { color: theme.accent }]}>ADAPT</Text> to your day
              </Text>
            ) : (
              <Text style={[styles.mainText, { color: theme.textPrimary }]}>
                You prefer studying in the <Text style={[styles.brandAccent, { color: theme.accent }]}>{(studyTimeOfDay || 'morning').toUpperCase()}</Text>
              </Text>
            )}
          </View>

          {/* 5. Reassurance punchline */}
          <View style={styles.textSection}>
            <Text style={[styles.mainText, { color: theme.textPrimary }]}>
              That’s enough to <Text style={[styles.brandAccent, { color: theme.accent }]}>START</Text>
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
    paddingTop: 54,
    gap: 28,
  },
  textSection: {
    marginBottom: 4,
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
    paddingBottom: 8,
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
