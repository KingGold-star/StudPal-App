import React, { useState, useEffect, useRef } from 'react';
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
import { ipLocationService } from '../services/ipLocationService';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

// ==========================================
// 1. 3D BRANDED FOCUS PADLOCK PLAQUE (HEADER)
// ==========================================
function FocusLockPlaque({ size = 92 }) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    floatLoop.start();
    return () => floatLoop.stop();
  }, [floatAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -7],
  });

  return (
    <Animated.View style={[styles.lockPlaqueWrapper, { transform: [{ translateY }] }]}>
      {/* Ambient Halo Glow */}
      <View style={styles.ambientPlaqueGlow} />

      <Svg width={size} height={size} viewBox="0 0 92 92" fill="none">
        <Defs>
          {/* Card Gradient: StudPal Electric Blue to Deep Royal */}
          <LinearGradient id="plaqueCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#3B82F6" />
            <Stop offset="45%" stopColor="#2563EB" />
            <Stop offset="100%" stopColor="#1200C6" />
          </LinearGradient>

          {/* Chrome Metallic Shackle */}
          <LinearGradient id="shackleMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="45%" stopColor="#E2E8F0" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>

          {/* Padlock Body Pure Clean White / Ivory Gloss */}
          <LinearGradient id="padlockBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F8FAFC" />
          </LinearGradient>

          <LinearGradient id="haloSheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#93C5FD" />
            <Stop offset="50%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#93C5FD" />
          </LinearGradient>
        </Defs>

        {/* 1. Squircle Plaque Plinth */}
        <Rect
          x="3"
          y="3"
          width="86"
          height="86"
          rx="27"
          fill="url(#plaqueCardGrad)"
          stroke="#FFFFFF"
          strokeWidth="2"
        />

        {/* Top Specular Edge Sheen on Plaque */}
        <Path
          d="M 28 4.5 L 64 4.5"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />

        {/* 2. Floating Focus Halo Ring Above Shackle */}
        <Path
          d="M 31 20 C 31 14.5 61 14.5 61 20 C 61 25.5 31 25.5 31 20 Z"
          stroke="url(#haloSheen)"
          strokeWidth="3.2"
          fill="none"
        />

        {/* 3. Heavy 3D Metallic Shackle Loop */}
        <Path
          d="M 35 48 L 35 33 C 35 22.5 57 22.5 57 33 L 57 48"
          stroke="url(#shackleMetalGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 4. Padlock Squircle Body */}
        <Rect
          x="26.5"
          y="43"
          width="39"
          height="33"
          rx="10"
          fill="url(#padlockBodyGrad)"
          stroke="#CBD5E1"
          strokeWidth="1.2"
        />

        {/* 5. Keyhole / Focus Sparkle Emblem */}
        <Circle cx="46" cy="56" r="3.4" fill="#1200C6" />
        <Path
          d="M 44.5 57 L 47.5 57 L 48.6 66 L 43.4 66 Z"
          fill="#1200C6"
        />
      </Svg>
    </Animated.View>
  );
}

// ==========================================
// 2. PREMIUM VECTOR TIMELINE ICONS
// ==========================================

// Day 1: 3D Metallic Gold Key
function KeyIcon({ size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="goldKeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFBEB" />
          <Stop offset="30%" stopColor="#FDE047" />
          <Stop offset="70%" stopColor="#F59E0B" />
          <Stop offset="100%" stopColor="#D97706" />
        </LinearGradient>
      </Defs>
      {/* Key Bow Head */}
      <Circle cx="9.5" cy="9.5" r="6.5" fill="url(#goldKeyGrad)" stroke="#B45309" strokeWidth="1" />
      <Circle cx="9.5" cy="9.5" r="2.8" fill="#FFFFFF" />
      {/* Key Stem */}
      <Path
        d="M 14.2 14.2 L 23 23"
        stroke="url(#goldKeyGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Key Bit Teeth */}
      <Path d="M 19 19 L 22 16" stroke="url(#goldKeyGrad)" strokeWidth="2.4" strokeLinecap="round" />
      <Path d="M 21.5 21.5 L 24.5 18.5" stroke="url(#goldKeyGrad)" strokeWidth="2.4" strokeLinecap="round" />
      {/* Specular Shine Glint */}
      <Circle cx="8" cy="8" r="1.2" fill="#FFFFFF" />
    </Svg>
  );
}

