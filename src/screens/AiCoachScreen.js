import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  StatusBar,
  Alert,
  Keyboard,
  Platform,
  Modal,
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import Svg, { Path, Circle, Line, Rect, Defs, RadialGradient, Stop, G } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '../theme/colors';
import { gamificationService } from '../services/gamification/gamificationService';
import { settingsService } from '../services/settings/settingsService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const USE_NATIVE = Platform.OS !== 'web';

// ─── SVG Icons ──────────────────────────────────────────────────────────────

const SparklesIcon = ({ color = '#2D62FF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </Svg>
);

const MenuIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="3" y1="6" x2="21" y2="6" />
    <Line x1="3" y1="12" x2="21" y2="12" />
    <Line x1="3" y1="18" x2="21" y2="18" />
  </Svg>
);

const PlusIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);

const PaperclipIcon = ({ color = '#64748B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </Svg>
);

const MicIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <Line x1="12" y1="19" x2="12" y2="23" />
    <Line x1="8" y1="23" x2="16" y2="23" />
  </Svg>
);

const WaveformIcon = ({ color = '#FFFFFF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <Line x1="4" y1="10" x2="4" y2="14" />
    <Line x1="8" y1="6" x2="8" y2="18" />
    <Line x1="12" y1="3" x2="12" y2="21" />
    <Line x1="16" y1="6" x2="16" y2="18" />
    <Line x1="20" y1="10" x2="20" y2="14" />
  </Svg>
);

const ArrowUpIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="19" x2="12" y2="5" />
    <Path d="M5 12l7-7 7 7" />
  </Svg>
);

const CloseIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

const SendIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 2L11 13" />
    <Path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </Svg>
);

