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
import Svg, { Path, Rect, Circle, Polygon } from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

// ==========================================
// 1. CUSTOM ICONS MATCHING USER SCREENSHOT
// ==========================================

// 1. Option 1: Solid lightning bolt in amber/yellow
function ZapIcon({ size = 20, color = '#D97706' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polygon
        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
        fill={color}
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 2. Option 2: Clean calendar in blue
function CalendarIcon({ size = 20, color = '#2563EB' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="4" width="18" height="17" rx="3.5" />
      <Path d="M16 2v4M8 2v4M3 9.5h18" strokeWidth="1.8" />
      <Path d="M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01M16 17h.01" strokeWidth="2.5" />
    </Svg>
  );
}

// 3. Option 3: Compass in emerald green
function CompassIcon({ size = 20, color = '#059669' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="9.5" />
      <Polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} fillOpacity="0.25" />
    </Svg>
  );
}

// 4. Option 4: Trophy in purple
function TrophyIcon({ size = 20, color = '#7C3AED' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <Path d="M4 22h16" />
      <Path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
      <Path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </Svg>
  );
}

// ==========================================
// 2. CONFIGURATION DATA
// ==========================================

const TARGET_OPTIONS = [
  {
    id: '1month',
    label: 'In 1 month',
    sublabel: 'Fast sprint • 30 days',
    days: 30,
    icon: ZapIcon,
    accentColor: '#D97706',
    iconBg: '#FEF3C7',
    iconBgDark: 'rgba(217, 119, 6, 0.18)',
  },
  {
    id: '3months',
    label: 'In 3 months',
    sublabel: 'Balanced pace • 90 days',
    badge: 'RECOMMENDED',
    days: 90,
    icon: CalendarIcon,
    accentColor: '#2563EB',
    iconBg: '#EEF2FF',
    iconBgDark: 'rgba(37, 99, 235, 0.18)',
  },
  {
    id: '6months',
    label: 'In 6 months',
    sublabel: 'Deep mastery • 180 days',
    days: 180,
    icon: CompassIcon,
    accentColor: '#059669',
    iconBg: '#ECFDF5',
    iconBgDark: 'rgba(5, 150, 105, 0.18)',
  },
  {
    id: 'year',
    label: 'In a year',
    sublabel: 'Comprehensive • 365 days',
    days: 365,
    icon: TrophyIcon,
    accentColor: '#7C3AED',
    iconBg: '#F5F3FF',
    iconBgDark: 'rgba(124, 58, 237, 0.18)',
  },
];

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function OnboardingTargetScreen({
  onContinue,
  onBack,
  initialValue = 'In 3 months',
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const initialLabel = typeof initialValue === 'string'
    ? initialValue
    : initialValue?.label || 'In 3 months';

  const [selectedTarget, setSelectedTarget] = useState(initialLabel);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [btnScale] = useState(new Animated.Value(1));

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
    if (selectedTarget && onContinue) {
      const match = TARGET_OPTIONS.find((t) => t.label === selectedTarget) || TARGET_OPTIONS[1];
      onContinue(match);
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
                when is your target?
              </Text>
            </View>

            {/* Options List */}
            <View style={styles.optionsList}>
              {TARGET_OPTIONS.map((item) => {
                const isSelected = selectedTarget === item.label;
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
                    onPress={() => setSelectedTarget(item.label)}
                    activeOpacity={0.8}
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
              style={[
                styles.continueButton,
                selectedTarget ? styles.continueButtonActive : styles.continueButtonInactive,
              ]}
              onPress={handleNext}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
              disabled={!selectedTarget}
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
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  headerBlock: {
    marginBottom: 24,
    marginTop: 6,
  },
  mainTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#0A1838',
    letterSpacing: -0.6,
  },
  optionsList: {
    gap: 13,
  },
  optionCard: {
    minHeight: 74,
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
    gap: 14,
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
    fontSize: 16,
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
    fontSize: 12.5,
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
  footerContainer: {
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
  },
  continueButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#0D00A4', // Deep solid royal blue matching the screenshot
    shadowColor: '#0D00A4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonInactive: {
    backgroundColor: '#A59DE7',
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