// Day 2: 3D Sapphire Protection Shield
function ShieldIcon({ size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#60A5FA" />
          <Stop offset="45%" stopColor="#2563EB" />
          <Stop offset="100%" stopColor="#1E40AF" />
        </LinearGradient>
      </Defs>
      {/* Shield Body */}
      <Path
        d="M 14 3 
           L 23 6.5 
           C 23 16 18.5 22.5 14 25.5 
           C 9.5 22.5 5 16 5 6.5 Z"
        fill="url(#shieldGrad)"
        stroke="#1E3A8A"
        strokeWidth="1"
      />
      {/* Specular Left Highlight */}
      <Path
        d="M 14 4.5 L 7.5 7 C 7.5 15 10.5 19.5 14 23 Z"
        fill="#FFFFFF"
        fillOpacity="0.28"
      />
      {/* Central Focus Sparkle Star */}
      <Path
        d="M 14 9.5 C 14 12 15.5 13.5 18 13.5 C 15.5 13.5 14 15 14 17.5 C 14 15 12.5 13.5 10 13.5 C 12.5 13.5 14 12 14 9.5 Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

// Day 3: Electric Focus Lightning Bolt
function LightningIcon({ size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FEF08A" />
          <Stop offset="40%" stopColor="#F59E0B" />
          <Stop offset="100%" stopColor="#EA580C" />
        </LinearGradient>
      </Defs>
      {/* Lightning Bolt */}
      <Path
        d="M 16 2.5 
           L 7 14 
           L 13.5 14 
           L 11.5 25.5 
           L 21.5 12 
           L 15 12 Z"
        fill="url(#boltGrad)"
        stroke="#C2410C"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Specular Glint */}
      <Path
        d="M 15 4.5 L 9.5 13.5 L 14 13.5 Z"
        fill="#FFFFFF"
        fillOpacity="0.5"
      />
    </Svg>
  );
}

// Day 4: 3D Serene Calm Mind / Peaceful Relieved Focus (Zero Guilt, Calmer Mind)
function CalmMindIcon({ size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        {/* Warm Golden Glow Face Gradient */}
        <LinearGradient id="calmFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFBEB" />
          <Stop offset="25%" stopColor="#FEF08A" />
          <Stop offset="70%" stopColor="#FBBF24" />
          <Stop offset="100%" stopColor="#F59E0B" />
        </LinearGradient>
      </Defs>

      {/* 3D Round Face Base */}
      <Circle
        cx="14"
        cy="14"
        r="12"
        fill="url(#calmFaceGrad)"
        stroke="#D97706"
        strokeWidth="1"
      />

      {/* Top Left Specular Sheen Glint */}
      <Path
        d="M 6.5 9.5 C 7.8 6 10.5 4.5 14 4.5"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />

      {/* Left Peaceful Closed Eye (Serene Smile Arc) */}
      <Path
        d="M 8.5 12.5 C 9.5 14.5 11.5 14.5 12.5 12.5"
        stroke="#78350F"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Right Peaceful Closed Eye (Serene Smile Arc) */}
      <Path
        d="M 15.5 12.5 C 16.5 14.5 18.5 14.5 19.5 12.5"
        stroke="#78350F"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Soft Rosy Relaxation Blushes */}
      <Circle cx="8" cy="16" r="2.2" fill="#F43F5E" fillOpacity="0.35" />
      <Circle cx="20" cy="16" r="2.2" fill="#F43F5E" fillOpacity="0.35" />

      {/* Serene Gentle Smile */}
      <Path
        d="M 11 17.5 C 12.5 19.8 15.5 19.8 17 17.5"
        stroke="#78350F"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sparkle of Mental Clarity on top right */}
      <Path
        d="M 23 3.5 C 23 5 24 6 25.5 6 C 24 6 23 7 23 8.5 C 23 7 22 6 20.5 6 C 22 6 23 5 23 3.5 Z"
        fill="#38BDF8"
      />
    </Svg>
  );
}

// Day 5: 3D Smart Book & Spaced Repetition Notes
function BookIcon({ size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="bookCoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#60A5FA" />
          <Stop offset="50%" stopColor="#2563EB" />
          <Stop offset="100%" stopColor="#1D4ED8" />
        </LinearGradient>
      </Defs>
      {/* Left Page Body */}
      <Path
        d="M 4 8 C 8 7 13 8 14 10 L 14 23 C 13 21 8 20 4 21 Z"
        fill="#FFFFFF"
        stroke="#93C5FD"
        strokeWidth="1"
      />
      {/* Right Page Body */}
      <Path
        d="M 24 8 C 20 7 15 8 14 10 L 14 23 C 15 21 20 20 24 21 Z"
        fill="#FFFFFF"
        stroke="#93C5FD"
        strokeWidth="1"
      />
      {/* Book Cover Spine */}
      <Path
        d="M 3 21 C 8 20 13 21 14 23 C 15 21 20 20 25 21"
        stroke="url(#bookCoverGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Gold Ribbon Bookmark */}
      <Path d="M 14 10 L 14 18 L 16 16.5 L 18 18 L 18 10" fill="#F59E0B" />
      {/* Active Recall Text Lines */}
      <Path d="M 7 12 L 11 12" stroke="#60A5FA" strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M 7 15 L 11 15" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M 17 12 L 21 12" stroke="#60A5FA" strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  );
}

