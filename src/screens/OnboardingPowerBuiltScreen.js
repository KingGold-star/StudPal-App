import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  ScrollView,
  Easing,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

// High-Fidelity 3D Glassmorphic Floating Plaque with Mascot
function FloatingCrownBadge({ size = 78 }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Gentle 60fps sinusoidal floating bob
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    // Subtle twinkling scale for surrounding sparkles
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.18,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.9,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    floatLoop.start();
    pulseLoop.start();

    return () => {
      floatLoop.stop();
      pulseLoop.stop();
    };
  }, [floatAnim, pulseAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -7],
  });

  const rotate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['5deg', '8deg'],
  });

  return (
    <Animated.View
      style={[
        styles.crownBadgeWrapper,
        {
          transform: [{ translateY }, { rotate }],
        },
      ]}
    >
      {/* Soft Ambient Diffused Backlight */}
      <View style={styles.ambientCrownBacklight} />

      {/* Sparkle 1: Top Right Vibrant Diamond Star */}
      <Animated.View
        style={[
          styles.sparkleTopRight,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <Path
            d="M 9 0 C 9 4.8 12.5 9 18 9 C 12.5 9 9 13.2 9 18 C 9 13.2 5.5 9 0 9 C 5.5 9 9 4.8 9 0 Z"
            fill="#2563EB"
          />
        </Svg>
      </Animated.View>

      {/* Sparkle 2: Bottom Left Soft Blue Diamond Star */}
      <Animated.View
        style={[
          styles.sparkleBottomLeft,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <Svg width="14" height="14" viewBox="0 0 18 18" fill="none">
          <Path
            d="M 9 0 C 9 4.8 12.5 9 18 9 C 12.5 9 9 13.2 9 18 C 9 13.2 5.5 9 0 9 C 5.5 9 9 4.8 9 0 Z"
            fill="#60A5FA"
          />
        </Svg>
      </Animated.View>

      {/* Sparkle 3: Far Left Mini Accent Sparkle Dot */}
      <View style={styles.sparkleFarLeft}>
        <Svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <Circle cx="3" cy="3" r="2.2" fill="#3B82F6" />
        </Svg>
      </View>

      {/* Frosted Glassmorphism Squircle Card with Mascot */}
      <View style={styles.glassCardPlaque}>
        <Svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={StyleSheet.absoluteFill}>
          <Defs>
            {/* Plaque Frosted Glass Gradient */}
            <LinearGradient id="glassPlaqueFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.96" />
              <Stop offset="45%" stopColor="#F4F9FF" stopOpacity="0.92" />
              <Stop offset="100%" stopColor="#E2EFFF" stopOpacity="0.85" />
            </LinearGradient>
          </Defs>

          {/* Frosted Plaque Background */}
          <Rect
            x="3"
            y="3"
            width="74"
            height="74"
            rx="23"
            fill="url(#glassPlaqueFill)"
            stroke="#FFFFFF"
            strokeWidth="2"
          />

          {/* Top Inset Sheen Highlight on Glass Card */}
          <Path
            d="M 22 4.5 L 58 4.5"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </Svg>

        {/* Mascot Image Inside the Square Plaque */}
        <Image
          source={require('../../assets/images/branco_thumbs_up.png')}
          style={styles.mascotImageInSquare}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
}

// 1. Premium Personalized Study Plans Icon (3D Dual-Tone Calendar)
function StudyPlanIcon({ size = 48 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="planBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#EFF6FF" />
          <Stop offset="100%" stopColor="#DBEAFE" />
        </LinearGradient>
        <LinearGradient id="planHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#3B82F6" />
          <Stop offset="100%" stopColor="#1D4ED8" />
        </LinearGradient>
        <LinearGradient id="planSheenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#93C5FD" />
          <Stop offset="100%" stopColor="#60A5FA" />
        </LinearGradient>
      </Defs>

      {/* Squircle Badge Plaque */}
      <Rect x="1" y="1" width="46" height="46" rx="15" fill="url(#planBgGrad)" stroke="#BFDBFE" strokeWidth="1.2" />
      <Path d="M 12 2.5 L 36 2.5" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />

      {/* Calendar Backing */}
      <Rect x="12" y="14" width="24" height="22" rx="6" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.2" />

      {/* Calendar Top Header Bar */}
      <Path d="M 12 20 L 12 18 C 12 15.8 13.8 14 16 14 L 32 14 C 34.2 14 36 15.8 36 18 L 36 20 Z" fill="url(#planHeaderGrad)" />

      {/* Binder Pegs */}
      <Rect x="16.5" y="11.5" width="2.8" height="5" rx="1.4" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="0.8" />
      <Rect x="28.5" y="11.5" width="2.8" height="5" rx="1.4" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="0.8" />

      {/* Calendar Date Dots */}
      <Circle cx="17.5" cy="25" r="1.4" fill="#3B82F6" />
      <Circle cx="24" cy="25" r="1.4" fill="#3B82F6" />
      <Circle cx="30.5" cy="25" r="1.4" fill="#93C5FD" />

      <Circle cx="17.5" cy="30.5" r="1.4" fill="#3B82F6" />
      <Circle cx="24" cy="30.5" r="1.4" fill="#1D4ED8" />
      <Circle cx="30.5" cy="30.5" r="1.4" fill="#3B82F6" />
    </Svg>
  );
}

// 2. Premium Advanced Spaced Repetition Icon (Vibrant Continuous SRS Loop)
function SpacedRepetitionIcon({ size = 48 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="srsBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FAF5FF" />
          <Stop offset="100%" stopColor="#EDE9FE" />
        </LinearGradient>
        <LinearGradient id="srsArrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#A855F7" />
          <Stop offset="50%" stopColor="#8B5CF6" />
          <Stop offset="100%" stopColor="#6D28D9" />
        </LinearGradient>
      </Defs>

      {/* Squircle Badge Plaque */}
      <Rect x="1" y="1" width="46" height="46" rx="15" fill="url(#srsBgGrad)" stroke="#DDD6FE" strokeWidth="1.2" />
      <Path d="M 12 2.5 L 36 2.5" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />

      {/* Top Arc Flow */}
      <Path
        d="M 15 24 C 15 19 19 15 24 15 C 27.8 15 31.2 17.5 32.5 21"
        stroke="url(#srsArrowGrad)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Top Arrowhead */}
      <Path
        d="M 28 21 L 33 21.2 L 33.2 16.2"
        stroke="url(#srsArrowGrad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom Arc Flow */}
      <Path
        d="M 33 24 C 33 29 29 33 24 33 C 20.2 33 16.8 30.5 15.5 27"
        stroke="url(#srsArrowGrad)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Bottom Arrowhead */}
      <Path
        d="M 20 27 L 15 26.8 L 14.8 31.8"
        stroke="url(#srsArrowGrad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Radiant Memory Spark */}
      <Circle cx="24" cy="24" r="2.6" fill="#8B5CF6" />
      <Circle cx="24" cy="24" r="1.2" fill="#FFFFFF" />
    </Svg>
  );
}

// 3. Premium AI Study Companion Icon (Branco Cute AI Bot Face)
function AiCompanionIcon({ size = 48 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="aiBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F0F9FF" />
          <Stop offset="100%" stopColor="#E0F2FE" />
        </LinearGradient>
        <LinearGradient id="botHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#38BDF8" />
          <Stop offset="50%" stopColor="#0284C7" />
          <Stop offset="100%" stopColor="#0369A1" />
        </LinearGradient>
      </Defs>

      {/* Squircle Badge Plaque */}
      <Rect x="1" y="1" width="46" height="46" rx="15" fill="url(#aiBgGrad)" stroke="#BAE6FD" strokeWidth="1.2" />
      <Path d="M 12 2.5 L 36 2.5" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />

      {/* Bot Antenna */}
      <Path d="M 24 11 L 24 16" stroke="#0284C7" strokeWidth="2.4" strokeLinecap="round" />
      <Circle cx="24" cy="10" r="2.2" fill="#38BDF8" stroke="#0284C7" strokeWidth="0.8" />
      <Circle cx="23.4" cy="9.4" r="0.8" fill="#FFFFFF" />

      {/* Bot Ears */}
      <Path d="M 10.5 24.5 L 13.5 24.5" stroke="#0284C7" strokeWidth="2.6" strokeLinecap="round" />
      <Path d="M 34.5 24.5 L 37.5 24.5" stroke="#0284C7" strokeWidth="2.6" strokeLinecap="round" />

      {/* Main Bot Head Housing */}
      <Rect x="13" y="16" width="22" height="17" rx="6" fill="url(#botHeadGrad)" stroke="#0369A1" strokeWidth="1" />

      {/* Face Screen Plate */}
      <Rect x="15" y="18" width="18" height="13" rx="4" fill="#0C4A6E" />

      {/* Glowing Intelligent Eyes with Twinkles */}
      <Circle cx="19.5" cy="24.5" r="2.2" fill="#38BDF8" />
      <Circle cx="18.8" cy="23.8" r="0.8" fill="#FFFFFF" />

      <Circle cx="28.5" cy="24.5" r="2.2" fill="#38BDF8" />
      <Circle cx="27.8" cy="23.8" r="0.8" fill="#FFFFFF" />
    </Svg>
  );
}

// 4. Premium Practice Quizzes Icon (Smart Clipboard & Emerald Verified Badge)
function QuizIcon({ size = 48 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="quizBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFF1F2" />
          <Stop offset="100%" stopColor="#FFE4E6" />
        </LinearGradient>
        <LinearGradient id="clipBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F43F5E" />
          <Stop offset="100%" stopColor="#BE123C" />
        </LinearGradient>
        <LinearGradient id="checkBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#34D399" />
          <Stop offset="100%" stopColor="#059669" />
        </LinearGradient>
      </Defs>

      {/* Squircle Badge Plaque */}
      <Rect x="1" y="1" width="46" height="46" rx="15" fill="url(#quizBgGrad)" stroke="#FECDD3" strokeWidth="1.2" />
      <Path d="M 12 2.5 L 36 2.5" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />

      {/* Clipboard Main Body */}
      <Rect x="13.5" y="14" width="21" height="23" rx="5" fill="#FFFFFF" stroke="#FDA4AF" strokeWidth="1.2" />

      {/* Top Clamp Bar */}
      <Path d="M 18 12 L 30 12 C 30 13.5 29 14.5 27.5 14.5 L 20.5 14.5 C 19 14.5 18 13.5 18 12 Z" fill="#F43F5E" />
      <Circle cx="24" cy="11.5" r="1.4" fill="#FFFFFF" stroke="#BE123C" strokeWidth="0.8" />

      {/* Quiz Item Question Rows */}
      <Path d="M 18 20.5 L 25 20.5" stroke="#F43F5E" strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M 18 25 L 30 25" stroke="#FB7185" strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M 18 29.5 L 27 29.5" stroke="#FB7185" strokeWidth="1.8" strokeLinecap="round" />

      {/* Emerald Verified Check Badge Overlay */}
      <Circle cx="31.5" cy="19.5" r="4.2" fill="url(#checkBadgeGrad)" />
      <Path d="M 29.8 19.5 L 31 20.7 L 33.2 18.2" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// 5. Premium Study Community Icon (Collaborative Sunset Avatars)
function CommunityIcon({ size = 48 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="commBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFBEB" />
          <Stop offset="100%" stopColor="#FEF3C7" />
        </LinearGradient>
        <LinearGradient id="personGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F59E0B" />
          <Stop offset="100%" stopColor="#D97706" />
        </LinearGradient>
        <LinearGradient id="personGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FB923C" />
          <Stop offset="100%" stopColor="#EA580C" />
        </LinearGradient>
      </Defs>

      {/* Squircle Badge Plaque */}
      <Rect x="1" y="1" width="46" height="46" rx="15" fill="url(#commBgGrad)" stroke="#FDE68A" strokeWidth="1.2" />
      <Path d="M 12 2.5 L 36 2.5" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />

      {/* Background Person (Right / Partner) */}
      <Circle cx="30" cy="19" r="4" fill="url(#personGrad1)" stroke="#FFFFFF" strokeWidth="1.2" />
      <Path
        d="M 24 33 C 24 28 26.5 25.5 30 25.5 C 33.5 25.5 36 28 36 33"
        fill="url(#personGrad1)"
        stroke="#FFFFFF"
        strokeWidth="1.2"
      />

      {/* Foreground Main Person (Left / User) */}
      <Circle cx="19" cy="20.5" r="4.8" fill="url(#personGrad2)" stroke="#FFFFFF" strokeWidth="1.4" />
      <Path
        d="M 11.5 35 C 11.5 29 14.8 26.5 19 26.5 C 23.2 26.5 26.5 29 26.5 35"
        fill="url(#personGrad2)"
        stroke="#FFFFFF"
        strokeWidth="1.4"
      />
    </Svg>
  );
}

// 6. Premium Progress Insights Icon (Ascending 3D Analytics Bars)
function ProgressInsightsIcon({ size = 48 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="progBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F0FDF4" />
          <Stop offset="100%" stopColor="#DCFCE7" />
        </LinearGradient>
        <LinearGradient id="barGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#34D399" />
          <Stop offset="100%" stopColor="#059669" />
        </LinearGradient>
        <LinearGradient id="barGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#10B981" />
          <Stop offset="100%" stopColor="#047857" />
        </LinearGradient>
      </Defs>

      {/* Squircle Badge Plaque */}
      <Rect x="1" y="1" width="46" height="46" rx="15" fill="url(#progBgGrad)" stroke="#BBF7D0" strokeWidth="1.2" />
      <Path d="M 12 2.5 L 36 2.5" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />

      {/* Bar 1 (Short) */}
      <Rect x="14" y="27" width="5.5" height="9" rx="2.75" fill="url(#barGrad1)" />

      {/* Bar 2 (Medium) */}
      <Rect x="21.5" y="21" width="5.5" height="15" rx="2.75" fill="url(#barGrad1)" />

      {/* Bar 3 (Tall Mastered) */}
      <Rect x="29" y="14" width="5.5" height="22" rx="2.75" fill="url(#barGrad2)" />

      {/* Trend Arrow Sparkle */}
      <Circle cx="31.75" cy="14" r="1.5" fill="#FFFFFF" />
      <Path d="M 16 23 L 23 18 L 31 12" stroke="#10B981" strokeWidth="1.4" strokeDasharray="2 2" strokeLinecap="round" />
    </Svg>
  );
}

// Feature Showcase Item Component
function FeatureCardItem({ item, theme }) {
  const IconComp = item.component;

  return (
    <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {/* High-End Vector Icon Badge */}
      <View style={styles.iconContainer}>
        <IconComp size={48} />
      </View>

      {/* Text Details */}
      <View style={styles.featureInfo}>
        <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>{item.description}</Text>
      </View>
    </View>
  );
}

const FEATURES = [
  {
    id: 'study-plans',
    title: 'personalized study plans',
    description: 'Plans that adapt to your progress.',
    component: StudyPlanIcon,
  },
  {
    id: 'spaced-repetition',
    title: 'advanced spaced repetition',
    description: "Review what you're most likely to forget.",
    component: SpacedRepetitionIcon,
  },
  {
    id: 'ai-companion',
    title: 'AI Study Companion',
    description: 'Get help when you\'re stuck.',
    component: AiCompanionIcon,
  },
  {
    id: 'practice-quiz',
    title: 'practice quizzes',
    description: 'Test your mastery with instant recall drills.',
    component: QuizIcon,
  },
  {
    id: 'study-community',
    title: 'study community',
    description: 'Connect, share notes, and study with peers.',
    component: CommunityIcon,
  },
  {
    id: 'progress-insights',
    title: 'progress insights',
    description: "Understand what's improving —\nand what needs attention.",
    component: ProgressInsightsIcon,
  },
];

export default function OnboardingPowerBuiltScreen({
  onContinue,
  onBack,
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleContinue = () => {
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
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header Block with Title & Floating Glassmorphic Plaque */}
          <View style={styles.headerBlock}>
            <View style={styles.headerTextWrapper}>
              <Text style={[styles.titleLineOne, { color: theme.textPrimary }]}>everything you built.</Text>
              <Text style={styles.titleLineTwo}>more power behind it.</Text>
              <Text style={[styles.subtextNote, { color: theme.textSecondary }]}>
                Use the tools that help you turn your plan into real progress.
              </Text>
            </View>

            {/* Floating 3D Mascot Plaque */}
            <View style={styles.headerGraphicWrapper}>
              <FloatingCrownBadge size={76} />
            </View>
          </View>

          {/* Feature Showcase List (Static display cards) */}
          <ScrollView
            style={styles.featuresScrollView}
            contentContainerStyle={styles.featuresList}
            showsVerticalScrollIndicator={false}
          >
            {FEATURES.map((feature) => (
              <FeatureCardItem
                key={feature.id}
                item={feature}
                theme={theme}
              />
            ))}
          </ScrollView>

          {/* Bottom Actions Block */}
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleContinue}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryButtonText}>continue</Text>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 14,
    position: 'relative',
  },
  headerTextWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  titleLineOne: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0A0F1D',
    lineHeight: 32,
    letterSpacing: -0.7,
  },
  titleLineTwo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1200C6',
    lineHeight: 32,
    letterSpacing: -0.7,
    marginBottom: 8,
  },
  subtextNote: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 20,
    letterSpacing: -0.2,
    maxWidth: 240,
  },
  headerGraphicWrapper: {
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  crownBadgeWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambientCrownBacklight: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(59, 130, 246, 0.22)',
    filter: Platform.OS === 'web' ? 'blur(18px)' : undefined,
  },
  glassCardPlaque: {
    width: 76,
    height: 76,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  mascotImageInSquare: {
    width: 62,
    height: 62,
    zIndex: 2,
  },
  sparkleTopRight: {
    position: 'absolute',
    top: -9,
    right: -9,
    zIndex: 4,
  },
  sparkleBottomLeft: {
    position: 'absolute',
    bottom: -7,
    left: -9,
    zIndex: 4,
  },
  sparkleFarLeft: {
    position: 'absolute',
    top: 26,
    left: -14,
    zIndex: 4,
  },
  featuresScrollView: {
    flex: 1,
  },
  featuresList: {
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 1,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#F1F5F9',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  featureInfo: {
    flex: 1,
    paddingRight: 8,
  },
  featureTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 2.5,
  },
  featureDescription: {
    fontSize: 12.5,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 17,
    letterSpacing: -0.15,
  },
  bottomActions: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 22,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#1200C6',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
