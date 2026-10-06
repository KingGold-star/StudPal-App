import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

const DAYS_DATA = [
  { id: 'mon', letter: 'M', name: 'Monday' },
  { id: 'tue', letter: 'T', name: 'Tuesday' },
  { id: 'wed', letter: 'W', name: 'Wednesday' },
  { id: 'thu', letter: 'T', name: 'Thursday' },
  { id: 'fri', letter: 'F', name: 'Friday' },
  { id: 'sat', letter: 'S', name: 'Saturday' },
  { id: 'sun', letter: 'S', name: 'Sunday' },
];

export default function OnboardingStudyDaysScreen({
  onContinue,
  onBack,
  initialDays = ['mon', 'wed', 'fri', 'sat'],
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const [selectedDays, setSelectedDays] = useState(
    Array.isArray(initialDays) && initialDays.length > 0
      ? initialDays
      : ['mon', 'wed', 'fri', 'sat']
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

  const toggleDay = (dayId) => {
    setSelectedDays((prev) => {
      if (prev.includes(dayId)) {
        return prev.filter((d) => d !== dayId);
      } else {
        return [...prev, dayId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedDays.length >= 4 && onContinue) {
      onContinue(selectedDays);
    }
  };

  const isReady = selectedDays.length >= 4;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        {/* Main Content Area */}
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          {/* Header section */}
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>which days can you study?</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>pick at least four</Text>
          </View>

          {/* Centered Days Row */}
          <View style={styles.daysContainer}>
            <View style={styles.daysRow}>
              {DAYS_DATA.map((day) => {
                const isSelected = selectedDays.includes(day.id);
                return (
                  <TouchableOpacity
                    key={day.id}
                    style={styles.dayItem}
                    activeOpacity={0.8}
                    onPress={() => toggleDay(day.id)}
                  >
                    <View
                      style={[
                        styles.dayCircle,
                        {
                          backgroundColor: isSelected ? theme.accent : theme.card,
                          borderColor: isSelected ? theme.accent : theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLetter,
                          { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                          isSelected && styles.dayLetterSelected,
                        ]}
                      >
                        {day.letter}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.dayName,
                        { color: isSelected ? theme.textPrimary : theme.textMuted },
                        isSelected && styles.dayNameSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {day.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* Bottom Continue Button (Blue when >= 4 selected, otherwise grayed out) */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              isReady ? styles.continueButtonActive : styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isReady}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.continueButtonText,
                !isReady && styles.continueButtonTextDisabled,
              ]}
            >
              continue ➔
            </Text>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 36,
  },
  headerSection: {
    marginBottom: 44,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    fontWeight: '400',
  },
  daysContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  dayItem: {
    alignItems: 'center',
    flex: 1,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  dayCircleSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  dayLetter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  dayLetterSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayName: {
    fontSize: 8.5,
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
  },
  dayNameSelected: {
    color: '#1E293B',
    fontWeight: '600',
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  continueButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  continueButtonTextDisabled: {
    color: '#94A3B8',
  },
});
