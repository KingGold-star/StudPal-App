import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Circle,
  Rect,
} from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

// ==========================================
// 1. CUSTOM SVG ICONS MATCHING USER SCREENSHOT
// ==========================================

// 1. Personalized Study Plans: Blue calendar with event dots
function StudyPlansIcon({ size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Calendar body frame */}
      <Rect
        x="3.2"
        y="4.5"
        width="17.6"
        height="16"
        rx="3.5"
        stroke="#2563EB"
        strokeWidth="1.8"
      />
      {/* Top hanger pins */}
      <Path d="M8 2.5V5.5M16 2.5V5.5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
      {/* Header divider */}
      <Path d="M3.2 9.5H20.8" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
      {/* Grid of study dots */}
      <Circle cx="7.8" cy="13" r="1.2" fill="#2563EB" />
      <Circle cx="12" cy="13" r="1.2" fill="#2563EB" />
      <Circle cx="16.2" cy="13" r="1.2" fill="#2563EB" />
      <Circle cx="7.8" cy="16.5" r="1.2" fill="#2563EB" />
      <Circle cx="12" cy="16.5" r="1.2" fill="#2563EB" />
      <Circle cx="16.2" cy="16.5" r="1.2" fill="#2563EB" />
    </Svg>
  );
}

// 2. Advanced Spaced Repetition: Purple dual circular repeat/refresh cycle
function SpacedRepetitionIcon({ size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top arc */}
      <Path
        d="M19.5 11.5A7.5 7.5 0 0 0 6.2 7.2"
        stroke="#7C3AED"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <Path
        d="M7 3.5V7.5H3"
        stroke="#7C3AED"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom arc */}
      <Path
        d="M4.5 12.5A7.5 7.5 0 0 0 17.8 16.8"
        stroke="#7C3AED"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <Path
        d="M17 20.5V16.5H21"
        stroke="#7C3AED"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 3. AI Study Companion: Friendly cyan robot head
function AiCompanionIcon({ size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top Antenna */}
      <Circle cx="12" cy="3" r="1.3" fill="#0284C7" />
      <Path d="M12 4.3V6.5" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" />
      {/* Side Ears */}
      <Rect x="2.5" y="10.5" width="2" height="4" rx="1" fill="#0284C7" />
      <Rect x="19.5" y="10.5" width="2" height="4" rx="1" fill="#0284C7" />
      {/* Robot Face */}
      <Rect x="4.5" y="6.5" width="15" height="12" rx="4.5" fill="#0284C7" />
      {/* Eyes */}
      <Circle cx="9.2" cy="11.8" r="1.6" fill="#FFFFFF" />
      <Circle cx="14.8" cy="11.8" r="1.6" fill="#FFFFFF" />
      {/* Friendly Mouth */}
      <Path d="M10.2 15H13.8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

// 4. Practice Quizzes: Rose clipboard with green checkmark badge
function PracticeQuizzesIcon({ size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Clipboard frame */}
      <Rect x="4.5" y="5" width="15" height="16" rx="3" stroke="#E11D48" strokeWidth="1.8" />
      {/* Top Clip */}
      <Path
        d="M9.5 3H14.5V5.5H9.5V3Z"
        stroke="#E11D48"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="#FFE4E6"
      />
      {/* Document lines */}
      <Path
        d="M7.5 10H12.5M7.5 13.5H16.5M7.5 17H13.5"
        stroke="#E11D48"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Green Badge with checkmark on top-right */}
      <Circle cx="16.5" cy="8.5" r="3.6" fill="#10B981" />
      <Path
        d="M15.2 8.5L16.2 9.5L17.8 7.5"
        stroke="#FFFFFF"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 5. Study Community: Amber peer avatars
function StudyCommunityIcon({ size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Primary Person */}
      <Circle cx="8" cy="8.5" r="3.2" fill="#D97706" />
      <Path
        d="M3 18C3 15.2 5.2 13 8 13C10.8 13 13 15.2 13 18"
        fill="#D97706"
      />
      {/* Secondary Peer */}
      <Circle cx="16" cy="10" r="2.7" fill="#F59E0B" />
      <Path
        d="M13 18C13.2 16.2 14.5 14.8 16.5 14.8C18.5 14.8 20.5 16.2 21 18"
        fill="#F59E0B"
      />
    </Svg>
  );
}

// 6. Progress Insights: Emerald bar chart with upward trend arrow
function ProgressInsightsIcon({ size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 3 Ascending Bar Chart columns */}
      <Rect x="4" y="14" width="3.2" height="7" rx="1.6" fill="#059669" />
      <Rect x="9.5" y="10" width="3.2" height="11" rx="1.6" fill="#059669" />
      <Rect x="15" y="6" width="3.2" height="15" rx="1.6" fill="#059669" />
      {/* Upward trend arrow */}
      <Path
        d="M5 9.5L10.5 5.5L14 8.5L19.5 3.5"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 3.5H19.5V7"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ==========================================
// 2. TOGGLE SWITCH COMPONENT
// ==========================================

function ToggleSwitch({ isOn, onToggle, isDark }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      style={[
        styles.toggleTrack,
        {
          backgroundColor: isOn
            ? '#2563EB'
            : isDark
            ? 'rgba(255, 255, 255, 0.16)'
            : '#E2E8F0',
        },
      ]}
    >
      <View
        style={[
          styles.toggleKnob,
          isOn ? styles.toggleKnobOn : styles.toggleKnobOff,
        ]}
      />
    </TouchableOpacity>
  );
}

