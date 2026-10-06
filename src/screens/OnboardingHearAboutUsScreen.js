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
  Image,
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

// Custom Animated Card Component with Scale Micro-Interaction
function OptionCard({
  item,
  isSelected,
  onSelect,
  theme,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkScaleAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkScaleAnim, {
      toValue: isSelected ? 1 : 0,
      tension: 200,
      friction: 12,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [isSelected]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.975,
      speed: 40,
      bounciness: 4,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 30,
      bounciness: 6,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const SvgComp = item.component;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.sourceCard,
          isSelected
            ? [styles.sourceCardSelected, { backgroundColor: theme.isDark ? 'rgba(37, 99, 235, 0.22)' : '#F8FAFF', borderColor: theme.accent }]
            : [styles.sourceCardUnselected, { backgroundColor: theme.card, borderColor: theme.border }],
        ]}
        onPress={() => onSelect(item.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Brand Icon Badge */}
        <View style={styles.iconContainer}>
          {item.type === 'image' ? (
            <Image
              source={item.image}
              style={styles.rasterIcon}
              resizeMode="cover"
            />
          ) : (
            <SvgComp size={46} />
          )}
        </View>

        {/* Brand Name */}
        <Text
          style={[
            styles.sourceTitle,
            { color: theme.textPrimary },
            isSelected && styles.sourceTitleSelected,
          ]}
        >
          {item.title}
        </Text>

        {/* Custom Radio Button with Animated Pop */}
        <View
          style={[
            styles.radioCircle,
            isSelected
              ? [styles.radioCircleSelected, { backgroundColor: theme.accent, borderColor: theme.accent }]
              : [styles.radioCircleUnselected, { borderColor: theme.border }],
          ]}
        >
          {isSelected && (
            <Animated.View style={{ transform: [{ scale: checkScaleAnim }] }}>
              <Svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <Path
                  d="M 2.5 7 L 5.5 10 L 11.5 3.5"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// 1. Authentic Instagram Gradient Squircle Icon
function InstagramIcon({ size = 46 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 46 46" fill="none">
      <Defs>
        <LinearGradient id="igGlowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#FFDC80" />
          <Stop offset="18%" stopColor="#F77737" />
          <Stop offset="36%" stopColor="#F56040" />
          <Stop offset="55%" stopColor="#FD1D1D" />
          <Stop offset="75%" stopColor="#E1306C" />
          <Stop offset="88%" stopColor="#C13584" />
          <Stop offset="100%" stopColor="#833AB4" />
        </LinearGradient>
      </Defs>
      <Rect width="46" height="46" rx="13" fill="url(#igGlowGrad)" />
      {/* Subtle top-edge light reflection */}
      <Path
        d="M 12 1.5 L 34 1.5"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeOpacity="0.4"
        strokeLinecap="round"
      />
      {/* Camera Body */}
      <Rect
        x="11.5"
        y="11.5"
        width="23"
        height="23"
        rx="7"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        fill="none"
      />
      {/* Camera Lens */}
      <Circle
        cx="23"
        cy="23"
        r="5.8"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        fill="none"
      />
      {/* Flash Dot */}
      <Circle cx="29.5" cy="16.5" r="1.5" fill="#FFFFFF" />
    </Svg>
  );
}

// 2. High-Gloss YouTube Icon
function YouTubeIcon({ size = 46 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 46 46" fill="none">
      <Defs>
        <LinearGradient id="ytGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FF1E1E" />
          <Stop offset="100%" stopColor="#E00000" />
        </LinearGradient>
      </Defs>
      <Rect width="46" height="46" rx="13" fill="url(#ytGlowGrad)" />
      {/* Top highlight */}
      <Path
        d="M 12 1.5 L 34 1.5"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
      {/* Triangle Play Button */}
      <Path
        d="M 19 15.5 
           C 19 14.7 19.9 14.2 20.6 14.6 
           L 30.5 20.6 
           C 31.2 21.0 31.2 22.0 30.5 22.4 
           L 20.6 28.4 
           C 19.9 28.8 19 28.3 19 27.5 Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

// 3. Premium Sunset Duo "Friends & Family" Icon
function FriendsIcon({ size = 46 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 46 46" fill="none">
      <Defs>
        <LinearGradient id="friendsWarmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FB923C" />
          <Stop offset="50%" stopColor="#F97316" />
          <Stop offset="100%" stopColor="#EA580C" />
        </LinearGradient>
      </Defs>
      <Rect width="46" height="46" rx="13" fill="url(#friendsWarmGrad)" />
      <Path
        d="M 12 1.5 L 34 1.5"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeOpacity="0.4"
        strokeLinecap="round"
      />
      {/* Background Person (Friend / Family member) */}
      <Circle cx="28.5" cy="18" r="4.2" fill="#FFFFFF" fillOpacity="0.85" />
      <Path
        d="M 23 32 C 23 27 25.5 25 29.5 25 C 33.5 25 36 27 36 32 Z"
        fill="#FFFFFF"
        fillOpacity="0.85"
      />
      {/* Foreground Main Person */}
      <Circle cx="18" cy="19.5" r="4.8" fill="#FFFFFF" />
      <Path
        d="M 11 34 C 11 28 14 26 18 26 C 22 26 25 28 25 34 Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

// 4. Premium Starburst / Discovery "Other" Icon
function OtherIcon({ size = 46 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 46 46" fill="none">
      <Defs>
        <LinearGradient id="otherModernGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#6366F1" />
          <Stop offset="50%" stopColor="#4F46E5" />
          <Stop offset="100%" stopColor="#3730A3" />
        </LinearGradient>
      </Defs>
      <Rect width="46" height="46" rx="13" fill="url(#otherModernGrad)" />
      <Path
        d="M 12 1.5 L 34 1.5"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeOpacity="0.4"
        strokeLinecap="round"
      />
      {/* Stylized 4-Point Discovery Sparkle Star */}
      <Path
        d="M 23 11
           C 23 17 25 19 31 19
           C 25 19 23 21 23 27
           C 23 21 21 19 15 19
           C 21 19 23 17 23 11 Z"
        fill="#FFFFFF"
      />
      {/* Secondary Mini Sparkle */}
      <Circle cx="30" cy="29" r="2.2" fill="#FFFFFF" fillOpacity="0.9" />
      <Circle cx="16" cy="28" r="1.6" fill="#FFFFFF" fillOpacity="0.75" />
    </Svg>
  );
}

const SOURCES = [
  {
    id: 'tiktok',
    title: 'TikTok',
    type: 'image',
    image: require('../../assets/images/tiktok_logo.png'),
  },
  {
    id: 'friends_or_family',
    title: 'Friends or family',
    type: 'svg',
    component: FriendsIcon,
  },
  {
    id: 'other',
    title: 'Other',
    type: 'svg',
    component: OtherIcon,
  },
  {
    id: 'snapchat',
    title: 'Snapchat',
    type: 'image',
    image: require('../../assets/images/snapchat_logo.png'),
  },
  {
    id: 'youtube',
    title: 'YouTube',
    type: 'svg',
    component: YouTubeIcon,
  },
  {
    id: 'instagram',
    title: 'Instagram',
    type: 'svg',
    component: InstagramIcon,
  },
];

export default function OnboardingHearAboutUsScreen({
  initialSelection = 'youtube',
  onContinue,
  onBack,
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const [selectedSource, setSelectedSource] = useState(initialSelection);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

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

  const handleSelect = (id) => {
    setSelectedSource(id);
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue(selectedSource || 'youtube');
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
          {/* Header Block */}
          <View style={styles.headerBlock}>
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>where did you hear about us?</Text>
            <Text style={[styles.subtextNote, { color: theme.textSecondary }]}>
              this helps us reach more students who want to study smarter
            </Text>
          </View>

          {/* Options List */}
          <ScrollView
            style={styles.optionsScrollView}
            contentContainerStyle={styles.optionsList}
            showsVerticalScrollIndicator={false}
          >
            {SOURCES.map((source) => (
              <OptionCard
                key={source.id}
                item={source}
                isSelected={selectedSource === source.id}
                onSelect={handleSelect}
                theme={theme}
              />
            ))}
          </ScrollView>

          {/* Bottom CTA Action Button */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.accentDark || '#1200C6' }]}
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
    paddingTop: 12,
    paddingBottom: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerBlock: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 12,
  },
  titleText: {
    fontSize: 27,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 34,
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtextNote: {
    fontSize: 14.5,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    letterSpacing: -0.2,
    maxWidth: 320,
  },
  optionsScrollView: {
    flex: 1,
  },
  optionsList: {
    gap: 12,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 11,
    paddingHorizontal: 16,
    minHeight: 70,
  },
  sourceCardUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sourceCardSelected: {
    backgroundColor: '#F8FAFF',
    borderWidth: 2,
    borderColor: '#1200C6',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 13,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  rasterIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
  },
  sourceTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  sourceTitleSelected: {
    color: '#0F172A',
    fontWeight: '800',
  },
  radioCircle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  radioCircleUnselected: {
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  radioCircleSelected: {
    backgroundColor: '#1200C6',
    borderWidth: 1.8,
    borderColor: '#1200C6',
  },
  actionsContainer: {
    width: '100%',
    paddingTop: 14,
    paddingBottom: 6,
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
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
