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
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

// Custom Hand-Drawn Jagged Blue Highlighter Stroke with Generous Spread
function JaggedBlueHighlighter({ text }) {
  return (
    <View style={styles.jaggedContainer}>
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox="0 0 190 46"
        preserveAspectRatio="none"
      >
        {/* Jagged / Chiseled Organic Marker Pen Stroke */}
        <Path
          d="M 6 6 
             L 28 3 
             L 65 6 
             L 110 3 
             L 155 5 
             L 182 2 
             L 187 10 
             L 181 19 
             L 188 28 
             L 183 38 
             L 186 44 
             L 158 41 
             L 118 44 
             L 72 40 
             L 32 44 
             L 7 40 
             L 1 31 
             L 7 21 
             L 2 12 
             Z"
          fill="#1200C6"
        />
        <Path
          d="M 14 7 L 176 5 L 180 39 L 10 40 Z"
          fill="#1E1BEB"
          opacity="0.3"
        />
      </Svg>
      <Text style={styles.jaggedText}>{text}</Text>
    </View>
  );
}

export default function OnboardingStudyPlanDetailsScreen({
  onContinue,
  onBack,
  goal = null,
  targetData = { label: 'In 3 months', days: 90 },
  focusSubject = 'Mathematics',
  dailyStudyTime = '45 min',
  studyTimeOfDay = 'Evening',
  studyDays = ['mon', 'wed', 'fri', 'sat'],
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

  // 1. Goal Resolution
  const resolveGoalLabel = () => {
    if (!goal) return 'Improve Grades';
    if (typeof goal === 'string') return goal;
    if (goal.title) return goal.title;
    if (goal.label) return goal.label.replace('\n', ' ');
    if (goal.id === 'exam' || goal.id === 'waec') return 'Pass Exams';
    if (goal.id === 'grades') return 'Improve Grades';
    if (goal.id === 'college' || goal.id === 'jamb') return 'Prepare for Uni';
    if (goal.id === 'learn') return 'Learn New Subjects';
    if (goal.id === 'habits') return 'Daily Study Habit';
    return 'Improve Grades';
  };

  const goalText = resolveGoalLabel();

  // 2. Target Days Resolution
  const resolveTargetDays = () => {
    if (!targetData) return '90 days';
    if (typeof targetData === 'number') return `${targetData} days`;
    if (typeof targetData.days === 'number') return `${targetData.days} days`;
    if (typeof targetData === 'string') {
      const lower = targetData.toLowerCase();
      if (lower.includes('exam')) return '60 days';
      if (lower.includes('1 month')) return '30 days';
      if (lower.includes('3 month')) return '90 days';
      if (lower.includes('6 month')) return '180 days';
      if (lower.includes('year')) return '240 days';
      return targetData;
    }
    if (targetData.label) {
      const lower = targetData.label.toLowerCase();
      if (lower.includes('exam')) return '60 days';
      if (lower.includes('1 month')) return '30 days';
      if (lower.includes('3 month')) return '90 days';
      if (lower.includes('6 month')) return '180 days';
      if (lower.includes('year')) return '240 days';
      return targetData.label;
    }
    return '90 days';
  };

  const targetText = resolveTargetDays();

  // 3. Focus Subject Resolution (Block letters)
  const focusText = (focusSubject && typeof focusSubject === 'string' && focusSubject.trim()
    ? focusSubject.trim()
    : 'Mathematics').toUpperCase();

  // 4. Daily Commitment
  const formatDailyCommitment = (timeStr) => {
    if (!timeStr) return '45 minutes';
    const str = String(timeStr).trim().toLowerCase();
    if (str === '15–30 min' || str === '15-30 min') return '25 minutes';
    if (str === '30–60 min' || str === '30-60 min' || str === '45 min') return '45 minutes';
    if (str === '1–2 hours' || str === '1-2 hours') return '1.5 hours';
    if (str === '2–3 hours' || str === '2-3 hours') return '2.5 hours';
    if (str === '3+ hours' || str === '3+ hours') return '3 hours';
    return timeStr;
  };

  const commitmentText = formatDailyCommitment(dailyStudyTime);

  // 5. Best Time of Day
  const formatTimeOfDay = (tod) => {
    if (!tod) return 'Evening';
    const s = String(tod).trim().toLowerCase();
    if (s.includes('dawn')) return 'Dawn';
    if (s.includes('morning')) return 'Morning';
    if (s.includes('afternoon')) return 'Afternoon';
    if (s.includes('evening') || s.includes('night')) return 'Evening';
    if (s.includes('change')) return 'Flexible';
    return tod.charAt(0).toUpperCase() + tod.slice(1);
  };

  const timeOfDayText = formatTimeOfDay(studyTimeOfDay);

  // 6. Study Days
  const formatDaysList = (days) => {
    if (!Array.isArray(days) || days.length === 0) return 'Mon · Tue · Thu · Sat';
    const dayNameMap = {
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      sun: 'Sun',
    };
    return days.map((d) => dayNameMap[d.toLowerCase()] || d).join(' · ');
  };

  const daysText = formatDaysList(studyDays);

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
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Top Section */}
          <View style={styles.topSection}>
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>Your study plan</Text>

            {/* Key-Value Summary List */}
            <View style={styles.summaryList}>
              <View style={styles.summaryRow}>
                <Text style={[styles.rowKeyText, { color: theme.textPrimary }]}>Goal: </Text>
                <Text style={[styles.rowValText, { color: theme.textPrimary }]}>{goalText}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.rowKeyText, { color: theme.textPrimary }]}>Target: </Text>
                <Text style={[styles.rowValText, { color: theme.textPrimary }]}>{targetText}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.rowKeyText, { color: theme.textPrimary }]}>Focus: </Text>
                <Text style={[styles.rowValText, styles.focusBlueText, { color: theme.accent }]}>{focusText}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.rowKeyText, { color: theme.textPrimary }]}>Daily commitment: </Text>
                <Text style={[styles.rowValText, { color: theme.textPrimary }]}>{commitmentText}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.rowKeyText, { color: theme.textPrimary }]}>Best time: </Text>
                <Text style={[styles.rowValText, { color: theme.textPrimary }]}>{timeOfDayText}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.rowKeyText, { color: theme.textPrimary }]}>Study days: </Text>
                <Text style={[styles.rowValText, { color: theme.textPrimary }]}>{daysText}</Text>
              </View>
            </View>

            {/* Note Subtext */}
            <Text style={[styles.subtextNote, { color: theme.textSecondary }]}>
              StudPal will adjust this as you learn.
            </Text>
          </View>

          {/* Bottom Footer Button */}
          <TouchableOpacity
            style={styles.footerButton}
            onPress={onContinue}
            activeOpacity={0.7}
          >
            <Text style={[styles.footerButtonText, { color: theme.textPrimary }]}>Tap to continue ➔</Text>
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
    paddingTop: 54,
    paddingBottom: 10,
  },
  topSection: {
    width: '100%',
  },
  titleText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.8,
    marginBottom: 40,
  },
  summaryList: {
    gap: 16,
    marginBottom: 36,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  focusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  jaggedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 7,
    marginLeft: 4,
    transform: [{ rotate: '-0.8deg' }],
  },
  jaggedText: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  rowKeyText: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  rowValText: {
    fontSize: 16.5,
    fontWeight: '500',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  focusBlueText: {
    color: '#2D62FF',
    fontWeight: '800',
  },
  subtextNote: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 22,
    letterSpacing: -0.2,
    marginTop: 8,
  },
  footerButton: {
    alignSelf: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  footerButtonText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
});
