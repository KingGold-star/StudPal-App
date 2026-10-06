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

const TIME_OF_DAY_OPTIONS = [
  'dawn',
  'morning',
  'afternoon',
  'evening',
  'late night',
];

export default function OnboardingStudyTimeOfDayScreen({
  onContinue,
  onBack,
  initialTimeOfDay = 'afternoon',
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState(
    initialTimeOfDay || 'afternoon'
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

  const handleSelect = (timeOfDay) => {
    setSelectedTimeOfDay(timeOfDay);
    setTimeout(() => {
      if (onContinue) {
        onContinue(timeOfDay);
      }
    }, 120);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        {/* Main Content Area */}
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          {/* Header section */}
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              When do you usually study best?
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Help us personalize your study sessions.
            </Text>
          </View>

          {/* Time of Day Options List */}
          <View style={styles.optionsList}>
            {TIME_OF_DAY_OPTIONS.map((timeOfDay) => {
              const isSelected = selectedTimeOfDay === timeOfDay;
              return (
                <TouchableOpacity
                  key={timeOfDay}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isSelected ? theme.accent : theme.card,
                      borderColor: isSelected ? theme.accent : theme.border,
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleSelect(timeOfDay)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: isSelected ? '#FFFFFF' : theme.textPrimary },
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {timeOfDay}
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
    marginBottom: 32,
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
  optionsList: {
    gap: 12,
  },
  optionCard: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCardSelected: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
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
