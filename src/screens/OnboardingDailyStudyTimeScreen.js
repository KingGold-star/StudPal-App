import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

const DAILY_TIME_OPTIONS = [
  '15–30 min',
  '30–60 min',
  '1–2 hours',
  '2–3 hours',
  '3+ hours',
];

export default function OnboardingDailyStudyTimeScreen({
  onContinue,
  onBack,
  initialTime = '1–2 hours',
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const [selectedTime, setSelectedTime] = useState(
    initialTime || '1–2 hours'
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

  const handleSelect = (option) => {
    setSelectedTime(option);
    setTimeout(() => {
      if (onContinue) {
        onContinue(option);
      }
    }, 120);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          {/* Header section */}
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              “how much time can you realistically study each day?”
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Let's build around your real life — not an ideal routine.
            </Text>
          </View>

          {/* Options List */}
          <View style={styles.optionsList}>
            {DAILY_TIME_OPTIONS.map((option) => {
              const isSelected = selectedTime === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isSelected ? theme.accent : theme.card,
                      borderColor: isSelected ? theme.accent : theme.border,
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleSelect(option)}
                >
                  {/* Radio circle indicator */}
                  <View
                    style={[
                      styles.radioCircle,
                      { borderColor: isSelected ? '#FFFFFF' : theme.border },
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInnerDot} />}
                  </View>

                  <Text
                    style={[
                      styles.optionText,
                      { color: isSelected ? '#FFFFFF' : theme.textPrimary },
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Bottom-right 'pick to continue ➔' indicator */}
        <View style={styles.footerContainer}>
          <View style={styles.continueButton}>
            <Text style={[styles.continueText, { color: theme.textPrimary }]}>pick to continue ➔</Text>
          </View>
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
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 36,
  },
  headerSection: {
    marginBottom: 36,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    fontWeight: '400',
  },
  optionsList: {
    gap: 14,
  },
  optionCard: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  optionCardSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioCircleSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  radioInnerDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footerContainer: {
    alignItems: 'flex-end',
    paddingBottom: 8,
    paddingRight: 4,
  },
  continueButton: {
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  continueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: 0.2,
    opacity: 0.9,
  },
});
