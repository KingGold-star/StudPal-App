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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Line,
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
// 2. CELEBRATION SPARKLE / BURST ACCENT
// ==========================================
function SparkleBurst() {
  return (
    <Svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={styles.sparkleSvg}>
      <Line x1="18" y1="4" x2="18" y2="10" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
      <Line x1="28" y1="9" x2="23" y2="14" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
      <Line x1="31" y1="20" x2="25" y2="19" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

// ==========================================
// 3. SVG ICONS FOR MINI MOCKUP
// ==========================================
const GearIcon = ({ size = 15, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

const TargetIcon = ({ size = 16, color = "#2563EB" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="6" />
    <Circle cx="12" cy="12" r="2" />
  </Svg>
);

const ChevronRight = ({ size = 12, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

const CheckCircleSmall = ({ size = 12, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

// Donut Progress Ring
function MiniProgressDonut({ percent = 68, size = 48 }) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * percent) / 100;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#2563EB"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>
      <Text style={styles.donutText}>{percent}%</Text>
    </View>
  );
}

// ==========================================
// 4. MAIN SCREEN COMPONENT
// ==========================================
export default function OnboardingAppReadyScreen({
  userName = 'Alex',
  subjects = ['Mathematics', 'Physics', 'Chemistry', 'English'],
  onContinue,
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 550,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, []);

  const cleanName = userName && userName.trim() ? userName.trim() : 'Alex';
  const initialLetter = cleanName.charAt(0).toUpperCase();

  // Subject items configuration
  const displaySubjects = [
    {
      name: subjects[0] || 'Mathematics',
      percent: '85%',
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      emoji: '📐',
    },
    {
      name: subjects[1] || 'Physics',
      percent: '70%',
      iconBg: '#F5F3FF',
      iconColor: '#7C3AED',
      emoji: '⚛️',
    },
    {
      name: subjects[2] || 'Chemistry',
      percent: '50%',
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      emoji: '🧪',
    },
    {
      name: subjects[3] || 'English',
      percent: '80%',
      iconBg: '#FDF2F8',
      iconColor: '#DB2777',
      emoji: '📖',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View
          style={[
            styles.innerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Top Logo */}
          <StudPalLogo />

          {/* Main Title & Subtitle */}
          <View style={styles.headerBlock}>
            <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>Your StudPal is ready</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Your study plan, progress, and settings are safely saved.
            </Text>
          </View>

          {/* Hero Floating Mockup Card Container */}
          <View style={styles.mockupWrapper}>
            {/* Ambient Background Glow Blob */}
            <View style={styles.ambientGlow} />

            {/* Sparkle Burst Accent */}
            <SparkleBurst />

            {/* Floating Mini Dashboard Card */}
            <View style={[styles.mockupCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {/* Card User Header */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitial}>{initialLetter}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardGreeting, { color: theme.textPrimary }]}>Good morning, {cleanName} 👋</Text>
                  <Text style={[styles.cardGreetingSub, { color: theme.textSecondary }]}>Keep going! Great progress!</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} style={styles.gearBtn}>
                  <GearIcon size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* 1. Overall Progress Section */}
              <View style={[styles.overallProgressBox, { backgroundColor: isDark ? '#1E293B' : '#FAFCFF', borderColor: theme.border }]}>
                <Text style={[styles.sectionHeaderTitle, { color: theme.textPrimary }]}>Overall Progress</Text>
                <View style={styles.progressRow}>
                  <MiniProgressDonut percent={68} size={46} />
                  <View style={styles.progressRightCol}>
                    <Text style={[styles.progressSubjectCount, { color: theme.textPrimary }]}>3 of 5 subjects</Text>
                    {/* Linear Bar */}
                    <View style={[styles.progressBarTrack, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
                      <View style={[styles.progressBarFill, { width: '68%' }]} />
                    </View>
                    <View style={styles.statusRow}>
                      <CheckCircleSmall size={11} color="#10B981" />
                      <Text style={styles.statusText}>On track for your goals</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* 2. Subjects Section */}
              <View style={styles.subjectsSection}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={[styles.sectionHeaderTitle, { color: theme.textPrimary }]}>Subjects</Text>
                  <Text style={styles.viewAllText}>View all</Text>
                </View>
                <View style={styles.subjectsGrid}>
                  {displaySubjects.map((subj, idx) => (
                    <View key={idx} style={[styles.subjectTile, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: theme.border }]}>
                      <View style={[styles.subjectIconBox, { backgroundColor: subj.iconBg }]}>
                        <Text style={{ fontSize: 11 }}>{subj.emoji}</Text>
                      </View>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={[styles.subjectNameText, { color: theme.textPrimary }]} numberOfLines={1}>
                          {subj.name}
                        </Text>
                        <Text style={[styles.subjectPercentText, { color: theme.textSecondary }]}>{subj.percent}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* 3. Upcoming Study Sessions */}
              <View style={styles.sessionsSection}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={[styles.sectionHeaderTitle, { color: theme.textPrimary }]}>Upcoming Study Sessions</Text>
                  <Text style={styles.viewAllText}>View all</Text>
                </View>

                <View style={[styles.sessionItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                  <Text style={[styles.sessionTime, { color: theme.textSecondary }]}>10:00 AM</Text>
                  <View style={[styles.sessionIconBox, { backgroundColor: '#EFF6FF' }]}>
                    <Text style={{ fontSize: 10 }}>📐</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sessionSubjName, { color: theme.textPrimary }]}>{displaySubjects[0].name}</Text>
                    <Text style={[styles.sessionDetail, { color: theme.textSecondary }]}>2h • Chapter 4</Text>
                  </View>
                  <ChevronRight size={12} color={theme.textSecondary} />
                </View>

                <View style={[styles.sessionItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                  <Text style={[styles.sessionTime, { color: theme.textSecondary }]}>2:00 PM</Text>
                  <View style={[styles.sessionIconBox, { backgroundColor: '#F5F3FF' }]}>
                    <Text style={{ fontSize: 10 }}>⚛️</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sessionSubjName, { color: theme.textPrimary }]}>{displaySubjects[1].name}</Text>
                    <Text style={[styles.sessionDetail, { color: theme.textSecondary }]}>1.5h • Kinematics</Text>
                  </View>
                  <ChevronRight size={12} color={theme.textSecondary} />
                </View>

                <View style={[styles.sessionItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                  <Text style={[styles.sessionTime, { color: theme.textSecondary }]}>6:00 PM</Text>
                  <View style={[styles.sessionIconBox, { backgroundColor: '#F0FDF4' }]}>
                    <Text style={{ fontSize: 10 }}>🧪</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sessionSubjName, { color: theme.textPrimary }]}>{displaySubjects[2].name}</Text>
                    <Text style={[styles.sessionDetail, { color: theme.textSecondary }]}>1.5h • Organic Chemistry</Text>
                  </View>
                  <ChevronRight size={12} color={theme.textSecondary} />
                </View>
              </View>

              {/* 4. Goal Progress Card */}
              <View style={[styles.goalProgressCard, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: theme.border }]}>
                <View style={styles.goalIconCircle}>
                  <TargetIcon size={14} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.goalTitle, { color: theme.textPrimary }]}>Goal Progress</Text>
                  <Text style={[styles.goalSub, { color: theme.textSecondary }]}>A+ in all subjects</Text>
                  <View style={[styles.goalBarTrack, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
                    <View style={[styles.goalBarFill, { width: '60%' }]} />
                  </View>
                </View>
                <Text style={[styles.goalFraction, { color: theme.textSecondary }]}>3/5</Text>
              </View>
            </View>
          </View>

          {/* Bottom Fixed CTA Button */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onContinue}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryBtnText}>Continue to StudPal ➔</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// 5. STYLES
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // 1. Logo Row
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: -0.3,
  },

  // 2. Title & Subtitle
  headerBlock: {
    marginBottom: 18,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0B1536',
    letterSpacing: -0.7,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 21,
    marginTop: 6,
    letterSpacing: -0.2,
  },

  // 3. Mockup Wrapper & Ambient Glow
  mockupWrapper: {
    position: 'relative',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambientGlow: {
    position: 'absolute',
    width: '90%',
    height: '85%',
    borderRadius: 36,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    transform: [{ scale: 1.05 }],
  },
  sparkleSvg: {
    position: 'absolute',
    top: -14,
    right: 4,
    zIndex: 10,
  },

  // 4. Mini Mockup Card
  mockupCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 12px 32px rgba(37, 99, 235, 0.12), 0 2px 6px rgba(0,0,0,0.04)',
      },
    }),
  },

  // Card Header
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  cardGreeting: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  cardGreetingSub: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  gearBtn: {
    padding: 4,
  },

  // Section Headers
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  viewAllText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },

  // Overall Progress
  overallProgressBox: {
    backgroundColor: '#FAFCFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    padding: 10,
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  donutText: {
    position: 'absolute',
    fontSize: 10.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  progressRightCol: {
    flex: 1,
    gap: 3,
  },
  progressSubjectCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  progressBarTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginVertical: 2,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  statusText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#10B981',
  },

  // Subjects Grid
  subjectsSection: {
    marginBottom: 10,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  subjectTile: {
    flexBasis: '48.5%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  subjectIconBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectNameText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  subjectPercentText: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#64748B',
  },

  // Upcoming Study Sessions
  sessionsSection: {
    marginBottom: 10,
    gap: 4,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4.5,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  sessionTime: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
    minWidth: 46,
  },
  sessionIconBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionSubjName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  sessionDetail: {
    fontSize: 8.5,
    color: '#64748B',
    marginTop: 0.5,
  },

  // Goal Progress Card
  goalProgressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    backgroundColor: '#FAFCFF',
  },
  goalIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  goalSub: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 0.5,
  },
  goalBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 3,
  },
  goalBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#2563EB',
  },
  goalFraction: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },

  // 5. Bottom Primary CTA Button
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2D62FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    shadowColor: '#2D62FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
