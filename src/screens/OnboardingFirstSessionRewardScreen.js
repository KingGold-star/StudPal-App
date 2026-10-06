import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { gamificationService } from '../services/gamification/gamificationService';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

function LevelArrowIcon({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="9" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
      <Path
        d="M7 13 L13 7 M8.5 7 H13 V11.5"
        stroke="#475569"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const GOAL_LOOKUP = {
  exam: 'passing your exams',
  grades: 'improving your grades',
  college: 'preparing for university',
  learn: 'learning a new subject',
  habits: 'building daily study habits',
  waec: 'passing your exams',
  jamb: 'preparing for university',
};

export default function OnboardingFirstSessionRewardScreen({
  onContinue,
  onBack,
  goal = null,
  xpEarned = 10,
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const hasAwardedRef = useRef(false);

  useEffect(() => {
    // Award the +10 XP to the user's profile and leaderboard
    if (!hasAwardedRef.current) {
      hasAwardedRef.current = true;
      try {
        gamificationService.awardXp(
          'FIRST_SESSION_REWARD',
          xpEarned || 10,
          'Completed First Session (+10 XP)',
          'onboarding_first_session_reward_xp',
          { completedSessionsDelta: 1 }
        );
      } catch (err) {
        console.warn('Unable to award onboarding XP to gamificationService:', err);
      }
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, xpEarned]);

  // Dynamic Goal Sentence Resolution
  const resolveGoalPhrase = () => {
    if (!goal) return 'your goal';
    if (typeof goal === 'string') return goal;
    if (goal.id && GOAL_LOOKUP[goal.id]) return GOAL_LOOKUP[goal.id];
    if (goal.title) return goal.title.toLowerCase();
    if (goal.label) return goal.label.toLowerCase();
    return 'your goal';
  };

  const goalPhrase = resolveGoalPhrase();

  const handleContinue = () => {
    try {
      gamificationService.awardXp(
        'FIRST_SESSION_REWARD',
        xpEarned || 10,
        'Completed First Session (+10 XP)',
        'onboarding_first_session_reward_xp',
        { completedSessionsDelta: 1 }
      );
    } catch (err) {
      console.warn('Unable to award onboarding XP on continue:', err);
    }
    if (onContinue) {
      onContinue();
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
          {/* Top Headline Section */}
          <View style={styles.topSection}>
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>
              first session{'\n'}complete.
            </Text>
            <Text style={[styles.subtitleText, { color: theme.textSecondary }]}>
              you're officially moving{'\n'}toward {goalPhrase}.
            </Text>
          </View>

          {/* Center XP Reward Badge */}
          <Animated.View
            style={[
              styles.rewardContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.xpRow}>
              <Text style={[styles.xpNumberText, { color: theme.textPrimary }]}>+{xpEarned} XP</Text>
              <View style={styles.arrowIconWrapper}>
                <LevelArrowIcon size={28} />
              </View>
            </View>
          </Animated.View>

          {/* Bottom Footer Section */}
          <View style={styles.bottomSection}>
            <Text style={[styles.footerNoteText, { color: theme.textSecondary }]}>one session down.</Text>

            <TouchableOpacity
              style={styles.keepGoingButton}
              onPress={handleContinue}
              activeOpacity={0.88}
            >
              <Text style={styles.keepGoingButtonText}>keep going ➔</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 10,
    alignItems: 'center',
  },
  topSection: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 40,
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 23,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  rewardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  xpNumberText: {
    fontSize: 54,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1.5,
  },
  arrowIconWrapper: {
    marginTop: -2,
  },
  bottomSection: {
    alignItems: 'center',
    width: '100%',
  },
  footerNoteText: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  keepGoingButton: {
    width: '100%',
    backgroundColor: '#1200C6',
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  keepGoingButtonText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
