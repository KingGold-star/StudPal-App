import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 3D Cute Star Mascot Icon for StudPal with volumetric lighting and sparkle
function StudPalStarIcon({ size = 44 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="metricsMascotBodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <Stop offset="0%" stopColor="#60A5FA" />
          <Stop offset="30%" stopColor="#3B82F6" />
          <Stop offset="70%" stopColor="#2563EB" />
          <Stop offset="100%" stopColor="#1D4ED8" />
        </LinearGradient>
        <LinearGradient id="metricsMascotHighlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#BFDBFE" stopOpacity="0.8" />
          <Stop offset="60%" stopColor="#60A5FA" stopOpacity="0.2" />
          <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient id="metricsSparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="50%" stopColor="#E0F2FE" />
          <Stop offset="100%" stopColor="#7DD3FC" />
        </LinearGradient>
      </Defs>

      {/* Sparkle Glint */}
      <Path
        d="M10 2 C10 6.5, 6.5 10, 2 10 C6.5 10, 10 13.5, 10 18 C10 13.5, 13.5 10, 18 10 C13.5 10, 10 6.5, 10 2 Z"
        fill="url(#metricsSparkleGrad)"
      />
      <Circle cx="19" cy="4" r="1.2" fill="#BAE6FD" />

      {/* Star Shadow */}
      <Path
        d="M25 8 C26.8 8, 28.5 13, 30.5 15.2 C32.5 17.4, 38 18, 39.2 20.2 C40.4 22.4, 36.8 26.8, 36.2 29.5 C35.6 32.2, 38 37.8, 36.2 39.5 C34.4 41.2, 29.2 38, 26.5 38 C23.8 38, 18.6 41.2, 16.8 39.5 C15 37.8, 17.4 32.2, 16.8 29.5 C16.2 26.8, 12.6 22.4, 13.8 20.2 C15 18, 20.5 17.4, 22.5 15.2 C24.5 13, 23.2 8, 25 8 Z"
        fill="#1E40AF"
        opacity="0.25"
        transform="translate(0, 2)"
      />

      {/* Main Body */}
      <Path
        d="M25 7 C26.8 7, 28.5 12, 30.5 14.2 C32.5 16.4, 38 17, 39.2 19.2 C40.4 21.4, 36.8 25.8, 36.2 28.5 C35.6 31.2, 38 36.8, 36.2 38.5 C34.4 40.2, 29.2 37, 26.5 37 C23.8 37, 18.6 40.2, 16.8 38.5 C15 36.8, 17.4 31.2, 16.8 28.5 C16.2 25.8, 12.6 21.4, 13.8 19.2 C15 17, 20.5 16.4, 22.5 14.2 C24.5 12, 23.2 7, 25 7 Z"
        fill="url(#metricsMascotBodyGrad)"
      />

      {/* Top Highlight */}
      <Path
        d="M25 7 C26.8 7, 28.5 12, 30.5 14.2 C31.8 15.6, 34.5 16.4, 36.2 17.2 C33.2 19.5, 27.5 19, 23 20 C18.5 21, 16.2 24, 14.5 22 C13.5 20.5, 14 18.5, 15 17.5 C17 15.5, 21 15, 22.8 13.5 C24.2 11.8, 23.5 7, 25 7 Z"
        fill="url(#metricsMascotHighlightGrad)"
      />

      {/* Eyes */}
      <Circle cx="21.5" cy="24.5" r="2.1" fill="#0A0F29" />
      <Circle cx="20.8" cy="23.7" r="0.8" fill="#FFFFFF" />
      <Circle cx="29.5" cy="24.5" r="2.1" fill="#0A0F29" />
      <Circle cx="28.8" cy="23.7" r="0.8" fill="#FFFFFF" />

      {/* Smile */}
      <Path
        d="M23.5 28.5 Q26 31 28.5 28.5"
        stroke="#0A0F29"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function ClockIcon({ size = 18, color = '#1200C6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.2" />
      <Path d="M12 7v5l3 2" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function DocumentCheckIcon({ size = 18, color = '#10B981' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="3" width="16" height="18" rx="3.5" stroke={color} strokeWidth="2.2" />
      <Path d="M8 8h8M8 12h5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Path d="M14 15.5l2 2 4-4" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function OnboardingFirstSessionMetricsScreen({
  onContinue,
  onBack,
  secondsStudied,
  minutesStudied,
  incorrectCount = 0,
  totalQuestions = 3,
  questionsAnswered,
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const mascotFloatAnim = useRef(new Animated.Value(0)).current;

  const displayIncorrect = typeof incorrectCount === 'number' ? incorrectCount : 0;
  const displayTotal = typeof totalQuestions === 'number' && totalQuestions > 0 ? totalQuestions : 3;

  // Format exact study duration
  const getFormattedTime = () => {
    if (typeof secondsStudied === 'number' && secondsStudied > 0) {
      if (secondsStudied < 60) {
        return { value: `${secondsStudied}`, unit: 'sec' };
      }
      const mins = Math.floor(secondsStudied / 60);
      const remSecs = secondsStudied % 60;
      if (remSecs === 0) {
        return { value: `${mins}`, unit: 'min' };
      }
      const decimal = (secondsStudied / 60).toFixed(1);
      return {
        value: decimal.endsWith('.0') ? `${mins}` : decimal,
        unit: 'min',
      };
    }

    if (minutesStudied) {
      return { value: `${minutesStudied}`, unit: 'min' };
    }

    return { value: '1', unit: 'min' };
  };

  const { value: timeValue, unit: timeUnit } = getFormattedTime();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 50,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    // Subtle breathing animation for mascot
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(mascotFloatAnim, {
          toValue: -4,
          duration: 1600,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(mascotFloatAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    floatLoop.start();

    return () => floatLoop.stop();
  }, [fadeAnim, slideAnim, mascotFloatAnim]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Top Section */}
          <View style={styles.topSection}>
            {/* Header Title */}
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>
              nice. you just{'\n'}completed your{'\n'}first session.
            </Text>

            {/* Premium Twin Elevated Metric Cards */}
            <View style={styles.twinCardsRow}>
              {/* Card 1: Time Studied */}
              <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.clockIconBadge}>
                    <ClockIcon size={18} color="#1200C6" />
                  </View>
                  <View style={[styles.timeTagBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}>
                    <Text style={[styles.timeTagText, { color: theme.textSecondary }]}>TIME</Text>
                  </View>
                </View>

                <View style={styles.statNumberRow}>
                  <Text style={[styles.statNumberText, { color: theme.textPrimary }]}>{timeValue}</Text>
                  <Text style={styles.statUnitText}>{timeUnit}</Text>
                </View>

                <Text style={[styles.statLabelText, { color: theme.textSecondary }]}>studied</Text>
              </View>

              {/* Card 2: Answers Incorrect over Total */}
              <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.docIconBadge}>
                    <DocumentCheckIcon size={18} color="#10B981" />
                  </View>
                  <View style={styles.quizTagBadge}>
                    <Text style={styles.quizTagText}>QUIZ</Text>
                  </View>
                </View>

                <View style={styles.statNumberRow}>
                  <Text style={[styles.statNumberText, { color: theme.textPrimary }]}>{displayIncorrect}</Text>
                  <Text style={styles.statSubRatioText}>/ {displayTotal}</Text>
                </View>

                <Text style={[styles.statLabelText, { color: theme.textSecondary }]}>answers incorrect</Text>
              </View>
            </View>

            {/* Mascoted System Learning Insight Card */}
            <View style={[styles.insightCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Animated.View
                style={[
                  styles.mascotWrapper,
                  { transform: [{ translateY: mascotFloatAnim }] },
                ]}
              >
                <StudPalStarIcon size={46} />
              </Animated.View>

              <View style={styles.insightContent}>
                <Text style={[styles.insightTitleText, { color: theme.textPrimary }]}>
                  your system is already{'\n'}learning how you study.
                </Text>
                <Text style={[styles.insightSubText, { color: theme.textSecondary }]}>
                  Calibrating recall frequency and difficulty for your goal.
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Action Button */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={onContinue}
              activeOpacity={0.88}
            >
              <Text style={styles.continueButtonText}>continue ➔</Text>
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
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 32,
    paddingBottom: 8,
  },
  topSection: {
    flex: 1,
  },
  titleText: {
    fontSize: 29,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 37,
    letterSpacing: -0.7,
    marginBottom: 28,
  },
  twinCardsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 14,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  clockIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeTagBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  timeTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  quizTagBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  quizTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  statNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  statNumberText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1.2,
  },
  statUnitText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1200C6',
    marginLeft: 4,
    letterSpacing: -0.2,
  },
  statSubRatioText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 4,
    letterSpacing: -0.2,
  },
  statLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: -0.1,
    lineHeight: 17,
  },
  insightCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  mascotWrapper: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  insightSubText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 17,
    letterSpacing: -0.1,
  },
  bottomSection: {
    width: '100%',
    paddingTop: 10,
  },
  continueButton: {
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
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