// ==========================================
// 3. LEARNING OPTIONS CONFIGURATION
// ==========================================

const LEARNING_OPTIONS = [
  {
    id: 'personalizedStudyPlans',
    title: 'personalized study plans',
    subtitle: 'Plans that adapt to your progress.',
    icon: StudyPlansIcon,
    bgLight: '#EFF6FF',
    borderLight: '#DBEAFE',
    bgDark: 'rgba(37, 99, 235, 0.18)',
    borderDark: 'rgba(37, 99, 235, 0.35)',
  },
  {
    id: 'advancedSpacedRepetition',
    title: 'advanced spaced repetition',
    subtitle: "Review what you're most likely to forget.",
    icon: SpacedRepetitionIcon,
    bgLight: '#F5F3FF',
    borderLight: '#DDD6FE',
    bgDark: 'rgba(124, 58, 237, 0.18)',
    borderDark: 'rgba(124, 58, 237, 0.35)',
  },
  {
    id: 'aiStudyCompanion',
    title: 'AI Study Companion',
    subtitle: "Get help when you're stuck.",
    icon: AiCompanionIcon,
    bgLight: '#F0F9FF',
    borderLight: '#BAE6FD',
    bgDark: 'rgba(2, 132, 199, 0.18)',
    borderDark: 'rgba(2, 132, 199, 0.35)',
  },
  {
    id: 'practiceQuizzes',
    title: 'practice quizzes',
    subtitle: 'Test your mastery with instant recall drills.',
    icon: PracticeQuizzesIcon,
    bgLight: '#FFF1F2',
    borderLight: '#FECDD3',
    bgDark: 'rgba(225, 29, 72, 0.18)',
    borderDark: 'rgba(225, 29, 72, 0.35)',
  },
  {
    id: 'studyCommunity',
    title: 'study community',
    subtitle: 'Connect, share notes, and study with peers.',
    icon: StudyCommunityIcon,
    bgLight: '#FFFBEB',
    borderLight: '#FDE68A',
    bgDark: 'rgba(217, 119, 6, 0.18)',
    borderDark: 'rgba(217, 119, 6, 0.35)',
  },
  {
    id: 'progressInsights',
    title: 'progress insights',
    subtitle: "Understand what's improving — and what needs attention.",
    icon: ProgressInsightsIcon,
    bgLight: '#ECFDF5',
    borderLight: '#A7F3D0',
    bgDark: 'rgba(5, 150, 105, 0.18)',
    borderDark: 'rgba(5, 150, 105, 0.35)',
  },
];

// ==========================================
// 4. MAIN SCREEN COMPONENT
// ==========================================

export default function OnboardingPersonalizeLearningScreen({
  onContinue,
  onBack,
  initialPreferences = {},
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const [preferences, setPreferences] = useState(() => ({
    personalizedStudyPlans: initialPreferences?.personalizedStudyPlans ?? true,
    advancedSpacedRepetition: initialPreferences?.advancedSpacedRepetition ?? true,
    aiStudyCompanion:
      initialPreferences?.aiStudyCompanion ??
      initialPreferences?.aiExplanations ??
      true,
    practiceQuizzes:
      initialPreferences?.practiceQuizzes ??
      initialPreferences?.quizzes ??
      true,
    studyCommunity: initialPreferences?.studyCommunity ?? true,
    progressInsights:
      initialPreferences?.progressInsights ??
      initialPreferences?.revisionPlanning ??
      true,
  }));

  const [btnScale] = useState(new Animated.Value(1));

  const toggleOption = (id) => {
    setPreferences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePressIn = () => {
    Animated.spring(btnScale, {
      toValue: 0.975,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(btnScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue(preferences);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Header Block */}
          <View style={styles.headerBlock}>
            <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
              Personalize your learning
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Choose what kind of help you'd like from StudPal.
            </Text>
          </View>

          {/* Cards List */}
          <View style={styles.cardsList}>
            {LEARNING_OPTIONS.map((item) => {
              const isOn = !!preferences[item.id];
              const IconComp = item.icon;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.035)' : '#FFFFFF',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                    },
                  ]}
                  onPress={() => toggleOption(item.id)}
                  activeOpacity={0.78}
                >
                  {/* Left Icon Badge */}
                  <View
                    style={[
                      styles.iconBadge,
                      {
                        backgroundColor: isDark ? item.bgDark : item.bgLight,
                        borderColor: isDark ? item.borderDark : item.borderLight,
                      },
                    ]}
                  >
                    <IconComp size={22} />
                  </View>

                  {/* Middle Content */}
                  <View style={styles.cardContent}>
                    <Text
                      style={[
                        styles.cardTitle,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.cardSubtitle,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {item.subtitle}
                    </Text>
                  </View>

                  {/* Right Toggle */}
                  <ToggleSwitch
                    isOn={isOn}
                    onToggle={() => toggleOption(item.id)}
                    isDark={isDark}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Primary Button */}
        <View style={styles.footerContainer}>
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
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
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerBlock: {
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
    paddingBottom: 14,
  },
  mainTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#0A1838',
    letterSpacing: -0.6,
    lineHeight: 33,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  cardsList: {
    marginTop: 4,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  cardContent: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 12.2,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 16.5,
    letterSpacing: -0.1,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2.5,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 23,
    height: 23,
    borderRadius: 11.5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },
  toggleKnobOff: {
    alignSelf: 'flex-start',
  },
  footerContainer: {
    paddingVertical: Platform.OS === 'ios' ? 10 : 14,
  },
  continueButton: {
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
