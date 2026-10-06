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

const CONFIDENCE_OPTIONS = [
  'I struggle with it',
  'I understand the basics',
  'I’m getting there',
  'I’m confident',
  'I’m very confident',
];

export default function OnboardingConfidenceScreen({
  onContinue,
  onBack,
  subject = 'your subjects',
  initialConfidence = 'I understand the basics',
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const [selectedConfidence, setSelectedConfidence] = useState(
    initialConfidence || 'I understand the basics'
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

  const handleSelectOption = (option) => {
    setSelectedConfidence(option);
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
              How confident are you in {subject}?
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Be honest. This helps StudPal know where to start.
            </Text>
          </View>

          {/* Confidence Options List */}
          <View style={styles.optionsList}>
            {CONFIDENCE_OPTIONS.map((option) => {
              const isSelected = selectedConfidence === option;
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
                  onPress={() => handleSelectOption(option)}
                >
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
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#334155',
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
    alignItems: 'center',
    justifyContent: 'center',
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
