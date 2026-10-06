import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const STEPS = [
  { key: 'goal', label: 'your goal' },
  { key: 'target', label: 'your target' },
  { key: 'subjects', label: 'your subjects' },
  { key: 'priorities', label: 'your priorities' },
  { key: 'available_time', label: 'your available time' },
  { key: 'study_days', label: 'your study days' },
];

// Rich, premium metallic & brand foil color palette
const PREMIUM_CONFETTI_PALETTE = [
  { bg: '#1200C6', border: '#3B82F6', type: 'royal-blue' },
  { bg: '#2563EB', border: '#93C5FD', type: 'sky-foil' },
  { bg: '#F59E0B', border: '#FDE68A', type: 'gold-foil' },
  { bg: '#FBBF24', border: '#FFFBEB', type: 'bright-gold' },
  { bg: '#10B981', border: '#A7F3D0', type: 'emerald-foil' },
  { bg: '#EC4899', border: '#FBCFE8', type: 'rose-gold' },
  { bg: '#8B5CF6', border: '#DDD6FE', type: 'violet-foil' },
  { bg: '#06B6D4', border: '#A5F3FC', type: 'cyan-foil' },
  { bg: '#E2E8F0', border: '#FFFFFF', type: 'silver-foil' },
];

function MiniSpinner() {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 850,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.spinnerContainer, { transform: [{ rotate: spin }] }]}>
      <View style={styles.spinnerCircle} />
    </Animated.View>
  );
}

