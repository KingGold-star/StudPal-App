import React, { useRef, useEffect } from 'react';
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
import Svg, {
  Path,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ==========================================
// 1. STUDPAL BRAND LOGO
// ==========================================
function StudPalLogo() {
  return (
    <View style={styles.logoRow}>
      <Svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        {/* Graduation Cap Top Diamond */}
        <Path
          d="M 14 3 L 26 9.5 L 14 16 L 2 9.5 Z"
          fill="#2563EB"
        />
        {/* Cap Base / Band */}
        <Path
          d="M 6 12.5 V 19 C 6 22 9.5 24.5 14 24.5 C 18.5 24.5 22 22 22 19 V 12.5 L 14 17 Z"
          fill="#1D4ED8"
        />
        {/* Tassel */}
        <Path
          d="M 23 10.5 V 20.5"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Circle cx="23" cy="21" r="1.5" fill="#2563EB" />
      </Svg>
      <Text style={styles.brandTitle}>StudPal</Text>
    </View>
  );
}

// ==========================================
// 2. ICONS FOR FLOATING CHIPS & SUBJECTS
// ==========================================
function TargetIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="2.2" />
      <Circle cx="12" cy="12" r="5" stroke="#2563EB" strokeWidth="2" />
      <Circle cx="12" cy="12" r="2" fill="#2563EB" />
    </Svg>
  );
}

function CalendarIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="17" rx="3.5" stroke="#2563EB" strokeWidth="2.2" />
      <Path d="M 16 2 V 6" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
      <Path d="M 8 2 V 6" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
      <Path d="M 3 9.5 H 21" stroke="#2563EB" strokeWidth="2" />
      <Circle cx="8" cy="14" r="1.2" fill="#2563EB" />
      <Circle cx="12" cy="14" r="1.2" fill="#2563EB" />
      <Circle cx="16" cy="14" r="1.2" fill="#2563EB" />
    </Svg>
  );
}

function BarChartIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="14" width="4.5" height="7" rx="1.5" fill="#2563EB" />
      <Rect x="9.75" y="9" width="4.5" height="12" rx="1.5" fill="#2563EB" />
      <Rect x="16.5" y="4" width="4.5" height="17" rx="1.5" fill="#2563EB" />
    </Svg>
  );
}

function MathIcon() {
  return (
    <View style={[styles.subjectIconBox, { backgroundColor: '#EFF6FF' }]}>
      <Text style={{ fontSize: 10, fontWeight: '800', color: '#2563EB' }}>÷×</Text>
    </View>
  );
}

function PhysicsIcon() {
  return (
    <View style={[styles.subjectIconBox, { backgroundColor: '#ECFEFF' }]}>
      <Svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="3" fill="#0284C7" />
        <Path d="M 12 3 C 17 3 21 7 21 12 C 21 17 17 21 12 21 C 7 21 3 17 3 12 C 3 7 7 3 12 3 Z" stroke="#0284C7" strokeWidth="1.8" />
      </Svg>
    </View>
  );
}

