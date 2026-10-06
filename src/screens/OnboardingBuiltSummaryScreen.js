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

export default function OnboardingBuiltSummaryScreen({
  onContinue,
  onBack,
  goal = null,
  targetData = { label: 'In 3 months', days: 90 },
  subjects = ['Mathematics', 'English', 'Physics', 'Chemistry'],
  focusSubject = 'Mathematics',
  dailyStudyTime = '45 min',
  studyDays = ['mon', 'wed', 'fri', 'sat'],
  milestonePercent = '20%',
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

  // Goal
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

  // Target
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

  // Subjects string
  const resolveSubjectsList = () => {
    if (Array.isArray(subjects) && subjects.length > 0) {
      return subjects.slice(0, 4).join(' · ');
    }
    return 'Mathematics · English · Physics · Chemistry';
  };

  const subjectsText = resolveSubjectsList();

  // Focus
  const focusText = focusSubject && typeof focusSubject === 'string' && focusSubject.trim()
    ? focusSubject.trim()
    : 'Mathematics';

  // Commitment
  const formatCommitment = (timeStr) => {
    if (!timeStr) return '45 min/day';
    const str = String(timeStr).trim().toLowerCase();
    if (str.includes('15-30') || str.includes('15–30')) return '25 min/day';
    if (str.includes('30-60') || str.includes('30–60') || str.includes('45')) return '45 min/day';
    if (str.includes('1-2') || str.includes('1–2')) return '1.5 hrs/day';
    if (str.includes('2-3') || str.includes('2–3')) return '2.5 hrs/day';
    if (str.includes('3+')) return '3+ hrs/day';
    return `${timeStr}/day`;
  };

  const commitmentText = formatCommitment(dailyStudyTime);

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
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>
              here's what{'\n'}we built
            </Text>

            {/* List Breakdown */}
            <View style={styles.breakdownList}>
              <Text style={[styles.itemLine, { color: theme.textPrimary }]}>
                <Text style={[styles.itemKey, { color: theme.textPrimary }]}>your goal</Text> — {goalText}
              </Text>

              <Text style={[styles.itemLine, { color: theme.textPrimary }]}>
                <Text style={[styles.itemKey, { color: theme.textPrimary }]}>your target</Text> — {targetText}
              </Text>

              <Text style={[styles.itemLine, { color: theme.textPrimary }]}>
                <Text style={[styles.itemKey, { color: theme.textPrimary }]}>your subjects</Text> — {subjectsText}
              </Text>

              <Text style={[styles.itemLine, { color: theme.textPrimary }]}>
                <Text style={[styles.itemKey, { color: theme.textPrimary }]}>your focus</Text> —{' '}
                <Text style={styles.focusBlueText}>{focusText}</Text>
              </Text>

              <Text style={[styles.itemLine, { color: theme.textPrimary }]}>
                <Text style={[styles.itemKey, { color: theme.textPrimary }]}>your commitment</Text> — {commitmentText}
              </Text>

              <Text style={[styles.itemLine, { color: theme.textPrimary }]}>
                <Text style={[styles.itemKey, { color: theme.textPrimary }]}>your first milestone</Text> — {milestonePercent}
              </Text>
            </View>

            {/* Subtext Philosophy */}
            <View style={styles.quoteSection}>
              <Text style={[styles.quoteText, { color: theme.textSecondary }]}>
                you don't need a perfect routine.{'\n'}you need one you can keep.
              </Text>
            </View>
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
    lineHeight: 42,
    letterSpacing: -0.8,
    marginBottom: 36,
  },
  breakdownList: {
    gap: 16,
    marginBottom: 36,
  },
  itemLine: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  itemKey: {
    fontWeight: '800',
    color: '#0F172A',
  },
  focusBlueText: {
    color: '#2D62FF',
    fontWeight: '800',
  },
  jaggedText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  quoteSection: {
    marginTop: 8,
  },
  quoteText: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 22,
    letterSpacing: -0.2,
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
