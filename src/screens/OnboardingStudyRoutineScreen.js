import React, { useState, useRef } from 'react';
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
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', hours: '(6am – 12pm)' },
  { id: 'afternoon', label: 'Afternoon', hours: '(12pm – 5pm)' },
  { id: 'evening', label: 'Evening', hours: '(5pm – 10pm)' },
  { id: 'night', label: 'Night', hours: '(10pm – 12am)' },
];

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const NORMALIZE_DAY_MAP = {
  mon: 'Mon',
  monday: 'Mon',
  tue: 'Tue',
  tuesday: 'Tue',
  wed: 'Wed',
  wednesday: 'Wed',
  thu: 'Thu',
  thursday: 'Thu',
  fri: 'Fri',
  friday: 'Fri',
  sat: 'Sat',
  saturday: 'Sat',
  sun: 'Sun',
  sunday: 'Sun',
};

function normalizeDaysList(days) {
  if (!Array.isArray(days) || days.length === 0) return DEFAULT_DAYS;
  const mapped = days
    .map((d) => (typeof d === 'string' ? NORMALIZE_DAY_MAP[d.trim().toLowerCase()] || d : null))
    .filter(Boolean);
  return mapped.length > 0 ? mapped : DEFAULT_DAYS;
}

export default function OnboardingStudyRoutineScreen({
  onContinue,
  onBack,
  initialTime = 'night',
  initialDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const [selectedTime, setSelectedTime] = useState(initialTime || 'night');
  const [selectedDays, setSelectedDays] = useState(() => normalizeDaysList(initialDays));

  const [btnScale] = useState(new Animated.Value(1));

  const toggleDay = (day) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        if (prev.length === 1) return prev; // Keep at least one day selected
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

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

  const handleContinue = () => {
    if (onContinue) {
      onContinue({
        availableTime: selectedTime,
        studyDays: selectedDays,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Header Block */}
          <View style={styles.headerBlock}>
            <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
              Your study routine
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              When do you usually study? Tell us your available time and preferred study days.
            </Text>
          </View>

          {/* Available Study Time Section */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Available study time
            </Text>

            <View style={styles.timeGrid}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot.id;
                return (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.timeCard,
                      {
                        backgroundColor: isSelected
                          ? isDark
                            ? 'rgba(37, 99, 235, 0.18)'
                            : '#F0F6FF'
                          : isDark
                          ? 'rgba(255, 255, 255, 0.03)'
                          : '#FFFFFF',
                        borderColor: isSelected
                          ? '#3B82F6'
                          : isDark
                          ? 'rgba(255, 255, 255, 0.09)'
                          : '#E2E8F0',
                      },
                      isSelected && styles.timeCardSelected,
                    ]}
                    onPress={() => setSelectedTime(slot.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.timeLabel,
                        {
                          color: isSelected
                            ? isDark
                              ? '#60A5FA'
                              : '#1D4ED8'
                            : theme.textPrimary,
                        },
                      ]}
                    >
                      {slot.label}
                    </Text>
                    <Text
                      style={[
                        styles.timeHours,
                        {
                          color: isSelected
                            ? isDark
                              ? '#93C5FD'
                              : '#2563EB'
                            : theme.textMuted,
                        },
                      ]}
                    >
                      {slot.hours}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Study Days Section */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Study days
            </Text>

            <View style={styles.daysRow}>
              {ALL_DAYS.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayPill,
                      isSelected
                        ? styles.dayPillSelected
                        : [
                            styles.dayPillUnselected,
                            {
                              backgroundColor: isDark
                                ? 'rgba(255, 255, 255, 0.04)'
                                : '#F8FAFC',
                              borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.09)'
                                : '#E2E8F0',
                            },
                          ],
                    ]}
                    onPress={() => toggleDay(day)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.dayPillText,
                        isSelected
                          ? styles.dayPillTextSelected
                          : [styles.dayPillTextUnselected, { color: theme.textPrimary }],
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Primary Button */}
        <View style={styles.footerContainer}>
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
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
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerBlock: {
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 6,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0A1838',
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 21,
    letterSpacing: -0.15,
  },
  sectionBlock: {
    marginTop: 26,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  timeCard: {
    width: '48.2%',
    height: 72,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  timeCardSelected: {
    borderWidth: 1.8,
    borderColor: '#3B82F6',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  timeLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  timeHours: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: -0.1,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  dayPill: {
    width: 54,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillSelected: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.32,
    shadowRadius: 6,
    elevation: 3,
  },
  dayPillUnselected: {
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  dayPillText: {
    fontSize: 13.5,
    letterSpacing: -0.2,
  },
  dayPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayPillTextUnselected: {
    fontWeight: '600',
  },
  footerContainer: {
    paddingVertical: Platform.OS === 'ios' ? 12 : 16,
  },
  continueButton: {
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