const BookOpenIcon = ({ color = '#6236FF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </Svg>
);

const GraduationCapIcon = ({ color = '#6236FF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <Path d="M6 12v5c3 3 9 3 12 0v-5" />
  </Svg>
);

const BrainIcon = ({ color = '#6236FF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2z" />
    <Path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2z" />
  </Svg>
);

const ChevronDownIcon = ({ color = '#64748B', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9l6 6 6-6" />
  </Svg>
);

const ChevronUpIcon = ({ color = '#64748B', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 15l-6-6-6 6" />
  </Svg>
);

const SpeakerIcon = ({ color = '#2D62FF', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 5L6 9H2v6h4l5 4V5z" />
    <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </Svg>
);

const BookmarkIcon = ({ color = '#FF5B00', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

const CheckIcon = ({ color = '#16A34A', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const ShareIcon = ({ color = '#112B8A', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="18" cy="5" r="3" />
    <Circle cx="6" cy="12" r="3" />
    <Circle cx="18" cy="19" r="3" />
    <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
  </Svg>
);

const ChatIcon = ({ color = '#64748B', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

const CompassNavIcon = ({ color = '#6236FF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
  </Svg>
);

const HomeNavIcon = ({ color = '#2D62FF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 10.5L12 3l9 7.5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z" />
    <Path d="M9 21.5v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6" />
  </Svg>
);

const SubjectsNavIcon = ({ color = '#6236FF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </Svg>
);

const StudyFlashNavIcon = ({ color = '#10B981', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Svg>
);

const CalendarNavIcon = ({ color = '#F59E0B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const TrophyNavIcon = ({ color = '#EC4899', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
    <Path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
    <Path d="M6 3h12v7a6 6 0 0 1-12 0V3z" />
    <Path d="M12 16v4" />
    <Path d="M8 21h8" />
  </Svg>
);

const UserNavIcon = ({ color = '#0EA5E9', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="7" r="4" />
    <Path d="M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
  </Svg>
);

const SettingsNavIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

const ChevronRightNavIcon = ({ color = '#94A3B8', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

// ─── Destination Routes Configuration ───────────────────────────────────────

const NAV_DESTINATIONS = [
  {
    id: 'dashboard',
    tab: 'home',
    title: 'Home',
    subtitle: 'Dashboard, focus timer & streaks',
    icon: HomeNavIcon,
    accentColor: '#2D62FF',
    bgColor: '#EFF6FF',
  },
  {
    id: 'subjects',
    tab: 'subjects',
    title: 'Subjects',
    subtitle: 'Courses, syllabus & topic mastery',
    icon: SubjectsNavIcon,
    accentColor: '#6236FF',
    bgColor: '#F0EEFF',
  },
  {
    id: 'study',
    tab: 'study',
    title: 'Study & Flashcards',
    subtitle: 'Spaced repetition (SRS) review',
    icon: StudyFlashNavIcon,
    accentColor: '#10B981',
    bgColor: '#ECFDF5',
  },
  {
    id: 'schedule',
    tab: null,
    title: 'Schedule',
    subtitle: 'Daily study planner & timeline',
    icon: CalendarNavIcon,
    accentColor: '#F59E0B',
    bgColor: '#FFFBEB',
  },
  {
    id: 'leaderboard',
    tab: null,
    title: 'Leaderboard & XP',
    subtitle: 'Weekly ranks & achievements',
    icon: TrophyNavIcon,
    accentColor: '#EC4899',
    bgColor: '#FDF2F8',
  },
  {
    id: 'profile',
    tab: 'profile',
    title: 'Profile',
    subtitle: 'Scholar level, stats & goals',
    icon: UserNavIcon,
    accentColor: '#0EA5E9',
    bgColor: '#E0F2FE',
  },
  {
    id: 'settings',
    tab: null,
    title: 'Settings',
    subtitle: 'Preferences, themes & audio',
    icon: SettingsNavIcon,
    accentColor: '#64748B',
    bgColor: '#F1F5F9',
  },
];

// ─── SVG Mascot Component ───────────────────────────────────────────────────

const AiMascot = () => {
  const rotateAnim      = useRef(new Animated.Value(0)).current;
  const starsScaleAnim  = useRef(new Animated.Value(1)).current;
  // ── Mascot body animations ──
  const floatAnim       = useRef(new Animated.Value(0)).current;  // vertical bob
  const breatheAnim     = useRef(new Animated.Value(1)).current;  // scale breathe
  const glowAnim        = useRef(new Animated.Value(0.85)).current; // opacity shimmer

  useEffect(() => {
    // 1. Halo rotation: 360° over 4 s (one-shot)
    const rotation = Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: USE_NATIVE,
    });

    // 2. Stars sparkle: continuous pulse
    const starsPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(starsScaleAnim, { toValue: 1.3, duration: 500, useNativeDriver: USE_NATIVE }),
        Animated.timing(starsScaleAnim, { toValue: 0.8, duration: 500, useNativeDriver: USE_NATIVE }),
      ])
    );

    // 3. Mascot float: smooth 0 → -14 → 0 bob, ~1.4 s per cycle
    const mascotFloat = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -14,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: USE_NATIVE,
        }),
      ])
    );

    // 4. Mascot breathe: subtle scale 1 → 1.06 → 1, ~1.8 s per cycle
    const mascotBreathe = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.06,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: USE_NATIVE,
        }),
      ])
    );

    // 5. Mascot glow shimmer: opacity 0.85 → 1 → 0.85, ~2 s per cycle
    const mascotGlow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.85,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: USE_NATIVE,
        }),
      ])
    );

    // Start all animations
    rotation.start();
    starsPulse.start();
    mascotFloat.start();
    mascotBreathe.start();
    mascotGlow.start();

    // Settle all back to neutral after 4 s
    const timer = setTimeout(() => {
      starsPulse.stop();
      rotation.stop();
      mascotFloat.stop();
      mascotBreathe.stop();
      mascotGlow.stop();

      Animated.parallel([
        Animated.timing(starsScaleAnim, { toValue: 1,    duration: 300, useNativeDriver: USE_NATIVE }),
        Animated.timing(rotateAnim,     { toValue: 0,    duration: 0,   useNativeDriver: USE_NATIVE }),
        Animated.timing(floatAnim,      { toValue: 0,    duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: USE_NATIVE }),
        Animated.timing(breatheAnim,    { toValue: 1,    duration: 300, useNativeDriver: USE_NATIVE }),
        Animated.timing(glowAnim,       { toValue: 1,    duration: 300, useNativeDriver: USE_NATIVE }),
      ]).start();
    }, 4000);

    return () => {
      clearTimeout(timer);
      rotation.stop();
      starsPulse.stop();
      mascotFloat.stop();
      mascotBreathe.stop();
      mascotGlow.stop();
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={mascotStyles.wrapper}>
      {/* Outer glow rings rotating */}
      <Animated.View style={[mascotStyles.glowSvg, { transform: [{ rotate }] }]}>
        <Svg width={260} height={260} viewBox="0 0 260 260">
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%"   stopColor="#DDD6FE" stopOpacity="0.75" />
              <Stop offset="60%"  stopColor="#EDE9FE" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="130" cy="130" r="128" fill="url(#glow)" />
          <Circle cx="130" cy="130" r="96"  fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="6 4"  opacity="0.7" />
          <Circle cx="130" cy="130" r="110" fill="none" stroke="#C084FC" strokeWidth="1.2" strokeDasharray="12 4" opacity="0.6" />
        </Svg>
      </Animated.View>

      {/* Mascot image — floats, breathes, and shimmers */}
      <Animated.Image
        source={require('../../assets/images/ai_mascot.png')}
        style={[
          mascotStyles.robotImage,
          {
            transform: [
              { translateY: floatAnim },
              { scale: breatheAnim },
            ],
            opacity: glowAnim,
          },
        ]}
      />

      {/* Decorative sparkles */}
      <Animated.View style={[mascotStyles.sparkle, { top: 20,     right: 20, transform: [{ scale: starsScaleAnim }] }]}><Text style={{ fontSize: 14, color: '#8B5CF6' }}>✦</Text></Animated.View>
      <Animated.View style={[mascotStyles.sparkle, { top: 55,     left: 15,  transform: [{ scale: starsScaleAnim }] }]}><Text style={{ fontSize: 10, color: '#A78BFA' }}>✦</Text></Animated.View>
      <Animated.View style={[mascotStyles.sparkle, { bottom: 45,  right: 25, transform: [{ scale: starsScaleAnim }] }]}><Text style={{ fontSize: 12, color: '#6236FF' }}>✦</Text></Animated.View>
      <Animated.View style={[mascotStyles.sparkle, { bottom: 40,  left: 30,  transform: [{ scale: starsScaleAnim }] }]}><Text style={{ fontSize: 8,  color: '#C084FC' }}>✧</Text></Animated.View>
      <Animated.View style={[mascotStyles.sparkle, { top: 40,     right: 45, transform: [{ scale: starsScaleAnim }] }]}><Text style={{ fontSize: 9,  color: '#A78BFA' }}>✦</Text></Animated.View>
    </View>
  );
};

const mascotStyles = StyleSheet.create({
  wrapper: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  glowSvg: {
    position: 'absolute',
  },
  robotImage: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
    zIndex: 2,
  },
  sparkle: {
    position: 'absolute',
  },
});

// ─── Suggestion Chips Data ──────────────────────────────────────────────────

const SUGGESTION_CHIPS = [
  { label: 'Explain', sub: 'a topic', icon: BookOpenIcon, mode: 'explainer', query: 'Help me understand a concept step by step.' },
  { label: 'Help me', sub: 'study', icon: GraduationCapIcon, mode: 'explainer', query: 'Help me create a study plan for my upcoming exams.' },
  { label: 'Create', sub: 'a quiz', icon: BrainIcon, mode: 'quiz', query: 'Generate a practice quiz to test my knowledge.' },
];

// ─── Quick Prompt Chips (chat mode) ─────────────────────────────────────────

const PROMPT_CHIPS = [
  { label: 'Integration by Parts', mode: 'explainer', query: 'Explain Integration by Parts step-by-step with an example.' },
  { label: "Quiz on Newton's Laws", mode: 'quiz', query: "Generate a 3-question adaptive quiz on Newton's Laws of Motion." },
  { label: 'Organic Chemistry Summary', mode: 'summarizer', query: 'Summarize reaction mechanisms for organic chemistry.' },
  { label: 'Data Structures Big-O', mode: 'explainer', query: 'Explain Big-O time complexity for Binary Search Trees.' },
];

// ─── Helper: generate unique ID ─────────────────────────────────────────────

let _idCounter = 0;
const uid = () => `conv-${Date.now()}-${++_idCounter}`;

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Component ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export default function AiCoachScreen({ user = { name: 'Alex' }, onSelectTab, onNavigate, settings }) {
  const insets = useSafeAreaInsets();
  const [currentSettings, setCurrentSettings] = useState(settings || settingsService.getSettingsSync());

  useEffect(() => {
    const unsub = settingsService.subscribe((s) => setCurrentSettings(s));
    return () => unsub();
  }, []);

  // ── Conversation state ──
  const [conversations, setConversations] = useState(() => [
    { id: uid(), title: 'New Chat', messages: [], createdAt: Date.now() },
  ]);
  const [activeConversationId, setActiveConversationId] = useState(() => conversations[0]?.id);
  const [showHistory, setShowHistory] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isNavModalVisible, setIsNavModalVisible] = useState(false);

  const handleSelectDestination = (dest) => {
    setIsNavModalVisible(false);
    if (onNavigate) {
      onNavigate(dest.id);
    } else if (onSelectTab && dest.tab) {
      onSelectTab(dest.tab);
    }
  };

  const DRAWER_WIDTH = 280;
  const drawerSlideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const drawerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showHistory) {
      setIsDrawerVisible(true);
      Animated.parallel([
        Animated.timing(drawerFadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(drawerSlideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: USE_NATIVE,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(drawerFadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(drawerSlideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: USE_NATIVE,
        }),
      ]).start(() => {
        setIsDrawerVisible(false);
      });
    }
  }, [showHistory]);

  // ── Input & UI state ──
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState('explainer');
  const [expandedSteps, setExpandedSteps] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [playingAudioMsgId, setPlayingAudioMsgId] = useState(null);
  const [savedSrsMsgs, setSavedSrsMsgs] = useState({});
  const [savedNotesMsgs, setSavedNotesMsgs] = useState({});
  const [isInputFocused, setIsInputFocused] = useState(false);

  const focusGlowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusGlowAnim, {
      toValue: isInputFocused ? 1 : 0,
      duration: 450,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isInputFocused]);

  const flatListRef = useRef(null);

  // Derive active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];
  const hasMessages = messages.length > 0;

  // Get first name for greeting
  const firstName = user?.name?.split(' ')[0] || 'there';

  // ── Keyboard handling & smooth slide animation ──
  const initialBottomOffset = Math.max(insets.bottom, 12) + 4;
  const keyboardAnim = useRef(new Animated.Value(initialBottomOffset)).current;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const animateKeyboard = (toValue, duration = 250) => {
    Animated.timing(keyboardAnim, {
      toValue,
      duration,
      easing: Easing.bezier(0.17, 0.59, 0.4, 0.77),
      useNativeDriver: false,
    }).start();
  };

  const handleKeyboardShow = (duration = 250) => {
    setIsKeyboardVisible(true);
    animateKeyboard(10, duration);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleKeyboardHide = (duration = 220) => {
    setIsKeyboardVisible(false);
    animateKeyboard(initialBottomOffset, duration);
  };

  useEffect(() => {
    const showSub1 = Keyboard.addListener('keyboardWillShow', (e) => handleKeyboardShow(e?.duration));
    const showSub2 = Keyboard.addListener('keyboardDidShow', (e) => handleKeyboardShow(e?.duration));
    const hideSub1 = Keyboard.addListener('keyboardWillHide', (e) => handleKeyboardHide(e?.duration));
    const hideSub2 = Keyboard.addListener('keyboardDidHide', (e) => handleKeyboardHide(e?.duration));

    return () => {
      showSub1.remove();
      showSub2.remove();
      hideSub1.remove();
      hideSub2.remove();
    };
  }, [insets.bottom, initialBottomOffset]);

  // ── Update messages in active conversation ──
  const updateActiveMessages = (updater) => {
    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: typeof updater === 'function' ? updater(c.messages) : updater }
        : c
    ));
  };

  // ── Auto-title conversation from first message ──
  const autoTitleConversation = (text) => {
    if (activeConversation.title === 'New Chat') {
      setConversations(prev => prev.map(c =>
        c.id === activeConversationId
          ? { ...c, title: text.substring(0, 40) + (text.length > 40 ? '...' : '') }
          : c
      ));
    }
  };

  // ── New Chat ──
  const handleNewChat = () => {
    const newId = uid();
    const newConv = { id: newId, title: 'New Chat', messages: [], createdAt: Date.now() };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newId);
    setInputText('');
    setAttachedFile(null);
    setExpandedSteps({});
  };

  // ── Select conversation from history ──
  const handleSelectConversation = (convId) => {
    setActiveConversationId(convId);
    setShowHistory(false);
    setInputText('');
    setAttachedFile(null);
  };

  // ── Mode Switcher ──
  const handleSelectMode = (modeId) => {
    setActiveMode(modeId);
  };

  // ── Step expansion ──
  const toggleSteps = (msgId) => {
    setExpandedSteps(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  // ── Audio Listen ──
  const handleToggleListen = (msgId) => {
    if (playingAudioMsgId === msgId) {
      setPlayingAudioMsgId(null);
    } else {
      setPlayingAudioMsgId(msgId);
      Alert.alert('Voice Tutor Playing 🔊', 'Reading AI solution aloud...');
    }
  };

  // ── SRS Save ──
  const handleSaveToSrs = (msgId) => {
    setSavedSrsMsgs(prev => ({ ...prev, [msgId]: true }));
    Alert.alert('Saved to SRS ⚡', 'Flashcard added to your Spaced Repetition queue!');
  };

  // ── Note Save ──
  const handleSaveNote = (msgId) => {
    setSavedNotesMsgs(prev => ({ ...prev, [msgId]: true }));
    Alert.alert('Saved Note 📝', 'Response saved into your StudPal Study Notes.');
  };

  // ── Send message ──
  const handleSendMessage = (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text && !attachedFile) return;

    autoTitleConversation(text);

    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: attachedFile ? `[Attached ${attachedFile.name}]\n${text}` : text,
    };

    updateActiveMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachedFile(null);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    // Simulate AI Response
    setTimeout(() => {
      let aiResponseText = '';
      let latexFormula = null;
      let steps = null;
      let example = null;

      const persona = currentSettings?.aiPersonality || 'encouraging';
      const depth = currentSettings?.aiModelDepth || 'balanced';

      if (activeMode === 'quiz' || text.toLowerCase().includes('quiz')) {
        aiResponseText = `📝 AI Practice Quiz generated for "${text}"!\n\nQuestion 1 of 3: What is the primary physical principle governing this concept?`;
        gamificationService.recordQuizCompletion(90, 100);
      } else if (activeMode === 'summarizer' || text.toLowerCase().includes('summarize')) {
        aiResponseText = `📌 Executive Study Summary:\n\n• Core Theme: Key conceptual definitions & theorems extracted.\n• Active Recall: 3 flashcards queued for spaced repetition.`;
      } else {
        if (persona === 'encouraging') {
          aiResponseText = `✨ Fantastic inquiry! You're making impressive progress on "${text}". Here is the step-by-step breakdown to solidify your mastery:`;
        } else if (persona === 'rigorous') {
          aiResponseText = `🎯 Exam-Standard Analysis for "${text}": Ensure precision in your definitions and watch out for common trick edge cases:`;
        } else if (persona === 'socratic') {
          aiResponseText = `🧠 Socratic Guidance: To solve "${text}", first consider: what fundamental theorem links the known variables to the target outcome?`;
        } else {
          aiResponseText = `⚡ High-Yield Study Summary for "${text}":`;
        }

        latexFormula = "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}";
        steps = [
          { number: '01', title: 'Conceptual Overview', content: 'Break down the core principles into intuitive steps.' },
          { number: '02', title: 'Analytical Solution', content: 'Apply the formula to evaluate the exact outcome.' },
        ];

        if (depth === 'detailed') {
          steps.push({
            number: '03',
            title: 'Edge Cases & Proof Verification',
            content: 'Verify boundary limits and ensure continuous differentiability over the domain interval.',
          });
        }

        example = 'Practice Tip: Test yourself with active recall after reading.';
      }

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg = {
        id: aiMsgId,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiResponseText,
        mode: activeMode,
        latexFormula,
        steps,
        example,
        suggestedActions: ['Save to SRS Flashcards', 'Create Study Note'],
      };

      updateActiveMessages(prev => [...prev, aiMsg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
    }, 800);
  };

  // ── Chip handlers ──
  const handleSuggestionChip = (chip) => {
    setActiveMode(chip.mode);
    handleSendMessage(chip.query);
  };

  const handlePromptChip = (chip) => {
    setActiveMode(chip.mode);
    handleSendMessage(chip.query);
  };

  // ── Attachment ──
  const handleAttachFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'text/plain'],
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setAttachedFile(res.assets[0]);
        Alert.alert('Attached 📄', `Attached "${res.assets[0].name}" for AI analysis.`);
      }
    } catch (e) {
      Alert.alert('Attachment', 'Unable to pick file: ' + e.message);
    }
  };

  // ── Voice ──
  const handleToggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
      setInputText('Voice input: Explain quantum entanglement simply...');
      setTimeout(() => setIsRecording(false), 2200);
    } else {
      setIsRecording(false);
    }
  };

  const handleToggleVoiceMode = () => {
    if (!isVoiceModeActive) {
      setIsVoiceModeActive(true);
      Alert.alert(
        'Live Voice Mode Activated 🎙️',
        'Listening to your voice... Speak your study question out loud for instant voice responses.',
        [
          { text: 'Close', onPress: () => setIsVoiceModeActive(false) },
          {
            text: 'Speak Question',
            onPress: () => {
              setInputText('How does photosynthesis produce oxygen?');
              setIsVoiceModeActive(false);
            },
          },
        ]
      );
    } else {
      setIsVoiceModeActive(false);
    }
  };

  // ── Render Chat Message Item ──
  const renderMessageItem = ({ item }) => {
    const isUser = item.sender === 'user';

    if (isUser) {
      return (
        <View style={styles.userBubbleWrapper}>
          <View style={styles.userBubble}>
            <Text style={styles.userText}>{item.text}</Text>
            <Text style={styles.userTime}>{item.timestamp}</Text>
          </View>
        </View>
      );
    }

    const isExpanded = expandedSteps[item.id];
    const isAudioPlaying = playingAudioMsgId === item.id;
    const isSavedSrs = savedSrsMsgs[item.id];
    const isSavedNote = savedNotesMsgs[item.id];

    return (
      <View style={styles.aiBubbleWrapper}>
        <View style={styles.aiAvatarBox}>
          <SparklesIcon color="#FFFFFF" size={14} />
        </View>

        <View style={styles.aiBubbleCard}>
          <View style={styles.aiCardHeader}>
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>
                {item.mode === 'quiz' ? '📝 Quiz Generator' : item.mode === 'summarizer' ? '📌 Note Summary' : '✨ Concept Explainer'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.listenPill, isAudioPlaying && styles.listenPillPlaying]}
              onPress={() => handleToggleListen(item.id)}
              activeOpacity={0.8}
            >
              <SpeakerIcon color={isAudioPlaying ? '#FFFFFF' : '#2D62FF'} size={13} />
              <Text style={[styles.listenPillText, isAudioPlaying && styles.listenPillTextPlaying]}>
                {isAudioPlaying ? 'Playing...' : 'Listen'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.aiText}>{item.text}</Text>

          {item.latexFormula && (
            <View style={styles.latexCard}>
              <Text style={styles.latexLabel}>FORMULA</Text>
              <Text style={styles.latexText}>{item.latexFormula}</Text>
            </View>
          )}

          {item.steps && (
            <View style={styles.stepsCard}>
              <TouchableOpacity style={styles.stepsHeader} onPress={() => toggleSteps(item.id)} activeOpacity={0.8}>
                <Text style={styles.stepsHeaderTitle}>
                  {isExpanded ? 'Step-by-Step Breakdown' : 'View Step-by-Step Breakdown'}
                </Text>
                {isExpanded ? <ChevronUpIcon color="#64748B" size={15} /> : <ChevronDownIcon color="#64748B" size={15} />}
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.stepsContent}>
                  {item.steps.map((step, idx) => (
                    <View key={idx} style={styles.stepRow}>
                      <Text style={styles.stepNum}>{step.number || `0${idx + 1}`}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.stepTitle}>{step.title}</Text>
                        <Text style={styles.stepSub}>{step.content}</Text>
                      </View>
                    </View>
                  ))}
                  {item.example && (
                    <View style={styles.exampleCard}>
                      <Text style={styles.exampleText}>{item.example}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {item.suggestedActions && (
            <View style={styles.actionPillRow}>
              <TouchableOpacity
                style={[styles.actionPillPrimary, isSavedSrs && styles.actionPillSuccess]}
                onPress={() => handleSaveToSrs(item.id)}
                activeOpacity={0.8}
              >
                {isSavedSrs ? <CheckIcon color="#16A34A" size={13} /> : <BookmarkIcon color="#FF5B00" size={13} />}
                <Text style={[styles.actionPillPrimaryText, isSavedSrs && styles.actionPillSuccessText]}>
                  {isSavedSrs ? 'Saved to SRS ✓' : 'Save to SRS'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionPillSecondary, isSavedNote && styles.actionPillSuccess]}
                onPress={() => handleSaveNote(item.id)}
                activeOpacity={0.8}
              >
                {isSavedNote ? <CheckIcon color="#16A34A" size={13} /> : <ShareIcon color="#112B8A" size={13} />}
                <Text style={[styles.actionPillSecondaryText, isSavedNote && styles.actionPillSuccessText]}>
                  {isSavedNote ? 'Saved Note ✓' : 'Save Note'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.aiTime}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  // ── Layout calculations ──
  const hasInput = inputText.trim().length > 0;

  // ═════════════════════════════════════════════════════════════════════════════
  // ─── RENDER ───────────────────────────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════════════════════

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <View style={styles.topHeader}>
        {/* Left: Chat History Hamburger (UNTOUCHED - ALWAYS OPENS CHAT HISTORY) */}
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => setShowHistory(true)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MenuIcon color="#0F172A" size={20} />
        </TouchableOpacity>

        {/* Center: Title & Subtitle */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Branco</Text>
          <Text style={styles.headerSubtitle}>Your personal study assistant ✨</Text>
        </View>

        {/* Right: Actions Group (New Chat + Screen Switcher) */}
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={handleNewChat}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <PlusIcon color="#0F172A" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerIconBtn, styles.navSwitcherBtn]}
            onPress={() => setIsNavModalVisible(true)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <CompassNavIcon color="#6236FF" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {!hasMessages ? (
          /* ── EMPTY STATE ─────────────────────────────────────────────── */
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.emptyStateContainer}
            showsVerticalScrollIndicator={false}
          >
            <AiMascot />

            <Text style={styles.greetingTitle}>Hi, {firstName} 👋</Text>
            <Text style={styles.greetingAccent}>I'm Branco, your AI study companion.</Text>
            <Text style={styles.greetingBody}>
              Ready to help you understand, plan, study and achieve your goals.
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionChipsRow}
              style={styles.suggestionChipsScroll}
            >
              {SUGGESTION_CHIPS.map((chip, idx) => {
                const ChipIcon = chip.icon;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.suggestionChip}
                    onPress={() => handleSuggestionChip(chip)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.suggestionChipIcon}>
                      <ChipIcon color="#6236FF" size={16} />
                    </View>
                    <View style={styles.suggestionChipTextGroup}>
                      <Text style={styles.suggestionChipLabel}>{chip.label}</Text>
                      <Text style={styles.suggestionChipSub}>{chip.sub}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </ScrollView>
        ) : (
          /* ── CHAT VIEW ───────────────────────────────────────────────── */
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessageItem}
              contentContainerStyle={styles.chatListContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {!isKeyboardVisible && (
              <View style={styles.promptChipsWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsCarousel}>
                  {PROMPT_CHIPS.map((chip, idx) => (
                    <TouchableOpacity key={idx} style={styles.chipPill} onPress={() => handlePromptChip(chip)} activeOpacity={0.75}>
                      <Text style={styles.chipPillText}>{chip.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        )}

        {/* ── ATTACHMENT BAR ────────────────────────────────────────────── */}
        {attachedFile && (
          <View style={styles.attachmentBar}>
            <Text style={styles.attachmentText} numberOfLines={1}>
              📄 Attached: {attachedFile.name}
            </Text>
            <TouchableOpacity onPress={() => setAttachedFile(null)}>
              <Text style={styles.attachmentCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── INPUT DOCK ───────────────────────────────────────────────── */}
        <Animated.View style={[styles.inputDockContainer, { marginBottom: keyboardAnim }]}>
          <Animated.View
            style={[
              styles.inputBarInner,
              {
                borderColor: focusGlowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#E2E8F0', '#6236FF'],
                }),
                shadowColor: '#6236FF',
                shadowOpacity: focusGlowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.05, 0.58],
                }),
                shadowRadius: focusGlowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [6, 26],
                }),
                shadowOffset: { width: 0, height: 4 },
                elevation: focusGlowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [3, 12],
                }),
              },
              Platform.OS === 'web' && {
                boxShadow: isInputFocused
                  ? '0 0 28px 8px rgba(98, 54, 255, 0.52), 0 4px 20px rgba(98, 54, 255, 0.35)'
                  : '0 4px 10px rgba(15, 23, 42, 0.05)',
                transition: 'box-shadow 0.45s ease-out, border-color 0.45s ease-out',
              },
            ]}
          >
            {/* Plus attachment / action button */}
            <TouchableOpacity
              style={styles.inputActionIcon}
              onPress={handleAttachFile}
              activeOpacity={0.7}
            >
              <PlusIcon color="#64748B" size={19} />
            </TouchableOpacity>

            {/* Text input */}
            <TextInput
              style={styles.dockTextInput}
              placeholder="Ask Branco anything..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              onFocus={() => {
                setIsInputFocused(true);
                handleKeyboardShow();
              }}
              onBlur={() => {
                setIsInputFocused(false);
                handleKeyboardHide();
              }}
              multiline
              numberOfLines={1}
              textAlignVertical="center"
              scrollEnabled
            />

            {/* Action Group: Send OR Mic + Voice Waveform Button */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {hasInput ? (
                <TouchableOpacity
                  style={styles.sendBtnActive}
                  onPress={() => handleSendMessage()}
                  activeOpacity={0.85}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <ArrowUpIcon color="#FFFFFF" size={18} />
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.micBtn, isRecording && styles.micBtnRecording]}
                    onPress={handleToggleMic}
                    activeOpacity={0.85}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <MicIcon color={isRecording ? '#FFFFFF' : '#FFFFFF'} size={18} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.voiceWaveBtn, isVoiceModeActive && styles.voiceWaveBtnActive]}
                    onPress={handleToggleVoiceMode}
                    activeOpacity={0.85}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <WaveformIcon color="#FFFFFF" size={18} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* ── SCREEN SWITCHER MODAL / BOTTOM SHEET ────────────────────────── */}
      <Modal
        visible={isNavModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsNavModalVisible(false)}
      >
        <View style={styles.navModalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setIsNavModalVisible(false)}
          />

          <View style={[styles.navModalSheet, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
            {/* Sheet Handle */}
            <View style={styles.sheetHandleBar} />

            {/* Sheet Header */}
            <View style={styles.navModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.navModalHeaderIconBg}>
                  <CompassNavIcon color="#6236FF" size={18} />
                </View>
                <View>
                  <Text style={styles.navModalTitle}>Navigate To</Text>
                  <Text style={styles.navModalSubtitle}>Jump directly to any section of StudPal</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.navModalCloseBtn}
                onPress={() => setIsNavModalVisible(false)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CloseIcon color="#64748B" size={18} />
              </TouchableOpacity>
            </View>

            {/* Destination List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.navDestinationsList}
              style={{ maxHeight: 420 }}
            >
              {NAV_DESTINATIONS.map((dest) => {
                const IconComponent = dest.icon;
                return (
                  <TouchableOpacity
                    key={dest.id}
                    style={styles.navDestCard}
                    onPress={() => handleSelectDestination(dest)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.navDestIconBox, { backgroundColor: dest.bgColor }]}>
                      <IconComponent color={dest.accentColor} size={20} />
                    </View>

                    <View style={styles.navDestTextGroup}>
                      <Text style={styles.navDestTitle}>{dest.title}</Text>
                      <Text style={styles.navDestSubtitle}>{dest.subtitle}</Text>
                    </View>

                    <ChevronRightNavIcon color="#94A3B8" size={18} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── CHAT HISTORY DRAWER ─────────────────────────────────────────── */}
      {isDrawerVisible && (
        <>
          {/* Backdrop Overlay */}
          <Animated.View
            style={[
              styles.drawerOverlay,
              { opacity: drawerFadeAnim }
            ]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => setShowHistory(false)}
            />
          </Animated.View>

          {/* Drawer Sheet sliding from left */}
          <Animated.View
            style={[
              styles.drawerSheet,
              {
                width: DRAWER_WIDTH,
                transform: [{ translateX: drawerSlideAnim }],
                paddingTop: Math.max(insets.top, 16),
                paddingBottom: Math.max(insets.bottom, 16),
                paddingLeft: Math.max(insets.left, 0),
              }
            ]}
          >
            {/* Header */}
            <View style={styles.historyHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.historyHeaderIconBg}>
                  <SparklesIcon color="#6236FF" size={16} />
                </View>
                <View>
                  <Text style={styles.historyHeaderTitle}>Chat History</Text>
                  <Text style={styles.historyHeaderSubtitle}>Branco Conversations</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.historyCloseBtn}
                onPress={() => setShowHistory(false)}
                activeOpacity={0.7}
              >
                <CloseIcon color="#64748B" size={16} />
              </TouchableOpacity>
            </View>

            {/* Scrollable Conversations / Empty State */}
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 12 }}>
              {conversations.filter(c => c.messages.length > 0).length === 0 ? (
                <View style={styles.historyEmptyCard}>
                  <View style={styles.historyEmptyIconBg}>
                    <SparklesIcon color="#6236FF" size={24} />
                  </View>
                  <Text style={styles.historyEmptyTitle}>No conversations yet</Text>
                  <Text style={styles.historyEmptySubtitle}>
                    Start a chat to get step-by-step solutions, study plans, or active recall quizzes.
                  </Text>

                  {/* Quick Start Suggestions */}
                  <View style={styles.quickStartBox}>
                    <Text style={styles.quickStartHeader}>QUICK START SUGGESTIONS</Text>
                    {SUGGESTION_CHIPS.map((chip, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.quickStartChipItem}
                        onPress={() => {
                          handleSuggestionChip(chip);
                          setShowHistory(false);
                        }}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.quickStartChipText}>✨ {chip.query}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                conversations
                  .filter(c => c.messages.length > 0)
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((conv) => {
                    const lastMsg = conv.messages[conv.messages.length - 1];
                    const isActive = conv.id === activeConversationId;
                    const timeAgo = getRelativeTime(conv.createdAt);
                    return (
                      <TouchableOpacity
                        key={conv.id}
                        style={[styles.historyItemCard, isActive && styles.historyItemCardActive]}
                        onPress={() => handleSelectConversation(conv.id)}
                        activeOpacity={0.75}
                      >
                        {isActive && <View style={styles.activeIndicatorLine} />}

                        <View style={[styles.historyItemIconBg, isActive && styles.historyItemIconBgActive]}>
                          <ChatIcon color={isActive ? '#6236FF' : '#64748B'} size={15} />
                        </View>
                        
                        <View style={{ flex: 1, paddingRight: 4 }}>
                          <Text style={[styles.historyItemTitle, isActive && styles.historyItemTitleActive]} numberOfLines={1}>
                            {conv.title}
                          </Text>
                          <Text style={styles.historyItemPreview} numberOfLines={1}>
                            {lastMsg?.text || 'Empty conversation'}
                          </Text>
                        </View>

                        <Text style={styles.historyItemTime}>{timeAgo}</Text>
                      </TouchableOpacity>
                    );
                  })
              )}
            </ScrollView>

            {/* Bottom Floating Action Button */}
            <View style={styles.historyFooter}>
              <TouchableOpacity
                style={styles.historyNewChatBtn}
                onPress={() => { handleNewChat(); setShowHistory(false); }}
                activeOpacity={0.88}
              >
                <PlusIcon color="#FFFFFF" size={18} />
                <Text style={styles.historyNewChatText}>Start New Chat</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
}

// ─── Helper: relative time ──────────────────────────────────────────────────

function getRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── StyleSheet ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // ── Header ──
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0,
  },
  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navSwitcherBtn: {
    backgroundColor: '#F0EEFF',
    borderColor: '#E0E7FF',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },

  // ── Empty State ──
  emptyStateContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 30,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
    letterSpacing: -0.3,
  },
  greetingAccent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6236FF',
    marginTop: 2,
  },
  greetingBody: {
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },

  // ── Suggestion Chips ──
  suggestionChipsScroll: {
    width: '100%',
    marginTop: 28,
  },
  suggestionChipsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  suggestionChip: {
    width: 145,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  suggestionChipIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F3F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionChipTextGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  suggestionChipLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  suggestionChipSub: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 1,
  },

  // ── Chat List ──
  chatListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },

  // ── User Bubble ──
  userBubbleWrapper: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: '#112B8A',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: '82%',
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  userTime: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.75)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },

  // ── AI Bubble ──
  aiBubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 6,
  },
  aiAvatarBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2D62FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  aiBubbleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  aiCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeBadge: {
    backgroundColor: 'rgba(45, 98, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  modeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2D62FF',
  },
  listenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  listenPillPlaying: {
    backgroundColor: '#2D62FF',
    borderColor: '#2D62FF',
  },
  listenPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2D62FF',
  },
  listenPillTextPlaying: {
    color: '#FFFFFF',
  },
  aiText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#0B0B0F',
  },
  latexCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
  },
  latexLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FF5B00',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  latexText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  stepsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 10,
    overflow: 'hidden',
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  stepsHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#112B8A',
  },
  stepsContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    gap: 10,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2D62FF',
    backgroundColor: 'rgba(45, 98, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B0B0F',
  },
  stepSub: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    marginTop: 1,
  },
  exampleCard: {
    backgroundColor: '#FFF7ED',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  exampleText: {
    fontSize: 11,
    color: '#C2410C',
    lineHeight: 16,
  },
  actionPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  actionPillPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFD8A8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  actionPillPrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF5B00',
  },
  actionPillSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  actionPillSecondaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#112B8A',
  },
  actionPillSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  actionPillSuccessText: {
    color: '#16A34A',
  },
  aiTime: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 6,
  },

  // ── Prompt Chips ──
  promptChipsWrapper: {
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  chipsCarousel: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chipPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2D62FF',
  },

  // ── Attachment Bar ──
  attachmentBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#BFDBFE',
  },
  attachmentText: {
    fontSize: 11,
    color: '#1E40AF',
    fontWeight: '600',
    flex: 1,
  },
  attachmentCloseText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '800',
    marginLeft: 8,
  },

  // ── Input Dock ──
  inputDockContainer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  inputBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputActionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockTextInput: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#0F172A',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    paddingBottom: Platform.OS === 'ios' ? 2 : 0,
    paddingVertical: 0,
    marginVertical: 0,
    textAlignVertical: 'center',
    alignSelf: 'center',
    minHeight: 24,
    maxHeight: 154, // 7 lines cap (22px * 7 = 154px max height before scrolling)
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
        outlineColor: 'transparent',
        boxShadow: 'none',
      },
    }),
  },
  sendBtnActive: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#6236FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#6236FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnRecording: {
    backgroundColor: '#EF4444',
  },
  voiceWaveBtn: {
    width: 42,
    height: 42,
    minWidth: 42,
    minHeight: 42,
    borderRadius: 21,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  voiceWaveBtnActive: {
    backgroundColor: '#6236FF',
    shadowColor: '#6236FF',
  },

  // ── History Drawer ──
  drawerOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    zIndex: 9998,
  },
  drawerSheet: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FAFAFC',
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    zIndex: 9999,
    shadowColor: '#0F172A',
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 20,
    ...Platform.select({
      web: {
        boxShadow: '8px 0 24px rgba(15, 23, 42, 0.12)',
      },
    }),
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  historyHeaderIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  historyHeaderSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  historyCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty State Card
  historyEmptyCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  historyEmptyIconBg: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  historyEmptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  historyEmptySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
  quickStartBox: {
    width: '100%',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  quickStartHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 4,
  },
  quickStartChipItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  quickStartChipText: {
    fontSize: 12,
    color: '#2D62FF',
    fontWeight: '600',
  },

  // History Items List
  historyItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  historyItemCardActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  activeIndicatorLine: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 4,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: '#2D62FF',
  },
  historyItemIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyItemIconBgActive: {
    backgroundColor: '#FFFFFF',
  },
  historyItemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyItemTitleActive: {
    color: '#2D62FF',
    fontWeight: '800',
  },
  historyItemPreview: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  historyItemTime: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '600',
  },

  // Footer Button
  historyFooter: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  historyNewChatBtn: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#6236FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6236FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  historyNewChatText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  // ── Screen Switcher Navigation Modal ──
  navModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  navModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  sheetHandleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  navModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  navModalHeaderIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  navModalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  navModalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navDestinationsList: {
    gap: 8,
    paddingVertical: 4,
  },
  navDestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  navDestIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navDestTextGroup: {
    flex: 1,
    gap: 2,
  },
  navDestTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  navDestSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
  },
});
