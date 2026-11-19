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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

// ==========================================
// 1. CUSTOM ICONS
// ==========================================

// 1. Pomodoro Focus Timer Icon
function PomodoroTimerIcon({ size = 22, color = '#E11D48' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="13" r="8" stroke={color} strokeWidth="2" />
      <Path d="M12 2v3M9.5 2h5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M18.5 6.5l-1.5 1.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M12 13V8.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M12 13l3.2 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="13" r="1.4" fill={color} />
    </Svg>
  );
}

// 2. Continuous Flow / Deep Work Icon
function ContinuousFlowIcon({ size = 22, color = '#7C3AED' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18.18 8c5.1 0 5.1 8 0 8-3.06 0-4.59-4-6.18-4s-3.12 4-6.18 4c-5.1 0-5.1-8 0-8 3.06 0 4.59 4 6.18 4s3.12-4 6.18-4z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ==========================================
// 2. CONFIGURATION DATA (JUST TWO OPTIONS)
// ==========================================

const POMODORO_OPTIONS = [
  {
    id: 'yes',
    value: true,
    label: 'Yes, I use Pomodoro',
    sublabel: '25 min focus sprints • 5 min breaks',
    badge: 'POPULAR',
    tag: '4 CYCLES • +50 XP',
    icon: PomodoroTimerIcon,
    accentColor: '#E11D48',
    iconBg: '#FFE4E6',
    iconBgDark: 'rgba(225, 29, 72, 0.18)',
  },
  {
    id: 'no',
    value: false,
    label: 'No, I prefer continuous study',
    sublabel: 'Longer, uninterrupted focus sessions',
    badge: null,
    tag: 'DEEP FLOW • FLEXIBLE',
    icon: ContinuousFlowIcon,
    accentColor: '#7C3AED',
    iconBg: '#F5F3FF',
    iconBgDark: 'rgba(124, 58, 237, 0.18)',
  },
];

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function OnboardingPomodoroScreen({
  onContinue,
  onBack,
  initialValue = true,
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const [selectedId, setSelectedId] = useState(
    initialValue === false || initialValue === 'no' ? 'no' : 'yes'
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [btnScale] = useState(new Animated.Value(1));

  // Entrance fade-in
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

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

  const handleNext = () => {
    if (onContinue) {
      const match = POMODORO_OPTIONS.find((opt) => opt.id === selectedId) || POMODORO_OPTIONS[0];
      onContinue(match.value, match);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
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
          >
            {/* Header Question Block */}
            <View style={styles.headerBlock}>
              <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
                do you use the Pomodoro method?
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                The Pomodoro technique breaks study into focused 25-minute intervals followed by 5-minute breaks to maximize retention and keep your mind fresh.
              </Text>
            </View>

            {/* Exactly Two Options */}
            <View style={styles.optionsList}>
              {POMODORO_OPTIONS.map((item) => {
                const isSelected = selectedId === item.id;
                const IconComp = item.icon;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.optionCard,
                      {
                        backgroundColor: isSelected
                          ? isDark
                            ? 'rgba(37, 99, 235, 0.12)'
                            : '#EFF6FF'
                          : isDark
                          ? 'rgba(255, 255, 255, 0.035)'
                          : '#FFFFFF',
                        borderColor: isSelected
                          ? '#2563EB'
                          : isDark
                          ? 'rgba(255, 255, 255, 0.09)'
                          : '#E2E8F0',
                      },
                    ]}
                    onPress={() => setSelectedId(item.id)}
                    activeOpacity={0.82}
                  >
                    <View style={styles.leftContentRow}>
                      {/* Tinted Icon Squircle */}
                      <View
                        style={[
                          styles.iconBox,
                          {
                            backgroundColor: isDark
                              ? item.iconBgDark
                              : item.iconBg,
                          },
                        ]}
                      >
                        <IconComp size={22} color={item.accentColor} />
                      </View>

                      {/* Text & Meta Information */}
                      <View style={styles.labelContainer}>
                        <View style={styles.titleRow}>
                          <Text
                            style={[
                              styles.optionText,
                              {
                                color: isSelected
                                  ? '#2563EB'
                                  : theme.textPrimary,
                              },
                            ]}
                          >
                            {item.label}
                          </Text>

                          {item.badge && (
                            <View
                              style={[
                                styles.badgePill,
                                {
                                  backgroundColor: isDark
                                    ? 'rgba(37, 99, 235, 0.18)'
                                    : 'transparent',
                                  borderColor: isSelected ? '#2563EB' : '#3B82F6',
                                },
                              ]}
                            >
                              <Text style={styles.badgeText}>
                                {item.badge}
                              </Text>
                            </View>
                          )}
                        </View>

                        <Text style={[styles.sublabel, { color: theme.textSecondary }]}>
                          {item.sublabel}
                        </Text>
                      </View>
                    </View>

                    {/* Radio Indicator */}
                    <View
                      style={[
                        styles.radioCircle,
                        {
                          borderColor: isSelected ? '#2563EB' : isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1',
                        },
                      ]}
                    >
                      {isSelected && <View style={styles.radioInnerDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Bottom Continue Button */}
        <View style={styles.footerContainer}>
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleNext}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <View style={styles.buttonContentRow}>
                <Text style={styles.continueButtonText}>continue</Text>
                <Text style={styles.arrowIcon}>➔</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ==========================================
// 4. STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  headerBlock: {
    marginBottom: 20,
    marginTop: 4,
  },
  mainTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#0A1838',
    letterSpacing: -0.6,
    lineHeight: 33,
    marginBottom: 7,
  },
  subtitle: {
    fontSize: 13.8,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 19.5,
    letterSpacing: -0.15,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    minHeight: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 13,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  leftContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  optionText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  badgePill: {
    backgroundColor: 'transparent',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1.2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  sublabel: {
    fontSize: 12.2,
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: -0.1,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginLeft: 8,
  },
  radioInnerDot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#2563EB',
  },

  /* Footer & Button */
  footerContainer: {
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
  },
  continueButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#0D00A4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D00A4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  arrowIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
