import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
  Easing,
  Image,
  InteractionManager,
  PanResponder,
} from 'react-native';
import Svg, { Path, Circle, Line, Rect, Defs, RadialGradient, LinearGradient, Stop, G, Polyline } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as DocumentPicker from 'expo-document-picker';
import TooltipTouchable from '../components/TooltipTouchable';
import { Colors } from '../theme/colors';
import { useTheme } from '../theme/themeContext';
import { gamificationService } from '../services/gamification/gamificationService';
import { settingsService } from '../services/settings/settingsService';
import { useTranslation, normalizeLanguageCode } from '../services/i18n/i18nService';
import {
  getLocalizedSuggestionChips,
  getLocalizedPromptChips,
  getLocalizedAiResponse,
} from '../services/i18n/aiCoachTranslations';
import { useSwipeFocusGesture } from '../hooks/useSwipeFocusGesture';
import { voiceRecordingService } from '../services/voiceRecordingService';
import { liveVoiceChatService } from '../services/liveVoiceChatService';
import { studyService } from '../services/studyService';
import LiveVoiceStreamingTranscript from '../components/LiveVoiceStreamingTranscript';
import AiMessageCard from '../components/AiMessageCard';

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

const KeyboardIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="4" width="20" height="16" rx="2" />
    <Line x1="6" y1="8" x2="6" y2="8" />
    <Line x1="10" y1="8" x2="10" y2="8" />
    <Line x1="14" y1="8" x2="14" y2="8" />
    <Line x1="18" y1="8" x2="18" y2="8" />
    <Line x1="6" y1="12" x2="6" y2="12" />
    <Line x1="10" y1="12" x2="10" y2="12" />
    <Line x1="14" y1="12" x2="14" y2="12" />
    <Line x1="18" y1="12" x2="18" y2="12" />
    <Line x1="7" y1="16" x2="17" y2="16" />
  </Svg>
);

const SlidersIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="4" y1="21" x2="4" y2="14" />
    <Line x1="4" y1="10" x2="4" y2="3" />
    <Line x1="12" y1="21" x2="12" y2="12" />
    <Line x1="12" y1="8" x2="12" y2="3" />
    <Line x1="20" y1="21" x2="20" y2="16" />
    <Line x1="20" y1="12" x2="20" y2="3" />
    <Line x1="1" y1="14" x2="7" y2="14" />
    <Line x1="9" y1="8" x2="15" y2="8" />
    <Line x1="17" y1="16" x2="23" y2="16" />
  </Svg>
);

const MicMutedIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="1" y1="1" x2="23" y2="23" />
    <Path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <Path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    <Line x1="12" y1="19" x2="12" y2="23" />
    <Line x1="8" y1="23" x2="16" y2="23" />
  </Svg>
);

const etherealStyles = StyleSheet.create({
  etherealOrbContainer: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  etherealOrbCore: {
    width: 170,
    height: 170,
    borderRadius: 85,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

const EtherealMorphingOrb = ({ pulseAnim, disperseAnim, state = 'listening', isDark = true }) => {
  // Fallback if disperseAnim is not provided
  const activeDisperse = disperseAnim || new Animated.Value(0);
  const continuousOrbit = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(continuousOrbit, {
        toValue: 1,
        duration: 7500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // ── Rotational swirl interpolations: continuous fluid orbital swirling when voice is active ──
  const rot1 = continuousOrbit.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rot2 = continuousOrbit.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const rot3 = continuousOrbit.interpolate({ inputRange: [0, 1], outputRange: ['45deg', '405deg'] });
  const rot4 = continuousOrbit.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '-180deg'] });
  const rot5 = continuousOrbit.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '450deg'] });
  const mistRot1 = continuousOrbit.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const mistRot2 = continuousOrbit.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });

  // ── Outward Dispersion & Movement Interpolations (Driven strictly by voice activity) ──
  // Blob 1: Electric Neon Cyan (swirls on mid-left)
  const blob1X = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0, -22] });
  const blob1Y = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0, 6] });
  const blob1Scale = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.25] });
  const blob1Opacity = activeDisperse.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0.0, 0.4, 0.95] });

  // Blob 2: Royal StudPal Ultraviolet (swirls in upper-left quadrant)
  const blob2X = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const blob2Y = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0, -22] });
  const blob2Scale = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.3] });
  const blob2Opacity = activeDisperse.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0.0, 0.45, 0.95] });

  // Blob 3: Playful Neon Coral / Pink / Red (swirls in lower-right quadrant)
  const blob3X = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0, 14] });
  const blob3Y = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0, 24] });
  const blob3Scale = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.25] });
  const blob3Opacity = activeDisperse.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0.0, 0.4, 0.95] });

  // Blob 4: Sunlit Golden Amber Glow (swirls near center)
  const blob4X = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const blob4Y = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0, 10] });
  const blob4Scale = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.18] });
  const blob4Opacity = activeDisperse.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0.0, 0.35, 0.9] });

  // Blob 5: Playful Electric Mint / Emerald Green (prominent on middle-right)
  const blob5X = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0, 22] });
  const blob5Y = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const blob5Scale = activeDisperse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1.32] });
  const blob5Opacity = activeDisperse.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0.0, 0.42, 0.95] });

  // Swirling Mist veil (blooms and mixes when voice is heard)
  const mistOpacity1 = activeDisperse.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0.0, 0.12, 0.45] });
  const mistOpacity2 = activeDisperse.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0.0, 0.1, 0.3] });

  const isSpeaking = state === 'speaking';
  const isThinking = state === 'thinking';
  const isMuted = state === 'muted';

  return (
    <Animated.View
      style={[
        etherealStyles.etherealOrbContainer,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      {/* Boundless Seamless Ambient Corona Glow (blooms when voice is heard) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                scale: activeDisperse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.0, 1.28],
                }),
              },
            ],
            opacity: activeDisperse.interpolate({
              inputRange: [0, 0.25, 1],
              outputRange: [0.0, 0.45, 1.0],
            }),
          },
        ]}
        pointerEvents="none"
      >
        <Svg width={190} height={190} viewBox="0 0 190 190">
          <Defs>
            <RadialGradient id="boundlessCoronaHalo" cx="50%" cy="50%" r="50%">
              <Stop
                offset="0%"
                stopColor={isMuted ? '#60A5FA' : isThinking ? '#F59E0B' : isSpeaking ? '#38BDF8' : '#60A5FA'}
                stopOpacity={isDark ? (isSpeaking ? 0.35 : 0.22) : (isSpeaking ? 0.25 : 0.16)}
              />
              <Stop
                offset="60%"
                stopColor={isMuted ? '#3B82F6' : isThinking ? '#FBBF24' : isSpeaking ? '#0284C7' : '#3B82F6'}
                stopOpacity={isDark ? (isSpeaking ? 0.18 : 0.1) : (isSpeaking ? 0.12 : 0.07)}
              />
              <Stop
                offset="85%"
                stopColor={isMuted ? '#2563EB' : isThinking ? '#D97706' : isSpeaking ? '#0284C7' : '#2563EB'}
                stopOpacity={isDark ? 0.05 : 0.02}
              />
              <Stop
                offset="100%"
                stopColor={isMuted ? '#1D4ED8' : isThinking ? '#F59E0B' : isSpeaking ? '#38BDF8' : '#1D4ED8'}
                stopOpacity={0}
              />
            </RadialGradient>
          </Defs>
          <Circle cx="95" cy="95" r="95" fill="url(#boundlessCoronaHalo)" />
        </Svg>
      </Animated.View>

      {/* Main Playful Living Liquid Orb Core */}
      <View style={etherealStyles.etherealOrbCore}>
        {/* Base Rich Liquid Aurora Foundation (Exact pristine static resting sphere when silent) */}
        <Svg width={170} height={170} viewBox="0 0 170 170">
          <Defs>
            <RadialGradient id="baseLiquidGrad" cx="48%" cy="42%" r="58%">
              <Stop offset="0%" stopColor={isThinking ? '#FEF08A' : '#7CB2FF'} stopOpacity="1" />
              <Stop offset="30%" stopColor={isThinking ? '#FBBF24' : '#5597F5'} stopOpacity="1" />
              <Stop offset="65%" stopColor={isThinking ? '#F59E0B' : '#337BE8'} stopOpacity="1" />
              <Stop offset="88%" stopColor={isThinking ? '#D97706' : '#2262D2'} stopOpacity="1" />
              <Stop offset="100%" stopColor={isThinking ? '#B45309' : '#1A4DB8'} stopOpacity="1" />
            </RadialGradient>

            {/* Feathered Blob 1 (Electric Neon Cyan) */}
            <RadialGradient id="blob1Grad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#00F0FF" stopOpacity="0.95" />
              <Stop offset="35%" stopColor="#00D4FF" stopOpacity="0.75" />
              <Stop offset="70%" stopColor="#0284C7" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </RadialGradient>

            {/* Feathered Blob 2 (Royal Ultraviolet / StudPal Purple) */}
            <RadialGradient id="blob2Grad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#7C3AED" stopOpacity="0.95" />
              <Stop offset="40%" stopColor="#6366F1" stopOpacity="0.7" />
              <Stop offset="75%" stopColor="#4338CA" stopOpacity="0.25" />
              <Stop offset="100%" stopColor="#312E81" stopOpacity="0" />
            </RadialGradient>

            {/* Feathered Blob 3 (Playful Neon Coral Magenta / Orchid) */}
            <RadialGradient id="blob3Grad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={isThinking ? '#F59E0B' : '#EC4899'} stopOpacity="0.92" />
              <Stop offset="40%" stopColor={isThinking ? '#D97706' : '#C084FC'} stopOpacity="0.65" />
              <Stop offset="75%" stopColor={isThinking ? '#B45309' : '#8B5CF6'} stopOpacity="0.2" />
              <Stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </RadialGradient>

            {/* Feathered Blob 4 (Sunlit Golden Glow) */}
            <RadialGradient id="blob4Grad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.9" />
              <Stop offset="35%" stopColor={isThinking ? '#FDE047' : '#FEF08A'} stopOpacity="0.65" />
              <Stop offset="75%" stopColor={isThinking ? '#F59E0B' : '#FBBF24'} stopOpacity="0.18" />
              <Stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </RadialGradient>

            {/* Feathered Blob 5 (Playful Electric Mint / Neon Emerald) */}
            <RadialGradient id="blob5Grad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#34D399" stopOpacity="0.85" />
              <Stop offset="40%" stopColor="#10B981" stopOpacity="0.5" />
              <Stop offset="80%" stopColor="#06B6D4" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </RadialGradient>

            {/* Feathered Fluid Mist Swirl */}
            <RadialGradient id="fluidSwirl1" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <Stop offset="45%" stopColor={isThinking ? '#FEF08A' : '#7DD3FC'} stopOpacity="0.22" />
              <Stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Base Sphere */}
          <Circle cx="85" cy="85" r="85" fill="url(#baseLiquidGrad)" />
        </Svg>

        {/* Dynamic Continuous Orbital Color Node 1 (Electric Neon Cyan) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: blob1Opacity,
              transform: [
                { rotate: rot1 },
                { translateX: blob1X },
                { translateY: blob1Y },
                { scale: blob1Scale },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <Svg width={170} height={170} viewBox="0 0 170 170">
            <Circle cx="85" cy="85" r="58" fill="url(#blob1Grad)" />
          </Svg>
        </Animated.View>

        {/* Dynamic Continuous Orbital Color Node 2 (Royal Ultraviolet / StudPal Purple) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: blob2Opacity,
              transform: [
                { rotate: rot2 },
                { translateX: blob2X },
                { translateY: blob2Y },
                { scale: blob2Scale },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <Svg width={170} height={170} viewBox="0 0 170 170">
            <Circle cx="85" cy="85" r="62" fill="url(#blob2Grad)" />
          </Svg>
        </Animated.View>

        {/* Dynamic Continuous Orbital Color Node 3 (Playful Neon Coral Magenta / Orchid) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: blob3Opacity,
              transform: [
                { rotate: rot3 },
                { translateX: blob3X },
                { translateY: blob3Y },
                { scale: blob3Scale },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <Svg width={170} height={170} viewBox="0 0 170 170">
            <Circle cx="85" cy="85" r="54" fill="url(#blob3Grad)" />
          </Svg>
        </Animated.View>

        {/* Dynamic Continuous Orbital Color Node 4 (Sunlit Golden Glow) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: blob4Opacity,
              transform: [
                { rotate: rot4 },
                { translateX: blob4X },
                { translateY: blob4Y },
                { scale: blob4Scale },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <Svg width={170} height={170} viewBox="0 0 170 170">
            <Circle cx="85" cy="85" r="48" fill="url(#blob4Grad)" />
          </Svg>
        </Animated.View>

        {/* Dynamic Continuous Orbital Color Node 5 (Playful Electric Mint) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: blob5Opacity,
              transform: [
                { rotate: rot5 },
                { translateX: blob5X },
                { translateY: blob5Y },
                { scale: blob5Scale },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <Svg width={170} height={170} viewBox="0 0 170 170">
            <Circle cx="85" cy="85" r="46" fill="url(#blob5Grad)" />
          </Svg>
        </Animated.View>

        {/* Swirling Liquid Mist Filament 1 (Clockwise Continuous Flow - blooms on voice) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: mistOpacity1,
              transform: [{ rotate: mistRot1 }],
            },
          ]}
          pointerEvents="none"
        >
          <Svg width={170} height={170} viewBox="0 0 170 170">
            <Path
              d="M 32 85 C 36 48, 75 36, 105 56 C 135 76, 138 112, 108 128 C 78 148, 42 128, 32 85 Z"
              fill="url(#fluidSwirl1)"
            />
          </Svg>
        </Animated.View>

        {/* Swirling Liquid Mist Filament 2 (Counter-Clockwise Continuous Flow - blooms on voice) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: mistOpacity2,
              transform: [{ rotate: mistRot2 }],
            },
          ]}
          pointerEvents="none"
        >
          <Svg width={170} height={170} viewBox="0 0 170 170">
            <Circle cx="52" cy="52" r="32" fill="url(#fluidSwirl1)" />
            <Circle cx="105" cy="98" r="32" fill="url(#fluidSwirl1)" />
          </Svg>
        </Animated.View>
      </View>
    </Animated.View>
  );
};



const SendIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 2L11 13" />
    <Path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </Svg>
);

const PlayIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <Path d="M8 5v14l11-7z" />
  </Svg>
);

const PauseIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <Rect x="6" y="4" width="4" height="16" rx="1" />
    <Rect x="14" y="4" width="4" height="16" rx="1" />
  </Svg>
);

const TrashIcon = ({ color = '#EF4444', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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

const SidebarToggleIcon = ({ color = '#9E9EA7', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="3" width="18" height="18" rx="3" />
    <Line x1="9" y1="3" x2="9" y2="21" />
  </Svg>
);

const SearchOutlineIcon = ({ color = '#9E9EA7', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="7" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

const ComposeNewChatIcon = ({ color = '#ECECEC', size = 17 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 20h9" />
    <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </Svg>
);

const ImagesToolIcon = ({ color = '#ECECEC', size = 17 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="3" width="18" height="18" rx="2" />
    <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
    <Path d="M21 15l-5-5L5 21" />
  </Svg>
);

const ResourcesToolIcon = ({ color = '#ECECEC', size = 17 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <Line x1="9" y1="7" x2="15" y2="7" />
    <Line x1="9" y1="11" x2="15" y2="11" />
    <Line x1="9" y1="15" x2="12" y2="15" />
  </Svg>
);

const LibraryToolIcon = ({ color = '#ECECEC', size = 17 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <Line x1="12" y1="6" x2="16" y2="6" />
    <Line x1="12" y1="10" x2="16" y2="10" />
  </Svg>
);

const ScheduledToolIcon = ({ color = '#ECECEC', size = 17 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="9" />
    <Path d="M12 7v5l3 2" />
  </Svg>
);

const PluginsToolIcon = ({ color = '#ECECEC', size = 17 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </Svg>
);

const ProjectsToolIcon = ({ color = '#ECECEC', size = 17 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </Svg>
);

const CodexToolIcon = ({ color = '#ECECEC', size = 17 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
  </Svg>
);

const MoreDotsIcon = ({ color = '#ECECEC', size = 17 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="5" cy="12" r="1.5" fill={color} />
    <Circle cx="12" cy="12" r="1.5" fill={color} />
    <Circle cx="19" cy="12" r="1.5" fill={color} />
  </Svg>
);

const ChatBubbleOutlineIcon = ({ color = '#ECECEC', size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

const PinIcon = ({ color = '#6236FF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="17" x2="12" y2="22" />
    <Path d="M5 17h14v-2l-2-2V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v8l-2 2v2z" />
  </Svg>
);

const TrashOutlineIcon = ({ color = '#EF4444', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <Line x1="10" y1="11" x2="10" y2="17" />
    <Line x1="14" y1="11" x2="14" y2="17" />
  </Svg>
);

const EditPencilIcon = ({ color = '#64748B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </Svg>
);

const CrownIcon = ({ color = '#F59E0B', size = 13 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z" />
  </Svg>
);

const SparkleBadgeIcon = ({ color = '#6236FF', size = 11 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </Svg>
);

const SettingsMiniIcon = ({ color = '#64748B', size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
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

const ZapIcon = ({ color = '#F59E0B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Svg>
);

const ResetIcon = ({ color = '#64748B', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <Path d="M3 3v5h5" />
  </Svg>
);

const SparklesMenuIcon = ({ color = '#64748B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" />
  </Svg>
);

const TimerMenuIcon = ({ color = '#64748B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="9" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const UserMenuIcon = ({ color = '#64748B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="8" r="4" />
    <Path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </Svg>
);

const SettingsGearMenuIcon = ({ color = '#64748B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

const HelpCircleMenuIcon = ({ color = '#64748B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <Line x1="12" y1="17" x2="12.01" y2="17" />
  </Svg>
);

const LogOutMenuIcon = ({ color = '#64748B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);

// ── Custom Animated Toggle for AI Settings ──
const CustomToggle = ({ value, onValueChange, activeColor = '#6236FF' }) => {
  const animValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const trackBg = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#CBD5E1', activeColor],
  });

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onValueChange}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View
        style={{
          width: 48,
          height: 28,
          borderRadius: 14,
          backgroundColor: trackBg,
          justifyContent: 'center',
          paddingHorizontal: 2,
        }}
      >
        <Animated.View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            transform: [{ translateX }],
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.18,
            shadowRadius: 4,
            elevation: 3,
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// ── Dropdown Trigger Component with Reference for Window Measurements ──
const ChatGptDropdownTrigger = ({ type, isOpen, label, accentColor, isDark, styles, onPress }) => {
  const btnRef = useRef(null);

  return (
    <TouchableOpacity
      ref={btnRef}
      style={[styles.chatGptDropdownBtn, isOpen && styles.chatGptDropdownBtnOpen]}
      onPress={() => onPress(btnRef.current)}
      activeOpacity={0.75}
      collapsable={false}
    >
      {type === 'accent' && (
        <View style={[styles.chatGptColorDot, { backgroundColor: accentColor }]} />
      )}
      <Text style={styles.chatGptDropdownValue} numberOfLines={1}>
        {label}
      </Text>
      <ChevronDownIcon color={isDark ? '#A1A1AA' : '#71717A'} size={13} />
    </TouchableOpacity>
  );
};

// ─── Destination Routes Configuration ───────────────────────────────────────

const NAV_DESTINATIONS = [
  {
    id: 'dashboard',
    tab: 'home',
    title: 'Home',
    subtitle: 'Timer & goals',
    icon: HomeNavIcon,
    accentColor: '#2D62FF',
    bgColor: '#EFF6FF',
  },
  {
    id: 'subjects',
    tab: 'subjects',
    title: 'Subjects',
    subtitle: 'Courses & topics',
    icon: SubjectsNavIcon,
    accentColor: '#6236FF',
    bgColor: '#F0EEFF',
  },
  {
    id: 'study',
    tab: 'study',
    title: 'Study & Flashcards',
    subtitle: 'SRS flashcards',
    icon: StudyFlashNavIcon,
    accentColor: '#10B981',
    bgColor: '#ECFDF5',
  },
  {
    id: 'schedule',
    tab: null,
    title: 'Schedule',
    subtitle: 'Planner & timeline',
    icon: CalendarNavIcon,
    accentColor: '#F59E0B',
    bgColor: '#FFFBEB',
  },
];

// ─── SVG Mascot Component ───────────────────────────────────────────────────

const AiMascot = ({ isDark: propIsDark, accentColor: propAccentColor }) => {
  const themeContext = useTheme();
  const isDark = propIsDark !== undefined ? propIsDark : themeContext?.isDark;
  const accentColor = propAccentColor || themeContext?.accentColor || '#6236FF';

  const rotateAnim      = useRef(new Animated.Value(0)).current;
  const starsScaleAnim  = useRef(new Animated.Value(1)).current;
  // ── Mascot body animations ──
  const floatAnim       = useRef(new Animated.Value(0)).current;  // vertical bob
  const breatheAnim     = useRef(new Animated.Value(1)).current;  // scale breathe
  const glowAnim        = useRef(new Animated.Value(0.85)).current; // opacity shimmer

  useEffect(() => {
    let timer = null;
    let rotation = null;
    let starsPulse = null;
    let mascotFloat = null;
    let mascotBreathe = null;
    let mascotGlow = null;

    const task = InteractionManager.runAfterInteractions(() => {
      // 1. Halo rotation: 360° over 4 s (one-shot)
      rotation = Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: USE_NATIVE,
      });

      // 2. Stars sparkle: continuous pulse
      starsPulse = Animated.loop(
        Animated.sequence([
          Animated.timing(starsScaleAnim, { toValue: 1.3, duration: 500, useNativeDriver: USE_NATIVE }),
          Animated.timing(starsScaleAnim, { toValue: 0.8, duration: 500, useNativeDriver: USE_NATIVE }),
        ])
      );

      // 3. Mascot float: smooth 0 → -14 → 0 bob, ~1.4 s per cycle
      mascotFloat = Animated.loop(
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
      mascotBreathe = Animated.loop(
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
      mascotGlow = Animated.loop(
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
      timer = setTimeout(() => {
        if (starsPulse) starsPulse.stop();
        if (rotation) rotation.stop();
        if (mascotFloat) mascotFloat.stop();
        if (mascotBreathe) mascotBreathe.stop();
        if (mascotGlow) mascotGlow.stop();

        Animated.parallel([
          Animated.timing(starsScaleAnim, { toValue: 1,    duration: 300, useNativeDriver: USE_NATIVE }),
          Animated.timing(rotateAnim,     { toValue: 0,    duration: 0,   useNativeDriver: USE_NATIVE }),
          Animated.timing(floatAnim,      { toValue: 0,    duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: USE_NATIVE }),
          Animated.timing(breatheAnim,    { toValue: 1,    duration: 300, useNativeDriver: USE_NATIVE }),
          Animated.timing(glowAnim,       { toValue: 1,    duration: 300, useNativeDriver: USE_NATIVE }),
        ]).start();
      }, 4000);
    });

    return () => {
      if (task && task.cancel) task.cancel();
      if (timer) clearTimeout(timer);
      if (rotation) rotation.stop();
      if (starsPulse) starsPulse.stop();
      if (mascotFloat) mascotFloat.stop();
      if (mascotBreathe) mascotBreathe.stop();
      if (mascotGlow) mascotGlow.stop();
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowId = isDark ? "mascotGlowDark" : "mascotGlowLight";

  return (
    <View style={mascotStyles.wrapper}>
      {/* Outer glow rings rotating */}
      <Animated.View style={[mascotStyles.glowSvg, { transform: [{ rotate }] }]}>
        <Svg width={260} height={260} viewBox="0 0 260 260">
          <Defs>
            <RadialGradient id={glowId} cx="50%" cy="50%" r="50%">
              {isDark ? (
                <>
                  <Stop offset="0%"   stopColor={accentColor || "#8B5CF6"} stopOpacity="0.32" />
                  <Stop offset="50%"  stopColor={accentColor || "#6236FF"} stopOpacity="0.10" />
                  <Stop offset="100%" stopColor="#0B0F19" stopOpacity="0" />
                </>
              ) : (
                <>
                  <Stop offset="0%"   stopColor="#DDD6FE" stopOpacity="0.75" />
                  <Stop offset="60%"  stopColor="#EDE9FE" stopOpacity="0.3" />
                  <Stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
                </>
              )}
            </RadialGradient>
          </Defs>
          <Circle cx="130" cy="130" r="128" fill={`url(#${glowId})`} />
          <Circle
            cx="130"
            cy="130"
            r="96"
            fill="none"
            stroke={isDark ? (accentColor === '#6236FF' ? '#A78BFA' : accentColor) : "#8B5CF6"}
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity={isDark ? 0.45 : 0.7}
          />
          <Circle
            cx="130"
            cy="130"
            r="110"
            fill="none"
            stroke={isDark ? (accentColor === '#6236FF' ? '#C084FC' : accentColor) : "#C084FC"}
            strokeWidth="1.2"
            strokeDasharray="12 4"
            opacity={isDark ? 0.35 : 0.6}
          />
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
      <Animated.View style={[mascotStyles.sparkle, { top: 20,     right: 20, transform: [{ scale: starsScaleAnim }] }]}><Text style={{ fontSize: 14, color: isDark ? '#A78BFA' : '#8B5CF6' }}>✦</Text></Animated.View>
      <Animated.View style={[mascotStyles.sparkle, { top: 55,     left: 15,  transform: [{ scale: starsScaleAnim }] }]}><Text style={{ fontSize: 10, color: isDark ? '#C084FC' : '#A78BFA' }}>✦</Text></Animated.View>
      <Animated.View style={[mascotStyles.sparkle, { bottom: 45,  right: 25, transform: [{ scale: starsScaleAnim }] }]}><Text style={{ fontSize: 12, color: isDark ? (accentColor || '#818CF8') : '#6236FF' }}>✦</Text></Animated.View>
      <Animated.View style={[mascotStyles.sparkle, { bottom: 40,  left: 30,  transform: [{ scale: starsScaleAnim }] }]}><Text style={{ fontSize: 8,  color: isDark ? '#E9D5FF' : '#C084FC' }}>✧</Text></Animated.View>
      <Animated.View style={[mascotStyles.sparkle, { top: 40,     right: 45, transform: [{ scale: starsScaleAnim }] }]}><Text style={{ fontSize: 9,  color: isDark ? '#DDD6FE' : '#A78BFA' }}>✦</Text></Animated.View>
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

// ─── Storage Keys & Persistence for Real User Chats ──────────────────────────

const AI_CHATS_STORAGE_KEY = '@studpal_user_conversations_v3';

const createDefaultEmptyChat = () => ({
  id: `conv-${Date.now()}`,
  title: 'New Chat',
  messages: [],
  createdAt: Date.now(),
  isPinned: false,
});

const loadPersistedConversations = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(AI_CHATS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Error loading persisted AI conversations:', e);
  }
  return [createDefaultEmptyChat()];
};

const savePersistedConversations = (conversationsList) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(AI_CHATS_STORAGE_KEY, JSON.stringify(conversationsList));
    }
  } catch (e) {
    console.warn('Error saving persisted AI conversations:', e);
  }
};

