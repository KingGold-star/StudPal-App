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

function ZapIcon({ size = 20, color = '#D97706' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Svg>
  );
}

function CalendarIcon({ size = 20, color = '#1200C6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="4" width="18" height="18" rx="3" />
      <Path d="M16 2v4M8 2v4M3 10h18" />
      <Path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeWidth="2.5" />
    </Svg>
  );
}

function CompassIcon({ size = 20, color = '#059669' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} fillOpacity="0.25" />
    </Svg>
  );
}

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

const TARGET_OPTIONS = [
  {
    id: '1month',
    label: 'In 1 month',
    sublabel: 'Fast sprint • 30 days',
    days: 30,
    icon: ZapIcon,
    accentColor: '#D97706',
    iconBg: '#FEF3C7',
  },
  {
    id: '3months',
    label: 'In 3 months',
    sublabel: 'Balanced pace • 90 days',
    badge: 'Recommended',
    days: 90,
    icon: CalendarIcon,
    accentColor: '#1200C6',
    iconBg: '#EEF2FF',
  },
  {
    id: '6months',
    label: 'In 6 months',
    sublabel: 'Deep mastery • 180 days',
    days: 180,
    icon: CompassIcon,
    accentColor: '#059669',
    iconBg: '#ECFDF5',
  },
  {
    id: 'year',
    label: 'In a year',
    sublabel: 'Comprehensive • 365 days',
    days: 365,
    icon: TrophyIcon,
    accentColor: '#7C3AED',
    iconBg: '#F5F3FF',
  },
];

export default function OnboardingTargetScreen({ onContinue, onBack, initialValue = 'In 3 months' }) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const [selectedTarget, setSelectedTarget] = useState(initialValue);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 550,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

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
                      outputRange: [16, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Header Question Block */}
            <View style={styles.headerBlock}>
              <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>when is your target?</Text>
            </View>

            {/* Premium Options List */}
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
                        backgroundColor: isSelected ? theme.cardSelected : theme.card,
                        borderColor: isSelected ? theme.cardSelectedBorder : theme.border,
                      },
                    ]}
                    onPress={() => setSelectedTarget(item.label)}
                    activeOpacity={0.82}
                  >
                    <View style={styles.leftContentRow}>
                      {/* Premium Tinted Icon Squircle */}
                      <View
                        style={[
                          styles.iconBox,
                          { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : item.iconBg },
                          isSelected && styles.iconBoxSelected,
                        ]}
                      >
                        <IconComp
                          size={20}
                          color={item.accentColor}
                        />
                      </View>

                      {/* Text & Meta Information */}
                      <View style={styles.labelContainer}>
                        <View style={styles.titleRow}>
                          <Text
                            style={[
                              styles.optionText,
                              { color: isSelected ? theme.accent : theme.textPrimary },
                              isSelected && styles.optionTextSelected,
                            ]}
                          >
                            {item.label}
                          </Text>
                          {item.badge && (
                            <View style={[styles.badgePill, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#EEF2FF', borderColor: theme.accent }]}>
                              <Text style={[styles.badgeText, { color: theme.accent }]}>{item.badge}</Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.sublabel, { color: theme.textSecondary }]}>{item.sublabel}</Text>
                      </View>
                    </View>

                    {/* High Precision Radio Indicator */}
                    <View
                      style={[
                        styles.radioCircle,
                        { borderColor: isSelected ? theme.accent : theme.border, backgroundColor: 'transparent' },
                      ]}
                    >
                      {isSelected && <View style={[styles.radioInnerDot, { backgroundColor: theme.accent }]} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Bottom Continue Button */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedTarget ? styles.continueButtonActive : styles.continueButtonInactive,
            ]}
            onPress={handleNext}
            activeOpacity={0.85}
            disabled={!selectedTarget}
          >
            <View style={styles.buttonContentRow}>
              <Text style={styles.continueButtonText}>continue</Text>
              <Text style={styles.arrowIcon}>➔</Text>
            </View>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  headerBlock: {
    marginBottom: 28,
    marginTop: 8,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  optionsList: {
    gap: 14,
  },
  optionCard: {
    minHeight: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  optionCardSelected: {
    backgroundColor: '#F8F9FE',
    borderColor: '#1200C6',
    shadowColor: '#1200C6',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  leftContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    transform: [{ scale: 1.04 }],
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  optionTextSelected: {
    color: '#1200C6',
  },
  badgePill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1200C6',
    letterSpacing: 0.2,
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
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginLeft: 8,
  },
  radioCircleSelected: {
    borderColor: '#1200C6',
    backgroundColor: '#FFFFFF',
  },
  radioInnerDot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#1200C6',
  },
  footerContainer: {
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
  },
  continueButton: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#1200C6',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
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
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  arrowIcon: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