// Day 6: 3D Ascending Flight Airplane (Watch Streak & Progress Grow)
function AirplaneIcon({ size = 26 }) {
  return (
    <Image
      source={require('../../assets/images/airplane_takeoff.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}

// Day 7: Brilliant 3D Golden Star of Mastery (Crisp Faceted Jewel Geometry)
function MasteryIcon({ size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="starFacetLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFBEB" />
          <Stop offset="40%" stopColor="#FDE047" />
          <Stop offset="100%" stopColor="#F59E0B" />
        </LinearGradient>
        <LinearGradient id="starFacetDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F59E0B" />
          <Stop offset="60%" stopColor="#D97706" />
          <Stop offset="100%" stopColor="#B45309" />
        </LinearGradient>
      </Defs>
      {/* 5-Point Outer Star Contour */}
      <Path
        d="M 14 2.5 
           L 16.9 10.2 
           L 25 10.4 
           L 18.8 15.5 
           L 21.2 24.5 
           L 14 19.5 
           L 6.8 24.5 
           L 9.2 15.5 
           L 3 10.4 
           L 11.1 10.2 Z"
        fill="url(#starFacetLight)"
        stroke="#B45309"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      {/* 3D Dark Facet Shading on Alternate Halves */}
      {/* Top tip right facet */}
      <Path d="M 14 2.5 L 14 14 L 16.9 10.2 Z" fill="url(#starFacetDark)" />
      {/* Right tip bottom facet */}
      <Path d="M 25 10.4 L 14 14 L 18.8 15.5 Z" fill="url(#starFacetDark)" />
      {/* Bottom-right tip left facet */}
      <Path d="M 21.2 24.5 L 14 14 L 14 19.5 Z" fill="url(#starFacetDark)" />
      {/* Bottom-left tip right facet */}
      <Path d="M 6.8 24.5 L 14 14 L 9.2 15.5 Z" fill="url(#starFacetDark)" />
      {/* Left tip top facet */}
      <Path d="M 3 10.4 L 14 14 L 11.1 10.2 Z" fill="url(#starFacetDark)" />
      
      {/* Center Specular Glint Reflection */}
      <Path
        d="M 14 2.5 L 14 14 L 11.1 10.2 Z"
        fill="#FFFFFF"
        fillOpacity="0.45"
      />
    </Svg>
  );
}

// Highlight: Multi-Tier Blazing Transformation Flame
function FlameIcon({ size = 28 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="flameOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FDE047" />
          <Stop offset="35%" stopColor="#FB923C" />
          <Stop offset="70%" stopColor="#EA580C" />
          <Stop offset="100%" stopColor="#DC2626" />
        </LinearGradient>
        <LinearGradient id="flameInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="50%" stopColor="#FEF08A" />
          <Stop offset="100%" stopColor="#F59E0B" />
        </LinearGradient>
      </Defs>
      {/* Main Outer Flame Silhouette */}
      <Path
        d="M 14 2.5 
           C 15.5 7 18.5 10 20.5 13 
           C 22.5 16.5 22 20.5 19.5 23.5 
           C 17 26.5 13 26.8 10 24.8 
           C 7 22.8 5.5 19 6.8 15 
           C 7.8 12 10 9.8 11 6.5 
           C 12 9.5 13.5 11 14.5 11 
           C 14.8 8.5 14.5 5.5 14 2.5 Z"
        fill="url(#flameOuterGrad)"
      />
      {/* Inner Heart Core Flame */}
      <Path
        d="M 14 12 
           C 15.5 14.5 17 16.5 16.2 19 
           C 15.5 21.5 13 22.5 11.8 21 
           C 10.5 19.5 11 17 12.2 15 
           C 13 13.8 13.8 13 14 12 Z"
        fill="url(#flameInnerGrad)"
      />
      {/* Specular White Core Light */}
      <Circle cx="13.8" cy="18.5" r="1.8" fill="#FFFFFF" fillOpacity="0.9" />
    </Svg>
  );
}

// 7-Day Roadmap Timeline Items with Staggered Widths and Left/Right Alignment
const TIMELINE_STEPS = [
  {
    type: 'card',
    day: 'day 1 - lock in your first session',
    component: KeyIcon,
    align: 'left',
    width: '88%',
    description:
      'complete your first study lock. feel the peace and clarity of putting your goals first, before the noise of social media.',
  },
  {
    type: 'quote',
    align: 'center',
    width: '88%',
    text: 'the hardest part of studying is just starting. once the lock begins, focus follows 🧠',
  },
  {
    type: 'card',
    day: 'day 2 - overcome the resistance',
    component: ShieldIcon,
    align: 'right',
    width: '90%',
    description:
      "the urge to check notifications will pop up. that's just dopamine craving. your app lock shields your focus so you stay in flow.",
  },
  {
    type: 'card',
    day: 'day 3 - anchor your momentum',
    component: LightningIcon,
    align: 'left',
    width: '88%',
    description:
      'study with AI smart notes and active recall. the guided session structure helps you retain hard concepts without burnout.',
  },
  {
    type: 'quote',
    align: 'center',
    width: '90%',
    text: 'consistency beats intensity every time. 50 focused minutes a day rewires your habits 🙌',
  },
  {
    type: 'card',
    day: 'day 4 - feel the difference',
    component: CalmMindIcon,
    align: 'right',
    width: '89%',
    description:
      'start to feel the change: zero guilt about screen time, a calmer mind, and genuine confidence in your subjects.',
  },
  {
    type: 'card',
    day: 'day 5 - see your mastery unfold',
    component: BookIcon,
    align: 'left',
    width: '88%',
    description:
      "your study sessions aren't just logged, they're reinforced. spaced repetition ensures you never forget what you've learned.",
  },
  {
    type: 'card',
    day: 'day 6 - make your level and rank grow',
    component: AirplaneIcon,
    align: 'right',
    width: '89%',
    description:
      'see your progress come to life. your focus analytics, level, and rank become proof of what you are capable of.',
  },
  {
    type: 'card',
    day: 'day 7 - study with total consistency',
    component: MasteryIcon,
    align: 'left',
    width: '88%',
    description:
      'a full week of showing up. this is discipline on autopilot. you have proven that distraction has lost its grip.',
  },
  {
    type: 'highlight',
    day: 'end of week one - the foundation is built',
    component: FlameIcon,
    align: 'center',
    width: '98%',
    description:
      "you've built the foundation. now the real transformation begins: achieving top grades and deep focus as a daily reality.",
  },
];

export default function OnboardingSevenDayRoadmapScreen({ onContinue, onBack }) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const [countryCode, setCountryCode] = useState(ipLocationService.getCountryCode() || 'NG');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    const unsubscribe = ipLocationService.subscribe((code) => {
      if (code) setCountryCode(code);
    });
    return () => unsubscribe();
  }, [fadeAnim]);

  // Dynamic Localized Pricing
  const isNigeria = countryCode === 'NG';
  const priceSubtext = isNigeria
    ? 'just NGN33,000.00 per year (NGN634.61/week)'
    : 'just $39.99 per year ($0.77/week)';

  const handleClaimTrial = () => {
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Scrollable Timeline Content */}
        <Animated.ScrollView
          style={[styles.scrollView, { opacity: fadeAnim }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Visual Plaque */}
          <View style={styles.headerIconSection}>
            <FocusLockPlaque size={92} />
          </View>

          {/* Primary Main Headlines */}
          <View style={styles.headerTextSection}>
            <Text style={[styles.mainHeadline, { color: theme.textPrimary }]}>it's not about more willpower</Text>
            <Text style={styles.subHeadline}>
              it's about building an unbreakable study system
            </Text>
            <Text style={[styles.bodyParagraph, { color: theme.textSecondary }]}>
              the foundation for achieving your academic goals is built when distractions are
              locked away and daily focus becomes effortless. this is your guide back to that place.
            </Text>
            <Text style={[styles.timelineIntroHeader, { color: theme.textSecondary }]}>here's what your first 7 days look like:</Text>
          </View>

          {/* Timeline Roadmap Cards */}
          <View style={styles.timelineList}>
            {TIMELINE_STEPS.map((step, idx) => {
              const IconComp = step.component;

              if (step.type === 'quote') {
                return (
                  <View
                    key={`quote-${idx}`}
                    style={[
                      styles.quoteBubble,
                      { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
                      step.width ? { width: step.width } : null,
                      step.align === 'left' && styles.alignLeft,
                      step.align === 'right' && styles.alignRight,
                      step.align === 'center' && styles.alignCenter,
                    ]}
                  >
                    <Text style={[styles.quoteText, { color: theme.textPrimary }]}>{step.text}</Text>
                  </View>
                );
              }

              if (step.type === 'highlight') {
                return (
                  <View
                    key={`highlight-${idx}`}
                    style={[
                      styles.highlightCard,
                      step.width ? { width: step.width } : null,
                      step.align === 'left' && styles.alignLeft,
                      step.align === 'right' && styles.alignRight,
                      step.align === 'center' && styles.alignCenter,
                    ]}
                  >
                    <View style={styles.highlightIconBadge}>
                      <IconComp size={26} />
                    </View>
                    <View style={styles.cardContentCol}>
                      <Text style={styles.highlightCardTitle}>{step.day}</Text>
                      <Text style={styles.highlightCardBody}>{step.description}</Text>
                    </View>
                  </View>
                );
              }

              return (
                <View
                  key={`card-${idx}`}
                  style={[
                    styles.timelineCard,
                    { backgroundColor: theme.card, borderColor: isDark ? '#3B82F6' : '#2563EB' },
                    step.width ? { width: step.width } : null,
                    step.align === 'left' && styles.alignLeft,
                    step.align === 'right' && styles.alignRight,
                    step.align === 'center' && styles.alignCenter,
                  ]}
                >
                  <View style={styles.cardIconBadge}>
                    <IconComp size={26} />
                  </View>
                  <View style={styles.cardContentCol}>
                    <Text style={[styles.cardTitleText, { color: theme.textPrimary }]}>{step.day}</Text>
                    <Text style={[styles.cardBodyText, { color: theme.textSecondary }]}>{step.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Extra bottom scroll clearance so content isn't covered by sticky bottom bar */}
          <View style={styles.bottomScrollSpacer} />
        </Animated.ScrollView>

        {/* Sticky Fixed Bottom Bar with Paywall Action */}
        <View style={[styles.stickyBottomBar, { backgroundColor: isDark ? 'rgba(11, 15, 25, 0.96)' : 'rgba(255, 255, 255, 0.96)', borderTopColor: theme.border }]}>
          {/* Guarantee Pill */}
          <View style={styles.guaranteeRow}>
            <Svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={styles.checkIcon}>
              <Path
                d="M 2 7 L 5.5 10.5 L 12 3.5"
                stroke={theme.textPrimary}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={[styles.guaranteeText, { color: theme.textPrimary }]}>No Payment Due Now</Text>
          </View>

          {/* Primary CTA Button */}
          <TouchableOpacity
            style={styles.primaryTrialButton}
            onPress={handleClaimTrial}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryTrialButtonText}>try for $0.00</Text>
          </TouchableOpacity>

          {/* Localized Price Info */}
          <Text style={[styles.priceSubtext, { color: theme.textSecondary }]}>{priceSubtext}</Text>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerIconSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  lockPlaqueWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambientPlaqueGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
    filter: Platform.OS === 'web' ? 'blur(16px)' : undefined,
  },
  headerTextSection: {
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 20,
  },
  mainHeadline: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 30,
    marginBottom: 6,
  },
  subHeadline: {
    fontSize: 17.5,
    fontWeight: '700',
    color: '#1200C6',
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 24,
    marginBottom: 12,
  },
  bodyParagraph: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    letterSpacing: -0.2,
    marginBottom: 18,
  },
  timelineIntroHeader: {
    fontSize: 15.5,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  timelineList: {
    gap: 14,
    width: '100%',
  },
  alignLeft: {
    alignSelf: 'flex-start',
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  alignCenter: {
    alignSelf: 'center',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIconBadge: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContentCol: {
    flex: 1,
  },
  cardTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardBodyText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 18.5,
    letterSpacing: -0.15,
  },
  quoteBubble: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: '96%',
  },
  quoteText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 19,
  },
  highlightCard: {
    backgroundColor: '#1200C6',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 5,
  },
  highlightIconBadge: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  highlightCardBody: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.92)',
    lineHeight: 18.5,
    letterSpacing: -0.15,
  },
  bottomScrollSpacer: {
    height: 120,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 18,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 6,
  },
  checkIcon: {
    marginTop: 1,
  },
  guaranteeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  primaryTrialButton: {
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
    marginBottom: 8,
  },
  primaryTrialButtonText: {
    color: '#FFFFFF',
    fontSize: 17.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  priceSubtext: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: -0.15,
    textAlign: 'center',
  },
});
