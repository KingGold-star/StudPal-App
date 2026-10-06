import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  ClipPath,
  Image as SvgImage,
} from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

// Inject 60fps/120fps GPU Hardware-Accelerated Smooth Float Animation for Web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'studpal-vault-float-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes studpalVaultLevitate {
        0% {
          transform: translateY(0px) scale(1);
        }
        50% {
          transform: translateY(-8px) scale(1.02);
        }
        100% {
          transform: translateY(0px) scale(1);
        }
      }
      .studpal-vault-float {
        animation: studpalVaultLevitate 3.6s ease-in-out infinite !important;
        will-change: transform !important;
        transform-origin: center center !important;
      }
    `;
    document.head.appendChild(style);
  }
}

function LockedAppsPadlockGraphic({ size = 305, floatAnim }) {
  const translateY = floatAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -8, 0],
  });

  const isWeb = Platform.OS === 'web';

  const svgContent = (
    <Svg width={size} height={size} viewBox="0 0 400 400" fill="none">
      <Defs>
        {/* Soft Background Security Aura */}
        <RadialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.22" />
          <Stop offset="65%" stopColor="#60A5FA" stopOpacity="0.06" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>

        {/* Shackle Chrome Gradient */}
        <LinearGradient id="chromeShackleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F8FAFC" />
          <Stop offset="20%" stopColor="#CBD5E1" />
          <Stop offset="45%" stopColor="#FFFFFF" />
          <Stop offset="70%" stopColor="#94A3B8" />
          <Stop offset="90%" stopColor="#64748B" />
          <Stop offset="100%" stopColor="#334155" />
        </LinearGradient>

        {/* Shackle Specular Highlight */}
        <LinearGradient id="shackleHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>

        {/* Shackle Mechanical Joint Collar */}
        <LinearGradient id="collarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#475569" />
          <Stop offset="50%" stopColor="#F8FAFC" />
          <Stop offset="100%" stopColor="#334155" />
        </LinearGradient>

        {/* 3D Sapphire Blue Lock Body */}
        <LinearGradient id="lockBody3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#3B82F6" />
          <Stop offset="25%" stopColor="#2563EB" />
          <Stop offset="65%" stopColor="#1D4ED8" />
          <Stop offset="100%" stopColor="#172554" />
        </LinearGradient>

        {/* Frosted Glass Chamfer Bevel */}
        <LinearGradient id="glassChamfer" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
          <Stop offset="15%" stopColor="#60A5FA" stopOpacity="0.2" />
          <Stop offset="85%" stopColor="#1E3A8A" stopOpacity="0.1" />
          <Stop offset="100%" stopColor="#0F172A" stopOpacity="0.5" />
        </LinearGradient>

        {/* Keyhole Core Glow Gradient */}
        <LinearGradient id="keyholeCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#020617" />
          <Stop offset="70%" stopColor="#091024" />
          <Stop offset="100%" stopColor="#1E3A8A" />
        </LinearGradient>

        {/* Laser Security Core */}
        <RadialGradient id="laserCyanGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </RadialGradient>

        {/* Official Instagram Gradient */}
        <LinearGradient id="igOfficialGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#FFDC80" />
          <Stop offset="20%" stopColor="#F77737" />
          <Stop offset="40%" stopColor="#F56040" />
          <Stop offset="60%" stopColor="#FD1D1D" />
          <Stop offset="80%" stopColor="#E1306C" />
          <Stop offset="90%" stopColor="#C13584" />
          <Stop offset="100%" stopColor="#833AB4" />
        </LinearGradient>

        {/* Official YouTube Gradient */}
        <LinearGradient id="ytOfficialGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FF1E1E" />
          <Stop offset="100%" stopColor="#E60000" />
        </LinearGradient>

        {/* Official Snapchat Gradient */}
        <LinearGradient id="snapOfficialGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFFC00" />
          <Stop offset="100%" stopColor="#F5E800" />
        </LinearGradient>

        {/* Official Reddit Gradient */}
        <LinearGradient id="redditOfficialGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FF5700" />
          <Stop offset="100%" stopColor="#E03D00" />
        </LinearGradient>

        {/* Official X / Dark Gradient */}
        <LinearGradient id="xOfficialGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#1E293B" />
          <Stop offset="100%" stopColor="#000000" />
        </LinearGradient>

        {/* Padlock Ambient Contact Shadow */}
        <RadialGradient id="padlockCastShadow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#0F172A" stopOpacity="0.35" />
          <Stop offset="75%" stopColor="#1E293B" stopOpacity="0.12" />
          <Stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </RadialGradient>

        {/* Ground Shadow */}
        <RadialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#0F172A" stopOpacity="0.16" />
          <Stop offset="70%" stopColor="#1E293B" stopOpacity="0.03" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>

        {/* Snapchat Squircle Clip */}
        <ClipPath id="snapSquircleClip">
          <Rect x="-43" y="-43" width="86" height="86" rx="24" />
        </ClipPath>

        {/* TikTok Squircle Clip */}
        <ClipPath id="tiktokSquircleClip">
          <Rect x="-43" y="-43" width="86" height="86" rx="24" />
        </ClipPath>
      </Defs>

      {/* 1. Background Aura Field */}
      <Circle cx="200" cy="200" r="180" stroke="#DBEAFE" strokeWidth="1.2" strokeDasharray="6,7" strokeOpacity="0.75" />
      <Circle cx="200" cy="200" r="150" stroke="#BFDBFE" strokeWidth="1" strokeOpacity="0.5" />
      <Circle cx="200" cy="200" r="125" fill="url(#auraGlow)" />

      {/* 2. REAL OFFICIAL SOCIAL MEDIA APP TILES (Positioned Under the Padlock) */}

      {/* 2a. Real Instagram Logo (Top-Left Shoulder - 86x86) */}
      <G transform="translate(110, 115) rotate(-20)">
        <Rect x="-43" y="-39" width="86" height="86" rx="24" fill="#0F172A" fillOpacity="0.2" />
        <Rect x="-43" y="-43" width="86" height="86" rx="24" fill="url(#igOfficialGrad)" />
        {/* Gloss Top Edge */}
        <Path d="M -26 -42 L 26 -42" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.45" strokeLinecap="round" />
        {/* Authentic Instagram Camera Glyph */}
        <Rect x="-23" y="-23" width="46" height="46" rx="14" stroke="#FFFFFF" strokeWidth="3.4" fill="none" />
        <Circle cx="0" cy="0" r="11.5" stroke="#FFFFFF" strokeWidth="3.4" fill="none" />
        <Circle cx="13" cy="-13" r="3" fill="#FFFFFF" />
      </G>

      {/* 2b. Real Official TikTok Logo (Exact Image from User Link) (Top-Right Shoulder - 86x86) */}
      <G transform="translate(290, 115) rotate(20)">
        <Rect x="-43" y="-39" width="86" height="86" rx="24" fill="#0F172A" fillOpacity="0.2" />
        <G clipPath="url(#tiktokSquircleClip)">
          <SvgImage
            x="-43"
            y="-43"
            width="86"
            height="86"
            href={require('../../assets/images/tiktok_logo.png')}
            preserveAspectRatio="xMidYMid slice"
          />
        </G>
        {/* Gloss Top Edge */}
        <Path d="M -26 -42 L 26 -42" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.2" strokeLinecap="round" />
      </G>

      {/* 2c. Real Reddit Snoo Logo (Upper-Left Shackle - 76x76) */}
      <G transform="translate(125, 46) rotate(-15)">
        <Rect x="-38" y="-34" width="76" height="76" rx="21" fill="#0F172A" fillOpacity="0.18" />
        <Rect x="-38" y="-38" width="76" height="76" rx="21" fill="url(#redditOfficialGrad)" />
        {/* Gloss Top Edge */}
        <Path d="M -22 -37 L 22 -37" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.35" strokeLinecap="round" />
        {/* Perfectly Proportioned Snoo */}
        {/* Ears */}
        <Circle cx="-15" cy="0" r="4.5" fill="#FFFFFF" />
        <Circle cx="15" cy="0" r="4.5" fill="#FFFFFF" />
        {/* Round Head */}
        <Circle cx="0" cy="2" r="14.5" fill="#FFFFFF" />
        {/* Glowing Orange Eyes */}
        <Circle cx="-5.5" cy="1" r="2.8" fill="#FF4500" />
        <Circle cx="5.5" cy="1" r="2.8" fill="#FF4500" />
        {/* Smile */}
        <Path
          d="M -5.5 6 Q 0 9.5 5.5 6"
          stroke="#FF4500"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Antenna with Ball */}
        <Path
          d="M 0 -12.5 L 4 -19 L 10 -16"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="12" cy="-15" r="3.6" fill="#FFFFFF" />
      </G>

      {/* 2d. Real Official X (Twitter) Logo (Upper-Right Shackle - 76x76) */}
      <G transform="translate(275, 46) rotate(15)">
        <Rect x="-38" y="-34" width="76" height="76" rx="21" fill="#0F172A" fillOpacity="0.18" />
        <Rect x="-38" y="-38" width="76" height="76" rx="21" fill="url(#xOfficialGrad)" stroke="#334155" strokeWidth="1.2" />
        {/* Gloss Top Edge */}
        <Path d="M -22 -37 L 22 -37" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.25" strokeLinecap="round" />
        {/* Official Mathematical X Vector Glyph */}
        <G transform="scale(1.8) translate(-12, -12)">
          <Path
            d="M 18.244 2.25 h 3.308 l -7.227 8.26 8.502 11.24 H 16.17 l -5.214 -6.817 L 4.99 21.75 H 1.68 l 7.73 -8.835 L 1.254 2.25 H 8.08 l 4.713 6.231 z m -1.161 17.52 h 1.833 L 7.084 4.126 H 5.117 z"
            fill="#FFFFFF"
          />
        </G>
      </G>

      {/* 2e. Real YouTube Logo (Lower-Left Body - 86x86) */}
      <G transform="translate(90, 250) rotate(-16)">
        <Rect x="-43" y="-39" width="86" height="86" rx="24" fill="#0F172A" fillOpacity="0.2" />
        <Rect x="-43" y="-43" width="86" height="86" rx="24" fill="url(#ytOfficialGrad)" />
        {/* Gloss Top Edge */}
        <Path d="M -26 -42 L 26 -42" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />
        {/* YouTube Rounded Equilateral Play Triangle */}
        <Path
          d="M -9 -15 
             C -9 -16.5 -7.2 -17.5 -5.8 -16.8 
             L 16 -1.8 
             C 17.3 -1 17.3 1 16 1.8 
             L -5.8 16.8 
             C -7.2 17.5 -9 16.5 -9 15 Z"
          fill="#FFFFFF"
        />
      </G>

      {/* 2f. Real Official Snapchat Logo (Exact Image from User Link) (Lower-Right Body - 86x86) */}
      <G transform="translate(310, 250) rotate(16)">
        <Rect x="-43" y="-39" width="86" height="86" rx="24" fill="#0F172A" fillOpacity="0.2" />
        <G clipPath="url(#snapSquircleClip)">
          <SvgImage
            x="-43"
            y="-43"
            width="86"
            height="86"
            href={require('../../assets/images/snapchat_logo.png')}
            preserveAspectRatio="xMidYMid slice"
          />
        </G>
        {/* Gloss Top Edge */}
        <Path d="M -26 -42 L 26 -42" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.45" strokeLinecap="round" />
      </G>

      {/* 3. Deep Drop Shadow Cast by Padlock Directly Over the Apps Underneath */}
      <Rect x="102" y="164" width="196" height="152" rx="38" fill="url(#padlockCastShadow)" />
      <Path
        d="M 144 174 L 144 102 C 144 50 168 28 200 28 C 232 28 256 50 256 102 L 256 174 Z"
        fill="#0F172A"
        fillOpacity="0.15"
      />

      {/* 4. Solid Clean Shackle Loop Backing */}
      <Path
        d="M 174 174 L 174 102 C 174 68 184 56 200 56 C 216 56 226 68 226 102 L 226 174 Z"
        fill="#FFFFFF"
      />
      <Path
        d="M 174 102 C 174 68 184 56 200 56 C 216 56 226 68 226 102"
        stroke="#CBD5E1"
        strokeWidth="3.5"
        fill="none"
        strokeOpacity="0.45"
      />

      {/* 5. Bottom Ground Contact Shadow */}
      <Rect x="110" y="306" width="180" height="26" rx="13" fill="url(#groundShadow)" />

      {/* 6. Padlock Shackle Mechanism (Front Layer) */}
      <G>
        {/* Chrome Shackle Loop */}
        <Path
          d="M 150 174 
             L 150 102 
             C 150 56 172 34 200 34 
             C 228 34 250 56 250 102 
             L 250 174
             L 226 174
             L 226 102
             C 226 68 216 56 200 56
             C 184 56 174 68 174 102
             L 174 174 Z"
          fill="url(#chromeShackleGrad)"
        />

        {/* Shackle Specular Highlight Rim */}
        <Path
          d="M 157 102 
             C 157 62 172 46 200 46 
             C 228 46 243 62 243 102"
          stroke="url(#shackleHighlight)"
          strokeWidth="4.2"
          strokeLinecap="round"
        />

        {/* Mechanical Joint Collars */}
        <Rect x="142" y="164" width="34" height="16" rx="5" fill="url(#collarGrad)" stroke="#64748B" strokeWidth="1" />
        <Rect x="224" y="164" width="34" height="16" rx="5" fill="url(#collarGrad)" stroke="#64748B" strokeWidth="1" />
      </G>

      {/* 7. Main 3D Sapphire Blue Padlock Body (Front Layer) */}
      <G>
        {/* Solid Beveled Body */}
        <Rect
          x="110"
          y="170"
          width="180"
          height="138"
          rx="34"
          fill="url(#lockBody3D)"
        />

        {/* Front Plate Inset with Glassmorphism Bevel */}
        <Rect
          x="116"
          y="176"
          width="168"
          height="126"
          rx="28"
          fill="url(#glassChamfer)"
          stroke="#93C5FD"
          strokeWidth="1.4"
          strokeOpacity="0.65"
        />

        {/* Top-Edge Specular Reflection */}
        <Path
          d="M 148 173 L 252 173"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeOpacity="0.88"
        />

        {/* Subtle Vertical Brushed Accent Line */}
        <Path
          d="M 126 202 L 126 274"
          stroke="#60A5FA"
          strokeWidth="1.6"
          strokeOpacity="0.3"
          strokeLinecap="round"
        />
      </G>

      {/* 8. High-Tech Vault Keyhole with Luminous Core */}
      <G>
        {/* Outer Keyhole Well */}
        <Circle cx="200" cy="230" r="20" fill="#172554" />
        <Path
          d="M 189 230 L 184 264 C 184 267 187 270 192 270 L 208 270 C 213 270 216 267 216 264 L 211 230 Z"
          fill="#172554"
        />

        {/* Dark High-Precision Aperture Chamber */}
        <Circle cx="200" cy="230" r="15" fill="url(#keyholeCoreGrad)" />
        <Path
          d="M 191 230 L 187 262 C 187 264 190 266 194 266 L 206 266 C 210 266 213 264 213 262 L 209 230 Z"
          fill="url(#keyholeCoreGrad)"
        />

        {/* Cyan Security Laser Glow */}
        <Circle cx="200" cy="228" r="8" fill="url(#laserCyanGlow)" />
        <Circle cx="200" cy="228" r="3.2" fill="#FFFFFF" />
      </G>

      {/* 9. Ambient Sparkles */}
      <Circle cx="50" cy="165" r="3.2" fill="#60A5FA" fillOpacity="0.75" />
      <Circle cx="350" cy="170" r="3.6" fill="#93C5FD" fillOpacity="0.85" />
    </Svg>
  );

  if (isWeb) {
    return (
      <View style={styles.graphicWrapper}>
        <div className="studpal-vault-float" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {svgContent}
        </div>
      </View>
    );
  }

  return (
    <View style={styles.graphicWrapper}>
      <Animated.View
        style={{
          transform: [{ translateY }],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {svgContent}
      </Animated.View>
    </View>
  );
}

export default function OnboardingStudyProtectionScreen({
  onContinue,
  onSkip,
  onBack,
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(14)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    // 2. Smooth Sinusoidal Continuous Floating Levitation Loop
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    floatAnimation.start();

    return () => {
      floatAnimation.stop();
    };
  }, [fadeAnim, slideAnim, floatAnim]);

  const handleSetup = () => {
    if (onContinue) {
      onContinue(true);
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
          {/* Header Section */}
          <View style={styles.headerBlock}>
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>
              want help{'\n'}
              <Text style={[styles.boldTitlePart, { color: theme.textPrimary }]}>protecting your study time?</Text>
            </Text>

            <Text style={[styles.subtextNote, { color: theme.textSecondary }]}>
              StudPal can automatically block distracting apps and silence alerts when your study session begins.
            </Text>
          </View>

          {/* Center 3D Luxury Padlock Hero with Real Social Media Logos Underneath */}
          <View style={styles.graphicSection}>
            <LockedAppsPadlockGraphic size={305} floatAnim={floatAnim} />
          </View>

          {/* Bottom Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSetup}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>set it up</Text>
            </TouchableOpacity>

            <Text style={[styles.disclaimerText, { color: theme.textMuted }]}>
              You can adjust blocked apps anytime in Settings.
            </Text>
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
    paddingVertical: 14,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerBlock: {
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '500',
    color: '#0F172A',
    lineHeight: 34,
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  boldTitlePart: {
    fontWeight: '800',
    color: '#0F172A',
  },
  subtextNote: {
    fontSize: 14.5,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    letterSpacing: -0.2,
    paddingHorizontal: 10,
  },
  graphicSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 4,
  },
  graphicWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 4,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#1200C6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  disclaimerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: -0.1,
  },
});