function ChemIcon() {
  return (
    <View style={[styles.subjectIconBox, { backgroundColor: '#ECFDF5' }]}>
      <Svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <Path d="M 9 3 H 15 M 10 3 V 8 L 5 18 C 4.5 19 5.2 20.5 6.5 20.5 H 17.5 C 18.8 20.5 19.5 19 19 18 L 14 8 V 3" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

function EnglishIcon() {
  return (
    <View style={[styles.subjectIconBox, { backgroundColor: '#FAF5FF' }]}>
      <Svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <Path d="M 4 19.5 C 4 17.5 6 16 8.5 16 H 20 V 4 H 8.5 C 6 4 4 5.5 4 7.5 V 19.5 Z" stroke="#9333EA" strokeWidth="2" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

// ==========================================
// MAIN SCREEN COMPONENT
// ==========================================
export default function OnboardingSaveAccountScreen({
  userName,
  onContinue,
  onLogin,
  onBack,
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  const displayName = (userName && userName.trim()) ? userName.trim() : 'Alex';

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 380,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

  const handlePressIn = () => {
    Animated.spring(btnScale, {
      toValue: 0.95,
      useNativeDriver: Platform.OS !== 'web',
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(btnScale, {
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
      speed: 25,
      bounciness: 8,
    }).start();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* Top Header Row with Logo */}
        <View style={styles.topHeader}>
          <StudPalLogo />
        </View>

        {/* Headline & Subtitle Section */}
        <View style={styles.textSection}>
          <Text style={[styles.headline, { color: theme.textPrimary }]}>Save your{'\n'}progress</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Create an account to keep your study{'\n'}plan, progress, and settings.
          </Text>
        </View>

        {/* Single Unified Visual Illustration Showcase Area */}
        <Animated.View style={[styles.illustrationArea, { opacity: fadeAnim }]}>
          {/* Soft Pastel Blue Glow Blob */}
          <View style={styles.blobBackground} pointerEvents="none">
            <Svg width="360" height="360" viewBox="0 0 360 360">
              <Defs>
                <LinearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#DBEAFE" stopOpacity={isDark ? 0.15 : 0.88} />
                  <Stop offset="100%" stopColor="#EFF6FF" stopOpacity={isDark ? 0.05 : 0.45} />
                </LinearGradient>
              </Defs>
              <Circle cx="180" cy="180" r="170" fill="url(#blobGrad)" />
            </Svg>
          </View>

          {/* Central Preview Device Card */}
          <View style={[styles.centralCardContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Central Card Inner Content */}
            <View style={styles.centralCardInner}>
              {/* User Greeting Header */}
              <View style={styles.cardHeaderRow}>
                <View style={[styles.avatarCircle, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
                  <Svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="8" r="4" fill="#2563EB" />
                    <Path d="M 4 20 C 4 16 7.5 14 12 14 C 16.5 14 20 16 20 20" fill="#2563EB" />
                  </Svg>
                </View>
                <View style={styles.headerTextCol}>
                  <Text style={[styles.greetingTitle, { color: theme.textPrimary }]}>Good morning, {displayName} 👋</Text>
                  <Text style={[styles.greetingSubtitle, { color: theme.textSecondary }]}>Keep going! You're doing great.</Text>
                </View>
              </View>

              {/* Today's Progress Box */}
              <View style={[styles.progressBox, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
                <View style={styles.progressHeaderRow}>
                  <Text style={[styles.progressLabel, { color: theme.textPrimary }]}>Today's Progress</Text>
                  <Text style={styles.progressValueText}>3/5   60%</Text>
                </View>
                <View style={[styles.progressBarTrack, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
                  <View style={[styles.progressBarFill, { width: '60%' }]} />
                </View>
              </View>

              {/* Your Subjects Section */}
              <View style={styles.subjectsSection}>
                <Text style={[styles.sectionHeaderTitle, { color: theme.textPrimary }]}>Your Subjects</Text>

                <View style={styles.subjectRow}>
                  <MathIcon />
                  <Text style={[styles.subjectName, { color: theme.textPrimary }]}>Mathematics</Text>
                  <Text style={[styles.subjectPercent, { color: theme.textSecondary }]}>75%</Text>
                </View>

                <View style={styles.subjectRow}>
                  <PhysicsIcon />
                  <Text style={[styles.subjectName, { color: theme.textPrimary }]}>Physics</Text>
                  <Text style={[styles.subjectPercent, { color: theme.textSecondary }]}>60%</Text>
                </View>

                <View style={styles.subjectRow}>
                  <ChemIcon />
                  <Text style={[styles.subjectName, { color: theme.textPrimary }]}>Chemistry</Text>
                  <Text style={[styles.subjectPercent, { color: theme.textSecondary }]}>48%</Text>
                </View>

                <View style={styles.subjectRow}>
                  <EnglishIcon />
                  <Text style={[styles.subjectName, { color: theme.textPrimary }]}>English</Text>
                  <Text style={[styles.subjectPercent, { color: theme.textSecondary }]}>88%</Text>
                </View>
              </View>

              {/* Today's Study Schedule Section */}
              <View style={[styles.scheduleSection, { borderTopColor: theme.border }]}>
                <Text style={[styles.sectionHeaderTitle, { color: theme.textPrimary }]}>Today's Study Schedule</Text>
                <View style={[styles.scheduleCardRow, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
                  <Text style={styles.scheduleTime}>11:00 AM</Text>
                  <View style={[styles.scheduleDivider, { backgroundColor: theme.border }]} />
                  <View style={styles.scheduleInfoCol}>
                    <Text style={[styles.scheduleSubject, { color: theme.textPrimary }]}>Mathematics</Text>
                    <Text style={[styles.scheduleDetail, { color: theme.textSecondary }]}>2h • Chapter 4</Text>
                  </View>
                  <Text style={[styles.scheduleChevron, { color: theme.textSecondary }]}>›</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Overlaid Chip 1: Your Goals (Top Left) */}
          <View style={[styles.floatingChip, styles.chipGoals, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.chipIconBox, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
              <TargetIcon />
            </View>
            <View>
              <Text style={[styles.chipTitle, { color: theme.textPrimary }]}>Your Goals</Text>
              <Text style={[styles.chipSub, { color: theme.textSecondary }]}>A+ in all subjects</Text>
            </View>
          </View>

          {/* Overlaid Chip 2: Your Schedule (Bottom Left) */}
          <View style={[styles.floatingChip, styles.chipSchedule, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.chipIconBox, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
              <CalendarIcon />
            </View>
            <View>
              <Text style={[styles.chipTitle, { color: theme.textPrimary }]}>Your Schedule</Text>
              <Text style={[styles.chipSub, { color: theme.textSecondary }]}>Stay consistent</Text>
            </View>
          </View>

          {/* Overlaid Chip 3: Your Progress (Right Middle) */}
          <View style={[styles.floatingChip, styles.chipProgress, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.chipIconBox, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
              <BarChartIcon />
            </View>
            <View>
              <Text style={[styles.chipTitle, { color: theme.textPrimary }]}>Your Progress</Text>
              <Text style={[styles.chipSub, { color: theme.textSecondary }]}>On track</Text>
            </View>
          </View>
        </Animated.View>

        {/* Bottom CTA Action Area */}
        <View style={styles.bottomArea}>
          <Animated.View style={{ width: '100%', transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={onContinue}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.92}
            >
              <View style={styles.btnContentRow}>
                <Text style={styles.continueButtonText}>Continue</Text>
                <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 6 }}>
                  <Path
                    d="M 5 12 H 19 M 13 6 L 19 12 L 13 18"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Already have an account? Log in */}
          <View style={styles.loginRow}>
            <Text style={[styles.loginTextPrompt, { color: theme.textSecondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={onLogin || onContinue} activeOpacity={0.7}>
              <Text style={styles.loginLinkText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'ios' ? 4 : 8,
    paddingBottom: Platform.OS === 'ios' ? 8 : 14,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    marginBottom: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: -0.4,
  },
  textSection: {
    marginBottom: 14,
  },
  headline: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 21,
    letterSpacing: -0.15,
  },
  illustrationArea: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 360,
    maxHeight: 440,
    marginVertical: 6,
  },
  blobBackground: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
  centralCardContainer: {
    width: 284,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    zIndex: 5,
    transform: [{ rotate: '-2.5deg' }],
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 8,
  },
  centralCardInner: {
    width: '100%',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  greetingSubtitle: {
    fontSize: 10.5,
    fontWeight: '500',
    color: '#94A3B8',
    letterSpacing: -0.1,
    marginTop: 0.5,
  },
  progressBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  progressValueText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2563EB',
  },
  progressBarTrack: {
    width: '100%',
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3.5,
  },
  subjectsSection: {
    marginBottom: 11,
  },
  sectionHeaderTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 7,
    letterSpacing: -0.1,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3.5,
    gap: 8,
  },
  subjectIconBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectName: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  subjectPercent: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  scheduleSection: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  scheduleCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 6.5,
    gap: 8,
  },
  scheduleTime: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  scheduleDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#CBD5E1',
  },
  scheduleInfoCol: {
    flex: 1,
  },
  scheduleSubject: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  scheduleDetail: {
    fontSize: 9.5,
    fontWeight: '500',
    color: '#94A3B8',
  },
  scheduleChevron: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  floatingChip: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 9,
    paddingHorizontal: 12,
    gap: 9,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6,
    zIndex: 8,
  },
  chipIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.1,
  },
  chipSub: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 0.5,
  },
  chipGoals: {
    top: 10,
    left: -10,
  },
  chipSchedule: {
    bottom: 12,
    left: -6,
  },
  chipProgress: {
    top: '42%',
    right: -10,
  },
  bottomArea: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 2,
  },
  loginTextPrompt: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  loginLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
});