// ─── Helper: generate unique ID ─────────────────────────────────────────────

let _idCounter = 0;
const uid = () => `conv-${Date.now()}-${++_idCounter}`;

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Component ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export default function AiCoachScreen({
  user = { name: 'Alex' },
  onSelectTab,
  onNavigate,
  settings,
  initialPrompt,
  onClearInitialPrompt,
  initialShowHistory,
  onClearInitialShowHistory,
}) {
  const { t, currentLanguageCode } = useTranslation();
  const insets = useSafeAreaInsets();
  const [currentSettings, setCurrentSettings] = useState(settings || settingsService.getSettingsSync());

  useEffect(() => {
    const unsub = settingsService.subscribe((s) => setCurrentSettings(s));
    return () => unsub();
  }, []);

  const { isDark, accentColor: themeAccentColor } = useTheme();
  const accentColor = themeAccentColor || currentSettings?.accentColor || "#6236FF";
  const styles = useMemo(() => getAiCoachStyles(isDark, accentColor), [isDark, accentColor]);
  const currentLang = normalizeLanguageCode(currentSettings?.language || currentLanguageCode || "en");

  const localizedSuggestionChips = useMemo(() => getLocalizedSuggestionChips(currentLang), [currentLang]);
  const localizedPromptChips = useMemo(() => getLocalizedPromptChips(currentLang), [currentLang]);

  // ── Helper to process initial prompt synchronously on mount ──
  const initialData = useMemo(() => {
    const saved = loadPersistedConversations();
    if (initialPrompt) {
      const text = typeof initialPrompt === 'string' ? initialPrompt : initialPrompt.prompt;
      const file = typeof initialPrompt === 'object' ? initialPrompt.attachedFile : null;
      const returnState = typeof initialPrompt === 'object' ? initialPrompt.srsReturnState : null;

      if (text || file) {
        const targetId = uid();
        const title = text
          ? (text.substring(0, 40) + (text.length > 40 ? '...' : ''))
          : (file ? `Analyze: ${file.name}` : 'New Study Inquiry');

        const userMsg = {
          id: `user-${Date.now()}`,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: file ? `[Attached ${file.name}]\n${text}` : text,
        };

        const newConv = {
          id: targetId,
          title,
          messages: [userMsg],
          createdAt: Date.now(),
          isPinned: false,
        };

        return {
          conversations: [newConv, ...saved],
          activeId: targetId,
          returnState,
          initialText: text || '',
          targetId,
        };
      }
    }
    return {
      conversations: saved,
      activeId: saved[0]?.id || `conv-${Date.now()}`,
      returnState: null,
      initialText: null,
      targetId: null,
    };
  }, []);

  // ── User's Chat History (Loaded from permanent storage) ──
  const [conversations, setConversations] = useState(() => initialData.conversations);
  const [activeConversationId, setActiveConversationId] = useState(() => initialData.activeId);
  const [activeSrsReturnState, setActiveSrsReturnState] = useState(() => initialData.returnState);

  // Permanently sync conversations to storage whenever updated
  useEffect(() => {
    savePersistedConversations(conversations);
  }, [conversations]);

  // AI Response generator helper
  const triggerAiResponseForPrompt = (text, targetId) => {
    setTimeout(() => {
      const persona = currentSettings?.aiPersonality || 'encouraging';
      const depth = currentSettings?.aiModelDepth || 'balanced';

      const aiResponse = getLocalizedAiResponse({
        text,
        activeMode,
        lang: currentLang,
        persona,
        depth,
      });

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg = {
        id: aiMsgId,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiResponse.text,
        mode: activeMode,
        latexFormula: aiResponse.latexFormula,
        steps: aiResponse.steps,
        example: aiResponse.example,
        suggestedActions: aiResponse.suggestedActions,
      };

      setConversations(prev => prev.map(c =>
        c.id === targetId
          ? { ...c, messages: [...(c.messages || []), aiMsg] }
          : c
      ));

      setTimeout(() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true }), 100);
    }, 350);
  };

  // Process initial prompt on mount or prop updates
  useEffect(() => {
    if (initialData.initialText && initialData.targetId) {
      triggerAiResponseForPrompt(initialData.initialText, initialData.targetId);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, []);

  useEffect(() => {
    if (initialPrompt && initialData.targetId === null) {
      const text = typeof initialPrompt === 'string' ? initialPrompt : initialPrompt.prompt;
      const file = typeof initialPrompt === 'object' ? initialPrompt.attachedFile : null;
      const returnState = typeof initialPrompt === 'object' ? initialPrompt.srsReturnState : null;

      if (returnState) {
        setActiveSrsReturnState(returnState);
      }

      if (text || file) {
        const targetId = uid();
        const title = text
          ? (text.substring(0, 40) + (text.length > 40 ? '...' : ''))
          : (file ? `Analyze: ${file.name}` : 'New Study Inquiry');

        const userMsg = {
          id: `user-${Date.now()}`,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: file ? `[Attached ${file.name}]\n${text}` : text,
        };

        const newConv = {
          id: targetId,
          title,
          messages: [userMsg],
          createdAt: Date.now(),
          isPinned: false,
        };

        setActiveConversationId(targetId);
        setConversations(prev => [newConv, ...prev]);
        triggerAiResponseForPrompt(text || '', targetId);

        if (onClearInitialPrompt) onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);
  const [showHistory, setShowHistory] = useState(Boolean(initialShowHistory));
  const [isDrawerVisible, setIsDrawerVisible] = useState(Boolean(initialShowHistory));
  const [isNavModalVisible, setIsNavModalVisible] = useState(false);
  const [isDrawerSearching, setIsDrawerSearching] = useState(false);
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');

  // ── ChatGPT Profile Popup Menu & AI Settings Modal State ──
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuAnim = useRef(new Animated.Value(0)).current;

  const handleOpenProfileMenu = () => {
    setIsProfileMenuOpen(true);
    profileMenuAnim.setValue(0);
    Animated.spring(profileMenuAnim, {
      toValue: 1,
      damping: 18,
      mass: 0.7,
      stiffness: 240,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handleCloseProfileMenu = (callback) => {
    Animated.timing(profileMenuAnim, {
      toValue: 0,
      duration: 160,
      easing: Easing.bezier(0.4, 0, 1, 1),
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      setIsProfileMenuOpen(false);
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  const handleToggleProfileMenu = () => {
    if (isProfileMenuOpen) {
      handleCloseProfileMenu();
    } else {
      handleOpenProfileMenu();
    }
  };

  const [isAiSettingsModalOpen, setIsAiSettingsModalOpen] = useState(false);
  const [aiSettingsActiveTab, setAiSettingsActiveTab] = useState('general');
  const [aiSettingsSearchQuery, setAiSettingsSearchQuery] = useState('');
  const [activeDropdownPicker, setActiveDropdownPicker] = useState(null);
  const [dropdownLayout, setDropdownLayout] = useState(null);

  const [aiPersonalityState, setAiPersonalityState] = useState(
    ['all_round', 'advisor', 'librarian', 'tutor', 'editor', 'roommate'].includes(currentSettings?.aiPersonality)
      ? currentSettings.aiPersonality
      : 'all_round'
  );
  const [aiTeachingStyleState, setAiTeachingStyleState] = useState(currentSettings?.aiTeachingStyle || 'socratic');
  const [aiDepthState, setAiDepthState] = useState(currentSettings?.aiModelDepth || 'balanced');
  const [aiAcademicState, setAiAcademicState] = useState(currentSettings?.aiAcademicLevel || 'undergraduate');
  const [aiInstructionsState, setAiInstructionsState] = useState(currentSettings?.aiCustomInstructions || '');
  const [aiFormattingState, setAiFormattingState] = useState(currentSettings?.aiFormattingPref || 'standard');
  const [autoSummarizePdfsState, setAutoSummarizePdfsState] = useState(currentSettings?.autoSummarizePdfs ?? true);
  const [spacedRepetitionSmartIntervalsState, setSpacedRepetitionSmartIntervalsState] = useState(currentSettings?.spacedRepetitionSmartIntervals ?? true);
  const [aiAutoPlayVoiceState, setAiAutoPlayVoiceState] = useState(currentSettings?.aiAutoPlayVoice ?? false);
  const [aiProactiveSuggestionsState, setAiProactiveSuggestionsState] = useState(currentSettings?.aiProactiveSuggestions ?? true);
  const [appearanceState, setAppearanceState] = useState(currentSettings?.theme || 'system');
  const [contrastState, setContrastState] = useState(currentSettings?.contrast || 'system');
  const [enableDictationState, setEnableDictationState] = useState(currentSettings?.enableDictation ?? true);
  const [languageState, setLanguageState] = useState(currentSettings?.language || 'auto');
  const [srsDueAlertsState, setSrsDueAlertsState] = useState(currentSettings?.srsDueAlerts ?? true);
  const [dailyRemindersState, setDailyRemindersState] = useState(currentSettings?.dailyStudyReminders ?? true);

  // Sync modal state when currentSettings updates from settingsService
  useEffect(() => {
    if (currentSettings) {
      setAiPersonalityState(
        ['all_round', 'advisor', 'librarian', 'tutor', 'editor', 'roommate'].includes(currentSettings.aiPersonality)
          ? currentSettings.aiPersonality
          : 'all_round'
      );
      setAiTeachingStyleState(currentSettings.aiTeachingStyle || 'socratic');
      setAiDepthState(currentSettings.aiModelDepth || 'balanced');
      setAiAcademicState(currentSettings.aiAcademicLevel || 'undergraduate');
      setAiInstructionsState(currentSettings.aiCustomInstructions || '');
      setAiFormattingState(currentSettings.aiFormattingPref || 'standard');
      setAutoSummarizePdfsState(currentSettings.autoSummarizePdfs ?? true);
      setSpacedRepetitionSmartIntervalsState(currentSettings.spacedRepetitionSmartIntervals ?? true);
      setAiAutoPlayVoiceState(currentSettings.aiAutoPlayVoice ?? false);
      setAiProactiveSuggestionsState(currentSettings.aiProactiveSuggestions ?? true);
      setAppearanceState(currentSettings.theme || 'system');
      setContrastState(currentSettings.contrast || 'system');
      setEnableDictationState(currentSettings.enableDictation ?? true);
      setLanguageState(currentSettings.language || 'auto');
      setSrsDueAlertsState(currentSettings.srsDueAlerts ?? true);
      setDailyRemindersState(currentSettings.dailyStudyReminders ?? true);
    }
  }, [currentSettings]);

  const getDropdownDisplayLabel = (type) => {
    switch (type) {
      case 'appearance':
        return appearanceState === 'light' ? 'Light' : appearanceState === 'dark' ? 'Dark' : 'System';
      case 'contrast':
        return contrastState === 'standard' ? 'Standard' : contrastState === 'increased' ? 'Increased' : 'System';
      case 'accent':
        if (accentColor === '#2563EB') return 'Blue';
        if (accentColor === '#6236FF') return 'Purple';
        if (accentColor === '#10B981') return 'Emerald';
        if (accentColor === '#F59E0B') return 'Amber';
        if (accentColor === '#EC4899') return 'Pink';
        if (accentColor === '#06B6D4') return 'Cyan';
        return 'Custom';
      case 'language':
        if (languageState === 'en') return 'English';
        if (languageState === 'es') return 'Español';
        if (languageState === 'fr') return 'Français';
        if (languageState === 'de') return 'Deutsch';
        if (languageState === 'yo') return 'Yorùbá';
        if (languageState === 'ha') return 'Hausa';
        if (languageState === 'ig') return 'Igbo';
        return 'Auto-detect';
      case 'teachingStyle':
        if (aiTeachingStyleState === 'step_by_step') return 'Step-by-Step 🪜';
        if (aiTeachingStyleState === 'concise') return 'Direct & High-Yield ⚡';
        if (aiTeachingStyleState === 'visual') return 'Visual & Intuitive 💡';
        if (aiTeachingStyleState === 'rigorous') return 'Rigorous Scholar 🔬';
        return 'Socratic Tutor 🏛️';
      case 'personality':
      case 'persona':
        if (aiPersonalityState === 'all_round') return 'All Round 🌐';
        if (aiPersonalityState === 'advisor') return 'Advisor 🧭';
        if (aiPersonalityState === 'librarian') return 'Librarian 📚';
        if (aiPersonalityState === 'editor') return 'Editor ✍️';
        if (aiPersonalityState === 'roommate') return 'Roommate 🛋️';
        if (aiPersonalityState === 'tutor') return 'Tutor 🎓';
        return 'All Round 🌐';
      case 'depth':
        if (aiDepthState === 'fast') return 'Fast & Crisp ⚡';
        if (aiDepthState === 'detailed') return 'Deep & Detailed 🧠';
        return 'Balanced ⚖️';
      case 'academic':
        if (aiAcademicState === 'highschool') return 'High School 🏫';
        if (aiAcademicState === 'graduate') return 'Graduate 🔬';
        return 'Undergraduate 🏛️';
      case 'format':
        if (aiFormattingState === 'bullet_points') return 'Bullet Points Only';
        if (aiFormattingState === 'step_by_step') return 'Step-by-Step Proof';
        return 'Structured Standard';
      default:
        return '';
    }
  };

  const DROPDOWN_OPTIONS = {
    appearance: {
      title: 'Appearance',
      current: appearanceState,
      options: [
        { id: 'system', label: 'System' },
        { id: 'dark', label: 'Dark' },
        { id: 'light', label: 'Light' },
      ],
      onSelect: (val) => {
        setAppearanceState(val);
        settingsService.updateSettings({ theme: val });
        setActiveDropdownPicker(null);
        setDropdownLayout(null);
      },
    },
    contrast: {
      title: 'Contrast',
      current: contrastState,
      options: [
        { id: 'system', label: 'System' },
        { id: 'standard', label: 'Standard' },
        { id: 'increased', label: 'Increased' },
      ],
      onSelect: (val) => {
        setContrastState(val);
        settingsService.updateSettings({ contrast: val });
        setActiveDropdownPicker(null);
        setDropdownLayout(null);
      },
    },
    accent: {
      title: 'Accent color',
      current: accentColor,
      options: [
        { id: '#2563EB', label: 'Blue', color: '#2563EB' },
        { id: '#6236FF', label: 'Purple', color: '#6236FF' },
        { id: '#10B981', label: 'Emerald Green', color: '#10B981' },
        { id: '#F59E0B', label: 'Amber Gold', color: '#F59E0B' },
        { id: '#EC4899', label: 'Rose Pink', color: '#EC4899' },
        { id: '#06B6D4', label: 'Cyan Wave', color: '#06B6D4' },
      ],
      onSelect: (val) => {
        settingsService.updateSettings({ accentColor: val });
        setActiveDropdownPicker(null);
        setDropdownLayout(null);
      },
    },
    language: {
      title: 'Language',
      current: languageState,
      options: [
        { id: 'auto', label: 'Auto-detect' },
        { id: 'en', label: 'English' },
        { id: 'es', label: 'Español' },
        { id: 'fr', label: 'Français' },
        { id: 'de', label: 'Deutsch' },
        { id: 'yo', label: 'Yorùbá' },
        { id: 'ha', label: 'Hausa' },
        { id: 'ig', label: 'Igbo' },
      ],
      onSelect: (val) => {
        setLanguageState(val);
        settingsService.updateSettings({ language: val });
        setActiveDropdownPicker(null);
        setDropdownLayout(null);
      },
    },
    teachingStyle: {
      title: 'Teaching Style',
      current: aiTeachingStyleState,
      options: [
        { id: 'socratic', label: 'Socratic Tutor 🏛️' },
        { id: 'step_by_step', label: 'Step-by-Step Guide 🪜' },
        { id: 'concise', label: 'Direct & High-Yield ⚡' },
        { id: 'visual', label: 'Visual & Intuitive 💡' },
        { id: 'rigorous', label: 'Rigorous Scholar 🔬' },
      ],
      onSelect: (val) => {
        setAiTeachingStyleState(val);
        settingsService.updateSettings({ aiTeachingStyle: val });
        setActiveDropdownPicker(null);
        setDropdownLayout(null);
      },
    },
    personality: {
      title: 'Personality',
      current: aiPersonalityState,
      options: [
        { id: 'all_round', label: 'All Round 🌐' },
        { id: 'advisor', label: 'Advisor 🧭' },
        { id: 'librarian', label: 'Librarian 📚' },
        { id: 'tutor', label: 'Tutor 🎓' },
        { id: 'editor', label: 'Editor ✍️' },
        { id: 'roommate', label: 'Roommate 🛋️' },
      ],
      onSelect: (val) => {
        setAiPersonalityState(val);
        settingsService.updateSettings({ aiPersonality: val });
        setActiveDropdownPicker(null);
        setDropdownLayout(null);
      },
    },
    persona: {
      title: 'Personality',
      current: aiPersonalityState,
      options: [
        { id: 'all_round', label: 'All Round 🌐' },
        { id: 'advisor', label: 'Advisor 🧭' },
        { id: 'librarian', label: 'Librarian 📚' },
        { id: 'tutor', label: 'Tutor 🎓' },
        { id: 'editor', label: 'Editor ✍️' },
        { id: 'roommate', label: 'Roommate 🛋️' },
      ],
      onSelect: (val) => {
        setAiPersonalityState(val);
        settingsService.updateSettings({ aiPersonality: val });
        setActiveDropdownPicker(null);
        setDropdownLayout(null);
      },
    },
    depth: {
      title: 'Reasoning Depth',
      current: aiDepthState,
      options: [
        { id: 'fast', label: 'Fast & Crisp (~1s)' },
        { id: 'balanced', label: 'Balanced' },
        { id: 'detailed', label: 'Deep & Detailed' },
      ],
      onSelect: (val) => {
        setAiDepthState(val);
        settingsService.updateSettings({ aiModelDepth: val });
        setActiveDropdownPicker(null);
        setDropdownLayout(null);
      },
    },
    academic: {
      title: 'Academic Level',
      current: aiAcademicState,
      options: [
        { id: 'highschool', label: 'High School & Prep' },
        { id: 'undergraduate', label: 'University / Undergraduate' },
        { id: 'graduate', label: 'Graduate & Professional' },
      ],
      onSelect: (val) => {
        setAiAcademicState(val);
        settingsService.updateSettings({ aiAcademicLevel: val });
        setActiveDropdownPicker(null);
        setDropdownLayout(null);
      },
    },
    format: {
      title: 'Response Formatting',
      current: aiFormattingState,
      options: [
        { id: 'standard', label: 'Structured Standard' },
        { id: 'bullet_points', label: 'Bullet Points Only' },
        { id: 'step_by_step', label: 'Step-by-Step Proof' },
      ],
      onSelect: (val) => {
        setAiFormattingState(val);
        settingsService.updateSettings({ aiFormattingPref: val });
        setActiveDropdownPicker(null);
        setDropdownLayout(null);
      },
    },
  };

  const handleOpenDropdown = (type, btnRef) => {
    if (activeDropdownPicker === type) {
      setActiveDropdownPicker(null);
      setDropdownLayout(null);
      return;
    }
    if (btnRef && btnRef.measureInWindow) {
      btnRef.measureInWindow((x, y, width, height) => {
        const windowDimensions = Dimensions.get('window');
        const screenHeight = windowDimensions.height;
        const screenWidth = windowDimensions.width;

        const optionsCount = DROPDOWN_OPTIONS[type]?.options?.length || 3;
        const estimatedMenuHeight = Math.min(optionsCount * 36 + 14, 220);
        const menuWidth = type === 'persona' || type === 'personality' || type === 'teachingStyle' || type === 'academic' || type === 'format' ? 200 : Math.max(width, 130);

        const spaceBelow = screenHeight - (y + height);
        const shouldOpenUp = spaceBelow < estimatedMenuHeight + 24 && y > estimatedMenuHeight + 40;

        let leftPos = x + width - menuWidth;
        if (leftPos + menuWidth > screenWidth - 12) {
          leftPos = screenWidth - menuWidth - 12;
        }
        if (leftPos < 12) {
          leftPos = 12;
        }

        setDropdownLayout({
          x,
          y,
          width,
          height,
          left: leftPos,
          openDirection: shouldOpenUp ? 'up' : 'down',
          menuWidth,
          estimatedHeight: estimatedMenuHeight,
        });
        setActiveDropdownPicker(type);
      });
    } else {
      setActiveDropdownPicker(type);
    }
  };

  const renderChatGptDropdown = (type) => {
    const data = DROPDOWN_OPTIONS[type];
    if (!data) return null;
    const isOpen = activeDropdownPicker === type;

    return (
      <ChatGptDropdownTrigger
        type={type}
        isOpen={isOpen}
        label={getDropdownDisplayLabel(type)}
        accentColor={accentColor}
        isDark={isDark}
        styles={styles}
        onPress={(ref) => handleOpenDropdown(type, ref)}
      />
    );
  };

  const handleSaveAiSettings = async () => {
    const updated = {
      aiPersonality: aiPersonalityState,
      aiTeachingStyle: aiTeachingStyleState,
      aiModelDepth: aiDepthState,
      aiAcademicLevel: aiAcademicState,
      aiCustomInstructions: aiInstructionsState,
      aiFormattingPref: aiFormattingState,
      autoSummarizePdfs: autoSummarizePdfsState,
      spacedRepetitionSmartIntervals: spacedRepetitionSmartIntervalsState,
      aiAutoPlayVoice: aiAutoPlayVoiceState,
      aiProactiveSuggestions: aiProactiveSuggestionsState,
    };
    await settingsService.updateSettings(updated);
    setIsAiSettingsModalOpen(false);
    showToast('Branco AI coach settings saved! ✨', '🤖');
  };

  const handleResetAiSettings = async () => {
    Alert.alert(
      'Reset AI Settings',
      'Revert all AI chatbot personality and intelligence settings to their default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Defaults',
          style: 'destructive',
          onPress: async () => {
            const defaults = {
              aiPersonality: 'all_round',
              aiTeachingStyle: 'socratic',
              aiModelDepth: 'balanced',
              aiAcademicLevel: 'undergraduate',
              aiCustomInstructions: '',
              aiFormattingPref: 'standard',
              autoSummarizePdfs: true,
              spacedRepetitionSmartIntervals: true,
              aiAutoPlayVoice: false,
              aiProactiveSuggestions: true,
            };
            await settingsService.updateSettings(defaults);
            setAiPersonalityState('all_round');
            setAiTeachingStyleState('socratic');
            setAiDepthState('balanced');
            setAiAcademicState('undergraduate');
            setAiInstructionsState('');
            setAiFormattingState('standard');
            setAutoSummarizePdfsState(true);
            setSpacedRepetitionSmartIntervalsState(true);
            setAiAutoPlayVoiceState(false);
            setAiProactiveSuggestionsState(true);
            showToast('AI coach settings reset to default ↺', '↺');
          },
        },
      ]
    );
  };

  // Long press / Action sheet state for chat history
  const [historyActionConv, setHistoryActionConv] = useState(null);
  const [isRenamingConv, setIsRenamingConv] = useState(false);
  const [renameText, setRenameText] = useState('');

  const handleLongPressHistory = (conv) => {
    setHistoryActionConv(conv);
    setRenameText(conv.title);
    setIsRenamingConv(false);
  };

  const handleTogglePinConversation = (convId) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, isPinned: !c.isPinned } : c))
    );
    setHistoryActionConv(null);
  };

  const handleDeleteConversation = (convId) => {
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== convId);
      if (convId === activeConversationId) {
        if (remaining.length > 0) {
          setActiveConversationId(remaining[0].id);
        } else {
          const newId = uid();
          const newC = {
            id: newId,
            title: 'New Chat',
            messages: [],
            createdAt: Date.now(),
            isPinned: false,
          };
          setActiveConversationId(newId);
          return [newC];
        }
      }
      return remaining;
    });
    setHistoryActionConv(null);
  };

  const handleSaveRename = () => {
    if (!renameText.trim() || !historyActionConv) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === historyActionConv.id ? { ...c, title: renameText.trim() } : c
      )
    );
    setIsRenamingConv(false);
    setHistoryActionConv(null);
  };

  const handleSelectDestination = (dest) => {
    setIsNavModalVisible(false);
    if (onNavigate) {
      onNavigate(dest.id);
    } else if (onSelectTab && dest.tab) {
      onSelectTab(dest.tab);
    }
  };

  const ACTION_TOOLS = [
    {
      id: 'new_chat',
      label: t("aiCoach.newChat", "New chat"),
      icon: ComposeNewChatIcon,
      onPress: () => {
        handleNewChat();
        setShowHistory(false);
      },
    },
    {
      id: 'resources',
      label: t("aiCoach.resources", "Resources"),
      icon: ResourcesToolIcon,
      onPress: () => {
        if (onNavigate) onNavigate('resources');
      },
    },
    {
      id: 'library',
      label: t("aiCoach.library", "Library"),
      icon: LibraryToolIcon,
      onPress: () => {
        if (onNavigate) onNavigate('library');
      },
    },
  ];

  const filteredConversations = conversations.filter((c) => {
    const hasMessages = c.messages && c.messages.length > 0;
    if (!hasMessages) return false;

    if (!drawerSearchQuery.trim()) return true;
    return c.title.toLowerCase().includes(drawerSearchQuery.trim().toLowerCase());
  });

  const pinnedChats = filteredConversations.filter((c) => c.isPinned);
  const recentChats = filteredConversations.filter((c) => !c.isPinned);

  const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.84, 290);
  const drawerSlideAnim = useRef(new Animated.Value(initialShowHistory ? 0 : -DRAWER_WIDTH)).current;
  const drawerFadeAnim = useRef(new Animated.Value(initialShowHistory ? 1 : 0)).current;

  useEffect(() => {
    if (initialShowHistory) {
      setShowHistory(true);
      setIsDrawerVisible(true);
      drawerSlideAnim.setValue(0);
      drawerFadeAnim.setValue(1);
      if (onClearInitialShowHistory) {
        onClearInitialShowHistory();
      }
    }
  }, [initialShowHistory]);

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
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playingVoiceMsgId, setPlayingVoiceMsgId] = useState(null);
  const [voicePlaybackProgress, setVoicePlaybackProgress] = useState({});
  // ── In-Screen Live Voice Chat with Branco states ──
  const [isLiveVoiceActive, setIsLiveVoiceActive] = useState(false);
  const [liveVoiceState, setLiveVoiceState] = useState('listening'); // 'listening' | 'thinking' | 'speaking' | 'muted'
  const [liveVoiceUserTranscript, setLiveVoiceUserTranscript] = useState('');
  const [liveVoiceAiTranscript, setLiveVoiceAiTranscript] = useState('');
  const [isLiveVoiceMuted, setIsLiveVoiceMuted] = useState(false);
  const [liveVoiceInputText, setLiveVoiceInputText] = useState('');
  const liveOrbPulseAnim = useRef(new Animated.Value(1)).current;
  const liveOrbDisperseAnim = useRef(new Animated.Value(0)).current;
  const liveOrbRotateAnim1 = useRef(new Animated.Value(0)).current;
  const liveOrbRotateAnim2 = useRef(new Animated.Value(0)).current;
  const liveOrbWaveAnims = useRef([0, 1, 2, 3, 4, 5, 6].map(() => new Animated.Value(0.2))).current;
  const [attachedFile, setAttachedFile] = useState(null);
  const [playingAudioMsgId, setPlayingAudioMsgId] = useState(null);
  const [savedSrsMsgs, setSavedSrsMsgs] = useState({});
  const [savedNotesMsgs, setSavedNotesMsgs] = useState({});
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [dockBarWidth, setDockBarWidth] = useState(() => {
    const windowWidth = Dimensions.get('window').width;
    return Math.min(Math.max(windowWidth - 28, 280), 420);
  });
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [previewIsPlaying, setPreviewIsPlaying] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [previewCurrentTime, setPreviewCurrentTime] = useState('0:00');
  const [previewWaveWidth, setPreviewWaveWidth] = useState(140);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const recordedAudioRef = useRef(null);
  recordedAudioRef.current = recordedAudio;
  const previewProgressRef = useRef(0);
  previewProgressRef.current = previewProgress;
  const previewWaveLayoutRef = useRef({ x: 0, width: 140 });
  const previewWaveContainerRef = useRef(null);

  const inputRef = useRef(null);
  const focusGlowAnim = useRef(new Animated.Value(0)).current;
  const keyboardAnim = useRef(new Animated.Value(0)).current;
  const recordingTimerRef = useRef(null);
  const recordingDurationRef = useRef(0);
  const recordPulseAnim = useRef(new Animated.Value(1)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const waveBarAnims = useRef([0, 1, 2, 3, 4, 5, 6].map(() => new Animated.Value(0))).current;

  // Non-intrusive floating toast notification state
  const [toastNotification, setToastNotification] = useState(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimeoutRef = useRef(null);

  const showToast = (message, icon = '🎙️') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastNotification({ message, icon });
    toastAnim.setValue(0);
    Animated.spring(toastAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();

    toastTimeoutRef.current = setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setToastNotification(null);
      });
    }, 2400);
  };

  // Stop any active live voice session and cleanup timers on unmount
  useEffect(() => {
    return () => {
      liveVoiceChatService.stopLiveSession();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const blurInput = () => {
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  const swipeGesture = useSwipeFocusGesture({
    onSwipeUp: focusInput,
    onSwipeDown: blurInput,
    activeOffsetY: 48,
    failOffsetX: 32,
    minTranslationY: 48,
  });

  useEffect(() => {
    Animated.timing(focusGlowAnim, {
      toValue: isInputFocused ? 1 : 0,
      duration: 450,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isInputFocused]);

  // Pulse animation for recording dot
  useEffect(() => {
    let pulse;
    if (isRecording) {
      pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(recordPulseAnim, {
            toValue: 1.35,
            duration: 600,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(recordPulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );
      pulse.start();
    } else {
      recordPulseAnim.setValue(1);
    }
    return () => {
      if (pulse) pulse.stop();
    };
  }, [isRecording]);

  // Dynamic audio metering for waveform bars: expands and reduces with sensed human voice
  useEffect(() => {
    if (isRecording) {
      const unsubscribe = voiceRecordingService.onAudioLevel((level, spectrum) => {
        if (spectrum && Array.isArray(spectrum) && spectrum.length === 7) {
          spectrum.forEach((val, i) => {
            Animated.timing(waveBarAnims[i], {
              toValue: val,
              duration: 40,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }).start();
          });
        } else {
          const centerBias = [0.45, 0.72, 0.92, 1.0, 0.92, 0.72, 0.45];
          waveBarAnims.forEach((anim, i) => {
            Animated.timing(anim, {
              toValue: Math.min(1, (level || 0) * (centerBias[i] || 1)),
              duration: 40,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }).start();
          });
        }
      });
      return () => {
        unsubscribe();
        waveBarAnims.forEach((anim) => anim.setValue(0));
      };
    } else {
      waveBarAnims.forEach((anim) => anim.setValue(0));
    }
  }, [isRecording]);

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      voiceRecordingService.stopPlayback();
    };
  }, []);

  const flatListRef = useRef(null);

  // Derive active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];
  const hasMessages = messages.length > 0;
  const reversedMessages = useMemo(() => (messages ? [...messages].reverse() : []), [messages]);
  const prevMsgCountRef = useRef(messages.length);

  // Position at latest message when a new message arrives
  useEffect(() => {
    if (!isLiveVoiceActive && hasMessages) {
      const isNewMessage = messages.length > prevMsgCountRef.current;
      prevMsgCountRef.current = messages.length;
      if (isNewMessage) {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
    } else {
      prevMsgCountRef.current = messages.length;
    }
  }, [messages, isLiveVoiceActive, activeConversationId, hasMessages]);

  // Get first name for greeting
  const firstName = user?.name?.split(' ')[0] || 'there';

  // ── Keyboard handling ──
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const targetHeight = e?.endCoordinates?.height || 0;
      const duration = e?.duration || 250;
      setKeyboardHeight(targetHeight);
      Animated.timing(keyboardAnim, {
        toValue: targetHeight,
        duration: duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      const duration = e?.duration || 220;
      setKeyboardHeight(0);
      Animated.timing(keyboardAnim, {
        toValue: 0,
        duration: duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // ── Update messages in active conversation ──
  const updateActiveMessages = (updater) => {
    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: typeof updater === 'function' ? updater(c.messages) : updater }
        : c
    ));
  };

  // ── Auto-title conversation from first message ──
  const autoTitleConversation = (text, convId = activeConversationId) => {
    setConversations(prev => prev.map(c =>
      c.id === convId && (c.title === 'New Chat' || !c.title)
        ? { ...c, title: text.substring(0, 40) + (text.length > 40 ? '...' : '') }
        : c
    ));
  };

  // ── New Chat ──
  const handleNewChat = () => {
    if (activeConversation && (!activeConversation.messages || activeConversation.messages.length === 0)) {
      setInputText('');
      setAttachedFile(null);
      setExpandedSteps({});
      return;
    }
    const newId = uid();
    const newConv = { id: newId, title: 'New Chat', messages: [], createdAt: Date.now(), isPinned: false };
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

  // ── Audio Listen (Text-to-Speech) ──
  const handleToggleListen = (msgId, messageItem) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (playingAudioMsgId === msgId) {
        window.speechSynthesis.cancel();
        setPlayingAudioMsgId(null);
        showToast('Audio playback stopped', '⏹️');
        return;
      }
      window.speechSynthesis.cancel();
      const rawText = messageItem?.text || '';
      const cleanText = rawText
        .replace(/^🎙️[^\n]+\n\n?/, '')
        .replace(/[*#_`]/g, '')
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2')
        .replace(/\\lim_\{([^}]+)\}/g, 'limit $1')
        .replace(/\\to|\\rightarrow/g, ' approaches ')
        .trim();

      if (cleanText) {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setPlayingAudioMsgId(null);
        utterance.onerror = () => setPlayingAudioMsgId(null);
        setPlayingAudioMsgId(msgId);
        window.speechSynthesis.speak(utterance);
        showToast('Reading AI explanation aloud...', '🔊');
        return;
      }
    }

    if (playingAudioMsgId === msgId) {
      setPlayingAudioMsgId(null);
      showToast('Audio playback stopped', '⏹️');
    } else {
      setPlayingAudioMsgId(msgId);
      showToast('Reading AI explanation aloud...', '🔊');
    }
  };

  // ── SRS Save ──
  const handleSaveToSrs = (msgId) => {
    const isCurrentlySaved = !!savedSrsMsgs[msgId];
    setSavedSrsMsgs(prev => ({ ...prev, [msgId]: !isCurrentlySaved }));
    if (!isCurrentlySaved) {
      showToast('Key concepts saved to SRS Flashcards!', '⚡');
    } else {
      showToast('Removed from SRS Flashcards', '🗑️');
    }
  };

  // ── Note Save ──
  const handleSaveNote = (msgId, messageItem) => {
    const existingNoteId = savedNotesMsgs[msgId];

    if (existingNoteId) {
      // Toggle off / delete saved note
      if (typeof existingNoteId === 'string' && existingNoteId !== 'true') {
        studyService.deleteNote(existingNoteId);
      }
      setSavedNotesMsgs(prev => {
        const next = { ...prev };
        delete next[msgId];
        return next;
      });
      showToast('Removed from Study Notes', '🗑️');
      return;
    }

    // Find the preceding user question that prompted this AI message
    const currentMessages = activeConversation?.messages || [];
    const aiMsgIndex = currentMessages.findIndex(m => m.id === msgId);
    let userQuestion = '';

    if (aiMsgIndex > 0) {
      for (let i = aiMsgIndex - 1; i >= 0; i--) {
        if (currentMessages[i].sender === 'user') {
          userQuestion = (currentMessages[i].text || '')
            .replace(/^🎤 Voice Message \([^)]+\)\n?/, '')
            .trim();
          break;
        }
      }
    }

    if (!userQuestion) {
      userQuestion = 'AI Coach Study Inquiry';
    }

    const cleanAiText = (messageItem?.text || '')
      .replace(/^🎙️[^\n]+\n\n?/, '')
      .trim();

    let noteContent = `### ❓ Question\n${userQuestion}\n\n### 💡 Solution & Explanation\n${cleanAiText}`;

    if (messageItem?.latexFormula) {
      noteContent += `\n\n### 📐 Key Formula\n${messageItem.latexFormula}`;
    }

    if (messageItem?.steps && messageItem.steps.length > 0) {
      noteContent += `\n\n### 📋 Step-by-Step Breakdown\n` +
        messageItem.steps
          .map((s, i) => `${i + 1}. **${s.title}**: ${s.content}`)
          .join('\n');
    }

    if (messageItem?.example) {
      noteContent += `\n\n### 💡 Pro Tip\n${messageItem.example}`;
    }

    const noteTitle = userQuestion.length > 55
      ? userQuestion.slice(0, 52) + '...'
      : userQuestion;

    const newNote = studyService.saveNote({
      title: noteTitle,
      subjectId: 'ai-coach',
      topicId: activeMode || 'general',
      content: noteContent,
    });

    setSavedNotesMsgs(prev => ({
      ...prev,
      [msgId]: newNote?.id || true,
    }));

    showToast('Question & AI solution saved directly to Study Notes!', '📝');
  };

  // ── Send message ──
  const handleSendMessage = (textToSend = inputText, fileToSend = attachedFile, convId = activeConversationId) => {
    const text = (typeof textToSend === 'string' ? textToSend : '').trim();
    const file = fileToSend !== undefined ? fileToSend : attachedFile;
    if (!text && !file) return;

    const targetId = convId || activeConversationId;
    autoTitleConversation(text || (file ? `Analyze ${file.name}` : 'New Study Inquiry'), targetId);

    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: file ? `[Attached ${file.name}]\n${text}` : text,
    };

    setConversations(prev => prev.map(c =>
      c.id === targetId
        ? { ...c, messages: [...(c.messages || []), userMsg] }
        : c
    ));
    setInputText('');
    setAttachedFile(null);

    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

    // Simulate AI Response
    setTimeout(() => {
      let aiResponseText = '';
      let latexFormula = null;
      let steps = null;
      let example = null;

      const persona = currentSettings?.aiPersonality || 'encouraging';
      const depth = currentSettings?.aiModelDepth || 'balanced';

      const aiResponse = getLocalizedAiResponse({
        text,
        activeMode,
        lang: currentLang,
        persona,
        depth,
      });

      if (activeMode === 'quiz' || text.toLowerCase().includes('quiz')) {
        gamificationService.recordQuizCompletion(90, 100);
      }

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg = {
        id: aiMsgId,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiResponse.text,
        mode: activeMode,
        latexFormula: aiResponse.latexFormula,
        steps: aiResponse.steps,
        example: aiResponse.example,
        suggestedActions: aiResponse.suggestedActions,
      };

      setConversations(prev => prev.map(c =>
        c.id === targetId
          ? { ...c, messages: [...(c.messages || []), aiMsg] }
          : c
      ));
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
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

  // ── Voice Recording & Messaging Handlers ──
  const handleStartVoiceRecording = async () => {
    Keyboard.dismiss();
    setIsInputFocused(false);

    // 1. Instantly trigger visual state and start expansion immediately on click
    setIsRecording(true);
    setRecordingDuration(0);
    recordingDurationRef.current = 0;

    // Expand background from microphone immediately with zero latency
    expandAnim.setValue(0);
    rotateAnim.setValue(0);
    Animated.parallel([
      // Pill expands quickly and responsively
      Animated.timing(expandAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      // Icon crossfade: smooth & visible on native thread
      Animated.sequence([
        Animated.delay(100),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 750,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    ]).start();

    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      recordingDurationRef.current += 1;
      setRecordingDuration(recordingDurationRef.current);
    }, 1000);

    // 2. Initialize audio hardware in background concurrently
    try {
      const res = await voiceRecordingService.startRecording();
      if (res && res.error) {
        handleCancelVoiceRecording();
        Alert.alert(
          'Microphone Access',
          'Please enable microphone access in your device settings to record voice messages.'
        );
      }
    } catch (err) {
      console.warn('[handleStartVoiceRecording] Error starting recording:', err);
    }
  };

  const handleCancelVoiceRecording = async () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    // Retract pill smoothly back into microphone button
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: 0,
        duration: 460,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 460,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      setIsRecording(false);
      setRecordingDuration(0);
    });

    await voiceRecordingService.cancelRecording();
  };

  const handleFinishRecordingToPreview = async () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    const finalSecs = Math.max(1, recordingDurationRef.current);

    const recordingResult = await voiceRecordingService.stopRecording(finalSecs);
    if (!recordingResult) {
      handleCancelVoiceRecording();
      return;
    }

    setIsRecording(false);
    setRecordedAudio(recordingResult);
    setPreviewIsPlaying(false);
    setPreviewProgress(0);
    setPreviewCurrentTime('0:00');
  };

  const handleSeekPreviewAudio = (fraction) => {
    const audioObj = recordedAudioRef.current || recordedAudio;
    if (!audioObj) return;
    const clampedFraction = Math.min(1, Math.max(0, fraction));
    setPreviewProgress(clampedFraction);
    const elapsedSecs = Math.floor(clampedFraction * (audioObj.duration || 1));
    setPreviewCurrentTime(voiceRecordingService.formatDuration(elapsedSecs));
    voiceRecordingService.seekPlayback(clampedFraction, audioObj.duration);
  };

  const handleTogglePreviewPlayback = async () => {
    if (!recordedAudio) return;
    if (previewIsPlaying) {
      await voiceRecordingService.stopPlayback();
      setPreviewIsPlaying(false);
    } else {
      setPreviewIsPlaying(true);
      const startFrac = previewProgress >= 0.98 ? 0 : previewProgress;
      if (startFrac === 0) {
        setPreviewProgress(0);
        setPreviewCurrentTime('0:00');
      }
      await voiceRecordingService.playVoiceNote(
        recordedAudio.uri,
        (progress, curTime) => {
          setPreviewProgress(progress);
          const elapsedSecs = Math.floor(curTime != null ? curTime : (progress * (recordedAudio.duration || 1)));
          setPreviewCurrentTime(voiceRecordingService.formatDuration(elapsedSecs));
        },
        () => {
          setPreviewIsPlaying(false);
          setPreviewProgress(0);
          setPreviewCurrentTime('0:00');
        },
        recordedAudio.duration,
        startFrac
      );
    }
  };

  const previewPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: (evt) => {
          setIsScrubbing(true);
          const touchX = evt.nativeEvent.locationX;
          const w = previewWaveLayoutRef.current.width || 140;
          const fraction = Math.min(1, Math.max(0, touchX / w));
          handleSeekPreviewAudio(fraction);
        },
        onPanResponderMove: (evt, gestureState) => {
          const w = previewWaveLayoutRef.current.width || 140;
          let touchX = evt.nativeEvent.locationX;
          if (gestureState.dx !== 0 && previewWaveLayoutRef.current.x > 0) {
            touchX = evt.nativeEvent.pageX - previewWaveLayoutRef.current.x;
          }
          const fraction = Math.min(1, Math.max(0, touchX / w));
          handleSeekPreviewAudio(fraction);
        },
        onPanResponderRelease: () => {
          setIsScrubbing(false);
        },
        onPanResponderTerminate: () => {
          setIsScrubbing(false);
        },
      }),
    [recordedAudio]
  );

  const handleDiscardPreviewAudio = async () => {
    await voiceRecordingService.stopPlayback();
    setPreviewIsPlaying(false);

    // Retract background smoothly back into microphone button
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: 0,
        duration: 460,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 460,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      setRecordedAudio(null);
      setPreviewProgress(0);
      setRecordingDuration(0);
    });
  };

  const handleSendPreviewAudio = async () => {
    if (!recordedAudio) return;
    await voiceRecordingService.stopPlayback();
    setPreviewIsPlaying(false);
    const audioToSend = recordedAudio;

    // Retract background smoothly back into microphone button
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: 0,
        duration: 460,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 460,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      setRecordedAudio(null);
      setPreviewProgress(0);
      setRecordingDuration(0);
    });

    handleSendVoiceMessage(audioToSend);
  };

  const handleToggleMic = () => {
    if (recordedAudio) {
      handleSendPreviewAudio();
    } else if (!isRecording) {
      handleStartVoiceRecording();
    } else {
      handleFinishRecordingToPreview();
    }
  };

  const handleSendVoiceMessage = (recordingData) => {
    const targetId = activeConversationId;
    autoTitleConversation(`Voice note (${recordingData.durationText})`, targetId);

    const userMsgId = `voice-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      timestamp: recordingData.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoice: true,
      audioUri: recordingData.uri,
      duration: recordingData.duration,
      durationText: recordingData.durationText,
      waveform: recordingData.waveform || voiceRecordingService.generateWaveform(22),
      text: `🎤 Voice Message (${recordingData.durationText})`,
    };

    setConversations(prev => prev.map(c =>
      c.id === targetId
        ? { ...c, messages: [...(c.messages || []), userMsg] }
        : c
    ));

    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

    // AI Companion Response to Voice Note
    setTimeout(() => {
      const persona = currentSettings?.aiPersonality || 'encouraging';
      const depth = currentSettings?.aiModelDepth || 'balanced';

      const promptContext = 'Explain the key concepts and actionable study takeaways for my question.';
      const aiResponse = getLocalizedAiResponse({
        text: promptContext,
        activeMode,
        lang: currentLang,
        persona,
        depth,
      });

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg = {
        id: aiMsgId,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiResponse.text,
        mode: activeMode,
        latexFormula: aiResponse.latexFormula,
        steps: aiResponse.steps,
        example: aiResponse.example,
        suggestedActions: aiResponse.suggestedActions,
      };

      setConversations(prev => prev.map(c =>
        c.id === targetId
          ? { ...c, messages: [...(c.messages || []), aiMsg] }
          : c
      ));
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 900);
  };

  const handleTogglePlayVoiceNote = async (item) => {
    if (playingVoiceMsgId === item.id) {
      await voiceRecordingService.stopPlayback();
      setPlayingVoiceMsgId(null);
      return;
    }

    setPlayingVoiceMsgId(item.id);
    setVoicePlaybackProgress(prev => ({ ...prev, [item.id]: 0 }));

    await voiceRecordingService.playVoiceNote(
      item.audioUri,
      (progress) => {
        setVoicePlaybackProgress(prev => ({ ...prev, [item.id]: progress }));
      },
      () => {
        setPlayingVoiceMsgId(null);
        setVoicePlaybackProgress(prev => ({ ...prev, [item.id]: 0 }));
      }
    );
  };

  const handleCloseLiveVoice = () => {
    liveVoiceChatService.stopLiveSession();
    setIsLiveVoiceActive(false);
    setLiveVoiceState('listening');
    setLiveVoiceUserTranscript('');
    setLiveVoiceAiTranscript('');
    setLiveVoiceInputText('');
    setIsLiveVoiceMuted(false);
    liveOrbPulseAnim.setValue(1);
    liveOrbDisperseAnim.setValue(0);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    showToast(t("aiCoach.liveVoiceEnded", "Live voice chat ended"), "🎙️");
  };

  const handleSendLiveVoicePrompt = () => {
    const text = liveVoiceInputText.trim();
    if (!text) return;
    setLiveVoiceUserTranscript(text);
    setLiveVoiceAiTranscript('');
    setLiveVoiceInputText('');
    Keyboard.dismiss();
    handleAskLivePrompt(text);
  };

  const handleToggleLiveVoice = async () => {
    if (isLiveVoiceActive) {
      handleCloseLiveVoice();
      return;
    }

    Keyboard.dismiss();
    setIsLiveVoiceActive(true);
    setLiveVoiceState('listening');
    setLiveVoiceUserTranscript('');
    setLiveVoiceAiTranscript('');
    // Voice scale and dispersion init
    liveOrbPulseAnim.setValue(1);
    liveOrbDisperseAnim.setValue(0);

    const liveLang = currentLang || 'en';
    const persona = currentSettings?.aiPersonality || 'encouraging';
    const depth = currentSettings?.aiModelDepth || 'balanced';
    await liveVoiceChatService.startLiveSession({
      lang: liveLang,
      persona,
      depth,
      onStateChange: (state) => setLiveVoiceState(state),
      onUserTranscript: (text) => {
        setLiveVoiceUserTranscript(text);
        setLiveVoiceAiTranscript('');
      },
      onUserFinal: (text) => {
        setLiveVoiceUserTranscript(text);
        setLiveVoiceAiTranscript('');
        const userMsg = {
          id: 'user_live_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          sender: 'user',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          type: 'live_voice',
        };
        setConversations(prev => prev.map(c =>
          c.id === activeConversationId
            ? { ...c, messages: [...(c.messages || []), userMsg] }
            : c
        ));
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);
      },
      onAiTranscript: (text) => {
        setLiveVoiceAiTranscript(text);
        const aiMsg = {
          id: 'ai_live_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          sender: 'ai',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          type: 'live_voice',
        };
        setConversations(prev => prev.map(c =>
          c.id === activeConversationId
            ? { ...c, messages: [...(c.messages || []), aiMsg] }
            : c
        ));
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);
      },
      onAudioLevel: (level, spectrum) => {
        const voiceLevel = Math.max(0, Math.min(1.0, level || 0));
        const isVoiceActive = voiceLevel > 0.02;

        // 1. Voice-reactive scale: dynamic spring expansion scaling directly with the user's vocal volume
        // Whisper / quiet: ~1.10x | Normal speaking: ~1.30x - 1.40x | Emphatic / loud: ~1.55x+
        const targetScale = isVoiceActive ? 1.0 + Math.pow(voiceLevel, 0.7) * 0.55 : 1.0;
        Animated.spring(liveOrbPulseAnim, {
          toValue: targetScale,
          friction: isVoiceActive ? 5 : 7,
          tension: isVoiceActive ? 220 : 140,
          useNativeDriver: false,
        }).start();

        // 2. Disperse & mix colors: fluid dispersion expanding with voice intensity
        const targetDisperse = isVoiceActive ? Math.min(1.0, 0.35 + Math.pow(voiceLevel, 0.65) * 0.85) : 0;
        Animated.spring(liveOrbDisperseAnim, {
          toValue: targetDisperse,
          friction: isVoiceActive ? 6 : 8,
          tension: isVoiceActive ? 200 : 130,
          useNativeDriver: false,
        }).start();

        if (spectrum && Array.isArray(spectrum)) {
          spectrum.forEach((val, idx) => {
            if (liveOrbWaveAnims[idx]) {
              Animated.timing(liveOrbWaveAnims[idx], {
                toValue: Math.max(0.12, Math.min(1.0, val)),
                duration: 40,
                useNativeDriver: false,
              }).start();
            }
          });
        }
      },
    });
  };

  const handleToggleLiveMute = () => {
    const muted = liveVoiceChatService.toggleMute();
    setIsLiveVoiceMuted(muted);
    if (muted) {
      Animated.spring(liveOrbPulseAnim, {
        toValue: 1.0,
        friction: 8,
        tension: 160,
        useNativeDriver: false,
      }).start();
      Animated.spring(liveOrbDisperseAnim, {
        toValue: 0,
        friction: 8,
        tension: 160,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleInterruptLiveVoice = () => {
    liveVoiceChatService.interrupt();
    setLiveVoiceState('listening');
  };

  const handleAskLivePrompt = (promptText) => {
    const liveLang = currentLang || 'en';
    const persona = currentSettings?.aiPersonality || 'encouraging';
    const depth = currentSettings?.aiModelDepth || 'balanced';
    liveVoiceChatService.askQuestionManually(promptText, liveLang, persona, depth);
  };

  // ── Render Chat Message Item ──
  const renderMessageItem = ({ item }) => {
    const isUser = item.sender === 'user';

    if (isUser) {
      if (item.isVoice) {
        const isPlaying = playingVoiceMsgId === item.id;
        const progress = voicePlaybackProgress[item.id] || 0;
        const waveform = item.waveform || [35, 50, 65, 45, 80, 60, 75, 95, 70, 50, 55, 80, 65, 45, 60, 75, 50, 35];
        const playedCount = Math.floor(progress * waveform.length);

        return (
          <View style={styles.userBubbleWrapper}>
            <View style={[styles.userBubble, styles.userVoiceBubble]}>
              {/* Voice Header */}
              <View style={styles.voiceNoteHeader}>
                <View style={styles.voiceNoteBadge}>
                  <MicIcon color="#FFFFFF" size={12} />
                  <Text style={styles.voiceNoteBadgeText}>{t('aiCoach.voiceMessage', 'Voice Message')}</Text>
                </View>
                <Text style={styles.voiceNoteDuration}>{item.durationText || '0:03'}</Text>
              </View>

              {/* Player Row */}
              <View style={styles.voicePlayerRow}>
                <TouchableOpacity
                  style={styles.voicePlayBtn}
                  onPress={() => handleTogglePlayVoiceNote(item)}
                  activeOpacity={0.8}
                >
                  {isPlaying ? (
                    <PauseIcon color="#6236FF" size={14} />
                  ) : (
                    <PlayIcon color="#6236FF" size={14} />
                  )}
                </TouchableOpacity>

                <View style={styles.voiceWaveformTrack}>
                  {waveform.map((h, idx) => {
                    const isPassed = isPlaying && idx <= playedCount;
                    return (
                      <View
                        key={idx}
                        style={[
                          styles.voiceWaveBar,
                          {
                            height: Math.max(5, Math.min(24, (h / 100) * 24)),
                            backgroundColor: isPassed ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)',
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              </View>

              {/* Timestamp */}
              <Text style={styles.userVoiceTime}>{item.timestamp}</Text>
            </View>
          </View>
        );
      }

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
      <AiMessageCard
        item={item}
        isDark={isDark}
        accentColor={accentColor}
        isExpanded={isExpanded}
        toggleSteps={toggleSteps}
        isAudioPlaying={isAudioPlaying}
        handleToggleListen={handleToggleListen}
        isSavedSrs={isSavedSrs}
        handleSaveToSrs={handleSaveToSrs}
        isSavedNote={isSavedNote}
        handleSaveNote={handleSaveNote}
        t={t}
      />
    );
  };

  // ── Layout calculations ──
  const isKeyboardVisible = keyboardHeight > 0;
  const dockBottomOffset = isKeyboardVisible
    ? keyboardHeight
    : Math.max(insets.bottom, 12) + 8;

  const hasInput = inputText.trim().length > 0;

  // ═════════════════════════════════════════════════════════════════════════════
  // ─── RENDER ───────────────────────────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════════════════════

  return (
    <SafeAreaView
      style={[styles.container, isLiveVoiceActive && { backgroundColor: isDark ? '#000000' : '#F8FAFC' }]}
      edges={isLiveVoiceActive ? ['top', 'left', 'right'] : ['left', 'right']}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent={true}
      />

      {/* ── NON-INTRUSIVE FLOATING TOAST NOTIFICATION ── */}
      {toastNotification && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.floatingInfoToast,
            {
              top: insets.top + (Platform.OS === 'ios' ? 62 : 68),
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-14, 0],
                  }),
                },
                {
                  scale: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.93, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.toastIconBox}>
            <Text style={styles.toastIconEmoji}>{toastNotification.icon}</Text>
          </View>
          <Text style={styles.floatingInfoToastText}>{toastNotification.message}</Text>
        </Animated.View>
      )}

      {/* ── FLOATING SMOKY HEADER ── */}
      {!isLiveVoiceActive && (
        <View style={[styles.floatingHeaderWrapper, { paddingTop: insets.top }]}>
          <View style={styles.headerTintOverlay} pointerEvents="none" />

          <View style={styles.topHeader}>
            {/* Left: Chat History Hamburger (UNTOUCHED - ALWAYS OPENS CHAT HISTORY) */}
            <TooltipTouchable
              tooltip="Chat History"
              style={styles.headerIconBtn}
              onPress={() => setShowHistory(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MenuIcon color={isDark ? "#F8FAFC" : "#0F172A"} size={20} />
            </TooltipTouchable>

            {/* Center: Title & Subtitle */}
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{t("aiCoach.title", "Branco")}</Text>
              <Text style={styles.headerSubtitle}>{t("aiCoach.subtitle", "Your personal study companion ✨")}</Text>
            </View>

            {/* Right: Actions Group (New Chat + Screen Switcher) */}
            <View style={styles.headerRightActions}>
              <TooltipTouchable
                tooltip="New Chat"
                style={styles.headerIconBtn}
                onPress={handleNewChat}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <PlusIcon color={isDark ? "#F8FAFC" : "#0F172A"} size={20} />
              </TooltipTouchable>

              <TooltipTouchable
                tooltip="Screen Switcher"
                style={[styles.headerIconBtn, styles.navSwitcherBtn]}
                onPress={() => setIsNavModalVisible(true)}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <CompassNavIcon color={isDark ? (accentColor || "#A78BFA") : (accentColor || "#6236FF")} size={20} />
              </TooltipTouchable>
            </View>
          </View>
        </View>
      )}

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <View style={{ flex: 1 }}>
        {/* SRS Return Banner */}
        {activeSrsReturnState && (
          <View style={[styles.srsReturnBanner, { marginTop: insets.top + 58 }]}>
            <View style={styles.srsReturnBannerLeft}>
              <View style={styles.srsReturnIconCircle}>
                <StudyFlashNavIcon size={16} color="#6236FF" />
              </View>
              <View style={styles.srsReturnTextGroup}>
                <Text style={styles.srsReturnTitle}>
                  {t("aiCoach.srsReviewInProgress", { number: activeSrsReturnState.currentIndex + 1 })}
                </Text>
                <Text style={styles.srsReturnSubtitle} numberOfLines={1}>
                  {activeSrsReturnState.questionText ? `"${activeSrsReturnState.questionText}"` : "Resume flashcard study"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.srsReturnBtn}
              onPress={() => {
                const targetState = activeSrsReturnState;
                setActiveSrsReturnState(null);
                if (onNavigate) {
                  onNavigate("study", targetState);
                } else if (onSelectTab) {
                  onSelectTab("study", targetState);
                }
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.srsReturnBtnText}>{t("aiCoach.backToSrs", "Back to SRS Card ➔")}</Text>
            </TouchableOpacity>
          </View>
        )}
        {isLiveVoiceActive ? (
          /* ── IN-SCREEN LIVE VOICE CHAT VIEW (Matching Inspiration Design) ── */
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
          >
            <View style={styles.liveVoiceMainContainer}>
              {/* Center: Ethereal Fluid Aurora Morphing Sphere */}
              <View style={styles.liveVoiceOrbContainer}>
                <EtherealMorphingOrb
                  pulseAnim={liveOrbPulseAnim}
                  disperseAnim={liveOrbDisperseAnim}
                  state={liveVoiceState}
                  isDark={isDark}
                />
              </View>

              {/* Ultra-Smooth Real-Time Streaming Spoken Transcript */}
              <LiveVoiceStreamingTranscript
                userTranscript={liveVoiceUserTranscript}
                aiTranscript={liveVoiceAiTranscript}
                state={liveVoiceState}
                isDark={isDark}
                accentColor={accentColor}
                isMuted={isLiveVoiceMuted}
              />

              {/* Bottom Dock matching inspiration screens */}
              <View style={styles.liveVoiceBottomDock}>
                {/* Left: Functional + Ask Branco... input pill */}
                <View style={styles.liveVoiceInputPill}>
                  <PlusIcon color={isDark ? "#94A3B8" : "#64748B"} size={18} />
                  <TextInput
                    style={styles.liveVoiceInputField}
                    placeholder="Ask Branco..."
                    placeholderTextColor={isDark ? "#94A3B8" : "#64748B"}
                    value={liveVoiceInputText}
                    onChangeText={setLiveVoiceInputText}
                    onSubmitEditing={handleSendLiveVoicePrompt}
                    returnKeyType="send"
                    autoCapitalize="sentences"
                    autoCorrect={true}
                  />
                  {liveVoiceInputText.trim().length > 0 && (
                    <TouchableOpacity
                      style={styles.liveVoiceSendBtn}
                      onPress={handleSendLiveVoicePrompt}
                      activeOpacity={0.8}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <ArrowUpIcon color="#FFFFFF" size={16} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Right actions: Mute & High Contrast Close Button */}
                <View style={styles.liveVoiceBottomRightActions}>
                  <TouchableOpacity
                    style={[styles.liveVoiceCircleBtn, isLiveVoiceMuted && styles.liveVoiceCircleBtnMuted]}
                    onPress={handleToggleLiveMute}
                    activeOpacity={0.8}
                  >
                    {isLiveVoiceMuted ? (
                      <MicMutedIcon color="#EF4444" size={20} />
                    ) : (
                      <MicIcon color={isDark ? "#FFFFFF" : "#0F172A"} size={20} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.liveVoiceCloseBtn}
                    onPress={handleCloseLiveVoice}
                    activeOpacity={0.85}
                  >
                    <CloseIcon color={isDark ? "#000000" : "#FFFFFF"} size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <>
            {!hasMessages ? (
              /* ── EMPTY STATE ─────────────────────────────────────────────── */
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[styles.emptyStateContainer, { paddingTop: insets.top + 70 }]}
                showsVerticalScrollIndicator={false}
              >
                <AiMascot isDark={isDark} accentColor={accentColor} />

                <Text style={styles.greetingTitle}>{t("aiCoach.greeting", { name: firstName })}</Text>
                <Text style={styles.greetingAccent}>{t("aiCoach.companion", "I'm Branco, your AI study companion.")}</Text>
                <Text style={styles.greetingBody}>
                  {t("aiCoach.readyToHelp", "Ready to help you understand, plan, study and achieve your goals.")}
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.suggestionChipsRow}
                  style={styles.suggestionChipsScroll}
                >
                  {localizedSuggestionChips.map((chip, idx) => {
                    const ChipIcon = chip.icon || (idx === 0 ? BookOpenIcon : idx === 1 ? GraduationCapIcon : BrainIcon);
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
                  data={reversedMessages}
                  keyExtractor={(item) => item.id}
                  renderItem={renderMessageItem}
                  contentContainerStyle={[styles.chatListContent, { paddingBottom: insets.top + 72, paddingTop: 16 }]}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  inverted
                  initialNumToRender={15}
                  maxToRenderPerBatch={10}
                  windowSize={11}
                />

                {!isKeyboardVisible && (
                  <View style={styles.promptChipsWrapper}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsCarousel}>
                      {localizedPromptChips.map((chip, idx) => (
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
            <Animated.View
              style={[
                styles.inputDockContainer,
                {
                  marginBottom: keyboardAnim.interpolate({
                    inputRange: [0, 1, 1000],
                    outputRange: [Math.max(insets.bottom, 12) + 8, 1, 1000],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
              {...swipeGesture.panHandlers}
            >
              <Animated.View
                onLayout={(e) => {
                  const w = Math.round(e.nativeEvent.layout.width);
                  if (w > 0 && Math.abs(w - dockBarWidth) > 1) {
                    setDockBarWidth(w);
                  }
                }}
                style={[
                  styles.inputBarInner,
                  {
                    position: 'relative',
                    overflow: 'hidden',
                    width: '100%',
                    maxWidth: '100%',
                    borderColor: 'transparent',
                    borderWidth: 0,
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
                <TooltipTouchable
                  tooltip="Attach File"
                  style={styles.inputActionIcon}
                  onPress={handleAttachFile}
                  activeOpacity={0.7}
                >
                  <PlusIcon color="#64748B" size={19} />
                </TooltipTouchable>

                {/* Text input */}
                <TextInput
                  ref={inputRef}
                  style={styles.dockTextInput}
                  placeholder={t("aiCoach.askPlaceholder", "Ask Branco anything...")}
                  placeholderTextColor="#94A3B8"
                  value={inputText}
                  onChangeText={setInputText}
                  onFocus={() => {
                    setIsInputFocused(true);
                    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
                  }}
                  onBlur={() => setIsInputFocused(false)}
                  multiline
                  numberOfLines={1}
                  textAlignVertical="center"
                  scrollEnabled
                />

                {/* Action Group: Send OR Mic + Voice Waveform Button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {hasInput ? (
                    <TooltipTouchable
                      tooltip="Send Message"
                      style={styles.sendBtnActive}
                      onPress={() => handleSendMessage()}
                      activeOpacity={0.85}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <ArrowUpIcon color="#FFFFFF" size={18} />
                    </TooltipTouchable>
                  ) : (
                    <>
                      <TooltipTouchable
                        tooltip="Live Voice Mode"
                        style={[styles.voiceWaveBtn, isLiveVoiceActive && styles.voiceWaveBtnActive]}
                        onPress={handleToggleLiveVoice}
                        activeOpacity={0.85}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <WaveformIcon color="#FFFFFF" size={18} />
                      </TooltipTouchable>

                      <TooltipTouchable
                        tooltip="Voice Input"
                        style={styles.micBtn}
                        onPress={handleToggleMic}
                        activeOpacity={0.85}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <MicIcon color="#FFFFFF" size={18} />
                      </TooltipTouchable>
                    </>
                  )}
                </View>

                {/* ── EXPANDING VOICE RECORDING & REVIEW PILL (Expands from microphone on the right) ── */}
                {(isRecording || recordedAudio) && (
                  <Animated.View
                    style={[
                      styles.expandingRecordBar,
                      {
                        left: expandAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [Math.max(0, (dockBarWidth || 360) - 54), 0],
                          extrapolate: 'clamp',
                        }),
                        right: 0,
                        top: 0,
                        bottom: 0,
                        opacity: expandAnim.interpolate({
                          inputRange: [0, 0.001, 1],
                          outputRange: [0, 1, 1],
                          extrapolate: 'clamp',
                        }),
                      },
                    ]}
                  >
                    {isRecording ? (
                      /* ── MODE A: LIVE RECORDING WAVEFORM ── */
                      <Animated.View
                        style={[
                          styles.recordingContentRow,
                          {
                            opacity: expandAnim.interpolate({
                              inputRange: [0, 0.25, 0.6, 1],
                              outputRange: [0, 0, 1, 1],
                              extrapolate: 'clamp',
                            }),
                          },
                        ]}
                      >
                        {/* Center: Live Timer and Animated Spectrum Waveform */}
                        <View style={styles.recordLiveCenter}>
                          <View style={styles.recordingDotBadge}>
                            <View style={styles.pulseDotContainer}>
                              <Animated.View
                                style={[
                                  styles.pulseDotHalo,
                                  {
                                    transform: [{ scale: recordPulseAnim }],
                                    opacity: recordPulseAnim.interpolate({
                                      inputRange: [1, 1.35],
                                      outputRange: [0.55, 0.15],
                                    }),
                                  },
                                ]}
                              />
                              <View style={styles.redPulsingDot} />
                            </View>
                            <Text style={styles.recordingTimerText}>
                              {voiceRecordingService.formatDuration(recordingDuration)}
                            </Text>
                          </View>

                          {/* Sound-reactive dynamic spectrum wave */}
                          <View style={styles.liveWaveSpectrum}>
                            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                              const baseH = 4;
                              const peakH = i === 3 ? 24 : (i === 2 || i === 4) ? 20 : (i === 1 || i === 5) ? 14 : 9;
                              return (
                                <Animated.View
                                  key={i}
                                  style={[
                                    styles.dashTick,
                                    {
                                      height: waveBarAnims[i].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [baseH, peakH],
                                        extrapolate: 'clamp',
                                      }),
                                    },
                                  ]}
                                />
                              );
                            })}
                          </View>
                          <Text style={styles.listeningText}>Listening...</Text>
                        </View>

                        {/* Right: Purple Circle with Rotating Mic into Checkmark */}
                        <TouchableOpacity
                          style={styles.expandCheckBtn}
                          onPress={handleFinishRecordingToPreview}
                          activeOpacity={0.85}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Animated.View
                            style={[
                              styles.iconAbsoluteCenter,
                              {
                                opacity: rotateAnim.interpolate({
                                  inputRange: [0, 0.2, 0.62, 1],
                                  outputRange: [1, 1, 0, 0],
                                }),
                                transform: [
                                  {
                                    rotate: rotateAnim.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: ['0deg', '45deg'],
                                    }),
                                  },
                                  {
                                    scale: rotateAnim.interpolate({
                                      inputRange: [0, 0.2, 0.62, 1],
                                      outputRange: [1, 1, 0.3, 0.1],
                                    }),
                                  },
                                ],
                              },
                            ]}
                          >
                            <MicIcon color="#FFFFFF" size={17} />
                          </Animated.View>

                          <Animated.View
                            style={[
                              styles.iconAbsoluteCenter,
                              {
                                opacity: rotateAnim.interpolate({
                                  inputRange: [0, 0.45, 0.85, 1],
                                  outputRange: [0, 0, 1, 1],
                                }),
                                transform: [
                                  {
                                    rotate: rotateAnim.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: ['-45deg', '0deg'],
                                    }),
                                  },
                                  {
                                    scale: rotateAnim.interpolate({
                                      inputRange: [0, 0.45, 1],
                                      outputRange: [0.1, 0.4, 1],
                                    }),
                                  },
                                ],
                              },
                            ]}
                          >
                            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                              <Polyline points="20 6 9 17 4 12" />
                            </Svg>
                          </Animated.View>
                        </TouchableOpacity>
                      </Animated.View>
                    ) : recordedAudio ? (
                      /* ── MODE B: AUDIO PREVIEW / REVIEW BEFORE SENDING ── */
                      <Animated.View
                        style={[
                          styles.previewContentRow,
                          {
                            opacity: expandAnim.interpolate({
                              inputRange: [0, 0.35, 0.7, 1],
                              outputRange: [0, 0, 1, 1],
                              extrapolate: 'clamp',
                            }),
                          },
                        ]}
                      >
                        {/* 1. Left: Discard / Trash Button */}
                        <TouchableOpacity
                          style={styles.previewTrashBtn}
                          onPress={handleDiscardPreviewAudio}
                          activeOpacity={0.7}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityLabel="Discard recording"
                        >
                          <TrashIcon color="#F87171" size={17} />
                        </TouchableOpacity>

                        {/* 2. Play / Pause Button with Glowing Purple Glow */}
                        <TouchableOpacity
                          style={styles.previewPlayBtn}
                          onPress={handleTogglePreviewPlayback}
                          activeOpacity={0.82}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityLabel={previewIsPlaying ? "Pause audio" : "Play audio"}
                        >
                          {previewIsPlaying ? (
                            <PauseIcon color="#FFFFFF" size={15} />
                          ) : (
                            <PlayIcon color="#FFFFFF" size={15} style={{ marginLeft: 2 }} />
                          )}
                        </TouchableOpacity>

                        {/* 3. Center: Clean Waveform Track with Interactive Scrubbing */}
                        <View
                          ref={previewWaveContainerRef}
                          style={styles.previewWaveContainer}
                          {...previewPanResponder.panHandlers}
                          onLayout={(e) => {
                            const { width } = e.nativeEvent.layout;
                            if (width > 0) {
                              setPreviewWaveWidth(width);
                              previewWaveLayoutRef.current.width = width;
                            }
                            previewWaveContainerRef.current?.measure((fx, fy, w, h, px) => {
                              if (px != null) {
                                previewWaveLayoutRef.current.x = px;
                              }
                            });
                          }}
                        >
                          <View style={styles.previewWaveRow} pointerEvents="none">
                            {recordedAudio.waveform.map((val, idx) => {
                              const totalBars = recordedAudio.waveform?.length || 28;
                              const barFraction = idx / Math.max(1, totalBars - 1);
                              const isPlayed = barFraction <= previewProgress;
                              const normalizedVal = typeof val === 'number' ? (val > 1 ? val / 100 : val) : 0.45;
                              const clampedVal = Math.max(0.18, Math.min(1.0, normalizedVal));
                              const barHeight = Math.max(4, Math.round(clampedVal * 24));
                              return (
                                <View
                                  key={idx}
                                  style={[
                                    styles.previewWaveBar,
                                    {
                                      height: barHeight,
                                      backgroundColor: isPlayed ? '#C084FC' : 'rgba(255, 255, 255, 0.28)',
                                    },
                                  ]}
                                />
                              );
                            })}
                          </View>
                        </View>

                        {/* 4. Timer readout */}
                        <Text style={styles.previewTimeText}>{previewCurrentTime}</Text>

                        {/* 5. Right: Send Voice Note Button */}
                        <TouchableOpacity
                          style={styles.previewSendBtn}
                          onPress={handleSendPreviewAudio}
                          activeOpacity={0.85}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityLabel="Send voice message"
                        >
                          <ArrowUpIcon color="#FFFFFF" size={18} />
                        </TouchableOpacity>
                      </Animated.View>
                    ) : null}
                  </Animated.View>
                )}
              </Animated.View>
            </Animated.View>
          </>
        )}
      </View>

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
                  <CompassNavIcon color={accentColor || "#6236FF"} size={18} />
                </View>
                <View>
                  <Text style={styles.navModalTitle}>Navigate To</Text>
                  <Text style={styles.navModalSubtitle}>Jump to any section</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.navModalCloseBtn}
                onPress={() => setIsNavModalVisible(false)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CloseIcon color={isDark ? "#94A3B8" : "#64748B"} size={16} />
              </TouchableOpacity>
            </View>

            {/* Destination List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.navDestinationsList}
              style={{ maxHeight: 440 }}
            >
              {NAV_DESTINATIONS.map((dest) => {
                const IconComponent = dest.icon;
                return (
                  <TouchableOpacity
                    key={dest.id}
                    style={styles.navDestCard}
                    onPress={() => handleSelectDestination(dest)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.navDestIconBox,
                        {
                          backgroundColor: isDark ? `${dest.accentColor}18` : `${dest.accentColor}10`,
                        },
                      ]}
                    >
                      <IconComponent color={dest.accentColor} size={18} />
                    </View>

                    <View style={styles.navDestTextGroup}>
                      <Text style={styles.navDestTitle}>{dest.title}</Text>
                      <Text style={styles.navDestSubtitle}>{dest.subtitle}</Text>
                    </View>

                    <ChevronRightNavIcon color={isDark ? "rgba(148, 163, 184, 0.45)" : "#CBD5E1"} size={16} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── CONVERSATION ACTIONS (PIN / DELETE / RENAME) MODAL ──────────── */}
      <Modal
        visible={!!historyActionConv}
        animationType="fade"
        transparent
        onRequestClose={() => setHistoryActionConv(null)}
      >
        <View style={styles.historyActionOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setHistoryActionConv(null)}
          />

          {historyActionConv && (
            <View style={[styles.historyActionSheet, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
              <View style={styles.sheetHandleBar} />

              {/* Header with Title */}
              <View style={styles.historyActionHeader}>
                <View style={[styles.historyActionIconBox, { backgroundColor: `${accentColor}14` }]}>
                  <ChatBubbleOutlineIcon color={accentColor} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyActionTitle} numberOfLines={1}>
                    {historyActionConv.title}
                  </Text>
                  <Text style={styles.historyActionSubtitle}>
                    {historyActionConv.messages.length} messages • {historyActionConv.isPinned ? 'Pinned' : 'Recent'}
                  </Text>
                </View>
              </View>

              {/* Rename Inline Form (if active) */}
              {isRenamingConv ? (
                <View style={styles.renameContainer}>
                  <Text style={styles.renameLabel}>RENAME CONVERSATION</Text>
                  <TextInput
                    style={styles.renameInput}
                    value={renameText}
                    onChangeText={setRenameText}
                    placeholder={t("aiCoach.enterChatTitle", "Enter chat title...")}
                    placeholderTextColor="#94A3B8"
                    autoFocus
                  />
                  <View style={styles.renameBtnRow}>
                    <TouchableOpacity
                      style={styles.renameCancelBtn}
                      onPress={() => setIsRenamingConv(false)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.renameCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.renameSaveBtn, { backgroundColor: accentColor }]}
                      onPress={handleSaveRename}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.renameSaveText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.historyActionButtonsList}>
                  {/* Action 1: Pin / Unpin */}
                  <TouchableOpacity
                    style={styles.historyActionRow}
                    onPress={() => handleTogglePinConversation(historyActionConv.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.historyActionBtnIcon, { backgroundColor: `${accentColor}12` }]}>
                      <PinIcon color={accentColor} size={18} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyActionBtnTitle}>
                        {historyActionConv.isPinned ? 'Unpin from Pinned' : 'Pin to Top'}
                      </Text>
                      <Text style={styles.historyActionBtnSub}>
                        {historyActionConv.isPinned
                          ? 'Move this chat to Recents'
                          : 'Keep this chat pinned at the top'}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Action 2: Rename */}
                  <TouchableOpacity
                    style={styles.historyActionRow}
                    onPress={() => setIsRenamingConv(true)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.historyActionBtnIcon, { backgroundColor: '#F1F5F9' }]}>
                      <EditPencilIcon color="#475569" size={18} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyActionBtnTitle}>Rename Conversation</Text>
                      <Text style={styles.historyActionBtnSub}>Change the title of this chat session</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Action 3: Delete */}
                  <TouchableOpacity
                    style={[styles.historyActionRow, styles.historyActionRowDelete]}
                    onPress={() => handleDeleteConversation(historyActionConv.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.historyActionBtnIcon, { backgroundColor: '#FEF2F2' }]}>
                      <TrashOutlineIcon color="#EF4444" size={18} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.historyActionBtnTitle, { color: '#EF4444' }]}>
                        Delete Chat History
                      </Text>
                      <Text style={styles.historyActionBtnSub}>Permanently remove this conversation</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {/* Close Button */}
              <TouchableOpacity
                style={styles.historyActionCancelBtn}
                onPress={() => setHistoryActionConv(null)}
                activeOpacity={0.75}
              >
                <Text style={styles.historyActionCancelText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      {/* ── CHATGPT-STYLE CHAT HISTORY SIDEBAR DRAWER ─────────────────────── */}
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
                paddingTop: Math.max(insets.top, 14),
                paddingBottom: Math.max(insets.bottom, 12),
              }
            ]}
          >
            {/* Header: Brand + Search & Sidebar Icons */}
            <View style={styles.chatGptHeader}>
              <Text style={styles.chatGptBrandTitle}>StudPal</Text>

              <View style={styles.chatGptHeaderRightIcons}>
                <TouchableOpacity
                  style={styles.chatGptHeaderIconBtn}
                  onPress={() => setIsDrawerSearching((prev) => !prev)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <SearchOutlineIcon color={isDark ? "#94A3B8" : "#64748B"} size={18} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.chatGptHeaderIconBtn}
                  onPress={() => setShowHistory(false)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <SidebarToggleIcon color={isDark ? "#94A3B8" : "#64748B"} size={19} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Search Input (if active) */}
            {isDrawerSearching && (
              <View style={styles.drawerSearchContainer}>
                <SearchOutlineIcon color={accentColor} size={16} />
                <TextInput
                  style={styles.drawerSearchInput}
                  placeholder={t("aiCoach.searchChats", "Search chats...")}
                  placeholderTextColor="#94A3B8"
                  value={drawerSearchQuery}
                  onChangeText={setDrawerSearchQuery}
                  autoFocus
                />
                {drawerSearchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setDrawerSearchQuery('')}>
                    <CloseIcon color="#94A3B8" size={15} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Tools Action Navigation List */}
            <View style={styles.actionToolsContainer}>
              {ACTION_TOOLS.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <TouchableOpacity
                    key={tool.id}
                    style={styles.actionToolRow}
                    onPress={tool.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.actionToolIconWrap}>
                      <IconComponent color={accentColor} size={17} />
                    </View>
                    <Text style={styles.actionToolLabel}>{tool.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Scrollable Pinned & Recents Lists */}
            <ScrollView
              style={styles.drawerScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              {/* PINNED SECTION */}
              {pinnedChats.length > 0 && (
                <View style={styles.historySection}>
                  <Text style={styles.historySectionTitle}>{t("aiCoach.pinned", "PINNED")}</Text>
                  {pinnedChats.map((conv) => {
                    const isActive = conv.id === activeConversationId;
                    return (
                      <TouchableOpacity
                        key={conv.id}
                        style={[
                          styles.chatHistoryItem,
                          isActive && [
                            styles.chatHistoryItemActive,
                            { backgroundColor: `${accentColor}12` },
                          ],
                        ]}
                        onPress={() => handleSelectConversation(conv.id)}
                        onLongPress={() => handleLongPressHistory(conv)}
                        delayLongPress={300}
                        activeOpacity={0.75}
                      >
                        <ChatBubbleOutlineIcon color={isActive ? accentColor : "#64748B"} size={16} />
                        <Text
                          style={[
                            styles.chatHistoryItemText,
                            isActive && [styles.chatHistoryItemTextActive, { color: accentColor }],
                          ]}
                          numberOfLines={1}
                        >
                          {conv.title}
                        </Text>
                        <PinIcon color="#94A3B8" size={13} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* RECENTS SECTION */}
              {recentChats.length > 0 && (
                <View style={styles.historySection}>
                  <Text style={styles.historySectionTitle}>{t("aiCoach.recents", "RECENTS")}</Text>
                  {recentChats.map((conv) => {
                    const isActive = conv.id === activeConversationId;
                    return (
                      <TouchableOpacity
                        key={conv.id}
                        style={[
                          styles.chatHistoryItem,
                          isActive && [
                            styles.chatHistoryItemActive,
                            { backgroundColor: `${accentColor}12` },
                          ],
                        ]}
                        onPress={() => handleSelectConversation(conv.id)}
                        onLongPress={() => handleLongPressHistory(conv)}
                        delayLongPress={300}
                        activeOpacity={0.75}
                      >
                        {!isActive && (
                          <ChatBubbleOutlineIcon color="#94A3B8" size={16} />
                        )}
                        <Text
                          style={[
                            styles.chatHistoryItemText,
                            isActive && [styles.chatHistoryItemTextActive, { color: accentColor }],
                          ]}
                          numberOfLines={1}
                        >
                          {conv.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              {/* EMPTY HISTORY STATE */}
              {pinnedChats.length === 0 && recentChats.length === 0 && (
                <View style={styles.historyEmptyState}>
                  <View style={[styles.historyEmptyIconBg, { backgroundColor: `${accentColor}12` }]}>
                    <ChatBubbleOutlineIcon color={accentColor} size={20} />
                  </View>
                  <Text style={styles.historyEmptyTitle}>{t("aiCoach.noHistoryTitle", "No Chat History Yet")}</Text>
                  <Text style={styles.historyEmptySub}>
                    {t("aiCoach.noHistorySub", "Ask Branco questions to begin building your permanent study history.")}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* ── CHATGPT-STYLE FLOATING PROFILE POPUP MENU ── */}
            {isProfileMenuOpen && (
              <>
                <Animated.View
                  style={[
                    styles.chatGptProfileMenuBackdrop,
                    {
                      opacity: profileMenuAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={() => handleCloseProfileMenu()}
                  />
                </Animated.View>
                <Animated.View
                  style={[
                    styles.chatGptProfileMenuPopup,
                    isDark && styles.chatGptProfileMenuPopupDark,
                    {
                      opacity: profileMenuAnim,
                      transform: [
                        {
                          translateY: profileMenuAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [12, 0],
                          }),
                        },
                        {
                          scale: profileMenuAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.93, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {/* Item 1: Profile Header (kinggold_22 / Alex, Free / Pro >) */}
                  <TouchableOpacity
                    style={styles.chatGptProfileMenuHeaderRow}
                    activeOpacity={0.7}
                    onPress={() => {
                      handleCloseProfileMenu(() => {
                        if (onNavigate) onNavigate('profile');
                        else if (onSelectTab) onSelectTab('profile');
                      });
                    }}
                  >
                    <View style={styles.chatGptProfileMenuAvatar}>
                      {user?.avatarUri ? (
                        <Image source={{ uri: user.avatarUri }} style={styles.chatGptProfileMenuAvatarImg} />
                      ) : (
                        <Text style={styles.chatGptProfileMenuAvatarText}>
                          {(user?.name ? user.name.trim().charAt(0) : 'A').toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <View style={styles.chatGptProfileMenuHeaderTextCol}>
                      <Text style={[styles.chatGptProfileMenuName, isDark && { color: '#F1F5F9' }]} numberOfLines={1}>
                        {user?.name || 'Alex'}
                      </Text>
                      <Text style={[styles.chatGptProfileMenuPlan, isDark && { color: '#94A3B8' }]}>
                        {user?.plan || 'Pro'}
                      </Text>
                    </View>
                    <ChevronRightNavIcon color={isDark ? '#64748B' : '#94A3B8'} size={16} />
                  </TouchableOpacity>

                  <View style={[styles.chatGptProfileMenuDivider, isDark && { backgroundColor: '#2D3442' }]} />

                  {/* Item 2: Try Plus free */}
                  <TouchableOpacity
                    style={styles.chatGptProfileMenuItem}
                    activeOpacity={0.7}
                    onPress={() => {
                      handleCloseProfileMenu(() => {
                        Alert.alert(
                          'StudPal Plus',
                          'Unlock unlimited AI coaching, instant document deep dives, and adaptive spaced repetition tools.',
                          [
                            {
                              text: 'Explore Features',
                              onPress: () => {
                                if (onNavigate) onNavigate('subscription');
                                else if (onSelectTab) onSelectTab('subscription');
                              },
                            },
                            { text: 'Dismiss', style: 'cancel' },
                          ]
                        );
                      });
                    }}
                  >
                    <View style={styles.chatGptProfileMenuItemIconWrap}>
                      <SparklesMenuIcon color={isDark ? '#CBD5E1' : '#334155'} size={18} />
                    </View>
                    <Text style={[styles.chatGptProfileMenuItemLabel, isDark && { color: '#F1F5F9' }]}>
                      Try Plus free
                    </Text>
                  </TouchableOpacity>

                  {/* Item 3: Personalization */}
                  <TouchableOpacity
                    style={styles.chatGptProfileMenuItem}
                    activeOpacity={0.7}
                    onPress={() => {
                      handleCloseProfileMenu(() => {
                        setAiSettingsActiveTab('personalization');
                        setIsAiSettingsModalOpen(true);
                      });
                    }}
                  >
                    <View style={styles.chatGptProfileMenuItemIconWrap}>
                      <TimerMenuIcon color={isDark ? '#CBD5E1' : '#334155'} size={18} />
                    </View>
                    <Text style={[styles.chatGptProfileMenuItemLabel, isDark && { color: '#F1F5F9' }]}>
                      Personalization
                    </Text>
                  </TouchableOpacity>

                  {/* Item 5: Settings */}
                  <TouchableOpacity
                    style={styles.chatGptProfileMenuItem}
                    activeOpacity={0.7}
                    onPress={() => {
                      handleCloseProfileMenu(() => {
                        setAiSettingsActiveTab('general');
                        setIsAiSettingsModalOpen(true);
                      });
                    }}
                  >
                    <View style={styles.chatGptProfileMenuItemIconWrap}>
                      <SettingsGearMenuIcon color={isDark ? '#CBD5E1' : '#334155'} size={18} />
                    </View>
                    <Text style={[styles.chatGptProfileMenuItemLabel, isDark && { color: '#F1F5F9' }]}>
                      Settings
                    </Text>
                  </TouchableOpacity>

                  <View style={[styles.chatGptProfileMenuDivider, isDark && { backgroundColor: '#2D3442' }]} />

                  {/* Item 6: Help */}
                  <TouchableOpacity
                    style={styles.chatGptProfileMenuItem}
                    activeOpacity={0.7}
                    onPress={() => {
                      handleCloseProfileMenu(() => {
                        if (onNavigate) {
                          onNavigate('help');
                        } else if (onSelectTab) {
                          onSelectTab('help');
                        }
                      });
                    }}
                  >
                    <View style={styles.chatGptProfileMenuItemIconWrap}>
                      <HelpCircleMenuIcon color={isDark ? '#CBD5E1' : '#334155'} size={18} />
                    </View>
                    <Text style={[styles.chatGptProfileMenuItemLabel, isDark && { color: '#F1F5F9' }]}>
                      Help
                    </Text>
                    <ChevronRightNavIcon color={isDark ? '#64748B' : '#94A3B8'} size={16} />
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}

            {/* ── USER PROFILE FOOTER ROW (Toggles Profile Popup Menu & Quick Settings) ── */}
            <View style={styles.profileFooterWrapper}>
              <View
                style={[
                  styles.premiumProfileCard,
                  isProfileMenuOpen && styles.premiumProfileCardActive,
                ]}
              >
                {/* Left Clickable Area: Avatar & Profile Info (Toggles Profile Menu) */}
                <TouchableOpacity
                  style={styles.premiumProfileCardLeft}
                  onPress={handleToggleProfileMenu}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
                >
                  {/* Circular Avatar with Initial */}
                  <View style={styles.chatGptAvatar}>
                    {user?.avatarUri ? (
                      <Image source={{ uri: user.avatarUri }} style={styles.chatGptAvatarImg} />
                    ) : (
                      <Text style={styles.chatGptAvatarText}>
                        {(user?.name ? user.name.trim().charAt(0) : 'A').toUpperCase()}
                      </Text>
                    )}
                  </View>

                  {/* Profile Identity Info */}
                  <View style={styles.profileIdentityGroup}>
                    <Text style={styles.chatGptProfileName} numberOfLines={1}>
                      {user?.name || 'Alex'}
                    </Text>
                    <Text style={styles.chatGptProfilePlan}>
                      {user?.plan || 'Pro'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Settings Gear Quick Action with Blue Dot (Directly opens Settings Modal) */}
                <TouchableOpacity
                  style={styles.profileSettingsBtn}
                  onPress={() => {
                    handleCloseProfileMenu();
                    setAiSettingsActiveTab('general');
                    setIsAiSettingsModalOpen(true);
                  }}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 6, right: 10 }}
                  accessibilityLabel="Open Settings"
                >
                  <SettingsMiniIcon color={isDark ? "#CBD5E1" : "#475569"} size={18} />
                  <View style={styles.settingsNotificationDot} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </>
      )}

      {/* ── OPENAI CHATGPT STYLE SETTINGS MODAL ───────────────────────── */}
      <Modal
        visible={isAiSettingsModalOpen}
        animationType="fade"
        transparent
        onRequestClose={() => {
          if (activeDropdownPicker) {
            setActiveDropdownPicker(null);
          } else {
            setIsAiSettingsModalOpen(false);
          }
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.chatGptSettingsOverlay}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => {
              if (activeDropdownPicker) {
                setActiveDropdownPicker(null);
              } else {
                setIsAiSettingsModalOpen(false);
              }
            }}
          />

          <View style={[styles.chatGptSettingsCard, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
            {/* 1. Header: Title + Close Button */}
            <View style={styles.chatGptSettingsHeader}>
              <Text style={styles.chatGptSettingsTitle}>Settings</Text>
              <TouchableOpacity
                style={styles.chatGptSettingsCloseBtn}
                onPress={() => {
                  setActiveDropdownPicker(null);
                  setIsAiSettingsModalOpen(false);
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <CloseIcon color={isDark ? '#A1A1AA' : '#71717A'} size={18} />
              </TouchableOpacity>
            </View>

            {/* 2. Search Settings Pill Input */}
            <View style={styles.chatGptSearchWrap}>
              <SearchOutlineIcon color={isDark ? '#71717A' : '#A1A1AA'} size={16} />
              <TextInput
                style={styles.chatGptSearchInput}
                placeholder="Search settings"
                placeholderTextColor={isDark ? '#71717A' : '#A1A1AA'}
                value={aiSettingsSearchQuery}
                onChangeText={setAiSettingsSearchQuery}
                autoCorrect={false}
              />
              {aiSettingsSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setAiSettingsSearchQuery('')}>
                  <CloseIcon color={isDark ? '#71717A' : '#A1A1AA'} size={14} />
                </TouchableOpacity>
              )}
            </View>

            {/* 3. Horizontal Navigation Tabs Rail */}
            {!aiSettingsSearchQuery && (
              <>
                <View style={styles.chatGptTabsContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chatGptTabsScroll}
                  >
                    {[
                      { id: 'general', label: 'General', icon: SettingsMiniIcon },
                      { id: 'notifications', label: 'Notifications', icon: CalendarNavIcon },
                      { id: 'personalization', label: 'Personalization', icon: SparkleBadgeIcon },
                      { id: 'intelligence', label: 'Intelligence', icon: ZapIcon },
                    ].map((tab) => {
                      const isActive = aiSettingsActiveTab === tab.id;
                      const TabIcon = tab.icon;
                      return (
                        <TouchableOpacity
                          key={tab.id}
                          style={[
                            styles.chatGptTabPill,
                            isActive && styles.chatGptTabPillActive,
                          ]}
                          onPress={() => {
                            setAiSettingsActiveTab(tab.id);
                            setActiveDropdownPicker(null);
                          }}
                          activeOpacity={0.75}
                        >
                          <TabIcon
                            color={isActive ? (isDark ? '#F4F4F5' : '#18181B') : (isDark ? '#71717A' : '#71717A')}
                            size={14}
                          />
                          <Text
                            style={[
                              styles.chatGptTabLabel,
                              isActive && styles.chatGptTabLabelActive,
                            ]}
                          >
                            {tab.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
                <View style={styles.chatGptTabsDivider} />
              </>
            )}

            {/* 4. Scrollable Content Body */}
            <ScrollView
              style={styles.chatGptSettingsBody}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chatGptSettingsBodyContent}
              keyboardShouldPersistTaps="handled"
              onScrollBeginDrag={() => {
                if (activeDropdownPicker) {
                  setActiveDropdownPicker(null);
                  setDropdownLayout(null);
                }
              }}
            >
              {/* SEARCH RESULTS VIEW */}
              {aiSettingsSearchQuery ? (
                <View style={{ gap: 2 }}>
                  <Text style={styles.chatGptSectionHeading}>Matching Results</Text>
                  
                  {/* General Appearance */}
                  {'appearance theme'.includes(aiSettingsSearchQuery.toLowerCase()) && (
                    <View style={styles.chatGptSettingRow}>
                      <Text style={styles.chatGptRowLabel}>Appearance</Text>
                      {renderChatGptDropdown('appearance')}
                    </View>
                  )}

                  {/* Contrast */}
                  {'contrast'.includes(aiSettingsSearchQuery.toLowerCase()) && (
                    <View style={styles.chatGptSettingRow}>
                      <Text style={styles.chatGptRowLabel}>Contrast</Text>
                      {renderChatGptDropdown('contrast')}
                    </View>
                  )}

                  {/* Accent Color */}
                  {'accent color theme'.includes(aiSettingsSearchQuery.toLowerCase()) && (
                    <View style={styles.chatGptSettingRow}>
                      <Text style={styles.chatGptRowLabel}>Accent color</Text>
                      {renderChatGptDropdown('accent')}
                    </View>
                  )}

                  {/* Language */}
                  {'language speech translation'.includes(aiSettingsSearchQuery.toLowerCase()) && (
                    <View style={styles.chatGptSettingRow}>
                      <Text style={styles.chatGptRowLabel}>Language</Text>
                      {renderChatGptDropdown('language')}
                    </View>
                  )}

                  {/* Teaching Style */}
                  {'teaching style tutor method'.includes(aiSettingsSearchQuery.toLowerCase()) && (
                    <View style={styles.chatGptSettingRow}>
                      <Text style={styles.chatGptRowLabel}>Teaching Style</Text>
                      {renderChatGptDropdown('teachingStyle')}
                    </View>
                  )}

                  {/* Personality */}
                  {'personality tone persona character coach'.includes(aiSettingsSearchQuery.toLowerCase()) && (
                    <View style={styles.chatGptSettingRow}>
                      <Text style={styles.chatGptRowLabel}>Personality</Text>
                      {renderChatGptDropdown('personality')}
                    </View>
                  )}

                  {/* Reasoning Depth */}
                  {'reasoning depth model detail'.includes(aiSettingsSearchQuery.toLowerCase()) && (
                    <View style={styles.chatGptSettingRow}>
                      <Text style={styles.chatGptRowLabel}>Reasoning Depth</Text>
                      {renderChatGptDropdown('depth')}
                    </View>
                  )}

                  {/* Academic Level */}
                  {'academic level school university exam'.includes(aiSettingsSearchQuery.toLowerCase()) && (
                    <View style={styles.chatGptSettingRow}>
                      <Text style={styles.chatGptRowLabel}>Academic Level</Text>
                      {renderChatGptDropdown('academic')}
                    </View>
                  )}

                  {/* Response Layout */}
                  {'response layout formatting format bullet structure'.includes(aiSettingsSearchQuery.toLowerCase()) && (
                    <View style={styles.chatGptSettingRow}>
                      <Text style={styles.chatGptRowLabel}>Response Layout</Text>
                      {renderChatGptDropdown('format')}
                    </View>
                  )}

                  {/* Dictation */}
                  {'dictation voice speech mic'.includes(aiSettingsSearchQuery.toLowerCase()) && (
                    <View style={styles.chatGptSettingRow}>
                      <View style={{ flex: 1, paddingRight: 12 }}>
                        <Text style={styles.chatGptRowLabel}>Enable Dictation</Text>
                        <Text style={styles.chatGptRowSub}>Use dictation in the chat composer.</Text>
                      </View>
                      <CustomToggle
                        value={enableDictationState}
                        onValueChange={() => {
                          const n = !enableDictationState;
                          setEnableDictationState(n);
                          settingsService.updateSettings({ enableDictation: n });
                        }}
                        activeColor="#2563EB"
                      />
                    </View>
                  )}
                </View>
              ) : (
                /* TAB-BASED VIEW */
                <>
                  {/* ── TAB 1: GENERAL ── */}
                  {aiSettingsActiveTab === 'general' && (
                    <View style={{ gap: 2 }}>
                      <Text style={styles.chatGptSectionHeading}>General</Text>

                      {/* Row 1: Appearance */}
                      <View style={styles.chatGptSettingRow}>
                        <Text style={styles.chatGptRowLabel}>Appearance</Text>
                        {renderChatGptDropdown('appearance')}
                      </View>

                      {/* Row 2: Contrast */}
                      <View style={styles.chatGptSettingRow}>
                        <Text style={styles.chatGptRowLabel}>Contrast</Text>
                        {renderChatGptDropdown('contrast')}
                      </View>

                      {/* Row 3: Accent Color */}
                      <View style={styles.chatGptSettingRow}>
                        <Text style={styles.chatGptRowLabel}>Accent color</Text>
                        {renderChatGptDropdown('accent')}
                      </View>

                      {/* Row 4: Language */}
                      <View style={styles.chatGptSettingRow}>
                        <Text style={styles.chatGptRowLabel}>Language</Text>
                        {renderChatGptDropdown('language')}
                      </View>

                      {/* Row 5: Enable Dictation */}
                      <View style={styles.chatGptSettingRow}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                          <Text style={styles.chatGptRowLabel}>Enable Dictation</Text>
                          <Text style={styles.chatGptRowSub}>Use dictation in the chat composer.</Text>
                        </View>
                        <CustomToggle
                          value={enableDictationState}
                          onValueChange={() => {
                            const n = !enableDictationState;
                            setEnableDictationState(n);
                            settingsService.updateSettings({ enableDictation: n });
                          }}
                          activeColor="#2563EB"
                        />
                      </View>
                    </View>
                  )}

                  {/* ── TAB 2: PERSONALIZATION ── */}
                  {aiSettingsActiveTab === 'personalization' && (
                    <View style={{ gap: 2 }}>
                      <Text style={styles.chatGptSectionHeading}>Personalization</Text>

                      {/* Row 1: Teaching Style */}
                      <View style={styles.chatGptSettingRow}>
                        <Text style={styles.chatGptRowLabel}>Teaching Style</Text>
                        {renderChatGptDropdown('teachingStyle')}
                      </View>

                      {/* Row 2: Personality */}
                      <View style={styles.chatGptSettingRow}>
                        <Text style={styles.chatGptRowLabel}>Personality</Text>
                        {renderChatGptDropdown('personality')}
                      </View>

                      {/* Row 3: Reasoning Depth */}
                      <View style={styles.chatGptSettingRow}>
                        <Text style={styles.chatGptRowLabel}>Reasoning Depth</Text>
                        {renderChatGptDropdown('depth')}
                      </View>

                      {/* Row 4: Target Academic Level */}
                      <View style={styles.chatGptSettingRow}>
                        <Text style={styles.chatGptRowLabel}>Academic Level</Text>
                        {renderChatGptDropdown('academic')}
                      </View>

                      {/* Row 5: Response Formatting */}
                      <View style={styles.chatGptSettingRow}>
                        <Text style={styles.chatGptRowLabel}>Response Layout</Text>
                        {renderChatGptDropdown('format')}
                      </View>

                      {/* Custom Instructions Inset Box */}
                      <View style={styles.chatGptCustomInstCard}>
                        <Text style={styles.chatGptCustomInstTitle}>What should Branco know about you?</Text>
                        <Text style={styles.chatGptCustomInstSub}>
                          Provide your major, learning style, and specific goals.
                        </Text>
                        <TextInput
                          style={styles.chatGptCustomInstInput}
                          placeholder="e.g. 2nd-year CS major. Prefer visual code examples before mathematical proofs."
                          placeholderTextColor={isDark ? '#71717A' : '#A1A1AA'}
                          value={aiInstructionsState}
                          onChangeText={(txt) => {
                            setAiInstructionsState(txt);
                            settingsService.updateSettings({ aiCustomInstructions: txt });
                          }}
                          multiline
                          numberOfLines={3}
                          textAlignVertical="top"
                        />
                        <Text style={styles.chatGptCustomInstFooter}>
                          🔒 Saved automatically and applied across all chats.
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* ── TAB 3: NOTIFICATIONS ── */}
                  {aiSettingsActiveTab === 'notifications' && (
                    <View style={{ gap: 2 }}>
                      <Text style={styles.chatGptSectionHeading}>Notifications</Text>

                      {/* Row 1: Daily Reminders */}
                      <View style={styles.chatGptSettingRow}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                          <Text style={styles.chatGptRowLabel}>Daily Study Reminders</Text>
                          <Text style={styles.chatGptRowSub}>Receive smart study check-ins at your scheduled focus hours.</Text>
                        </View>
                        <CustomToggle
                          value={dailyRemindersState}
                          onValueChange={() => {
                            const n = !dailyRemindersState;
                            setDailyRemindersState(n);
                            settingsService.updateSettings({ dailyStudyReminders: n });
                          }}
                          activeColor="#2563EB"
                        />
                      </View>

                      {/* Row 2: SRS Due Alerts */}
                      <View style={styles.chatGptSettingRow}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                          <Text style={styles.chatGptRowLabel}>Spaced Repetition Review Alerts</Text>
                          <Text style={styles.chatGptRowSub}>Notify when flashcard intervals are due for maximum retention.</Text>
                        </View>
                        <CustomToggle
                          value={srsDueAlertsState}
                          onValueChange={() => {
                            const n = !srsDueAlertsState;
                            setSrsDueAlertsState(n);
                            settingsService.updateSettings({ srsDueAlerts: n });
                          }}
                          activeColor="#2563EB"
                        />
                      </View>

                      {/* Row 3: Milestone Celebrations */}
                      <View style={styles.chatGptSettingRow}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                          <Text style={styles.chatGptRowLabel}>Milestone Celebrations</Text>
                          <Text style={styles.chatGptRowSub}>Alerts when completing revision streaks and mastery quizzes.</Text>
                        </View>
                        <CustomToggle
                          value={true}
                          onValueChange={() => {}}
                          activeColor="#2563EB"
                        />
                      </View>
                    </View>
                  )}

                  {/* ── TAB 4: INTELLIGENCE & AUTOMATION ── */}
                  {aiSettingsActiveTab === 'intelligence' && (
                    <View style={{ gap: 2 }}>
                      <Text style={styles.chatGptSectionHeading}>Intelligence & Automation</Text>

                      {/* Row 1: Auto-Summarize */}
                      <View style={styles.chatGptSettingRow}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                          <Text style={styles.chatGptRowLabel}>Auto-Summarize Uploaded Docs</Text>
                          <Text style={styles.chatGptRowSub}>Extract high-yield notes and formulas when attaching study PDFs.</Text>
                        </View>
                        <CustomToggle
                          value={autoSummarizePdfsState}
                          onValueChange={() => {
                            const n = !autoSummarizePdfsState;
                            setAutoSummarizePdfsState(n);
                            settingsService.updateSettings({ autoSummarizePdfs: n });
                          }}
                          activeColor="#2563EB"
                        />
                      </View>

                      {/* Row 2: SRS Smart Cards */}
                      <View style={styles.chatGptSettingRow}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                          <Text style={styles.chatGptRowLabel}>Smart Spaced Repetition (SRS)</Text>
                          <Text style={styles.chatGptRowSub}>Suggest memory flashcards automatically from challenging topics.</Text>
                        </View>
                        <CustomToggle
                          value={spacedRepetitionSmartIntervalsState}
                          onValueChange={() => {
                            const n = !spacedRepetitionSmartIntervalsState;
                            setSpacedRepetitionSmartIntervalsState(n);
                            settingsService.updateSettings({ spacedRepetitionSmartIntervals: n });
                          }}
                          activeColor="#2563EB"
                        />
                      </View>

                      {/* Row 3: Proactive Suggestions */}
                      <View style={styles.chatGptSettingRow}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                          <Text style={styles.chatGptRowLabel}>Proactive Follow-up Practice</Text>
                          <Text style={styles.chatGptRowSub}>Display relevant follow-up questions and quiz prompts after answers.</Text>
                        </View>
                        <CustomToggle
                          value={aiProactiveSuggestionsState}
                          onValueChange={() => {
                            const n = !aiProactiveSuggestionsState;
                            setAiProactiveSuggestionsState(n);
                            settingsService.updateSettings({ aiProactiveSuggestions: n });
                          }}
                          activeColor="#2563EB"
                        />
                      </View>

                      {/* Row 4: Auto-Play Voice */}
                      <View style={styles.chatGptSettingRow}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                          <Text style={styles.chatGptRowLabel}>Auto-Play Voice in Live Mode</Text>
                          <Text style={styles.chatGptRowSub}>Speak responses aloud automatically during voice conversations.</Text>
                        </View>
                        <CustomToggle
                          value={aiAutoPlayVoiceState}
                          onValueChange={() => {
                            const n = !aiAutoPlayVoiceState;
                            setAiAutoPlayVoiceState(n);
                            settingsService.updateSettings({ aiAutoPlayVoice: n });
                          }}
                          activeColor="#2563EB"
                        />
                      </View>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>

          {/* 5. FLOATING POPUP DROPDOWN MENU (Anchored Up or Down without Z-Index Clipping) */}
          {activeDropdownPicker && dropdownLayout && DROPDOWN_OPTIONS[activeDropdownPicker] && (
            <View
              style={[
                StyleSheet.absoluteFillObject,
                { zIndex: 99999, elevation: 99999 },
              ]}
              pointerEvents="box-none"
            >
              {/* Fullscreen Backdrop to catch clicks outside */}
              <TouchableOpacity
                style={StyleSheet.absoluteFillObject}
                activeOpacity={1}
                onPress={() => {
                  setActiveDropdownPicker(null);
                  setDropdownLayout(null);
                }}
              />

              {/* Floating Anchored Card Popover */}
              <View
                style={[
                  styles.chatGptDropdownMenuPopup,
                  isDark && styles.chatGptDropdownMenuPopupDark,
                  {
                    position: 'absolute',
                    width: dropdownLayout.menuWidth,
                    left: dropdownLayout.left,
                    ...(dropdownLayout.openDirection === 'up'
                      ? { bottom: Dimensions.get('window').height - dropdownLayout.y + 4 }
                      : { top: dropdownLayout.y + dropdownLayout.height + 4 }
                    ),
                  },
                ]}
              >
                <ScrollView
                  style={{ maxHeight: 220 }}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {DROPDOWN_OPTIONS[activeDropdownPicker].options.map((opt) => {
                    const isSelected = DROPDOWN_OPTIONS[activeDropdownPicker].current === opt.id;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        style={[
                          styles.chatGptDropdownMenuItem,
                          isSelected && (isDark ? styles.chatGptDropdownMenuItemSelectedDark : styles.chatGptDropdownMenuItemSelected),
                        ]}
                        onPress={() => {
                          DROPDOWN_OPTIONS[activeDropdownPicker].onSelect(opt.id);
                          setActiveDropdownPicker(null);
                          setDropdownLayout(null);
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={styles.chatGptDropdownMenuItemLeft}>
                          {opt.color && (
                            <View style={[styles.chatGptColorDot, { backgroundColor: opt.color }]} />
                          )}
                          <Text
                            style={[
                              styles.chatGptDropdownMenuItemText,
                              isDark && { color: '#F1F5F9' },
                              isSelected && styles.chatGptDropdownMenuItemTextSelected,
                            ]}
                            numberOfLines={1}
                          >
                            {opt.label}
                          </Text>
                        </View>
                        {isSelected && (
                          <CheckIcon color={isDark ? '#F1F5F9' : '#18181B'} size={13} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </Modal>
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

const baseAiCoachStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // ── Header (Smoky Translucent Floating Navbar) ──
  floatingHeaderWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    backgroundColor: 'rgba(248, 250, 252, 0.60)',
  },
  headerTintOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navSwitcherBtn: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
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
    color: '#475569',
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: -0.1,
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
  userVoiceBubble: {
    backgroundColor: '#6236FF',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 220,
    maxWidth: '85%',
  },
  voiceNoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  voiceNoteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  voiceNoteBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.92,
  },
  voiceNoteDuration: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.92,
  },
  voicePlayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  voicePlayBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  voiceWaveformTrack: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,
    height: 28,
  },
  voiceWaveBar: {
    flex: 1,
    borderRadius: 2,
    minWidth: 2,
  },
  userVoiceTime: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 9,
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
    width: '100%',
    maxWidth: '100%',
    alignSelf: 'center',
    boxSizing: 'border-box',
  },
  inputBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 0,
    borderColor: 'transparent',
    gap: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
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

  // ── Voice Recording Dock ──
  voiceRecordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    height: 44,
  },
  recTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recBlinkDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  recTimerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  recWaveformRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3.5,
    height: 30,
    marginHorizontal: 12,
  },
  recWaveBar: {
    width: 3,
    borderRadius: 1.5,
    backgroundColor: '#6236FF',
  },
  recActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recCancelBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recSendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#6236FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6236FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },

  // ── Expanding Voice Recording Pill ──
  expandingRecordBar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    height: '100%',
    backgroundColor: '#0A0E17',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 6,
    paddingRight: 6,
    overflow: 'hidden',
    zIndex: 10,
    elevation: 8,
    maxWidth: '100%',
    boxSizing: 'border-box',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  recordingContentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    paddingLeft: 12,
    paddingRight: 2,
  },
  recordTrashBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  recordLiveCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 6,
  },
  recordingDotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
      },
    }),
  },
  pulseDotContainer: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseDotHalo: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#8B5CF6',
  },
  redPulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C084FC',
    shadowColor: '#C084FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 2,
  },
  recordingTimerText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.6,
  },
  liveWaveSpectrum: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2.5,
    height: 26,
    marginHorizontal: 2,
  },
  dashTick: {
    width: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#A78BFA',
  },
  listeningText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  expandCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  listeningCenterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexShrink: 1,
  },
  listeningDashesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2.5,
    height: 30,
  },
  expandCheckBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#6236FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6236FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  iconAbsoluteCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Audio Preview / Review Mode (Clean, Simple & Premium) ──
  previewContentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    paddingHorizontal: 2,
    gap: 8,
  },
  previewTrashBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  previewPlayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#6236FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6236FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 4,
  },
  previewWaveContainer: {
    flex: 1,
    height: 34,
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 8,
  },
  previewWaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    gap: 1.5,
  },
  previewWaveBar: {
    flex: 1,
    maxWidth: 3.5,
    minWidth: 2,
    borderRadius: 1.75,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  previewWaveBarActive: {
    backgroundColor: '#C084FC',
  },
  previewTimeText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.4,
    minWidth: 34,
    textAlign: 'center',
  },
  previewDurationText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.4,
    minWidth: 34,
    textAlign: 'center',
  },
  previewSendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#6236FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6236FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },

  // ── History Drawer (ChatGPT-Style Crisp White Theme) ──
  drawerOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    zIndex: 9998,
  },
  drawerSheet: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    zIndex: 9999,
    shadowColor: '#0F172A',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    ...Platform.select({
      web: {
        boxShadow: '8px 0 24px rgba(15, 23, 42, 0.1)',
      },
    }),
  },
  chatGptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  brandIconMini: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatGptBrandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  chatGptHeaderRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chatGptHeaderIconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  drawerSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    marginHorizontal: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 8,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  drawerSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  actionToolsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  actionToolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 1,
  },
  actionToolIconWrap: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionToolLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
    letterSpacing: -0.1,
  },
  drawerScrollView: {
    flex: 1,
    paddingHorizontal: 8,
  },
  historySection: {
    marginTop: 14,
  },
  historySectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    paddingHorizontal: 10,
    marginBottom: 6,
    letterSpacing: 0.8,
  },
  chatHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8.5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 1.5,
  },
  chatHistoryItemActive: {
    borderWidth: 0,
    borderColor: 'transparent',
  },
  chatHistoryItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
    flex: 1,
    letterSpacing: -0.1,
  },
  chatHistoryItemTextActive: {
    fontWeight: '700',
  },
  profileFooterWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  premiumProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  premiumProfileCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumProfileCardActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  chatGptProfileMenuBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
    zIndex: 90,
  },
  chatGptProfileMenuPopup: {
    position: 'absolute',
    bottom: 68,
    left: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 20,
    zIndex: 100,
    ...Platform.select({
      web: {
        boxShadow: '0 20px 48px -10px rgba(15, 23, 42, 0.18), 0 8px 20px -4px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.05)',
        backdropFilter: 'blur(16px)',
      },
    }),
  },
  chatGptProfileMenuPopupDark: {
    backgroundColor: '#1E222A',
    borderColor: '#2D3442',
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    ...Platform.select({
      web: {
        boxShadow: '0 24px 54px -8px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.09)',
        backdropFilter: 'blur(16px)',
      },
    }),
  },
  chatGptProfileMenuHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 9,
    borderRadius: 12,
  },
  chatGptProfileMenuAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0D5B4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  chatGptProfileMenuAvatarImg: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  chatGptProfileMenuAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  chatGptProfileMenuHeaderTextCol: {
    flex: 1,
  },
  chatGptProfileMenuName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  chatGptProfileMenuPlan: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  chatGptProfileMenuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
    marginHorizontal: 6,
  },
  chatGptProfileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 9,
    borderRadius: 12,
    marginVertical: 0.5,
  },
  chatGptProfileMenuItemIconWrap: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  chatGptProfileMenuItemLabel: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
  },
  profileUserBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatGptAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0D5B4A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chatGptAvatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  chatGptAvatarText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  profileIdentityGroup: {
    flex: 1,
    gap: 1,
    justifyContent: 'center',
  },
  chatGptProfileName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  chatGptProfilePlan: {
    fontSize: 11.5,
    fontWeight: '400',
    color: '#64748B',
  },
  profileSettingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: 6,
  },
  settingsNotificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
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
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
  },
  sheetHandleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 16,
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
    borderRadius: 10,
    backgroundColor: '#F0EEFF',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navModalTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  navModalSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 1,
  },
  navModalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 12,
  },
  navDestIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navDestTextGroup: {
    flex: 1,
    gap: 1.5,
  },
  navDestTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  navDestSubtitle: {
    fontSize: 11.5,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 15,
  },

  // ── Conversation Long Press Action Sheet Modal ──
  historyActionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  historyActionSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 14,
  },
  historyActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 8,
  },
  historyActionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyActionTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  historyActionSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  historyActionButtonsList: {
    gap: 8,
    paddingVertical: 6,
  },
  historyActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyActionRowDelete: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  historyActionBtnIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyActionBtnTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyActionBtnSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  historyActionCancelBtn: {
    marginTop: 8,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyActionCancelText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#475569',
  },

  // Rename Inline Form
  renameContainer: {
    paddingVertical: 10,
    gap: 8,
  },
  renameLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  renameInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 0,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  renameBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  renameCancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  renameCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  renameSaveBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renameSaveText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ── History Drawer Empty State ──
  historyEmptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  historyEmptyIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  historyEmptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  historyEmptySub: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },

  // ── SRS Return Banner Styles ──
  srsReturnBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0EEFF',
    borderColor: '#C7D2FE',
    borderWidth: 1,
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  srsReturnBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  srsReturnIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  srsReturnTextGroup: {
    flex: 1,
  },
  srsReturnTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4C1D95',
  },
  srsReturnSubtitle: {
    fontSize: 11,
    color: '#6D28D9',
    fontWeight: '500',
  },
  srsReturnBtn: {
    backgroundColor: '#6236FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  srsReturnBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ── In-Screen Live Voice Chat with Branco Styles ──
  inScreenLiveVoiceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(98, 54, 255, 0.4)',
    shadowColor: '#6236FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    gap: 10,
  },
  inScreenLiveOrbWrapper: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inScreenLiveGlowRing: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    backgroundColor: 'rgba(98, 54, 255, 0.15)',
  },
  inScreenLiveOrbCore: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E1B4B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inScreenLiveWavesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 18,
  },
  inScreenLiveWaveBar: {
    width: 2.5,
    borderRadius: 1.25,
  },
  inScreenLiveInfoCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  inScreenLiveHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  inScreenLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  inScreenLiveTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  inScreenLiveStateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  inScreenLiveSubtitle: {
    fontSize: 11.5,
    color: '#CBD5E1',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  inScreenLiveActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inScreenLiveActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inScreenLiveActionBtnMuted: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  inScreenLiveCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── In-Screen Live Voice View (Matching Inspiration Design) ──
  liveVoiceMainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 28,
  },
  liveVoiceTopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  liveVoiceHeaderBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 0,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveVoiceOrbContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  liveVoiceTranscriptBox: {
    minHeight: 64,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  liveVoiceTranscriptText: {
    fontSize: 16.5,
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 25,
    fontWeight: '500',
    letterSpacing: 0.15,
  },
  liveVoiceBottomDock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    paddingHorizontal: 4,
  },
  liveVoiceInputPill: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 0,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  liveVoiceInputField: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 0,
    height: '100%',
  },
  liveVoiceSendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#6236FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6236FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  liveVoiceInputPillText: {
    fontSize: 15.5,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  liveVoiceBottomRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  liveVoiceCircleBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 0,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveVoiceCircleBtnMuted: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  liveVoiceCloseBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  // ── Non-Intrusive Floating Toast ──
  floatingInfoToast: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 99999,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    gap: 8,
  },
  toastIconBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastIconEmoji: {
    fontSize: 12,
  },
  floatingInfoToastText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },

  // ── OpenAI ChatGPT Style Settings Dialog ──
  chatGptSettingsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  chatGptSettingsCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
    overflow: 'hidden',
  },
  chatGptSettingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
  },
  chatGptSettingsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#18181B',
    letterSpacing: -0.2,
  },
  chatGptSettingsCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatGptSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    paddingHorizontal: 12,
    height: 38,
  },
  chatGptSearchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#18181B',
    paddingVertical: 0,
  },
  chatGptTabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  chatGptTabsScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  chatGptTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: 9,
    backgroundColor: 'transparent',
  },
  chatGptTabPillActive: {
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  chatGptTabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#71717A',
  },
  chatGptTabLabelActive: {
    fontWeight: '700',
    color: '#18181B',
  },
  chatGptTabsDivider: {
    height: 1,
    backgroundColor: '#E4E4E7',
    marginTop: 6,
  },
  chatGptSettingsBody: {
    flex: 1,
  },
  chatGptSettingsBodyContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
  },
  chatGptSectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18181B',
    marginTop: 4,
    marginBottom: 4,
  },
  chatGptSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F4F4F5',
  },
  chatGptRowLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#18181B',
  },
  chatGptRowSub: {
    fontSize: 11.5,
    color: '#71717A',
    lineHeight: 15,
    marginTop: 2,
  },
  chatGptDropdownContainer: {
    position: 'relative',
  },
  chatGptDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5.5,
    paddingHorizontal: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  chatGptDropdownBtnOpen: {
    borderColor: '#A1A1AA',
    backgroundColor: '#F4F4F5',
  },
  chatGptDropdownValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#27272A',
  },
  chatGptDropdownBackdrop: {
    position: 'absolute',
    top: -1000,
    bottom: -1000,
    left: -1000,
    right: -1000,
    zIndex: 950,
  },
  chatGptDropdownMenuPopup: {
    position: 'absolute',
    top: 36,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 16,
    zIndex: 1000,
  },
  chatGptDropdownMenuPopupDark: {
    backgroundColor: '#1E222A',
    borderColor: '#2D3442',
    shadowColor: '#000000',
    shadowOpacity: 0.35,
  },
  chatGptDropdownMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 1,
  },
  chatGptDropdownMenuItemSelected: {
    backgroundColor: '#F4F4F5',
  },
  chatGptDropdownMenuItemSelectedDark: {
    backgroundColor: '#2A3142',
  },
  chatGptDropdownMenuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  chatGptDropdownMenuItemText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#18181B',
  },
  chatGptDropdownMenuItemTextSelected: {
    fontWeight: '500',
    color: '#18181B',
  },
  chatGptColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  chatGptCustomInstCard: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    gap: 6,
  },
  chatGptCustomInstTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
  },
  chatGptCustomInstSub: {
    fontSize: 11.5,
    color: '#71717A',
  },
  chatGptCustomInstInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 10,
    fontSize: 13,
    color: '#18181B',
    minHeight: 65,
    marginTop: 4,
  },
  chatGptCustomInstFooter: {
    fontSize: 11,
    color: '#71717A',
    fontStyle: 'italic',
    marginTop: 2,
  },

  // ── AI Chatbot Personal Settings Modal Styles ──
  aiSettingsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.68)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  aiSettingsModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: '100%',
    maxWidth: 580,
    maxHeight: '88%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 20,
  },
  sheetHandleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  aiSettingsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  aiSettingsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  aiSettingsIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSettingsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  aiSettingsTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  aiSettingsStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  aiSettingsLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  aiSettingsStatusPillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  aiSettingsSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  aiSettingsCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSettingsScrollView: {
    flex: 1,
  },
  aiSettingsScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  aiSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  aiSectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  aiSectionCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  aiSectionNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSectionNumberText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  aiSectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.8,
  },
  aiSectionSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 2,
  },
  aiSectionDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: -4,
  },
  aiSettingsSection: {
    gap: 10,
  },
  aiSettingsSectionHeader: {
    gap: 2,
  },
  aiSettingsSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  aiSettingsSectionCaption: {
    fontSize: 12,
    color: '#94A3B8',
  },
  aiPersonaGrid: {
    gap: 10,
  },
  aiPersonaCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  aiPersonaCardSelected: {
    borderColor: '#6236FF',
    backgroundColor: '#F5F3FF',
    shadowColor: '#6236FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  aiPersonaCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiPersonaCardLeftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  aiPersonaIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiPersonaTitleCol: {
    flex: 1,
  },
  aiPersonaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  aiPersonaCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  aiPersonaTag: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  aiPersonaTagText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  aiRadioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiRadioCircleSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiRadioCircleSelected: {
    borderWidth: 0,
    shadowColor: '#6236FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  aiPersonaCardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  aiDepthRow: {
    flexDirection: 'row',
    gap: 8,
  },
  aiDepthCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    position: 'relative',
  },
  aiDepthCardActive: {
    borderColor: '#6236FF',
    backgroundColor: '#F5F3FF',
    shadowColor: '#6236FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  aiDepthIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  aiDepthLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  aiDepthLabelActive: {
    fontWeight: '800',
  },
  aiDepthBadgePill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    marginTop: 2,
    marginBottom: 2,
  },
  aiDepthBadgePillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  aiDepthDesc: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 13,
  },
  aiDepthActiveBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiPillsRow: {
    gap: 10,
  },
  aiAcademicPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  aiAcademicPillActive: {
    borderColor: '#6236FF',
    backgroundColor: '#F5F3FF',
    shadowColor: '#6236FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  aiAcademicPillContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  aiAcademicEmoji: {
    fontSize: 22,
    marginTop: 2,
  },
  aiAcademicPillTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  aiAcademicPillSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  aiAcademicPillDesc: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
    marginTop: 3,
  },
  aiInputContainerCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  aiInputHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiInputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  aiInputHint: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  aiTextInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 13,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    minHeight: 70,
  },
  aiMemoryBadgeRow: {
    marginTop: 2,
  },
  aiMemoryBadgeText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  aiFormattingRow: {
    gap: 8,
  },
  aiFormatCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  aiFormatCardActive: {
    borderColor: '#6236FF',
    backgroundColor: '#F5F3FF',
  },
  aiFormatCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiFormatCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  aiSmallCheckDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiFormatCardDesc: {
    fontSize: 11.5,
    color: '#64748B',
  },
  aiTogglesList: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  aiToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 12,
  },
  aiToggleIconWell: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiToggleTextCol: {
    flex: 1,
    gap: 2,
  },
  aiToggleTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  aiToggleSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  aiToggleDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  aiSettingsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  aiSettingsResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aiSettingsResetText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  aiSettingsSaveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13.5,
    borderRadius: 14,
    shadowColor: '#6236FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  aiSettingsSaveText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
});

const getAiCoachStyles = (isDark, activeAccentColor) => {
  if (!isDark && activeAccentColor === '#6236FF') return baseAiCoachStyles;
  return {
    ...baseAiCoachStyles,
    container: [
      baseAiCoachStyles.container,
      isDark && { backgroundColor: '#0B0F19' },
    ],
    floatingHeaderWrapper: [
      baseAiCoachStyles.floatingHeaderWrapper,
      {
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        backgroundColor: isDark ? 'rgba(11, 15, 25, 0.60)' : 'rgba(248, 250, 252, 0.60)',
      },
    ],
    headerTintOverlay: [
      baseAiCoachStyles.headerTintOverlay,
      { backgroundColor: 'transparent' },
    ],
    topHeader: [
      baseAiCoachStyles.topHeader,
      { backgroundColor: 'transparent', borderBottomWidth: 0, borderBottomColor: 'transparent', elevation: 0, shadowOpacity: 0 },
    ],
    headerIconBtn: [
      baseAiCoachStyles.headerIconBtn,
      { backgroundColor: 'transparent', borderWidth: 0, borderColor: 'transparent', elevation: 0, shadowOpacity: 0 },
    ],
    navSwitcherBtn: [
      baseAiCoachStyles.navSwitcherBtn,
      { backgroundColor: 'transparent', borderWidth: 0, borderColor: 'transparent', elevation: 0, shadowOpacity: 0 },
    ],
    headerTitle: [
      baseAiCoachStyles.headerTitle,
      isDark && { color: '#F8FAFC' },
    ],
    headerSubtitle: [
      baseAiCoachStyles.headerSubtitle,
      isDark ? { color: '#CBD5E1' } : { color: '#475569' },
    ],
    greetingTitle: [
      baseAiCoachStyles.greetingTitle,
      isDark && { color: '#F8FAFC' },
    ],
    greetingAccent: [
      baseAiCoachStyles.greetingAccent,
      isDark && { color: activeAccentColor || '#A78BFA' },
    ],
    greetingBody: [
      baseAiCoachStyles.greetingBody,
      isDark && { color: '#94A3B8' },
    ],
    suggestionChip: [
      baseAiCoachStyles.suggestionChip,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    suggestionChipIcon: [
      baseAiCoachStyles.suggestionChipIcon,
      isDark && { backgroundColor: '#0F172A' },
    ],
    suggestionChipLabel: [
      baseAiCoachStyles.suggestionChipLabel,
      isDark && { color: '#F8FAFC' },
    ],
    suggestionChipSub: [
      baseAiCoachStyles.suggestionChipSub,
      isDark && { color: '#94A3B8' },
    ],
    aiBubbleCard: [
      baseAiCoachStyles.aiBubbleCard,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    aiText: [
      baseAiCoachStyles.aiText,
      isDark && { color: '#F8FAFC' },
    ],
    listenPill: [
      baseAiCoachStyles.listenPill,
      isDark && { backgroundColor: '#0F172A', borderWidth: 0, borderColor: 'transparent' },
    ],
    stepsCard: [
      baseAiCoachStyles.stepsCard,
      isDark && { backgroundColor: '#0F172A', borderWidth: 0, borderColor: 'transparent' },
    ],
    stepsHeaderTitle: [
      baseAiCoachStyles.stepsHeaderTitle,
      isDark && { color: '#F8FAFC' },
    ],
    stepsContent: [
      baseAiCoachStyles.stepsContent,
      isDark && { borderTopWidth: 0, borderTopColor: 'transparent' },
    ],
    stepTitle: [
      baseAiCoachStyles.stepTitle,
      isDark && { color: '#F8FAFC' },
    ],
    stepSub: [
      baseAiCoachStyles.stepSub,
      isDark && { color: '#94A3B8' },
    ],
    exampleCard: [
      baseAiCoachStyles.exampleCard,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    actionPillSecondary: [
      baseAiCoachStyles.actionPillSecondary,
      isDark && { backgroundColor: '#0F172A', borderWidth: 0, borderColor: 'transparent' },
    ],
    actionPillSecondaryText: [
      baseAiCoachStyles.actionPillSecondaryText,
      isDark && { color: '#F8FAFC' },
    ],
    promptChipsWrapper: [
      baseAiCoachStyles.promptChipsWrapper,
      isDark && { backgroundColor: '#0B0F19' },
    ],
    chipPill: [
      baseAiCoachStyles.chipPill,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    chipPillText: [
      baseAiCoachStyles.chipPillText,
      isDark && { color: '#F8FAFC' },
    ],
    inputBarInner: [
      baseAiCoachStyles.inputBarInner,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    inputActionIcon: [
      baseAiCoachStyles.inputActionIcon,
      isDark && { backgroundColor: '#0F172A' },
    ],
    dockTextInput: [
      baseAiCoachStyles.dockTextInput,
      isDark && { color: '#F8FAFC' },
    ],
    drawerSheet: [
      baseAiCoachStyles.drawerSheet,
      isDark && { backgroundColor: '#0B0F19', borderRightWidth: 0, borderRightColor: 'transparent' },
    ],
    chatGptBrandTitle: [
      baseAiCoachStyles.chatGptBrandTitle,
      isDark && { color: '#F8FAFC' },
    ],
    drawerSearchContainer: [
      baseAiCoachStyles.drawerSearchContainer,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    searchBarWrap: [
      baseAiCoachStyles.searchBarWrap,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    searchInput: [
      baseAiCoachStyles.searchInput,
      isDark && { color: '#F8FAFC' },
    ],
    actionToolsContainer: [
      baseAiCoachStyles.actionToolsContainer,
      isDark && { borderBottomWidth: 0, borderBottomColor: 'transparent' },
    ],
    chatTile: [
      baseAiCoachStyles.chatTile,
      isDark && { backgroundColor: '#0F172A', borderWidth: 0, borderColor: 'transparent' },
    ],
    chatTileTitle: [
      baseAiCoachStyles.chatTileTitle,
      isDark && { color: '#F8FAFC' },
    ],
    profileFooterWrapper: [
      baseAiCoachStyles.profileFooterWrapper,
      isDark && { borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.08)' },
    ],
    premiumProfileCard: [
      baseAiCoachStyles.premiumProfileCard,
    ],
    chatGptProfileName: [
      baseAiCoachStyles.chatGptProfileName,
      isDark && { color: '#F8FAFC' },
    ],
    chatGptProfilePlan: [
      baseAiCoachStyles.chatGptProfilePlan,
      isDark && { color: '#94A3B8' },
    ],
    srsReturnBanner: [
      baseAiCoachStyles.srsReturnBanner,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    srsReturnTitle: [
      baseAiCoachStyles.srsReturnTitle,
      isDark && { color: '#F8FAFC' },
    ],
    srsReturnSubtitle: [
      baseAiCoachStyles.srsReturnSubtitle,
      isDark && { color: '#94A3B8' },
    ],
    chatGptHeaderIconBtn: [
      baseAiCoachStyles.chatGptHeaderIconBtn,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    actionToolLabel: [
      baseAiCoachStyles.actionToolLabel,
      isDark && { color: '#F8FAFC' },
    ],
    chatHistoryItemText: [
      baseAiCoachStyles.chatHistoryItemText,
      isDark && { color: '#CBD5E1' },
    ],
    profileSettingsBtn: [
      baseAiCoachStyles.profileSettingsBtn,
    ],
    historySectionTitle: [
      baseAiCoachStyles.historySectionTitle,
      isDark && { color: '#94A3B8' },
    ],
    navModalSheet: [
      baseAiCoachStyles.navModalSheet,
      isDark && {
        backgroundColor: '#0F172A',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        shadowColor: '#000000',
        shadowOpacity: 0.35,
        shadowRadius: 24,
      },
    ],
    sheetHandleBar: [
      baseAiCoachStyles.sheetHandleBar,
      isDark && { backgroundColor: 'rgba(255, 255, 255, 0.16)' },
    ],
    navModalHeader: [
      baseAiCoachStyles.navModalHeader,
      isDark && { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.06)' },
    ],
    navModalHeaderIconBg: [
      baseAiCoachStyles.navModalHeaderIconBg,
      isDark && {
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: 'rgba(99, 102, 241, 0.28)',
      },
    ],
    navModalTitle: [
      baseAiCoachStyles.navModalTitle,
      isDark && { color: '#F8FAFC' },
    ],
    navModalSubtitle: [
      baseAiCoachStyles.navModalSubtitle,
      isDark && { color: '#94A3B8' },
    ],
    navModalCloseBtn: [
      baseAiCoachStyles.navModalCloseBtn,
      isDark && {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
      },
    ],
    navDestCard: [
      baseAiCoachStyles.navDestCard,
      isDark && {
        backgroundColor: '#1E293B',
        borderWidth: 0,
        borderColor: 'transparent',
      },
    ],
    navDestTitle: [
      baseAiCoachStyles.navDestTitle,
      isDark && { color: '#F8FAFC' },
    ],
    navDestSubtitle: [
      baseAiCoachStyles.navDestSubtitle,
      isDark && { color: '#94A3B8' },
    ],
    historyActionSheet: [
      baseAiCoachStyles.historyActionSheet,
      isDark && { backgroundColor: '#0F172A', borderTopWidth: 0, borderTopColor: 'transparent' },
    ],
    historyActionHeader: [
      baseAiCoachStyles.historyActionHeader,
      isDark && { borderBottomWidth: 0, borderBottomColor: 'transparent' },
    ],
    historyActionTitle: [
      baseAiCoachStyles.historyActionTitle,
      isDark && { color: '#F8FAFC' },
    ],
    historyActionSubtitle: [
      baseAiCoachStyles.historyActionSubtitle,
      isDark && { color: '#94A3B8' },
    ],
    historyActionRow: [
      baseAiCoachStyles.historyActionRow,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    historyActionBtnTitle: [
      baseAiCoachStyles.historyActionBtnTitle,
      isDark && { color: '#F8FAFC' },
    ],
    historyActionBtnSub: [
      baseAiCoachStyles.historyActionBtnSub,
      isDark && { color: '#94A3B8' },
    ],
    renameContainer: [
      baseAiCoachStyles.renameContainer,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    renameLabel: [
      baseAiCoachStyles.renameLabel,
      isDark && { color: '#94A3B8' },
    ],
    renameInput: [
      baseAiCoachStyles.renameInput,
      isDark && { backgroundColor: '#0F172A', borderWidth: 0, borderColor: 'transparent', color: '#F8FAFC' },
    ],
    renameCancelBtn: [
      baseAiCoachStyles.renameCancelBtn,
      isDark && { backgroundColor: '#0F172A', borderWidth: 0, borderColor: 'transparent' },
    ],
    renameCancelText: [
      baseAiCoachStyles.renameCancelText,
      isDark && { color: '#94A3B8' },
    ],
    liveVoiceMainContainer: [
      baseAiCoachStyles.liveVoiceMainContainer,
      isDark && { backgroundColor: '#000000' },
    ],
    liveVoiceHeaderBtn: [
      baseAiCoachStyles.liveVoiceHeaderBtn,
      isDark && { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderWidth: 0, borderColor: 'transparent' },
    ],
    liveVoiceTranscriptText: [
      baseAiCoachStyles.liveVoiceTranscriptText,
      isDark && { color: '#F1F5F9' },
    ],
    liveVoiceInputPill: [
      baseAiCoachStyles.liveVoiceInputPill,
      isDark && { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderWidth: 0, borderColor: 'transparent' },
    ],
    liveVoiceInputField: [
      baseAiCoachStyles.liveVoiceInputField,
      isDark && { color: '#F8FAFC' },
    ],
    liveVoiceSendBtn: [
      baseAiCoachStyles.liveVoiceSendBtn,
      isDark && { backgroundColor: activeAccentColor || '#6236FF' },
    ],
    liveVoiceInputPillText: [
      baseAiCoachStyles.liveVoiceInputPillText,
      isDark && { color: '#94A3B8' },
    ],
    liveVoiceCircleBtn: [
      baseAiCoachStyles.liveVoiceCircleBtn,
      isDark && { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderWidth: 0, borderColor: 'transparent' },
    ],
    liveVoiceCircleBtnMuted: [
      baseAiCoachStyles.liveVoiceCircleBtnMuted,
      isDark && { backgroundColor: 'rgba(239, 68, 68, 0.25)', borderColor: '#EF4444' },
    ],
    liveVoiceCloseBtn: [
      baseAiCoachStyles.liveVoiceCloseBtn,
      isDark && {
        backgroundColor: '#FFFFFF',
        shadowColor: '#FFFFFF',
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
      },
    ],
    aiSettingsModalSheet: [
      baseAiCoachStyles.aiSettingsModalSheet,
      isDark && {
        backgroundColor: '#0F172A',
        borderColor: '#1E293B',
      },
    ],
    aiSettingsHeader: [
      baseAiCoachStyles.aiSettingsHeader,
      isDark && { borderBottomColor: '#1E293B' },
    ],
    aiSettingsTitle: [
      baseAiCoachStyles.aiSettingsTitle,
      isDark && { color: '#F8FAFC' },
    ],
    aiSettingsSubtitle: [
      baseAiCoachStyles.aiSettingsSubtitle,
      isDark && { color: '#94A3B8' },
    ],
    aiSettingsCloseBtn: [
      baseAiCoachStyles.aiSettingsCloseBtn,
      isDark && { backgroundColor: '#1E293B' },
    ],
    aiSectionCard: [
      baseAiCoachStyles.aiSectionCard,
      isDark && { backgroundColor: '#111A2E', borderColor: '#1E293B' },
    ],
    aiSectionTitle: [
      baseAiCoachStyles.aiSectionTitle,
      isDark && { color: '#F8FAFC' },
    ],
    aiSectionSubtitle: [
      baseAiCoachStyles.aiSectionSubtitle,
      isDark && { color: '#94A3B8' },
    ],
    aiSectionDivider: [
      baseAiCoachStyles.aiSectionDivider,
      isDark && { backgroundColor: '#1E293B' },
    ],
    aiPersonaCard: [
      baseAiCoachStyles.aiPersonaCard,
      isDark && { backgroundColor: '#131D31', borderColor: '#1E293B' },
    ],
    aiPersonaCardTitle: [
      baseAiCoachStyles.aiPersonaCardTitle,
      isDark && { color: '#F8FAFC' },
    ],
    aiPersonaCardDesc: [
      baseAiCoachStyles.aiPersonaCardDesc,
      isDark && { color: '#94A3B8' },
    ],
    aiRadioCircle: [
      baseAiCoachStyles.aiRadioCircle,
      isDark && { borderColor: '#334155' },
    ],
    aiRadioCircleSmall: [
      baseAiCoachStyles.aiRadioCircleSmall,
      isDark && { borderColor: '#334155' },
    ],
    aiDepthCard: [
      baseAiCoachStyles.aiDepthCard,
      isDark && { backgroundColor: '#131D31', borderColor: '#1E293B' },
    ],
    aiDepthLabel: [
      baseAiCoachStyles.aiDepthLabel,
      isDark && { color: '#F8FAFC' },
    ],
    aiDepthBadgePill: [
      baseAiCoachStyles.aiDepthBadgePill,
      isDark && { backgroundColor: '#1E293B' },
    ],
    aiDepthBadgePillText: [
      baseAiCoachStyles.aiDepthBadgePillText,
      isDark && { color: '#94A3B8' },
    ],
    aiDepthDesc: [
      baseAiCoachStyles.aiDepthDesc,
      isDark && { color: '#94A3B8' },
    ],
    aiSegmentControl: [
      baseAiCoachStyles.aiSegmentControl,
      isDark && { backgroundColor: '#0B0F19' },
    ],
    aiSegmentBtnText: [
      baseAiCoachStyles.aiSegmentBtnText,
      isDark && { color: '#94A3B8' },
    ],
    aiAcademicPill: [
      baseAiCoachStyles.aiAcademicPill,
      isDark && { backgroundColor: '#131D31', borderColor: '#1E293B' },
    ],
    aiAcademicPillTitle: [
      baseAiCoachStyles.aiAcademicPillTitle,
      isDark && { color: '#F8FAFC' },
    ],
    aiAcademicPillSub: [
      baseAiCoachStyles.aiAcademicPillSub,
      isDark && { color: '#94A3B8' },
    ],
    aiAcademicPillDesc: [
      baseAiCoachStyles.aiAcademicPillDesc,
      isDark && { color: '#64748B' },
    ],
    aiInputContainerCard: [
      baseAiCoachStyles.aiInputContainerCard,
      isDark && { backgroundColor: '#131D31', borderColor: '#1E293B' },
    ],
    aiInputLabel: [
      baseAiCoachStyles.aiInputLabel,
      isDark && { color: '#E2E8F0' },
    ],
    aiInputHint: [
      baseAiCoachStyles.aiInputHint,
      isDark && { color: '#64748B' },
    ],
    aiMemoryBadgeText: [
      baseAiCoachStyles.aiMemoryBadgeText,
      isDark && { color: '#64748B' },
    ],
    aiTextInput: [
      baseAiCoachStyles.aiTextInput,
      isDark && {
        backgroundColor: '#0F172A',
        borderColor: '#1E293B',
        color: '#F8FAFC',
      },
    ],
    aiFormatCard: [
      baseAiCoachStyles.aiFormatCard,
      isDark && { backgroundColor: '#131D31', borderColor: '#1E293B' },
    ],
    aiFormatCardTitle: [
      baseAiCoachStyles.aiFormatCardTitle,
      isDark && { color: '#F8FAFC' },
    ],
    aiFormatCardDesc: [
      baseAiCoachStyles.aiFormatCardDesc,
      isDark && { color: '#94A3B8' },
    ],
    aiTogglesList: [
      baseAiCoachStyles.aiTogglesList,
      isDark && { backgroundColor: '#131D31', borderColor: '#1E293B' },
    ],
    aiToggleTitle: [
      baseAiCoachStyles.aiToggleTitle,
      isDark && { color: '#F8FAFC' },
    ],
    aiToggleSubtitle: [
      baseAiCoachStyles.aiToggleSubtitle,
      isDark && { color: '#94A3B8' },
    ],
    aiToggleDivider: [
      baseAiCoachStyles.aiToggleDivider,
      isDark && { backgroundColor: '#1E293B' },
    ],
    aiSettingsFooter: [
      baseAiCoachStyles.aiSettingsFooter,
      isDark && { borderTopColor: '#1E293B' },
    ],
    aiSettingsResetBtn: [
      baseAiCoachStyles.aiSettingsResetBtn,
      isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
    ],
    aiSettingsResetText: [
      baseAiCoachStyles.aiSettingsResetText,
      isDark && { color: '#94A3B8' },
    ],
    chatGptSettingsCard: [
      baseAiCoachStyles.chatGptSettingsCard,
      isDark && {
        backgroundColor: '#1E222A',
        borderColor: '#2D3442',
      },
    ],
    chatGptSettingsHeader: [
      baseAiCoachStyles.chatGptSettingsHeader,
      isDark && {
        borderBottomColor: '#2D3442',
      },
    ],
    chatGptSettingsTitle: [
      baseAiCoachStyles.chatGptSettingsTitle,
      isDark && { color: '#F1F5F9' },
    ],
    chatGptSettingsCloseBtn: [
      baseAiCoachStyles.chatGptSettingsCloseBtn,
      isDark && { backgroundColor: '#282E3E' },
    ],
    chatGptSearchWrap: [
      baseAiCoachStyles.chatGptSearchWrap,
      isDark && {
        backgroundColor: '#161920',
        borderColor: '#2D3442',
      },
    ],
    chatGptSearchInput: [
      baseAiCoachStyles.chatGptSearchInput,
      isDark && { color: '#F1F5F9' },
    ],
    chatGptTabPill: [
      baseAiCoachStyles.chatGptTabPill,
      isDark && { backgroundColor: 'transparent' },
    ],
    chatGptTabPillActive: [
      baseAiCoachStyles.chatGptTabPillActive,
      isDark && { backgroundColor: '#2A3142' },
    ],
    chatGptTabLabel: [
      baseAiCoachStyles.chatGptTabLabel,
      isDark && { color: '#94A3B8' },
    ],
    chatGptTabLabelActive: [
      baseAiCoachStyles.chatGptTabLabelActive,
      isDark && { color: '#FFFFFF' },
    ],
    chatGptTabsDivider: [
      baseAiCoachStyles.chatGptTabsDivider,
      isDark && { backgroundColor: '#2D3442' },
    ],
    chatGptSectionHeading: [
      baseAiCoachStyles.chatGptSectionHeading,
      isDark && { color: '#64748B' },
    ],
    chatGptSettingRow: [
      baseAiCoachStyles.chatGptSettingRow,
      isDark && { borderBottomColor: '#262D3D' },
    ],
    chatGptRowLabel: [
      baseAiCoachStyles.chatGptRowLabel,
      isDark && { color: '#F1F5F9' },
    ],
    chatGptRowSub: [
      baseAiCoachStyles.chatGptRowSub,
      isDark && { color: '#8F9CAE' },
    ],
    chatGptDropdownBtn: [
      baseAiCoachStyles.chatGptDropdownBtn,
      isDark && {
        backgroundColor: '#161920',
        borderColor: '#2E3648',
      },
    ],
    chatGptDropdownBtnOpen: [
      baseAiCoachStyles.chatGptDropdownBtnOpen,
      isDark && {
        borderColor: '#3B4459',
        backgroundColor: '#222834',
      },
    ],
    chatGptDropdownValue: [
      baseAiCoachStyles.chatGptDropdownValue,
      isDark && { color: '#F1F5F9' },
    ],
    chatGptDropdownMenuPopup: [
      baseAiCoachStyles.chatGptDropdownMenuPopup,
      isDark && {
        backgroundColor: '#1E222A',
        borderColor: '#2D3442',
      },
    ],
    chatGptDropdownMenuItemText: [
      baseAiCoachStyles.chatGptDropdownMenuItemText,
      isDark && { color: '#F1F5F9' },
    ],
    chatGptDropdownMenuItemTextSelected: [
      baseAiCoachStyles.chatGptDropdownMenuItemTextSelected,
      isDark && { color: '#FFFFFF' },
    ],
    chatGptCustomInstCard: [
      baseAiCoachStyles.chatGptCustomInstCard,
      isDark && {
        backgroundColor: '#161920',
        borderColor: '#2D3442',
      },
    ],
    chatGptCustomInstTitle: [
      baseAiCoachStyles.chatGptCustomInstTitle,
      isDark && { color: '#F1F5F9' },
    ],
    chatGptCustomInstSub: [
      baseAiCoachStyles.chatGptCustomInstSub,
      isDark && { color: '#8F9CAE' },
    ],
    chatGptCustomInstInput: [
      baseAiCoachStyles.chatGptCustomInstInput,
      isDark && {
        backgroundColor: '#1E222A',
        borderColor: '#2D3442',
        color: '#F1F5F9',
      },
    ],
    chatGptEmptySearchText: [
      baseAiCoachStyles.chatGptEmptySearchText,
      isDark && { color: '#64748B' },
    ],
    chatGptProfileMenuPopup: [
      baseAiCoachStyles.chatGptProfileMenuPopup,
      isDark && {
        backgroundColor: '#1E222A',
        borderColor: '#2D3442',
      },
    ],
    chatGptProfileMenuName: [
      baseAiCoachStyles.chatGptProfileMenuName,
      isDark && { color: '#F1F5F9' },
    ],
    chatGptProfileMenuPlan: [
      baseAiCoachStyles.chatGptProfileMenuPlan,
      isDark && { color: '#8F9CAE' },
    ],
    chatGptProfileMenuDivider: [
      baseAiCoachStyles.chatGptProfileMenuDivider,
      isDark && { backgroundColor: '#262D3D' },
    ],
    chatGptProfileMenuItemLabel: [
      baseAiCoachStyles.chatGptProfileMenuItemLabel,
      isDark && { color: '#F1F5F9' },
    ],
    premiumProfileCardActive: [
      baseAiCoachStyles.premiumProfileCardActive,
      isDark && { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
    ],
  };
};