// 3D Cute Star Mascot Icon for StudPal with volumetric lighting and sparkle
function StudPalStarIcon({ size = 36 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        {/* Main 3D Puffy Body Gradient */}
        <LinearGradient id="mascotBodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <Stop offset="0%" stopColor="#60A5FA" />
          <Stop offset="30%" stopColor="#3B82F6" />
          <Stop offset="70%" stopColor="#2563EB" />
          <Stop offset="100%" stopColor="#1D4ED8" />
        </LinearGradient>
        {/* Top-Light Soft Ambient Highlight */}
        <LinearGradient id="mascotHighlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#BFDBFE" stopOpacity="0.8" />
          <Stop offset="60%" stopColor="#60A5FA" stopOpacity="0.2" />
          <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </LinearGradient>
        {/* Sparkle Glint Gradient */}
        <LinearGradient id="sparkleCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="50%" stopColor="#E0F2FE" />
          <Stop offset="100%" stopColor="#7DD3FC" />
        </LinearGradient>
      </Defs>

      {/* 1. 4-Point Sparkle Star in upper left */}
      <Path
        d="M10 2 C10 6.5, 6.5 10, 2 10 C6.5 10, 10 13.5, 10 18 C10 13.5, 13.5 10, 18 10 C13.5 10, 10 6.5, 10 2 Z"
        fill="url(#sparkleCoreGrad)"
      />
      {/* Tiny secondary sparkle twinkle */}
      <Circle cx="19" cy="4" r="1.2" fill="#BAE6FD" />

      {/* 2. Star Ambient Soft Shadow */}
      <Path
        d="M25 8 C26.8 8, 28.5 13, 30.5 15.2 C32.5 17.4, 38 18, 39.2 20.2 C40.4 22.4, 36.8 26.8, 36.2 29.5 C35.6 32.2, 38 37.8, 36.2 39.5 C34.4 41.2, 29.2 38, 26.5 38 C23.8 38, 18.6 41.2, 16.8 39.5 C15 37.8, 17.4 32.2, 16.8 29.5 C16.2 26.8, 12.6 22.4, 13.8 20.2 C15 18, 20.5 17.4, 22.5 15.2 C24.5 13, 23.2 8, 25 8 Z"
        fill="#1E40AF"
        opacity="0.25"
        transform="translate(0, 2)"
      />

      {/* 3. Main Puffy 3D Star Body */}
      <Path
        d="M25 7 C26.8 7, 28.5 12, 30.5 14.2 C32.5 16.4, 38 17, 39.2 19.2 C40.4 21.4, 36.8 25.8, 36.2 28.5 C35.6 31.2, 38 36.8, 36.2 38.5 C34.4 40.2, 29.2 37, 26.5 37 C23.8 37, 18.6 40.2, 16.8 38.5 C15 36.8, 17.4 31.2, 16.8 28.5 C16.2 25.8, 12.6 21.4, 13.8 19.2 C15 17, 20.5 16.4, 22.5 14.2 C24.5 12, 23.2 7, 25 7 Z"
        fill="url(#mascotBodyGrad)"
      />

      {/* 4. Top-Left 3D Volumetric Highlight */}
      <Path
        d="M25 7 C26.8 7, 28.5 12, 30.5 14.2 C31.8 15.6, 34.5 16.4, 36.2 17.2 C33.2 19.5, 27.5 19, 23 20 C18.5 21, 16.2 24, 14.5 22 C13.5 20.5, 14 18.5, 15 17.5 C17 15.5, 21 15, 22.8 13.5 C24.2 11.8, 23.5 7, 25 7 Z"
        fill="url(#mascotHighlightGrad)"
      />

      {/* 5. Mascot Eyes with 3D Glossy Catchlights */}
      {/* Left Eye */}
      <Circle cx="21.5" cy="24.5" r="2.1" fill="#0A0F29" />
      <Circle cx="20.8" cy="23.7" r="0.8" fill="#FFFFFF" />

      {/* Right Eye */}
      <Circle cx="29.5" cy="24.5" r="2.1" fill="#0A0F29" />
      <Circle cx="28.8" cy="23.7" r="0.8" fill="#FFFFFF" />

      {/* 6. Cute Smile / Smirk */}
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

// Dynamic Readiness Score Calculation Engine (Calculated over 100 based on all onboarding responses)
export function calculateReadinessScore(data = {}) {
  let score = 0;

  // 1. Confidence Level (Max 25 pts)
  const confidence = (data.confidence || '').toLowerCase();
  if (confidence.includes('very confident') || confidence.includes('advanced')) {
    score += 25;
  } else if (confidence.includes('fairly confident') || confidence.includes('good')) {
    score += 21;
  } else if (confidence.includes('understand the basics') || confidence.includes('basics')) {
    score += 16;
  } else if (confidence.includes('struggle')) {
    score += 11;
  } else {
    score += 16; // default baseline
  }

  // 2. Daily Study Time (Max 25 pts)
  const dailyTime = (data.dailyStudyTime || '').toLowerCase();
  if (dailyTime.includes('3+ hour') || dailyTime.includes('3 hours') || dailyTime.includes('3-4')) {
    score += 25;
  } else if (dailyTime.includes('2–3 hour') || dailyTime.includes('2-3 hour')) {
    score += 23;
  } else if (dailyTime.includes('1–2 hour') || dailyTime.includes('1-2 hour')) {
    score += 20;
  } else if (dailyTime.includes('30–45 min') || dailyTime.includes('30-45 min') || dailyTime.includes('45 min')) {
    score += 15;
  } else if (dailyTime.includes('less than 30') || dailyTime.includes('< 30')) {
    score += 10;
  } else {
    score += 18; // default
  }

  // 3. Weekly Study Days (Max 20 pts)
  const days = Array.isArray(data.studyDays) ? data.studyDays.length : 4;
  const daysScore = Math.min(20, Math.max(6, Math.round((days / 7) * 20)));
  score += daysScore;

  // 4. Phone Screen Time Friction (Max 15 pts - lower screen distraction = higher readiness)
  const phone = (data.phoneTime || '').toLowerCase();
  if (phone.includes('less than 2') || phone.includes('< 2') || phone.includes('1-2') || phone.includes('1–2')) {
    score += 15;
  } else if (phone.includes('2–3') || phone.includes('2-3')) {
    score += 13;
  } else if (phone.includes('3–4') || phone.includes('3-4')) {
    score += 11;
  } else if (phone.includes('4–5') || phone.includes('4-5')) {
    score += 9;
  } else if (phone.includes('5–6') || phone.includes('5-6')) {
    score += 7;
  } else if (phone.includes('6+') || phone.includes('more than 6')) {
    score += 5;
  } else {
    score += 9; // default
  }

  // 5. Target Timeline (Max 15 pts)
  const target = typeof data.targetData === 'string'
    ? data.targetData.toLowerCase()
    : (data.targetData?.label || '').toLowerCase();
  if (target.includes('6 month')) {
    score += 15;
  } else if (target.includes('3 month')) {
    score += 14;
  } else if (target.includes('year')) {
    score += 13;
  } else if (target.includes('1 month')) {
    score += 9;
  } else {
    score += 12; // default
  }

  // Ensure bounded integer between 25 and 95 (never 100 since onboarding indicates room to build)
  return Math.min(95, Math.max(25, Math.round(score)));
}

// Clean Premium Readiness Score Card with dynamic status message
function StudPalScoreCard({ score = 65 }) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const getStatusText = (val) => {
    if (val >= 80) return 'strong baseline - ready to excel';
    if (val >= 60) return 'good - but still need more';
    return 'needs focus - system will bridge the gap';
  };

  return (
    <View style={[styles.scoreCardContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {/* Top Header: Mascot + Brand */}
      <View style={styles.scoreCardHeader}>
        <StudPalStarIcon size={34} />
        <Text style={[styles.scoreCardBrandText, { color: theme.textPrimary }]}>StudPal</Text>
      </View>

      {/* Large Score Metric */}
      <View style={styles.scoreMainRow}>
        <Text style={[styles.scoreBigNumber, { color: theme.textPrimary }]}>{score}</Text>
        <Text style={[styles.scoreDenominator, { color: theme.textSecondary }]}>/100</Text>
      </View>

      {/* Bottom Soft Capsule Bar with Status Text */}
      <View style={[styles.scorePillBar, { backgroundColor: theme.cardSelected }]}>
        <Text style={[styles.scorePillText, { color: theme.accent }]}>{getStatusText(score)}</Text>
      </View>
    </View>
  );
}

// Crisp SVG Checkmark Icon for Feature Cards
function PremiumCheckIcon({ size = 15, color = '#1200C6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M3.2 8.4 L6.4 11.6 L12.8 4.6"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Clean Premium Feature Highlight Card
function HighlightFeatureCard({ title, desc }) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  return (
    <View style={[styles.highlightCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.highlightIconBox, { backgroundColor: theme.cardSelected, borderColor: theme.cardSelectedBorder }]}>
        <PremiumCheckIcon size={14} color={theme.accent} />
      </View>
      <View style={styles.highlightContent}>
        <Text style={[styles.highlightTitle, { color: theme.textPrimary }]}>{title}</Text>
        <Text style={[styles.highlightDesc, { color: theme.textSecondary }]}>{desc}</Text>
      </View>
    </View>
  );
}

// Single Premium Confetti Particle with realistic 3D tumble, flutter & air resistance
function PremiumConfettiPiece({ config }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: config.duration,
      delay: config.delay,
      easing: Easing.bezier(0.18, 0.89, 0.32, 1),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [anim, config]);

  // Trajectory with natural horizontal sway (flutter)
  const translateX = anim.interpolate({
    inputRange: [0, 0.3, 0.65, 1],
    outputRange: [0, config.peakX, config.peakX + config.sway1, config.endX],
  });

  // Vertical trajectory: explosive pop upward -> float at peak -> smooth flutter fall
  const translateY = anim.interpolate({
    inputRange: [0, 0.28, 0.6, 1],
    outputRange: [0, config.peakY, config.peakY * 0.4 + config.fallY * 0.3, config.fallY],
  });

  // 3D Coin-flip tumble effect (rotation around X, Y, and Z axes)
  const rotateZ = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${config.rotateZ}deg`],
  });

  const rotateX = anim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', `${config.flipX * 0.25}deg`, `${config.flipX * 0.5}deg`, `${config.flipX * 0.75}deg`, `${config.flipX}deg`],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.08, 0.75, 1],
    outputRange: [0, 1, 0.95, 0],
  });

  const scale = anim.interpolate({
    inputRange: [0, 0.12, 0.8, 1],
    outputRange: [0.2, 1.1, 0.95, 0.5],
  });

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          left: config.startX,
          top: config.startY,
          width: config.width,
          height: config.height,
          borderRadius: config.borderRadius,
          backgroundColor: config.color.bg,
          borderWidth: config.hasBorder ? 0.8 : 0,
          borderColor: config.color.border,
          shadowColor: config.color.bg,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.35,
          shadowRadius: 3,
          elevation: 4,
          opacity,
          transform: [
            { translateX },
            { translateY },
            { rotateZ },
            { rotateX },
            { scale },
          ],
        },
      ]}
      pointerEvents="none"
    />
  );
}

// Multi-side Realistic Confetti Cannon
function ConfettiBurst() {
  const particles = useMemo(() => {
    const items = [];
    const count = 50; // Rich luxurious celebration volume

    const effectiveWidth = SCREEN_WIDTH > 420 ? 400 : SCREEN_WIDTH;

    for (let i = 0; i < count; i++) {
      // 1. Alternating origins (Left cannon, Right cannon, and high side pops)
      const side = i % 3; // 0: Left, 1: Right, 2: Center-high
      let startX, startY, peakX, endX, peakY, fallY;

      if (side === 0) {
        // Left Cannon: launches upward-right into the center
        startX = -15 + Math.random() * 30;
        startY = 240 + Math.random() * 260;
        peakX = 70 + Math.random() * 150;
        endX = peakX + (Math.random() * 60 - 20);
        peakY = -(160 + Math.random() * 190);
        fallY = 180 + Math.random() * 300;
      } else if (side === 1) {
        // Right Cannon: launches upward-left into the center
        startX = effectiveWidth - 25 + Math.random() * 30;
        startY = 240 + Math.random() * 260;
        peakX = -(70 + Math.random() * 150);
        endX = peakX + (Math.random() * 60 - 40);
        peakY = -(160 + Math.random() * 190);
        fallY = 180 + Math.random() * 300;
      } else {
        // Upper Sides floater burst
        const fromLeft = Math.random() > 0.5;
        startX = fromLeft ? 10 + Math.random() * 60 : effectiveWidth - 70 + Math.random() * 60;
        startY = 120 + Math.random() * 160;
        peakX = fromLeft ? (40 + Math.random() * 80) : -(40 + Math.random() * 80);
        endX = peakX + (Math.random() * 40 - 20);
        peakY = -(70 + Math.random() * 110);
        fallY = 220 + Math.random() * 280;
      }

      // 2. Realistic Foil Shapes: Ribbons, Circles, Diamonds, Squares
      const shapeType = i % 4;
      let width, height, borderRadius;

      if (shapeType === 0) {
        // Long metallic foil ribbon
        width = 5 + Math.random() * 3;
        height = 16 + Math.random() * 8;
        borderRadius = 2;
      } else if (shapeType === 1) {
        // Metallic circular coin / disc
        const size = 7 + Math.random() * 4;
        width = size;
        height = size;
        borderRadius = size / 2;
      } else if (shapeType === 2) {
        // Crisp rectangular foil flake
        width = 8 + Math.random() * 4;
        height = 10 + Math.random() * 5;
        borderRadius = 3;
      } else {
        // Diamond shimmer flake
        width = 7 + Math.random() * 3;
        height = 7 + Math.random() * 3;
        borderRadius = 1.5;
      }

      const color = PREMIUM_CONFETTI_PALETTE[i % PREMIUM_CONFETTI_PALETTE.length];
      const rotateZ = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 720);
      const flipX = (Math.random() > 0.5 ? 1 : -1) * (720 + Math.random() * 1080);
      const sway1 = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 35);
      const duration = 2400 + Math.random() * 900;
      const delay = Math.random() * 280;

      items.push({
        id: `confetti-premium-${i}`,
        startX,
        startY,
        peakX,
        endX,
        peakY,
        fallY,
        sway1,
        width,
        height,
        borderRadius,
        color,
        hasBorder: Math.random() > 0.3,
        rotateZ,
        flipX,
        duration,
        delay,
      });
    }

    return items;
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <PremiumConfettiPiece key={p.id} config={p} />
      ))}
    </View>
  );
}

export default function OnboardingSystemBuildingScreen({
  onContinue,
  onBack,
  userName = 'Alex',
  onboardingData = {},
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const congratsFadeAnim = useRef(new Animated.Value(0)).current;
  const congratsSlideAnim = useRef(new Animated.Value(24)).current;
  const [completedSteps, setCompletedSteps] = useState(0); // Starts at step 0 (your goal)
  const [isDone, setIsDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Compute dynamic score over 100 based on all user answers from beginning to end
  const calculatedScore = useMemo(() => {
    return calculateReadinessScore(onboardingData);
  }, [onboardingData]);

  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Screen entrance animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    // Progression timers: each line loads for exactly 1.5 seconds (1500ms)
    const STEP_DURATION_MS = 1500;
    const timers = [
      setTimeout(() => setCompletedSteps(1), STEP_DURATION_MS * 1), // 1.5s -> your goal done, your target loads
      setTimeout(() => setCompletedSteps(2), STEP_DURATION_MS * 2), // 3.0s -> your target done, your subjects loads
      setTimeout(() => setCompletedSteps(3), STEP_DURATION_MS * 3), // 4.5s -> your subjects done, your priorities loads
      setTimeout(() => setCompletedSteps(4), STEP_DURATION_MS * 4), // 6.0s -> your priorities done, your available time loads
      setTimeout(() => setCompletedSteps(5), STEP_DURATION_MS * 5), // 7.5s -> your available time done, your study days loads
      setTimeout(() => {
        setCompletedSteps(6);
        setIsDone(true);
        setShowConfetti(true);
      }, STEP_DURATION_MS * 6),                                     // 9.0s -> all steps complete
    ];

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [fadeAnim]);

  // When loading completes, trigger smooth entrance of the congratulatory state and score count-up
  useEffect(() => {
    if (isDone) {
      Animated.parallel([
        Animated.timing(congratsFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(congratsSlideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();

      // Smooth Ease-Out Score Counter Animation
      const targetScore = calculatedScore;
      const duration = 1200;
      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(ease * targetScore);
        setDisplayScore(current);

        if (progress >= 1) {
          clearInterval(interval);
          setDisplayScore(targetScore);
        }
      }, 16);

      return () => clearInterval(interval);
    }
  }, [isDone, calculatedScore, congratsFadeAnim, congratsSlideAnim]);

  const displayName = userName && typeof userName === 'string' && userName.trim()
    ? userName.trim()
    : 'Friend';

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      {/* Soft, premium multi-side celebratory burst of confetti upon celebration reveal */}
      {showConfetti && <ConfettiBurst />}

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']} pointerEvents="box-none">
        {!isDone ? (
          /* ============================================================ */
          /* 1. LOADING PHASE: Progressive Milestone Checklist            */
          /* ============================================================ */
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [14, 0],
                    }),
                  },
                ],
              },
            ]}
            pointerEvents="none"
          >
            {/* Header Title */}
            <View style={styles.headerSection}>
              <Text style={[styles.titleText, { color: theme.textPrimary }]}>
                building your{'\n'}study system
              </Text>
            </View>

            {/* Checklist / Milestone Items */}
            <View style={styles.listSection}>
              {STEPS.map((step, index) => {
                const isChecked = index < completedSteps;
                const isCurrent = index === completedSteps;
                const isPending = index > completedSteps;

                return (
                  <View key={step.key} style={styles.itemRow}>
                    <Text
                      style={[
                        styles.itemText,
                        isChecked && [styles.itemTextChecked, { color: theme.textPrimary }],
                        isCurrent && [styles.itemTextCurrent, { color: theme.textPrimary }],
                        isPending && [styles.itemTextPending, { color: theme.textMuted }],
                      ]}
                    >
                      {step.label}
                    </Text>

                    {isChecked && (
                      <Text style={[styles.checkmarkIcon, { color: theme.accent }]}>✓</Text>
                    )}

                    {isCurrent && (
                      <View style={styles.spinnerWrapper}>
                        <MiniSpinner />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Status Message */}
            <View style={styles.statusSection}>
              <Text style={[styles.statusText, { color: theme.textPrimary }]}>
                your plan is taking shape.
              </Text>
            </View>
          </Animated.View>
        ) : (
          /* ============================================================ */
          /* 2. CONGRATULATORY PHASE: Score Card & Celebration Details     */
          /* ============================================================ */
          <Animated.View
            style={[
              styles.congratsContainer,
              {
                opacity: congratsFadeAnim,
                transform: [{ translateY: congratsSlideAnim }],
              },
            ]}
          >
            {/* StudPal Dynamic Calculated Score / 100 Card */}
            <StudPalScoreCard score={displayScore || calculatedScore} />

            {/* Congratulatory Headline */}
            <View style={styles.congratsHeaderSection}>
              <Text style={[styles.congratsTitle, { color: theme.textPrimary }]}>
                your study system{'\n'}is built!
              </Text>
              <Text style={[styles.congratsSubtitle, { color: theme.textSecondary }]}>
                Congratulations {displayName}, your personalized study plan has been generated and calibrated for your success.
              </Text>
            </View>

            {/* System Highlights Cards */}
            <View style={styles.highlightsContainer}>
              <HighlightFeatureCard
                title="Goals & Milestones"
                desc="Customized to your target timeline"
              />
              <HighlightFeatureCard
                title="Distraction Defense"
                desc="Optimized for consistent deep focus"
              />
              <HighlightFeatureCard
                title="Adaptive Schedule"
                desc="Structured around your peak study hours"
              />
            </View>

            {/* Action Footer Card matching reference */}
            <View style={[styles.footerPromptCard, { backgroundColor: isDark ? theme.card : '#E5E7EB' }]}>
              <Text style={[styles.buttonPromptTitle, { color: theme.textPrimary }]}>
                Your study plan is almost ready.
              </Text>
              <Text style={[styles.buttonPromptSubtitle, { color: theme.textSecondary }]}>
                Keep going to make it yours.
              </Text>

              <TouchableOpacity
                style={styles.primaryActionButton}
                onPress={onContinue}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryActionButtonText}>continue building</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
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
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 48,
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 44,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 36,
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  listSection: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 56,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  itemText: {
    fontSize: 17,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  itemTextChecked: {
    fontWeight: '600',
    color: '#0F172A',
  },
  itemTextCurrent: {
    fontWeight: '600',
    color: '#0F172A',
  },
  itemTextPending: {
    fontWeight: '400',
    color: '#94A3B8',
  },
  checkmarkIcon: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 6,
  },
  spinnerWrapper: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderTopColor: '#3B82F6',
    borderRightColor: '#2563EB',
  },
  statusSection: {
    marginTop: 24,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  /* StudPal Score Card Styles (Replaces the old Icon) */
  scoreCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 22,
    borderWidth: 1.2,
    borderColor: '#E5EEFA',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 7,
    marginBottom: 18,
  },
  scoreCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  scoreCardBrandText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A0F29',
    letterSpacing: -0.3,
  },
  scoreMainRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  scoreBigNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: '#050B20',
    letterSpacing: -2,
    lineHeight: 72,
  },
  scoreDenominator: {
    fontSize: 36,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: -0.5,
    marginLeft: 3,
  },
  scorePillBar: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: '#EDF4FF',
    borderRadius: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scorePillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#3B5998',
    letterSpacing: -0.2,
  },

  /* Congratulatory Phase Styles */
  congratsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 8,
  },
  congratsHeaderSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  congratsTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 35,
    textAlign: 'center',
    letterSpacing: -0.7,
    marginBottom: 8,
  },
  congratsSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  highlightsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.2,
    borderColor: '#E8EEF8',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  highlightIconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EEF4FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.25,
    marginBottom: 2,
  },
  highlightDesc: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 17,
  },
  footerPromptCard: {
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonPromptTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  buttonPromptSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555A64',
    textAlign: 'center',
    letterSpacing: -0.2,
    marginTop: 4,
    marginBottom: 16,
  },
  primaryActionButton: {
    width: '100%',
    backgroundColor: '#1200C6',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },

  /* Premium Confetti Styles */
  confettiPiece: {
    position: 'absolute',
    zIndex: 999,
  },
});
